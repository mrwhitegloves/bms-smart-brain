import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHead, Panel, Shell, StatusDot, Tag } from "@/components/bms/shell";
import { WhyButton } from "@/components/bms/why-dialog";
import { ahu04, ahu04Trend, assets, dailyBrief } from "@/lib/demo-data";

export const Route = createFileRoute("/assets/$assetId")({
  head: () => ({
    meta: [
      { title: "Prescriptive Asset Diagnostics | Engineering Intelligence Layer" },
      {
        name: "description",
        content:
          "Asset-level AI diagnosis: parameter deviation, 14-day trends, probable cause ranking, evidence and recommended engineering actions.",
      },
      { property: "og:title", content: "Prescriptive Asset Diagnostics" },
      {
        property: "og:description",
        content: "AI diagnosis, evidence and recommended actions for a single hotel asset.",
      },
    ],
  }),
  component: AssetDetail,
});

function AssetDetail() {
  const { assetId } = Route.useParams();
  const asset = assets.find((a) => a.id.toLowerCase() === assetId.toLowerCase());
  const brief = dailyBrief.find((b) => b.asset.toLowerCase() === assetId.toLowerCase());
  const isAhu04 = assetId.toLowerCase() === "ahu-04";

  return (
    <Shell>
      <PageHead
        title={asset?.id ?? assetId}
        subtitle={isAhu04 ? ahu04.location : `${asset?.group ?? "Asset"} · ${asset?.subgroup ?? ""}`}
        right={
          <div className="flex items-center gap-2">
            {asset ? (
              <Tag tone={asset.status === "critical" ? "crit" : asset.status === "watch" ? "warn" : "ok"}>
                <StatusDot status={asset.status} /> {asset.status}
              </Tag>
            ) : null}
            <Link to="/assets" className="rounded border border-border px-2.5 py-1 text-xs hover:bg-muted">
              Back to assets
            </Link>
          </div>
        }
      />

      {!isAhu04 ? (
        <Panel title="Live parameters" hint="Streaming from BMS">
          <dl className="grid gap-3 sm:grid-cols-3">
            <Stat label="Health score" value={`${asset?.health ?? 92}`} />
            <Stat label="Energy efficiency" value={`${asset?.efficiency ?? 95}%`} />
            <Stat label="Maintenance risk" value={asset?.risk ?? "Low"} />
            <Stat label="Last maintenance" value={asset?.lastMaintenance ?? "—"} />
            <Stat label="Anomaly status" value={asset?.status ?? "healthy"} />
            <Stat label="Recommended action" value={asset?.action ?? "No action required"} />
          </dl>
          {brief ? (
            <div className="mt-4">
              <WhyButton
                title={`Why is ${brief.asset} deviating?`}
                explanation={brief.why}
                likelyCause={brief.likelyCause}
                confidence={brief.confidence}
                nextStep={brief.nextStep}
              />
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">
            Full prescriptive diagnostics are demonstrated on{" "}
            <Link to="/assets/$assetId" params={{ assetId: "AHU-04" }} className="underline">
              AHU-04
            </Link>
            .
          </p>
        </Panel>
      ) : (
        <div className="space-y-4">
          <Panel title="Current operating parameters" hint="Compared against dynamic AI baseline">
            <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {ahu04.params.map((p) => (
                <div key={p.label} className="rounded border border-border bg-muted/30 p-3">
                  <dt className="label-xs">{p.label}</dt>
                  <dd className="num mt-1 text-lg font-semibold">{p.value}</dd>
                  <dd className="num mt-1 text-xs text-muted-foreground">Normal {p.normal}</dd>
                  <dd className={`num mt-1 text-xs font-medium ${p.bad ? "text-crit" : "text-ok"}`}>{p.delta}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="14-day parameter trend" hint="Motor current, airflow, static pressure and motor temperature">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(
                [
                  { key: "current", label: "Motor current (A)", color: "var(--crit)" },
                  { key: "temperature", label: "Motor temperature (°C)", color: "var(--warn)" },
                  { key: "airflow", label: "Airflow (CMH)", color: "var(--info)" },
                  { key: "pressure", label: "Static pressure (Pa)", color: "var(--ok)" },
                ] as const
              ).map((s) => (
                <div key={s.key} className="rounded border border-border p-3">
                  <p className="label-xs">{s.label}</p>
                  <div className="mt-2 h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ahu04Trend} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
                        <CartesianGrid stroke="var(--grid)" vertical={false} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          interval={4}
                          tickLine={false}
                          axisLine={{ stroke: "var(--grid)" }}
                        />
                        <YAxis
                          domain={["auto", "auto"]}
                          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                          tickLine={false}
                          axisLine={false}
                          width={52}
                        />
                        <Tooltip
                          contentStyle={{
                            fontSize: 12,
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            background: "var(--surface)",
                          }}
                        />
                        <Line
                          isAnimationActive={false}
                          name={s.label}
                          dataKey={s.key}
                          stroke={s.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Motor current and static pressure rising while airflow falls — the signature of increasing
              air-side resistance.
            </p>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="AI Diagnosis" hint="Abnormal motor loading detected">
              <p className="text-sm font-medium text-crit">Abnormal motor loading detected</p>
              <p className="label-xs mt-4">Probable causes</p>
              <ul className="mt-2 space-y-2.5">
                {ahu04.causes.map((c) => (
                  <li key={c.label}>
                    <div className="flex justify-between text-sm">
                      <span>{c.label}</span>
                      <span className="num font-medium">{c.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-muted">
                      <div className="h-1.5 rounded bg-primary/70" style={{ width: `${c.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded border border-info/25 bg-info-soft px-3 py-2 text-xs font-medium text-info">
                AI-generated probability estimates — for engineering validation
              </p>
              <div className="mt-4">
                <WhyButton
                  title="Why is AHU-04 consuming more power?"
                  explanation={dailyBrief[0]!.why}
                  likelyCause={dailyBrief[0]!.likelyCause}
                  confidence={dailyBrief[0]!.confidence}
                  nextStep={dailyBrief[0]!.nextStep}
                />
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel title="Evidence" hint="Observed data supporting the diagnosis">
                <ul className="space-y-2 text-sm">
                  {ahu04.evidence.map((e) => (
                    <li key={e} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crit" />
                      {e}
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel
                title="Recommended action"
                hint="Estimated impact ₹3,200/day"
                actions={<Tag tone="crit">High priority</Tag>}
              >
                <ol className="space-y-2 text-sm">
                  {ahu04.actions.map((a, i) => (
                    <li key={a} className="flex gap-3">
                      <span className="num flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[11px] text-primary-foreground">
                        {i + 1}
                      </span>
                      {a}
                    </li>
                  ))}
                </ol>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-muted/30 p-3">
      <dt className="label-xs">{label}</dt>
      <dd className="mt-1 text-sm font-medium capitalize">{value}</dd>
    </div>
  );
}