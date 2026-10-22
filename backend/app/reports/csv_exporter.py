import csv
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
from app.core.config import settings

def export_telemetry_csv(vehicle_reg: str, telemetry_type: str, records: List[Dict[str, Any]]) -> str:
    """
    Exports processed vehicle telemetry dataset as a downloadable CSV file.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_reg = vehicle_reg.replace("-", "_")
    filename = f"YANAMA_{telemetry_type}_{clean_reg}_{timestamp}.csv"
    file_path = str(settings.REPORTS_DIR / filename)
    
    if not records:
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            f.write("message\nNo data records found for this export request.\n")
        return file_path
        
    fieldnames = list(records[0].keys())
    with open(file_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            writer.writerow(r)
            
    return file_path
