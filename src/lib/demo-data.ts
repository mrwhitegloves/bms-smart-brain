// Deterministic simulated hotel BMS demo data.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260817);

export const REPORT_DATE = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const kpis = {
  energy: { actual: 28000, expected: 25600, variancePct: 9.4 },
  cost: { actual: 2.86, expected: 2.61, excess: 25000 },
  alerts: { total: 8, critical: 2, attention: 6 },
  assets: { total: 126, healthy: 108, watch: 15, critical: 3 },
};

export type HourPoint = {
  hour: string;
  actual: number;
  baseline: number;
  occupancy: number;
  event: number;
};

export const hourlyEnergy: HourPoint[] = Array.from({ length: 24 }, (_, h) => {
  const shape = 0.6 + 0.55 * Math.sin(((h - 4) / 24) * Math.PI * 2) + (h >= 9 && h <= 22 ? 0.35 : 0);
  const baseline = Math.round(760 * Math.max(0.45, shape) + rnd() * 40);
  const banquet = h >= 17 && h <= 23 ? 120 + (h - 16) * 18 : 0;
  const occ = h >= 7 && h <= 23 ? 25 + rnd() * 25 : 5;
  const drift = h >= 11 ? 40 + (h - 11) * 6 : 10;
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    actual: Math.round(baseline + banquet + occ + drift),
    baseline,
    occupancy: Math.round(occ),
    event: Math.round(banquet),
  };
});

export const deviationBreakdown = [
  { label: "Higher occupancy", kwh: 700, kind: "explained" as const },
  { label: "Banquet operation", kwh: 850, kind: "explained" as const },
  { label: "HVAC demand", kwh: 500, kind: "explained" as const },
  { label: "Chiller load", kwh: 250, kind: "explained" as const },
  { label: "Other / unexplained", kwh: 100, kind: "unexplained" as const },
];
export const totalDeviation = 2400;
export const explainedPct = 91;

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type BriefItem = {
  rank: number;
  asset: string;
  headline: string;
  metric: string;
  cause: string;
  impactPerDay: number;
  action: string;
  priority: Priority;
  why: string;
  likelyCause: string;
  confidence: number;
  nextStep: string;
};

export const dailyBrief: BriefItem[] = [
  {
    rank: 1,
    asset: "AHU-04",
    headline: "Motor loading above baseline",
    metric: "+18% motor loading",
    cause: "Filter loading / fan mechanical resistance",
    impactPerDay: 3200,
    action: "Inspect filter and fan assembly",
    priority: "HIGH",
    why: "AHU-04 motor current has increased by 18% over its historical operating baseline. At the same time, airflow has decreased by 8% and static pressure has increased by 11%. This combination is more consistent with increased air-side resistance than an isolated electrical fault.",
    likelyCause: "Filter loading",
    confidence: 72,
    nextStep: "Inspect filter before replacing or servicing the motor.",
  },
  {
    rank: 2,
    asset: "Chiller-02",
    headline: "Efficiency below 14-day baseline",
    metric: "-7% efficiency, deteriorating",
    cause: "Higher condenser temperature / reduced heat-transfer efficiency",
    impactPerDay: 6800,
    action: "Review condenser performance and operating conditions",
    priority: "HIGH",
    why: "Chiller-02 kW/TR has drifted 7% above its 14-day baseline while condenser approach temperature increased by 1.4 °C at comparable load and ambient conditions. The pattern tracks heat-rejection performance rather than compressor mechanical wear.",
    likelyCause: "Reduced condenser heat transfer (fouling / cooling tower performance)",
    confidence: 64,
    nextStep: "Review condenser approach and cooling tower operation before any compressor intervention.",
  },
  {
    rank: 3,
    asset: "Pump-03",
    headline: "Operating hours above schedule",
    metric: "+3.2 hrs vs normal schedule",
    cause: "Incorrect operating schedule",
    impactPerDay: 1100,
    action: "Verify automation schedule",
    priority: "MEDIUM",
    why: "Pump-03 ran 3.2 hours beyond its scheduled window on 6 of the last 7 days, at near-constant flow and without a corresponding demand signal. This is consistent with a schedule/override setting rather than a hydraulic fault.",
    likelyCause: "Manual override left active in BMS schedule",
    confidence: 81,
    nextStep: "Verify BMS schedule and clear any manual override.",
  },
];

