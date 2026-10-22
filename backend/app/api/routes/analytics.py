from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import (
    Vehicle, EngineTelemetry, FuelTelemetry, ElectricalTelemetry,
    MaintenanceRecord, DiagnosticAlert
)
from app.services.engine.calculator import summarize_engine_readings
from app.services.fuel.calculator import summarize_fuel_readings
from app.services.electrical.evaluator import evaluate_electrical_readings
from app.services.health.scorer import calculate_vehicle_health_score

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/{vehicle_id}/health")
def get_health_score(vehicle_id: int, db: Session = Depends(get_db)):
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
        {"rule_code": r.rule_code, "severity": r.severity, "status": r.status}
        for r in db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id).all()
    ]
    fuel_records = [
        {"mileage_kmpl": r.mileage_kmpl}
        for r in db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).all()
    ]
    avg_mileage = (sum(r["mileage_kmpl"] for r in fuel_records) / len(fuel_records)) if fuel_records else 14.5
    
    score_data = calculate_vehicle_health_score(
        engine_readings, electrical_readings, maintenance_records, alerts, avg_mileage
    )
    score_data["vehicle_id"] = vehicle_id
    return score_data

@router.get("/{vehicle_id}/engine")
def get_engine_analytics(vehicle_id: int, db: Session = Depends(get_db)):
    records = db.query(EngineTelemetry).filter(EngineTelemetry.vehicle_id == vehicle_id).order_by(EngineTelemetry.timestamp.asc()).all()
    dicts = [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "rpm": r.rpm,
            "torque_nm": r.torque_nm,
            "horsepower": r.horsepower,
            "engine_temp_c": r.engine_temp_c,
            "coolant_temp_c": r.coolant_temp_c,
            "engine_load_pct": r.engine_load_pct,
            "throttle_pos_pct": r.throttle_pos_pct,
            "speed_kmph": r.speed_kmph
        }
        for r in records
    ]
    summary = summarize_engine_readings(dicts)
    summary["vehicle_id"] = vehicle_id
    return summary

@router.get("/{vehicle_id}/fuel")
def get_fuel_analytics(vehicle_id: int, db: Session = Depends(get_db)):
    records = db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).order_by(FuelTelemetry.timestamp.asc()).all()
    dicts = [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "fuel_rate_lph": r.fuel_rate_lph,
            "speed_kmph": r.speed_kmph,
            "fuel_level_pct": r.fuel_level_pct,
            "fuel_consumed_liters": r.fuel_consumed_liters,
            "distance_km": r.distance_km,
            "mileage_kmpl": r.mileage_kmpl,
            "throttle_pos_pct": r.throttle_pos_pct,
            "engine_load_pct": r.engine_load_pct
        }
        for r in records
    ]
    summary = summarize_fuel_readings(dicts)
    summary["vehicle_id"] = vehicle_id
    return summary

@router.get("/{vehicle_id}/electrical")
def get_electrical_analytics(vehicle_id: int, db: Session = Depends(get_db)):
    records = db.query(ElectricalTelemetry).filter(ElectricalTelemetry.vehicle_id == vehicle_id).order_by(ElectricalTelemetry.timestamp.asc()).all()
    dicts = [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "battery_voltage": r.battery_voltage,
            "alternator_voltage": r.alternator_voltage,
            "current_draw_amps": r.current_draw_amps,
            "battery_soc_pct": r.battery_soc_pct,
            "charging_status": r.charging_status
        }
        for r in records
    ]
    summary = evaluate_electrical_readings(dicts)
    summary["vehicle_id"] = vehicle_id
    return summary
