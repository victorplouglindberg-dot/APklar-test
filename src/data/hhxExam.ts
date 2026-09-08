// HHX-eksamensprøven (AP): data til øveprøven, hvor eleven trækker en ukendt
// tekst med 7 tilhørende opgaver (jf. eksamensguiden: genretræk,
// kommunikationssituation, sproglige særtræk, morfologi, sætningsanalyse,
// verbaltider samt hoved- og ledsætninger).
//
// Teksterne er alle opdigtede og bevidst skrevet, så de understøtter de fem
// genrer, man kan trække til AP-eksamen: politisk tale, ejendomsannonce,
// opinionsartikel, informerende artikel og reklame. For hver tekst følger den
// fulde facitliste (genre, pentagram-modeller, nøgleord, morfemer, analyse,
// tider og hoved-/ledsætninger), som bedømmelsesmotoren i
// lib/hhxExamGrading.ts bruger til den vejledende feedback.

import type { LedSymbol } from "../types";

// ---------------------------------------------------------------------------
// Genrer, der kan trækkes til AP-eksamen
// ---------------------------------------------------------------------------

export const EXAM_GENRES = [
  "Politisk tale",
  "Ejendomsannonce",
  "Opinionsartikel",
  "Informerende artikel",
  "Reklame",
] as const;

// ---------------------------------------------------------------------------
// Verbtider (opgave 6)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Ordklasser (markering i teksten, jf. opgave 3 og eksamensguidens 8 ordklasser)
// ---------------------------------------------------------------------------

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

// Baggrundsfarver, når man markerer ord i teksten med sætningsled-symbolerne
// (samme farver som SYMBOLS i data/symbols.ts).
export const LED_MARK_BG: Record<LedSymbol, string> = {
  subjekt: "bg-blue-100 dark:bg-blue-500/40",
  verbal: "bg-red-100 dark:bg-red-500/40",
  objekt: "bg-emerald-100 dark:bg-emerald-500/40",
  dativ: "bg-teal-100 dark:bg-teal-500/40",
  adverbial: "bg-amber-100 dark:bg-amber-500/40",
  subjpred: "bg-purple-100 dark:bg-purple-500/40",
  objpred: "bg-fuchsia-100 dark:bg-fuchsia-500/40",
};

// ---------------------------------------------------------------------------
// Ciceros pentagram (opgave 2)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Opgavetyper
// ---------------------------------------------------------------------------

export interface MorfologiWord {
  word: string;
  solution: string[];
  altSolutions?: string[][];
  fleksiv?: string; // f.eks. "-en"; udefineret = ordet har ingen bøjningsendelse
  note: string;
}

export interface TidOpgave {
  sentence: string;
  verb: string; // verballedet eleven skal kigge på
  tid: VerbumTid;
  omskrivTil: VerbumTid;
  omskrivningEksempel: string;
  omskrivGodkendte: string[]; // verbform(er), der skal indgå i elevens omskrivning
}

