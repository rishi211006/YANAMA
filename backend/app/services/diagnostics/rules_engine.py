from typing import List, Dict, Any

RULES_CATALOG = [
    {
        "code": "ENG-TMP-001",
        "name": "Coolant Overtemperature Alert",
        "component": "Engine Thermal Management",
        "threshold": 102.0,
        "operator": ">",
        "unit": "°C",
        "severity": "critical",
        "owner_msg": "Your engine coolant temperature is higher than the configured operating range. Allow the engine to cool down and arrange an inspection if the condition continues.",
        "mechanic_msg": "Coolant temperature exceeded 102.0°C threshold. Check thermostat valve actuation, radiator fin flow, and coolant expansion tank level."
    },
    {
        "code": "ENG-RPM-002",
        "name": "High RPM / Redline Stress",
        "component": "Powertrain",
        "threshold": 5500.0,
        "operator": ">",
        "unit": "RPM",
        "severity": "warning",
        "owner_msg": "The engine was pushed to very high revolutions. Driving gently helps protect engine components and saves fuel.",
        "mechanic_msg": "Engine RPM crossed 5500 RPM transient threshold. Check valve train harmonics and ECU rev-limiter event log."
    },
    {
        "code": "ELE-BAT-001",
        "name": "Low Battery Terminal Voltage",
        "component": "Electrical Starting System",
        "threshold": 11.9,
        "operator": "<",
        "unit": "V",
        "severity": "warning",
        "owner_msg": "Your battery voltage is lower than normal. Your car might have trouble starting if parked for a long time.",
        "mechanic_msg": "Open-circuit battery terminal voltage dropped below 11.90V. Conduct conductance load test and inspect parasitic drain."
    },
    {
        "code": "ELE-ALT-002",
        "name": "Alternator Undercharging Defect",
        "component": "Charging Subsystem",
        "threshold": 13.2,
        "operator": "<",
        "unit": "V",
        "severity": "critical",
        "owner_msg": "The car's charging system is not replenishing the battery properly while running. Please have it inspected promptly to avoid a breakdown.",
        "mechanic_msg": "Alternator stator/rectifier circuit voltage dropped below 13.20V under engine load. Check serpentine belt tension and alternator diode bridge."
    },
    {
        "code": "FUE-EFF-001",
        "name": "Abnormal Fuel Flow Spike",
        "component": "Fuel Delivery",
        "threshold": 18.0,
        "operator": ">",
        "unit": "L/h",
        "severity": "info",
        "owner_msg": "High fuel flow was detected during recent driving. Smooth acceleration will help you get much better mileage.",
        "mechanic_msg": "Fuel rail instantaneous rate exceeded 18.0 L/h. Correlate with throttle position sensor and MAF sensor readings."
    }
]

def evaluate_diagnostics(
    engine_readings: List[Dict[str, Any]],
    electrical_readings: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    alerts = []
    
    # 1. Coolant check
    for r in engine_readings:
        coolant = r.get("coolant_temp_c", 0.0)
        if coolant > 102.0:
            alerts.append({
                "rule_code": "ENG-TMP-001",
                "component": "Engine Thermal Management",
                "severity": "critical" if coolant > 108.0 else "warning",
                "title": f"Coolant Temperature Elevated ({coolant:.1f}°C)",
                "message_owner": f"Your engine coolant temperature reached {coolant:.1f}°C, which is above safe limits. Allow the engine to cool down and arrange an inspection if this continues.",
                "message_mechanic": f"Coolant temperature logged at {coolant:.1f}°C (>102°C threshold). Recommend radiator pressure test and thermostat continuity inspection.",
                "trigger_value": coolant,
                "threshold_value": 102.0,
                "status": "active"
            })
            break
            
    # 2. RPM check
    for r in engine_readings:
        rpm = r.get("rpm", 0.0)
        if rpm > 5500.0:
            alerts.append({
                "rule_code": "ENG-RPM-002",
                "component": "Powertrain",
                "severity": "warning",
                "title": f"High Engine RPM Event ({rpm:.0f} RPM)",
                "message_owner": f"The engine was revved to {rpm:.0f} RPM. Driving gently in lower rev ranges extends engine life.",
                "message_mechanic": f"Peak RPM event logged at {rpm:.0f} RPM (>5500 RPM). Review valve float risk and ECU over-rev tally.",
                "trigger_value": rpm,
                "threshold_value": 5500.0,
                "status": "active"
            })
            break
            
    # 3. Electrical checks
    for r in electrical_readings:
        bat_v = r.get("battery_voltage", 12.5)
        alt_v = r.get("alternator_voltage", 14.0)
        
        if bat_v < 11.9:
            alerts.append({
                "rule_code": "ELE-BAT-001",
                "component": "Electrical Starting System",
                "severity": "warning",
                "title": f"Low Battery Resting Voltage ({bat_v:.2f}V)",
                "message_owner": f"Your battery voltage dipped to {bat_v:.2f}V. You might face starting delays soon; consider testing or recharging the battery.",
                "message_mechanic": f"Low battery resting potential {bat_v:.2f}V (<11.90V). Perform 15-second carbon pile load test and check state of health (SoH).",
                "trigger_value": bat_v,
                "threshold_value": 11.9,
                "status": "active"
            })
            break
            
        if alt_v < 13.2:
            alerts.append({
                "rule_code": "ELE-ALT-002",
                "component": "Charging Subsystem",
                "severity": "critical",
                "title": f"Alternator Undercharging ({alt_v:.2f}V)",
                "message_owner": f"Your car's generator is producing {alt_v:.2f}V, which is too low to keep the battery charged while running.",
                "message_mechanic": f"Alternator charging output fell to {alt_v:.2f}V (<13.20V). Verify serpentine belt slip, alternator brush wear, and ground straps.",
                "trigger_value": alt_v,
                "threshold_value": 13.2,
                "status": "active"
            })
            break
            
    return alerts
