import { createFileRoute } from "@tanstack/react-router";
import { PageHead, Panel, Shell } from "@/components/bms/shell";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "System Architecture | Engineering Intelligence Layer" },
      {
        name: "description",
        content:
          "How the intelligence layer sits over existing hotel BMS infrastructure: integration, time-series platform, AI engines and engineering outputs.",
      },
      { property: "og:title", content: "System Architecture" },
      {
        property: "og:description",
        content: "BMS data to integration layer to AI intelligence engine to engineering decisions.",
      },
    ],
  }),
  component: ArchitecturePage,
});

const layers = [
  {
    title: "Existing hotel infrastructure",
    note: "Already installed and operating",
    items: [
      "BMS",
      "Energy Meters",
      "VFDs",
      "HVAC Sensors",
      "Chillers",
      "AHUs",
      "Pumps",
      "Cooling Towers",
      "Water Level Sensors",
      "Occupancy Data",
      "Banquet / Event Data",
      "Maintenance Records",
    ],
  },
  {
    title: "Data integration layer",
    note: "Read-only, no change to BMS control logic",
    items: ["BACnet", "Modbus", "OPC-UA", "REST API", "CSV", "Database"],
  },
  {
    title: "Data platform",
    note: "Normalised, asset-tagged history",
    items: ["Time-Series Database", "Asset Master", "Historical Data", "Alarm / Event History"],
  },
  {
    title: "AI intelligence engine",
    note: "Where data becomes meaning",
    items: [
      "Dynamic Baseline Engine",
      "Anomaly Detection",
      "Pattern Recognition",
      "Root Cause Analysis",
      "Business Impact Calculation",
      "Prescriptive Maintenance Engine",
    ],
  },
  {
    title: "Output",
    note: "What the engineering team actually uses",
    items: [
      "Engineering Dashboard",
      "Daily Shift Report",
      "AI Recommendations",
      "Priority Alerts",
      "Maintenance Actions",
    ],
  },
];

const principles = [
  { k: "Existing BMS", v: "“Here is the data.”" },
  { k: "Engineering Intelligence Layer", v: "“Here is what the data means.”" },
  { k: "Prescriptive Engine", v: "“Here is what you should do.”" },
  { k: "Business Impact", v: "“Here is what it is costing you.”" },
];

function ArchitecturePage() {
  return (
    <Shell>
      <PageHead
        title="System Architecture"
        subtitle="An intelligence layer over your existing BMS — not another monitoring system"
      />

      <div className="space-y-3">
        {layers.map((l, i) => (
          <div key={l.title}>
            <Panel title={l.title} hint={l.note}>
              <ul className="flex flex-wrap gap-2">
                {l.items.map((it) => (
                  <li
                    key={it}
                    className={`rounded border px-2.5 py-1 text-sm ${
                      i === 3 ? "border-info/30 bg-info-soft text-info" : "border-border bg-muted/40"
                    }`}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </Panel>
            {i < layers.length - 1 ? (
              <div className="flex justify-center py-1 text-muted-foreground">↓</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {principles.map((p) => (
          <div key={p.k} className="panel px-5 py-4">
            <p className="label-xs">{p.k}</p>
            <p className="mt-2 text-base font-medium">{p.v}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 rounded border border-border bg-primary px-6 py-10 text-primary-foreground">
        <h2 className="text-3xl font-semibold tracking-tight">From Monitoring to Decision Intelligence</h2>
        <p className="mt-4 max-w-2xl text-sm opacity-85">
          Your BMS already knows what is happening. We help your engineering team understand why — and
          what to do next.
        </p>
      </section>
    </Shell>
  );
}