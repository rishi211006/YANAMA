export type UserRole = 'owner' | 'mechanic';
export type FuelType = 'petrol' | 'diesel';
export type ViewMode = 'owner' | 'mechanic';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Vehicle {
  id: number;
  user_id: number;
  registration_number: string;
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: FuelType;
  engine_capacity_cc: number;
  transmission: string;
  odometer_km: number;
  vin?: string;
  nickname?: string;
  created_at: string;
}

export interface HealthScore {
  vehicle_id: number;
  overall_score: number;
  grade: string;
  engine_score: number;
  fuel_score: number;
  electrical_score: number;
  maintenance_score: number;
  diagnostic_score: number;
  summary: string;
  status: string;
}

export interface EngineReading {
  id: number;
  timestamp: string;
  rpm: number;
  torque_nm: number;
  horsepower: number;
  engine_temp_c: number;
  coolant_temp_c: number;
  engine_load_pct: number;
  throttle_pos_pct: number;
  speed_kmph: number;
}

export interface EngineSummary {
  vehicle_id: number;
  total_readings: number;
  avg_rpm: number;
  max_rpm: number;
  avg_torque: number;
  max_torque: number;
  avg_horsepower: number;
  max_horsepower: number;
  avg_coolant_temp: number;
  max_coolant_temp: number;
  thermal_stress_events: number;
  readings: EngineReading[];
}

export interface ElectricalSummary {
  vehicle_id: number;
  battery_health_pct: number;
  alternator_status: string;
  avg_battery_voltage: number;
  min_battery_voltage: number;
  avg_alternator_voltage: number;
  avg_current_draw: number;
  voltage_stability_score: number;
  readings: Array<{
    id: number;
    timestamp: string;
    battery_voltage: number;
    alternator_voltage: number;
    current_draw_amps: number;
    battery_soc_pct: number;
    charging_status: string;
  }>;
}

export interface DiagnosticAlert {
  id: number;
  vehicle_id: number;
  rule_code: string;
  component: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message_owner: string;
  message_mechanic: string;
  trigger_value?: number;
  threshold_value?: number;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface Recommendation {
  id: number;
  vehicle_id: number;
  category: 'engine' | 'fuel' | 'electrical' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description_owner: string;
  description_mechanic: string;
  action_needed: string;
  estimated_savings: number;
  created_at: string;
  status: 'pending' | 'applied' | 'dismissed';
}

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  service_name: string;
  service_type: string;
  service_date: string;
  odometer_km: number;
  cost: number;
  status: 'completed' | 'due' | 'overdue';
  notes?: string;
  interval_km: number;
  interval_days: number;
}

export interface MaintenanceScheduleItem {
  service_name: string;
  service_type: string;
  interval_km: number;
  interval_days: number;
  status: 'completed' | 'due' | 'overdue';
  estimated_cost: number;
}

export interface FinancialSummary {
  total_expenses: number;
  cost_per_km: number;
  category_breakdown: Record<string, number>;
  records_count: number;
  records: Array<{
    id: number;
    expense_type: string;
    amount: number;
    date: string;
    description: string;
    odometer_km: number;
  }>;
}

export interface StatisticalEngineData {
  vehicle_id: number;
  metric: string;
  total_samples: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  min_val: number;
  max_val: number;
  mean: number;
  std_dev: number;
  histogram: Array<{
    bin: string;
    range_start: number;
    range_end: number;
    count: number;
  }>;
  trend_slope: number;
  trend_direction: string;
  anomaly_count: number;
  ai_interpretation_owner: string;
  ai_interpretation_mechanic: string;
}

export interface TripSimulationResult {
  vehicle_id: number;
  trip_distance_km: number;
  terrain_type: string;
  load_condition: string;
  current_readiness_score: number;
  serviced_readiness_score: number;
  current_fuel_needed_liters: number;
  serviced_fuel_needed_liters: number;
  current_fuel_cost_est: number;
  serviced_fuel_cost_est: number;
  potential_fuel_savings: number;
  risk_factors: Array<{
    name: string;
    severity: string;
    description: string;
  }>;
  required_services: Array<{
    service: string;
    urgency: string;
    estimated_cost: number;
    benefit: string;
  }>;
  ai_recommendation_owner: string;
  ai_recommendation_mechanic: string;
}

export interface MileageAnalyticsData {
  vehicle_id: number;
  current_average_kmpl: number;
  historical_peak_kmpl: number;
  recent_trend_pct: number;
  efficiency_rating: string;
  drop_rise_factors: Array<{
    factor: string;
    impact: string;
    direction: 'drop' | 'rise';
    severity: string;
    detail: string;
  }>;
  trip_history: Array<{
    index: number;
    timestamp: string;
    mileage_kmpl: number;
    speed_kmph: number;
    fuel_rate_lph: number;
  }>;
  ai_actionable_recommendations: Array<{
    action: string;
    potential_gain: string;
    difficulty: string;
    description: string;
  }>;
  ai_narrative_owner: string;
  ai_narrative_mechanic: string;
}
