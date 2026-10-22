from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import (
    Vehicle, EngineTelemetry, ElectricalTelemetry, MaintenanceRecord,
    DiagnosticAlert, Recommendation, FuelTelemetry, ReportRecord
)
from app.services.health.scorer import calculate_vehicle_health_score
from app.reports.pdf_generator import generate_vehicle_pdf_report
from app.reports.csv_exporter import export_telemetry_csv

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{vehicle_id}/pdf")
def download_pdf_report(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    engine_readings = [
        {"coolant_temp_c": r.coolant_temp_c, "rpm": r.rpm, "engine_temp_c": r.engine_temp_c}
        for r in db.query(EngineTelemetry).filter(EngineTelemetry.vehicle_id == vehicle_id).all()
    ]
    electrical_readings = [
        {"battery_voltage": r.battery_voltage, "alternator_voltage": r.alternator_voltage}
        for r in db.query(ElectricalTelemetry).filter(ElectricalTelemetry.vehicle_id == vehicle_id).all()
    ]
    maintenance_records = [
        {"service_name": r.service_name, "status": r.status, "odometer_km": r.odometer_km}
        for r in db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).all()
    ]
    alerts = [
        {"rule_code": r.rule_code, "severity": r.severity, "title": r.title, "message_owner": r.message_owner, "message_mechanic": r.message_mechanic, "status": r.status}
        for r in db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id).all()
    ]
    recs = [
        {"priority": r.priority, "category": r.category, "title": r.title, "action_needed": r.action_needed, "estimated_savings": r.estimated_savings}
        for r in db.query(Recommendation).filter(Recommendation.vehicle_id == vehicle_id).all()
    ]
    fuel_records = db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).all()
    avg_mileage = (sum(r.mileage_kmpl for r in fuel_records) / len(fuel_records)) if fuel_records else 14.5
    
    health_data = calculate_vehicle_health_score(
        engine_readings, electrical_readings, maintenance_records, alerts, avg_mileage
    )
    
    pdf_path = generate_vehicle_pdf_report(
        vehicle=vehicle,
        health=health_data,
        alerts=alerts,
        recommendations=recs,
        maintenance=maintenance_records
    )
    
    file_size_kb = round(Path(pdf_path).stat().st_size / 1024.0, 1)
    db.add(ReportRecord(
        vehicle_id=vehicle_id,
        report_type="pdf",
        title=f"Health Audit Report ({vehicle.registration_number})",
        file_path=pdf_path,
        file_size_kb=file_size_kb
    ))
    db.commit()
    
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=Path(pdf_path).name
    )

@router.get("/{vehicle_id}/csv/{telemetry_type}")
def download_csv_export(vehicle_id: int, telemetry_type: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    records = []
    t_type = telemetry_type.lower()
    if t_type == "engine":
        records = [
            {"timestamp": r.timestamp.isoformat(), "rpm": r.rpm, "torque_nm": r.torque_nm, "horsepower": r.horsepower, "engine_temp_c": r.engine_temp_c, "coolant_temp_c": r.coolant_temp_c, "engine_load_pct": r.engine_load_pct, "speed_kmph": r.speed_kmph}
            for r in db.query(EngineTelemetry).filter(EngineTelemetry.vehicle_id == vehicle_id).all()
        ]
    elif t_type == "fuel":
        records = [
            {"timestamp": r.timestamp.isoformat(), "fuel_rate_lph": r.fuel_rate_lph, "speed_kmph": r.speed_kmph, "fuel_level_pct": r.fuel_level_pct, "mileage_kmpl": r.mileage_kmpl}
            for r in db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).all()
        ]
    elif t_type == "electrical":
        records = [
            {"timestamp": r.timestamp.isoformat(), "battery_voltage": r.battery_voltage, "alternator_voltage": r.alternator_voltage, "current_draw_amps": r.current_draw_amps, "battery_soc_pct": r.battery_soc_pct}
            for r in db.query(ElectricalTelemetry).filter(ElectricalTelemetry.vehicle_id == vehicle_id).all()
        ]
    elif t_type == "maintenance":
        records = [
            {"service_name": r.service_name, "service_type": r.service_type, "odometer_km": r.odometer_km, "cost": r.cost, "status": r.status, "notes": r.notes}
            for r in db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).all()
        ]
    elif t_type == "diagnostic":
        records = [
            {"rule_code": r.rule_code, "component": r.component, "severity": r.severity, "title": r.title, "trigger_value": r.trigger_value, "status": r.status}
            for r in db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id).all()
        ]
        
    csv_path = export_telemetry_csv(vehicle.registration_number, t_type, records)
    return FileResponse(
        path=csv_path,
        media_type="text/csv",
        filename=Path(csv_path).name
    )

@router.get("/{vehicle_id}/history")
def get_report_history(vehicle_id: int, db: Session = Depends(get_db)):
    return db.query(ReportRecord).filter(ReportRecord.vehicle_id == vehicle_id).order_by(ReportRecord.generated_at.desc()).all()
