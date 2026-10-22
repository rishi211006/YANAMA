import math
from typing import List, Dict, Any

def calculate_horsepower(torque_nm: float, rpm: float) -> float:
    """
    HP = (Torque in Nm * RPM) / 7120.7  (metric horsepower calculation)
    """
    if torque_nm <= 0 or rpm <= 0:
        return 0.0
    return round((torque_nm * rpm) / 7120.7, 2)

def summarize_engine_readings(readings: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not readings:
        return {
            "total_readings": 0,
            "avg_rpm": 0.0,
            "max_rpm": 0.0,
            "avg_torque": 0.0,
            "max_torque": 0.0,
            "avg_horsepower": 0.0,
            "max_horsepower": 0.0,
            "avg_coolant_temp": 0.0,
            "max_coolant_temp": 0.0,
            "thermal_stress_events": 0,
            "readings": []
        }
        
    rpms = [r.get("rpm", 0.0) for r in readings]
    torques = [r.get("torque_nm", 0.0) for r in readings]
    hps = [r.get("horsepower", 0.0) for r in readings]
    coolant_temps = [r.get("coolant_temp_c", 0.0) for r in readings]
    thermal_events = sum(1 for t in coolant_temps if t > 102.0)
    
    return {
        "total_readings": len(readings),
        "avg_rpm": round(sum(rpms) / len(rpms), 1),
        "max_rpm": round(max(rpms), 1),
        "avg_torque": round(sum(torques) / len(torques), 1),
        "max_torque": round(max(torques), 1),
        "avg_horsepower": round(sum(hps) / len(hps), 1),
        "max_horsepower": round(max(hps), 1),
        "avg_coolant_temp": round(sum(coolant_temps) / len(coolant_temps), 1),
        "max_coolant_temp": round(max(coolant_temps), 1),
        "thermal_stress_events": thermal_events,
        "readings": readings[-60:]  # Latest 60 points for charting
    }
