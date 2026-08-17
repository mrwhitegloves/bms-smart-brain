import { useState } from "react";
import { Panel, Tag } from "./shell";

export function WhyButton({
  title,
  explanation,
  likelyCause,
  confidence,
  nextStep,
}: {
  title: string;
  explanation: string;
  likelyCause: string;
  confidence: number;
  nextStep: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded border border-info/30 bg-info-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-info transition-colors hover:bg-info/10"
      >
        {open ? "Hide" : "Why?"}
      </button>
      {open ? (
        <div className="mt-3 w-full">
          <Panel title={title} hint="AI explanation · generated from BMS trend data">
            <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-border bg-muted/50 p-3">
                <dt className="label-xs">Most likely cause</dt>
                <dd className="mt-1 text-sm font-medium">{likelyCause}</dd>
              </div>
              <div className="rounded border border-border bg-muted/50 p-3">
                <dt className="label-xs">Confidence</dt>
                <dd className="num mt-1 text-sm font-medium">{confidence}%</dd>
              </div>
              <div className="rounded border border-border bg-muted/50 p-3">
                <dt className="label-xs">Recommended next step</dt>
                <dd className="mt-1 text-sm font-medium">{nextStep}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <Tag tone="info">AI inference — for engineering validation</Tag>
            </div>
          </Panel>
        </div>
      ) : null}
    </>
  );
}