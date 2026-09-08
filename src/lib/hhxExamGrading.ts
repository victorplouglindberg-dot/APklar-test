// Bedømmelsesmotor for HHX-eksamensprøven (AP øveprøve).
//
// Eksamensdelen er KUN til forberedelse: Karakteren er vejledende og sat lidt
// blidt, så den beskriver elevens faglige niveau uden at føles som en dom.
// Motoren er regelbaseret: Den sammenholder elevens svar med facitlisterne i
// data/hhxExam.ts (nøgleord, morfemer, symboler og tider) og bygger feedback
// pr. opgave: hvad var rigtigt, hvad manglede, modelbesvarelse og et tip til
// selve eksamen. Skal bedømmelsen senere erstattes af en ægte AI-endpoint,
// skal kun gradeHhxExam() udskiftes: Resten af skærmen bruger blot typen
// HhxExamBedoemmelse.

import type { HhxExamText, PentagramFeltId, VerbumTid } from "../data/hhxExam";
import { PENTAGRAM_FELTER, tidLabel } from "../data/hhxExam";
import { getSymbolDef } from "../data/symbols";
import type { LedSymbol } from "../types";

// ---------------------------------------------------------------------------
// Elevens besvarelse
// ---------------------------------------------------------------------------

export interface HhxExamAnswers {
  genre: number | null;
  genreBegrundelse: string;
  pentagram: Record<PentagramFeltId, string>;
  saertraek: string;
  morfologi: Record<number, { split: string; fleksiv: string }>;
  analyse: Record<number, LedSymbol | null>;
  tider: Record<number, { tid: VerbumTid | ""; omskrivning: string }>;
  hsls: {
    markeringer: Record<number, "hs" | "ls" | null>;
    indleder: string;
    funktion: number | null;
  };
}

export function emptyExamAnswers(): HhxExamAnswers {
  return {
    genre: null,
    genreBegrundelse: "",
    pentagram: { afsender: "", emne: "", modtager: "", situation: "", sprog: "", formaal: "" },
    saertraek: "",
    morfologi: {},
    analyse: {},
    tider: {},
    hsls: { markeringer: {}, indleder: "", funktion: null },
  };
}

// ---------------------------------------------------------------------------
// Resultattyper
// ---------------------------------------------------------------------------

export interface OpgaveResultat {
  nummer: number;
  titel: string;
  kategoriId: string;
  points: number;
  max: number;
  resume: string;
  fundet: string[];
  mangler: string[];
  modelSvar: string;
  eksamenTip: string;
}

export interface HhxExamBedoemmelse {
  grade: number; // 12, 10, 7, 4, 02 (2), 00 (0) eller -3 (-3)
  gradeLabel: string;
  band: string;
  pct: number;
  points: number;
  max: number;
  intro: string;
  opgaver: OpgaveResultat[];
}

// ---------------------------------------------------------------------------
// Hjælpere
// ---------------------------------------------------------------------------

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:()"'«»“”…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(answer: string, keywords: string[]): boolean {
  const n = norm(answer);
  if (n.length === 0) return false;
  return keywords.some((k) => n.includes(norm(k)));
}

// Tjekker om en verbform (evt. flerordet som "har oplevet") indgår i elevens
// omskrivning. Ordene skal stå i rækkefølge, men der må gerne stå andre ord
// imellem ("har også oplevet" er god nok): Det er verbformen, der tæller.
function containsForm(answer: string, form: string): boolean {
  const n = norm(answer);
  if (n.length === 0) return false;
  let pos = 0;
  for (const word of norm(form).split(" ")) {
    const idx = n.indexOf(word, pos);
    if (idx === -1) return false;
    pos = idx + word.length;
  }
  return true;
}

function splitMorphemes(input: string): string[] {
  return norm(input)
    .replace(/\s+/g, "")
    .split(/[-–=/]+/)
    .filter(Boolean);
}

function morphemeScore(input: string, solution: string[], altSolutions?: string[][]): { score: number; correct: boolean } {
  const parts = splitMorphemes(input);
  if (parts.length === 0) return { score: 0, correct: false };
  const candidates = [solution, ...(altSolutions ?? [])];
  for (const c of candidates) {
    if (parts.join("+") === c.join("+")) return { score: 1, correct: true };
  }
  // Halvt point ved samme morfemer i anden rækkefølge (blid bedømmelse).
  for (const c of candidates) {
    if ([...parts].sort().join("+") === [...c].sort().join("+")) return { score: 0.75, correct: true };
  }
  return { score: 0, correct: false };
}