export interface HsLsOpgave {
  sentence: string;
  chunks: string[];
  correctMap: ("hs" | "ls")[];
  indlederGodkendte: string[];
  funktionOptions: string[]; // ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"]
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

// ---------------------------------------------------------------------------
// Trækbare tekster (alle opdigtede)
// ---------------------------------------------------------------------------

const TEKST_TALE: HhxExamText = {
  id: "tale-elevraab",
  genre: "Politisk tale",
  genreOptions: ["Ejendomsannonce", "Politisk tale", "Informerende artikel", "Reklame", "Opinionsartikel"],
  correctGenreIndex: 1,
  genreExplanation:
    "En politisk tale skal overbevise og vinde tilslutning (her: stemmer ved elevvalget). Den appellerer til etos (to års erfaring fra elevråbet), patos (frustrationer, tomme løfter) og logos (86 procent-brug af kantinen), bruger korte sætninger, direkte henvendelse og retoriske spørgsmål, og den slutter med en klar opfordring: Giv mig jeres stemme.",
  begrundKeywords: [
    "overbevis", "tilslutning", "vinde", "stemme", "vælge", "opfordr", "valg", "etos", "patos", "logos",
    "appeller", "retorisk", "korte sætninger", "jeg", "vi", "tale", "oplys", "sælge", "annonce", "fakta", "neutral",
  ],
  title: "Jeres stemme. Jeres skole.",
  subtitle: "Tale ved afslutningsmødet før elevvalget",
  source: "Tale holdt af Sofie Berg, kandidat til elevråbsformand, fredag den 7. november",
  paragraphs: [
    "Kære elever, kære lærere. I dag står jeg her, fordi jeg tror på, at vores skole kan blive bedre. Ikke på papiret. Ikke i en plan. Men i hverdagen, her blandt os.",
    "Jeg har siddet to år i elevråbet. Jeg har læst jeres forslag. Jeg har noteret jeres frustrationer. Og jeg har set, hvad der sker, når forslagene forsvinder i en skuffe. Det er forklaringen på, at jeg stiller op: Jeg gider ikke flere tomme løfter.",
    "Hvem ønsker ikke at blive hørt? Hvem ønsker ikke en kantine med fair priser og en skolegård, man gider opholde sig i? 86 procent af jer bruger kantinen hver eneste dag. Alligevel falder priserne aldrig. Det handler ikke om drømme. Det handler om beslutninger.",
    "Jeg lover jer mere indflydelse hver eneste måned. Elevråbet skal have plads i møderne. Jeres ideer skal på dagsordenen. Vi starter arbejdet i morgen, hvis I vælger mig.",
    "Da jeg startede på skolen, var jeg bange for at tale højt. I dag står jeg her og taler til jer alle sammen. Jeg stiller op, fordi vores stemmer er den vigtigste ressource, denne skole ejer. Giv mig jeres stemme, så giver jeg jer min tid. Tak.",
  ],
  pentagram: {
    afsender: {
      keywords: ["sofie", "elevråb", "kandidat", "formand", "elev", "skole", "politiker", "taler"],
      model: "Sofie Berg, elev og kandidat til elevråbsformand. Hun bruger sine to år i elevråbet som troværdighed (etos).",
    },
    emne: {
      keywords: ["elevråb", "indflydelse", "valg", "skole", "kantine", "stemme", "forandr", "forbedr", "ideer"],
      model: "Elevvalget og ønsket om mere elevindflydelse: kantinepriser, plads i møderne og elevernes ideer på dagsordenen.",
    },
    modtager: {
      keywords: ["elever", "elev", "medelever", "vælgere", "skolens elever", "studerende", "os", "jer", "I", "lærere"],
      model: "Skolens elever, især dem, der skal stemme ved elevvalget. Taleren henvender sig direkte til dem med I/jeres.",
    },
    situation: {
      keywords: ["skolevalg", "valgmøde", "afslutningsmøde", "tale", "skolen", "november", "valgkamp", "mundtlig", "holdt", "forsamling", "fest"],
      model: "Afslutningsmødet før elevvalget (november): en mundtlig tale foran en forsamling af elever og lærere, kort før valget.",
    },
    sprog: {
      keywords: ["tale", "mundtlig", "korte sætninger", "retorisk", "opfordring", "direkte", "du", "i", "enkel", "appeller", "personlig"],
      model: "En mundtlig politisk tale med korte sætninger, direkte henvendelse (I/jeres), retoriske spørgsmål og klare opfordringer.",
    },
    formaal: {
      keywords: ["overbevis", "tilslutning", "vinde", "stemme", "vælge", "opfordr", "påvirke", "vælger"],
      model: "At overbevise eleverne om at stemme på hende og vinde tilslutning til posten som elevråbsformand.",
    },
  },
  saertraek: {
    kategorier: [
      {
        label: "Ordklasser og ordvalg",
        keywords: ["pronom", "jeg", "vi", "adjektiv", "tillægsord", "verber", "udsagnsord", "imperativ", "bydeform", "superlativ", "vigtigste", "substantiv", "navneord"],
      },
      {
        label: "Semantiske felter",
        keywords: ["semantisk", "ordfelt", "temafelt", "valg", "skole", "politik", "demokrati", "stemme", "kantine"],
      },
      {
        label: "Konkrete og abstrakte ord",
        keywords: ["abstrakt", "konkret", "indflydelse", "stemme", "kantine", "skolegård", "tro", "tillid", "drømme", "beslutninger"],
      },
      {
        label: "Konnotationer",
        keywords: ["konnotation", "negativ", "positiv", "ladede", "værdiladede", "tomme løfter", "frustration", "ligegyldighed"],
      },
      {
        label: "Sætningskonstruktion (paratakse/hypotakse)",
        keywords: ["paratakse", "sideordn", "hypotakse", "underordn", "korte sætninger", "hovedsætning", "ledsætning", "repetition", "anafor", "gentag"],
      },
      {
        label: "Retoriske greb",
        keywords: ["retorisk", "appeller", "etos", "patos", "logos", "gentag", "repetition", "anafor", "opfordring", "spørgsmål"],
      },
    ],
    model:
      "Teksten har mange personlige pronomener (jeg, vi, I), som skaber direkte kontakt, og superlativet vigtigste peger frem mod opfordringen. Ordene er værdiladede: tomme løfter og frustrationer har negative konnotationer og kritiserer det gamle styre, mens semantisk feltet om skole og demokrati (valg, stemme, dagsorden) binder teksten sammen. Der er kontrast mellem konkrete ord (kantine, skolegård) og abstrakte (indflydelse, beslutninger). Stilen er præget af paratakse: korte, sideordnede sætninger med og, som giver et mundtligt tempo. Gentagelsen Jeg har er en anafor, og Hvem ønsker ikke...? er retoriske spørgsmål, der engagerer modtagerne.",
  },
  morfologi: [
    {
      word: "afslutningsmøde",
      solution: ["af", "slut", "ning", "s", "møde"],
      note: "af- (præfiks), slut (rodmorfem), -ning (suffiks der laver substantiv), s (bindebogstav), møde (rodmorfem). Ordet står i kildelinjen.",
    },
    {
      word: "forklaringen",
      solution: ["for", "klar", "ing", "en"],
      fleksiv: "-en",
      note: "for- (præfiks), klar (rodmorfem), -ing (suffiks der laver substantiv), -en (fleksiv: bestemt ental).",
    },
    {
      word: "vigtigste",
      solution: ["vigtig", "st", "e"],
      altSolutions: [["vigtig", "ste"]],
      fleksiv: "-e",
      note: "vigtig (rodmorfem), -st (suffiks: superlativ), -e (fleksiv: kongruens/bestemt form).",
    },
    {
      word: "tror",
      solution: ["tro", "r"],
      fleksiv: "-r",
      note: "tro (rodmorfem), -r (fleksiv: nutid).",
    },
  ],
  analyse: {
    sentence: "Jeg lover jer mere indflydelse hver eneste måned.",
    chunks: ["Jeg", "lover", "jer", "mere indflydelse", "hver eneste måned."],
    correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
    forklaring:
      "Verballedet er lover. Subjektet er Jeg (hvem lover?). Jer er hensynsled (til hvem?), og det kræver, at der også er et genstandsled: mere indflydelse (hvad lover hun?). Hver eneste måned er adverbial (hvornår/hvor ofte?).",
  },
  tider: [
    {
      sentence: "Jeg har siddet to år i elevråbet.",
      verb: "har siddet",
      tid: "perfektum",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Jeg sad to år i elevråbet.",
      omskrivGodkendte: ["sad"],
    },
    {
      sentence: "Vi starter arbejdet i morgen.",
      verb: "starter",
      tid: "praesens",
      omskrivTil: "futurum",
      omskrivningEksempel: "Vi vil starte arbejdet i morgen.",
      omskrivGodkendte: ["vil starte", "skal starte"],
    },
  ],
  hsls: {
    sentence: "Da jeg startede på skolen, var jeg bange for at tale højt.",
    chunks: ["Da jeg startede på skolen,", "var jeg bange for at tale højt."],
    correctMap: ["ls", "hs"],
    indlederGodkendte: ["da"],
    funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"],
    funktionCorrect: 2,
    forklaring:
      "Da jeg startede på skolen er en ledsætning: ikke-reglen giver ikke mellem subjektet (jeg) og verballedet (startede), og den kan ikke stå alene. Den er indledt af konjunktionen da og fungerer som adverbial (tid) i hovedsætningen. Var jeg bange for at tale højt er hovedsætningen: ikke kan sættes efter verballedet (var jeg ikke bange...).",
  },
  eksamenTip:
    "Nævn altid mindst to virkemidler og peg på konkrete steder i teksten. Sig også, hvad grebet gør ved modtageren (fx at de retoriske spørgsmål gør eleven aktiv).",
};

const TEKST_OPINION: HhxExamText = {
  id: "opinion-impulskoebe",
  genre: "Opinionsartikel",
  genreOptions: ["Opinionsartikel", "Politisk tale", "Reklame", "Informerende artikel", "Ejendomsannonce"],
  correctGenreIndex: 0,
  genreExplanation:
    "En opinionsartikel er en meningstekst: Skribenten siger tydeligt sin mening (Jeg mener, at...), bruger jeg-form, argumenterer for sin sag og møder modargumenterne (Nu vil nogen sige:...). Formålet er at overbevise, ikke at oplyse neutralt.",
  begrundKeywords: [
    "holdning", "mening", "jeg", "overbevis", "argument", "modargument", "opinion", "kronik", "debat", "partisk",
    "oplys", "neutral", "fakta", "sælge", "annonce", "tale",
  ],
  title: "Stop impulskøbene",
  subtitle: "Webshopperne ved præcis, hvornår vi er svage. Det skal vi tale om.",
  source: "Kronik, mediet Ung Handel, maj. Af Oliver Kruse, 3.g HHX-elev",
  paragraphs: [
    "Klokken er 23.40. Du scroller lidt træt gennem en webshop, og pludselig blinker der en orange kupon på skærmen: Kun 30 minutter tilbage! Du trykker. Selvfølgelig gør du. Jeg har gjort det selv mange gange.",
    "Jeg mener, at webshoppernes tidsbegrænsede kampagner er en af de største grunde til, at unge i dag bruger for mange penge online. Virksomhederne tjener store penge på vores utålmodighed, og det er ikke fair.",
    "Nu vil nogen sige: Det er jo vores eget valg. Jo, det er det. Men et valg, der er designet til at udløse impulser, er ikke et frit valg. Når en kampagne lyder for god til at være sand, er den ofte det: Fragtfri i dag betyder ofte højere priser i går.",
    "Derfor vil jeg foreslå en simpel regel: Når en webshop bruger nedtællinger, skal der stå, hvor længe tilbuddet faktisk har kørt. Åbenhed er billig. Utålmodighed er dyr.",
    "Jeg har set mine kammerater fortryde impulskøbene igen og igen. Vi fortjener handel med respekt, ikke handel med fælder. Så næste gang kuponnen blinker: Luk skærmen. Spørg dig selv, om du faktisk har brug for varen. Vent til i morgen.",
  ],
  pentagram: {
    afsender: {
      keywords: ["oliver", "elev", "3", "ung", "forbruger", "jeg", "kammerat", "gymnasie", "hhx", "skribent"],
      model: "Oliver Kruse, 3.g HHX-elev og selv ung forbruger. Han taler ud fra egen erfaring i jeg-form.",
    },
    emne: {
      keywords: ["impulskøb", "webshop", "kampagne", "tilbud", "kupon", "forbrug", "handel", "penge", "netkøb"],
      model: "Unges impulskøb på nettet og de tidsbegrænsede kampagner i webshops.",
    },
    modtager: {
      keywords: ["unge", "forbruger", "webshop", "virksomhed", "elever", "kammerater", "læser", "samfund", "branchen", "politiker"],
      model: "Andre unge forbrugere, men også webshoppes branchen og beslutningstagere: kronikken skriver sig ind i en offentlig debat.",
    },
    situation: {
      keywords: ["kronik", "avis", "avisen", "magasin", "ung handel", "nettet", "online", "debat", "maj", "artikel", "blade", "medie"],
      model: "En kronik i mediet Ung Handel (maj): en skriftlig, offentlig debattekst, som læses i ro og mag.",
    },
    sprog: {
      keywords: ["jeg", "personlig", "holdning", "argument", "modargument", "ironi", "direkte", "du", "opinion", "mening"],
      model: "Skriftlig opinionsgenre: personlig jeg-form, klare holdningsudtryk (Jeg mener), argumenter og modargumenter og en let ironisk tone (Fragtfri i dag betyder ofte højere priser i går).",
    },
    formaal: {
      keywords: ["overbevis", "holdning", "påvirke", "regler", "regulering", "ændre", "åbenhed", "bevidstgør", "bevidstgøre", "opfordre", "foreslå"],
      model: "At overbevise læserne om, at kampagnerne er problematiske, og at få dem med på forslaget om mere åbenhed med nedtællinger.",
    },
  },
  saertraek: {
    kategorier: [
      {
        label: "Ordklasser og ordvalg",
        keywords: ["adjektiv", "tillægsord", "verber", "udsagnsord", "pronomen", "jeg", "substantiv", "navneord", "imperativ", "bydeform", "luk", "vent"],
      },
      {
        label: "Semantiske felter",
        keywords: ["semantisk", "ordfelt", "handel", "webshop", "køb", "forbrug", "økonomi", "penge", "pris", "vare"],
      },
      {
        label: "Konkrete og abstrakte ord",
        keywords: ["konkret", "abstrakt", "kupon", "skærm", "vare", "fair", "utålmodighed", "åbenhed", "respekt"],
      },
      {
        label: "Konnotationer",
        keywords: ["konnotation", "negativ", "positiv", "ladede", "værdiladede", "fælder", "ironi", "sarkasme", "eufemisme"],
      },
      {
        label: "Sætningskonstruktion (paratakse/hypotakse)",
        keywords: ["paratakse", "sideordn", "hypotakse", "underordn", "imperativ", "bydeform", "korte sætninger", "forvægt", "bagvægt", "omvendt ordstilling", "ledsætning"],
      },
      {
        label: "Retoriske greb",
        keywords: ["retorisk", "appeller", "etos", "patos", "logos", "gentag", "repetition", "kontrast", "direkte tiltale", "du", "spørgsmål"],
      },
    ],
    model:
      "Teksten bruger personlige pronomener (jeg, du) og imperativer (Luk skærmen. Vent til i morgen.), som gør den direkte og opfordrende. Semantisk feltet om handel dominerer (webshop, kupon, fragtfri, priser, vare). Der er kontrast mellem konkrete ord (kupon, skærm) og abstrakte (åbenhed, respekt, fair). Fælder og utålmodighed har negative konnotationer, og Fragtfri i dag gengives ironisk. Stilen veksler mellem paratakse (Luk skærmen.), som giver et mundtligt tempo, og hypotakse med ledsætninger (...at unge i dag bruger for mange penge online), som bærer argumentationen. Kontrasterne (billig/dyr, respekt/fælder) og den direkte tiltale (du) engagerer læseren.",
  },
  morfologi: [
    {
      word: "impulskøbene",
      solution: ["impuls", "køb", "ene"],
      altSolutions: [["impuls", "køb", "en", "e"]],
      fleksiv: "-ene",
      note: "impuls (rodmorfem), køb (rodmorfem) i et sammensat ord uden bindebogstav, -ene (fleksiv: bestemt flertal).",
    },
    {
      word: "utålmodighed",
      solution: ["u", "tål", "mod", "ighed"],
      note: "u- (negativ præfiks), tål og mod (to rodmorfemer), -ighed (suffiks der laver substantiv). Ordet har ingen bøjningsendelse her.",
    },
    {
      word: "fortryde",
      solution: ["for", "tryd", "e"],
      altSolutions: [["for", "tryde"]],
      fleksiv: "-e",
      note: "for- (præfiks), tryd (rodmorfem), -e (fleksiv: infinitivendelse).",
    },
    {
      word: "nedtællinger",
      solution: ["ned", "tæll", "ing", "er"],
      fleksiv: "-er",
      note: "ned- (præfiks), tæll (rodmorfem), -ing (suffiks der laver substantiv), -er (fleksiv: flertal).",
    },
  ],
  analyse: {
    sentence: "Virksomhederne tjener store penge på vores utålmodighed.",
    chunks: ["Virksomhederne", "tjener", "store penge", "på vores utålmodighed."],
    correctMap: ["subjekt", "verbal", "objekt", "adverbial"],
    forklaring:
      "Verballedet er tjener. Subjektet er Virksomhederne (hvem tjener?). Store penge er genstandsled (hvad tjener de?). På vores utålmodighed er adverbial (hvad tjener de dem på? her: årsag/grund).",
  },
  tider: [
    {
      sentence: "Jeg har set mine kammerater fortryde impulskøbene igen og igen.",
      verb: "har set",
      tid: "perfektum",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Jeg så mine kammerater fortryde impulskøbene igen og igen.",
      omskrivGodkendte: ["så"],
    },
    {
      sentence: "Du scroller lidt træt gennem en webshop.",
      verb: "scroller",
      tid: "praesens",
      omskrivTil: "perfektum",
      omskrivningEksempel: "Du har scrollet lidt træt gennem en webshop.",
      omskrivGodkendte: ["har scrollet"],
    },
  ],
  hsls: {
    sentence: "Når en kampagne lyder for god til at være sand, er den ofte det.",
    chunks: ["Når en kampagne lyder for god til at være sand,", "er den ofte det."],
    correctMap: ["ls", "hs"],
    indlederGodkendte: ["når"],
    funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"],
    funktionCorrect: 2,
    forklaring:
      "Når en kampagne lyder for god til at være sand er en ledsætning: ikke-reglen giver ikke mellem subjektet (en kampagne) og verballedet (lyder). Den er indledt af når og fungerer som adverbial (tid/betingelse) i hovedsætningen. Er den ofte det er hovedsætningen: ikke kan sættes efter verballedet (er den ikke ofte det).",
  },
  eksamenTip:
    "Husk forskellen på opinions- og informationsgenrer: Peg på jeg-mener-formuleringer og modargumenterne, når du argumenterer for opinionsartiklen, og nævn gerne kategorien (kronik, debatindlæg, læserbrev).",
};

const TEKST_BOLIG: HhxExamText = {
  id: "ejendomsannonce-villa",
  genre: "Ejendomsannonce",
  genreOptions: ["Informerende artikel", "Ejendomsannonce", "Politisk tale", "Opinionsartikel", "Reklame"],
  correctGenreIndex: 1,
  genreExplanation:
    "En ejendomsannonce er en salgstekst: Den skal skabe interesse for en bolig ved at fremhæve muligheder og styrker og nedtone svagheder. Det ses i de positive konnotationer (charmerende, unik) og i eufemismerne: autentiske detaljer (ikke renoveret), overkommelig have (lille have) og udleveringsklar (der venter arbejde).",
  begrundKeywords: [
    "sælge", "salg", "interesse", "fremvisning", "køb", "skabe", "lokke", "annonce", "eufemisme", "konnotation",
    "positiv", "nedton", "styrker", "svagheder", "bolig", "mægler", "overbevis", "oplys", "tale", "fakta", "neutral",
  ],
  title: "Autentisk villa med sjæl venter på nye ejere",
  subtitle: "Udleveringsklar charmerende ejendom midt i byen",
  source: "Boligavisen, annonce, fredag",
  paragraphs: [
    "Denne charmerende ejendom byder på autentiske detaljer, et hav af personlighed og en overkommelig have med sol fra tidlig morgen til sen aften.",
    "Beliggenheden er unik, for huset ligger i hjertet af byen med kort afstand til skole, indkøb og tog. Udsigten over gaden er levende, og nærheden til byens liv gør hverdagen enkel.",
    "Villaen har ligget i samme familie i tre generationer. Derfor er boligen udleveringsklar og venter blot på nye, visionære ejere med mod på at tilføre huset deres eget præg.",
    "Køberne får en ejendom med historie og potentiale. Hvis du drømmer om et hjem med sjæl, skal du se villaen nu. Ring i dag, og lad os aftale en fremvisning. Månedens sagtenservenlige finansiering er allerede aftalt med banken.",
  ],
  pentagram: {
    afsender: {
      keywords: ["mægl", "ejendomsmægler", "sælger", "ejer", "boligkontor", "annonce", "bank", "avis", "sælgeren"],
      model: "En ejendomsmægler (eller sælger) bag en boligannonce i avisen, som har interesse i at sælge huset hurtigt og dyrt.",
    },
    emne: {
      keywords: ["bolig", "villa", "ejendom", "hus", "salg", "fremvisning", "hjem"],
      model: "Salget af en villa: beliggenhed, have, historie og fremvisning.",
    },
    modtager: {
      keywords: ["køber", "købere", "boligsøgende", "familie", "køberne", "køb", "drømmer", "hjem"],
      model: "Boligkøbere, især folk, der drømmer om et hus med karakter (annoncefesten taler direkte til dig, der drømmer).",
    },
    situation: {
      keywords: ["avis", "annonce", "boligavis", "boligside", "boligsiden", "trykt", "online", "fredag", "marked", "portal"],
      model: "Annonce i en boligavis (fredag) eller på en boligportal: hård konkurrence om købernes opmærksomhed.",
    },
    sprog: {
      keywords: ["annonce", "positiv", "konnotation", "eufemisme", "adjektiv", "imperativ", "bydeform", "ring", "salgssprog", "fremhæv", "nedton"],
      model: "Annoncesprog: mange positive adjektiver (charmerende, autentisk, unik), eufemismer, der nedtoner ulemper, og en direkte opfordring (Ring i dag).",
    },
    formaal: {
      keywords: ["sælge", "salg", "interesse", "fremvisning", "køb", "skabe", "lokke", "tilskuer", "ring"],
      model: "At sælge boligen: skabe interesse, tone ulemperne ned og få interesserede til at ringe til en fremvisning.",
    },
  },
  saertraek: {
    kategorier: [
      {
        label: "Ordklasser og ordvalg",
        keywords: ["adjektiv", "tillægsord", "substantiv", "navneord", "verber", "udsagnsord", "imperativ", "bydeform", "superlativ", "charmerende", "unik"],
      },
      {
        label: "Semantiske felter",
        keywords: ["semantisk", "ordfelt", "bolig", "hus", "ejendom", "køb", "salg", "beliggenhed", "boligmarked", "fremvisning"],
      },
      {
        label: "Konkrete og abstrakte ord",
        keywords: ["konkret", "abstrakt", "have", "gade", "skole", "tog", "sjæl", "potentiale", "historie", "personlighed", "drøm"],
      },
      {
        label: "Konnotationer og eufemismer",
        keywords: ["konnotation", "eufemisme", "positiv", "negativ", "nedton", "forskønn", "autentisk", "overkommelig", "udleveringsklar", "potentiale"],
      },
      {
        label: "Sætningskonstruktion (paratakse/hypotakse)",
        keywords: ["paratakse", "sideordn", "hypotakse", "underordn", "korte sætninger", "stikord", "imperativ", "bydeform", "omvendt ordstilling", "forvægt", "bagvægt"],
      },
      {
        label: "Retoriske greb",
        keywords: ["retorisk", "opfordring", "appeller", "imperativ", "bydeform", "ring", "direkte", "udrop", "udråb", "du"],
      },
    ],
    model:
      "Annoncen er fuld af positive adjektiver (charmerende, autentiske, overkommelig, unik) og ord fra semantisk feltet om boliger og byliv (ejendom, beliggenhed, fremvisning, indkøb). Eufemismerne er genrens varemærke: autentiske detaljer betyder nok, at huset er gammelt og ikke renoveret, overkommelig have betyder en lille have, og udleveringsklar antyder, at der venter arbejde. Konkrete ord (have, tog, skole, gade) gør boligen håndgribelig, mens abstrakte ord (sjæl, potentiale, historie, personlighed) sælger drømmen. Imperativen Ring i dag er en direkte opfordring, og de korte, sideordnede sætninger giver et hurtigt annoncetempo. Paratakse og hypotakse veksler: ledsætningen Hvis du drømmer... er hypotaktisk og henvender sig direkte til læserens drømme.",
  },
  morfologi: [
    {
      word: "beliggenheden",
      solution: ["be", "ligg", "en", "hed", "en"],
      altSolutions: [["be", "lig", "en", "hed", "en"]],
      fleksiv: "-en",
      note: "be- (præfiks), ligg (rodmorfem), -en (suffiks), -hed (suffiks der laver substantiv), -en (fleksiv: bestemt ental).",
    },
    {
      word: "nærheden",
      solution: ["nær", "hed", "en"],
      fleksiv: "-en",
      note: "nær (rodmorfem), -hed (suffiks der laver substantiv), -en (fleksiv: bestemt ental).",
    },
    {
      word: "køberne",
      solution: ["køb", "er", "ne"],
      fleksiv: "-ne",
      note: "køb (rodmorfem), -er (suffiks: en der køber), -ne (fleksiv: bestemt flertal).",
    },
    {
      word: "fremvisning",
      solution: ["frem", "vis", "ning"],
      note: "frem (rodmorfem), vis (rodmorfem), -ning (suffiks der laver substantiv). Ordet står i ubestemt form og har ingen bøjningsendelse her.",
    },
  ],
  analyse: {
    sentence: "Udsigten over gaden er levende.",
    chunks: ["Udsigten over gaden", "er", "levende."],
    correctMap: ["subjekt", "verbal", "subjpred"],
    forklaring:
      "Verballedet er er (et kopulaverbum). Subjektet er Udsigten over gaden (hvad er levende?). Levende siger noget om subjektet og er derfor subjektsprædikat (omsagnsled til grundled), ikke genstandsled: Der kan ikke både være et genstandsled og et subjektsprædikat i samme sætning.",
  },
  tider: [
    {
      sentence: "Villaen har ligget i samme familie i tre generationer.",
      verb: "har ligget",
      tid: "perfektum",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Villaen lå i samme familie i tre generationer.",
      omskrivGodkendte: ["lå"],
    },
    {
      sentence: "Nærheden til byens liv gør hverdagen enkel.",
      verb: "gør",
      tid: "praesens",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Nærheden til byens liv gjorde hverdagen enkel.",
      omskrivGodkendte: ["gjorde"],
    },
  ],
  hsls: {
    sentence: "Hvis du drømmer om et hjem med sjæl, skal du se villaen nu.",
    chunks: ["Hvis du drømmer om et hjem med sjæl,", "skal du se villaen nu."],
    correctMap: ["ls", "hs"],
    indlederGodkendte: ["hvis"],
    funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"],
    funktionCorrect: 2,
    forklaring:
      "Hvis du drømmer om et hjem med sjæl er en ledsætning: ikke-reglen giver ikke mellem subjektet (du) og verballedet (drømmer). Den er indledt af konjunktionen hvis og fungerer som adverbial (betingelse) i hovedsætningen. Skal du se villaen nu er hovedsætningen: ikke kan sættes efter verballedet (skal du ikke se...).",
  },
  eksamenTip:
    "Forklar gerne eufemismerne med deres rigtige betydning (autentisk = ikke renoveret). Det viser censor, at du kan skelne mellem det sagte og det menede.",
};

const TEKST_ARTIKEL: HhxExamText = {
  id: "artikel-mobilbetaling",
  genre: "Informerende artikel",
  genreOptions: ["Reklame", "Informerende artikel", "Ejendomsannonce", "Politisk tale", "Opinionsartikel"],
  correctGenreIndex: 1,
  genreExplanation:
    "En informerende (ekpositorisk) artikel skal oplyse neutralt og objektivt. Den er bygget op med rubrik, underrubrik og brødtekst, bygger på fakta og tal (38 procent, 51 procent) og citater fra eksperter, undgår subjektivt sprog og har ingen jeg-form eller holdning.",
  begrundKeywords: [
    "oplys", "informere", "neutral", "objektiv", "fakta", "tal", "citater", "citat", "forsker", "ekspert",
    "rubrik", "underrubrik", "brødtekst", "partisk", "holdning", "sælge", "annonce", "tale", "overbevis",
  ],
  title: "Flere unge betaler med telefonen",
  subtitle: "Kontanterne forsvinder: Nu betaler hver anden ung med mobilen",
  source: "Helsingør Dagblad, 14. februar. Af Nina Frost",
  paragraphs: [
    "Antallet af unge, der betaler med mobiltelefonen, er steget kraftigt de seneste tre år. Det viser nye tal fra Kortbetaling Danmark. I 2023 betalte 38 procent af de 15 til 19-årige med telefonen. I dag er tallet 51 procent.",
    "Kunderne køber flere varer med telefonen. Det fortæller forsker Mads Lind fra Handelshøjskolen: Når man bare skal løfte telefonen, tænker man mindre over beløbet. Betalingen bliver usynlig.",
    "Butikkerne oplever også en ændring. Flere steder er kontanterne allerede ude af kassen, og personalet bruger mindre tid på at give byttepenge.",
    "Fordi betalingen bliver usynlig, tænker nogle unge mindre over beløbet. Samtidig advarer økonomer om, at hurtige betalinger kan gøre det sværere at holde styr på forbruget. De anbefaler, at unge følger med i deres kontooversigt hver uge.",
  ],
  pentagram: {
    afsender: {
      keywords: ["journalist", "nina", "frost", "avis", "redaktion", "dagblad", "artikel", "forfatter", "avisen"],
      model: "Journalisten Nina Frost skriver for en avis. Afsenderen optræder neutral og kommer ikke med egne holdninger.",
    },
    emne: {
      keywords: ["mobilbetaling", "betal", "telefon", "kontant", "unge", "forbrug", "handl", "mobil"],
      model: "Unges mobilbetalinger: tallene stiger, og det ændrer handlen i butikkerne.",
    },
    modtager: {
      keywords: ["læser", "alle", "borger", "offentlighed", "unge", "forældre", "handlende", "generel", "avislæser"],
      model: "Avisens brede læserkreds: både unge, forældre og butiksejere. Sproget er for alle, ikke specialiseret.",
    },
    situation: {
      keywords: ["avis", "dagblad", "netavis", "februar", "artikel", "nyhed", "trykt", "online", "papir", "dagsaktuelt"],
      model: "Nyhedsartikel i en dagblad (februar): offentlig, skriftlig og dagsaktuel.",
    },
    sprog: {
      keywords: ["neutral", "fakta", "tal", "citater", "citat", "objektiv", "informerende", "saglig", "nøgtern", "procent"],
      model: "Sagligt, neutralt sprog med fakta, procenttal og citater fra forskere og eksperter. Der er ingen jeg-form og ingen holdningsord.",
    },
    formaal: {
      keywords: ["informere", "oplyse", "forklare", "belyse", "nøgternt", "videregive", "oplysende"],
      model: "At informere og oplyse læserne om udviklingen i mobilbetalinger, neutralt og objektivt.",
    },
  },
  saertraek: {
    kategorier: [
      {
        label: "Ordklasser og ordvalg",
        keywords: ["substantiv", "navneord", "verber", "udsagnsord", "tal", "adjektiv", "tillægsord", "pronomen", "man"],
      },
      {
        label: "Semantiske felter",
        keywords: ["semantisk", "ordfelt", "betal", "penge", "handl", "økonomi", "kasse", "køb", "beløb", "kasse", "konto"],
      },
      {
        label: "Konkrete og abstrakte ord",
        keywords: ["konkret", "abstrakt", "tal", "procent", "telefon", "kasse", "beløb", "forbrug", "oversigt", "varer"],
      },
      {
        label: "Konnotationer",
        keywords: ["konnotation", "neutral", "positiv", "negativ", "nøgtern", "saglig", "ladede", "advarer"],
      },
      {
        label: "Sætningskonstruktion (paratakse/hypotakse)",
        keywords: ["hypotakse", "underordn", "ledsætning", "at-sætning", "citater", "citat", "direkte tale", "kompleks", "paratakse", "forvægt", "bagvægt"],
      },
      {
        label: "Retoriske greb og kilder",
        keywords: ["citater", "citat", "ekspert", "kilde", "forsker", "økonomer", "troværdig", "retorisk"],
      },
    ],
    model:
      "Artiklen bruger mange substantiver fra semantisk feltet om penge og handel (betaling, beløb, kasse, byttepenge, kontooversigt) og præcise tal (38 procent, 51 procent). Toneordene er få og nøgterne: kraftigt og advarer har en let negativ ladning, men det dominerende er det neutrale, saglige ordvalg uden jeg-form. De konkrete ord (telefon, kasse, varer) gør stoffet håndgribeligt. Syntaktisk er teksten hypotaktisk: ledsætninger (...der betaler med mobiltelefonen...) og gengivelser af eksperter gør sætningerne komplekse og troværdige. Som informerende genre undgår den appellerende virkemidler: Troværdigheden kommer fra kilder (forskeren, økonomerne) frem for følelser.",
  },
  morfologi: [
    {
      word: "betalingen",
      solution: ["betal", "ing", "en"],
      fleksiv: "-en",
      note: "betal (rodmorfem), -ing (suffiks der laver substantiv), -en (fleksiv: bestemt ental).",
    },
    {
      word: "kunderne",
      solution: ["kund", "er", "ne"],
      fleksiv: "-ne",
      note: "kund (rodmorfem), -er (suffiks: en der er kunde), -ne (fleksiv: bestemt flertal).",
    },
    {
      word: "mobiltelefonen",
      solution: ["mobil", "telefon", "en"],
      fleksiv: "-en",
      note: "mobil (rodmorfem), telefon (rodmorfem) i et sammensat ord uden bindebogstav, -en (fleksiv: bestemt ental).",
    },
    {
      word: "kontooversigt",
      solution: ["konto", "over", "sigt"],
      altSolutions: [["konto", "oversigt"]],
      note: "konto, over og sigt er tre rodmorfemer i et sammensat ord (over kan også opfattes som bindeled). Ordet står i ubestemt form og har ingen bøjningsendelse her.",
    },
  ],
  analyse: {
    sentence: "Kunderne køber flere varer med telefonen.",
    chunks: ["Kunderne", "køber", "flere varer", "med telefonen."],
    correctMap: ["subjekt", "verbal", "objekt", "adverbial"],
    forklaring:
      "Verballedet er køber. Subjektet er Kunderne (hvem køber?). Flere varer er genstandsled (hvad køber de?). Med telefonen er adverbial (hvordan/hvormed?).",
  },
  tider: [
    {
      sentence: "Antallet af unge, der betaler med mobiltelefonen, er steget kraftigt de seneste tre år.",
      verb: "er steget",
      tid: "perfektum",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Antallet af unge, der betaler med mobiltelefonen, steg kraftigt de seneste tre år.",
      omskrivGodkendte: ["steg"],
    },
    {
      sentence: "Butikkerne oplever også en ændring.",
      verb: "oplever",
      tid: "praesens",
      omskrivTil: "perfektum",
      omskrivningEksempel: "Butikkerne har også oplevet en ændring.",
      omskrivGodkendte: ["har oplevet"],
    },
  ],
  hsls: {
    sentence: "Fordi betalingen bliver usynlig, tænker nogle unge mindre over beløbet.",
    chunks: ["Fordi betalingen bliver usynlig,", "tænker nogle unge mindre over beløbet."],
    correctMap: ["ls", "hs"],
    indlederGodkendte: ["fordi"],
    funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"],
    funktionCorrect: 2,
    forklaring:
      "Fordi betalingen bliver usynlig er en ledsætning: ikke-reglen giver ikke mellem subjektet (betalingen) og verballedet (bliver). Den er indledt af konjunktionen fordi og fungerer som adverbial (årsag) i hovedsætningen. Tænker nogle unge mindre over beløbet er hovedsætningen: ikke kan sættes efter verballedet (tænker nogle unge ikke...).",
  },
  eksamenTip:
    "Nævn strukturen (rubrik, underrubrik, brødtekst) og citaterne som genretræk, hvis teksten er informerende. Kilder og tal er informasjonsgenrens svar på følelser.",
};

const TEKST_REKLAME: HhxExamText = {
  id: "reklame-flowbedre",
  genre: "Reklame",
  genreOptions: ["Politisk tale", "Opinionsartikel", "Reklame", "Informerende artikel", "Ejendomsannonce"],
  correctGenreIndex: 2,
  genreExplanation:
    "En reklame skal sælge eller overbevise om et budskab. Den bruger kreative virkemidler (imperativer, humor, korte sætninger), tal, der leger med troværdighed (ni ud af ti), og den har en skjult hensigt: Teksten ligner en venlig rådgivning, men alt peger mod at få læseren til at downloade (og senere betale for) appen.",
  begrundKeywords: [
    "sælge", "salg", "produkt", "reklame", "kunde", "download", "imperativ", "bydeform", "humor", "skjult hensigt",
    "overbevis", "oplys", "neutral", "fakta", "annonce", "tale", "opinion", "holdning",
  ],
  title: "FlowBedre",
  subtitle: "Appen der giver dig tiden tilbage",
  source: "Reklame, UngTech Magasin, september",
  paragraphs: [
    "Skolen kalder. Vennerne skriver. Telefonen buzzer. Og du? Du sidder stadig med lektierne.",
    "FlowBedre giver dig fokus i hverdagen. Tryk på knappen, og appen lukker alt støj ude i 25 minutter. Over 10.000 unge har allerede downloadet appen, og ni ud af ti siger, at de får mere lavet.",
    "Prøv FlowBedre gratis i 30 dage. Appen vil spare dig for timer, du aldrig får tilbage. Når du henter appen nu, får du den første måned gratis. Hent den nu, før lektiekrigen starter.",
  ],
  pentagram: {
    afsender: {
      keywords: ["virksomhed", "firma", "flowbedre", "udvikler", "sælger", "reklame", "marketing", "brand", "appfirma"],
      model: "Virksomheden bag FlowBedre (marketingafdelingen). Afsenderen vil sælge, men kamuflerer sig som en venlig hjælper.",
    },
    emne: {
      keywords: ["app", "flowbedre", "fokus", "produkt", "lektier", "distraktion", "telefon", "tid"],
      model: "Produktet FlowBedre: en app, der skal give fokus og fjerne distraktioner fra skolehverdagen.",
    },
    modtager: {
      keywords: ["unge", "elev", "stud", "skole", "forældre", "dig", "du", "studenter"],
      model: "Unge i skolealderen (og deres forældre): teksten taler direkte til dig med eksempler fra lektielivet.",
    },
    situation: {
      keywords: ["magasin", "avis", "some", "sociale medier", "instagram", "reklame", "september", "trykt", "online", "video", "annonce"],
      model: "Betalt reklame i UngTech Magasin (september) eller online: hård konkurrence om opmærksomheden.",
    },
    sprog: {
      keywords: ["imperativ", "bydeform", "korte sætninger", "positiv", "humor", "du", "direkte", "energisk", "udrop", "udråb", "metafor"],
      model: "Energisk reklamesprog: imperativer (Prøv, Hent den nu), korte parataktiske sætninger, direkte du-tiltale og humoristisk overdrev (lektiekrigen).",
    },
    formaal: {
      keywords: ["sælge", "salg", "download", "køb", "tilmeld", "kunde", "profit", "fortjeneste", "lopside", "abonnement"],
      model: "At sælge appen: få læseren til at downloade den (og senere betale for den).",
    },
  },
  saertraek: {
    kategorier: [
      {
        label: "Ordklasser og ordvalg",
        keywords: ["verber", "udsagnsord", "imperativ", "bydeform", "adjektiv", "tillægsord", "interjektion", "udråbsord", "pronomen", "du", "gratis"],
      },
      {
        label: "Semantiske felter",
        keywords: ["semantisk", "ordfelt", "skole", "lektier", "fokus", "tid", "teknologi", "app", "telefon"],
      },
      {
        label: "Konkrete og abstrakte ord",
        keywords: ["konkret", "abstrakt", "knappen", "minutter", "timer", "fokus", "støj", "krig", "lektier"],
      },
      {
        label: "Konnotationer",
        keywords: ["konnotation", "positiv", "negativ", "metafor", "krig", "støj", "humor", "ironi", "overdriv"],
      },
      {
        label: "Sætningskonstruktion (paratakse/hypotakse)",
        keywords: ["paratakse", "sideordn", "korte sætninger", "imperativ", "bydeform", "omvendt ordstilling", "forvægt", "bagvægt", "stikord", "hypotakse"],
      },
      {
        label: "Retoriske greb",
        keywords: ["retorisk spørgsmål", "retoriske spørgsmål", "appeller", "patos", "logos", "etos", "repetition", "gentag", "anafor", "tre", "trinvis", "opfordring"],
      },
    ],
    model:
      "Reklamen bombarderer med verber i imperativ (Tryk, Prøv, Hent den nu), og de korte, sideordnede sætninger (Skolen kalder. Vennerne skriver.) giver et hurtigt parataktisk tempo. Semantisk feltet om skole, tid og teknologi (lektier, minutter, timer, app) rammer målgruppen. Lektiekrigen og støj er metaforer med humoristisk negativ konnotation, mens appen altid beskrives positivt (giver dig fokus). Og du? Du sidder stadig med lektierne er et retorisk greb, der peger direkte på læseren, og tallene (ni ud af ti, over 10.000) leger med logos for at virke troværdige. Genren afsløres af formålet: Alt peger mod download-knappen.",
  },
  morfologi: [
    {
      word: "downloadet",
      solution: ["down", "load", "et"],
      note: "down og load er to rodmorfemer (lånord), -et (fleksiv: perfektum participium, fx har downloadet).",
    },
    {
      word: "lektiekrigen",
      solution: ["lektie", "krig", "en"],
      fleksiv: "-en",
      note: "lektie (rodmorfem), krig (rodmorfem) i et sammensat ord uden bindebogstav, -en (fleksiv: bestemt ental).",
    },
    {
      word: "timer",
      solution: ["time", "r"],
      fleksiv: "-r",
      note: "time (rodmorfem), -r (fleksiv: flertal).",
    },
  ],
  analyse: {
    sentence: "FlowBedre giver dig fokus i hverdagen.",
    chunks: ["FlowBedre", "giver", "dig", "fokus", "i hverdagen."],
    correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
    forklaring:
      "Verballedet er giver. Subjektet er FlowBedre (hvem giver?). Dig er hensynsled (til hvem?), og det kræver, at der også er et genstandsled: fokus (hvad giver appen?). I hverdagen er adverbial (hvornår?).",
  },
  tider: [
    {
      sentence: "Over 10.000 unge har allerede downloadet appen.",
      verb: "har downloadet",
      tid: "perfektum",
      omskrivTil: "praeteritum",
      omskrivningEksempel: "Over 10.000 unge downloadede allerede appen.",
      omskrivGodkendte: ["downloadede"],
    },
    {
      sentence: "Appen vil spare dig for timer, du aldrig får tilbage.",
      verb: "vil spare",
      tid: "futurum",
      omskrivTil: "praesens",
      omskrivningEksempel: "Appen sparer dig for timer, du aldrig får tilbage.",
      omskrivGodkendte: ["sparer"],
    },
  ],
  hsls: {
    sentence: "Når du henter appen nu, får du den første måned gratis.",
    chunks: ["Når du henter appen nu,", "får du den første måned gratis."],
    correctMap: ["ls", "hs"],
    indlederGodkendte: ["når"],
    funktionOptions: ["Subjekt", "Objekt", "Adverbial", "Subjektsprædikat", "Attribut"],
    funktionCorrect: 2,
    forklaring:
      "Når du henter appen nu er en ledsætning: ikke-reglen giver ikke mellem subjektet (du) og verballedet (henter). Den er indledt af når og fungerer som adverbial (tid) i hovedsætningen. Får du den første måned gratis er hovedsætningen med omvendt ordstilling: ikke kan sættes efter verballedet (får du ikke...).",
  },
  eksamenTip:
    "Sig gerne, at reklamen ofte blander genrer (den ligner en venlig rådgivning eller en nyhedsartikel). At spotte en genrehybrid er en stærk observation til eksamen.",
};

// Alle trækbare tekster. pickExamText() vælger en tilfældig, som om der blev
// trukket en ukendt tekst i forberedelseslokalet.
export const EXAM_TEXTS: HhxExamText[] = [TEKST_TALE, TEKST_OPINION, TEKST_BOLIG, TEKST_ARTIKEL, TEKST_REKLAME];

export function pickExamText(): HhxExamText {
  return EXAM_TEXTS[Math.floor(Math.random() * EXAM_TEXTS.length)];
}

// Eksamensforberedelsestiden: 40 minutter (jf. eksamensguiden).
export const EXAM_SECONDS = 40 * 60;
