import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHead, Panel, Shell, StatusDot, Tag } from "@/components/bms/shell";
import { assets, type AssetStatus } from "@/lib/demo-data";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "Asset Health View | Engineering Intelligence Layer" },
      {
        name: "description",
        content:
          "Hotel asset hierarchy with health score, energy efficiency, anomaly status, maintenance risk and recommended action for 126 assets.",
      },
      { property: "og:title", content: "Asset Health View" },
      {
        property: "og:description",
        content: "126 hotel assets ranked by health, efficiency and maintenance risk.",
      },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const [filter, setFilter] = useState<"all" | AssetStatus>("all");
  const [group, setGroup] = useState<string>("All");

  const groups = useMemo(() => ["All", ...new Set(assets.map((a) => a.group))], []);
  const rows = assets.filter(
    (a) => (filter === "all" || a.status === filter) && (group === "All" || a.group === group),
  );

  const tree = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const a of assets) {
      if (!map.has(a.group)) map.set(a.group, new Map());
      const sub = map.get(a.group)!;
      sub.set(a.subgroup, (sub.get(a.subgroup) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <Shell>
      <PageHead
        title="Asset Health View"
        subtitle="126 assets under continuous observation · health, efficiency, risk and action"
      />
      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <Panel title="Hotel asset hierarchy">
          <ul className="space-y-3 text-sm">
            {[...tree.entries()].map(([g, subs]) => (
              <li key={g}>
                <button
                  onClick={() => setGroup(g)}
                  className={`w-full text-left font-medium ${group === g ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {g}
                </button>
                <ul className="mt-1 space-y-1 border-l border-border pl-3 num text-xs text-muted-foreground">
                  {[...subs.entries()].map(([s, n]) => (
                    <li key={s} className="flex justify-between">
                      <span>{s}</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setGroup("All")}
            className="mt-4 w-full rounded border border-border px-2 py-1.5 text-xs hover:bg-muted"
          >
            Show all groups
          </button>
        </Panel>

        <Panel
          title={`Assets · ${group}`}
          hint={`${rows.length} shown`}
          actions={
            <div className="flex gap-1">
              {(["all", "critical", "watch", "healthy"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded border px-2 py-1 text-[11px] uppercase tracking-wide ${
                    filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          <div className="max-h-[620px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-border text-left">
                  {["Asset", "Group", "Health", "Efficiency", "Status", "Risk", "Last maint.", "Recommended action"].map(
                    (h) => (
                      <th key={h} className="label-xs py-2 pr-3 font-medium">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b border-border/70 hover:bg-muted/40">
                    <td className="num py-2 pr-3 font-medium">
                      <Link
                        to="/assets/$assetId"
                        params={{ assetId: a.id }}
                        className="underline-offset-4 hover:underline"
                      >
                        {a.id}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{a.subgroup}</td>
                    <td className="num py-2 pr-3">
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-14 rounded bg-muted">
                          <span
                            className={`block h-1.5 rounded ${a.health > 88 ? "bg-ok" : a.health > 70 ? "bg-warn" : "bg-crit"}`}
                            style={{ width: `${a.health}%` }}
                          />
                        </span>
                        {a.health}
                      </span>
                    </td>
                    <td className="num py-2 pr-3">{a.efficiency}%</td>
                    <td className="py-2 pr-3">
                      <span className="flex items-center gap-2 capitalize">
                        <StatusDot status={a.status} />
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <Tag tone={a.risk === "High" ? "crit" : a.risk === "Medium" ? "warn" : "ok"}>{a.risk}</Tag>
                    </td>
                    <td className="num py-2 pr-3 text-muted-foreground">{a.lastMaintenance}</td>
                    <td className="py-2 pr-3">{a.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}