import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class UserRole(str, enum.Enum):
    OWNER = "owner"
    MECHANIC = "mechanic"

class FuelType(str, enum.Enum):
    PETROL = "petrol"
    DIESEL = "diesel"

class TransmissionType(str, enum.Enum):
    MANUAL = "manual"
    AUTOMATIC = "automatic"
    CVT = "cvt"
    DCT = "dct"

class AlertSeverity(str, enum.Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="owner")  # owner, mechanic
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    
    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    registration_number = Column(String(50), unique=True, index=True, nullable=False)
    manufacturer = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    fuel_type = Column(String(20), nullable=False)  # petrol, diesel
    engine_capacity_cc = Column(Integer, nullable=False)
    transmission = Column(String(20), default="manual")
    odometer_km = Column(Float, default=0.0)
    vin = Column(String(100), nullable=True)
    nickname = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    
    owner = relationship("User", back_populates="vehicles")
    engine_telemetry = relationship("EngineTelemetry", back_populates="vehicle", cascade="all, delete-orphan")
    fuel_telemetry = relationship("FuelTelemetry", back_populates="vehicle", cascade="all, delete-orphan")
    electrical_telemetry = relationship("ElectricalTelemetry", back_populates="vehicle", cascade="all, delete-orphan")
    maintenance_records = relationship("MaintenanceRecord", back_populates="vehicle", cascade="all, delete-orphan")
    diagnostic_alerts = relationship("DiagnosticAlert", back_populates="vehicle", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="vehicle", cascade="all, delete-orphan")
    financial_records = relationship("FinancialRecord", back_populates="vehicle", cascade="all, delete-orphan")
    reports = relationship("ReportRecord", back_populates="vehicle", cascade="all, delete-orphan")
    uploads = relationship("UploadRecord", back_populates="vehicle", cascade="all, delete-orphan")

class EngineTelemetry(Base):
    __tablename__ = "engine_telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    rpm = Column(Float, nullable=False)
    torque_nm = Column(Float, nullable=False)
    horsepower = Column(Float, nullable=False)
    engine_temp_c = Column(Float, nullable=False)
    coolant_temp_c = Column(Float, nullable=False)
    engine_load_pct = Column(Float, nullable=False)
    throttle_pos_pct = Column(Float, nullable=False)
    speed_kmph = Column(Float, nullable=False)
    
    vehicle = relationship("Vehicle", back_populates="engine_telemetry")

class FuelTelemetry(Base):
    __tablename__ = "fuel_telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    fuel_rate_lph = Column(Float, nullable=False)
    speed_kmph = Column(Float, nullable=False)
    fuel_level_pct = Column(Float, nullable=False)
    fuel_consumed_liters = Column(Float, default=0.0)
    distance_km = Column(Float, default=0.0)
    mileage_kmpl = Column(Float, nullable=False)
    throttle_pos_pct = Column(Float, default=0.0)
    engine_load_pct = Column(Float, default=0.0)
    
    vehicle = relationship("Vehicle", back_populates="fuel_telemetry")

class ElectricalTelemetry(Base):
    __tablename__ = "electrical_telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    battery_voltage = Column(Float, nullable=False)
    alternator_voltage = Column(Float, nullable=False)
    current_draw_amps = Column(Float, nullable=False)
    battery_soc_pct = Column(Float, nullable=False)
    charging_status = Column(String(50), default="normal")
    
    vehicle = relationship("Vehicle", back_populates="electrical_telemetry")

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    service_name = Column(String(150), nullable=False)
    service_type = Column(String(50), default="routine")  # routine, repair, inspection, recall
    service_date = Column(DateTime, default=utc_now)
    odometer_km = Column(Float, nullable=False)
    cost = Column(Float, default=0.0)
    status = Column(String(30), default="completed")  # completed, due, overdue
    notes = Column(Text, nullable=True)
    interval_km = Column(Float, default=10000.0)
    interval_days = Column(Integer, default=180)
    
    vehicle = relationship("Vehicle", back_populates="maintenance_records")

class DiagnosticAlert(Base):
    __tablename__ = "diagnostic_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    rule_code = Column(String(50), nullable=False)
    component = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)  # critical, warning, info
    title = Column(String(200), nullable=False)
    message_owner = Column(Text, nullable=False)
    message_mechanic = Column(Text, nullable=False)
    trigger_value = Column(Float, nullable=True)
    threshold_value = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=utc_now)
    status = Column(String(30), default="active")  # active, resolved
    
    vehicle = relationship("Vehicle", back_populates="diagnostic_alerts")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # engine, fuel, electrical, maintenance
    priority = Column(String(20), default="medium")  # high, medium, low
    title = Column(String(200), nullable=False)
    description_owner = Column(Text, nullable=False)
    description_mechanic = Column(Text, nullable=False)
    action_needed = Column(Text, nullable=False)
    estimated_savings = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utc_now)
    status = Column(String(30), default="pending")  # pending, applied, dismissed
    
    vehicle = relationship("Vehicle", back_populates="recommendations")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    expense_type = Column(String(50), nullable=False)  # fuel, maintenance, repair, insurance, tax, other
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=utc_now)
    description = Column(String(255), nullable=True)
    odometer_km = Column(Float, nullable=True)
    
    vehicle = relationship("Vehicle", back_populates="financial_records")

class ReportRecord(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    report_type = Column(String(20), default="pdf")  # pdf, csv
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_kb = Column(Float, default=0.0)
    generated_at = Column(DateTime, default=utc_now)
    
    vehicle = relationship("Vehicle", back_populates="reports")

class UploadRecord(Base):
    __tablename__ = "upload_records"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # engine, fuel, electrical, maintenance, diagnostic
    rows_count = Column(Integer, default=0)
    valid_rows = Column(Integer, default=0)
    invalid_rows = Column(Integer, default=0)
    status = Column(String(30), default="completed")
    uploaded_at = Column(DateTime, default=utc_now)
    
    vehicle = relationship("Vehicle", back_populates="uploads")
