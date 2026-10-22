from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import DiagnosticAlert
from app.schemas.schemas import AlertResponse
from app.services.diagnostics.rules_engine import RULES_CATALOG

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics"])

@router.get("/{vehicle_id}/alerts", response_model=List[AlertResponse])
def get_alerts(vehicle_id: int, db: Session = Depends(get_db)):
    return db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id).order_by(DiagnosticAlert.timestamp.desc()).all()

@router.post("/{vehicle_id}/alerts/{alert_id}/resolve")
def resolve_alert(vehicle_id: int, alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(DiagnosticAlert).filter(DiagnosticAlert.id == alert_id, DiagnosticAlert.vehicle_id == vehicle_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert.status = "resolved"
    db.commit()
    return {"message": "Alert marked as resolved."}

@router.get("/rules")
def get_rules():
    return RULES_CATALOG
