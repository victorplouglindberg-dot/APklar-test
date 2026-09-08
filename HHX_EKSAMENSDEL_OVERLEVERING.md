# Overlevering: HHX-eksamensdel i "Prøve" (AP-eksamensprøve)

**Formål:** Denne MD beskriver den nye HHX-eksamensdel, så den let kan overføres
til det rigtige AP Klar-repository (dette repo er en test-kopi).

**Dato:** 8. september 2026 · **Branch:** arena/01a08288-apklar-test

---

## 1. Hvad er der blevet bygget?

En eksamenssimulation af **den interne AP-prøve på HHX** (jf. eksamensguiden
"Du trækker en ukendt tekst med 7 opgaver, 40 minutter forberedelse, mundtlig
eksamen på 12-15 min, karakter på 7-trins-skalaen").

Flowet i appen:

1. **Prøve-fanen** (HHX): Nyt, markant kort "Tag eksamensprøve" øverst på
   prøveoversigten. De korte almindelige prøver ligger stadig under det.
2. **Intro-side:** Informationstekst om eksamen og dens forløb (ukendt tekst,
   7 opgaver, 40 min., noter/bøger/ordbog, mundtlig del med censor,
   7-trins-skalaen). Knap: "Træk min tekst og start (40 min)".
3. **Forberedelsen (prøven):**
   - **Timer på 40 minutter** (sticky i toppen, gule farver under 5 min, røde
     under 1 min).
   - **En opdigtet tekst øverst på siden** (trækkes tilfældigt mellem 5 tekster,
     der dækker de 5 eksamensgenrer: politisk tale, ejendomsannonce,
     opinionsartikel, informerende artikel og reklame).
   - **Markeringværktøjer under/omkring teksten:** man kan markere ord og
     sætninger i teksten med (a) tusch i 3 farver, (b) de 7 sætningsled-symboler
     (LedGlyph, samme som de andre analyseopgaver) og (c) ordklasse-bekræftelse
     (de 8 ordklasser). Der er også viskelæder. Virker med musemarkering og
     langt tryk på mobil (seneste markering gemmes via selectionchange).
   - **De 7 opgaver** under teksten, hver med besvarelsesfelter og en lille
     "?":-knap med et hint om, hvad man skal gøre (bygger på eksamensguiden):
     1. Genretræk (valg af genre + begrundelse)
     2. Kommunikationssituation (Ciceros pentagram: afsender, emne, modtager,
        situation, genre/sprog + formål i midten)
     3. Sproglige særtræk (stort tekstfelt)
     4. Morfologisk analyse (ord deles i morfemer med bindestreger + fleksiv)
     5. Syntaktisk analyse (sætningsanalyse med chunk-markering og de 7 symboler,
        som i de eksisterende AnalysisTask-opgaver)
     6. Verballedets tid (vælg tid + omskriv sætningen)
     7. Hoved- og ledsætninger (chunk-markering HS/LS + indleder + funktion)
   - **Kopieringsknap lige før indsendelse:** "Vil du gemme din prøve? Kopier
     din besvarelse til tekst her! Husk at indsætte det i et dokument" (kopierer
     hele besvarelsen + markeringerne som ren tekst, med fallback-dialog).
   - **Indsend:** bekræftelsesdialog med antal besvarede felter.
   - **Klokken ringer** (Web Audio-klokkespil + modal), når de 40 minutter er
     gået: "Aflevér din opgave med det samme".
4. **Bedømmelsen (resultat):**
   - **Til at starte med:** en tekst, der forklarer, at prøven kun er lavet til
     forberedelse, at karakteren i nogle omfang kan være ligegyldig, men at den
     kan vise det faglige niveau, hvis den bruges rigtigt. Der nævnes også, at
     opgave 2 og 3 er meget individuelle med mange korrekte svar.
   - **Vejledende karakter på 7-trins-skalaen** (12/10/7/4/02/00/-3) med blide
     grænser (84/71/57/43/29/16 %) og en opmuntrende beskrivelse.
   - **Gennemgang af hvert spørgsmål:** hvad var rigtigt (grønne punkter), hvad
     kan skærpes (gul boks), modelbesvarelse og et "Til selve eksamen"-tip.
   - Knapper: "Ny eksamensprøve (træk ny tekst)" og "Tilbage til prøveoversigten".

## 2. Nye filer

