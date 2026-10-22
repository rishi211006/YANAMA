import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_login_demo_user():
    res = client.post("/api/auth/login", json={"email": "demo@yanama.ai", "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "demo@yanama.ai"

def test_get_vehicles():
    res = client.get("/api/vehicles")
    assert res.status_code == 200
    vehicles = res.json()
    assert len(vehicles) >= 2
    assert any(v["fuel_type"] == "petrol" for v in vehicles)
    assert any(v["fuel_type"] == "diesel" for v in vehicles)

def test_statistical_engine_api():
    res = client.get("/api/analytics/1/engine/statistical?metric=rpm")
    assert res.status_code == 200
    data = res.json()
    assert data["metric"] == "rpm"
    assert "p50" in data
    assert "histogram" in data
    assert len(data["ai_interpretation_owner"]) > 20
    assert len(data["ai_interpretation_mechanic"]) > 20

def test_trip_simulation_api():
    payload = {
        "trip_distance_km": 420.0,
        "terrain_type": "mountain",
        "load_condition": "heavy",
        "duration_days": 2
    }
    res = client.post("/api/analytics/2/trip/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["trip_distance_km"] == 420.0
    assert "current_readiness_score" in data
    assert "serviced_readiness_score" in data
    assert len(data["required_services"]) > 0

def test_mileage_analysis_api():
    res = client.get("/api/analytics/1/mileage/analysis")
    assert res.status_code == 200
    data = res.json()
    assert "current_average_kmpl" in data
    assert "drop_rise_factors" in data
    assert "ai_actionable_recommendations" in data

def test_download_pdf_report():
    res = client.get("/api/reports/1/pdf")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