export const ahu04 = {
  id: "AHU-04",
  location: "Block A · Level 3 · Banquet side",
  params: [
    { label: "Motor Current", value: "3.8 A", normal: "3.0–3.2 A", delta: "+18%", bad: true },
    { label: "Motor Temperature", value: "68 °C", normal: "62–64 °C", delta: "+6%", bad: true },
    { label: "Airflow", value: "6,150 CMH", normal: "6,650 CMH", delta: "-8%", bad: true },
    { label: "Static Pressure", value: "512 Pa", normal: "460 Pa", delta: "+11%", bad: true },
    { label: "VFD Frequency", value: "48 Hz", normal: "46–48 Hz", delta: "Normal", bad: false },
    { label: "Operating Hours", value: "11.4 hrs", normal: "11.0 hrs", delta: "+0.4 hrs", bad: false },
  ],
  causes: [
    { label: "Filter loading", pct: 52 },
    { label: "Fan / bearing degradation", pct: 28 },
    { label: "Mechanical misalignment", pct: 12 },
    { label: "Electrical connection issue", pct: 8 },
  ],
  evidence: [
    "Motor current increasing continuously over 14 days",
    "Airflow decreasing over the same window",
    "Static pressure increasing",
    "Motor temperature increasing",
  ],
  actions: [
    "Inspect filter condition",
    "Inspect blower / fan assembly",
    "Check bearing condition",
    "Verify electrical connections if mechanical causes are ruled out",
  ],
};

export const ahu04Trend = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 7, 4 + i);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    current: +(3.08 + i * 0.055 + rnd() * 0.04).toFixed(2),
    airflow: Math.round(6680 - i * 40 - rnd() * 30),
    pressure: Math.round(458 + i * 4 + rnd() * 5),
    temperature: Math.round(62 + i * 0.45 + rnd() * 0.6),
  };
});

export const water = {
  tankCapacityFt: 10,
  currentFt: 5,
  expectedFt: 6.8,
  deviationFt: -1.8,
  abnormalLitres: 2500,
  impact: 4200,
  interpretation:
    "Water level has decreased 1.8 ft faster than expected based on current occupancy and historical consumption.",
  causes: [
    { label: "Leakage", pct: 40 },
    { label: "Normal consumption", pct: 35 },
    { label: "Unexpected usage", pct: 18 },
    { label: "Sensor anomaly", pct: 7 },
  ],
  action: "Inspect Block A plumbing network and high-consumption fixtures.",
  trend: Array.from({ length: 14 }, (_, i) => ({
    day: `D-${13 - i}`,
    actual: +(8.4 - i * 0.24 - (i > 8 ? (i - 8) * 0.16 : 0)).toFixed(2),
    expected: +(8.4 - i * 0.115).toFixed(2),
  })),
};

export type AssetStatus = "healthy" | "watch" | "critical";

export type Asset = {
  id: string;
  group: string;
  subgroup: string;
  health: number;
  efficiency: number;
  status: AssetStatus;
  risk: "Low" | "Medium" | "High";
  lastMaintenance: string;
  action: string;
};

function mkAssets(): Asset[] {
  const out: Asset[] = [];
  const push = (
    group: string,
    subgroup: string,
    prefix: string,
    count: number,
    startIdx = 1,
  ) => {
    for (let i = 0; i < count; i++) {
      const id = `${prefix}-${String(startIdx + i).padStart(2, "0")}`;
      const r = rnd();
      const status: AssetStatus = r > 0.965 ? "critical" : r > 0.85 ? "watch" : "healthy";
      out.push({
        id,
        group,
        subgroup,
        health: status === "critical" ? 54 + Math.round(rnd() * 8) : status === "watch" ? 72 + Math.round(rnd() * 10) : 90 + Math.round(rnd() * 9),
        efficiency: status === "critical" ? 71 + Math.round(rnd() * 6) : status === "watch" ? 84 + Math.round(rnd() * 6) : 94 + Math.round(rnd() * 5),
        status,
        risk: status === "critical" ? "High" : status === "watch" ? "Medium" : "Low",
        lastMaintenance: `${String(1 + Math.floor(rnd() * 27)).padStart(2, "0")} Jul 2026`,
        action: status === "critical" ? "Inspect within 24 hrs" : status === "watch" ? "Review at next window" : "No action required",
      });
    }
  };
  push("HVAC", "AHUs", "AHU", 20);
  push("HVAC", "Chillers", "CH", 4);
  push("HVAC", "Pumps", "PMP", 12);
  push("HVAC", "Cooling Towers", "CT", 2);
  push("Electrical", "Energy Meters", "EM", 8);
  push("Electrical", "HT Panel", "HT", 2);
  push("Electrical", "LT Panel", "LT", 4);
  push("Electrical", "DG Sets", "DG", 3);
  push("Water", "Tanks", "TNK", 6);
  push("Water", "Pumps", "WPM", 9);
  push("Plumbing", "Booster Sets", "BST", 6);
  push("Plumbing", "STP / WTP", "STP", 4);
  push("Other", "Kitchen Equipment", "KEQ", 24);
  push("Other", "Laundry", "LDY", 22);
  return out.slice(0, 126);
}

