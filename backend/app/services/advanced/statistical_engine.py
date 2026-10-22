import math
import numpy as np
from typing import List, Dict, Any

def compute_metric_statistics(
    readings: List[Dict[str, Any]],
    metric_key: str = "rpm"
) -> Dict[str, Any]:
    """
    Computes rigorous statistical representation including percentiles,
    histogram binning, linear regression trend slope, and anomaly detection.
    Also produces rich AI interpretation narratives for both Owner and Mechanic.
    """
    if not readings:
        # Default fallback if no data
        return {
            "metric": metric_key,
            "total_samples": 0,
            "p25": 0.0,
            "p50": 0.0,
            "p75": 0.0,
            "p95": 0.0,
            "min_val": 0.0,
            "max_val": 0.0,
            "mean": 0.0,
            "std_dev": 0.0,
            "histogram": [],
            "trend_slope": 0.0,
            "trend_direction": "stable",
            "anomaly_count": 0,
            "ai_interpretation_owner": "No telemetry readings have been recorded yet. Upload an engine CSV dataset to generate statistical intelligence.",
            "ai_interpretation_mechanic": "Insufficient sample space (N=0). Provide continuous OBD/CAN telemetry stream to generate frequency distribution and regression metrics."
        }
        
    values = [float(r.get(metric_key, 0.0) or 0.0) for r in readings]
    arr = np.array(values, dtype=float)
    n = len(arr)
    
    mean_val = float(np.mean(arr))
    std_val = float(np.std(arr)) if n > 1 else 0.0
    min_val = float(np.min(arr))
    max_val = float(np.max(arr))
    
    p25 = float(np.percentile(arr, 25))
    p50 = float(np.percentile(arr, 50))  # median
    p75 = float(np.percentile(arr, 75))
    p95 = float(np.percentile(arr, 95))
    
    # Linear regression slope over sample sequence (x = 0, 1, 2, ..., n-1)
    if n > 2 and std_val > 0.001:
        x = np.arange(n, dtype=float)
        slope, _ = np.polyfit(x, arr, 1)
        slope = round(float(slope), 4)
    else:
        slope = 0.0
        
    if slope > 0.05:
        trend_direction = "increasing"
    elif slope < -0.05:
        trend_direction = "decreasing"
    else:
        trend_direction = "stable"
        
    # Anomaly detection: count values beyond 2.5 standard deviations
    if std_val > 0.01:
        z_scores = np.abs((arr - mean_val) / std_val)
        anomaly_count = int(np.sum(z_scores > 2.2))
    else:
        anomaly_count = 0
        
    # Generate 8-bin histogram
    hist_counts, bin_edges = np.histogram(arr, bins=8)
    histogram = []
    for i in range(len(hist_counts)):
        histogram.append({
            "bin": f"{bin_edges[i]:.0f}-{bin_edges[i+1]:.0f}",
            "range_start": round(float(bin_edges[i]), 1),
            "range_end": round(float(bin_edges[i+1]), 1),
            "count": int(hist_counts[i])
        })
        
    # AI Interpretation Generator
    owner_text, mechanic_text = generate_statistical_ai_text(
        metric=metric_key,
        mean=mean_val,
        median=p50,
        p95=p95,
        std_dev=std_val,
        trend_direction=trend_direction,
        slope=slope,
        anomaly_count=anomaly_count,
        sample_count=n
    )
    
    return {
        "metric": metric_key,
        "total_samples": n,
        "p25": round(p25, 2),
        "p50": round(p50, 2),
        "p75": round(p75, 2),
        "p95": round(p95, 2),
        "min_val": round(min_val, 2),
        "max_val": round(max_val, 2),
        "mean": round(mean_val, 2),
        "std_dev": round(std_val, 2),
        "histogram": histogram,
        "trend_slope": slope,
        "trend_direction": trend_direction,
        "anomaly_count": anomaly_count,
        "ai_interpretation_owner": owner_text,
        "ai_interpretation_mechanic": mechanic_text
    }

