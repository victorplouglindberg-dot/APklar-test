"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import type { CategoryStat, Education, LedSymbol, Progress } from "../types";
import type { ExamTrack } from "../lib/examGenerator";
import { getEducation } from "../lib/education";
import {
  EXAM_SECONDS,
  LED_MARK_BG,
  ORDKLASSER,
  PENTAGRAM_FELTER,
  VERBUM_TIDER,
  pickExamText,
  tidLabel,
  type HhxExamText,
  type Ordklasse,
  type VerbumTid,
} from "../data/hhxExam";
import {
  emptyExamAnswers,
  formatPoints,
  gradeHhxExam,
  type HhxExamAnswers,
  type HhxExamBedoemmelse,
} from "../lib/hhxExamGrading";
import { SYMBOLS, getSymbolDef } from "../data/symbols";
import Mascot from "../components/Mascot";
import { cn } from "../utils/cn";
import { CheckIcon, ClockIcon, ExamIcon, LedGlyph, LightbulbIcon, XIcon } from "../components/icons";

// HHX-eksamensprøven (AP): øveprøve, der simulerer den interne prøve i uge 45.
// Eleven trækker en ukendt tekst, har 40 minutters forberedelse med 7 opgaver
// og får bagefter en vejledende bedømmelse med karakter og feedback pr. opgave.
// Kun til HHX: STX har andre prøver, så denne side findes kun på HHX-sporet.

type TextMarkId = "hl-yellow" | "hl-green" | "hl-pink" | `led:${LedSymbol}` | `ok:${Ordklasse}`;

const TUSCH: { id: "hl-yellow" | "hl-green" | "hl-pink"; label: string; prik: string }[] = [
  { id: "hl-yellow", label: "Tusch gul", prik: "bg-yellow-300" },
  { id: "hl-green", label: "Tusch grøn", prik: "bg-emerald-400" },
  { id: "hl-pink", label: "Tusch pink", prik: "bg-pink-400" },
];

// -------------------------------------------------------------------------
// Popover-positionering (samme mønster som AnalysisTask i TaskRenderer)
// -------------------------------------------------------------------------

function useAnchoredPicker(active: number | null, onClose: () => void) {
  const anchors = useRef<(HTMLButtonElement | null)[]>([]);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (active === null) return;
    const btn = anchors.current[active];
    const picker = pickerRef.current;
    if (!btn || !picker) return;

    const margin = 10;
    const vw = window.innerWidth;
    const r = btn.getBoundingClientRect();

    const maxW = Math.min(300, vw - margin * 2);
    picker.style.width = `${maxW}px`;
    const pw = picker.offsetWidth;
    const ph = picker.offsetHeight;

    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(margin, Math.min(left, vw - pw - margin));

    const spaceBelow = window.innerHeight - r.bottom;
    const openAbove = spaceBelow < ph + margin + 8 && r.top > ph + margin;
    const top = openAbove ? r.top - ph - 8 : r.bottom + 8;

    setStyle({ position: "fixed", top, left, width: maxW, opacity: 1 });
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    function close() {
      onClose();
    }
    function onPointer(e: PointerEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  return { anchors, pickerRef, style };
}

// -------------------------------------------------------------------------
// Små byggeklodser
// -------------------------------------------------------------------------

/** Tekstfelt til besvarelser (16 px, som resten af appen, så mobil ikke zoomer). */
function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-ink">
        {label}
        {hint && <span className="ml-1 font-medium text-ink/40">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-blue-500"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-blue-500"
        />
      )}
    </div>
  );
}

