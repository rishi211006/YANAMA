from typing import List, Dict, Any

def simulate_trip(
    trip_distance_km: float,
    terrain_type: str,
    load_condition: str,
    duration_days: int,
    current_health_score: float,
    maintenance_records: List[Dict[str, Any]],
    diagnostic_alerts: List[Dict[str, Any]],
    avg_mileage: float,
    fuel_type: str = "petrol"
) -> Dict[str, Any]:
    """
    Simulates a planned road trip given the current condition of the vehicle versus
    a fully serviced condition. Recommends mandatory and suggested preventative services.
    """
    terrain = terrain_type.lower()
    load = load_condition.lower()
    
    # Base baseline mileage by fuel type
    base_kmpl = avg_mileage if avg_mileage > 5.0 else (14.5 if fuel_type == "petrol" else 16.5)
    
    # Terrain drag multipliers
    terrain_mileage_factor = {
        "highway": 1.15,
        "mixed": 1.0,
        "city": 0.82,
        "mountain": 0.72
    }.get(terrain, 1.0)
    
    # Load drag multipliers
    load_mileage_factor = {
        "light": 1.03,
        "medium": 1.0,
        "heavy": 0.88
    }.get(load, 1.0)
    
    # Check current condition defects
    overdue_items = [m for m in maintenance_records if m.get("status") == "overdue"]
    active_alerts = [a for a in diagnostic_alerts if a.get("status") == "active"]
    has_cooling_issue = any("TMP" in a.get("rule_code", "") or "Coolant" in a.get("title", "") for a in active_alerts)
    has_battery_issue = any("BAT" in a.get("rule_code", "") or "ELE" in a.get("rule_code", "") for a in active_alerts)
    has_oil_overdue = any("oil" in m.get("service_name", "").lower() for m in overdue_items)
    has_air_filter_overdue = any("air" in m.get("service_name", "").lower() for m in overdue_items)
    
    # Condition degradation factors on fuel efficiency
    current_efficiency_penalty = 1.0
    if has_oil_overdue:
        current_efficiency_penalty *= 0.94
    if has_air_filter_overdue:
        current_efficiency_penalty *= 0.93
    if has_cooling_issue:
        current_efficiency_penalty *= 0.95
        
    # Estimated km/L for trip
    serviced_kmpl = round(base_kmpl * terrain_mileage_factor * load_mileage_factor, 2)
    current_kmpl = round(serviced_kmpl * current_efficiency_penalty, 2)
    
    # Fuel calculations
    current_fuel_liters = round(trip_distance_km / max(current_kmpl, 3.0), 1)
    serviced_fuel_liters = round(trip_distance_km / max(serviced_kmpl, 3.0), 1)
    
    fuel_price_per_liter = 102.0 if fuel_type == "petrol" else 92.0
    current_fuel_cost = round(current_fuel_liters * fuel_price_per_liter, 2)
    serviced_fuel_cost = round(serviced_fuel_liters * fuel_price_per_liter, 2)
    fuel_savings = round(max(0.0, current_fuel_cost - serviced_fuel_cost), 2)
    
    # Readiness scores
    current_readiness = max(35.0, round(current_health_score, 1))
    # Terrain additional strain on readiness
    if terrain == "mountain":
        current_readiness -= 12.0
        if has_cooling_issue:
            current_readiness -= 18.0
    elif terrain == "city":
        if has_cooling_issue:
            current_readiness -= 8.0
            
    current_readiness = max(25.0, min(100.0, round(current_readiness, 1)))
    serviced_readiness = 96.5
    
    # Identify Risk Factors
    risk_factors = []
    if has_cooling_issue:
        severity = "Critical" if terrain == "mountain" else "High"
        risk_factors.append({
            "name": "Engine Thermal Runaway / Overheating",
            "severity": severity,
            "description": f"Vehicle has active thermal alerts. Sustained driving on {terrain} terrain with {load} load will likely trigger emergency radiator boil-over."
        })
        
    if has_battery_issue:
        risk_factors.append({
            "name": "Mid-Trip Starting Failure",
            "severity": "High",
            "description": "Low resting voltage detected. Stopping for fuel or overnight rest during the trip carries high probability of failure to crank."
        })
        
    if has_oil_overdue:
        risk_factors.append({
            "name": "Elevated Piston Friction & Bearing Wear",
            "severity": "Medium",
            "description": "Degraded engine oil will thin out under continuous high-temperature cruising, accelerating cylinder wall friction."
        })
        
    if terrain == "mountain" and load == "heavy":
        risk_factors.append({
            "name": "Brake System Fade & Thermal Glazing",
            "severity": "High",
            "description": "Steep descents with heavy passenger and luggage payload will generate extreme rotor temperatures. Brake fluid boil risk."
        })
        
    if not risk_factors:
        risk_factors.append({
            "name": "Nominal Highway Fatigue",
            "severity": "Low",
            "description": "Vehicle telemetry indicates steady operating parameters. Standard pre-trip tire pressure check advised."
        })
        
    # Required Services before trip
    required_services = []
    if has_cooling_issue or terrain == "mountain":
        required_services.append({
            "service": "Coolant Fluid Inspection & Radiator Flush",
            "urgency": "Mandatory" if has_cooling_issue else "Recommended",
            "estimated_cost": 2200.0,
            "benefit": "Maintains operating temperature under 96°C during uphill climbing."
        })
        
    if has_oil_overdue:
        required_services.append({
            "service": "Engine Oil & Filter Renewal",
            "urgency": "Mandatory",
            "estimated_cost": 2800.0,
            "benefit": "Restores boundary lubrication film and improves fuel mileage by ~6%."
        })
        
    if has_battery_issue:
        required_services.append({
            "service": "12V Battery Health Test & Fast Charge",
            "urgency": "Mandatory",
            "estimated_cost": 500.0,
            "benefit": "Eliminates risk of stranded start in unfamiliar locations."
        })
        
    required_services.append({
        "service": "Brake Fluid Inspection & Pad Thickness Check",
        "urgency": "Mandatory" if (terrain == "mountain" or trip_distance_km > 500) else "Recommended",
        "estimated_cost": 1500.0,
        "benefit": "Ensures full hydraulic pedal firmness and short stopping distances."
    })
    
    required_services.append({
        "service": "Cold Tire Pressure & Tread Depth Inspection",
        "urgency": "Recommended",
        "estimated_cost": 300.0,
        "benefit": "Prevents tire blowout at sustained cruising speeds and reduces rolling resistance."
    })
    
    # AI Recommendations
    ai_owner = (
        f"For your planned {trip_distance_km:.0f} km trip across {terrain} terrain with {load} payload, "
        f"your car currently has a trip readiness score of {current_readiness:.0f}/100. "
        f"With your current vehicle condition, this journey will consume approximately {current_fuel_liters:.1f} Litres of fuel (₹{current_fuel_cost:,.0f}). "
        f"{'CRITICAL NOTICE: Prioritize resolving active coolant/battery warnings before embarking on this journey to ensure passenger safety.' if (has_cooling_issue or has_battery_issue) else 'Your vehicle is in good shape, but completing preventative checks will give you peace of mind.'} "
        f"Carrying out the recommended servicing will raise your readiness score to {serviced_readiness:.0f}/100 and save you approx ₹{fuel_savings:,.0f} in fuel."
    )
    
    ai_mechanic = (
        f"TRIP FEASIBILITY ASSESSMENT: Distance={trip_distance_km}km | Terrain={terrain.upper()} | Duty Cycle={load.upper()} | Duration={duration_days}d. "
        f"Current readiness index: {current_readiness:.1f}% vs Serviced condition: {serviced_readiness:.1f}%. "
        f"Delta fuel requirement: {current_fuel_liters - serviced_fuel_liters:+.1f} L (BSFC penalty of {((current_fuel_liters/max(serviced_fuel_liters, 1.0)) - 1.0)*100:.1f}%). "
        f"Critical vulnerabilities: {'Thermostat restriction, radiator airflow deficit, ' if has_cooling_issue else ''}"
        f"{'Parasitic draw / cell sulfation on 12V battery, ' if has_battery_issue else ''}"
        f"{'Viscosity breakdown in lubricant.' if has_oil_overdue else 'Standard wear profile.'} "
        f"Action: Complete listed mandatory workshop workorders prior to vehicle dispatch."
    )
    
    return {
        "vehicle_id": 1,
        "trip_distance_km": trip_distance_km,
        "terrain_type": terrain.capitalize(),
        "load_condition": load.capitalize(),
        "current_readiness_score": current_readiness,
        "serviced_readiness_score": serviced_readiness,
        "current_fuel_needed_liters": current_fuel_liters,
        "serviced_fuel_needed_liters": serviced_fuel_liters,
        "current_fuel_cost_est": current_fuel_cost,
        "serviced_fuel_cost_est": serviced_fuel_cost,
        "potential_fuel_savings": fuel_savings,
        "risk_factors": risk_factors,
        "required_services": required_services,
        "ai_recommendation_owner": ai_owner,
        "ai_recommendation_mechanic": ai_mechanic
    }
