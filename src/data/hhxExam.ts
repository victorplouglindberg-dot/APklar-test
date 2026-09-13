// HHX-eksamensprøven (AP): data til øveprøven, hvor eleven trækker en ukendt
// tekst med 7 tilhørende opgaver. Teksterne er opdigtede, men skrevet som
// realistiske eksempler på de fem genrer, der bruges i denne simulation.
// Facit er knyttet til formuleringer, som faktisk står i den enkelte tekst.

import type { LedSymbol } from "../types";

export const EXAM_GENRES = [
  "Politisk tale",
  "Ejendomsannonce",
  "Opinionsartikel",
  "Informerende artikel",
  "Reklame",
] as const;

export type VerbumTid = "praesens" | "praeteritum" | "perfektum" | "pluskvamperfektum" | "futurum";

export const VERBUM_TIDER: { id: VerbumTid; label: string; kort: string; eksempel: string }[] = [
  { id: "praesens", label: "Præsens (nutid)", kort: "Nutid", eksempel: "læser" },
  { id: "praeteritum", label: "Præteritum (datid)", kort: "Datid", eksempel: "læste" },
  { id: "perfektum", label: "Perfektum (førnutid)", kort: "Førnutid", eksempel: "har læst" },
  { id: "pluskvamperfektum", label: "Pluskvamperfektum (førdatid)", kort: "Førdatid", eksempel: "havde læst" },
  { id: "futurum", label: "Futurum (fremtid)", kort: "Fremtid", eksempel: "vil læse" },
];

export function tidLabel(id: VerbumTid): string {
  return VERBUM_TIDER.find((t) => t.id === id)?.label ?? id;
}

export type Ordklasse =
  | "substantiv"
  | "verbum"
  | "adjektiv"
  | "pronomen"
  | "adverbium"
  | "praeposition"
  | "konjunktion"
  | "interjektion";

export const ORDKLASSER: { id: Ordklasse; label: string; kort: string; markering: string }[] = [
  { id: "substantiv", label: "Substantiv (navneord)", kort: "SUB", markering: "border-b-4 border-sky-500 bg-sky-100/70 dark:bg-sky-500/30" },
  { id: "verbum", label: "Verbum (udsagnsord)", kort: "V", markering: "border-b-4 border-red-500 bg-red-100/70 dark:bg-red-500/30" },
  { id: "adjektiv", label: "Adjektiv (tillægsord)", kort: "AJ", markering: "border-b-4 border-emerald-500 bg-emerald-100/70 dark:bg-emerald-500/30" },
  { id: "pronomen", label: "Pronomen (stedord)", kort: "PRON", markering: "border-b-4 border-violet-500 bg-violet-100/70 dark:bg-violet-500/30" },
  { id: "adverbium", label: "Adverbium (biord)", kort: "BI", markering: "border-b-4 border-amber-500 bg-amber-100/70 dark:bg-amber-500/30" },
  { id: "praeposition", label: "Præposition (forholdsord)", kort: "FORH", markering: "border-b-4 border-cyan-500 bg-cyan-100/70 dark:bg-cyan-500/30" },
  { id: "konjunktion", label: "Konjunktion (bindeord)", kort: "BIN", markering: "border-b-4 border-rose-500 bg-rose-100/70 dark:bg-rose-500/30" },
  { id: "interjektion", label: "Interjektion (udråbsord)", kort: "UDR", markering: "border-b-4 border-fuchsia-500 bg-fuchsia-100/70 dark:bg-fuchsia-500/30" },
];

export const LED_MARK_BG: Record<LedSymbol, string> = {
  subjekt: "bg-blue-100 dark:bg-blue-500/40",
  verbal: "bg-red-100 dark:bg-red-500/40",
  objekt: "bg-emerald-100 dark:bg-emerald-500/40",
  dativ: "bg-teal-100 dark:bg-teal-500/40",
  adverbial: "bg-amber-100 dark:bg-amber-500/40",
  subjpred: "bg-purple-100 dark:bg-purple-500/40",
  objpred: "bg-fuchsia-100 dark:bg-fuchsia-500/40",
};

export type PentagramFeltId = "afsender" | "emne" | "modtager" | "situation" | "sprog" | "formaal";

export const PENTAGRAM_FELTER: { id: PentagramFeltId; label: string; hint: string }[] = [
  { id: "afsender", label: "Afsender", hint: "Hvem taler/skriver, og med hvilken baggrund?" },
  { id: "emne", label: "Emne (indhold)", hint: "Hvad handler kommunikationen om?" },
  { id: "modtager", label: "Modtager", hint: "Hvem er målgruppen?" },
  { id: "situation", label: "Situation (omstændigheder)", hint: "Hvor, hvornår og hvorfor?" },
  { id: "sprog", label: "Genre/Sprog", hint: "Hvilken form vælges, og hvordan lyder sproget?" },
  { id: "formaal", label: "Formål (midten af pentagrammet)", hint: "Hvad vil afsenderen opnå: informere, overbevise, sælge?" },
];

export interface PentagramFelt {
  keywords: string[];
  model: string;
}

export interface MorfologiWord {
  word: string;
  solution: string[];
  altSolutions?: string[][];
  fleksiv?: string;
  note: string;
}

export interface TidOpgave {
  sentence: string;
  verb: string;
  tid: VerbumTid;
  omskrivTil: VerbumTid;
  omskrivningEksempel: string;
  omskrivGodkendte: string[];
}

export interface HsLsOpgave {
  sentence: string;
  chunks: string[];
  correctMap: ("hs" | "ls")[];
  indlederGodkendte: string[];
  funktionOptions: string[];
  funktionCorrect: number;
  forklaring: string;
}

export interface SaertraekKategori {
  label: string;
  keywords: string[];
}

export interface HhxExamText {
  id: string;
  genre: string;
  genreOptions: string[];
  correctGenreIndex: number;
  genreExplanation: string;
  begrundKeywords: string[];
  title: string;
  subtitle?: string;
  source: string;
  paragraphs: string[];
  pentagram: Record<PentagramFeltId, PentagramFelt>;
  saertraek: { kategorier: SaertraekKategori[]; model: string };
  morfologi: MorfologiWord[];
  analyse: { sentence: string; chunks: string[]; correctMap: LedSymbol[]; forklaring: string };
  tider: TidOpgave[];
  hsls: HsLsOpgave;
  eksamenTip: string;
}

const GENRE_OPTIONS = ["Politisk tale", "Ejendomsannonce", "Opinionsartikel", "Informerende artikel", "Reklame"];

const TALE_SAERTRAEK = (model: string): { kategorier: SaertraekKategori[]; model: string } => ({
  kategorier: [
    { label: "Ordklasser og ordvalg", keywords: ["pronomen", "jeg", "vi", "I", "adjektiv", "verbum", "imperativ", "substantiv"] },
    { label: "Semantiske felter", keywords: ["semantisk", "ordfelt", "skole", "demokrati", "fællesskab", "uddannelse", "valg"] },
    { label: "Konkrete og abstrakte ord", keywords: ["konkret", "abstrakt", "kantine", "bus", "indflydelse", "ansvar", "fremtid"] },
    { label: "Konnotationer", keywords: ["konnotation", "positiv", "negativ", "ladet", "tomme løfter", "frygt", "håb"] },
    { label: "Sætningskonstruktion", keywords: ["paratakse", "hypotakse", "korte sætninger", "gentagelse", "hovedsætning", "ledsætning"] },
    { label: "Retoriske greb", keywords: ["retorisk", "etos", "patos", "logos", "spørgsmål", "opfordring", "anafor"] },
  ],
  model,
});

const BOLIG_SAERTRAEK = (model: string): { kategorier: SaertraekKategori[]; model: string } => ({
  kategorier: [
    { label: "Ordklasser og ordvalg", keywords: ["adjektiv", "tillægsord", "substantiv", "verbum", "eget", "velholdt", "unik"] },
    { label: "Semantiske felter", keywords: ["semantisk", "bolig", "rum", "have", "beliggenhed", "køkken", "strand"] },
    { label: "Konkrete og abstrakte ord", keywords: ["konkret", "abstrakt", "værelser", "garage", "tryghed", "stemning", "livskvalitet"] },
    { label: "Konnotationer og eufemismer", keywords: ["konnotation", "eufemisme", "positiv", "charmerende", "potentiale", "hyggelig", "privat"] },
    { label: "Sætningskonstruktion", keywords: ["paratakse", "hypotakse", "opremsning", "korte sætninger", "ledsætning", "imperativ"] },
    { label: "Appelformer", keywords: ["etos", "patos", "logos", "appeller", "følelser", "tal", "opfordring"] },
  ],
  model,
});

const OPINION_SAERTRAEK = (model: string): { kategorier: SaertraekKategori[]; model: string } => ({
  kategorier: [
    { label: "Ordklasser og ordvalg", keywords: ["pronomen", "jeg", "du", "imperativ", "adjektiv", "verbum", "substantiv"] },
    { label: "Semantiske felter", keywords: ["semantisk", "ordfelt", "handel", "arbejde", "praktik", "økonomi", "unge"] },
    { label: "Konkrete og abstrakte ord", keywords: ["konkret", "abstrakt", "telefon", "mail", "retfærdighed", "frihed", "ansvar"] },
    { label: "Konnotationer", keywords: ["konnotation", "negativ", "positiv", "ladet", "fælder", "gratis", "retfærdig"] },
    { label: "Sætningskonstruktion", keywords: ["paratakse", "hypotakse", "modargument", "ledsætning", "korte sætninger", "gentagelse"] },
    { label: "Retoriske greb", keywords: ["retorisk", "kontrast", "spørgsmål", "etos", "patos", "logos", "opfordring"] },
  ],
  model,
});

const ARTIKEL_SAERTRAEK = (model: string): { kategorier: SaertraekKategori[]; model: string } => ({
  kategorier: [
    { label: "Ordklasser og ordvalg", keywords: ["substantiv", "navneord", "verbum", "adjektiv", "tal", "man", "måler"] },
    { label: "Semantiske felter", keywords: ["semantisk", "ordfelt", "betaling", "handel", "energi", "forbrug", "butik"] },
    { label: "Konkrete og abstrakte ord", keywords: ["konkret", "abstrakt", "procent", "telefon", "måling", "tillid", "forbrug"] },
    { label: "Konnotationer", keywords: ["konnotation", "neutral", "positiv", "negativ", "nøgtern", "advarer", "saglig"] },
    { label: "Sætningskonstruktion", keywords: ["hypotakse", "ledsætning", "citat", "kilde", "paratakse", "kompleks", "fordi"] },
    { label: "Retoriske greb og kilder", keywords: ["citat", "forsker", "ekspert", "kilde", "tal", "rapport", "retorisk"] },
  ],
  model,
});

