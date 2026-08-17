import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { REPORT_DATE } from "@/lib/demo-data";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/assets", label: "Asset Health" },
  { to: "/water", label: "Water Intelligence" },
  { to: "/report", label: "Shift Report" },
  { to: "/copilot", label: "AI Copilot" },
  { to: "/architecture", label: "Architecture" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="leading-tight">
              <div className="flex h-8 w-32 items-center justify-center rounded-lg bg-white">
                <img src="/engenx-logo.png" alt="Preview" className="w-32 h-8 object-cover" />
              </div>
              <span className="block text-sm font-normal tracking-tight">
                Engineering, Next Generation
              </span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-accent-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-xs text-muted-foreground sm:block">
              Data source: <span className="text-foreground">BMS · live</span>
            </span>
            <span className="num rounded border border-border bg-muted px-2.5 py-1 text-xs">
              {REPORT_DATE}
            </span>
          </div>
        </div>
        <div className="border-t border-border bg-muted/50 lg:hidden">
          <div className="flex gap-1 overflow-x-auto px-4 py-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="whitespace-nowrap rounded px-2.5 py-1 text-xs text-muted-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-6">{children}</main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-muted-foreground">
          EngenX — Next Generation Engineering · These AI insights are probabilistic estimates intended for engineering validation, not definitive physical failure confirmations.
        </div>
      </footer>
    </div>
  );
}

export function PageHead({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Panel({
  title,
  hint,
  actions,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title ? (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function StatusDot({ status }: { status: "healthy" | "watch" | "critical" }) {
  const cls =
    status === "critical" ? "bg-crit" : status === "watch" ? "bg-warn" : "bg-ok";
  return <span className={`inline-block h-2 w-2 rounded-full ${cls}`} />;
}

export function Tag({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "crit" | "info";
  children: ReactNode;
}) {
  const map = {
    neutral: "bg-muted text-muted-foreground border-border",
    ok: "bg-ok-soft text-ok border-ok/25",
    warn: "bg-warn-soft text-warn border-warn/25",
    crit: "bg-crit-soft text-crit border-crit/25",
    info: "bg-info-soft text-info border-info/25",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${map[tone]}`}
    >
      {children}
    </span>
  );
}