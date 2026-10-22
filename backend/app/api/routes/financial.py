from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import FinancialRecord, Vehicle
from app.schemas.schemas import FinancialCreate, FinancialResponse
from app.services.financial.calculator import summarize_financials

router = APIRouter(prefix="/financial", tags=["Financial Analytics"])

@router.get("/{vehicle_id}")
def get_financial_summary(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    records = db.query(FinancialRecord).filter(FinancialRecord.vehicle_id == vehicle_id).order_by(FinancialRecord.date.desc()).all()
    dicts = [
        {
            "id": r.id,
            "expense_type": r.expense_type,
            "amount": r.amount,
            "date": r.date.isoformat() if r.date else "",
            "description": r.description,
            "odometer_km": r.odometer_km
        }
        for r in records
    ]
    summary = summarize_financials(dicts, vehicle.odometer_km)
    summary["records"] = dicts
    return summary

@router.post("/{vehicle_id}", response_model=FinancialResponse)
def add_expense(vehicle_id: int, exp_in: FinancialCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    rec = FinancialRecord(
        vehicle_id=vehicle_id,
        expense_type=exp_in.expense_type.lower(),
        amount=exp_in.amount,
        date=exp_in.date or datetime.now(timezone.utc),
        description=exp_in.description,
        odometer_km=exp_in.odometer_km or vehicle.odometer_km
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.delete("/{vehicle_id}/{record_id}")
def delete_expense(vehicle_id: int, record_id: int, db: Session = Depends(get_db)):
    rec = db.query(FinancialRecord).filter(FinancialRecord.id == record_id, FinancialRecord.vehicle_id == vehicle_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Expense record not found.")
    db.delete(rec)
    db.commit()
    return {"message": "Expense record deleted successfully."}
