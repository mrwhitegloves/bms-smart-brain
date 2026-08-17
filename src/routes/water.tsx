import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHead, Panel, Shell, Tag } from "@/components/bms/shell";
import { water } from "@/lib/demo-data";

export const Route = createFileRoute("/water")({
  head: () => ({
    meta: [
      { title: "Water Consumption Intelligence | Engineering Intelligence Layer" },
      {
        name: "description",
        content:
          "AI interpretation of hotel water tank levels: abnormal consumption estimation, leakage probability and prescriptive inspection actions.",
      },
      { property: "og:title", content: "Water Consumption Intelligence" },
      {
        property: "og:description",
        content: "Beyond the BMS low-level alarm — why the tank is draining faster than expected.",
      },
    ],
  }),
  component: WaterPage,
});

function WaterPage() {
  const fill = (water.currentFt / water.tankCapacityFt) * 100;
  const expected = (water.expectedFt / water.tankCapacityFt) * 100;
  return (
    <Shell>
      <PageHead
        title="Water Consumption Intelligence"
        subtitle="Tank T-01 · Block A domestic water · BMS low-level alarm active"
        right={<Tag tone="crit">Abnormal draw detected</Tag>}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Panel title="Tank level" hint="Capacity 10 ft">
          <div className="flex gap-6">
            <div className="relative h-56 w-24 overflow-hidden rounded border border-border bg-muted">
              <div
                className="absolute inset-x-0 bottom-0 bg-info/40"
                style={{ height: `${fill}%` }}
              />
              <div
                className="absolute inset-x-0 border-t border-dashed border-ok"
                style={{ bottom: `${expected}%` }}
              />
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="label-xs">Current level</dt>
                <dd className="num text-xl font-semibold">{water.currentFt} ft</dd>
              </div>
              <div>
                <dt className="label-xs">Historical expected</dt>
                <dd className="num text-xl font-semibold text-ok">{water.expectedFt} ft</dd>
              </div>
              <div>
                <dt className="label-xs">Deviation</dt>
                <dd className="num text-xl font-semibold text-crit">{water.deviationFt} ft</dd>
              </div>
            </dl>
          </div>
        </Panel>

        <Panel title="Level trend vs AI expected" hint="Last 14 days, occupancy-normalised">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={water.trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={{ stroke: "var(--grid)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line isAnimationActive={false} name="Expected level (ft)" dataKey="expected" stroke="var(--muted-foreground)" strokeDasharray="4 3" strokeWidth={1.6} dot={false} />
                <Line isAnimationActive={false} name="Actual level (ft)" dataKey="actual" stroke="var(--crit)" strokeWidth={2.2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="AI Interpretation" hint="The BMS alarm says the tank is low. This explains why.">
          <p className="text-sm leading-relaxed">{water.interpretation}</p>
          <ul className="mt-4 space-y-2.5">
            {water.causes.map((c) => (
              <li key={c.label}>
                <div className="flex justify-between text-sm">
                  <span>{c.label}</span>
                  <span className="num font-medium">{c.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-muted">
                  <div
                    className={`h-1.5 rounded ${c.label === "Leakage" ? "bg-crit" : "bg-primary/70"}`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded border border-info/25 bg-info-soft px-3 py-2 text-xs font-medium text-info">
            AI-generated probability estimates — for engineering validation
          </p>
        </Panel>

        <Panel title="Business impact & action">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-border bg-muted/30 p-3">
              <dt className="label-xs">Estimated abnormal consumption</dt>
              <dd className="num mt-1 text-2xl font-semibold text-crit">
                {water.abnormalLitres.toLocaleString()} L
              </dd>
            </div>
            <div className="rounded border border-border bg-muted/30 p-3">
              <dt className="label-xs">Estimated financial impact</dt>
              <dd className="num mt-1 text-2xl font-semibold text-crit">
                ₹{water.impact.toLocaleString()}/day
              </dd>
            </div>
          </dl>
          <div className="mt-4 rounded border border-border p-4">
            <p className="label-xs">Recommended action</p>
            <p className="mt-1 text-sm font-medium">{water.action}</p>
            <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>1. Isolate Block A riser and observe overnight static loss.</li>
              <li>2. Survey high-consumption fixtures on floors 3–6.</li>
              <li>3. Validate level sensor calibration if no loss is observed.</li>
            </ol>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}