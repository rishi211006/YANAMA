import pytest
from app.services.engine.calculator import calculate_horsepower
from app.services.fuel.calculator import calculate_mileage
from app.services.diagnostics.rules_engine import evaluate_diagnostics
from app.services.advanced.statistical_engine import compute_metric_statistics
from app.services.advanced.trip_simulator import simulate_trip
from app.services.advanced.mileage_analyzer import analyze_mileage_performance

def test_horsepower_calculation():
    # Torque 175 Nm at 2800 RPM -> (175 * 2800) / 7120.7 = 68.81 HP
    hp = calculate_horsepower(175.0, 2800.0)
    assert hp > 65.0 and hp < 72.0
    assert calculate_horsepower(0, 2000) == 0.0

def test_mileage_calculation():
    # 60 km/h at 4.0 L/h = 15.0 km/L
    kmpl = calculate_mileage(60.0, 4.0)
    assert kmpl == 15.0
    assert calculate_mileage(0, 4.0) == 0.0

def test_rules_engine_diagnostics():
    engine_readings = [
        {"coolant_temp_c": 105.8, "rpm": 2500.0},
        {"coolant_temp_c": 89.0, "rpm": 5700.0}
    ]
    electrical_readings = [
        {"battery_voltage": 11.75, "alternator_voltage": 14.1}
    ]
    alerts = evaluate_diagnostics(engine_readings, electrical_readings)
    codes = [a["rule_code"] for a in alerts]
    assert "ENG-TMP-001" in codes
    assert "ENG-RPM-002" in codes
    assert "ELE-BAT-001" in codes

def test_statistical_engine():
    data = [{"rpm": 1500 + i * 50} for i in range(20)]
    stats = compute_metric_statistics(data, "rpm")
    assert stats["total_samples"] == 20
    assert stats["p50"] > 1800
    assert stats["trend_slope"] > 0
    assert len(stats["histogram"]) > 0
    assert "revved" in stats["ai_interpretation_owner"].lower() or "rpm" in stats["ai_interpretation_owner"].lower()

def test_trip_simulation():
    res = simulate_trip(
        trip_distance_km=300.0,
        terrain_type="mountain",
        load_condition="heavy",
        duration_days=2,
        current_health_score=70.0,
        maintenance_records=[{"service_name": "Engine Oil & Filter Replacement", "status": "overdue"}],
        diagnostic_alerts=[{"rule_code": "ENG-TMP-001", "status": "active", "title": "Coolant Temp Elevated"}],
        avg_mileage=14.0,
        fuel_type="petrol"
    )
    assert res["trip_distance_km"] == 300.0
    assert res["current_readiness_score"] < res["serviced_readiness_score"]
    assert len(res["risk_factors"]) > 0
    assert len(res["required_services"]) > 0
    assert "trip" in res["ai_recommendation_owner"].lower()

def test_mileage_analysis():
    fuel_data = [{"mileage_kmpl": 14.5 + (i % 3)} for i in range(25)]
    engine_data = [{"coolant_temp_c": 90.0, "throttle_pos_pct": 30.0}]
    maint_data = [{"service_name": "Engine Air Filter", "status": "overdue"}]
    res = analyze_mileage_performance(fuel_data, engine_data, maint_data, "petrol")
    assert res["current_average_kmpl"] > 10.0
    assert len(res["drop_rise_factors"]) > 0
    assert len(res["ai_actionable_recommendations"]) > 0
