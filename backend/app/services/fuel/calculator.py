from typing import List, Dict, Any

def calculate_mileage(speed_kmph: float, fuel_rate_lph: float) -> float:
    """
    Mileage (km/L) = Speed (km/h) / Fuel Rate (L/h)
    """
    if fuel_rate_lph <= 0.05 or speed_kmph <= 0:
        return 0.0
    val = speed_kmph / fuel_rate_lph
    return round(min(val, 40.0), 2)  # Cap at reasonable realistic upper bound

def summarize_fuel_readings(readings: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not readings:
        return {
            "total_records": 0,
            "avg_mileage": 0.0,
            "peak_mileage": 0.0,
            "total_fuel_consumed": 0.0,
            "total_distance_km": 0.0,
            "readings": []
        }
        
    valid_mileages = [r.get("mileage_kmpl", 0.0) for r in readings if r.get("mileage_kmpl", 0.0) > 0.5]
    avg_mileage = round(sum(valid_mileages) / len(valid_mileages), 2) if valid_mileages else 0.0
    peak_mileage = round(max(valid_mileages), 2) if valid_mileages else 0.0
    total_fuel = round(sum(r.get("fuel_consumed_liters", 0.0) for r in readings), 2)
    total_distance = round(sum(r.get("distance_km", 0.0) for r in readings), 2)
    
    return {
        "total_records": len(readings),
        "avg_mileage": avg_mileage,
        "peak_mileage": peak_mileage,
        "total_fuel_consumed": total_fuel,
        "total_distance_km": total_distance,
        "readings": readings[-60:]
    }
