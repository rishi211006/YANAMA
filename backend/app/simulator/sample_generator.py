import math
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.models import (
    User, Vehicle, EngineTelemetry, FuelTelemetry, ElectricalTelemetry,
    MaintenanceRecord, DiagnosticAlert, Recommendation, FinancialRecord,
    UploadRecord
)
from app.core.security import get_password_hash
from app.services.engine.calculator import calculate_horsepower
from app.services.fuel.calculator import calculate_mileage

def seed_complete_demo_data(db: Session):
    """
    Idempotent database seeder. Creates demo users, petrol & diesel vehicles,
    rich time-series telemetry, maintenance records, diagnostics, and expenses.
    """
    # 1. Users
    owner = db.query(User).filter(User.email == "demo@yanama.ai").first()
    if not owner:
        owner = User(
            email="demo@yanama.ai",
            hashed_password=get_password_hash("password123"),
            full_name="Aditya Sharma",
            role="owner",
            is_active=True
        )
        db.add(owner)
        db.flush()
        
    mechanic = db.query(User).filter(User.email == "mechanic@yanama.ai").first()
    if not mechanic:
        mechanic = User(
            email="mechanic@yanama.ai",
            hashed_password=get_password_hash("password123"),
            full_name="Rajesh Kumar (Chief Technician)",
            role="mechanic",
            is_active=True
        )
        db.add(mechanic)
        db.flush()
        
    # 2. Vehicle 1: Honda City (Petrol)
    v1 = db.query(Vehicle).filter(Vehicle.registration_number == "KA-01-MJ-4589").first()
    if not v1:
        v1 = Vehicle(
            user_id=owner.id,
            registration_number="KA-01-MJ-4589",
            manufacturer="Honda",
            model="City i-VTEC",
            year=2022,
            fuel_type="petrol",
            engine_capacity_cc=1498,
            transmission="manual",
            odometer_km=34250.0,
            vin="MAKGM665GNN014589",
            nickname="City Cruiser"
        )
        db.add(v1)
        db.flush()
        
        # Populate Telemetry for V1 (Healthy Petrol Profile)
        now = datetime.now(timezone.utc)
        base_time = now - timedelta(hours=3)
        for i in range(120):
            t = base_time + timedelta(seconds=i * 15)
            # Realistic varying driving conditions
            rpm = 1600.0 + (math.sin(i / 8.0) * 800.0) + (100.0 if i % 5 == 0 else 0.0)
            torque = 115.0 + (math.cos(i / 10.0) * 25.0)
            hp = calculate_horsepower(torque, rpm)
            coolant = 87.0 + (math.sin(i / 15.0) * 3.5)
            engine_temp = coolant + 4.0
            speed = 35.0 + (rpm / 80.0) + (math.sin(i / 6.0) * 10.0)
            load = 28.0 + (throttle := 18.0 + (math.sin(i / 7.0) * 12.0))
            
            db.add(EngineTelemetry(
                vehicle_id=v1.id,
                timestamp=t,
                rpm=round(rpm, 1),
                torque_nm=round(torque, 1),
                horsepower=hp,
                engine_temp_c=round(engine_temp, 1),
                coolant_temp_c=round(coolant, 1),
                engine_load_pct=round(load, 1),
                throttle_pos_pct=round(throttle, 1),
                speed_kmph=round(max(15.0, speed), 1)
            ))
            
            # Fuel telemetry
            fuel_rate = 2.4 + (rpm / 1200.0) + (throttle / 25.0)
            mileage = calculate_mileage(speed, fuel_rate)
            db.add(FuelTelemetry(
                vehicle_id=v1.id,
                timestamp=t,
                fuel_rate_lph=round(fuel_rate, 2),
                speed_kmph=round(speed, 1),
                fuel_level_pct=round(75.0 - (i * 0.04), 1),
                fuel_consumed_liters=round(fuel_rate * (15.0 / 3600.0), 3),
                distance_km=round(speed * (15.0 / 3600.0), 3),
                mileage_kmpl=mileage,
                throttle_pos_pct=round(throttle, 1),
                engine_load_pct=round(load, 1)
            ))
            
            # Electrical telemetry
            db.add(ElectricalTelemetry(
                vehicle_id=v1.id,
                timestamp=t,
                battery_voltage=round(12.55 + (math.sin(i / 12.0) * 0.15), 2),
                alternator_voltage=round(14.15 + (math.cos(i / 10.0) * 0.12), 2),
                current_draw_amps=round(14.5 + (math.sin(i / 5.0) * 3.0), 1),
                battery_soc_pct=round(92.0 - (i * 0.02), 1),
                charging_status="normal"
            ))
            
        # Maintenance Records for V1
        db.add(MaintenanceRecord(
            vehicle_id=v1.id,
            service_name="Engine Oil & Filter Replacement",
            service_type="routine",
            service_date=now - timedelta(days=90),
            odometer_km=30000.0,
            cost=2850.0,
            status="completed",
            notes="Castrol Magnatec 5W-30 Synthetic replaced. Oil filter renewed.",
            interval_km=10000.0,
            interval_days=180
        ))
        db.add(MaintenanceRecord(
            vehicle_id=v1.id,
            service_name="Engine Air Filter Replacement",
            service_type="routine",
            service_date=now - timedelta(days=90),
            odometer_km=30000.0,
            cost=850.0,
            status="completed",
            notes="OEM air filter replaced.",
            interval_km=15000.0,
            interval_days=365
        ))
        db.add(MaintenanceRecord(
            vehicle_id=v1.id,
            service_name="Brake Fluid Flush & Inspection",
            service_type="inspection",
            service_date=now - timedelta(days=220),
            odometer_km=25000.0,
            cost=1400.0,
            status="due",
            notes="Fluid moisture content approaching 2.8%. Due for renewal at 35,000 km.",
            interval_km=10000.0,
            interval_days=180
        ))
        
        # Recommendations for V1
        db.add(Recommendation(
            vehicle_id=v1.id,
            category="maintenance",
            priority="low",
            title="Maintain Scheduled Tire Rotation & Brake Inspection",
            description_owner="Your Honda City is in prime running condition! Maintain steady highway speeds to preserve your 16.5 km/L fuel average.",
            description_mechanic="Powertrain parameters nominal. Plan DOT4 brake fluid renewal at upcoming 35,000 km interval.",
            action_needed="Schedule routine tire rotation and pad thickness check at 35,000 km.",
            estimated_savings=2500.0,
            status="pending"
        ))
        
        # Financials for V1
        db.add(FinancialRecord(vehicle_id=v1.id, expense_type="fuel", amount=3500.0, date=now - timedelta(days=12), description="IOCL XP95 Petrol fill (34 L)", odometer_km=33800.0))
        db.add(FinancialRecord(vehicle_id=v1.id, expense_type="fuel", amount=3650.0, date=now - timedelta(days=2), description="Shell V-Power Petrol fill (35 L)", odometer_km=34250.0))
        db.add(FinancialRecord(vehicle_id=v1.id, expense_type="maintenance", amount=3700.0, date=now - timedelta(days=90), description="30,000 km periodic service at Authorized Honda Center", odometer_km=30000.0))
        db.add(FinancialRecord(vehicle_id=v1.id, expense_type="insurance", amount=16500.0, date=now - timedelta(days=150), description="Comprehensive Annual Insurance Renewal", odometer_km=28000.0))

    # 3. Vehicle 2: Mahindra XUV700 (Diesel)
    v2 = db.query(Vehicle).filter(Vehicle.registration_number == "MH-12-TX-8821").first()
    if not v2:
        v2 = Vehicle(
            user_id=owner.id,
            registration_number="MH-12-TX-8821",
            manufacturer="Mahindra",
            model="XUV700 mHawk AX7",
            year=2023,
            fuel_type="diesel",
            engine_capacity_cc=2184,
            transmission="automatic",
            odometer_km=42850.0,
            vin="MA1TC456RLL028821",
            nickname="Road Beast"
        )
        db.add(v2)
        db.flush()
        
        # Populate Telemetry for V2 (Diesel Profile with Coolant Thermal Spike & Low Battery)
        now = datetime.now(timezone.utc)
        base_time = now - timedelta(hours=2)
        for i in range(120):
            t = base_time + timedelta(seconds=i * 15)
            rpm = 1500.0 + (math.sin(i / 6.0) * 750.0)
            torque = 290.0 + (math.cos(i / 8.0) * 80.0)
            hp = calculate_horsepower(torque, rpm)
            
            # Introduce a realistic thermal spike between step 60 and 95
            if 60 <= i <= 95:
                coolant = 98.0 + ((i - 60) * 0.22)  # Peaks at 105.7°C
            else:
                coolant = 91.0 + (math.sin(i / 10.0) * 3.0)
                
            engine_temp = coolant + 6.0
            speed = 40.0 + (rpm / 65.0)
            load = 45.0 + (throttle := 28.0 + (math.sin(i / 8.0) * 16.0))
            
            db.add(EngineTelemetry(
                vehicle_id=v2.id,
                timestamp=t,
                rpm=round(rpm, 1),
                torque_nm=round(torque, 1),
                horsepower=hp,
                engine_temp_c=round(engine_temp, 1),
                coolant_temp_c=round(coolant, 1),
                engine_load_pct=round(load, 1),
                throttle_pos_pct=round(throttle, 1),
                speed_kmph=round(max(20.0, speed), 1)
            ))
            
            # Fuel telemetry (diesel rate ~ 3.5 - 6.5 L/h)
            fuel_rate = 3.6 + (torque / 110.0) + (throttle / 20.0)
            mileage = calculate_mileage(speed, fuel_rate)
            db.add(FuelTelemetry(
                vehicle_id=v2.id,
                timestamp=t,
                fuel_rate_lph=round(fuel_rate, 2),
                speed_kmph=round(speed, 1),
                fuel_level_pct=round(52.0 - (i * 0.05), 1),
                fuel_consumed_liters=round(fuel_rate * (15.0 / 3600.0), 3),
                distance_km=round(speed * (15.0 / 3600.0), 3),
                mileage_kmpl=mileage,
                throttle_pos_pct=round(throttle, 1),
                engine_load_pct=round(load, 1)
            ))
            
            # Electrical telemetry (Low resting voltage ~ 11.75V, charging at 13.9V)
            bat_v = 11.75 + (0.1 if i > 30 else 0.0)
            alt_v = 13.85 + (math.sin(i / 10.0) * 0.1)
            db.add(ElectricalTelemetry(
                vehicle_id=v2.id,
                timestamp=t,
                battery_voltage=round(bat_v, 2),
                alternator_voltage=round(alt_v, 2),
                current_draw_amps=round(22.0 + (math.cos(i / 5.0) * 4.0), 1),
                battery_soc_pct=round(68.0 - (i * 0.03), 1),
                charging_status="normal"
            ))
            
        # Maintenance Records for V2 (Overdue Oil & Filter)
        db.add(MaintenanceRecord(
            vehicle_id=v2.id,
            service_name="Engine Oil & Filter Replacement",
            service_type="routine",
            service_date=now - timedelta(days=230),
            odometer_km=30000.0,
            cost=4200.0,
            status="overdue",
            notes="12,850 km driven since last drain. Exceeded 10,000 km threshold.",
            interval_km=10000.0,
            interval_days=180
        ))
        db.add(MaintenanceRecord(
            vehicle_id=v2.id,
            service_name="Engine Air Filter Replacement",
            service_type="routine",
            service_date=now - timedelta(days=230),
            odometer_km=30000.0,
            cost=950.0,
            status="overdue",
            notes="Air filter inspection recommended immediately.",
            interval_km=15000.0,
            interval_days=365
        ))
        
        # Diagnostic Alerts for V2
        db.add(DiagnosticAlert(
            vehicle_id=v2.id,
            rule_code="ENG-TMP-001",
            component="Engine Thermal Management",
            severity="critical",
            title="Coolant Temperature Elevated (105.7°C)",
            message_owner="Your engine coolant temperature is higher than the configured operating range. Allow the engine to cool down and arrange an inspection if the condition continues.",
            message_mechanic="Coolant temperature peaked at 105.7°C (>102°C threshold). Radiator thermal delta indicates possible debris occlusion or sticky thermostat bypass valve.",
            trigger_value=105.7,
            threshold_value=102.0,
            timestamp=now - timedelta(minutes=45),
            status="active"
        ))
        db.add(DiagnosticAlert(
            vehicle_id=v2.id,
            rule_code="ELE-BAT-001",
            component="Electrical Starting System",
            severity="warning",
            title="Low Battery Resting Voltage (11.75V)",
            message_owner="Your battery voltage is lower than normal. Your car might have trouble starting if parked for an extended duration.",
            message_mechanic="Battery open circuit resting voltage logged at 11.75V (<11.90V). Recommend 100A carbon pile conductance test to assess internal cell sulfation.",
            trigger_value=11.75,
            threshold_value=11.90,
            timestamp=now - timedelta(hours=1, minutes=15),
            status="active"
        ))
        
        # Recommendations for V2
        db.add(Recommendation(
            vehicle_id=v2.id,
            category="engine",
            priority="high",
            title="Inspect Radiator & Coolant Circulation Loop",
            description_owner="Your engine has been running warmer than normal. A quick cooling system check will prevent potential roadside breakdowns.",
            description_mechanic="Pressure-test cooling loop at 1.1 bar, verify auxiliary cooling fan actuation, and flush cooling lines.",
            action_needed="Schedule urgent coolant flush and radiator fin inspection.",
            estimated_savings=14500.0,
            status="pending"
        ))
        db.add(Recommendation(
            vehicle_id=v2.id,
            category="maintenance",
            priority="high",
            title="Urgent Engine Oil & Filter Renewal",
            description_owner="Your diesel engine oil is overdue for renewal. Fresh synthetic oil will lower operating friction and cool the engine better.",
            description_mechanic="Drain degraded high-soot diesel engine oil and renew filter element with API CK-4 / ACEA C3 low-SAPS lubricant.",
            action_needed="Complete 40,000 km diesel oil service.",
            estimated_savings=9000.0,
            status="pending"
        ))
        db.add(Recommendation(
            vehicle_id=v2.id,
            category="electrical",
            priority="medium",
            title="Battery Conductance Test & Recharging",
            description_owner="Your battery is showing low voltage reserves. Have it tested to prevent unexpected failure to start.",
            description_mechanic="Test 12V AGM/lead-acid battery CCA and evaluate alternator regulator ripple under electrical load.",
            action_needed="Test battery CCA and check alternator belt tension.",
            estimated_savings=4000.0,
            status="pending"
        ))
        
        # Financials for V2
        db.add(FinancialRecord(vehicle_id=v2.id, expense_type="fuel", amount=4800.0, date=now - timedelta(days=5), description="HPCL Diesel fill (52 L)", odometer_km=42300.0))
        db.add(FinancialRecord(vehicle_id=v2.id, expense_type="fuel", amount=5100.0, date=now - timedelta(days=1), description="IOCL Diesel fill (55 L)", odometer_km=42850.0))
        db.add(FinancialRecord(vehicle_id=v2.id, expense_type="maintenance", amount=5150.0, date=now - timedelta(days=230), description="30,000 km Scheduled Service at Mahindra Service Center", odometer_km=30000.0))
        db.add(FinancialRecord(vehicle_id=v2.id, expense_type="insurance", amount=22400.0, date=now - timedelta(days=180), description="Comprehensive Zero-Depreciation Insurance", odometer_km=25000.0))
        
    db.commit()
    print("Database demo data seeded successfully.")