| Fil | Indhold |
|---|---|
| `src/data/hhxExam.ts` | 5 opdigtede eksamenstekster (én pr. genre) med fuld facitliste: genre + begrundelse, pentagram-modeller med nøgleord, særtræks-kategorier med nøgleord, morfologi-ord (rodmorfemer, præfiks, suffiks, fleksiv, bindebogstav), sætningsanalyse (chunks + LedSymbol-facit), verbtider med godkendte omskrivninger, hoved-/ledsætnings-sætning med indleder og funktion. Plus: `EXAM_SECONDS` (40 min), ordklasse-/tusch-/led-paletter til markeringerne og `pickExamText()`. |
| `src/lib/hhxExamGrading.ts` | Bedømmelsesmotoren: normaliserer svar, matcher nøgleord/morfemer/symboler/tider og giver point pr. opgave, karakter på 7-trins-skalaen og den fulde feedback-tekst (fundet/mangler/model/tip). **Skal der senere bruges en ægte AI**, skal kun `gradeHhxExam()` udskiftes, resten af skærmen bruger typen `HhxExamBedoemmelse`. |
| `src/screens/HhxExam.tsx` | Hele eksamensskærmen: intro, forberedelse (timer, tekst med markeringer, 7 opgaver, kopiering, klokke) og resultat (karakter + gennemgang). Genbruger appens mønstre: Mascot, LedGlyph, EDU_THEMES via `getEducation`, useId-fri 16px-felter, samme pop-over-positionering som AnalysisTask i TaskRenderer. |
| `HHX_EKSAMENSDEL_OVERLEVERING.md` | Denne fil. |

## 3. Ændrede filer

| Fil | Ændring |
|---|---|
| `src/screens/Exam.tsx` | 3 små tilføjelser: (1) import af `HhxExamPage`, (2) state `hhxExamOpen` + tidlig return, der viser eksamensskærmen (kun når `isHhx`), (3) kortet "Tag eksamensprøve" i setup-fasen, kun renderet når `isHhx`. Al eksisterende kode er urørt. |

**STX er ikke berørt:** Kortet og skærmen vises kun, når `education === "hhx"`
(STX har andre eksamener). Ingen af filerne bruges af STX-sporet.

## 4. Sådan overføres til det rigtige repo

1. Kopiér `src/data/hhxExam.ts`, `src/lib/hhxExamGrading.ts`,
   `src/screens/HhxExam.tsx` og denne MD-fil.
2. Lav de 3 tilføjelser i `src/screens/Exam.tsx` (se afsnit 3).
3. Kør `npm run typecheck && npm run build`.
4. Test-flow: vælg HHX → Prøve → "Tag eksamensprøve" → intro → forberedelse
   (timer, markeringer, 7 opgaver) → indsend → vejledende karakter + gennemgang.
   Skift til STX under Profil: kortet må ikke være der.

## 5. Designregler fra AI_OVERLEVERING.md er fulgt

- Ingen em dashes i `src/` (tjekket med grep).
- Alle Tailwind-klasser er statiske fulde navne (JIT-venligt, dark mode via de
  globale `.dark`-overrides på bg-white/bg-ink osv.).
- Tekstfelter er 16 px (ingen mobil-zoom).
- HHX-farveprofil bruges via `getEducation("hhx")` (blå), ikke hardcoded rød.
- Maskotten hedder Lingua og giver varm, blid feedback.
- Eksisterende kode er ikke forkortet/ændret undtagen de 3 tilføjelser i Exam.tsx.

## 6. Kendte begrænsninger (til videre udvikling)

- **Bedømmelsen er regelbaseret** (nøgleord + facitlister), ikke en ægte AI.
  Den er bevidst blid (0,25-0,75 point for delvis korrekt) og mærker sig selv
  som vejledende. Et ægte AI-endpoint kan efterfølge `gradeHhxExam()`.
- **Opgave 2 og 3** er som sagt meget individuelle; bedømmelsen matcher på
  fagbegreber og kan ikke fange alle korrekte vinkler. Det står tydeligt på
  resultatsiden.
- Markeringer (tusch/symboler/ordklasser) gemmes ikke i localStorage; de følger
  prøven i hukommelsen og indgår i kopieringsteksten. Vil man gemme dem i
  progress, kan `markings` serialiseres i `ExamAttempt`.
- Timeren kører kun, mens man er på prøven; opdaterer man siden, nulstilles
  prøven (som en rigtig prøve, hvor man ikke kan pause).

*God fornøjelse med eksamensdelen!*

---

## 7. Sync 2026-09-08 — branch arena/01a08288 ajour med main (034c638)

Branchen er rebased til `main` efter merge af PR #1. Denne sektion dokumenterer at `arena/01a08288-apklar-test` nu er ajour (034c638) og klar til nyt PR til `main` med 3 opfølgende commits (09.09.2026). Ingen funktionel ændring — kun dokumentationsopdatering.
