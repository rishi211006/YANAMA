from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, ConfigDict

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "owner"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Vehicle schemas
class VehicleBase(BaseModel):
    registration_number: str
    manufacturer: str
    model: str
    year: int
    fuel_type: str
    engine_capacity_cc: int
    transmission: str = "manual"
    odometer_km: float = 0.0
    vin: Optional[str] = None
    nickname: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    engine_capacity_cc: Optional[int] = None
    transmission: Optional[str] = None
    odometer_km: Optional[float] = None
    vin: Optional[str] = None
    nickname: Optional[str] = None

class VehicleResponse(VehicleBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Telemetry schemas
class EngineTelemetryCreate(BaseModel):
    timestamp: Optional[datetime] = None
    rpm: float
    torque_nm: float
    horsepower: Optional[float] = None
    engine_temp_c: float
    coolant_temp_c: float
    engine_load_pct: float
    throttle_pos_pct: float
    speed_kmph: float

class EngineTelemetryResponse(EngineTelemetryCreate):
    id: int
    vehicle_id: int
    horsepower: float
    model_config = ConfigDict(from_attributes=True)

class FuelTelemetryCreate(BaseModel):
    timestamp: Optional[datetime] = None
    fuel_rate_lph: float
    speed_kmph: float
    fuel_level_pct: float
    fuel_consumed_liters: Optional[float] = 0.0
    distance_km: Optional[float] = 0.0
    mileage_kmpl: Optional[float] = None
    throttle_pos_pct: Optional[float] = 0.0
    engine_load_pct: Optional[float] = 0.0

class FuelTelemetryResponse(FuelTelemetryCreate):
    id: int
    vehicle_id: int
    mileage_kmpl: float
    model_config = ConfigDict(from_attributes=True)

class ElectricalTelemetryCreate(BaseModel):
    timestamp: Optional[datetime] = None
    battery_voltage: float
    alternator_voltage: float
    current_draw_amps: float
    battery_soc_pct: float
    charging_status: Optional[str] = "normal"

class ElectricalTelemetryResponse(ElectricalTelemetryCreate):
    id: int
    vehicle_id: int
    model_config = ConfigDict(from_attributes=True)

# Maintenance schemas
class MaintenanceCreate(BaseModel):
    service_name: str
    service_type: str = "routine"
    service_date: Optional[datetime] = None
    odometer_km: float
    cost: float = 0.0
    status: str = "completed"
    notes: Optional[str] = None
    interval_km: Optional[float] = 10000.0
    interval_days: Optional[int] = 180

class MaintenanceResponse(MaintenanceCreate):
    id: int
    vehicle_id: int
    model_config = ConfigDict(from_attributes=True)

# Diagnostic Alert schemas
class AlertResponse(BaseModel):
    id: int
    vehicle_id: int
    rule_code: str
    component: str
    severity: str
    title: str
    message_owner: str
    message_mechanic: str
    trigger_value: Optional[float] = None
    threshold_value: Optional[float] = None
    timestamp: datetime
    status: str
    model_config = ConfigDict(from_attributes=True)

# Recommendation schemas
class RecommendationResponse(BaseModel):
    id: int
    vehicle_id: int
    category: str
    priority: str
    title: str
    description_owner: str
    description_mechanic: str
    action_needed: str
    estimated_savings: float
    created_at: datetime
    status: str
    model_config = ConfigDict(from_attributes=True)

# Financial Record schemas
class FinancialCreate(BaseModel):
    expense_type: str
    amount: float
    date: Optional[datetime] = None
    description: Optional[str] = None
    odometer_km: Optional[float] = None

class FinancialResponse(FinancialCreate):
    id: int
    vehicle_id: int
    model_config = ConfigDict(from_attributes=True)

# Analytics schemas
class HealthScoreResponse(BaseModel):
    vehicle_id: int
    overall_score: float
    grade: str
    engine_score: float
    fuel_score: float
    electrical_score: float
    maintenance_score: float
    diagnostic_score: float
    summary: str
    status: str

class EngineAnalyticsSummary(BaseModel):
    vehicle_id: int
    total_readings: int
    avg_rpm: float
    max_rpm: float
    avg_torque: float
    max_torque: float
    avg_horsepower: float
    max_horsepower: float
    avg_coolant_temp: float
    max_coolant_temp: float
    thermal_stress_events: int
    readings: List[Dict[str, Any]]

class ElectricalAnalyticsSummary(BaseModel):
    vehicle_id: int
    battery_health_pct: float
    alternator_status: str
    avg_battery_voltage: float
    min_battery_voltage: float
    avg_alternator_voltage: float
    avg_current_draw: float
    voltage_stability_score: float
    readings: List[Dict[str, Any]]

# Advanced Analytics Schemas
class StatisticalEngineResponse(BaseModel):
    vehicle_id: int
    metric: str
    total_samples: int
    p25: float
    p50: float
    p75: float
    p95: float
    min_val: float
    max_val: float
    mean: float
    std_dev: float
    histogram: List[Dict[str, Any]]
    trend_slope: float
    trend_direction: str
    anomaly_count: int
    ai_interpretation_owner: str
    ai_interpretation_mechanic: str

class TripSimulationRequest(BaseModel):
    trip_distance_km: float
    terrain_type: str = "mixed"  # highway, city, mountain, mixed
    load_condition: str = "medium"  # light, medium, heavy
    duration_days: int = 1

class TripSimulationResponse(BaseModel):
    vehicle_id: int
    trip_distance_km: float
    terrain_type: str
    load_condition: str
    current_readiness_score: float
    serviced_readiness_score: float
    current_fuel_needed_liters: float
    serviced_fuel_needed_liters: float
    current_fuel_cost_est: float
    serviced_fuel_cost_est: float
    potential_fuel_savings: float
    risk_factors: List[Dict[str, Any]]
    required_services: List[Dict[str, Any]]
    ai_recommendation_owner: str
    ai_recommendation_mechanic: str

class MileageAnalyticsResponse(BaseModel):
    vehicle_id: int
    current_average_kmpl: float
    historical_peak_kmpl: float
    recent_trend_pct: float
    efficiency_rating: str
    drop_rise_factors: List[Dict[str, Any]]
    trip_history: List[Dict[str, Any]]
    ai_actionable_recommendations: List[Dict[str, Any]]
    ai_narrative_owner: str
    ai_narrative_mechanic: str
