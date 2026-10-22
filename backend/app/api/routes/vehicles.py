from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Vehicle, User
from app.schemas.schemas import VehicleCreate, VehicleUpdate, VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # If mechanic, show all fleet; if owner, show owner vehicles
    if current_user and current_user.role == "mechanic":
        return db.query(Vehicle).order_by(Vehicle.id.asc()).all()
    if current_user:
        return db.query(Vehicle).filter(Vehicle.user_id == current_user.id).order_by(Vehicle.id.asc()).all()
    return db.query(Vehicle).all()

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Vehicle).filter(Vehicle.registration_number == vehicle_in.registration_number.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle with this registration number already exists.")
        
    user_id = current_user.id if current_user else 1
    vehicle = Vehicle(
        user_id=user_id,
        registration_number=vehicle_in.registration_number.upper().strip(),
        manufacturer=vehicle_in.manufacturer.strip(),
        model=vehicle_in.model.strip(),
        year=vehicle_in.year,
        fuel_type=vehicle_in.fuel_type.lower().strip(),
        engine_capacity_cc=vehicle_in.engine_capacity_cc,
        transmission=vehicle_in.transmission.lower().strip(),
        odometer_km=vehicle_in.odometer_km,
        vin=vehicle_in.vin,
        nickname=vehicle_in.nickname
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    return vehicle

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle_in: VehicleUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    for field, value in vehicle_in.dict(exclude_unset=True).items():
        setattr(vehicle, field, value)
        
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully."}
