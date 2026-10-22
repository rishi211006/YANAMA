import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Official YANAMA Brand Palette
    COLOR_BLACK = RGBColor(0x00, 0x00, 0x00)
    COLOR_DARK = RGBColor(0x1D, 0x1D, 0x1D)
    COLOR_CARD = RGBColor(0x4C, 0x46, 0x43)
    COLOR_SAGE = RGBColor(0xA5, 0xA7, 0x8F)
    COLOR_LIGHT = RGBColor(0xF0, 0xEF, 0xED)
    COLOR_GREEN = RGBColor(0x22, 0xC5, 0x5E)
    COLOR_AMBER = RGBColor(0xF5, 0x9E, 0x0B)
    COLOR_RED = RGBColor(0xEF, 0x44, 0x44)

    blank_layout = prs.slide_layouts[6]

    def add_base_slide(title_text, subtitle_text=None, category="YANAMA VEHICLE INTELLIGENCE"):
        slide = prs.slides.add_slide(blank_layout)
        
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_DARK
        bg.line.fill.background()

        # Header bar
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_cat = tf.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_SAGE
        p_cat.font.name = 'Consolas'

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_LIGHT
        p_title.font.name = 'Arial'

        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = COLOR_SAGE
            p_sub.font.name = 'Arial'

        # Bottom subtle footer line
        footer_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.02))
        footer_line.fill.solid()
        footer_line.fill.fore_color.rgb = COLOR_CARD
        footer_line.line.fill.background()

        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.35))
        tf_f = footer_box.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "YANAMA – Automotive Intelligence & Analytics Web Platform | Confidential Engineering Specification"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = COLOR_SAGE
        p_f.font.name = 'Consolas'

        return slide

    # ==========================================================
    # SLIDE 1: Title Slide
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BLACK
    bg1.line.fill.background()

    # Brand Title Card
    tcard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.2), Inches(10.33), Inches(5.1))
    tcard.fill.solid()
    tcard.fill.fore_color.rgb = COLOR_DARK
    tcard.line.color.rgb = COLOR_CARD
    tcard.line.width = Pt(1.5)

    tb = s1.shapes.add_textbox(Inches(2.0), Inches(1.6), Inches(9.33), Inches(4.3))
    tf1 = tb.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "AUTOMOTIVE PLATFORM PRESENTATION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p2 = tf1.add_paragraph()
    p2.text = "YANAMA"
    p2.font.size = Pt(48)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_LIGHT
    p2.font.name = 'Arial'

    p3 = tf1.add_paragraph()
    p3.text = "Vehicle Intelligence & Analytics"
    p3.font.size = Pt(22)
    p3.font.color.rgb = COLOR_SAGE
    p3.font.name = 'Arial'

    p4 = tf1.add_paragraph()
    p4.space_before = Pt(20)
    p4.text = (
        "Full-Stack Automotive Analytics Architecture featuring Rule-Based Diagnostics, "
        "Statistical Parametric Distributions, Road Trip Simulation, and AI Efficiency Agents.\n"
        "Supported Powertrains: Petrol & Diesel Vehicles | Decoupled CSV-First Pipeline"
    )
    p4.font.size = Pt(13)
    p4.font.color.rgb = COLOR_LIGHT
    p4.font.name = 'Arial'

    p5 = tf1.add_paragraph()
    p5.space_before = Pt(24)
    p5.text = "Built with FastAPI, React, TypeScript, Recharts, Pandas, and ReportLab"
    p5.font.size = Pt(11)
    p5.font.color.rgb = COLOR_SAGE
    p5.font.name = 'Consolas'

    # ==========================================================
    # SLIDE 2: Executive Summary & Dual-User Paradigm
    # ==========================================================
    s2 = add_base_slide(
        "Executive Summary & Dual-User Paradigm",
        "Empowering everyday car owners and technical mechanics from a single unified telemetry source",
        "01 / PLATFORM OVERVIEW"
    )

    # 3 Column Cards
    col_w = Inches(3.64)
    gap = Inches(0.38)
    
    # Col 1: Hardware-Free CSV First
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), col_w, Inches(4.9))
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_BLACK
    c1.line.color.rgb = COLOR_CARD
    tf = c1.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = "CSV-FIRST ARCHITECTURE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'
    
    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = "Decoupled Data Pipeline"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIGHT

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "• Direct hardware dependency eliminated: No live dongle, BLE tether, or SIM socket needed.\n\n"
        "• Onboard SD-card/microcontroller logs are ingested via standardized CSV files.\n\n"
        "• 5 Ingestion Schemas: Engine, Fuel Telemetry, Electrical, Maintenance Log, and Diagnostics.\n\n"
        "• Instant schema normalization, derived metric computation, and validation audits."
    )
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_LIGHT

    # Col 2: Car Owner View
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + col_w + gap, Inches(1.7), col_w, Inches(4.9))
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_BLACK
    c2.line.color.rgb = COLOR_CARD
    tf = c2.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = "PERSONA A: CAR OWNER"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'
    
    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = "Simple, Plain Language"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIGHT

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "• Plain English Diagnostic Insights: Explains root cause without confusing technical OBD codes.\n\n"
        "• Composite Vehicle Health Score (0-100) with letter grades (A/B/C/D).\n\n"
        "• Prioritized Action Items with estimated annual rupee savings.\n\n"
        "• Clear alerts: 'Engine running warmer than normal; allow cooling and inspect radiator.'"
    )
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_LIGHT

    # Col 3: Mechanic View
    c3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + (col_w + gap) * 2, Inches(1.7), col_w, Inches(4.9))
    c3.fill.solid()
    c3.fill.fore_color.rgb = COLOR_BLACK
    c3.line.color.rgb = COLOR_CARD
    tf = c3.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0.3)
    
    p = tf.paragraphs[0]
    p.text = "PERSONA B: MECHANIC"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'
    
    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = "In-Depth Engineering Specs"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIGHT

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "• Raw OBD/CAN Data Streams: Full sensor curves for RPM, Torque, Throttle %, and Voltages.\n\n"
        "• Parametric Standard Deviation (σ), regression drift slope, and anomaly counts.\n\n"
        "• Exact rule thresholds: 'Coolant exceeded 102.0°C; evaluate thermostat valve hysteresis.'\n\n"
        "• 1-Click PDF Engineering Audit & Processed CSV Dataset downloads."
    )
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_LIGHT

    # ==========================================================
    # SLIDE 3: System Architecture & Data Flow
    # ==========================================================
    s3 = add_base_slide(
        "End-to-End System Architecture",
        "Modular monolithic pipeline from onboard CSV collection to analytical intelligence",
        "02 / SYSTEM ARCHITECTURE"
    )

    # 4 Architecture Horizontal Layers
    layer_names = [
        ("1. VEHICLE TELEMETRY COLLECTION LAYER", "Hardware Loggers & OBD-II / CAN bus sensors collect raw engine, fuel, and electrical metrics without active cellular connection."),
        ("2. INGESTION, PARSING & DERIVATION ENGINE", "FastAPI backend validates columns, computes derived Horsepower & km/L, handles aliases, and flags anomalous records into SQLite / PostgreSQL."),
        ("3. ANALYTICAL INTELLIGENCE & HEURISTIC AGENTS", "Four dedicated engines: Rules Diagnostics, Statistical Engine (OLS + Bins), Trip Planner Simulation, and Volumetric Mileage Factor Attribution."),
        ("4. PRESENTATION & AUDIT EXPORT LAYER", "Vite + React + Tailwind + Recharts frontend with instant Owner/Mechanic mode toggle, ReportLab PDF generator, and RFC 4180 CSV export.")
    ]

    for idx, (title, desc) in enumerate(layer_names):
        y_pos = Inches(1.7 + (idx * 1.25))
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y_pos, Inches(11.73), Inches(1.08))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BLACK
        card.line.color.rgb = COLOR_SAGE if idx == 2 else COLOR_CARD
        card.line.width = Pt(1.5 if idx == 2 else 1)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.18)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_SAGE if idx == 2 else COLOR_LIGHT
        p.font.name = 'Consolas'

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_LIGHT
        p2.font.name = 'Arial'

    # ==========================================================
    # SLIDE 4: Mathematical Formulas & Physics Equations
    # ==========================================================
    s4 = add_base_slide(
        "Mathematical Formulas & Physics Modeling",
        "Exact deterministic equations powering derived metrics, statistical spectrums, and health scoring",
        "03 / MATHEMATICAL FORMULATION"
    )

    formulas = [
        ("Derived Metric Horsepower (HP)", "HP = (Torque_Nm * RPM) / 7120.7", "Computes metric brake horsepower dynamically from instantaneous torque (Nm) and engine revolutions per minute (RPM)."),
        ("Instantaneous & Trip Mileage (km/L)", "Mileage = Speed_kmph / FuelRate_Lph", "Calculates instantaneous fuel economy in kilometers per liter when fuel rate > 0.05 L/h, with physics capping at 40.0 km/L."),
        ("OLS Linear Regression Slope (m)", "m = [N*sum(xy) - sum(x)*sum(y)] / [N*sum(x^2) - (sum(x))^2]", "Ordinary Least Squares regression over telemetry sample sequence to identify parametric drift direction (increasing/decreasing)."),
        ("Telemetry Anomaly Z-Score", "Z = |x_i - mean| / std_dev, Flag if Z > 2.2", "Quantifies deviation from gaussian normal distribution to isolate transient spikes, sensor dropouts, and thermal runaways."),
        ("Multi-Subsystem Health Score", "Score = 0.25*Engine + 0.25*Diag + 0.20*Maint + 0.15*Elec + 0.15*Fuel", "Weighted composite health index (0 to 100) assessing thermal stress, active fault rules, overdue service km, battery health, and mileage.")
    ]

    for idx, (title, formula, explanation) in enumerate(formulas):
        y_pos = Inches(1.65 + (idx * 1.02))
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y_pos, Inches(11.73), Inches(0.92))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BLACK
        card.line.color.rgb = COLOR_CARD
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_top = Inches(0.12)

        p = tf.paragraphs[0]
        p.text = f"{title.upper()}:   "
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_SAGE
        p.font.name = 'Consolas'

        run = p.add_run()
        run.text = formula
        run.font.bold = True
        run.font.color.rgb = COLOR_LIGHT
        run.font.name = 'Consolas'

        p2 = tf.add_paragraph()
        p2.text = explanation
        p2.font.size = Pt(10)
        p2.font.color.rgb = COLOR_LIGHT
        p2.font.name = 'Arial'

    # ==========================================================
    # SLIDE 5: AI Models & Heuristic Intelligence Agents
    # ==========================================================
    s5 = add_base_slide(
        "AI Models & Heuristic Intelligence Architecture",
        "Deterministic, explainable rule-based intelligence agents eliminating LLM hallucinations",
        "04 / AI INTELLIGENCE AGENTS"
    )

    ai_agents = [
        ("AI STATISTICAL ENGINE AGENT", "statistical_engine.py", "Contextualizes distribution metrics (median, IQR, P95, regression slope) into natural language. In Owner mode, clarifies driving habits and engine longevity. In Mechanic mode, details BSFC islands, valve train harmonics, and thermal hysteresis."),
        ("AI TRIP READINESS AGENT", "trip_simulator.py", "Simulates vehicle condition across Highway, City, and Mountain terrains under varying payloads. Evaluates active faults (e.g. coolant spikes, battery sulfation) to generate a mandatory vs recommended workshop checklist and estimated fuel savings."),
        ("AI MILEAGE OPTIMIZER AGENT", "mileage_analyzer.py", "Correlates throttle position, engine temperature, and service history to attribute fuel economy loss to aggressive throttle (-1.8 km/L), lubrication drag (-1.4 km/L), or thermal loss (-0.9 km/L). Recommends 4 quantified recovery actions (+3.5 km/L)."),
        ("RULE-BASED DIAGNOSTIC MATRIX", "rules_engine.py", "Continuous threshold verification engine. Evaluates Coolant Overtemp (>102°C), Redline Stress (>5500 RPM), Battery Voltage (<11.9V), and Alternator Undercharge (<13.2V) to emit dual Owner/Mechanic alert payloads.")
    ]

    for idx, (agent_title, file_name, desc) in enumerate(ai_agents):
        col = idx % 2
        row = idx // 2
        x_pos = Inches(0.8 + (col * 6.0))
        y_pos = Inches(1.7 + (row * 2.5))

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, y_pos, Inches(5.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BLACK
        card.line.color.rgb = COLOR_CARD

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = agent_title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_SAGE
        p.font.name = 'Consolas'

        p_file = tf.add_paragraph()
        p_file.text = f"Module: app/services/advanced/{file_name}"
        p_file.font.size = Pt(9.5)
        p_file.font.color.rgb = COLOR_LIGHT
        p_file.font.name = 'Consolas'

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(8)
        p_desc.text = desc
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = COLOR_LIGHT
        p_desc.font.name = 'Arial'

    # ==========================================================
    # SLIDE 6: Main Backend Implementation Codes
    # ==========================================================
    s6 = add_base_slide(
        "Main Code Implementation Highlights",
        "Python backend services implementing core mathematical and AI agent algorithms",
        "05 / CORE CODE EXCERPTS"
    )

    code_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.73), Inches(5.1))
    code_card.fill.solid()
    code_card.fill.fore_color.rgb = COLOR_BLACK
    code_card.line.color.rgb = COLOR_CARD

    tf_code = code_card.text_frame
    tf_code.word_wrap = True
    tf_code.margin_left = tf_code.margin_top = Inches(0.3)

    code_snippet = (
        "# 1. Statistical Engine & AI Text Interpretation Generator (statistical_engine.py)\n"
        "def compute_metric_statistics(readings: List[Dict[str, Any]], metric_key: str = 'rpm'):\n"
        "    arr = np.array([float(r.get(metric_key, 0.0) or 0.0) for r in readings], dtype=float)\n"
        "    p25, p50, p75, p95 = np.percentile(arr, [25, 50, 75, 95])\n"
        "    slope, _ = np.polyfit(np.arange(len(arr)), arr, 1) if len(arr) > 2 else (0.0, 0)\n"
        "    hist_counts, bin_edges = np.histogram(arr, bins=8)\n"
        "    owner_ai, mechanic_ai = generate_statistical_ai_text(metric_key, np.mean(arr), p50, p95, np.std(arr), slope)\n"
        "    return {'p50': p50, 'p95': p95, 'histogram': hist_bins, 'trend_slope': slope, 'ai_owner': owner_ai, ...}\n\n"
        "# 2. Road Trip Simulation Engine (trip_simulator.py)\n"
        "def simulate_trip(trip_distance_km, terrain_type, load_condition, current_health_score, ...):\n"
        "    terrain_factor = {'highway': 1.15, 'city': 0.82, 'mountain': 0.72}.get(terrain_type, 1.0)\n"
        "    load_factor = {'light': 1.03, 'medium': 1.0, 'heavy': 0.88}.get(load_condition, 1.0)\n"
        "    serviced_kmpl = base_kmpl * terrain_factor * load_factor\n"
        "    current_kmpl = serviced_kmpl * (0.94 if has_oil_overdue else 1.0) * (0.95 if has_cooling_issue else 1.0)\n"
        "    fuel_savings = (trip_distance_km/current_kmpl - trip_distance_km/serviced_kmpl) * fuel_price\n"
        "    return {'current_readiness': readiness, 'serviced_readiness': 96.5, 'fuel_savings': fuel_savings, ...}"
    )

    p = tf_code.paragraphs[0]
    p.text = code_snippet
    p.font.size = Pt(9.5)
    p.font.color.rgb = COLOR_LIGHT
    p.font.name = 'Consolas'

    # ==========================================================
    # SLIDE 7: Visualization Techniques & Descriptions
    # ==========================================================
    s7 = add_base_slide(
        "Visualization Techniques & Chart Typology",
        "Purpose-built visual representations optimized for clear data hierarchy and cognitive clarity",
        "06 / VISUALIZATION TECHNIQUES"
    )

    viz_techniques = [
        ("DUAL AREA POWER CURVES", "Torque (Nm) & Horsepower (HP)", "Visualizes the engine's mechanical capability across the RPM sweep. Dual gradient area fills demonstrate where peak torque plateaus before horsepower peaks."),
        ("8-BIN FREQUENCY HISTOGRAMS", "Parametric Density Spectrum", "Recharts BarChart binning continuous sensor data into 8 equal intervals. Instantly reveals whether driving RPM or temperatures cluster normally or skew toward high-stress tails."),
        ("PERCENTILE RANGE GAUGE", "P25 - P50 - P75 - P95 Box Spectrum", "Displays the core 50% interquartile operating range (IQR) alongside top 5% extreme excursions, eliminating single-reading outlier distortions."),
        ("SIDE-BY-SIDE DUAL STATE CARDS", "Current State vs Serviced State", "Comparative KPI panels displaying readiness score deltas (e.g. 32% vs 96.5%), fuel requirement differences, and net monetary rupee savings."),
        ("ATTRIBUTION FACTOR CARDS", "Drop & Rise Factor Attribution", "Color-coded cards isolating exactly how much fuel economy was gained or lost due to driver acceleration behavior, lubrication drag, or ambient grade."),
        ("VOLTAGE TIMELINE TELEMETRY", "Alternator Charging vs Battery", "Two-axis voltage tracking displaying battery resting potential (12.4V - 12.8V) vs alternator stator output (13.8V - 14.4V) to spot electrical brownouts.")
    ]

    for idx, (v_title, v_sub, v_desc) in enumerate(viz_techniques):
        col = idx % 3
        row = idx // 3
        x_pos = Inches(0.8 + (col * 4.0))
        y_pos = Inches(1.7 + (row * 2.5))

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, y_pos, Inches(3.73), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BLACK
        card.line.color.rgb = COLOR_CARD

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = v_title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_SAGE
        p.font.name = 'Consolas'

        p_sub = tf.add_paragraph()
        p_sub.text = v_sub
        p_sub.font.size = Pt(9.5)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_LIGHT
        p_sub.font.name = 'Arial'

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(6)
        p_desc.text = v_desc
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = COLOR_LIGHT
        p_desc.font.name = 'Arial'

    # ==========================================================
    # SLIDE 8: Photographic Walkthrough - Dashboard & Health Score
    # ==========================================================
    s8 = add_base_slide(
        "Photographic Walkthrough: Main Dashboard",
        "Vehicle health score ring, subsystem KPI cards, diagnostic alerts, and AI health synthesis",
        "07 / SYSTEM PHOTOGRAPHS"
    )

    dash_img_path = "E:\\YANAMA\\screenshots\\03_dashboard.png"
    if os.path.exists(dash_img_path):
        s8.shapes.add_picture(dash_img_path, Inches(0.8), Inches(1.65), width=Inches(7.8))

    # Side commentary card
    dash_desc_card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.65), Inches(3.73), Inches(5.1))
    dash_desc_card.fill.solid()
    dash_desc_card.fill.fore_color.rgb = COLOR_BLACK
    dash_desc_card.line.color.rgb = COLOR_CARD
    tf = dash_desc_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.25)

    p = tf.paragraphs[0]
    p.text = "DASHBOARD ARCHITECTURE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "1. Vehicle Health Dial (0-100):\n"
        "Real-time weighted score displaying Grade B (84/100) for the Honda City profile.\n\n"
        "2. Subsystem Telemetry Tiles:\n"
        "Live status for Powertrain (95%), Electrical (95%), Maintenance Compliance (80%), and Fuel Efficiency (85%).\n\n"
        "3. AI Vehicle Health Agent Box:\n"
        "Context-aware synthesis advising on cooling margins and upcoming preventative brake checks.\n\n"
        "4. 1-Click PDF Audit Download:\n"
        "Direct export of publication-grade vehicle inspection reports."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    # ==========================================================
    # SLIDE 9: Photographic Walkthrough - Statistical Engine & AI Agent
    # ==========================================================
    s9 = add_base_slide(
        "Photographic Walkthrough: Statistical Engine",
        "Parametric frequency histogram, percentile spectrum, regression slope, and dynamic AI text agent",
        "08 / SYSTEM PHOTOGRAPHS"
    )

    stats_img_path = "E:\\YANAMA\\screenshots\\04_statistical_engine.png"
    if os.path.exists(stats_img_path):
        s9.shapes.add_picture(stats_img_path, Inches(0.8), Inches(1.65), width=Inches(7.8))

    stats_desc_card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.65), Inches(3.73), Inches(5.1))
    stats_desc_card.fill.solid()
    stats_desc_card.fill.fore_color.rgb = COLOR_BLACK
    stats_desc_card.line.color.rgb = COLOR_CARD
    tf = stats_desc_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.25)

    p = tf.paragraphs[0]
    p.text = "STATISTICAL AI FEATURES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "1. Dynamic Metric Switching:\n"
        "Inspect RPM, Torque (Nm), Power (HP), Coolant Temp (°C), Engine Load (%), or Speed (km/h).\n\n"
        "2. AI Agent Text Box:\n"
        "Analyzes the chosen visualization technique and contextualizes the median (1785 RPM), P95 threshold, and drift slope.\n\n"
        "3. 8-Bin Frequency Histogram:\n"
        "Visualizes sample cluster frequency across 120 continuous points.\n\n"
        "4. Percentile Range Spectrum:\n"
        "Exact boundaries for P25, P50, P75, P95, and maximum observed."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    # ==========================================================
    # SLIDE 10: Photographic Walkthrough - Trip Simulation Planner
    # ==========================================================
    s10 = add_base_slide(
        "Photographic Walkthrough: Trip Simulation",
        "Pre-trip audit comparing current condition vs serviced condition across terrains with AI service advisor",
        "09 / SYSTEM PHOTOGRAPHS"
    )

    trip_img_path = "E:\\YANAMA\\screenshots\\05_trip_simulation.png"
    if os.path.exists(trip_img_path):
        s10.shapes.add_picture(trip_img_path, Inches(0.8), Inches(1.65), width=Inches(7.8))

    trip_desc_card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.65), Inches(3.73), Inches(5.1))
    trip_desc_card.fill.solid()
    trip_desc_card.fill.fore_color.rgb = COLOR_BLACK
    trip_desc_card.line.color.rgb = COLOR_CARD
    tf = trip_desc_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.25)

    p = tf.paragraphs[0]
    p.text = "TRIP SIMULATION HIGHLIGHTS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "1. Dynamic Route Inputs:\n"
        "Slider configuration from 50 to 2,000 km, terrain profile (Mountain/Highway), and payload.\n\n"
        "2. As-Is vs Serviced State:\n"
        "Side-by-side comparison of readiness scores, fuel consumption, and net monetary fuel savings.\n\n"
        "3. AI Service Checklist:\n"
        "Mandatory vs Recommended workshop checklist tailored specifically for the planned route.\n\n"
        "4. Risk Factor Analysis:\n"
        "Flags specific vulnerabilities such as radiator thermal runaway or brake fluid boil."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    # ==========================================================
    # SLIDE 11: Photographic Walkthrough - Mileage Intelligence
    # ==========================================================
    s11 = add_base_slide(
        "Photographic Walkthrough: Mileage Intelligence",
        "Real-time km/L tracking, drop/rise factor attribution, and prioritized AI fuel recovery actions",
        "10 / SYSTEM PHOTOGRAPHS"
    )

    mileage_img_path = "E:\\YANAMA\\screenshots\\06_mileage_analytics.png"
    if os.path.exists(mileage_img_path):
        s11.shapes.add_picture(mileage_img_path, Inches(0.8), Inches(1.65), width=Inches(7.8))

    mileage_desc_card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.65), Inches(3.73), Inches(5.1))
    mileage_desc_card.fill.solid()
    mileage_desc_card.fill.fore_color.rgb = COLOR_BLACK
    mileage_desc_card.line.color.rgb = COLOR_CARD
    tf = mileage_desc_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.25)

    p = tf.paragraphs[0]
    p.text = "MILEAGE OPTIMIZATION"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "1. Running Average vs Historical Peak:\n"
        "Tracks current 12.5 km/L baseline against 15.8 km/L highway potential.\n\n"
        "2. Drop & Rise Attribution Vectors:\n"
        "Isolates throttle aggression (-1.8 km/L), overdue lubrication drag (-1.4 km/L), and thermal loss (-0.9 km/L).\n\n"
        "3. Actionable AI Recommendations:\n"
        "4 prioritized steps with quantified gain (e.g. progressive throttle, synthetic oil renewal).\n\n"
        "4. Fuel Recovery Estimate:\n"
        "Calculates up to +3.5 km/L recoverable efficiency (~₹14,000/yr savings)."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    # ==========================================================
    # SLIDE 12: Rule-Based Diagnostics & Alert Catalog
    # ==========================================================
    s12 = add_base_slide(
        "Rule-Based Diagnostics & Fault Catalog",
        "Deterministic threshold catalog mapping sensor triggers to non-technical and mechanic outputs",
        "11 / VEHICLE DIAGNOSTICS"
    )

    # Table of Diagnostic Rules
    rows, cols = 5, 5
    left = Inches(0.8)
    top = Inches(1.7)
    width = Inches(11.73)
    height = Inches(4.8)

    table_shape = s12.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    table.columns[0].width = Inches(1.5)
    table.columns[1].width = Inches(1.8)
    table.columns[2].width = Inches(1.3)
    table.columns[3].width = Inches(3.6)
    table.columns[4].width = Inches(3.53)

    headers = ["RULE CODE", "COMPONENT", "THRESHOLD", "OWNER EXPLANATION", "MECHANIC DIAGNOSTIC"]
    for c_idx, h_text in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_BLACK
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.text = h_text
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_SAGE
        p.font.name = 'Consolas'

    rules_data = [
        ("ENG-TMP-001", "Engine Thermal", "> 102.0 °C", "Engine coolant temperature higher than operating range. Allow cooling down.", "Thermostat valve restriction or radiator fin clogging. Run 1.1 bar pressure test."),
        ("ENG-RPM-002", "Powertrain", "> 5500 RPM", "Engine revved to very high revolutions. Driving gently saves fuel and wear.", "Transient over-rev event. Check valve float risk and ECU over-rev tally."),
        ("ELE-BAT-001", "Electrical 12V", "< 11.90 V", "Battery resting voltage lower than normal. Risk of starting delays.", "Open-circuit resting voltage dropped. Perform 15s carbon pile load test."),
        ("ELE-ALT-002", "Charging System", "< 13.20 V", "Charging generator not replenishing battery. Have inspected promptly.", "Alternator output dropped under load. Check belt tension and diode bridge.")
    ]

    for r_idx, row in enumerate(rules_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_CARD if r_idx % 2 == 0 else COLOR_BLACK
            tf = cell.text_frame
            p = tf.paragraphs[0]
            p.text = val
            p.font.size = Pt(9.5)
            p.font.color.rgb = COLOR_LIGHT
            p.font.name = 'Arial' if c_idx >= 3 else 'Consolas'

    # ==========================================================
    # SLIDE 13: Summary, Conclusions & Future Roadmap
    # ==========================================================
    s13 = add_base_slide(
        "Summary, Conclusions & Future Roadmap",
        "Full-stack automotive intelligence platform ready for scaling and future vehicle architectures",
        "12 / SUMMARY & ROADMAP"
    )

    # 2 Big Cards
    w_half = Inches(5.66)
    
    # Card Left: Platform Summary
    c_l = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), w_half, Inches(4.9))
    c_l.fill.solid()
    c_l.fill.fore_color.rgb = COLOR_BLACK
    c_l.line.color.rgb = COLOR_CARD
    tf = c_l.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.3)

    p = tf.paragraphs[0]
    p.text = "PLATFORM DELIVERABLES COMPLETED"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "✓ Full-Stack System Live: FastAPI backend + React Vite TypeScript frontend running live.\n\n"
        "✓ 13 Passing Backend Tests: Verified unit tests and integration tests covering all analytics.\n\n"
        "✓ Statistical Engine with AI Agent: Distribution histograms, percentiles, and OLS regression.\n\n"
        "✓ Road Trip Simulation Planner: Side-by-side condition comparison with pre-trip checklist.\n\n"
        "✓ Mileage Intelligence Dashboard: Drop/rise factor attribution with quantified fuel recovery.\n\n"
        "✓ Authentic PDF & CSV Exports: ReportLab PDF audit generator and CSV telemetry exporter."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    # Card Right: Roadmap
    c_r = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.86), Inches(1.7), w_half, Inches(4.9))
    c_r.fill.solid()
    c_r.fill.fore_color.rgb = COLOR_BLACK
    c_r.line.color.rgb = COLOR_CARD
    tf = c_r.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = Inches(0.3)

    p = tf.paragraphs[0]
    p.text = "FUTURE ROADMAP & EV EXPANSION"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_SAGE
    p.font.name = 'Consolas'

    p = tf.add_paragraph()
    p.space_before = Pt(10)
    p.text = (
        "1. Direct BLE / Hardware Sync (Phase 2):\n"
        "Modular architecture allows plug-and-play Bluetooth/WiFi hardware socket without rewriting analytics.\n\n"
        "2. Electric Vehicle (EV) Powertrain Module:\n"
        "Modular schema ready to accept State of Health (SoH), cell temperature deltas, and regenerative braking efficiency.\n\n"
        "3. Multi-Vehicle Fleet Telematics Console:\n"
        "Aggregated commercial fleet management with cross-vehicle driver pacing comparisons.\n\n"
        "4. Continuous Edge Telemetry Processing:\n"
        "Lightweight on-device rule evaluation before local CSV caching."
    )
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_LIGHT

    out_file = "E:\\YANAMA\\YANAMA_System_Architecture_and_Intelligence.pptx"
    prs.save(out_file)
    print(f"Presentation saved to: {out_file}")

if __name__ == '__main__':
    create_presentation()