function fleksivCorrect(answer: string, expected?: string): boolean {
  if (!expected) return true; // ordet har ingen bøjningsendelse at bedømme
  const a = norm(answer).replace(/\s+/g, "");
  if (a.length === 0) return false;
  return a.includes(expected.replace(/[-\s]/g, ""));
}

function formatPoints(points: number, max: number): string {
  const fmt = (n: number) => {
    const rounded = Math.round(n * 2) / 2;
    return String(rounded).replace(".", ",");
  };
  return `${fmt(points)} af ${fmt(max)}`;
}

// ---------------------------------------------------------------------------
// Karakterfastsættelse (7-trins-skalaen, lidt blide grænser da det er en
// øveprøve, der skal beskrive niveau uden at føles som en dom)
// ---------------------------------------------------------------------------

function gradeFromPct(pct: number): { grade: number; gradeLabel: string; band: string } {
  if (pct >= 84) {
    return {
      grade: 12,
      gradeLabel: "12 (Fremragende)",
      band:
        "Du viser en sikker beherskelse af genre, kommunikationssituation og grammatik. Nu handler det mest om at øve dig i at sige det hele højt til eksamen.",
    };
  }
  if (pct >= 71) {
    return {
      grade: 10,
      gradeLabel: "10 (Meget godt)",
      band: "Du er godt rustet. Finpuds de detaljer, gennemgangen nedenfor peger på, så står du meget stærkt i uge 45.",
    };
  }
  if (pct >= 57) {
    return {
      grade: 7,
      gradeLabel: "7 (Godt)",
      band: "Du har styr på kernen. Flere fagbegreber og skærpede detaljer løfter dig videre op ad skalaen.",
    };
  }
  if (pct >= 43) {
    return {
      grade: 4,
      gradeLabel: "4 (Middel)",
      band: "Et middelniveau med god basis. Gennemgangen nedenfor viser præcis, hvad du skal øve frem til eksamen.",
    };
  }
  if (pct >= 29) {
    return {
      grade: 2,
      gradeLabel: "02 (Tilstrækkeligt)",
      band: "Du er på vej: Noget af grundstoffet sidder, men der skal træning til. Læs gennemgangen og tag en ny prøve.",
    };
  }
  if (pct >= 16) {
    return {
      grade: 0,
      gradeLabel: "00 (Utilstrækkeligt)",
      band: "Det er præcis, hvad en øveprøve er til: at finde ud af, hvor du skal starte. Læs gennemgangen nedenfor og prøv igen.",
    };
  }
  return {
    grade: -3,
    gradeLabel: "-3",
    band:
      "Ikke noget panik: Nu ved du, hvad du skal arbejde med. Genopfrisk stoffet under Øv dig og tag en ny eksamensprøve bagefter.",
  };
}

const BEDOEMMELSE_INTRO =
  "Denne prøve er kun lavet med det formål at forberede dig til den mundtlige AP-eksamen. Karakteren er derfor kun vejledende: Den er bedømt lidt blidt og siger mest noget om, hvor dit faglige niveau står lige nu, ikke om, hvad du ender med til selve eksamen i uge 45. Bedømmelsen er automatisk, og især opgave 2 og 3 er meget individuelle: Der kan være mange korrekte svar, som Lingua ikke kan kende. Brug derfor gennemgangen nedenfor som retning, ikke som dom: Den viser, hvad der var rigtigt, hvad der manglede, og hvad du kan gøre anderledes til selve eksamen.";

// ---------------------------------------------------------------------------
// Hovedfunktion: bedøm hele besvarelsen
// ---------------------------------------------------------------------------