/** Valgchip (radio-lignende knap uden rigtigt/forkert under forberedelsen). */
function Chip({ selected, onClick, children, className }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border-2 px-3 py-1.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        selected ? "border-blue-500 bg-blue-500 text-white" : "border-ink/15 bg-white text-ink hover:border-blue-400",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Opgavekort med nummer, titel og lille "?":-knap, der viser et hint. */
function OpgaveKort({ nummer, titel, hint, children }: { nummer: number; titel: string; hint: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-start gap-2.5 text-base font-extrabold text-ink">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700">
            {nummer}
          </span>
          <span className="pt-0.5">{titel}</span>
        </h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`Hint til opgave ${nummer}: hvad skal jeg gøre?`}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            open ? "border-amber-400 bg-amber-100 text-amber-800" : "border-ink/15 bg-white text-ink/60 hover:border-amber-400 hover:text-amber-700"
          )}
        >
          ?
        </button>
      </div>
      {open && (
        <div className="mt-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900" role="note">
          <span className="font-bold">Hvad skal du gøre? </span>
          {hint}
        </div>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/** Chunk-vælger med de 7 sætningsled-symboler (som de andre analyseopgaver). */
function ChunkLedPicker({
  chunks,
  assignments,
  onChange,
}: {
  chunks: string[];
  assignments: Record<number, LedSymbol | null>;
  onChange: (index: number, symbol: LedSymbol) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const { anchors, pickerRef, style } = useAnchoredPicker(active, close);

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-ink">
        Sætningen: <span className="italic font-semibold text-ink/70">&quot;{chunks.join(" ")}&quot;</span>
      </p>
      <p className="text-xs text-ink/50">Tryk på et led og vælg det rigtige symbol (følg analysepilen: V først, så S, O, IO, A og SP).</p>
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, i) => {
          const assigned = assignments[i];
          return (
            <div key={i} className="relative">
              <button
                ref={(el) => {
                  anchors.current[i] = el;
                }}
                onClick={() => setActive(active === i ? null : i)}
                aria-haspopup="true"
                aria-expanded={active === i}
                aria-label={`${chunk}: ${assigned ? getSymbolDef(assigned).short : "intet symbol valgt endnu"}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                  active === i ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" : "border-ink/15 bg-white hover:border-blue-400"
                )}
              >
                <span>{chunk}</span>
                <span className="flex h-5 w-5 items-center justify-center text-current">
                  {assigned ? <LedGlyph symbol={assigned} className="h-5 w-5" /> : <span className="text-base leading-none text-ink/30">?</span>}
                </span>
              </button>
              {assigned && (
                <p className="mt-1 max-w-[8rem] text-center text-[10px] font-semibold leading-tight text-ink/50">{getSymbolDef(assigned).short}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink/50">
        {SYMBOLS.map((s) => (
          <span key={s.symbol} className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1">
            <LedGlyph symbol={s.symbol} className="h-3.5 w-3.5" /> {s.short}
          </span>
        ))}
      </div>
      {active !== null && (
        <div
          ref={pickerRef}
          style={style}
          role="menu"
          aria-label="Vælg sætningsled-symbol"
          className="z-40 rounded-2xl border border-ink/10 bg-white p-3 shadow-xl"
        >
          <div className="grid grid-cols-4 gap-2">
            {SYMBOLS.map((s) => (
              <button
                key={s.symbol}
                onClick={() => {
                  onChange(active, s.symbol);
                  close();
                }}
                title={s.name}
                aria-label={`${s.short}: ${s.name}`}
                className="flex aspect-square items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <LedGlyph symbol={s.symbol} className="h-7 w-7" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Chunk-vælger til hovedsætning/ledsætning (opgave 7). */
function HsLsPicker({
  chunks,
  markeringer,
  onChange,
}: {
  chunks: string[];
  markeringer: Record<number, "hs" | "ls" | null>;
  onChange: (index: number, value: "hs" | "ls") => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const { anchors, pickerRef, style } = useAnchoredPicker(active, close);

  const options: { id: "hs" | "ls"; label: string; chip: string }[] = [
    { id: "hs", label: "Hovedsætning (HS)", chip: "bg-blue-500" },
    { id: "ls", label: "Ledsætning (LS)", chip: "bg-rose-500" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-ink">
        Sætningen: <span className="italic font-semibold text-ink/70">&quot;{chunks.join(" ")}&quot;</span>
      </p>
      <p className="text-xs text-ink/50">
        Test med ikke-reglen: Hovedsætning: ikke EFTER verballedet. Ledsætning: ikke MELLEM subjekt og verballed.
      </p>
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, i) => {
          const assigned = markeringer[i];
          return (
            <button
              key={i}
              ref={(el) => {
                anchors.current[i] = el;
              }}
              onClick={() => setActive(active === i ? null : i)}
              aria-haspopup="true"
              aria-expanded={active === i}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                assigned === "hs" && "border-blue-400 bg-blue-100 text-blue-800",
                assigned === "ls" && "border-rose-400 bg-rose-100 text-rose-800",
                !assigned && (active === i ? "border-blue-500 bg-blue-50" : "border-ink/15 bg-white hover:border-blue-400")
              )}
            >
              {chunk}
              {assigned && (
                <span className={cn("ml-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white", assigned === "hs" ? "bg-blue-500" : "bg-rose-500")}>
                  {assigned === "hs" ? "HS" : "LS"}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {active !== null && (
        <div ref={pickerRef} style={style} role="menu" aria-label="Vælg sætningstype" className="z-40 space-y-1.5 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                onChange(active, o.id);
                close();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-ink transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <span className={cn("h-3.5 w-3.5 rounded-full", o.chip)} aria-hidden="true" />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// Klokke (Web Audio): ringer, når forberedelsestiden er gået
// -------------------------------------------------------------------------

function playBell() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [880, 660, 880, 660, 880, 660];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  } catch {
    // Lyd er en finesset: fejl her må aldrig stoppe prøven.
  }
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// -------------------------------------------------------------------------
// Hovedskærmen
// -------------------------------------------------------------------------

export default function HhxExamPage({
  education,
  progress,
  onExit,
  onExamComplete,
}: {
  education: Education;
  progress: Progress;
  onExit: () => void;
  onExamComplete: (track: ExamTrack, correct: number, total: number, byCategory: Record<string, CategoryStat>) => void;
}) {
  const theme = getEducation(education);
  const reduceMotion = progress.settings.reduceMotion;
  const [phase, setPhase] = useState<"intro" | "running" | "grading" | "result">("intro");
  const [text, setText] = useState<HhxExamText>(() => pickExamText());
  const [answers, setAnswers] = useState<HhxExamAnswers>(() => emptyExamAnswers());
  const [bedoemmelse, setBedoemmelse] = useState<HhxExamBedoemmelse | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  // Klokken spilles kun én gang. Modalen er afledt af tilstanden (tid = 0 og
  // fase = running), så vi undgår setState direkte i en effect.
  const bellPlayedRef = useRef(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  // Markeringer i teksten (tusch, sætningsled og ordklasser).
  const [markings, setMarkings] = useState<Record<string, TextMarkId>>({});
  const textRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [toolMsg, setToolMsg] = useState("");
  const [ledPaletteOpen, setLedPaletteOpen] = useState(false);
  const [okPaletteOpen, setOkPaletteOpen] = useState(false);

  // Kopiering af besvarelsen.
  const [toast, setToast] = useState("");
  const [copyFallback, setCopyFallback] = useState<string | null>(null);

  const tokensByPara = useMemo(() => text.paragraphs.map((p) => p.split(/\s+/).filter(Boolean)), [text]);

  // -------------------------------------------------------------------------
  // Timer (40 minutter) + klokke
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && secondsLeft === 0 && !bellPlayedRef.current) {
      bellPlayedRef.current = true;
      playBell();
    }
  }, [phase, secondsLeft]);

  // Modalen er afledt: Den vises, mens forberedelsen kører og tiden er gået,
  // og forsvinder af sig selv, når besvarelsen er afleveret (fasen skifter).
  const showBellModal = phase === "running" && secondsLeft === 0;

  const timePctLeft = Math.round((secondsLeft / EXAM_SECONDS) * 100);
  const timerFarve = secondsLeft <= 60 ? "text-rose-600" : secondsLeft <= 300 ? "text-amber-600" : "text-blue-700";
  const barFarve = secondsLeft <= 60 ? "bg-rose-500" : secondsLeft <= 300 ? "bg-amber-500" : theme.bar;

  // -------------------------------------------------------------------------
  // Markering af tekst (tusch / sætningsled / ordklasse)
  // -------------------------------------------------------------------------
  const applyTool = useCallback((mark: TextMarkId | null) => {
    const sel = window.getSelection();
    // På mobil kan trykket på værktøjsknappen nulstille markeringen. Gem derfor
    // den seneste gyldige markering (via selectionchange nedenfor) og brug den,
    // hvis den aktuelle markering allerede er borte.
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      range = sel.getRangeAt(0);
    } else {
      range = savedRangeRef.current;
    }
    if (!range) {
      setToolMsg("Markér først et ord eller en sætning i teksten (træk med musen eller langt tryk), og vælg derefter et værktøj.");
      return;
    }
    const container = textRef.current;
    if (!container) return;
    let count = 0;
    container.querySelectorAll<HTMLElement>("[data-tok]").forEach((el) => {
      const id = el.dataset.tok;
      if (!id || !range || !range.intersectsNode(el)) return;
      count += 1;
      setMarkings((prev) => {
        const next = { ...prev };
        if (mark === null) delete next[id];
        else next[id] = mark;
        return next;
      });
    });
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) sel.removeAllRanges();
    savedRangeRef.current = null;
    setLedPaletteOpen(false);
    setOkPaletteOpen(false);
    if (count === 0) setToolMsg("Markeringen ramte ikke nogle ord i teksten. Prøv igen.");
    else setToolMsg(mark === null ? `${count} markering${count > 1 ? "er" : ""} slettet.` : `${count} ord markeret ✓`);
  }, []);

  // Gem den seneste ikke-tomme markering, så værktøjer også virker, når
  // berøringsskærme nulstiller markeringen ved tryk på en knap.
  useEffect(() => {
    function onSelectionChange() {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  function markName(m: TextMarkId): string {
    if (m === "hl-yellow") return "tusch gul";
    if (m === "hl-green") return "tusch grøn";
    if (m === "hl-pink") return "tusch pink";
    if (m.startsWith("led:")) return `sætningsled: ${getSymbolDef(m.slice(4) as LedSymbol).short}`;
    const ok = ORDKLASSER.find((o) => m === `ok:${o.id}`);
    return ok ? `ordklasse: ${ok.label}` : "markering";
  }

  function tokenClass(id: string): string {
    const m = markings[id];
    if (!m) return "rounded-sm";
    if (m === "hl-yellow") return "rounded-sm bg-yellow-200 dark:bg-yellow-500/40";
    if (m === "hl-green") return "rounded-sm bg-emerald-200 dark:bg-emerald-500/40";
    if (m === "hl-pink") return "rounded-sm bg-pink-200 dark:bg-pink-500/40";
    if (m.startsWith("led:")) return cn("rounded-sm", LED_MARK_BG[m.slice(4) as LedSymbol]);
    const ok = ORDKLASSER.find((o) => m === `ok:${o.id}`);
    return cn("rounded-sm", ok?.markering ?? "rounded-sm");
  }

  function tokenGlyph(id: string): ReactNode {
    const m = markings[id];
    if (!m || !m.startsWith("led:")) return null;
    return <LedGlyph symbol={m.slice(4) as LedSymbol} className="ml-0.5 inline-block h-3 w-3 align-top text-ink/70" />;
  }

  // -------------------------------------------------------------------------
  // Kopier besvarelsen som tekst
  // -------------------------------------------------------------------------
  const buildBesvarelseTekst = useCallback((): string => {
    const L: string[] = [];
    L.push("AP-eksamensprøve (HHX øveprøve)");
    L.push(`Tekst: "${text.title}" (${text.source})`);
    L.push(`Dato: ${new Date().toLocaleDateString("da-DK")}`);
    L.push("");
    L.push("OPGAVE 1: GENRE");
    L.push(`Valgt genre: ${answers.genre !== null ? text.genreOptions[answers.genre] : "(ikke valgt)"}`);
    L.push(`Begrundelse: ${answers.genreBegrundelse.trim() || "-"}`);
    L.push("");
    L.push("OPGAVE 2: KOMMUNIKATIONSSITUATIONEN (CICEROS PENTAGRAM)");
    for (const f of PENTAGRAM_FELTER) {
      L.push(`${f.label}: ${answers.pentagram[f.id].trim() || "-"}`);
    }
    L.push("");
    L.push("OPGAVE 3: SPROGLIGE SÆRTRÆK");
    L.push(answers.saertraek.trim() || "-");
    L.push("");
    L.push("OPGAVE 4: MORFOLOGISK ANALYSE");
    text.morfologi.forEach((w, i) => {
      const a = answers.morfologi[i];
      L.push(`${w.word}: ${a?.split.trim() || "-"}${w.fleksiv ? ` (fleksiv: ${a?.fleksiv.trim() || "-"})` : ""}`);
    });
    L.push("");
    L.push("OPGAVE 5: SYNTAKTISK ANALYSE");
    L.push(`Sætning: ${text.analyse.sentence}`);
    text.analyse.chunks.forEach((c, i) => {
      const s = answers.analyse[i];
      L.push(`${c} = ${s ? getSymbolDef(s).short : "-"}`);
    });
    L.push("");
    L.push("OPGAVE 6: VERBALLEDETS TID");
    text.tider.forEach((t, i) => {
      const a = answers.tider[i];
      L.push(`"${t.verb}" i "${t.sentence}": ${a?.tid ? tidLabel(a.tid) : "-"} | Omskrevet: ${a?.omskrivning.trim() || "-"}`);
    });
    L.push("");
    L.push("OPGAVE 7: HOVED- OG LEDSÆTNINGER");
    L.push(`Sætning: ${text.hsls.sentence}`);
    text.hsls.chunks.forEach((c, i) => {
      const m = answers.hsls.markeringer[i];
      L.push(`${c} = ${m === "hs" ? "Hovedsætning" : m === "ls" ? "Ledsætning" : "-"}`);
    });
    L.push(`Indleder: ${answers.hsls.indleder.trim() || "-"}`);
    L.push(`Ledsættens funktion: ${answers.hsls.funktion !== null ? text.hsls.funktionOptions[answers.hsls.funktion] : "-"}`);
    L.push("");
    L.push("MARKERINGER I TEKSTEN");
    let harMarkeringer = false;
    tokensByPara.forEach((toks, pi) => {
      toks.forEach((word, ti) => {
        const m = markings[`${pi}:${ti}`];
        if (m) {
          harMarkeringer = true;
          L.push(`${word} = ${markName(m)}`);
        }
      });
    });
    if (!harMarkeringer) L.push("(ingen markeringer)");
    return L.join("\n");
  }, [answers, markings, text, tokensByPara]);

  async function copyBesvarelse() {
    const txt = buildBesvarelseTekst();
    try {
      await navigator.clipboard.writeText(txt);
      setToast("Besvarelsen er kopieret! Husk at indsætte den i et dokument.");
    } catch {
      setCopyFallback(txt);
    }
  }

  function fallbackCopyToClipboard(txt: string) {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopyFallback(null);
      setToast("Besvarelsen er kopieret! Husk at indsætte den i et dokument.");
    } catch {
      setToast("Kopiering lykkedes ikke. Markér teksten i feltet og kopier manuelt.");
    }
  }

  // -------------------------------------------------------------------------
  // Aflevering + bedømmelse
  // -------------------------------------------------------------------------
  const handleSubmit = useCallback(() => {
    const b = gradeHhxExam(text, answers);
    setBedoemmelse(b);
    setConfirmSubmit(false);
    setPhase("grading");
    // Optag forsøget i profilen: 1 "rigtigt" pr. opgave ved 60 % eller mere.
    const byCategory: Record<string, CategoryStat> = {};
    b.opgaver.forEach((o) => {
      byCategory[o.kategoriId] = { correct: o.max > 0 && o.points / o.max >= 0.6 ? 1 : 0, total: 1 };
    });
    const bestaat = b.opgaver.filter((o) => o.max > 0 && o.points / o.max >= 0.6).length;
    onExamComplete("hhx", bestaat, b.opgaver.length, byCategory);
    window.setTimeout(() => setPhase("result"), reduceMotion ? 400 : 1600);
  }, [answers, onExamComplete, reduceMotion, text]);

  function startNewExam(withIntro: boolean) {
    setText(pickExamText());
    setAnswers(emptyExamAnswers());
    setBedoemmelse(null);
    setMarkings({});
    setSecondsLeft(EXAM_SECONDS);
    bellPlayedRef.current = false;
    setConfirmSubmit(false);
    setToolMsg("");
    setPhase(withIntro ? "intro" : "running");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  const antalBesvaredeFelter = useMemo(() => {
    let n = 0;
    if (answers.genre !== null) n += 1;
    if (answers.genreBegrundelse.trim()) n += 1;
    n += PENTAGRAM_FELTER.filter((f) => answers.pentagram[f.id].trim()).length;
    if (answers.saertraek.trim()) n += 1;
    n += text.morfologi.filter((_, i) => answers.morfologi[i]?.split.trim()).length;
    n += text.analyse.chunks.filter((_, i) => answers.analyse[i]).length;
    n += text.tider.filter((_, i) => answers.tider[i]?.tid || answers.tider[i]?.omskrivning.trim()).length;
    n += text.hsls.chunks.filter((_, i) => answers.hsls.markeringer[i]).length;
    if (answers.hsls.indleder.trim()) n += 1;
    if (answers.hsls.funktion !== null) n += 1;
    return n;
  }, [answers, text]);

  // =========================================================================
  // FASE: Intro (informationstekst om eksamen og dens forløb)
  // =========================================================================
  if (phase === "intro") {
    return (
      <motion.div
        key="hhx-intro"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page-narrow space-y-6"
      >
        <div>
          <p className={cn("text-xs font-extrabold uppercase tracking-wide", theme.accentText)}>Eksamensprøve (øveprøve)</p>
          <h1 className="font-display text-2xl font-extrabold text-ink">Sådan foregår AP-eksamen (i uge 45)</h1>
        </div>

        <Mascot
          pose="explain"
          size="md"
          speech="Dette er en øveprøve: Du trækker en ukendt tekst og løser de 7 rigtige eksamensopgaver. Jeg bedømmer dig bagefter, blidt men ærligt!"
          reduceMotion={reduceMotion}
        />

        <div className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5 text-sm leading-relaxed text-ink/80 shadow-sm">
          <p>
            Du trækker en <strong className="text-ink">ukendt tekst</strong> med tilhørende <strong className="text-ink">7 opgaver</strong>. Du har{" "}
            <strong className="text-ink">40 minutter til at løse de 7 opgaver</strong>, ligesom i forberedelseslokalet, hvor der er en tilsynsførende.
          </p>
          <p className="font-bold text-ink">Opgaverne handler om:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Genretræk i teksten</li>
            <li>Kommunikationssituation (Ciceros pentagram)</li>
            <li>Sproglige særtræk</li>
            <li>Morfologisk analyse</li>
            <li>Sætningsanalyse</li>
            <li>Verbaltider</li>
            <li>Hoved- og ledsætninger</li>
          </ul>
          <p>
            Du må bruge <strong className="text-ink">egne noter</strong>, <strong className="text-ink">bøger</strong> fra undervisningen og{" "}
            <strong className="text-ink">ordbog</strong> (ordnet.dk). I appen kan du undervejs markere ord og sætninger i teksten med tusch, sætningsled-symboler
            og ordklasser, ligesom dine noterpåtegninger.
          </p>
          <p>
            Selve eksamenen varer <strong className="text-ink">12-15 minutter</strong>: Du besvarer de 7 opgaver mundtligt for din lærer og en censor, som kan
            stille uddybende spørgsmål. Bagefter snakker I om din <strong className="text-ink">karakter</strong> (7-trins-skalaen), som kommer på
            eksamensbeviset.
          </p>
          <p className="rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs text-blue-800">
            Her i appen er det en øveprøve: Du skriver svarene, og når du indsender (eller klokken ringer), bedømmer Lingua din besvarelse med en vejledende
            karakter og gennemgang af alle 7 opgaver. Karakteren er til forberedelse, ikke til eksamensbeviset.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => {
              setPhase("running");
              window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg",
              theme.gradient,
              "shadow-blue-500/30"
            )}
          >
            <ExamIcon className="h-5 w-5" />
            Træk min tekst og start (40 min)
          </button>
          <button onClick={onExit} className="rounded-full border-2 border-ink/15 px-5 py-3.5 text-sm font-semibold text-ink hover:border-ink/30">
            Tilbage
          </button>
        </div>
      </motion.div>
    );
  }

  // =========================================================================
  // FASE: Grading (Lingua læser besvarelsen)
  // =========================================================================
  if (phase === "grading") {
    return (
      <div className="app-page-narrow flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <Mascot pose="thinking" size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
        <div className="flex items-center gap-2.5 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-md">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
          <span className="text-sm font-semibold text-ink/70">Lingua læser din besvarelse og bedømmer de 7 opgaver…</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FASE: Resultat (vejledende karakter + gennemgang af alle opgaver)
  // =========================================================================
  if (phase === "result" && bedoemmelse) {
    return (
      <motion.div
        key="hhx-result"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page-narrow space-y-6"
      >
        <div className="text-center">
          <Mascot pose={bedoemmelse.pct >= 57 ? "celebrate" : "encourage"} size="md" className="mx-auto justify-center" reduceMotion={reduceMotion} />
          <h1 className="font-display text-2xl font-extrabold text-ink">Din vejledende bedømmelse</h1>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 text-sm leading-relaxed text-ink/80 shadow-sm" role="note">
          {bedoemmelse.intro}
        </div>

        <div className={cn("rounded-3xl border-2 p-6 text-center shadow-sm", "border-blue-200 bg-white")}>
          <p className="text-xs font-extrabold uppercase tracking-wide text-ink/50">Vejledende karakter (7-trins-skalaen)</p>
          <p className={cn("font-display text-5xl font-extrabold", theme.accentText)}>{bedoemmelse.grade > 0 ? bedoemmelse.grade : bedoemmelse.gradeLabel.split(" ")[0]}</p>
          <p className="mt-1 text-sm font-bold text-ink">{bedoemmelse.gradeLabel}</p>
          <p className="mt-2 text-sm text-ink/70">{bedoemmelse.band}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-ink/60">
            {formatPoints(bedoemmelse.points, bedoemmelse.max)} point · {bedoemmelse.pct} %
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-extrabold text-ink">Gennemgang af de 7 opgaver</h2>
          {bedoemmelse.opgaver.map((o) => {
            const pct = o.max > 0 ? Math.round((o.points / o.max) * 100) : 0;
            return (
              <section key={o.nummer} className="space-y-3 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-start gap-2.5 text-base font-extrabold text-ink">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700">{o.nummer}</span>
                    <span className="pt-0.5">{o.titel}</span>
                  </h3>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold", pct >= 60 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800")}>
                    {formatPoints(o.points, o.max)} p.
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={cn("h-full rounded-full", pct >= 60 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-sm text-ink/70">{o.resume}</p>
                {o.fundet.length > 0 && (
                  <ul className="space-y-1.5">
                    {o.fundet.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {o.mangler.length > 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
                    <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-amber-900">
                      <LightbulbIcon className="h-4 w-4" />
                      Det kan du skærpe til eksamen:
                    </p>
                    <ul className="space-y-1.5">
                      {o.mangler.map((m, i) => (
                        <li key={i} className="text-sm leading-relaxed text-amber-900">
                          · {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="rounded-2xl bg-ink/5 p-3.5">
                  <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-ink/50">Modelbesvarelse</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{o.modelSvar}</p>
                </div>
                <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-3.5">
                  <p className="text-sm font-bold text-blue-900">Til selve eksamen: </p>
                  <p className="text-sm leading-relaxed text-blue-900">{o.eksamenTip}</p>
                </div>
              </section>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => startNewExam(false)}
            className={cn("flex-1 rounded-full bg-gradient-to-r py-3 text-sm font-bold text-white shadow-lg", theme.gradient, "shadow-blue-500/30")}
          >
            Ny eksamensprøve: Træk en ny tekst
          </button>
          <button onClick={onExit} className="rounded-full border-2 border-ink/15 px-5 py-3 text-sm font-semibold text-ink hover:border-ink/30">
            Tilbage til prøveoversigten
          </button>
        </div>
      </motion.div>
    );
  }

  // =========================================================================
  // FASE: Running (forberedelsen: tekst, markeringer, 7 opgaver, timer)
  // =========================================================================
  return (
    <motion.div
      key="hhx-running"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="app-page space-y-6"
    >
      {/* Timer: matcher forberedelsestiden på 40 minutter */}
      <div className="sticky top-0 z-30 -mx-4 -mt-2 border-b border-ink/10 bg-white/95 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <ClockIcon className={cn("h-5 w-5 shrink-0", timerFarve)} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/50">Forberedelsestid</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div className={cn("h-full rounded-full transition-all", barFarve)} style={{ width: `${timePctLeft}%` }} />
            </div>
          </div>
          <p className={cn("font-display text-xl font-extrabold tabular-nums", timerFarve)}>{formatTime(secondsLeft)}</p>
          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700"
          >
            Indsend
          </button>
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            aria-label="Forlad eksamensprøven"
            className="shrink-0 rounded-full border-2 border-ink/15 px-3 py-2 text-xs font-bold text-ink/60 hover:border-rose-300 hover:text-rose-600"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <p className={cn("text-xs font-extrabold uppercase tracking-wide", theme.accentText)}>Din tekst (trukket tilfældigt)</p>
        <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{text.title}</h1>
        {text.subtitle && <p className="text-sm font-bold text-ink/60">{text.subtitle}</p>}
        <p className="text-xs text-ink/40">{text.source}</p>
      </div>

      {/* Teksten med markeringer */}
      <div
        ref={textRef}
        className="space-y-3 rounded-3xl border border-ink/10 bg-white p-5 text-[15px] leading-[1.9] text-ink/90 shadow-sm"
        lang="da"
      >
        {tokensByPara.map((toks, pi) => (
          <p key={pi}>
            {toks.map((word, ti) => {
              const id = `${pi}:${ti}`;
              return (
                <span key={ti} data-tok={id} className={tokenClass(id)}>
                  {word}
                  {tokenGlyph(id)}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {/* Markeringværktøjer: tusch, sætningsled og ordklasser */}
      <div className="space-y-2 rounded-3xl border border-ink/10 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold text-ink/60">
          Markér i teksten: Træk over et ord eller en sætning (eller lav et langt tryk) og tryk på et værktøj.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {TUSCH.map((t) => (
            <button
              key={t.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyTool(t.id)}
              title={t.label}
              aria-label={t.label}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink/15 bg-white transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <span className={cn("h-4 w-4 rounded-full", t.prik)} />
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setLedPaletteOpen((o) => !o);
              setOkPaletteOpen(false);
            }}
            aria-expanded={ledPaletteOpen}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Sætningsled
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOkPaletteOpen((o) => !o);
              setLedPaletteOpen(false);
            }}
            aria-expanded={okPaletteOpen}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Ordklasse
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyTool(null)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink/60 transition hover:border-rose-300 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Viskelæder
          </button>
        </div>

        {ledPaletteOpen && (
          <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-3">
            <p className="mb-2 text-xs font-bold text-ink/60">Vælg et sætningsled-symbol og markér i teksten:</p>
            <div className="flex flex-wrap gap-2">
              {SYMBOLS.map((s) => (
                <button
                  key={s.symbol}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTool(`led:${s.symbol}`)}
                  title={s.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <LedGlyph symbol={s.symbol} className="h-4 w-4" />
                  {s.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {okPaletteOpen && (
          <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-3">
            <p className="mb-2 text-xs font-bold text-ink/60">Bekræft ordklassen (de 8 ordklasser):</p>
            <div className="flex flex-wrap gap-2">
              {ORDKLASSER.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTool(`ok:${o.id}`)}
                  title={o.label}
                  className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {toolMsg && (
          <p className="text-xs font-semibold text-blue-700" role="status">
            {toolMsg}
          </p>
        )}
      </div>

      {/* De 7 opgaver */}
      <div className="space-y-5">
        <h2 className="font-display text-lg font-extrabold text-ink">De 7 opgaver</h2>
        <p className="-mt-3 text-xs text-ink/50">
          Du må bruge egne noter, bøger og ordbog (ordnet.dk). Tryk på ?-knappen i hver opgave, hvis du er i tvivl om, hvad du skal gøre.
        </p>

        <OpgaveKort
          nummer={1}
          titel="Genretræk: Hvilken genre er teksten?"
          hint="Placér teksten i en kategori for at forstå dens formål, målgruppe og stil. Overvej først: fiktion eller sagprosa? Derefter: vil teksten overbevise (opinion), oplyse neutralt (information) eller sælge/vinde tilslutning (tale, annonce, reklame)?"
        >
          <div className="space-y-2" role="radiogroup" aria-label="Vælg genre">
            {text.genreOptions.map((g, i) => {
              const selected = answers.genre === i;
              return (
                <button
                  key={g}
                  onClick={() => setAnswers((a) => ({ ...a, genre: i }))}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                    selected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-ink/15 bg-white text-ink hover:border-blue-400"
                  )}
                >
                  <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", selected ? "border-blue-500 bg-blue-500" : "border-ink/20")}>
                    {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  {g}
                </button>
              );
            })}
          </div>
          <Field
            label="Hvordan kan du se det?"
            hint="(brug mindst én ting fra teksten)"
            value={answers.genreBegrundelse}
            onChange={(v) => setAnswers((a) => ({ ...a, genreBegrundelse: v }))}
            placeholder="Fx: Teksten vil overbevise os om..., fordi den bruger..."
            multiline
          />
        </OpgaveKort>

        <OpgaveKort
          nummer={2}
          titel="Kommunikationssituationen (Ciceros pentagram)"
          hint="Analysér de fem faktorer: afsender, emne, modtager, situation og genre/sprog. Formålet står i midten af pentagrammet: Hvad vil afsenderen opnå (informere, overbevise, underholde, sælge)?"
        >
          {PENTAGRAM_FELTER.map((f) => (
            <Field
              key={f.id}
              label={f.label}
              hint={`(${f.hint})`}
              value={answers.pentagram[f.id]}
              onChange={(v) => setAnswers((a) => ({ ...a, pentagram: { ...a.pentagram, [f.id]: v } }))}
              multiline={f.id === "sprog"}
              rows={f.id === "sprog" ? 3 : 2}
              placeholder="Skriv kort her..."
            />
          ))}
        </OpgaveKort>

        <OpgaveKort
          nummer={3}
          titel="Sproglige særtræk"
          hint="Analysér tekstens mikrostruktur og kobl til genren: dominerende ordklasser, semantiske felter, konkrete vs. abstrakte ord, konnotationer (positive/negative/eufemismer), paratakse vs. hypotakse, for-/bagvægt og retoriske spørgsmål. Citér altid fra teksten."
        >
          <Field
            label="Dine observationer"
            hint="(husk citater fra teksten)"
            value={answers.saertraek}
            onChange={(v) => setAnswers((a) => ({ ...a, saertraek: v }))}
            placeholder="Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ..."
            multiline
            rows={7}
          />
        </OpgaveKort>

        <OpgaveKort
          nummer={4}
          titel="Morfologisk analyse"
          hint="Opdel ordene i deres mindste betydningsbærende enheder: rodmorfem, præfiks, suffiks, fleksiv (bøjningsendelse) og bindebogstav. Skriv med bindestreger, fx for-klar-ing-en. Skriv ingen, hvis ordet ikke har en bøjningsendelse."
        >
          <div className="space-y-4">
            {text.morfologi.map((w, i) => (
              <div key={w.word} className="space-y-2 rounded-2xl bg-ink/[0.03] p-3.5">
                <p className="text-sm font-extrabold text-ink">&quot;{w.word}&quot;</p>
                <Field
                  label="Del ordet i morfemer"
                  hint="(brug bindestreger)"
                  value={answers.morfologi[i]?.split ?? ""}
                  onChange={(v) =>
                    setAnswers((a) => ({ ...a, morfologi: { ...a.morfologi, [i]: { split: v, fleksiv: a.morfologi[i]?.fleksiv ?? "" } } }))
                  }
                  placeholder={`Fx ${w.solution.slice(0, 2).join("-")}-...`}
                />
                {w.fleksiv && (
                  <Field
                    label="Bøjningsendelsen (fleksiv)"
                    value={answers.morfologi[i]?.fleksiv ?? ""}
                    onChange={(v) =>
                      setAnswers((a) => ({ ...a, morfologi: { ...a.morfologi, [i]: { split: a.morfologi[i]?.split ?? "", fleksiv: v } } }))
                    }
                    placeholder="Fx -en"
                  />
                )}
              </div>
            ))}
          </div>
        </OpgaveKort>

        <OpgaveKort
          nummer={5}
          titel="Syntaktisk analyse (sætningsanalyse)"
          hint="Giv en syntaktisk analyse af sætningen: Start med verballedet (V). Find subjektet (hvem/hvad + V?). Derefter genstandsled (hvem/hvad + V + S?) og hensynsled (til hvem? kræver altid et genstandsled). Adverbial fortæller om tid, sted, måde eller årsag. Subjektsprædikat siger noget om subjektet (=) og kræver verber som er, bliver, hedder, synes."
        >
          <ChunkLedPicker
            chunks={text.analyse.chunks}
            assignments={answers.analyse}
            onChange={(i, s) => setAnswers((a) => ({ ...a, analyse: { ...a.analyse, [i]: s } }))}
          />
        </OpgaveKort>

        <OpgaveKort
          nummer={6}
          titel="Verballedets tid"
          hint="Identificér verbets tid og omskriv sætningen. Tiderne: præsens (læser), præteritum (læste), perfektum (har læst), pluskvamperfektum (havde læst) og futurum (vil læse). Tip: har + participium = perfektum, havde + participium = pluskvamperfektum."
        >
          <div className="space-y-5">
            {text.tider.map((t, i) => {
              const answer = answers.tider[i] ?? { tid: "" as VerbumTid | "", omskrivning: "" };
              return (
                <div key={i} className="space-y-3 rounded-2xl bg-ink/[0.03] p-3.5">
                  <p className="text-sm italic leading-relaxed text-ink/80">&quot;{t.sentence}&quot;</p>
                  <p className="text-xs font-bold text-ink/60">Hvilken tid står &quot;{t.verb}&quot; i?</p>
                  <div className="flex flex-wrap gap-2">
                    {VERBUM_TIDER.map((vt) => (
                      <Chip
                        key={vt.id}
                        selected={answer.tid === vt.id}
                        onClick={() => setAnswers((a) => ({ ...a, tider: { ...a.tider, [i]: { ...answer, tid: vt.id } } }))}
                      >
                        {vt.kort}
                      </Chip>
                    ))}
                  </div>
                  <Field
                    label={`Omskriv hele sætningen til ${tidLabel(t.omskrivTil).split(" (")[0].toLowerCase()}`}
                    value={answer.omskrivning}
                    onChange={(v) => setAnswers((a) => ({ ...a, tider: { ...a.tider, [i]: { ...answer, omskrivning: v } } }))}
                    placeholder="Skriv hele sætningen med verbet i den nye tid..."
                  />
                </div>
              );
            })}
          </div>
        </OpgaveKort>

        <OpgaveKort
          nummer={7}
          titel="Hoved- og ledsætninger"
          hint="Skil hovedsætningen (kan stå alene; ikke EFTER verballeddet) fra ledsætningen (kan ikke stå alene; ikke MELLEM subjekt og verballed; indledes ofte af at, fordi, når, hvis, som eller der). Sig også, hvilken funktion ledsætningen har i hovedsætningen (subjekt, objekt, adverbial, subjektsprædikat eller attribut)."
        >
          <HsLsPicker
            chunks={text.hsls.chunks}
            markeringer={answers.hsls.markeringer}
            onChange={(i, v) => setAnswers((a) => ({ ...a, hsls: { ...a.hsls, markeringer: { ...a.hsls.markeringer, [i]: v } } }))}
          />
          <Field
            label="Hvilken indleder har ledsætningen?"
            value={answers.hsls.indleder}
            onChange={(v) => setAnswers((a) => ({ ...a, hsls: { ...a.hsls, indleder: v } }))}
            placeholder="Fx at, fordi, når, hvis, som eller der"
          />
          <div>
            <p className="mb-2 text-sm font-bold text-ink">Hvilken funktion har ledsætningen i hovedsætningen?</p>
            <div className="flex flex-wrap gap-2">
              {text.hsls.funktionOptions.map((f, i) => (
                <Chip
                  key={f}
                  selected={answers.hsls.funktion === i}
                  onClick={() => setAnswers((a) => ({ ...a, hsls: { ...a.hsls, funktion: i } }))}
                >
                  {f}
                </Chip>
              ))}
            </div>
          </div>
        </OpgaveKort>
      </div>

      {/* Kopiering + indsendelse */}
      <div className="space-y-3 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={copyBesvarelse}
          className="w-full rounded-full border-2 border-blue-300 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Vil du gemme din prøve? Kopier din besvarelse til tekst her! Husk at indsætte det i et dokument
        </button>
        <p className="text-center text-xs text-ink/40">
          Du har svaret på {antalBesvaredeFelter} felter. Du kan indsende, når du vil, men klokken ringer, når de 40 minutter er gået.
        </p>
        <button
          type="button"
          onClick={() => setConfirmSubmit(true)}
          className={cn("w-full rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg", theme.gradient, "shadow-blue-500/30")}
        >
          Indsend besvarelse → Få vejledende bedømmelse
        </button>
      </div>

      {/* Klokke-modal: tiden er gået */}
      {showBellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/60 p-4">
          <div className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-5 text-center shadow-2xl" role="alertdialog" aria-modal="true" aria-label="Klokken har ringet">
            <p className="text-4xl" aria-hidden="true">
              🔔
            </p>
            <h3 className="font-display text-lg font-extrabold text-ink">Klokken har ringet!</h3>
            <p className="text-sm text-ink/70">Forberedelsestiden på 40 minutter er slut. Ligesom til den rigtige eksamen skal du aflevere din opgave med det samme.</p>
            <button
              onClick={handleSubmit}
              className={cn("w-full rounded-full bg-gradient-to-r py-3 text-sm font-bold text-white shadow-lg", theme.gradient, "shadow-blue-500/30")}
            >
              Aflevér din opgave nu
            </button>
          </div>
        </div>
      )}

      {/* Bekræftelse før indsendelse */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/60 p-4">
          <div className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Indsend besvarelse">
            <h3 className="font-display text-lg font-extrabold text-ink">Indsend besvarelsen?</h3>
            <p className="text-sm text-ink/70">
              Du har svaret på {antalBesvaredeFelter} felter. Efter indsendelsen bedømmer Lingua alle 7 opgaver og giver en vejledende karakter. Besvarelsen kan
              ikke ændres bagefter.
            </p>
            <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-800">Tip: Vil du gemme din prøve? Kopier først din besvarelse til tekst med knappen ovenfor.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmSubmit(false)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Fortsæt med at skrive
              </button>
              <button onClick={handleSubmit} className={cn("flex-1 rounded-full bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-md", theme.gradient)}>
                Indsend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forlad prøven */}
      {confirmLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/60 p-4">
          <div className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Forlad eksamensprøven">
            <h3 className="font-display text-lg font-extrabold text-ink">Forlad eksamensprøven?</h3>
            <p className="text-sm text-ink/70">Alt, hvad du har skrevet i denne prøve, slettes. Du kan altid trække en ny tekst bagefter.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmLeave(false)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Bliv på prøven
              </button>
              <button onClick={onExit} className="flex-1 rounded-full bg-ink py-2.5 text-sm font-bold text-white">
                Forlad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kopi-fallback */}
      {copyFallback !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/60 p-4">
          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Kopier din besvarelse">
            <h3 className="font-display text-lg font-extrabold text-ink">Kopier din besvarelse</h3>
            <p className="text-xs text-ink/60">Kopiering kunne ikke gøres automatisk. Markér teksten herunder og kopier den manuelt (fx med Ctrl/Cmd+C).</p>
            <textarea
              readOnly
              value={copyFallback}
              rows={10}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-xl border-2 border-ink/15 bg-ink/[0.03] px-3 py-2.5 text-[13px] text-ink"
            />
            <div className="flex gap-2">
              <button onClick={() => setCopyFallback(null)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Luk
              </button>
              <button
                onClick={() => fallbackCopyToClipboard(copyFallback)}
                className="flex-1 rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/30"
              >
                Prøv at kopier igen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-lg" role="status">
          {toast}
        </div>
      )}
    </motion.div>
  );
}