export const assets: Asset[] = (() => {
  const list = mkAssets();
  const force = (id: string, patch: Partial<Asset>) => {
    const a = list.find((x) => x.id === id);
    if (a) Object.assign(a, patch);
  };
  force("AHU-04", { status: "critical", health: 58, efficiency: 73, risk: "High", action: "Inspect filter and fan assembly" });
  force("CH-02", { status: "critical", health: 61, efficiency: 76, risk: "High", action: "Review condenser performance" });
  force("PMP-03", { status: "watch", health: 74, efficiency: 85, risk: "Medium", action: "Verify automation schedule" });
  return list;
})();

export const shiftReport = {
  energy: "28,000 kWh",
  energyExpected: "25,600 kWh",
  variance: "+9.4%",
  water: "84,600 litres",
  waterExpected: "79,200 litres",
  criticalAlerts: 2,
  recommendations: 5,
  avoidableCost: "₹11,100",
  summary:
    "Energy consumption was higher than expected primarily due to increased occupancy, banquet operations and HVAC demand. Three equipment-level deviations were identified. AHU-04 requires immediate inspection due to increasing motor load and declining airflow. Chiller-02 shows deteriorating efficiency and should be reviewed during the next maintenance window.",
};

export type CopilotAnswer = {
  q: string;
  observed: string[];
  inference: string[];
  recommendation: string[];
};

export const copilotAnswers: CopilotAnswer[] = [
  {
    q: "Why did energy consumption increase yesterday?",
    observed: [
      "Consumption 28,000 kWh vs AI baseline 25,600 kWh (+9.4%, +2,400 kWh).",
      "Occupancy 86% vs 74% 14-day average; one banquet event 18:00–23:00.",
    ],
    inference: [
      "Approximately 91% of the deviation is attributable to occupancy (+700 kWh), banquet operation (+850 kWh), HVAC demand (+500 kWh) and chiller load (+250 kWh).",
      "The remaining ~100 kWh is not explained by known drivers.",
    ],
    recommendation: [
      "Accept the load-driven increase; investigate the unexplained 100 kWh against Block A sub-meters.",
    ],
  },
  {
    q: "What is the biggest source of unexplained consumption?",
    observed: ["100 kWh of yesterday's deviation is not matched to occupancy, event or weather drivers."],
    inference: [
      "Sub-meter residuals concentrate in the Block A AHU feeder during 11:00–17:00, overlapping AHU-04's elevated motor load.",
    ],
    recommendation: ["Trend the Block A AHU feeder for 48 hrs alongside AHU-04 inspection."],
  },
  {
    q: "Which equipment needs attention today?",
    observed: ["AHU-04 motor current +18%; Chiller-02 efficiency -7%; Pump-03 runtime +3.2 hrs."],
    inference: ["AHU-04 and Chiller-02 show progressive, not step-change, deviation — consistent with degradation rather than fault."],
    recommendation: ["Priority: AHU-04 inspection today, Chiller-02 condenser review this shift, Pump-03 schedule check."],
  },
  {
    q: "What are the top three maintenance actions?",
    observed: ["Three equipment-level deviations open, 5 recommendations generated."],
    inference: ["Highest cost-weighted actions rank Chiller-02 first by ₹/day, AHU-04 first by failure risk."],
    recommendation: [
      "1. Inspect AHU-04 filter and fan assembly.",
      "2. Review Chiller-02 condenser performance.",
      "3. Verify Pump-03 automation schedule.",
    ],
  },
  {
    q: "What is the estimated financial impact?",
    observed: ["Excess energy cost yesterday: ₹25,000 against expected ₹2.61 Lakhs."],
    inference: [
      "Equipment-attributable share: AHU-04 ₹3,200/day, Chiller-02 ₹6,800/day, Pump-03 ₹1,100/day — ₹11,100/day avoidable.",
    ],
    recommendation: ["Closing all three actions recovers an estimated ₹3.3 Lakhs per month at current tariff."],
  },
];