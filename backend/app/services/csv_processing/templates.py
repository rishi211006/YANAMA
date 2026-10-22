CSV_TEMPLATES = {
    "engine": """timestamp,vehicle_id,rpm,torque_nm,horsepower,engine_temperature_c,coolant_temperature_c,engine_load_percent,throttle_position_percent,speed_kmph
2026-10-22T08:00:00Z,1,1800,145.0,,82.5,86.0,32.0,18.5,45.0
2026-10-22T08:00:05Z,1,2200,165.0,,85.0,88.5,42.0,24.0,58.0
2026-10-22T08:00:10Z,1,2600,180.0,,88.0,91.0,55.0,32.0,72.0
2026-10-22T08:00:15Z,1,1950,150.0,,86.5,89.0,36.0,20.0,52.0
2026-10-22T08:00:20Z,1,1500,120.0,,84.0,87.0,28.0,14.0,38.0
""",
    "fuel": """timestamp,vehicle_id,fuel_rate_lph,speed_kmph,fuel_level_percent,fuel_consumed_liters,distance_km,mileage_kmpl
2026-10-22T08:00:00Z,1,3.2,48.0,72.0,0.15,2.4,
2026-10-22T08:00:10Z,1,4.1,65.0,71.8,0.32,4.8,
2026-10-22T08:00:20Z,1,3.8,60.0,71.5,0.48,7.2,
2026-10-22T08:00:30Z,1,2.4,42.0,71.3,0.60,9.0,
2026-10-22T08:00:40Z,1,4.8,75.0,71.0,0.85,12.5,
""",
    "electrical": """timestamp,vehicle_id,battery_voltage,alternator_voltage,current_draw_amps,battery_soc_percent,charging_status
2026-10-22T08:00:00Z,1,12.6,14.2,16.5,92.0,normal
2026-10-22T08:00:10Z,1,12.5,14.1,18.0,91.5,normal
2026-10-22T08:00:20Z,1,12.6,14.3,15.2,91.0,normal
2026-10-22T08:00:30Z,1,12.5,14.0,21.0,90.5,normal
2026-10-22T08:00:40Z,1,12.4,14.1,17.5,90.0,normal
""",
    "maintenance": """service_name,service_type,service_date,odometer_km,cost,status,notes,interval_km,interval_days
Engine Oil & Filter Replacement,routine,2026-05-15T10:00:00Z,32000,3200.0,completed,Fully synthetic 5W-30 oil replaced,10000,180
Engine Air Filter Replacement,routine,2026-05-15T10:00:00Z,32000,850.0,completed,Intake filter clean,15000,365
Brake Fluid Flush & Inspection,inspection,2026-01-10T11:00:00Z,28000,1500.0,completed,DOT 4 fluid flushed,25000,730
Wheel Alignment & Balancing,routine,2026-08-20T14:30:00Z,35500,1200.0,completed,Camber and toe adjusted,8000,120
""",
    "diagnostic": """rule_code,component,severity,title,message_owner,message_mechanic,trigger_value,threshold_value,timestamp,status
ENG-TMP-001,Engine Thermal Management,warning,Coolant Temperature Elevated,Your engine coolant is warmer than normal. Allow engine to rest and check coolant level.,Coolant temperature reached 103.5 C (>102 C threshold). Check thermostat valve and radiator fin airflow.,103.5,102.0,2026-10-20T14:22:00Z,active
ELE-BAT-001,Electrical Starting System,warning,Low Battery Resting Voltage,Your battery voltage dipped to 11.85V. Consider inspecting or charging the battery.,Battery resting potential logged at 11.85V (<11.90V). Conduct conductance load test and parasitic draw check.,11.85,11.90,2026-10-21T09:15:00Z,active
"""
}

def get_csv_template(template_type: str) -> str:
    return CSV_TEMPLATES.get(template_type.lower(), CSV_TEMPLATES["engine"])
