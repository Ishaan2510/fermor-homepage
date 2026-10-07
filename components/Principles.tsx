import { FERMOR_URL, PRINCIPLES } from "@/lib/content";

export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="border-t border-ink/14 bg-card">
      <div className="wrap flex flex-wrap items-stretch gap-[clamp(40px,6vw,88px)] py-[clamp(56px,8vw,104px)]">
        <div className="flex min-w-0 flex-[2_1_520px] flex-col">
          <h2 id="principles-title" className="eyebrow mb-3.5 font-normal">
            How Fermor works
          </h2>
          <ol className="m-0 list-none border-t border-ink p-0">
            {PRINCIPLES.map((text, i) => (
              <li
                key={text}
                className="grid grid-cols-[clamp(64px,9vw,112px)_1fr] items-baseline gap-4 border-b border-ink/12 py-[clamp(18px,2.4vw,28px)]"
              >
                <span className="num font-serif text-[clamp(40px,5vw,64px)] leading-none tracking-[-0.02em] text-green">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-pretty font-serif text-[clamp(20px,2.2vw,27px)] leading-[1.3] tracking-[-0.005em]">{text}</span>
              </li>
            ))}
          </ol>
        </div>
        <HealthScoreCard />
      </div>
    </section>
  );
}

const FACTORS = [
  { name: "Savings rate", status: "Good", pct: 78 },
  { name: "Debt load", status: "Moderate", pct: 56 },
  { name: "Emergency fund", status: "Needs work", pct: 34 },
];

const SCORE = 72;
const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function HealthScoreCard() {
  return (
    <aside
      aria-labelledby="health-title"
      className="flex min-w-0 flex-[1_1_320px] flex-col gap-[22px] rounded-md bg-ink p-[clamp(24px,3vw,32px)] text-paper"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-[2px] bg-sage px-[7px] py-1 font-mono text-[11px] font-medium tracking-[0.06em] text-ink">NEW</span>
        <span className="rounded-[2px] border border-paper/25 px-[7px] py-[3px] font-mono text-[11px] tracking-[0.06em] text-[#b7b3a6]">
          EXAMPLE
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 id="health-title" className="m-0 font-serif text-[clamp(30px,3vw,38px)] font-normal leading-[1.05] tracking-[-0.015em]">
          Financial Health Score
        </h3>
        <p className="m-0 text-[15px] text-[#c9c5b8]">Now in the app.</p>
      </div>

      <figure className="m-0 flex flex-col gap-[22px] rounded border border-paper/14 px-5 py-[22px]" aria-label={`Example score ${SCORE} out of 100`}>
        <div className="flex items-center gap-5">
          <div className="relative size-[132px] flex-none">
            <svg width="132" height="132" viewBox="0 0 132 132" className="block -rotate-90" aria-hidden>
              <circle cx="66" cy="66" r={RADIUS} fill="none" stroke="rgba(245,242,234,.12)" strokeWidth="9" />
              <circle
                cx="66"
                cy="66"
                r={RADIUS}
                fill="none"
                stroke="#9dbba6"
                strokeWidth="9"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - SCORE / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="num font-serif text-5xl leading-none tracking-[-0.02em]">{SCORE}</span>
              <span className="num text-xs text-[#b7b3a6]">/100</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#b7b3a6]">Overall</span>
            <span className="font-serif text-2xl leading-[1.1]">Steady</span>
          </div>
        </div>
        <div className="flex flex-col">
          {FACTORS.map((f) => (
            <div key={f.name} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-t border-paper/12 py-3">
              <span className="text-sm">{f.name}</span>
              <span className="text-[13px] text-[#c9c5b8]">{f.status}</span>
              <div className="col-span-2 h-[5px] rounded-[1px] bg-paper/12">
                <div className="h-full rounded-[1px] bg-sage" style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </figure>

      <a
        href={FERMOR_URL}
        target="_blank"
        rel="noopener"
        className="mt-auto flex h-12 items-center justify-center rounded bg-paper text-[15px] font-semibold text-ink hover:bg-white hover:text-ink"
      >
        Get the app
      </a>
    </aside>
  );
}
