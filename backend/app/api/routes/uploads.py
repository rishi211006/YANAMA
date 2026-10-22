from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import (
    Vehicle, EngineTelemetry, FuelTelemetry, ElectricalTelemetry,
    MaintenanceRecord, DiagnosticAlert, UploadRecord
)
from app.services.csv_processing.parser import parse_csv_file
from app.services.diagnostics.rules_engine import evaluate_diagnostics

router = APIRouter(prefix="/uploads", tags=["CSV Uploads"])

@router.post("/{vehicle_id}/csv")
async def upload_vehicle_csv(
    vehicle_id: int,
    file_type: str = Form(...),  # engine, fuel, electrical, maintenance, diagnostic
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    content_bytes = await file.read()
    if not content_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    parsed_rows, valid_count, invalid_count, msg = parse_csv_file(content_bytes, file_type.lower())
    
    if valid_count == 0:
        raise HTTPException(status_code=400, detail=f"No valid rows found: {msg}")
        
    # Insert records into relevant DB table
    if file_type == "engine":
        for r in parsed_rows:
            ts = datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00")) if isinstance(r["timestamp"], str) else r["timestamp"]
            db.add(EngineTelemetry(
                vehicle_id=vehicle_id,
                timestamp=ts,
                rpm=r["rpm"],
                torque_nm=r["torque_nm"],
                horsepower=r["horsepower"],
                engine_temp_c=r["engine_temp_c"],
                coolant_temp_c=r["coolant_temp_c"],
                engine_load_pct=r["engine_load_pct"],
                throttle_pos_pct=r["throttle_pos_pct"],
                speed_kmph=r["speed_kmph"]
            ))
            
    elif file_type == "fuel":
        for r in parsed_rows:
            ts = datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00")) if isinstance(r["timestamp"], str) else r["timestamp"]
            db.add(FuelTelemetry(
                vehicle_id=vehicle_id,
                timestamp=ts,
                fuel_rate_lph=r["fuel_rate_lph"],
                speed_kmph=r["speed_kmph"],
                fuel_level_pct=r["fuel_level_pct"],
                fuel_consumed_liters=r["fuel_consumed_liters"],
                distance_km=r["distance_km"],
                mileage_kmpl=r["mileage_kmpl"],
                throttle_pos_pct=r["throttle_pos_pct"],
                engine_load_pct=r["engine_load_pct"]
            ))
            
    elif file_type == "electrical":
        for r in parsed_rows:
            ts = datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00")) if isinstance(r["timestamp"], str) else r["timestamp"]
            db.add(ElectricalTelemetry(
                vehicle_id=vehicle_id,
                timestamp=ts,
                battery_voltage=r["battery_voltage"],
                alternator_voltage=r["alternator_voltage"],
                current_draw_amps=r["current_draw_amps"],
                battery_soc_pct=r["battery_soc_pct"],
                charging_status=r["charging_status"]
            ))
            
    elif file_type == "maintenance":
        for r in parsed_rows:
            ts = datetime.fromisoformat(r["service_date"].replace("Z", "+00:00")) if isinstance(r["service_date"], str) else r["service_date"]
            db.add(MaintenanceRecord(
                vehicle_id=vehicle_id,
                service_name=r["service_name"],
                service_type=r["service_type"],
                service_date=ts,
                odometer_km=r["odometer_km"],
                cost=r["cost"],
                status=r["status"],
                notes=r["notes"],
                interval_km=r["interval_km"],
                interval_days=r["interval_days"]
            ))
            
    elif file_type == "diagnostic":
        for r in parsed_rows:
            ts = datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00")) if isinstance(r["timestamp"], str) else r["timestamp"]
            db.add(DiagnosticAlert(
                vehicle_id=vehicle_id,
                rule_code=r["rule_code"],
                component=r["component"],
                severity=r["severity"],
                title=r["title"],
                message_owner=r["message_owner"],
                message_mechanic=r["message_mechanic"],
                trigger_value=r["trigger_value"],
                threshold_value=r["threshold_value"],
                timestamp=ts,
                status=r["status"]
            ))
            
    # Record upload metadata
    upload_rec = UploadRecord(
        vehicle_id=vehicle_id,
        file_name=file.filename or f"upload_{file_type}.csv",
        file_type=file_type,
        rows_count=valid_count + invalid_count,
        valid_rows=valid_count,
        invalid_rows=invalid_count,
        status="completed"
    )
    db.add(upload_rec)
    db.commit()
    
    # Auto-evaluate diagnostics if engine or electrical
    if file_type in ["engine", "electrical"]:
        new_alerts = evaluate_diagnostics(
            parsed_rows if file_type == "engine" else [],
            parsed_rows if file_type == "electrical" else []
        )
        for a in new_alerts:
            # Check if active alert already exists
            existing = db.query(DiagnosticAlert).filter(
                DiagnosticAlert.vehicle_id == vehicle_id,
                DiagnosticAlert.rule_code == a["rule_code"],
                DiagnosticAlert.status == "active"
            ).first()
            if not existing:
                db.add(DiagnosticAlert(
                    vehicle_id=vehicle_id,
                    rule_code=a["rule_code"],
                    component=a["component"],
                    severity=a["severity"],
                    title=a["title"],
                    message_owner=a["message_owner"],
                    message_mechanic=a["message_mechanic"],
                    trigger_value=a["trigger_value"],
                    threshold_value=a["threshold_value"],
                    timestamp=datetime.now(timezone.utc),
                    status="active"
                ))
        db.commit()
        
    return {
        "success": True,
        "file_type": file_type,
        "valid_rows": valid_count,
        "invalid_rows": invalid_count,
        "message": f"Successfully parsed and ingested {valid_count} telemetry records."
    }

@router.get("/{vehicle_id}/history")
def get_upload_history(vehicle_id: int, db: Session = Depends(get_db)):
    return db.query(UploadRecord).filter(UploadRecord.vehicle_id == vehicle_id).order_by(UploadRecord.uploaded_at.desc()).all()