const REKLAME_SAERTRAEK = (model: string): { kategorier: SaertraekKategori[]; model: string } => ({
  kategorier: [
    { label: "Ordklasser og ordvalg", keywords: ["imperativ", "bydeform", "du", "adjektiv", "verbum", "substantiv", "pronomener"] },
    { label: "Semantiske felter", keywords: ["semantisk", "ordfelt", "app", "kaffe", "fokus", "smag", "tid"] },
    { label: "Konkrete og abstrakte ord", keywords: ["konkret", "abstrakt", "knap", "pose", "smag", "energi", "frihed"] },
    { label: "Konnotationer", keywords: ["konnotation", "positiv", "negativ", "ladet", "premium", "stress", "ægte"] },
    { label: "Sætningskonstruktion", keywords: ["paratakse", "korte sætninger", "hypotakse", "imperativ", "gentagelse", "staccato"] },
    { label: "Retoriske greb", keywords: ["retorisk", "spørgsmål", "tal", "gentagelse", "humor", "opfordring", "imperativ"] },
  ],
  model,
});

const TEKST_TALE_ELEVRAAD: HhxExamText = {
  id: "tale-elevraad",
  genre: "Politisk tale",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 0,
  genreExplanation: "Det er en politisk tale, fordi Sofie henvender sig mundtligt til skolens elever før et valg. Hun bruger personlige erfaringer, tal om kantinen, retoriske spørgsmål og konkrete løfter for at vinde stemmer.",
  begrundKeywords: ["tale", "valg", "stemme", "overbevise", "opfordring", "retorisk", "løfter"],
  title: "Jeres stemme. Jeres skole.",
  subtitle: "Tale ved afslutningsmødet før elevvalget",
  source: "Tale holdt af Sofie Berg, kandidat til elevrådsformand, fredag den 7. november",
  paragraphs: [
    "Kære elever, kære lærere. I dag står jeg her, fordi jeg tror på, at vores skole kan blive bedre. Ikke på papiret, men i hverdagen, her blandt os. Jeg beder ikke om tillid på forhånd. Jeg beder om chancen for at vise, hvad et aktivt elevråd kan gøre.",
    "Jeg har siddet to år i elevrådet. Jeg har læst jeres forslag, noteret jeres frustrationer og set, hvad der sker, når gode ideer forsvinder i en skuffe. Det er forklaringen på, at jeg stiller op. Jeg gider ikke flere tomme løfter, der lyder flotte på en plakat.",
    "Hvem ønsker ikke at blive hørt? Hvem ønsker ikke en kantine med fair priser og en skolegård, man faktisk gider opholde sig i? 86 procent af jer bruger kantinen hver eneste dag. Alligevel falder priserne aldrig, og køen bliver længere. Det handler ikke om drømme. Det handler om beslutninger.",
    "Vi skal begynde med tre konkrete ændringer. Elevrådet skal have plads på ledelsens møder en gang om måneden. Kantinen skal vise prisen på de billigste måltider tydeligt. Og vi skal indrette et lokale, hvor elever kan mødes uden at bestille tid. Det er små skridt, men de kan mærkes i hverdagen.",
    "Da jeg startede på skolen, var jeg bange for at tale højt. I dag står jeg her og taler til jer alle sammen. Jeg stiller op, fordi vores stemmer er den vigtigste ressource, denne skole ejer. Hvis vi organiserer os, kan vi få en skole, der lytter, før den beslutter.",
    "Vi har brug for et elevråd, der svarer på mails, offentliggør referater og fortæller, når et forslag bliver afvist. Vi har brug for voksne, som tager vores erfaringer alvorligt. Jeg lover ikke, at alt bliver løst på en uge. Jeg lover, at ingen forslag forsvinder uden et svar.",
    "Vi vælger ikke bare en formand i november. Vi vælger, om elevindflydelse skal være en sætning i en brochure eller en praksis i vores skole. Giv mig jeres stemme, så giver jeg jer min tid, min stædighed og mine aftener. Tak, fordi I lyttede.",
  ],
  pentagram: {
    afsender: { keywords: ["Sofie", "elevrådet", "kandidat", "elev", "formand"], model: "Sofie Berg er elev og kandidat til elevrådsformand. Hendes to år i elevrådet giver etos." },
    emne: { keywords: ["elevrådet", "kantine", "indflydelse", "valg", "stemme", "skole", "forslag"], model: "Emnet er elevvalget og konkrete ønsker om mere elevindflydelse, bedre kantine og tydelig opfølgning." },
    modtager: { keywords: ["elever", "lærere", "jer", "os", "vores", "medelever"], model: "Modtageren er skolens elever, som skal stemme, mens lærerne også er til stede." },
    situation: { keywords: ["afslutningsmødet", "elevvalget", "tale", "november", "møde", "valg"], model: "Talen holdes ved afslutningsmødet før elevvalget i november og er en mundtlig valgtekst." },
    sprog: { keywords: ["tale", "mundtlig", "retoriske", "spørgsmål", "løfter", "opfordring", "korte"], model: "Sproget er mundtligt, direkte og præget af retoriske spørgsmål, gentagelser og klare opfordringer." },
    formaal: { keywords: ["stemme", "vælge", "overbevise", "elevindflydelse", "tillid", "opfordring"], model: "Formålet er at overbevise eleverne om at stemme på Sofie og få dem til at støtte hendes forslag." },
  },
  saertraek: TALE_SAERTRAEK("De personlige pronomener jeg, vi og jer skaber nærhed. Skole og demokrati danner et semantisk felt, mens kantine og lokale er konkrete ord, og indflydelse og praksis er abstrakte. Tomme løfter har negativ konnotation, mens fællesskab og lytter er positive. Korte sideordnede sætninger giver mundtligt tempo. Spørgsmålene Hvem ønsker ikke at blive hørt? er retoriske, og gentagelsen Vi har brug for fungerer som anafor."),
  morfologi: [
    { word: "afslutningsmøde", solution: ["af", "slut", "ning", "s", "møde"], note: "Ordet står i kildelinjen. af- er præfiks, slut er rod, -ning er suffiks, s er bindebogstav, og møde er rod." },
    { word: "forklaringen", solution: ["for", "klar", "ing", "en"], fleksiv: "-en", note: "Ordet står i andet afsnit. for- er præfiks, klar er rod, -ing er suffiks, og -en er fleksiv for bestemt ental." },
    { word: "vigtigste", solution: ["vigtig", "st", "e"], altSolutions: [["vigtig", "ste"]], fleksiv: "-e", note: "Ordet står i femte afsnit. -st danner superlativ, og -e er fleksiv i formen den vigtigste." },
    { word: "stemmer", solution: ["stemm", "er"], fleksiv: "-er", note: "Ordet står i sidste afsnit. stemm er rod, og -er er fleksiv for flertal." },
  ],
  analyse: { sentence: "Vi skal begynde med tre konkrete ændringer.", chunks: ["Vi", "skal begynde", "med tre konkrete ændringer."], correctMap: ["subjekt", "verbal", "adverbial"], forklaring: "Vi er subjekt, skal begynde er verballed, og med tre konkrete ændringer er et adverbial, der fortæller, hvad arbejdet skal begynde med." },
  tider: [
    { sentence: "Jeg har siddet to år i elevrådet.", verb: "har siddet", tid: "perfektum", omskrivTil: "praeteritum", omskrivningEksempel: "Jeg sad to år i elevrådet.", omskrivGodkendte: ["sad"] },
    { sentence: "Vi vælger ikke bare en formand i november.", verb: "vælger", tid: "praesens", omskrivTil: "futurum", omskrivningEksempel: "Vi vil ikke bare vælge en formand i november.", omskrivGodkendte: ["vil vælge", "skal vælge"] },
  ],
  hsls: { sentence: "Da jeg startede på skolen, var jeg bange for at tale højt.", chunks: ["Da jeg startede på skolen,", "var jeg bange for at tale højt."], correctMap: ["ls", "hs"], indlederGodkendte: ["da"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Da jeg startede på skolen er en ledsætning, indledt af da, og fungerer som adverbial for tid. Var jeg bange for at tale højt er hovedsætningen." },
  eksamenTip: "Peg på hilsen, retoriske spørgsmål, tallet 86 procent og de konkrete løfter. Forklar altid, hvordan virkemidlerne skal få eleverne til at stemme.",
};

const TEKST_TALE_FREMTID: HhxExamText = {
  id: "tale-fremtidsskolen",
  genre: "Politisk tale",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 0,
  genreExplanation: "Det er en politisk tale, fordi elevrådskandidaten taler til en forsamling, beskriver problemer og lover konkrete ændringer. Gentagelser, retoriske spørgsmål og en direkte opfordring skal skabe tilslutning.",
  begrundKeywords: ["tale", "kandidat", "stemme", "løfte", "opfordring", "valg", "sammen"],
  title: "En skole, der åbner dørene",
  subtitle: "Tale til skolens fællesmøde om HHX-elevers fremtid",
  source: "Tale holdt af Malik Sørensen, kandidat til elevrådet, torsdag den 20. november",
  paragraphs: [
    "Godmorgen alle sammen. Jeg hedder Malik, og jeg stiller op til elevrådet, fordi jeg tror på, at en handelsgymnasieskole skal være mere end skemaer og karakterer. Den skal give os mod til at møde kunder, kolleger og verden uden for klasselokalet.",
    "I vores klasser lærer vi om virksomheder, økonomi og kommunikation. Men alt for ofte øver vi os kun på papiret. Vi mangler besøg fra lokale firmaer, virkelige cases og steder, hvor vi kan afprøve en idé, før den bliver til en aflevering. Den afstand skal vi gøre mindre.",
    "Hvorfor skal en skole med stærke erhvervsfag være lukket om sig selv? Hvorfor skal det være tilfældigt, om man kender en virksomhed, der kan tilbyde praktik? 62 procent af de elever, jeg har spurgt, siger, at de savner mere kontakt til lokale arbejdspladser. Det er ikke en detalje.",
    "Jeg vil arbejde for en praktikbank, hvor virksomheder kan slå korte forløb op, og hvor elever kan finde en kontakt uden at have de rigtige forbindelser hjemmefra. Jeg vil også have en årlig messe, hvor hver klasse præsenterer et projekt for virksomheder i byen.",
    "Når vi inviterer virksomhederne ind, skal skolen stadig beskytte vores tid og vores rettigheder. Et samarbejde er kun godt, hvis vi lærer noget og bliver behandlet ordentligt. Derfor skal elevrådet have en stemme, når aftalerne bliver lavet.",
    "Jeg lover ikke, at alle virksomheder svarer ja. Jeg lover, at jeg vil sende den første mail, samle svarene og lægge en plan frem for jer. Et elevråd må ikke være pynt på en hjemmeside. Det skal være den kanal, der forbinder elever, lærere og arbejdspladser.",
    "Vi kan vente på, at andre tager initiativ. Eller vi kan åbne dørene selv. I morgen sender jeg den første liste med virksomheder til ledelsen. Hvis I vælger mig, fortsætter jeg, indtil der står konkrete navne, datoer og aftaler på tavlen. Giv mig jeres stemme. Lad os bygge forbindelserne sammen.",
  ],
  pentagram: {
    afsender: { keywords: ["Malik", "kandidat", "elevrådet", "elev", "stiller op"], model: "Malik Sørensen er elev og kandidat til elevrådet. Han bruger sin erfaring fra HHX som afsender." },
    emne: { keywords: ["praktikbank", "virksomheder", "arbejdspladser", "messe", "samarbejde", "kontakt", "forbindelser"], model: "Emnet er mere kontakt mellem HHX-elever og lokale virksomheder gennem praktikbank og messe." },
    modtager: { keywords: ["elever", "klasser", "jer", "os", "lærere", "virksomheder"], model: "Modtageren er skolens elever ved fællesmødet, mens lærere og virksomheder også omtales som samarbejdspartnere." },
    situation: { keywords: ["fællesmøde", "tale", "valg", "torsdag", "november", "skolen"], model: "Talen holdes på skolens fællesmøde i forbindelse med elevrådsvalget i november." },
    sprog: { keywords: ["tale", "retoriske", "spørgsmål", "gentagelser", "direkte", "opfordring", "procent"], model: "Sproget er mundtligt og argumenterende med spørgsmål, gentagelser, tal og en direkte afsluttende opfordring." },
    formaal: { keywords: ["stemme", "vælge", "overbevise", "opfordring", "arbejde", "tilslutning"], model: "Formålet er at få elevernes stemmer og tilslutning til Maliks plan for flere erhvervskontakter." },
  },
  saertraek: TALE_SAERTRAEK("Jeg, vi og jer gør talen personlig og skaber et fællesskab. Skole, virksomheder og praktik danner det centrale semantiske felt. Papir og klasselokale er konkrete, mens fremtid, mod og ansvar er abstrakte. Lukket om sig selv er negativt ladet, mens åbne dørene er positivt. De korte spørgsmål og gentagelsen Jeg vil skabe rytme og fremdrift. Tallet 62 procent giver logos, mens opfordringen til at åbne dørene giver patos."),
  morfologi: [
    { word: "handelsgymnasieskole", solution: ["handel", "s", "gymnasie", "skole"], note: "Ordet står i første afsnit. handel, gymnasie og skole er rødder, og s er bindebogstav." },
    { word: "forbindelserne", solution: ["for", "bind", "else", "r", "ne"], fleksiv: "-ne", note: "Ordet står i sidste afsnit. for- er præfiks, bind er rod, -else er suffiks, r er bindelyd, og -ne er fleksiv." },
    { word: "virksomheder", solution: ["virksom", "hed", "er"], fleksiv: "-er", note: "Ordet står i tredje afsnit. virksom er rod, -hed er suffiks, og -er er fleksiv for flertal." },
    { word: "konkrete", solution: ["konkret", "e"], fleksiv: "-e", note: "Ordet står i sjette afsnit. konkret er rod, og -e er fleksiv i flertalsformen konkrete." },
  ],
  analyse: { sentence: "Jeg vil arbejde for en praktikbank.", chunks: ["Jeg", "vil arbejde", "for en praktikbank."], correctMap: ["subjekt", "verbal", "adverbial"], forklaring: "Jeg er subjekt, vil arbejde er verballed, og for en praktikbank er et adverbial, der angiver målet for arbejdet." },
  tider: [
    { sentence: "Vi mangler besøg fra lokale firmaer.", verb: "mangler", tid: "praesens", omskrivTil: "praeteritum", omskrivningEksempel: "Vi manglede besøg fra lokale firmaer.", omskrivGodkendte: ["manglede"] },
    { sentence: "Jeg vil arbejde for en praktikbank.", verb: "vil arbejde", tid: "futurum", omskrivTil: "perfektum", omskrivningEksempel: "Jeg har arbejdet for en praktikbank.", omskrivGodkendte: ["har arbejdet"] },
  ],
  hsls: { sentence: "Når vi inviterer virksomhederne ind, skal skolen stadig beskytte vores tid og vores rettigheder.", chunks: ["Når vi inviterer virksomhederne ind,", "skal skolen stadig beskytte vores tid og vores rettigheder."], correctMap: ["ls", "hs"], indlederGodkendte: ["når"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Når vi inviterer virksomhederne ind er ledsætning med indlederen når. Den fungerer som adverbial for tid eller betingelse. Resten er hovedsætningen." },
  eksamenTip: "Nævn tallet 62 procent, de retoriske spørgsmål og løftet om en praktikbank. Kobl hvert virkemiddel til ønsket om tilslutning.",
};

const TEKST_BOLIG_HAVUDSIGT: HhxExamText = {
  id: "bolig-havudsigt",
  genre: "Ejendomsannonce",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 1,
  genreExplanation: "Det er en ejendomsannonce, fordi teksten præsenterer en konkret bolig med rum, have, beliggenhed og salgsopfordring. Positive tillægsord og eufemismer får boligen til at fremstå mere attraktiv.",
  begrundKeywords: ["ejendomsannonce", "bolig", "soveværelser", "have", "beliggenhed", "fremvisning", "køkken"],
  title: "Lys villa med havudsigt",
  subtitle: "Et roligt hjem med plads til både familie og hjemmekontor",
  source: "Fiktiv boligannonce fra Nordkystens Boliger, salgsopstilling 18. marts",
  paragraphs: [
    "Velkommen til en lys og indbydende villa på Klitvej 14, hvor hverdagen kan få lidt mere luft. Huset ligger højt i det rolige Søndervang, og fra førstesalen kan man ane vandet mellem træerne. Her får I en bolig med en sjælden kombination af natur, nærhed og praktiske rammer.",
    "Boligen rummer 168 kvadratmeter fordelt på to etager. I stueplan finder I entré, bryggers, gæstetoilet, køkken og en stor stue med udgang til terrassen. Førstesalen har tre soveværelser, et badeværelse og et ekstra rum, som kan indrettes til hjemmekontor eller hobby.",
    "Køkkenet er funktionelt og velholdt med lyse fronter, god skabsplads og udsyn til haven. Det er ikke spritnyt, men det giver den næste ejer mulighed for at sætte sit eget præg. I stuen skaber brændeovnen en hyggelig stemning, når efteråret kommer, og de brede vinduer lukker dagslyset ind.",
    "Haven er overskuelig og delvist anlagt med græs, staudebede og en afskærmet terrasse. Den kræver ikke et heltidsprojekt, men der er plads til køkkenhave, trampolin eller lange middage under åben himmel. Baghaven vender mod sydvest og får sol fra frokost til aften.",
    "Beliggenheden er særligt attraktiv for en familie, der ønsker korte afstande. Hvis I ønsker korte afstande, er denne villa et oplagt valg. Der er 450 meter til skolen, 700 meter til indkøb og otte minutter på cykel til stationen. Den lokale bus standser på hjørnet, mens motorvejen kan nås på cirka tolv minutter i bil.",
    "Området er stille uden at være isoleret. Naboerne hilser på hinanden, og den grønne kile bag huset giver mulighed for en løbetur eller en gåtur med hunden. Samtidig er centrum tæt nok på til, at en tur efter brød eller kaffe ikke kræver planlægning.",
    "Huset har enkelte charmerende løsninger fra opførelsen i 1987, blandt andet synlige rør i bryggerset og et badeværelse, der med fordel kan moderniseres. Det er en ærlig bolig med potentiale, ikke en blank katalogvare. Til gengæld får I et solidt udgangspunkt og en have, der allerede fungerer.",
    "Bestil en fremvisning hos ejendomsmægler Anna Holm på telefon 70 20 14 18. Vi viser boligen efter aftale tirsdag og torsdag. Medbring gerne spørgsmål om energiforbrug, ejerudgifter og mulighederne for at gøre villaen til jeres eget hjem.",
  ],
  pentagram: {
    afsender: { keywords: ["Nordkystens", "boliger", "ejendomsmægler", "Anna", "sælger", "annonce"], model: "Nordkystens Boliger og ejendomsmægleren Anna Holm er afsender. De har en kommerciel interesse i et salg." },
    emne: { keywords: ["villa", "bolig", "huset", "have", "køkken", "værelser", "beliggenhed", "terrasse"], model: "Emnet er villaen på Klitvej 14, dens rum, have, stand og beliggenhed." },
    modtager: { keywords: ["familie", "ejer", "køber", "jer", "den næste ejer", "hund"], model: "Modtageren er mulige boligkøbere, især en familie, der søger plads og korte afstande." },
    situation: { keywords: ["boligannonce", "salgsopstilling", "marts", "fremvisning", "telefon", "købe", "salg"], model: "Det er en skriftlig salgsannonce fra marts, som skal læses af potentielle købere før en fremvisning." },
    sprog: { keywords: ["annonce", "positiv", "tillægsord", "eufemisme", "charmerende", "potentiale", "opfordring"], model: "Sproget er beskrivende og positivt med eufemismer som potentiale og charmerende samt en afsluttende opfordring." },
    formaal: { keywords: ["sælge", "fremvisning", "bestil", "køber", "interesse", "bolig"], model: "Formålet er at skabe interesse for villaen og få læseren til at bestille en fremvisning." },
  },
  saertraek: BOLIG_SAERTRAEK("Annonsen bruger positive adjektiver som lys, indbydende og attraktiv. Bolig, have og rum danner et tydeligt semantisk felt. 168 kvadratmeter og 450 meter er konkrete og logosprægede, mens luft, nærhed og potentiale er abstrakte eller værdiladede. Potentiale og charmerende er eufemismer, som gør moderniseringsbehovet venligere. Opremsninger af rum og faciliteter giver et katalogagtigt tempo."),
  morfologi: [
    { word: "ejendomsmægler", solution: ["ejendom", "s", "mægler"], note: "Ordet står i sidste afsnit. ejendom og mægler er rødder, og s er bindebogstav." },
    { word: "indbydende", solution: ["ind", "byd", "ende"], note: "Ordet står i første afsnit. ind- er præfiks, byd er rod, og -ende er afledningssuffiks." },
    { word: "kvadratmeter", solution: ["kvadrat", "meter"], note: "Ordet står i andet afsnit. kvadrat og meter er to rodmorfemer i et sammensat ord uden fleksiv." },
    { word: "soveværelser", solution: ["sove", "værelse", "r"], fleksiv: "-r", note: "Ordet står i andet afsnit. sove og værelse er rødder, og -r er fleksiv for flertal." },
  ],
  analyse: { sentence: "Huset ligger højt i det rolige Søndervang.", chunks: ["Huset", "ligger", "højt", "i det rolige Søndervang."], correctMap: ["subjekt", "verbal", "adverbial", "adverbial"], forklaring: "Huset er subjekt, ligger er verballed, højt er mådesadverbial, og i det rolige Søndervang er stedsadverbial." },
  tider: [
    { sentence: "Huset ligger højt i det rolige Søndervang.", verb: "ligger", tid: "praesens", omskrivTil: "praeteritum", omskrivningEksempel: "Huset lå højt i det rolige Søndervang.", omskrivGodkendte: ["lå"] },
    { sentence: "Haven er overskuelig og delvist anlagt med græs, staudebede og en afskærmet terrasse.", verb: "er", tid: "praesens", omskrivTil: "perfektum", omskrivningEksempel: "Haven har været overskuelig og delvist anlagt med græs, staudebede og en afskærmet terrasse.", omskrivGodkendte: ["har været"] },
  ],
  hsls: { sentence: "Hvis I ønsker korte afstande, er denne villa et oplagt valg.", chunks: ["Hvis I ønsker korte afstande,", "er denne villa et oplagt valg."], correctMap: ["ls", "hs"], indlederGodkendte: ["hvis"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Hvis I ønsker korte afstande er en betingende ledsætning, indledt af hvis, og fungerer som adverbial. Er denne villa et oplagt valg er hovedsætningen." },
  eksamenTip: "Find de konkrete boligdata, de positive adjektiver og eufemismerne. Forklar, at afsenderen både informerer og forsøger at sælge.",
};

const TEKST_BOLIG_BYHUS: HhxExamText = {
  id: "bolig-byhus-gaarden",
  genre: "Ejendomsannonce",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 1,
  genreExplanation: "Det er en ejendomsannonce, fordi den beskriver et bestemt byhus og forsøger at få købere til at booke en fremvisning. Rum, materialer og beliggenhed kombineres med stemningsord og diskrete eufemismer.",
  begrundKeywords: ["annonce", "byhus", "køkken", "gårdhave", "fremvisning", "købere", "sælge"],
  title: "Byhus med gårdhave og muligheder",
  subtitle: "Centralt, charmerende og tæt på byens liv",
  source: "Fiktiv boligannonce fra Havneby Ejendomme, salgsopstilling 2. juni",
  paragraphs: [
    "Midt i den gamle handelsby ligger et byhus, der kombinerer historisk charme med en hverdag, der er nem at få til at fungere. Huset ligger tæt på torvet. På Møllergade 8 bor man tæt på torvet, havnen og byens butikker, men bag hoveddøren venter en rolig gårdhave med plads til morgenkaffe.",
    "Huset er opført i 1912 og rummer 124 kvadratmeter. Den høje stueetage har entré, køkken-alrum og stue med originale plankegulve. På første sal ligger to soveværelser, et mindre værelse og et badeværelse. Fra reposen er der adgang til loftet, som kan udnyttes efter behov.",
    "Køkken-alrummet er husets naturlige samlingspunkt. De mørke fronter står i kontrast til de lyse vægge, og et bredt vindue vender mod gårdhaven. Køkkenet har en funktionel indretning og en alder, der giver mulighed for en personlig opdatering, hvis den nye ejer ønsker et andet udtryk.",
    "Gårdhaven er afskærmet af murværk og grønne planter. Når solen står højt, bliver gårdhaven et roligt uderum. Her er plads til et lille bord, cykler og krukker med krydderurter. Den er ikke stor nok til fodbold, men den er nem at holde og giver et privat uderum midt i byen. Om sommeren ligger solen i haven fra middagstid.",
    "På få minutter kan I gå til stationen, biblioteket og havnepromenaden. Bussen stopper 150 meter fra huset, og der er daginstitution i kvarteret. For den studerende eller selvstændige er adressen praktisk, fordi caféer, kontorfællesskaber og indkøb ligger lige om hjørnet.",
    "Byhuset har en varm atmosfære med højt til loftet og synlige bjælker. Nogle døre lukker med den lyd, man forventer af et ældre hus, og kælderen er bedst egnet til opbevaring. Det er en del af husets patina og samtidig et sted, hvor den næste ejer kan sætte ind.",
    "Energimærket er D, og ejerudgifterne fremgår af den fulde salgsopstilling. Der er fjernvarme, nye røgalarmer og et tag, der blev efterset sidste år. Vi anbefaler, at købere gennemgår dokumenterne med egen rådgiver, før en handel underskrives.",
    "Har I lyst til at opleve byhuset, så kontakt mægler Jonas Friis på 71 44 08 26. Fremvisning finder sted onsdag eftermiddag og lørdag formiddag. Kom gerne med en idé om, hvordan gårdhaven og det ekstra værelse skal bruges.",
  ],
  pentagram: {
    afsender: { keywords: ["Havneby", "Ejendomme", "mægler", "Jonas", "annonce"], model: "Havneby Ejendomme og mægleren Jonas Friis er den kommercielle afsender." },
    emne: { keywords: ["byhus", "gårdhave", "køkken", "værelser", "Møllergade", "beliggenhed", "hus"], model: "Emnet er byhuset på Møllergade 8, dets rum, gårdhave, stand og centrale adresse." },
    modtager: { keywords: ["købere", "I", "studerende", "selvstændige", "ejer", "den næste ejer"], model: "Modtageren er mulige købere, især mennesker der vil bo centralt og værdsætter et privat uderum." },
    situation: { keywords: ["salgsopstilling", "juni", "fremvisning", "mægler", "handel", "onsdag", "lørdag"], model: "Det er en offentlig boligsalgsannonce fra juni, der skal føre frem mod fremvisning og handel." },
    sprog: { keywords: ["annonce", "stemningsord", "charme", "patina", "mulighed", "eufemisme", "opfordring"], model: "Sproget blander konkrete oplysninger med stemningsord og eufemismen personlig opdatering." },
    formaal: { keywords: ["sælge", "fremvisning", "kontakt", "købere", "handel", "oplevelse"], model: "Formålet er at gøre byhuset attraktivt, få købere til at kontakte mægleren og skabe en handel." },
  },
  saertraek: BOLIG_SAERTRAEK("Ord som historisk, varm og charmerende skaber en positiv stemning. Rum, hus, køkken og gårdhave danner det semantiske boligfelt. 124 kvadratmeter, 150 meter og energimærke D er konkrete oplysninger, mens atmosfære og patina er abstrakte eller værdiladede. Personlig opdatering er en eufemisme for renovering. Opremsningen af faciliteter gør boligen let at forestille sig."),
  morfologi: [
    { word: "handelsby", solution: ["handel", "s", "by"], note: "Ordet står i første afsnit. handel og by er rødder, og s er bindebogstav." },
    { word: "plankegulve", solution: ["planke", "gulv", "e"], fleksiv: "-e", note: "Ordet står i andet afsnit. planke og gulv er rødder, og -e er fleksiv for flertal." },
    { word: "gårdhaven", solution: ["gård", "have", "n"], fleksiv: "-n", note: "Ordet står i fjerde afsnit. gård og have er rødder, og -n er fleksiv for bestemt ental." },
    { word: "opbevaring", solution: ["op", "bevar", "ing"], note: "Ordet står i sjette afsnit. op- er præfiks, bevar er rod, og -ing er suffiks." },
  ],
  analyse: { sentence: "Huset ligger tæt på torvet.", chunks: ["Huset", "ligger", "tæt på torvet."], correctMap: ["subjekt", "verbal", "adverbial"], forklaring: "Huset er subjekt, ligger er verballed, og tæt på torvet er et stedsadverbial." },
  tider: [
    { sentence: "Huset er opført i 1912 og rummer 124 kvadratmeter.", verb: "er opført", tid: "perfektum", omskrivTil: "praeteritum", omskrivningEksempel: "Huset blev opført i 1912 og rummede 124 kvadratmeter.", omskrivGodkendte: ["blev opført"] },
    { sentence: "Fremvisning finder sted onsdag eftermiddag og lørdag formiddag.", verb: "finder", tid: "praesens", omskrivTil: "futurum", omskrivningEksempel: "Fremvisning vil finde sted onsdag eftermiddag og lørdag formiddag.", omskrivGodkendte: ["vil finde", "skal finde"] },
  ],
  hsls: { sentence: "Når solen står højt, bliver gårdhaven et roligt uderum.", chunks: ["Når solen står højt,", "bliver gårdhaven et roligt uderum."], correctMap: ["ls", "hs"], indlederGodkendte: ["når"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Når solen står højt er en ledsætning indledt af når. Den angiver tid og fungerer derfor som adverbial. Bliver gårdhaven et roligt uderum er hovedsætningen." },
  eksamenTip: "Vis både den konkrete information og den sælgende tone. Peg på eufemismen personlig opdatering og forklar, hvorfor annoncen bruger den.",
};

const TEKST_OPINION_IMPULS: HhxExamText = {
  id: "opinion-impulskob",
  genre: "Opinionsartikel",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 2,
  genreExplanation: "Det er en opinionsartikel, fordi Oliver tydeligt siger sin mening, bruger jeg-form, argumenterer imod tidsbegrænsede kampagner og foreslår en regel. Han møder også modargumentet om, at forbrug er et personligt valg.",
  begrundKeywords: ["opinionsartikel", "mening", "jeg", "argument", "modargument", "foreslår", "overbevise"],
  title: "Stop impulskøbene",
  subtitle: "Webshopperne ved præcis, hvornår vi er svage",
  source: "Kronik i det fiktive medie Ung Handel, maj. Af Oliver Kruse, 3.g HHX-elev",
  paragraphs: [
    "Klokken er 23.40. Du scroller lidt træt gennem en webshop, og pludselig blinker der en orange kupon på skærmen: Kun 30 minutter tilbage. Du trykker. Selvfølgelig gør du. Jeg har gjort det selv mange gange, og bagefter har jeg siddet med en vare, jeg ikke længere syntes, jeg havde brug for.",
    "Jeg mener, at webshoppernes tidsbegrænsede kampagner er en af de største grunde til, at unge bruger for mange penge online. Virksomhederne tjener store penge på vores utålmodighed, og det er ikke fair, når en nedtælling får et almindeligt køb til at ligne en sidste chance.",
    "Nu vil nogen sige, at det jo er vores eget valg. Jo, det er det. Men et valg, der er designet til at udløse impulser, er ikke et helt frit valg. Når en kampagne lyder for god til at være sand, er den ofte det. Fragtfri i dag betyder nogle gange højere priser i går.",
    "Problemet bliver større, fordi telefonen følger os hele tiden. Reklamen rammer i bussen, i sengen og mellem to timer på skolen. Vi skal ikke gøre unge til hjælpeløse ofre, men vi skal heller ikke lade som om, alle tilbud er neutrale beskeder uden en afsender, der vil tjene penge.",
    "Derfor foreslår jeg en enkel regel. Når en webshop bruger en nedtælling, skal den vise, hvor længe tilbuddet faktisk har kørt, og hvor ofte det er blevet forlænget. Åbenhed er billig. Utålmodighed er dyr. Den information gør ikke handelen mindre fri. Den gør valget mere oplyst.",
    "En butiksejer vil måske svare, at rabatterne får varerne til at flytte sig hurtigere, og at kunden altid kan lukke siden. Det er et rimeligt modargument. Men ansvar må gå begge veje. Forbrugeren skal tænke sig om, og virksomheden skal være ærlig om presset i kampagnen.",
    "Jeg har set mine kammerater fortryde impulskøb igen og igen. Vi fortjener handel med respekt, ikke handel med fælder. Næste gang kuponen blinker, så luk skærmen, spørg dig selv, om du faktisk har brug for varen, og vent til i morgen. Det er ikke moral. Det er en pause.",
  ],
  pentagram: {
    afsender: { keywords: ["Oliver", "Kruse", "elev", "forbruger", "jeg", "kronik", "skribent"], model: "Oliver Kruse er 3.g HHX-elev og ung forbruger. Han skriver personligt ud fra egne erfaringer." },
    emne: { keywords: ["impulskøb", "webshop", "kampagne", "kupon", "forbrug", "tilbud", "nedtælling", "handel"], model: "Emnet er tidsbegrænsede webshopkampagner og unges impulskøb." },
    modtager: { keywords: ["unge", "forbrugeren", "forbruger", "virksomheden", "kammerater", "læser", "butiksejer"], model: "Modtageren er især unge forbrugere, men teksten henvender sig også til virksomheder og den offentlige debat." },
    situation: { keywords: ["kronik", "Ung Handel", "medie", "maj", "artikel", "debat", "skolen"], model: "Det er en skriftlig kronik i det fiktive medie Ung Handel fra maj, skrevet til en offentlig debat." },
    sprog: { keywords: ["jeg", "mening", "argument", "modargument", "direkte", "kontrast", "opfordring"], model: "Sproget er personligt og argumenterende med jeg-form, modargumenter, kontraster og direkte opfordringer." },
    formaal: { keywords: ["foreslår", "overbevise", "regel", "åbenhed", "ærlige", "oplyst", "respekt"], model: "Formålet er at overbevise læseren om behovet for åbenhed om nedtællinger og mere bevidste køb." },
  },
  saertraek: OPINION_SAERTRAEK("Jeg og du gør teksten personlig og direkte. Handel, webshop og forbrug danner tekstens semantiske felt. Kupon og skærm er konkrete, mens åbenhed og respekt er abstrakte. Fælder og utålmodighed har negative konnotationer, mens oplyst og ærlig er positivt ladet. Modargumentet Nu vil nogen sige og kontrasten billig og dyr viser argumentationen. Imperativerne luk og vent afslutter med en opfordring."),
  morfologi: [
    { word: "impulskøbene", solution: ["impuls", "køb", "ene"], altSolutions: [["impuls", "køb", "en", "e"]], fleksiv: "-ene", note: "Ordet står i første afsnit og igen i sidste afsnit. impuls og køb er rødder, og -ene er fleksiv for bestemt flertal." },
    { word: "utålmodighed", solution: ["u", "tål", "mod", "ighed"], note: "Ordet står i andet afsnit. u- er præfiks, tål og mod er rødder, og -ighed er suffiks." },
    { word: "tidsbegrænsede", solution: ["tid", "s", "begræns", "ede"], fleksiv: "-e", note: "Ordet står i andet afsnit. tid og begræns er rødder, s er bindebogstav, -ede er afledning, og -e er fleksiv." },
    { word: "forbrugeren", solution: ["forbrug", "er", "en"], fleksiv: "-en", note: "Ordet står i sjette afsnit. forbrug er rod, -er er afledningssuffiks, og -en er fleksiv for bestemt ental." },
  ],
  analyse: { sentence: "Virksomhederne tjener store penge på vores utålmodighed.", chunks: ["Virksomhederne", "tjener", "store penge", "på vores utålmodighed."], correctMap: ["subjekt", "verbal", "objekt", "adverbial"], forklaring: "Virksomhederne er subjekt, tjener er verballed, store penge er objekt, og på vores utålmodighed er adverbial for årsag eller grund." },
  tider: [
    { sentence: "Jeg har gjort det selv mange gange.", verb: "har gjort", tid: "perfektum", omskrivTil: "praeteritum", omskrivningEksempel: "Jeg gjorde det selv mange gange.", omskrivGodkendte: ["gjorde"] },
    { sentence: "Jeg har set mine kammerater fortryde impulskøb igen og igen.", verb: "har set", tid: "perfektum", omskrivTil: "futurum", omskrivningEksempel: "Jeg vil se mine kammerater fortryde impulskøb igen og igen.", omskrivGodkendte: ["vil se"] },
  ],
  hsls: { sentence: "Når en kampagne lyder for god til at være sand, er den ofte det.", chunks: ["Når en kampagne lyder for god til at være sand,", "er den ofte det."], correctMap: ["ls", "hs"], indlederGodkendte: ["når"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Når en kampagne lyder for god til at være sand er en ledsætning indledt af når. Den fungerer som adverbial for tid eller betingelse. Er den ofte det er hovedsætningen." },
  eksamenTip: "Peg på jeg-formen, modargumentet og kontrasten mellem billig og dyr. Forklar, hvordan forslagene forsøger at påvirke både virksomheder og forbrugere.",
};

const TEKST_OPINION_PRAKTIK: HhxExamText = {
  id: "opinion-praktikplads",
  genre: "Opinionsartikel",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 2,
  genreExplanation: "Det er en opinionsartikel, fordi Lea skriver med en tydelig holdning om ulønnede praktikforløb. Hun bruger en konkret scene, argumenter, et modargument og et forslag til en løsning for at påvirke læseren.",
  begrundKeywords: ["opinionsartikel", "holdning", "jeg", "argument", "modargument", "forslag", "debat"],
  title: "Erfaring må ikke være gratis",
  subtitle: "Virksomheder kan lære unge meget, men de må også tage ansvar",
  source: "Debatindlæg i det fiktive erhvervsmedie Markant, oktober. Af Lea Nørgaard, HHX-elev",
  paragraphs: [
    "Min første dag som praktikant begyndte med en rundvisning og sluttede med en besked om, at der ikke var råd til frokost. Jeg var glad for at være der og ville gerne vise, hvad jeg kunne. Alligevel gik jeg hjem med følelsen af, at min tid var mindre værd end virksomhedens.",
    "Jeg mener, at virksomheder skal tage større ansvar, når de inviterer gymnasieelever ind i praktik. Virksomheder skal tage større ansvar. Erfaring er vigtig, og et forløb kan åbne en dør til uddannelse eller job. Men erfaring bliver ikke mindre værd, fordi den er lærerig. Den unge leverer også tid, energi og arbejde.",
    "Nogle ledere vil sige, at praktikanten først skal lære, før hun kan bidrage. Hvis en praktikant udfører en opgave, skaber hun værdi. Det er rigtigt, at en elev ikke kan alt fra første dag. Men at lære og at skabe værdi udelukker ikke hinanden. Hvis en praktikant opdaterer en kundeliste, skriver et udkast eller hjælper ved et arrangement, udfører hun en opgave.",
    "Problemet er størst for de elever, der ikke har råd til transport, mad og en mistet arbejdsdag. Den, der bor tæt på en forælders firma, kan lettere sige ja. Den, der har et fritidsjob, må måske vælge mellem en ulønnet chance og en løn, der betaler regningerne. Praktik kan derfor både åbne og lukke døre.",
    "Mit forslag er enkelt: Alle virksomheder, der tilbyder et forløb på mere end tre dage, skal beskrive opgaverne tydeligt og give et måltid eller et transporttilskud. Skolen skal samtidig godkende forløbet og sikre, at eleven får en kontaktperson. Det kræver ikke et stort bureaukrati, kun klare rammer.",
    "Virksomhederne får også noget igen. De møder unge perspektiver, får hjælp til konkrete opgaver og kan opdage kommende medarbejdere. Hvis de fortæller ærligt, hvad praktikanten skal lave, bliver forventningerne bedre for begge parter. Det er god arbejdskultur, ikke velgørenhed.",
    "Jeg siger ikke, at alle praktikforløb skal ligne et ansættelsesforhold. Jeg siger, at den læring, en ung giver virksomheden, skal behandles med respekt. Erfaring må ikke være gratis, hvis gratis betyder, at kun nogle elever har mulighed for at få den. Lad os gøre praktik til en reel vej ind i arbejdslivet.",
  ],
  pentagram: {
    afsender: { keywords: ["Lea", "Nørgaard", "HHX-elev", "praktikant", "elev", "jeg"], model: "Lea Nørgaard er HHX-elev og tidligere praktikant. Hun skriver ud fra en personlig oplevelse." },
    emne: { keywords: ["praktik", "praktikant", "virksomheder", "erfaring", "transport", "opgaver", "ansvar"], model: "Emnet er gymnasieelevers praktik og virksomhedernes ansvar for rimelige rammer." },
    modtager: { keywords: ["virksomheder", "elever", "skolen", "ledere", "læser", "unge", "praktikanten"], model: "Modtageren er virksomheder, skoler og andre læsere i debatten om unges adgang til erhvervserfaring." },
    situation: { keywords: ["debatindlæg", "Markant", "oktober", "erhvervsmedie", "debat", "indlæg"], model: "Det er et skriftligt debatindlæg fra oktober i et erhvervsmedie." },
    sprog: { keywords: ["jeg", "argument", "modargument", "forslag", "kontrast", "holdning", "direkte"], model: "Sproget er personligt og argumenterende med jeg-form, modargumenter, kontraster og et konkret forslag." },
    formaal: { keywords: ["ansvar", "forslag", "rammer", "påvirke", "praktik", "respekt", "gøre"], model: "Formålet er at påvirke virksomheder og skoler til at give praktikforløb med klare og mere lige rammer." },
  },
  saertraek: OPINION_SAERTRAEK("Jeg-formen gør Lea til et tydeligt subjekt, mens praktik, arbejde og virksomhed danner tekstens semantiske felt. Rundvisning og frokost er konkrete, mens ansvar og respekt er abstrakte. Gratis har en negativ konnotation i overskriften, mens reel vej og god arbejdskultur er positive. Modargumentet Nogle ledere vil sige og kontrasten åbne og lukke døre viser en nuanceret argumentation. Forslagene i femte afsnit gør teksten handlingsorienteret."),
  morfologi: [
    { word: "praktikanten", solution: ["praktik", "ant", "en"], fleksiv: "-en", note: "Ordet står i tredje afsnit. praktik er rod, -ant er afledningssuffiks, og -en er fleksiv for bestemt ental." },
    { word: "arbejdslivet", solution: ["arbejd", "s", "liv", "et"], fleksiv: "-et", note: "Ordet står i sidste afsnit. arbejd og liv er rødder, s er bindebogstav, og -et er fleksiv." },
    { word: "transporttilskud", solution: ["transport", "til", "skud"], note: "Ordet står i femte afsnit. transport, til og skud er rødder i et sammensat ord." },
    { word: "forventningerne", solution: ["forvent", "ning", "er", "ne"], fleksiv: "-ne", note: "Ordet står i sjette afsnit. forvent er rod, -ning er suffiks, -er er flertal, og -ne er bestemtheds-fleksiv." },
  ],
  analyse: { sentence: "Virksomheder skal tage større ansvar.", chunks: ["Virksomheder", "skal tage", "større ansvar."], correctMap: ["subjekt", "verbal", "objekt"], forklaring: "Virksomheder er subjekt, skal tage er verballed, og større ansvar er objekt." },
  tider: [
    { sentence: "Jeg var glad for at være der.", verb: "var", tid: "praeteritum", omskrivTil: "praesens", omskrivningEksempel: "Jeg er glad for at være der.", omskrivGodkendte: ["er"] },
    { sentence: "Virksomhederne får også noget igen.", verb: "får", tid: "praesens", omskrivTil: "futurum", omskrivningEksempel: "Virksomhederne vil også få noget igen.", omskrivGodkendte: ["vil få", "skal få"] },
  ],
  hsls: { sentence: "Hvis en praktikant udfører en opgave, skaber hun værdi.", chunks: ["Hvis en praktikant udfører en opgave,", "skaber hun værdi."], correctMap: ["ls", "hs"], indlederGodkendte: ["hvis"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Hvis en praktikant udfører en opgave er en betingende ledsætning med hvis. Den fungerer som adverbial. Skaber hun værdi er hovedsætningen." },
  eksamenTip: "Brug scenen som eksempel på afsenderens erfaring, og gennemgå derefter modargumentet og forslaget. Det viser, at du kan analysere tekstens argumentation.",
};

const TEKST_ARTIKEL_MOBIL: HhxExamText = {
  id: "artikel-mobilbetaling",
  genre: "Informerende artikel",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 3,
  genreExplanation: "Det er en informerende artikel, fordi teksten bygger på tal, en forsker og økonomers advarsler. Den forklarer en udvikling i mobilbetaling uden en tydelig jeg-holdning.",
  begrundKeywords: ["informere", "oplyse", "neutral", "tal", "forsker", "ekspert", "artikel"],
  title: "Flere unge betaler med telefonen",
  subtitle: "Kontanterne forsvinder: Nu betaler hver anden ung med mobilen",
  source: "Helsingør Dagblad, 14. februar. Af Nina Frost",
  paragraphs: [
    "Flere unge betaler med mobilen",
    "Antallet af unge, der betaler med mobiltelefonen, er steget kraftigt de seneste tre år. Det viser nye tal fra den fiktive analyse Kortbetaling Danmark. I 2023 betalte 38 procent af de 15 til 19-årige med telefonen. I dag er tallet 51 procent.",
    "En vane i forandring",
    "Kunderne køber flere varer med telefonen. Det fortæller forsker Mads Lind fra Handelshøjskolen: Når man bare skal løfte telefonen, tænker man mindre over beløbet. Betalingen bliver usynlig, og den hurtige handling kan gøre det sværere at se forskel på et nødvendigt køb og en spontan beslutning.",
    "Butikkerne oplever også en ændring. Flere steder er kontanterne allerede ude af kassen, og personalet bruger mindre tid på at give byttepenge. Ifølge rapporten fra Kortbetaling Danmark har 64 procent af de adspurgte butikker færre kontantkunder end for fem år siden.",
    "Eksperter advarer",
    "Fordi betalingen bliver usynlig, tænker nogle unge mindre over beløbet. Samtidig advarer økonomer om, at hurtige betalinger kan gøre det sværere at holde styr på forbruget. Privatøkonom Sara Vang anbefaler, at unge følger med i deres kontooversigt hver uge og slår notifikationer til.",
    "Udviklingen betyder ikke, at kontanter forsvinder fra den ene dag til den anden. Ældre kunder og personer uden smartphone bruger stadig sedler og mønter. For butikkerne handler spørgsmålet derfor både om effektivitet og om at tilbyde en betalingsform, som alle kan bruge.",
    "Tallene viser en tydelig bevægelse, men de fortæller ikke alene, om mobilbetaling er godt eller dårligt. Forsker Mads Lind understreger, at vanen afhænger af både økonomi, alder og situation. Han efterlyser flere undersøgelser af, hvordan unge lærer at følge deres digitale forbrug.",
  ],
  pentagram: {
    afsender: { keywords: ["Nina", "Frost", "journalist", "Helsingør", "Dagblad", "rapport", "forsker"], model: "Journalisten Nina Frost skriver for Helsingør Dagblad og bruger rapporter og forskere som kilder." },
    emne: { keywords: ["mobilbetaling", "telefonen", "unge", "kontanter", "betaling", "forbrug", "butikker"], model: "Emnet er unges stigende brug af mobilbetaling og konsekvenserne for forbrugere og butikker." },
    modtager: { keywords: ["unge", "kunder", "butikker", "ældre", "alle", "læser", "offentligheden"], model: "Modtageren er avisens brede læserkreds, blandt andet unge, forældre og butikker." },
    situation: { keywords: ["Helsingør", "Dagblad", "14", "februar", "rapport", "artikel", "nyheder"], model: "Det er en dagsaktuel avisartikel fra 14. februar, der formidler en ny udvikling." },
    sprog: { keywords: ["tal", "procent", "neutral", "forsker", "rapport", "saglig", "informere"], model: "Sproget er sagligt og neutralt med procenttal, rapporter og citater fra en forsker og en privatøkonom." },
    formaal: { keywords: ["informere", "oplyse", "forklare", "vise", "fortæller", "belyse", "undersøgelser"], model: "Formålet er at informere om udviklingen og give læseren et nuanceret billede af mobilbetaling." },
  },
  saertraek: ARTIKEL_SAERTRAEK("Artiklen bruger substantiver fra betalingsfeltet: beløb, kasse, kontanter og kontooversigt. De præcise tal 38, 51 og 64 procent giver logos. Telefon og sedler er konkrete, mens udvikling og effektivitet er mere abstrakte. Ordvalget er overvejende neutralt, men advarer har en let negativ ladning. Ledsætninger og ekspertcitater gør den informerende tekst kompleks og troværdig."),
  morfologi: [
    { word: "mobiltelefonen", solution: ["mobil", "telefon", "en"], fleksiv: "-en", note: "Ordet står i andet afsnit. mobil og telefon er rødder, og -en er fleksiv for bestemt ental." },
    { word: "betalingen", solution: ["betal", "ing", "en"], fleksiv: "-en", note: "Ordet står i fjerde afsnit. betal er rod, -ing er suffiks, og -en er fleksiv." },
    { word: "kontooversigt", solution: ["konto", "over", "sigt"], altSolutions: [["konto", "oversigt"]], note: "Ordet står i sjette afsnit. konto, over og sigt kan analyseres som rødder i sammensætningen." },
    { word: "notifikationer", solution: ["notifikation", "er"], fleksiv: "-er", note: "Ordet står i sjette afsnit. notifikation er rod, og -er er fleksiv for flertal." },
  ],
  analyse: { sentence: "Kunderne køber flere varer med telefonen.", chunks: ["Kunderne", "køber", "flere varer", "med telefonen."], correctMap: ["subjekt", "verbal", "objekt", "adverbial"], forklaring: "Kunderne er subjekt, køber er verballed, flere varer er objekt, og med telefonen er adverbial for hjælpemiddel." },
  tider: [
    { sentence: "Antallet af unge, der betaler med mobiltelefonen, er steget kraftigt de seneste tre år.", verb: "er steget", tid: "perfektum", omskrivTil: "praeteritum", omskrivningEksempel: "Antallet af unge, der betalte med mobiltelefonen, steg kraftigt de seneste tre år.", omskrivGodkendte: ["steg"] },
    { sentence: "Butikkerne oplever også en ændring.", verb: "oplever", tid: "praesens", omskrivTil: "perfektum", omskrivningEksempel: "Butikkerne har også oplevet en ændring.", omskrivGodkendte: ["har oplevet"] },
  ],
  hsls: { sentence: "Fordi betalingen bliver usynlig, tænker nogle unge mindre over beløbet.", chunks: ["Fordi betalingen bliver usynlig,", "tænker nogle unge mindre over beløbet."], correctMap: ["ls", "hs"], indlederGodkendte: ["fordi"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Fordi betalingen bliver usynlig er en årsagsledsætning indledt af fordi og fungerer som adverbial. Tænker nogle unge mindre over beløbet er hovedsætningen." },
  eksamenTip: "Nævn rubrikkerne, procenttallene og de to kilder. Peg på, at den neutrale tone og ekspertcitaterne støtter den informerende genre.",
};

const TEKST_ARTIKEL_ENERGI: HhxExamText = {
  id: "artikel-energiforbrug",
  genre: "Informerende artikel",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 3,
  genreExplanation: "Det er en informerende artikel, fordi den forklarer en udvikling med tal, metode og forskerudsagn. Den præsenterer både en måling og ekspertens advarsel uden at argumentere for en personlig løsning.",
  begrundKeywords: ["informere", "artikel", "tal", "måling", "forsker", "ekspert", "neutral"],
  title: "Unge følger bedre med i strømforbruget",
  subtitle: "En ny måling viser, at energidata er blevet en del af hverdagen",
  source: "Fiktive ErhvervsNyheder, 3. september. Af Rikke Dahl",
  paragraphs: [
    "Unge følger bedre med i strømforbruget",
    "Unge mellem 16 og 24 år tjekker oftere deres strømforbrug end for to år siden. Det viser en ny måling fra EnergiData Analyse. I undersøgelsen svarer 57 procent, at de mindst en gang om ugen ser på deres forbrug, mens tallet i den tidligere måling var 34 procent.",
    "Data på køleskabet",
    "Flere elselskaber viser nu time for time, hvor meget strøm en bolig bruger. Flere elselskaber viser time for time, hvor meget strøm en bolig bruger. Det gør forbruget konkret, forklarer forsker Amina Rahman fra Institut for Forbrugeradfærd. Hvis data vises tæt på handlingen, er det lettere at opdage en vane. Når data vises tæt på den handling, der bruger strøm, er det lettere at opdage en vane. En energikilde som fjernvarme ændrer samtidig den måde, forbruget skal læses på.",
    "Målingen viser, at unge især ser på data, når de laver mad, vasker tøj eller oplader en elcykel. 41 procent siger, at de har ændret mindst én vane efter at have set en høj måling. Den mest almindelige ændring er at flytte vask og opvask til tidspunkter med lavere pris. Strømforbruget bliver dermed en konkret del af hverdagen.",
    "Ekspertens advarsel",
    "Forsker Amina Rahman advarer dog mod at læse tallene som et bevis på, at alle unge sparer lige meget. Boligens størrelse, varmekilde og økonomi har stor betydning. En elev i en lille lejlighed kan ikke ændre sit forbrug på samme måde som en familie i et stort hus.",
    "Virksomhederne bruger også energidata i deres kundekommunikation. Nogle sender ugentlige oversigter, mens andre giver råd om apparater og standby. Ifølge EnergiData Analyse foretrækker 63 procent af deltagerne en enkel oversigt frem for mange grafer og tekniske forklaringer.",
    "Udviklingen kan gøre energiforbrug til et mere synligt emne i undervisning og på arbejdspladser. Rahman understreger, at tal først bliver nyttige, når de kan forstås og omsættes til handling. Målingen siger derfor mest om adgang til information, ikke om den enkelte unges moral.",
  ],
  pentagram: {
    afsender: { keywords: ["Rikke", "Dahl", "ErhvervsNyheder", "journalist", "EnergiData", "forsker"], model: "Journalisten Rikke Dahl skriver for Fiktive ErhvervsNyheder og bruger EnergiData Analyse og forskeren Amina Rahman som kilder." },
    emne: { keywords: ["strømforbrug", "energiforbrug", "unge", "data", "måling", "energi", "vaner"], model: "Emnet er unges brug af energidata og ændringer i strømvaner." },
    modtager: { keywords: ["unge", "familie", "elselskaber", "virksomheder", "kunder", "læser", "arbejdspladser"], model: "Modtageren er en bred erhvervsinteresseret offentlighed med unge, familier og virksomheder." },
    situation: { keywords: ["ErhvervsNyheder", "september", "3", "måling", "artikel", "nyhed", "journalist"], model: "Det er en skriftlig nyhedsartikel fra 3. september, baseret på en ny måling." },
    sprog: { keywords: ["måling", "procent", "neutral", "forsker", "data", "saglig", "forklarer"], model: "Sproget er nøgternt og forklarende med procenttal, metodeord og forskercitater." },
    formaal: { keywords: ["informere", "forklare", "vise", "oplyse", "fortæller", "måling", "information"], model: "Formålet er at oplyse om en måling og forklare, hvad energidata kan betyde i hverdagen." },
  },
  saertraek: ARTIKEL_SAERTRAEK("Energi, strøm, data og forbrug danner et fagligt semantisk felt. Procenterne 57, 34, 41 og 63 er konkrete fakta, mens moral og udvikling er abstrakte. Den nøgterne tone og ord som forklarer og understreger holder artiklen neutral. Forskerens advarsel nuancerer tallene. Ledsætninger og præcise kilder gør informationen mere troværdig."),
  morfologi: [
    { word: "strømforbruget", solution: ["strøm", "forbrug", "et"], fleksiv: "-et", note: "Ordet står i anden afsnit. strøm og forbrug er rødder, og -et er fleksiv for bestemt ental." },
    { word: "energikilde", solution: ["energi", "kilde"], note: "Ordet står i fjerde afsnit. energi og kilde er rødder i den faglige sammensætning." },
    { word: "kundekommunikation", solution: ["kunde", "kommunikation"], note: "Ordet står i syvende afsnit. kunde og kommunikation er rødder i et sammensat ord." },
    { word: "ugentlige", solution: ["uge", "nt", "lige"], fleksiv: "-e", note: "Ordet står i syvende afsnit. uge er rod, -nt og -lige danner adjektivet, og -e er fleksiv." },
  ],
  analyse: { sentence: "Flere elselskaber viser time for time, hvor meget strøm en bolig bruger.", chunks: ["Flere elselskaber", "viser", "time for time", "hvor meget strøm en bolig bruger."], correctMap: ["subjekt", "verbal", "adverbial", "objekt"], forklaring: "Flere elselskaber er subjekt, viser er verballed, time for time er tidsadverbial, og hvor meget strøm en bolig bruger fungerer som objekt." },
  tider: [
    { sentence: "Unge mellem 16 og 24 år tjekker oftere deres strømforbrug end for to år siden.", verb: "tjekker", tid: "praesens", omskrivTil: "praeteritum", omskrivningEksempel: "Unge mellem 16 og 24 år tjekkede oftere deres strømforbrug end for to år siden.", omskrivGodkendte: ["tjekkede"] },
    { sentence: "41 procent siger, at de har ændret mindst én vane efter at have set en høj måling.", verb: "har ændret", tid: "perfektum", omskrivTil: "pluskvamperfektum", omskrivningEksempel: "41 procent sagde, at de havde ændret mindst én vane efter at have set en høj måling.", omskrivGodkendte: ["havde ændret"] },
  ],
  hsls: { sentence: "Hvis data vises tæt på handlingen, er det lettere at opdage en vane.", chunks: ["Hvis data vises tæt på handlingen,", "er det lettere at opdage en vane."], correctMap: ["ls", "hs"], indlederGodkendte: ["hvis"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Hvis data vises tæt på handlingen er en betingende ledsætning med hvis og fungerer som adverbial. Er det lettere at opdage en vane er hovedsætningen." },
  eksamenTip: "Brug rubrikker, procenter og citatet fra Rahman. Forklar, hvordan kilderne gør det muligt at informere uden en tydelig personlig holdning.",
};

const TEKST_REKLAME_FLOW: HhxExamText = {
  id: "reklame-flowbedre",
  genre: "Reklame",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 4,
  genreExplanation: "Det er en reklame, fordi FlowBedre er et produkt, og teksten prøver at få målgruppen til at downloade appen. Imperativer, korte staccatosætninger, tal og en kampagneafslutning gør budskabet handlingsorienteret.",
  begrundKeywords: ["reklame", "sælge", "produkt", "app", "download", "imperativ", "kampagne", "gratis"],
  title: "FlowBedre",
  subtitle: "Appen der giver dig tiden tilbage",
  source: "Reklame fra det fiktive UngTech Magasin, september",
  paragraphs: [
    "Skolen kalder. Vennerne skriver. Telefonen buzzer. Og du? Du sidder stadig med lektierne. En besked, en video, en ny besked. Fokus forsvinder på få sekunder, og aftenen bliver længere, end den behøver at være.",
    "Mød FlowBedre",
    "FlowBedre giver dig ro i hverdagen. FlowBedre giver dig ro i hverdagen. Tryk på knappen, og appen lukker støj ude i 25 minutter. Over 10.000 unge har allerede downloadet appen, og ni ud af ti i vores fiktive brugerpanel siger, at de får mere lavet. Det er ikke magi. Det er en enkel pause.",
    "Vælg dit mål. Vælg 25 eller 50 minutter. Læg telefonen med skærmen ned. FlowBedre holder styr på tiden, mens du læser, skriver eller forbereder næste præsentation. Når perioden slutter, får du en venlig påmindelse. Du bestemmer selv, hvad der skal have din opmærksomhed.",
    "Prøv gratis i 30 dage. Du får adgang til fokusplaner, statistik og små råd fra andre elever. Appen vil spare dig for timer, du aldrig får tilbage, men den lover ikke, at lektierne skriver sig selv. Den giver dig et rum, hvor du kan begynde.",
    "Mindre støj. Mere retning. Bedre flow. De korte sætninger er vores løfte til dig, der har prøvet at starte fem gange uden at komme i gang. Du behøver ikke være perfekt. Du skal bare trykke på start.",
    "Når du henter appen nu, får du den første måned gratis. Derefter koster FlowBedre 29 kroner om måneden, og du kan opsige abonnementet med et klik. Ingen skjulte gebyrer i prøveperioden. Læs vilkårene, før du vælger, og brug appen på din måde. Når du henter appen nu, får du den første måned gratis.",
    "Hent FlowBedre nu. Tryk på start. Find dit fokus. Kampagnen gælder til 30. september eller så længe prøvepladserne rækker. FlowBedre: Tiden er din. Brug den på det, der betyder noget.",
  ],
  pentagram: {
    afsender: { keywords: ["FlowBedre", "virksomhed", "UngTech", "app", "sælger", "reklame", "brand"], model: "Virksomheden bag FlowBedre er afsender. Den vil sælge en app, men taler i en venlig rådgivende tone." },
    emne: { keywords: ["FlowBedre", "app", "fokus", "telefon", "lektier", "tid", "produkt"], model: "Emnet er FlowBedre-appen, der skal hjælpe unge med fokus og mindre digital støj." },
    modtager: { keywords: ["unge", "elever", "dig", "du", "lektier", "præsentation", "skolen"], model: "Modtageren er skoleelever og unge, der oplever distraktioner, lektier og pres på tiden." },
    situation: { keywords: ["reklame", "UngTech", "september", "kampagne", "download", "app", "prøveperiode"], model: "Det er en kampagnereklame fra september, der skal få modtageren til at hente appen nu." },
    sprog: { keywords: ["imperativ", "bydeform", "staccato", "korte", "tal", "kampagne", "opfordring"], model: "Sproget er reklamepræget med imperativer, staccato, tal, gentagelse og direkte tiltale." },
    formaal: { keywords: ["hent", "download", "sælge", "prøv", "købe", "kampagne", "abonnement"], model: "Formålet er at få unge til at hente appen og senere betale for abonnementet." },
  },
  saertraek: REKLAME_SAERTRAEK("Du og dig skaber direkte tiltale, mens tryk, start og hent er imperativer. App, fokus og tid danner reklamesprogets semantiske felt. Knappen og skærmen er konkrete, mens ro og retning er abstrakte. Støj har en negativ konnotation, mens bedre flow er positivt ladet. De korte staccatosætninger og tallene 25, 50, 10.000 og 29 gør kampagnen let at huske."),
  morfologi: [
    { word: "fokusplaner", solution: ["fokus", "plan", "er"], fleksiv: "-er", note: "Ordet står i femte afsnit. fokus og plan er rødder, og -er er fleksiv for flertal." },
    { word: "opmærksomhed", solution: ["op", "mærk", "som", "hed"], note: "Ordet står i fjerde afsnit. op- er præfiks, mærk er rod, som er afledningsdel, og -hed er suffiks." },
    { word: "prøveperioden", solution: ["prøve", "periode", "n"], fleksiv: "-n", note: "Ordet står i syvende afsnit. prøve og periode er rødder, og -n er fleksiv for bestemt ental." },
    { word: "abonnementet", solution: ["abonnement", "et"], fleksiv: "-et", note: "Ordet står i syvende afsnit. abonnement er rod, og -et er fleksiv." },
  ],
  analyse: { sentence: "FlowBedre giver dig ro i hverdagen.", chunks: ["FlowBedre", "giver", "dig", "ro", "i hverdagen."], correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"], forklaring: "FlowBedre er subjekt, giver er verballed, dig er hensynsled, ro er genstandsled, og i hverdagen er adverbial." },
  tider: [
    { sentence: "Over 10.000 unge har allerede downloadet appen.", verb: "har downloadet", tid: "perfektum", omskrivTil: "praeteritum", omskrivningEksempel: "Over 10.000 unge downloadede allerede appen.", omskrivGodkendte: ["downloadede"] },
    { sentence: "Du får adgang til fokusplaner, statistik og små råd fra andre elever.", verb: "får", tid: "praesens", omskrivTil: "futurum", omskrivningEksempel: "Du vil få adgang til fokusplaner, statistik og små råd fra andre elever.", omskrivGodkendte: ["vil få", "skal få"] },
  ],
  hsls: { sentence: "Når du henter appen nu, får du den første måned gratis.", chunks: ["Når du henter appen nu,", "får du den første måned gratis."], correctMap: ["ls", "hs"], indlederGodkendte: ["når"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Når du henter appen nu er en tidsledsætning med når og fungerer som adverbial. Får du den første måned gratis er hovedsætningen." },
  eksamenTip: "Nævn imperativerne, staccatosætningerne og kampagnens tal. Forklar, at reklamen både lover hjælp og opfordrer til øjeblikkelig handling.",
};

const TEKST_REKLAME_KAFFE: HhxExamText = {
  id: "reklame-nordlys-kaffe",
  genre: "Reklame",
  genreOptions: GENRE_OPTIONS,
  correctGenreIndex: 4,
  genreExplanation: "Det er en reklame, fordi Nordlys Kaffe præsenterer et produkt, bruger sanseord og priser og afslutter med en direkte opfordring. Kampagnetallet og de korte imperativer skal skabe lyst til at købe.",
  begrundKeywords: ["reklame", "produkt", "kaffe", "sælge", "kampagne", "opfordring", "køb", "imperativ"],
  title: "Start dagen med Nordlys",
  subtitle: "Kaffe med smag af pause",
  source: "Reklame fra det fiktive erhvervsmagasin HandelNu, november",
  paragraphs: [
    "Første time. Første mail. Første beslutning. Når dagen begynder, skal kaffen kunne følge med. Nordlys Kaffe er skabt til dig, der vil have en fyldig kop, før kalenderen bliver fuld og møderne tager over. Nordlys Kaffe giver dig en fyldig start.",
    "Smag pausen",
    "Åbn posen. Duft til de mørke bønner. Hæld op. Nordlys er en mellemristet kaffe med noter af kakao, citrus og varm karamel. Bønnerne kommer fra tre små kooperativer, og hver pose er pakket på vores mikroristeri i Aarhus.",
    "Ni ud af ti i vores fiktive smagspanel vælger Nordlys, når de skal have en kaffe, der både er blød og tydelig. Det er ikke en videnskabelig test, og vi siger det, som det er. Det er et smagspanel, der blev samlet til kampagnen, men panelets favorit er stadig værd at prøve.",
    "Tag den med på kontoret. Sæt den frem i mødelokalet. Servér den, når kunden kommer. Nordlys Kaffe passer til den første idé, den lange rapport og den korte pause mellem to samtaler. En kop kan ikke løse en travl dag, men den kan gøre pausen bedre.",
    "Køb to poser og få en tredje med. Kampagnen gælder til 15. november, så længe lager haves. Du betaler 89 kroner for en pose på 250 gram. Brug kampagnetilbuddet, mens det gælder. Bestil online, eller find Nordlys hos udvalgte caféer og kontorfællesskaber i hele landet.",
    "Vi rister i små hold og sender kaffen tre gange om ugen. Fordi vi rister i små hold, sender vi kaffen tre gange om ugen. Du får et friskere produkt og en smag, der ikke har stået på et lager i månedsvis. Emballagen er delvist genanvendelig, og vi arbejder på at gøre den helt fri for unødvendig plast.",
    "Gør den første kop til dagens bedste beslutning. Bestil Nordlys nu. Smag forskellen. Del pausen. Nordlys Kaffe: En fyldig start til mennesker, der får ting til at ske.",
  ],
  pentagram: {
    afsender: { keywords: ["Nordlys", "HandelNu", "mikroristeri", "kaffe", "brand", "virksomhed", "kampagne"], model: "Virksomheden Nordlys Kaffe er afsender og bruger HandelNu som reklamekanal. Den vil sælge kaffeposer." },
    emne: { keywords: ["kaffe", "bønner", "Nordlys", "kop", "smag", "produkt", "pose", "risteri"], model: "Emnet er produktet Nordlys Kaffe, dets smag, produktion og kampagnetilbud." },
    modtager: { keywords: ["dig", "kontor", "kunde", "café", "kontorfællesskaber", "mennesker", "du"], model: "Modtageren er voksne kaffe- og erhvervsforbrugere, som drikker kaffe på kontor eller i møder." },
    situation: { keywords: ["reklame", "HandelNu", "november", "kampagne", "bestil", "online", "købe"], model: "Det er en reklamekampagne i november, der skal udløse et køb online eller hos udvalgte caféer." },
    sprog: { keywords: ["imperativer", "duft", "hæld", "køb", "bestil", "sanseord", "tal", "opfordring"], model: "Sproget bruger imperativer, sanseord, direkte tiltale, tal og korte staccatosætninger." },
    formaal: { keywords: ["køb", "bestil", "sælge", "kampagne", "prøve", "produkt", "smag"], model: "Formålet er at få modtageren til at prøve og købe Nordlys Kaffe, gerne gennem kampagnetilbuddet." },
  },
  saertraek: REKLAME_SAERTRAEK("Smag, bønner, kop og pose danner det sanselige kaffefelt. Duft, mørk og fyldig er adjektiver og sanseord med positive konnotationer. Kop og 250 gram er konkrete, mens pause og beslutning er abstrakte. Imperativerne åbn posen, hæld op, køb og bestil skaber handlepres. Korte sætninger giver staccato, mens tallet ni ud af ti giver reklamen et skær af troværdighed."),
  morfologi: [
    { word: "mikroristeri", solution: ["mikro", "rist", "eri"], note: "Ordet står i tredje afsnit. mikro er præfiks, rist er rod, og -eri er suffiks." },
    { word: "mellemristet", solution: ["mellem", "rist", "et"], fleksiv: "-et", note: "Ordet står i tredje afsnit. mellem er forled, rist er rod, og -et er fleksiv i tillægsordet." },
    { word: "kontorfællesskaber", solution: ["kontor", "fælles", "skab", "er"], fleksiv: "-er", note: "Ordet står i femte afsnit. kontor, fælles og skab er rødder, og -er er fleksiv for flertal." },
    { word: "kampagnetilbuddet", solution: ["kampagne", "tilbud", "det"], fleksiv: "-et", note: "Ordet står i sjette afsnit. kampagne og tilbud er rødder, og -et er bestemtheds-fleksiv." },
  ],
  analyse: { sentence: "Nordlys Kaffe giver dig en fyldig start.", chunks: ["Nordlys Kaffe", "giver", "dig", "en fyldig start."], correctMap: ["subjekt", "verbal", "dativ", "objekt"], forklaring: "Nordlys Kaffe er subjekt, giver er verballed, dig er hensynsled, og en fyldig start er objekt." },
  tider: [
    { sentence: "Vi rister i små hold og sender kaffen tre gange om ugen.", verb: "rister", tid: "praesens", omskrivTil: "praeteritum", omskrivningEksempel: "Vi ristede i små hold og sendte kaffen tre gange om ugen.", omskrivGodkendte: ["ristede"] },
    { sentence: "Du får et friskere produkt og en smag, der ikke har stået på et lager i månedsvis.", verb: "får", tid: "praesens", omskrivTil: "futurum", omskrivningEksempel: "Du vil få et friskere produkt og en smag, der ikke har stået på et lager i månedsvis.", omskrivGodkendte: ["vil få", "skal få"] },
  ],
  hsls: { sentence: "Fordi vi rister i små hold, sender vi kaffen tre gange om ugen.", chunks: ["Fordi vi rister i små hold,", "sender vi kaffen tre gange om ugen."], correctMap: ["ls", "hs"], indlederGodkendte: ["fordi"], funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"], funktionCorrect: 2, forklaring: "Fordi vi rister i små hold er en årsagsledsætning med fordi og fungerer som adverbial. Sender vi kaffen tre gange om ugen er hovedsætningen." },
  eksamenTip: "Undersøg sanseordene, imperativerne og kampagnetallet. Vurdér også, hvordan reklamen forsøger at virke ærlig ved at nævne begrænsningen ved smagspanelet.",
};

export const EXAM_TEXTS: HhxExamText[] = [
  TEKST_TALE_ELEVRAAD,
  TEKST_TALE_FREMTID,
  TEKST_BOLIG_HAVUDSIGT,
  TEKST_BOLIG_BYHUS,
  TEKST_OPINION_IMPULS,
  TEKST_OPINION_PRAKTIK,
  TEKST_ARTIKEL_MOBIL,
  TEKST_ARTIKEL_ENERGI,
  TEKST_REKLAME_FLOW,
  TEKST_REKLAME_KAFFE,
];

export function pickExamText(): HhxExamText {
  return EXAM_TEXTS[Math.floor(Math.random() * EXAM_TEXTS.length)];
}

export const EXAM_SECONDS = 40 * 60;
 60;
