from typing import List, Dict, Any

def generate_recommendations(
    vehicle: Any,
    health_score: float,
    diagnostic_alerts: List[Dict[str, Any]],
    maintenance_items: List[Dict[str, Any]],
    avg_mileage: float
) -> List[Dict[str, Any]]:
    recs = []
    
    # 1. Thermal or Coolant check
    has_coolant_alert = any(a.get("rule_code") == "ENG-TMP-001" for a in diagnostic_alerts)
    if has_coolant_alert:
        recs.append({
            "category": "engine",
            "priority": "high",
            "title": "Perform Engine Cooling System Flush & Thermostat Inspection",
            "description_owner": "Your engine has been running warmer than normal. A quick cooling system check will prevent potential roadside breakdowns and preserve engine life.",
            "description_mechanic": "High thermal stress detected. Pressure-test cooling loop at 1.1 bar, verify electric fan dual-speed triggering, and check coolant anti-freeze concentration.",
            "action_needed": "Schedule cooling system inspection and top up OEM-spec glycol coolant.",
            "estimated_savings": 12000.0
        })
        
    # 2. Overdue maintenance checks
    overdue_oil = any("Oil" in m.get("service_name", "") and m.get("status") == "overdue" for m in maintenance_items)
    if overdue_oil:
        recs.append({
            "category": "maintenance",
            "priority": "high",
            "title": "Engine Oil & Filter Service Overdue",
            "description_owner": "Your engine oil is past its recommended service mileage. Fresh oil improves lubrication, makes the engine quieter, and reduces fuel consumption.",
            "description_mechanic": "Oil drain interval exceeded. Viscosity degradation and particulate accumulation increases frictional drag and valvetrain wear.",
            "action_needed": "Drain and replace engine oil with manufacturer-certified synthetic grade and replace oil filter element.",
            "estimated_savings": 8500.0
        })
        
    # 3. Fuel efficiency improvement
    if avg_mileage > 0 and avg_mileage < 12.0:
        recs.append({
            "category": "fuel",
            "priority": "medium",
            "title": "Air Filter Inspection & Throttle Optimization",
            "description_owner": "Your average mileage is below optimal expectations. Cleaning or replacing the air filter and adopting progressive throttle inputs can recover 1.5 - 2.5 km/L.",
            "description_mechanic": "Sub-optimal air-fuel mixing ratio indicated by fuel rate telemetry. Inspect intake manifold vacuum, MAF sensor cleanliness, and replace restricted air filter.",
            "action_needed": "Replace engine air filter and check tire inflation pressures to standard 33 PSI.",
            "estimated_savings": 4500.0
        })
        
    # 4. Battery / Electrical check
    has_bat_alert = any("ELE" in a.get("rule_code", "") for a in diagnostic_alerts)
    if has_bat_alert:
        recs.append({
            "category": "electrical",
            "priority": "high",
            "title": "Battery Conditioning & Alternator Terminal Service",
            "description_owner": "Your vehicle electrical system indicated low voltage reserves. Having the battery tested will avoid morning starting failures.",
            "description_mechanic": "Resting voltage dipped below critical threshold. Clean lead battery terminals, apply dielectric grease, and verify stator ripple voltage.",
            "action_needed": "Full 12V conductance battery diagnostic and terminal cleaning.",
            "estimated_savings": 3500.0
        })
        
    # Default good condition recommendation if no critical issues
    if not recs:
        recs.append({
            "category": "maintenance",
            "priority": "low",
            "title": "Maintain Scheduled Preventative Maintenance",
            "description_owner": "Your vehicle is currently in great operating health! Continue following the regular service schedule and check tire pressures every 2 weeks.",
            "description_mechanic": "All powertrain and electrical parameters are within nominal OEM tolerances. Maintain standard service interval logs.",
            "action_needed": "Continue routine visual checks and monthly tire pressure maintenance.",
            "estimated_savings": 2000.0
        })
        
    return recs
