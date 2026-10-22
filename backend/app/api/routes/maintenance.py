from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import MaintenanceRecord, Vehicle
from app.schemas.schemas import MaintenanceCreate, MaintenanceResponse
from app.services.maintenance.scheduler import check_maintenance_schedule

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("/{vehicle_id}", response_model=List[MaintenanceResponse])
def get_maintenance_records(vehicle_id: int, db: Session = Depends(get_db)):
    return db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).order_by(MaintenanceRecord.service_date.desc()).all()

@router.get("/{vehicle_id}/schedule")
def get_maintenance_schedule(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    records = [
        {"service_name": r.service_name, "odometer_km": r.odometer_km, "service_date": r.service_date, "status": r.status}
        for r in db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).all()
    ]
    return check_maintenance_schedule(vehicle.odometer_km, records)

@router.post("/{vehicle_id}", response_model=MaintenanceResponse)
def add_maintenance_record(vehicle_id: int, rec_in: MaintenanceCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    record = MaintenanceRecord(
        vehicle_id=vehicle_id,
        service_name=rec_in.service_name,
        service_type=rec_in.service_type,
        service_date=rec_in.service_date or datetime.now(timezone.utc),
        odometer_km=rec_in.odometer_km,
        cost=rec_in.cost,
        status=rec_in.status,
        notes=rec_in.notes,
        interval_km=rec_in.interval_km or 10000.0,
        interval_days=rec_in.interval_days or 180
    )
    db.add(record)
    # Update vehicle odometer if record is higher
    if rec_in.odometer_km > vehicle.odometer_km:
        vehicle.odometer_km = rec_in.odometer_km
        
    db.commit()
    db.refresh(record)
    return record

@router.put("/{vehicle_id}/{record_id}", response_model=MaintenanceResponse)
def update_maintenance_record(vehicle_id: int, record_id: int, rec_in: MaintenanceCreate, db: Session = Depends(get_db)):
    record = db.query(MaintenanceRecord).filter(MaintenanceRecord.id == record_id, MaintenanceRecord.vehicle_id == vehicle_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
    record.service_name = rec_in.service_name
    record.service_type = rec_in.service_type
    if rec_in.service_date:
        record.service_date = rec_in.service_date
    record.odometer_km = rec_in.odometer_km
    record.cost = rec_in.cost
    record.status = rec_in.status
    record.notes = rec_in.notes
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{vehicle_id}/{record_id}")
def delete_maintenance_record(vehicle_id: int, record_id: int, db: Session = Depends(get_db)):
    record = db.query(MaintenanceRecord).filter(MaintenanceRecord.id == record_id, MaintenanceRecord.vehicle_id == vehicle_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
    db.delete(record)
    db.commit()
    return {"message": "Maintenance record deleted."}
