from typing import List, Dict, Any

def summarize_financials(records: List[Dict[str, Any]], current_odometer: float) -> Dict[str, Any]:
    if not records:
        return {
            "total_expenses": 0.0,
            "cost_per_km": 0.0,
            "category_breakdown": {},
            "monthly_trends": []
        }
        
    total_spent = sum(r.get("amount", 0.0) for r in records)
    cost_per_km = round(total_spent / current_odometer, 2) if current_odometer > 0 else 0.0
    
    breakdown = {}
    for r in records:
        cat = r.get("expense_type", "other").capitalize()
        breakdown[cat] = round(breakdown.get(cat, 0.0) + r.get("amount", 0.0), 2)
        
    return {
        "total_expenses": round(total_spent, 2),
        "cost_per_km": cost_per_km,
        "category_breakdown": breakdown,
        "records_count": len(records)
    }
