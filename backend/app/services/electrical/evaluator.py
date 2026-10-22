from typing import List, Dict, Any

def evaluate_electrical_readings(readings: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not readings:
        return {
            "battery_health_pct": 100.0,
            "alternator_status": "Normal",
            "avg_battery_voltage": 12.6,
            "min_battery_voltage": 12.4,
            "avg_alternator_voltage": 14.1,
            "avg_current_draw": 15.0,
            "voltage_stability_score": 95.0,
            "readings": []
        }
        
    bat_volts = [r.get("battery_voltage", 12.5) for r in readings]
    alt_volts = [r.get("alternator_voltage", 14.0) for r in readings]
    currents = [r.get("current_draw_amps", 15.0) for r in readings]
    
    avg_bat = round(sum(bat_volts) / len(bat_volts), 2)
    min_bat = round(min(bat_volts), 2)
    avg_alt = round(sum(alt_volts) / len(alt_volts), 2)
    avg_curr = round(sum(currents) / len(currents), 2)
    
    # Battery health calculation: 12.6V = 100%, 12.0V = 50%, <11.8V = 20%
    if min_bat >= 12.5:
        health_pct = 95.0
    elif min_bat >= 12.2:
        health_pct = 82.0
    elif min_bat >= 11.9:
        health_pct = 65.0
    else:
        health_pct = 40.0
        
    # Alternator status: 13.8V - 14.5V normal
    if avg_alt < 13.2:
        alt_status = "Undercharging (Check Alternator Belt/Diode)"
    elif avg_alt > 14.8:
        alt_status = "Overcharging (Check Voltage Regulator)"
    else:
        alt_status = "Optimal Output"
        
    # Voltage stability variance
    variance = sum((v - avg_alt) ** 2 for v in alt_volts) / len(alt_volts)
    stability_score = max(50.0, min(100.0, round(100.0 - (variance * 40.0), 1)))
    
    return {
        "battery_health_pct": health_pct,
        "alternator_status": alt_status,
        "avg_battery_voltage": avg_bat,
        "min_battery_voltage": min_bat,
        "avg_alternator_voltage": avg_alt,
        "avg_current_draw": avg_curr,
        "voltage_stability_score": stability_score,
        "readings": readings[-60:]
    }
