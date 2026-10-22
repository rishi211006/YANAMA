from typing import List, Dict, Any

def calculate_vehicle_health_score(
    engine_readings: List[Dict[str, Any]],
    electrical_readings: List[Dict[str, Any]],
    maintenance_status: List[Dict[str, Any]],
    diagnostic_alerts: List[Dict[str, Any]],
    avg_mileage: float
) -> Dict[str, Any]:
    # 1. Engine Score (Max 100)
    engine_score = 95.0
    if engine_readings:
        max_coolant = max((r.get("coolant_temp_c", 90.0) for r in engine_readings), default=90.0)
        if max_coolant > 105.0:
            engine_score -= 30.0
        elif max_coolant > 100.0:
            engine_score -= 15.0
            
        max_rpm = max((r.get("rpm", 2500.0) for r in engine_readings), default=2500.0)
        if max_rpm > 5500.0:
            engine_score -= 10.0
    engine_score = max(30.0, min(100.0, engine_score))
    
    # 2. Electrical Score (Max 100)
    electrical_score = 95.0
    if electrical_readings:
        min_bat = min((r.get("battery_voltage", 12.6) for r in electrical_readings), default=12.6)
        if min_bat < 11.8:
            electrical_score -= 35.0
        elif min_bat < 12.1:
            electrical_score -= 18.0
    electrical_score = max(35.0, min(100.0, electrical_score))
    
    # 3. Maintenance Score (Max 100)
    overdue_count = sum(1 for m in maintenance_status if m.get("status") == "overdue")
    due_count = sum(1 for m in maintenance_status if m.get("status") == "due")
    maintenance_score = max(30.0, 100.0 - (overdue_count * 20.0) - (due_count * 8.0))
    
    # 4. Diagnostic Score (Max 100)
    crit_alerts = sum(1 for a in diagnostic_alerts if a.get("severity") == "critical" and a.get("status") == "active")
    warn_alerts = sum(1 for a in diagnostic_alerts if a.get("severity") == "warning" and a.get("status") == "active")
    diagnostic_score = max(20.0, 100.0 - (crit_alerts * 25.0) - (warn_alerts * 12.0))
    
    # 5. Fuel Score (Max 100)
    if avg_mileage >= 16.0:
        fuel_score = 95.0
    elif avg_mileage >= 12.0:
        fuel_score = 85.0
    elif avg_mileage >= 9.0:
        fuel_score = 72.0
    else:
        fuel_score = 60.0
        
    # Weighted Overall Health Score:
    overall_score = round(
        (engine_score * 0.25) +
        (diagnostic_score * 0.25) +
        (maintenance_score * 0.20) +
        (electrical_score * 0.15) +
        (fuel_score * 0.15),
        1
    )
    
    if overall_score >= 88.0:
        grade = "A"
        status = "Excellent Condition"
        summary = "Your vehicle's primary operating parameters are in exceptional condition with all major systems operating smoothly."
    elif overall_score >= 75.0:
        grade = "B"
        status = "Good Condition"
        summary = "Your vehicle is generally in good working order, with minor preventative maintenance recommended."
    elif overall_score >= 60.0:
        grade = "C"
        status = "Attention Needed"
        summary = "Certain mechanical or electrical parameters require attention soon to prevent accelerated wear."
    else:
        grade = "D"
        status = "Urgent Action Required"
        summary = "Active fault alerts or critical service items require immediate mechanical inspection."
        
    return {
        "overall_score": overall_score,
        "grade": grade,
        "status": status,
        "summary": summary,
        "engine_score": round(engine_score, 1),
        "fuel_score": round(fuel_score, 1),
        "electrical_score": round(electrical_score, 1),
        "maintenance_score": round(maintenance_score, 1),
        "diagnostic_score": round(diagnostic_score, 1)
    }
