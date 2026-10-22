import io
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple
from app.services.engine.calculator import calculate_horsepower
from app.services.fuel.calculator import calculate_mileage

def parse_csv_file(content_bytes: bytes, file_type: str) -> Tuple[List[Dict[str, Any]], int, int, str]:
    """
    Parses CSV content bytes, normalizes column names, applies calculations, and validates data.
    Returns: (parsed_rows, valid_count, invalid_count, status_message)
    """
    try:
        df = pd.read_csv(io.BytesIO(content_bytes))
    except Exception as e:
        return [], 0, 0, f"Failed to parse CSV file: {str(e)}"
        
    if df.empty:
        return [], 0, 0, "Uploaded CSV file is empty."
        
    # Normalize column names: lowercase, trim, replace spaces/dashes with underscores
    df.columns = [str(col).strip().lower().replace(" ", "_").replace("-", "_") for col in df.columns]
    
    parsed_rows = []
    valid_count = 0
    invalid_count = 0
    
    for idx, row in df.iterrows():
        try:
            row_dict = row.to_dict()
            # Clean NaN to None or 0.0
            cleaned_row = {}
            for k, v in row_dict.items():
                if pd.isna(v):
                    cleaned_row[k] = None
                else:
                    cleaned_row[k] = v
                    
            if file_type == "engine":
                rpm = float(cleaned_row.get("rpm", 0.0) or 0.0)
                torque = float(cleaned_row.get("torque_nm", cleaned_row.get("torque", 0.0)) or 0.0)
                hp = cleaned_row.get("horsepower", cleaned_row.get("hp"))
                if hp is None or float(hp) <= 0:
                    hp = calculate_horsepower(torque, rpm)
                else:
                    hp = float(hp)
                    
                parsed_rows.append({
                    "timestamp": cleaned_row.get("timestamp") or datetime.now(timezone.utc).isoformat(),
                    "rpm": rpm,
                    "torque_nm": torque,
                    "horsepower": hp,
                    "engine_temp_c": float(cleaned_row.get("engine_temperature_c", cleaned_row.get("engine_temp_c", 85.0)) or 85.0),
                    "coolant_temp_c": float(cleaned_row.get("coolant_temperature_c", cleaned_row.get("coolant_temp_c", 88.0)) or 88.0),
                    "engine_load_pct": float(cleaned_row.get("engine_load_percent", cleaned_row.get("engine_load_pct", 35.0)) or 35.0),
                    "throttle_pos_pct": float(cleaned_row.get("throttle_position_percent", cleaned_row.get("throttle_pos_pct", 20.0)) or 20.0),
                    "speed_kmph": float(cleaned_row.get("speed_kmph", cleaned_row.get("speed", 45.0)) or 45.0)
                })
                valid_count += 1
                
            elif file_type == "fuel":
                speed = float(cleaned_row.get("speed_kmph", cleaned_row.get("speed", 50.0)) or 50.0)
                rate = float(cleaned_row.get("fuel_rate_lph", cleaned_row.get("fuel_rate", 3.2)) or 3.2)
                mileage = cleaned_row.get("mileage_kmpl", cleaned_row.get("mileage"))
                if mileage is None or float(mileage) <= 0:
                    mileage = calculate_mileage(speed, rate)
                else:
                    mileage = float(mileage)
                    
                parsed_rows.append({
                    "timestamp": cleaned_row.get("timestamp") or datetime.now(timezone.utc).isoformat(),
                    "fuel_rate_lph": rate,
                    "speed_kmph": speed,
                    "fuel_level_pct": float(cleaned_row.get("fuel_level_percent", cleaned_row.get("fuel_level_pct", 65.0)) or 65.0),
                    "fuel_consumed_liters": float(cleaned_row.get("fuel_consumed_liters", 0.0) or 0.0),
                    "distance_km": float(cleaned_row.get("distance_km", 0.0) or 0.0),
                    "mileage_kmpl": mileage,
                    "throttle_pos_pct": float(cleaned_row.get("throttle_pos_pct", 0.0) or 0.0),
                    "engine_load_pct": float(cleaned_row.get("engine_load_pct", 0.0) or 0.0)
                })
                valid_count += 1
                
            elif file_type == "electrical":
                bat_v = float(cleaned_row.get("battery_voltage", 12.5) or 12.5)
                alt_v = float(cleaned_row.get("alternator_voltage", 14.1) or 14.1)
                curr = float(cleaned_row.get("current_draw_amps", cleaned_row.get("current_draw", 14.0)) or 14.0)
                soc = float(cleaned_row.get("battery_soc_percent", cleaned_row.get("battery_soc_pct", 88.0)) or 88.0)
                
                parsed_rows.append({
                    "timestamp": cleaned_row.get("timestamp") or datetime.now(timezone.utc).isoformat(),
                    "battery_voltage": bat_v,
                    "alternator_voltage": alt_v,
                    "current_draw_amps": curr,
                    "battery_soc_pct": soc,
                    "charging_status": str(cleaned_row.get("charging_status", "normal"))
                })
                valid_count += 1
                
            elif file_type == "maintenance":
                parsed_rows.append({
                    "service_name": str(cleaned_row.get("service_name", "Scheduled Inspection")),
                    "service_type": str(cleaned_row.get("service_type", "routine")),
                    "service_date": cleaned_row.get("service_date") or datetime.now(timezone.utc).isoformat(),
                    "odometer_km": float(cleaned_row.get("odometer_km", 0.0) or 0.0),
                    "cost": float(cleaned_row.get("cost", 0.0) or 0.0),
                    "status": str(cleaned_row.get("status", "completed")),
                    "notes": str(cleaned_row.get("notes", "") or ""),
                    "interval_km": float(cleaned_row.get("interval_km", 10000.0) or 10000.0),
                    "interval_days": int(cleaned_row.get("interval_days", 180) or 180)
                })
                valid_count += 1
                
            elif file_type == "diagnostic":
                parsed_rows.append({
                    "rule_code": str(cleaned_row.get("rule_code", "GEN-001")),
                    "component": str(cleaned_row.get("component", "General Subsystem")),
                    "severity": str(cleaned_row.get("severity", "info")),
                    "title": str(cleaned_row.get("title", "Telemetry Notice")),
                    "message_owner": str(cleaned_row.get("message_owner", "Observation logged during vehicle operation.")),
                    "message_mechanic": str(cleaned_row.get("message_mechanic", "Parameter observation within acceptable threshold.")),
                    "trigger_value": float(cleaned_row.get("trigger_value", 0.0) or 0.0),
                    "threshold_value": float(cleaned_row.get("threshold_value", 0.0) or 0.0),
                    "timestamp": cleaned_row.get("timestamp") or datetime.now(timezone.utc).isoformat(),
                    "status": str(cleaned_row.get("status", "active"))
                })
                valid_count += 1
                
            else:
                invalid_count += 1
        except Exception:
            invalid_count += 1
            
    return parsed_rows, valid_count, invalid_count, f"Processed {valid_count} valid rows and {invalid_count} invalid rows."
