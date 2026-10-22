from datetime import datetime, timezone
from typing import List, Dict, Any

STANDARD_SERVICE_SCHEDULE = [
    {"name": "Engine Oil & Filter Replacement", "interval_km": 10000, "interval_days": 180, "type": "routine", "est_cost": 2800.0},
    {"name": "Engine Air Filter Replacement", "interval_km": 15000, "interval_days": 365, "type": "routine", "est_cost": 850.0},
    {"name": "Brake Fluid Flush & Inspection", "interval_km": 25000, "interval_days": 730, "type": "inspection", "est_cost": 1500.0},
    {"name": "Coolant Fluid Renewal", "interval_km": 40000, "interval_days": 730, "type": "routine", "est_cost": 2200.0},
    {"name": "Spark Plugs Replacement", "interval_km": 30000, "interval_days": 730, "type": "routine", "est_cost": 1800.0},
    {"name": "Transmission Fluid Change", "interval_km": 45000, "interval_days": 1095, "type": "routine", "est_cost": 4500.0},
    {"name": "Wheel Alignment & Balancing", "interval_km": 8000, "interval_days": 120, "type": "routine", "est_cost": 1200.0}
]

def check_maintenance_schedule(current_odometer: float, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []
    
    for item in STANDARD_SERVICE_SCHEDULE:
        # Find latest record of this item
        matching = [r for r in records if item["name"].lower() in r.get("service_name", "").lower()]
        if matching:
            latest = max(matching, key=lambda x: x.get("odometer_km", 0.0))
            km_since = current_odometer - latest.get("odometer_km", 0.0)
            if km_since > item["interval_km"]:
                status = "overdue"
            elif km_since > (item["interval_km"] * 0.85):
                status = "due"
            else:
                status = "completed"
        else:
            # No prior record, assess directly against odometer
            if current_odometer >= item["interval_km"]:
                status = "overdue"
            elif current_odometer >= (item["interval_km"] * 0.8):
                status = "due"
            else:
                status = "completed"
                
        results.append({
            "service_name": item["name"],
            "service_type": item["type"],
            "interval_km": item["interval_km"],
            "interval_days": item["interval_days"],
            "status": status,
            "estimated_cost": item["est_cost"]
        })
        
    return results
