import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel, PageHead, Shell, Tag } from "@/components/bms/shell";
import { WhyButton } from "@/components/bms/why-dialog";
import {
  dailyBrief,
  deviationBreakdown,
  explainedPct,
  hourlyEnergy,
  kpis,
  totalDeviation,
} from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hotel Engineering Intelligence | AI layer over your BMS" },
      {
        name: "description",
        content:
          "AI-powered engineering intelligence over existing hotel BMS data: energy deviation analysis, root cause, business impact and prescriptive actions.",
      },
      { property: "og:title", content: "Hotel Engineering Intelligence" },
      {
        property: "og:description",
        content:
          "From monitoring to decision intelligence — why energy deviated, what it costs, and what to do next.",
      },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  unit,
  rows,
  tone = "neutral",
}: {
  label: string;
  value: string;
  unit?: string;
  rows: { k: string; v: string; tone?: "ok" | "warn" | "crit" }[];
  tone?: "neutral" | "warn" | "crit";
}) {
  const bar =
    tone === "crit" ? "bg-crit" : tone === "warn" ? "bg-warn" : "bg-primary/70";
  return (
    <div className="panel relative overflow-hidden px-5 py-4">
      <span className={`absolute inset-x-0 top-0 h-0.5 ${bar}`} />
      <p className="label-xs">{label}</p>
      <p className="num mt-2 text-3xl font-semibold tracking-tight">
        {value}
        {unit ? <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span> : null}
      </p>
      <dl className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
        {rows.map((r) => (
          <div key={r.k} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{r.k}</dt>
            <dd
              className={`num font-medium ${
                r.tone === "crit" ? "text-crit" : r.tone === "warn" ? "text-warn" : r.tone === "ok" ? "text-ok" : ""
              }`}
            >
              {r.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Dashboard() {
  return (
    <Shell>
      <PageHead
        title="Hotel Engineering Intelligence"
        subtitle="AI-powered intelligence layer over your existing BMS"
        right={
          <div className="flex items-center gap-2">
            <Tag tone="ok">BMS connected</Tag>
            <Tag tone="crit">2 critical</Tag>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Energy Consumption"
          value="28,000"
          unit="kWh"
          tone="warn"
          rows={[
            { k: "AI expected", v: "25,600 kWh" },
            { k: "Variance", v: "+9.4%", tone: "warn" },
          ]}
        />
        <Kpi
          label="Energy Cost"
          value="₹2.86"
          unit="Lakhs"
          tone="warn"
          rows={[
            { k: "Expected", v: "₹2.61 Lakhs" },
            { k: "Excess", v: "₹25,000", tone: "warn" },
          ]}
        />
        <Kpi
          label="Active Intelligence Alerts"
          value={String(kpis.alerts.total)}
          tone="crit"
          rows={[
            { k: "Critical", v: String(kpis.alerts.critical), tone: "crit" },
            { k: "Attention", v: String(kpis.alerts.attention), tone: "warn" },
          ]}
        />
        <Kpi
          label="Assets Under Observation"
          value={String(kpis.assets.total)}
          rows={[
            { k: "Healthy", v: String(kpis.assets.healthy), tone: "ok" },
            { k: "Watch", v: String(kpis.assets.watch), tone: "warn" },
            { k: "Critical", v: String(kpis.assets.critical), tone: "crit" },
          ]}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Actual vs AI Expected Energy Consumption"
          hint="Hourly, last 24 hours · baseline adjusted for occupancy, weather and event load"
          actions={<Tag tone="warn">+2,400 kWh deviation</Tag>}
        >
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyEnergy} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  interval={2}
                  tickLine={false}
                  axisLine={{ stroke: "var(--grid)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area isAnimationActive={false}
                  name="Occupancy influence (kWh)"
                  dataKey="occupancy"
                  stackId="d"
                  stroke="none"
                  fill="var(--info)"
                  fillOpacity={0.16}
                />
                <Area isAnimationActive={false}
                  name="Banquet / event influence (kWh)"
                  dataKey="event"
                  stackId="d"
                  stroke="none"
                  fill="var(--warn)"
                  fillOpacity={0.2}
                />
                <Line isAnimationActive={false}
                  name="AI baseline"
                  dataKey="baseline"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 3"
                  strokeWidth={1.6}
                  dot={false}
                />
                <Line isAnimationActive={false}
                  name="Actual consumption"
                  dataKey="actual"
                  stroke="var(--crit)"
                  strokeWidth={2.2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Why is consumption higher today?" hint="Deviation attribution engine">
          <p className="num text-2xl font-semibold text-warn">+{totalDeviation.toLocaleString()} kWh</p>
          <p className="text-xs text-muted-foreground">total deviation vs AI baseline</p>
          <ul className="mt-4 space-y-2.5">
            {deviationBreakdown.map((d) => (
              <li key={d.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className={d.kind === "unexplained" ? "text-crit" : ""}>{d.label}</span>
                  <span className="num font-medium">+{d.kwh} kWh</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded bg-muted">
                  <div
                    className={`h-1.5 rounded ${d.kind === "unexplained" ? "bg-crit" : "bg-primary/70"}`}
                    style={{ width: `${(d.kwh / totalDeviation) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded border border-border bg-muted/50 p-3">
            <p className="text-sm font-medium">
              <span className="num">{explainedPct}%</span> of additional consumption explained
            </p>
            <p className="num mt-0.5 text-xs text-crit">{100 - explainedPct}% unexplained</p>
          </div>
          <Link
            to="/copilot"
            className="mt-3 inline-flex w-full items-center justify-center rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Investigate unexplained consumption
          </Link>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="AI Daily Engineering Brief"
          hint="Generated 06:00 · covers previous operating day"
          actions={
            <Link
              to="/report"
              className="rounded border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              Open shift report
            </Link>
          }
        >
          <p className="max-w-4xl text-sm leading-relaxed">
            Yesterday's energy consumption was 9.4% above the expected baseline. Most of the increase
            is explained by banquet operations, higher occupancy and HVAC demand. Three
            equipment-level deviations require engineering attention.
          </p>

          <div className="mt-5 space-y-3">
            {dailyBrief.map((b) => (
              <article key={b.asset} className="rounded border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-xs">Priority {b.rank}</span>
                  <Link
                    to="/assets/$assetId"
                    params={{ assetId: b.asset }}
                    className="num text-base font-semibold underline-offset-4 hover:underline"
                  >
                    {b.asset}
                  </Link>
                  <Tag tone={b.priority === "HIGH" ? "crit" : "warn"}>{b.priority}</Tag>
                  <span className="num ml-auto text-sm font-semibold text-crit">
                    ₹{b.impactPerDay.toLocaleString()}/day
                  </span>
                </div>
                <dl className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <dt className="label-xs">Observation</dt>
                    <dd className="mt-0.5">{b.metric}</dd>
                  </div>
                  <div>
                    <dt className="label-xs">Probable cause</dt>
                    <dd className="mt-0.5">{b.cause}</dd>
                  </div>
                  <div>
                    <dt className="label-xs">Recommended action</dt>
                    <dd className="mt-0.5 font-medium">{b.action}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <WhyButton
                    title={`Why is ${b.asset} deviating?`}
                    explanation={b.why}
                    likelyCause={b.likelyCause}
                    confidence={b.confidence}
                    nextStep={b.nextStep}
                  />
                  <Link
                    to="/assets/$assetId"
                    params={{ assetId: b.asset }}
                    className="rounded border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide hover:bg-muted"
                  >
                    Open asset
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <section className="mt-4 rounded border border-border bg-primary px-6 py-8 text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.2em] opacity-70">From monitoring to</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Decision Intelligence</h2>
        <p className="mt-3 max-w-2xl text-sm opacity-85">
          Your BMS already knows what is happening. We help your engineering team understand why —
          and what to do next.
        </p>
      </section>
    </Shell>
  );
}
