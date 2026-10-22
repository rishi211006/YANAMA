from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import (
    Vehicle, EngineTelemetry, FuelTelemetry, ElectricalTelemetry,
    MaintenanceRecord, DiagnosticAlert
)
from app.schemas.schemas import (
    StatisticalEngineResponse, TripSimulationRequest, TripSimulationResponse,
    MileageAnalyticsResponse
)
from app.services.advanced.statistical_engine import compute_metric_statistics
from app.services.advanced.trip_simulator import simulate_trip
from app.services.advanced.mileage_analyzer import analyze_mileage_performance
from app.services.health.scorer import calculate_vehicle_health_score

router = APIRouter(prefix="/analytics", tags=["Advanced Analytics"])

@router.get("/{vehicle_id}/engine/statistical", response_model=StatisticalEngineResponse)
def get_statistical_engine_analysis(
    vehicle_id: int,
    metric: str = Query("rpm", description="Metric to analyze: rpm, torque_nm, horsepower, coolant_temp_c, engine_temp_c, engine_load_pct, speed_kmph"),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    records = db.query(EngineTelemetry).filter(EngineTelemetry.vehicle_id == vehicle_id).order_by(EngineTelemetry.timestamp.asc()).all()
    dicts = [
        {
            "rpm": r.rpm,
            "torque_nm": r.torque_nm,
            "horsepower": r.horsepower,
            "coolant_temp_c": r.coolant_temp_c,
            "engine_temp_c": r.engine_temp_c,
            "engine_load_pct": r.engine_load_pct,
            "speed_kmph": r.speed_kmph
        }
        for r in records
    ]
    
    result = compute_metric_statistics(dicts, metric_key=metric.lower())
    result["vehicle_id"] = vehicle_id
    return result

@router.post("/{vehicle_id}/trip/simulate", response_model=TripSimulationResponse)
def simulate_vehicle_trip(
    vehicle_id: int,
    req: TripSimulationRequest,
    db: Session = Depends(get_db)
):
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
        {"rule_code": r.rule_code, "severity": r.severity, "title": r.title, "status": r.status}
        for r in db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id).all()
    ]
    fuel_records = [
        {"mileage_kmpl": r.mileage_kmpl}
        for r in db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).all()
    ]
    avg_mileage = (sum(r["mileage_kmpl"] for r in fuel_records) / len(fuel_records)) if fuel_records else 14.5
    
    health_data = calculate_vehicle_health_score(
        engine_readings, electrical_readings, maintenance_records, alerts, avg_mileage
    )
    
    simulation = simulate_trip(
        trip_distance_km=req.trip_distance_km,
        terrain_type=req.terrain_type,
        load_condition=req.load_condition,
        duration_days=req.duration_days,
        current_health_score=health_data["overall_score"],
        maintenance_records=maintenance_records,
        diagnostic_alerts=alerts,
        avg_mileage=avg_mileage,
        fuel_type=vehicle.fuel_type
    )
    simulation["vehicle_id"] = vehicle_id
    return simulation

@router.get("/{vehicle_id}/mileage/analysis", response_model=MileageAnalyticsResponse)
def get_mileage_analysis(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    fuel_records = [
        {
            "timestamp": r.timestamp.strftime("%d %b %H:%M"),
            "mileage_kmpl": r.mileage_kmpl,
            "speed_kmph": r.speed_kmph,
            "fuel_rate_lph": r.fuel_rate_lph
        }
        for r in db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).order_by(FuelTelemetry.timestamp.asc()).all()
    ]
    engine_readings = [
        {"coolant_temp_c": r.coolant_temp_c, "throttle_pos_pct": r.throttle_pos_pct}
        for r in db.query(EngineTelemetry).filter(EngineTelemetry.vehicle_id == vehicle_id).all()
    ]
    maintenance_records = [
        {"service_name": r.service_name, "status": r.status}
        for r in db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).all()
    ]
    
    result = analyze_mileage_performance(
        fuel_readings=fuel_records,
        engine_readings=engine_readings,
        maintenance_records=maintenance_records,
        fuel_type=vehicle.fuel_type
    )
    result["vehicle_id"] = vehicle_id
    return result