export function gradeHhxExam(text: HhxExamText, a: HhxExamAnswers): HhxExamBedoemmelse {
  const opgaver: OpgaveResultat[] = [];

  // Opgave 1: Genretræk (max 3 point: 2 for rigtig genre, 1 for begrundelse)
  {
    const rigtig = a.genre === text.correctGenreIndex;
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    if (rigtig) {
      points += 2;
      fundet.push(`Du valgte den rigtige genre: ${text.genre}.`);
    } else if (a.genre !== null) {
      mangler.push(`Du valgte "${text.genreOptions[a.genre]}". Den rigtige genre er ${text.genre}.`);
    } else {
      mangler.push("Du valgte ikke nogen genre. Tricket er at spørge: Vil teksten overbevise (opinion/tale), oplyse (information) eller sælge (annonce/reklame)?");
    }
    if (hasAny(a.genreBegrundelse, text.begrundKeywords)) {
      points += 1;
      fundet.push("Din begrundelse bruger genretræk, som genren kan kendes på.");
    } else {
      mangler.push("Begrund genrebestemmelsen med konkrete træk fra teksten: formål, afsender, ordvalg eller citater.");
    }
    opgaver.push({
      nummer: 1,
      titel: "Genretræk",
      kategoriId: "genrer",
      points,
      max: 3,
      resume: rigtig ? "Genrebestemmelsen sidder på plads." : "Genrebestemmelsen ramte ved siden af.",
      fundet,
      mangler,
      modelSvar: `${text.genre}. ${text.genreExplanation}`,
      eksamenTip:
        "Sig gerne først, om teksten er sagprosa eller fiktion, og om den vil overbevise, oplyse eller sælge. Det viser censor, at du arbejder med metode, ikke gætter.",
    });
  }

  // Opgave 2: Kommunikationssituationen (Ciceros pentagram, max 6 point)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    const ramte: string[] = [];
    for (const felt of PENTAGRAM_FELTER) {
      const facit = text.pentagram[felt.id];
      const value = a.pentagram[felt.id];
      if (hasAny(value, facit.keywords)) {
        points += 1;
        ramte.push(felt.label);
      } else if (value.trim().length > 0) {
        points += 0.25;
        mangler.push(`${felt.label}: Du har skrevet noget, men ramt ikke kernen. ${felt.hint} ${facit.model}`);
      } else {
        mangler.push(`${felt.label}: Feltet mangler. ${facit.model}`);
      }
    }
    if (ramte.length > 0) fundet.push(`Du ramte ${ramte.length} af 5 felter plus formålet: ${ramte.join(", ")}.`);
    opgaver.push({
      nummer: 2,
      titel: "Kommunikationssituationen (Ciceros pentagram)",
      kategoriId: "kommunikation",
      points,
      max: 6,
      resume: `${ramte.length} af 6 felter var ramt.`,
      fundet,
      mangler,
      modelSvar: PENTAGRAM_FELTER.map((f) => `${f.label}: ${text.pentagram[f.id].model}`).join("\n"),
      eksamenTip:
        "Gå altid rundt om alle fem hjørner, og afslut med formålet i midten. En god huskeregel: Afsenderen vil noget (formål) hos nogen (modtager) med noget (emne) et sted (situation) på en bestemt måde (genre/sprog).",
    });
  }

  // Opgave 3: Sproglige særtræk (max 4 point: 1 pr. ramt kategori)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    const ramte: string[] = [];
    const manglede: string[] = [];
    for (const kat of text.saertraek.kategorier) {
      if (hasAny(a.saertraek, kat.keywords)) ramte.push(kat.label);
      else manglede.push(kat.label);
    }
    points = Math.min(4, ramte.length);
    if (ramte.length === 0 && a.saertraek.trim().length > 0) {
      points = 0.5; // blidt: der er skrevet noget, men ingen genkendelige begreber
    }
    if (ramte.length > 0) fundet.push(`Du arbejdede med: ${ramte.join(", ")}.`);
    if (a.saertraek.trim().length === 0) {
      mangler.push("Du har ikke skrevet nogen sproglige særtræk. Vælg 3-4 steder i teksten og beskriv dem med fagbegreber.");
    } else if (manglede.length > 0) {
      mangler.push(`Du kunne også røre ved: ${manglede.slice(0, 3).join(", ")}. Husk at citere fra teksten.`);
    } else {
      fundet.push("Du rørte ved alle de vigtigste kategorier: stærkt!");
    }
    opgaver.push({
      nummer: 3,
      titel: "Sproglige særtræk",
      kategoriId: "semantik",
      points,
      max: 4,
      resume: `${ramte.length} af ${text.saertraek.kategorier.length} kategorier var ramt.`,
      fundet,
      mangler,
      modelSvar: text.saertraek.model,
      eksamenTip:
        "Der er mange korrekte svar her, så det vigtigste er metoden: citér, nævn fagbegrebet og kobl til genren (hvordan støtter ordvalget tekstens formål?).",
    });
  }

  // Opgave 4: Morfologisk analyse (1 point pr. korrekt split + 0,5 for fleksiv)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    let max = 0;
    text.morfologi.forEach((w, i) => {
      const answer = a.morfologi[i];
      const fleksivMax = w.fleksiv ? 0.5 : 0;
      max += 1 + fleksivMax;
      if (!answer || answer.split.trim().length === 0) {
        mangler.push(`"${w.word}" blev ikke delt. Facit: ${w.solution.join("-")}. ${w.note}`);
        return;
      }
      const m = morphemeScore(answer.split, w.solution, w.altSolutions);
      points += m.score;
      if (w.fleksiv) {
        if (fleksivCorrect(answer.fleksiv, w.fleksiv)) points += 0.5;
        else mangler.push(`"${w.word}": Bøjningsendelsen (fleksiv) er ${w.fleksiv}.`);
      }
      if (m.correct) {
        fundet.push(`"${w.word}" er delt rigtigt: ${w.solution.join("-")}${w.fleksiv ? ` (fleksiv ${w.fleksiv})` : ""} ✓`);
      } else {
        mangler.push(`"${w.word}" skal deles sådan: ${w.solution.join("-")}. ${w.note}`);
      }
    });
    opgaver.push({
      nummer: 4,
      titel: "Morfologisk analyse",
      kategoriId: "morfologi",
      points,
      max,
      resume: `${text.morfologi.length} ord skulle deles i morfemer.`,
      fundet,
      mangler,
      modelSvar: text.morfologi
        .map((w) => `${w.word} = ${w.solution.join(" - ")}${w.fleksiv ? ` (fleksiv: ${w.fleksiv})` : " (ingen fleksiv her)"}`)
        .join("\n"),
      eksamenTip:
        "Gå altid systematisk frem: Find først rodmorfemerne (og bindebogstavet ved sammensatte ord), og kig derefter på præfiks, suffiks og til sidst bøjningsendelsen.",
    });
  }

  // Opgave 5: Syntaktisk analyse (1 point pr. rigtigt sætningsled)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    text.analyse.chunks.forEach((chunk, i) => {
      const facit = text.analyse.correctMap[i];
      const def = getSymbolDef(facit);
      if (a.analyse[i] === facit) {
        points += 1;
        fundet.push(`"${chunk}" = ${def.short} ✓`);
      } else if (a.analyse[i]) {
        const elevDef = getSymbolDef(a.analyse[i] as LedSymbol);
        mangler.push(`"${chunk}" skal være ${def.short} (${def.name}), ikke ${elevDef.short}.`);
      } else {
        mangler.push(`"${chunk}" blev ikke markeret. Facit: ${def.short} (${def.name}).`);
      }
    });
    opgaver.push({
      nummer: 5,
      titel: "Syntaktisk analyse (sætningsanalyse)",
      kategoriId: "saetningsled",
      points,
      max: text.analyse.chunks.length,
      resume: `${points} af ${text.analyse.chunks.length} led var rigtige.`,
      fundet,
      mangler,
      modelSvar: `${text.analyse.chunks.map((c, i) => `${c.trim()} = ${getSymbolDef(text.analyse.correctMap[i]).short}`).join("\n")}\n${text.analyse.forklaring}`,
      eksamenTip:
        "Følg altid analysepilen: verballed først, så subjekt (hvem/hvad + V?), derefter genstandsled og hensynsled, til sidst adverbial og prædikat. Husk: Hensynsled kræver et genstandsled, og genstandsled og subjektsprædikat kan ikke optræde i samme sætning.",
    });
  }

  // Opgave 6: Verballedets tid (2 point pr. sætning: 1 for tiden, 1 for omskrivning)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    const max = text.tider.length * 2;
    text.tider.forEach((t, i) => {
      const answer = a.tider[i];
      const facitLabel = tidLabel(t.tid);
      if (answer && answer.tid === t.tid) {
        points += 1;
        fundet.push(`"${t.verb}" er ${facitLabel} ✓`);
      } else if (answer && answer.tid) {
        mangler.push(`"${t.verb}" er ${facitLabel}, ikke ${tidLabel(answer.tid)}.`);
      } else {
        mangler.push(`Du angav ikke tiden for "${t.verb}". Facit: ${facitLabel}.`);
      }
      const omskrivning = answer?.omskrivning ?? "";
      if (t.omskrivGodkendte.some((f) => containsForm(omskrivning, f))) {
        points += 1;
        fundet.push(`Omskrivningen til ${tidLabel(t.omskrivTil)} er god ✓`);
      } else {
        mangler.push(`Omskriv til ${tidLabel(t.omskrivTil)} med den nye verbform. Eksempel: ${t.omskrivningEksempel}`);
      }
    });
    opgaver.push({
      nummer: 6,
      titel: "Verballedets tid",
      kategoriId: "tempus",
      points,
      max,
      resume: `${text.tider.length} sætninger skulle tidsbestemmes og omskrives.`,
      fundet,
      mangler,
      modelSvar: text.tider
        .map((t) => `${t.sentence}\n"${t.verb}" står i ${tidLabel(t.tid)}. Omskrevet til ${tidLabel(t.omskrivTil)}: ${t.omskrivningEksempel}`)
        .join("\n\n"),
      eksamenTip:
        "Kender du ikke tiden, så prøv at omskrive med har/havde/vil: har + participium er perfektum, havde + participium er pluskvamperfektum og vil + infinitiv er futurum.",
    });
  }

  // Opgave 7: Hoved- og ledsætninger (1 point pr. chunk + 1 indleder + 1 funktion)
  {
    const fundet: string[] = [];
    const mangler: string[] = [];
    let points = 0;
    const max = text.hsls.chunks.length + 2;
    text.hsls.chunks.forEach((chunk, i) => {
      const facit = text.hsls.correctMap[i];
      const facitLabel = facit === "hs" ? "hovedsætning" : "ledsætning";
      if (a.hsls.markeringer[i] === facit) {
        points += 1;
        fundet.push(`"${chunk}" er en ${facitLabel} ✓`);
      } else if (a.hsls.markeringer[i]) {
        const elevLabel = a.hsls.markeringer[i] === "hs" ? "hovedsætning" : "ledsætning";
        mangler.push(`"${chunk}" er en ${facitLabel}, ikke en ${elevLabel}.`);
      } else {
        mangler.push(`"${chunk}" blev ikke markeret. Facit: ${facitLabel}.`);
      }
    });
    if (hasAny(a.hsls.indleder, text.hsls.indlederGodkendte)) {
      points += 1;
      fundet.push(`Du fandt indlederen: ${text.hsls.indlederGodkendte[0]} ✓`);
    } else {
      mangler.push(`Indlederen er "${text.hsls.indlederGodkendte[0]}". Ledsætninger indledes ofte af at, fordi, når, hvis, som eller der.`);
    }
    if (a.hsls.funktion === text.hsls.funktionCorrect) {
      points += 1;
      fundet.push(`Ledsættens funktion er ${text.hsls.funktionOptions[text.hsls.funktionCorrect].toLowerCase()} ✓`);
    } else {
      mangler.push(`Ledsætningen fungerer som ${text.hsls.funktionOptions[text.hsls.funktionCorrect].toLowerCase()} i hovedsætningen.`);
    }
    opgaver.push({
      nummer: 7,
      titel: "Hoved- og ledsætninger",
      kategoriId: "syntaks",
      points,
      max,
      resume: "Hovedsætning, ledsætning, indleder og funktion skulle findes.",
      fundet,
      mangler,
      modelSvar: text.hsls.forklaring,
      eksamenTip:
        "Brug ikke-reglen højt til eksamen: I hovedsætningen kommer ikke EFTER verballedet, i ledsætningen MELLEM subjekt og verballed. Det er den sikreste test.",
    });
  }

  const points = opgaver.reduce((s, o) => s + o.points, 0);
  const max = opgaver.reduce((s, o) => s + o.max, 0);
  const pct = max > 0 ? Math.round((points / max) * 100) : 0;
  const { grade, gradeLabel, band } = gradeFromPct(pct);

  return { grade, gradeLabel, band, pct, points, max, intro: BEDOEMMELSE_INTRO, opgaver };
}

export { formatPoints };
