import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead, Panel, Shell, Tag } from "@/components/bms/shell";
import { copilotAnswers, type CopilotAnswer } from "@/lib/demo-data";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "AI Engineering Copilot | Engineering Intelligence Layer" },
      {
        name: "description",
        content:
          "Ask the engineering copilot why consumption changed, which equipment needs attention and what each deviation costs — with observed data separated from AI inference.",
      },
      { property: "og:title", content: "AI Engineering Copilot" },
      {
        property: "og:description",
        content: "Answers grounded in hotel BMS data, separating observation, inference and recommendation.",
      },
    ],
  }),
  component: CopilotPage,
});

function CopilotPage() {
  const [thread, setThread] = useState<CopilotAnswer[]>([copilotAnswers[0]!]);

  const ask = (a: CopilotAnswer) => setThread((t) => (t.some((x) => x.q === a.q) ? t : [...t, a]));

  return (
    <Shell>
      <PageHead
        title="AI Engineering Copilot"
        subtitle="Grounded in your BMS, meter and maintenance history · answers separate observation from inference"
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {thread.map((a) => (
            <Panel key={a.q} title={a.q} hint="Copilot response">
              <Block label="Observed data" tone="neutral" items={a.observed} />
              <Block label="AI inference" tone="info" items={a.inference} />
              <Block label="Recommendation" tone="ok" items={a.recommendation} />
              <p className="mt-4 text-xs text-muted-foreground">
                Inference is a probability estimate from trend data, not a confirmed physical failure.
              </p>
            </Panel>
          ))}
        </div>
        <Panel title="Suggested questions">
          <ul className="space-y-2">
            {copilotAnswers.map((a) => (
              <li key={a.q}>
                <button
                  onClick={() => ask(a)}
                  className="w-full rounded border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  {a.q}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Demo copilot: responses are pre-computed from the simulated hotel dataset.
          </p>
        </Panel>
      </div>
    </Shell>
  );
}

function Block({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "neutral" | "info" | "ok";
}) {
  return (
    <div className="mt-3 first:mt-0">
      <Tag tone={tone}>{label}</Tag>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}