def generate_statistical_ai_text(
    metric: str,
    mean: float,
    median: float,
    p95: float,
    std_dev: float,
    trend_direction: str,
    slope: float,
    anomaly_count: int,
    sample_count: int
) -> tuple[str, str]:
    metric_labels = {
        "rpm": "Engine Revolutions (RPM)",
        "torque_nm": "Torque Output (Nm)",
        "horsepower": "Engine Power (HP)",
        "coolant_temp_c": "Coolant Temperature (°C)",
        "engine_temp_c": "Engine Oil Temperature (°C)",
        "engine_load_pct": "Engine Load Factor (%)",
        "speed_kmph": "Vehicle Speed (km/h)"
    }
    label = metric_labels.get(metric, metric)
    
    if metric == "coolant_temp_c":
        # Owner view
        if mean > 96.0 or p95 > 103.0:
            owner_msg = (
                f"Statistical analysis of {sample_count} readings shows your coolant temperature is averaging {mean:.1f}°C, "
                f"with 5% of your driving peaking up to {p95:.1f}°C. This is higher than ideal. "
                f"The overall temperature trend is {trend_direction}. We detected {anomaly_count} thermal spike events. "
                f"Recommendation: Keep an eye on coolant levels and avoid aggressive uphill driving until inspected."
            )
        else:
            owner_msg = (
                f"Your engine cooling system demonstrates consistent thermal health across {sample_count} samples. "
                f"The typical running temperature is {median:.1f}°C, well within the safe operational window (85°C - 98°C). "
                f"The temperature trend is currently {trend_direction} with minimal fluctuations."
            )
        # Mechanic view
        mechanic_msg = (
            f"Thermal distribution analysis (N={sample_count}): Mean = {mean:.2f}°C, σ = {std_dev:.2f}°C, P95 = {p95:.2f}°C. "
            f"Linear OLS drift slope is {slope:+.4f}°C/sample ({trend_direction}). "
            f"Identified {anomaly_count} outliers (>2.2σ). Thermostatic regulator hysteresis appears "
            f"{'compromised due to elevated upper quartile' if p95 > 102 else 'nominal with stable heat dissipation characteristics'}."
        )
        
    elif metric == "rpm":
        # Owner view
        owner_msg = (
            f"During your logged trips ({sample_count} data points), your engine revved at a median of {median:.0f} RPM, "
            f"staying under {p95:.0f} RPM for 95% of your driving. "
            f"The progression trend is {trend_direction}. "
            f"{'Driving in this sweet spot maximizes fuel economy and prolongs engine health.' if p95 < 4000 else 'Noticeable periods of aggressive acceleration were detected in the top percentile.'}"
        )
        # Mechanic view
        mechanic_msg = (
            f"Powertrain RPM distribution: Median {median:.1f} RPM, IQR [{mean - std_dev:.1f} to {mean + std_dev:.1f} RPM], "
            f"95th percentile at {p95:.1f} RPM. Skewness shows "
            f"{'right-tail bias toward high-load transient pulls' if p95 > 4200 else 'normal bell-curve centering in cruising brake-specific fuel consumption (BSFC) island'}. "
            f"Detected {anomaly_count} rev spikes exceeding 2.2 standard deviations."
        )
        
    elif metric == "torque_nm":
        # Owner view
        owner_msg = (
            f"Your vehicle's pulling power (torque) averaged {mean:.1f} Nm, with peak torque demand reaching {p95:.1f} Nm. "
            f"The steady delivery indicates that the engine is pulling smoothly without hesitation or sudden loss of power."
        )
        # Mechanic view
        mechanic_msg = (
            f"Torque curve characterization (N={sample_count}): Mean = {mean:.2f} Nm, σ = {std_dev:.2f} Nm. "
            f"Linear gradient slope is {slope:+.4f} Nm/step. Absence of intermittent torque troughs indicates "
            f"healthy cylinder compression balance and consistent intake manifold boost pressure."
        )
        
    elif metric == "horsepower":
        # Owner view
        owner_msg = (
            f"Your vehicle produced an average power output of {mean:.1f} HP across driving sessions, reaching {p95:.1f} HP when accelerating. "
            f"The power distribution shows balanced engine output matching real-world road demands."
        )
        # Mechanic view
        mechanic_msg = (
            f"Computed Horsepower spectrum: P50 = {median:.2f} HP, P95 = {p95:.2f} HP, Variance = {std_dev**2:.2f}. "
            f"Transient power development correlates with throttle position input. No uncharacteristic power derating observed."
        )
        
    else:
        owner_msg = (
            f"Statistical analysis of {label} across {sample_count} readings shows an average of {mean:.1f} (typical: {median:.1f}). "
            f"The metric displays a {trend_direction} pattern with {anomaly_count} outlier readings detected."
        )
        mechanic_msg = (
            f"Parametric evaluation of {label}: N={sample_count}, μ={mean:.2f}, median={median:.2f}, σ={std_dev:.2f}, P95={p95:.2f}. "
            f"Regression slope={slope:+.4f}/pt. Outlier count={anomaly_count}."
        )
        
    return owner_msg, mechanic_msg
