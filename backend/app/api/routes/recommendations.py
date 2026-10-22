from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.models import Recommendation, Vehicle, DiagnosticAlert, MaintenanceRecord, FuelTelemetry
from app.schemas.schemas import RecommendationResponse
from app.services.recommendations.generator import generate_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/{vehicle_id}", response_model=List[RecommendationResponse])
def get_recommendations(vehicle_id: int, db: Session = Depends(get_db)):
    recs = db.query(Recommendation).filter(Recommendation.vehicle_id == vehicle_id).all()
    if recs:
        return recs
        
    # Auto-generate if empty
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
        
    alerts = [
        {"rule_code": a.rule_code, "severity": a.severity, "status": a.status}
        for a in db.query(DiagnosticAlert).filter(DiagnosticAlert.vehicle_id == vehicle_id, DiagnosticAlert.status == "active").all()
    ]
    maintenance = [
        {"service_name": m.service_name, "status": m.status}
        for m in db.query(MaintenanceRecord).filter(MaintenanceRecord.vehicle_id == vehicle_id).all()
    ]
    fuel_records = db.query(FuelTelemetry).filter(FuelTelemetry.vehicle_id == vehicle_id).all()
    avg_mileage = (sum(r.mileage_kmpl for r in fuel_records) / len(fuel_records)) if fuel_records else 14.5
    
    gen_list = generate_recommendations(
        vehicle=vehicle,
        health_score=80.0,
        diagnostic_alerts=alerts,
        maintenance_items=maintenance,
        avg_mileage=avg_mileage
    )
    
    created = []
    for g in gen_list:
        rec = Recommendation(
            vehicle_id=vehicle_id,
            category=g["category"],
            priority=g["priority"],
            title=g["title"],
            description_owner=g["description_owner"],
            description_mechanic=g["description_mechanic"],
            action_needed=g["action_needed"],
            estimated_savings=g["estimated_savings"],
            status="pending"
        )
        db.add(rec)
        created.append(rec)
    db.commit()
    return created

@router.post("/{vehicle_id}/{rec_id}/status")
def update_rec_status(vehicle_id: int, rec_id: int, status: str, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id, Recommendation.vehicle_id == vehicle_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found.")
    rec.status = status
    db.commit()
    return {"message": "Status updated successfully."}
