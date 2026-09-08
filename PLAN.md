# AP Klar — Plan: STX + HHX i samme app

*Dato: 10. august 2026 — status: planlægningsfase, klar til godkendelse*

> **Sync 2026-09-08:** Branch `arena/01a08288-apklar-test` ajourført med `main` (034c638) og klar til PR med 3 commits — ingen funktionelle ændringer.

---

## 1. Vigtig afklaring først: HHX eller HTX?

**AP (Almen Sprogforståelse) findes kun på STX og HHX.** HTX har ikke AP — derfor giver
"HTX AP-pensum" kun mening, hvis der menes HHX (det merkantile gymnasium, hvor AP er en del
af grundforløbet sammen med ØG).

I din beskrivelse skriver du både "HHX eller STX elev" (starten) og "HTX" (senere), så jeg
går ud fra, at **det blå spor skal være HHX**. Det skal vi bare bekræfte, før vi bygger
(se spørgsmål til sidst).

**Farver:** STX = rød, HHX = blå (sådan bruger vi dem i hele appen).

---

## 2. Hvad er der i appen i dag (status)

- Next.js 16 + React 19 + Tailwind 4, deployet på Vercel (apklar.vercel.app).
- To "spor" i dag: **Almen** (dansk grammatik: ordklasser, sætningsled, morfologi, tempus,
  kasus, syntaks, sprog & kommunikation) og **Latin** (sum/esse, grammatik, ordforråd,
  oversættelse, kultur) — latin er STX-specifikt.
- Skærme: Hjem, Øv dig (kategori-forløb med undervisning først, progressive trin med
  låsning), Prøve (eksamen med spor og længde), Symboler (sætningsledssymboler),
  Lynkursus (opslagsværk), Din udvikling (statistik + standpunktskarakter), Profil
  (kaldenavn, indstillinger, nulstil).
- Progression, XP, streak og kaldenavn gemmes i **localStorage** — ingen login, ingen cookies.
- Maskot: "Lingua". Undervisnings-trin ("teach") forklarer ALT fra bunden, før man svares.

---

## 3. Koncept: velkomst-/valgskærm (det første man ser)

**Første besøg (onboarding, 3 korte skridt):**

1. **Velkomstskærm** i appens stemning: maskot, kort velkomsttekst ("Hvilken uddannelse går du på?") og to store valgkort:
   - **STX** — rød farveprofil (det almene gymnasium)
   - **HHX** — blå farveprofil (det merkantile gymnasium)
2. Når man trykker på et kort, **lyser det op** (glød + let skalering), og **"Vælg"-knappen bliver aktiv** nederst. Man kan skifte valg, indtil man trykker Vælg.
3. **Brugernavn-trin:** et enkelt felt ("Hvad skal vi kalde dig?") med maskotten — gemmes som kaldenavn (samme felt som i dag på Profil). *(Skal det være obligatorisk? Se spørgsmål.)*
4. Herefter sendes man ind i appen med det valgte spor — og valget **gemmes i localStorage**.

**Næste besøg:** appen springer valgskærmen over og starter direkte i det valgte spor.

**Skift senere:** under **Profil → Indstillinger** kommer "Skift uddannelse" (STX ⇄ HHX),
så man kan rette, hvis man valgte forkert. *(Skal XP/resultater beholdes eller nulstilles? Se spørgsmål.)*

**Design:** samme visuelle stemning som resten af appen (blød, venlig, maskot, afrundede
kort) — bare med de to uddannelsesfarver som accent. Der indføres også en lille
**farveprofil** i hele appen: rød accent på STX-siden, blå på HHX-siden (knapper, aktive
faner, topkort), så man altid kan se, hvilket spor man er i.

---

## 4. App Store / Google Play — hvad med "underlinks" (apklar.vercel.app/stx)?

Din bekymring er helt rigtig at have — og svaret gør det **nemmere**, ikke sværere:

- **Anbefaling: Én samlet app uden /stx- eller /hhx-URL'er.** Valget af uddannelse er
  **app-tilstand** (localStorage), ikke en sti i URL'en. Så er der ingen underlinks at
  forholde sig til.
- Når appen senere pakkes til App Store/Google Play (typisk med **Capacitor**, der
  indpakker web-appen i en native skål, eller som PWA), loader butiksappen kun
  hovedsiden — og al logik (inkl. valg af spor) kører som i dag. **Ingen ekstra
  serverkonfiguration.**
- Hvis vi en dag VIL have delbare links ("åbn HHX-delen"), bruger vi **hash-ruter**
  (`#/hhx`) i stedet for rigtige stier. Hash-ruter virker 100 % ens i browser og i
  app-boksen — kræver nul server-opsætning. Det kan vi lægge ind senere uden at ændre
  noget.
- Til butikkerne skal vi senere tilføje: **PWA-manifest + ikoner + splash-skærm** og
  (ved Capacitor) app-ikoner. Det er en selvstændig fase, der ikke påvirker arkitekturen.

**Konklusion:** vi bygger alting som én SPA (single-page app) med intern tilstand —
den eneste URL er apklar.vercel.app.

---

## 5. HHX-pensum (fra den officielle læreplan, Bilag 24, aug. 2017)

Gælder for 1.g i skoleåret 2026/27. *(Reformen fra feb. 2025 ændrer AP fra 2027/28 —
vi bygger på det nuværende pensum og holder data adskilt, så det er let at tilpasse senere.)*

**Faglige mål (forkortet):** eleven skal kunne
1. kommunikere hensigtsmæssigt i nationale/internationale, herunder **erhvervsmæssige**, sammenhænge
2. demonstrere viden om **verbale og non-verbale** kommunikationssituationer
3. anvende viden om **grammatik, semantik og pragmatik** i arbejdet med tekster på dansk og fremmedsprog
4. gennemføre **syntaktisk analyse** med faglig terminologi
5. kende karakteristiske træk ved sprog i **private, faglige og professionelle** sammenhænge
6. identificere forskelle/ligheder mellem dansk og fremmedsprog med **sproghistorisk** viden
7. anvende **strategier for sprogtilegnelse**
8. anvende elementær viden om **sproghandlinger og kommunikationsteori** (receptivt og produktivt)
9. demonstrere **genre- og mediebevidst** formidling
10. anvende faglige opslagsværker og hjælpemidler

**Kernestof:** sproglig praksis (tale/skrift) · sprogets udtryks- og indholdsside ·
elementær kommunikationsteori · verbal og non-verbal kommunikation · genrebevidst
formidling · sproghandlinger · sprog i private/faglige/professionelle sammenhænge ·
grammatisk terminologi og analysefærdighed · elementær sproghistorie · sprog og
nationalitet samt sprog i en globaliseret verden · opslagsværker · læringsstrategier.

**Den interne prøve** dækker: ordklasser og bøjningsformer, syntaktisk analyse, sprogets
udtryks- og indholdsside, sproglige iagttagelser, sproghandlinger, elementær
kommunikationsanalyse, elementær sproghistorie, genre- og mediebevidst formidling.

**Forskellen fra STX:** HHX har **ingen latin** — til gengæld vægtes **kommunikationsanalyse,
semantik, pragmatik, sproghandlinger, non-verbal kommunikation og erhvervsrelaterede
tekster** markant højere end på STX. Den fælles grammatik (ordklasser, sætningsled,
morfologi, tempus) er stort set den samme.

---

## 6. HHX-sporet i appen — indholdsforslag (progressivt, fra bunden til toppen)

Samme læringsfilosofi som i dag: **teach-trin først** (hvad er det? hvorfor? hvordan
kender jeg det?), så øvelser, der bliver sværere trin for trin, med låsning indtil bestået.

**Fælles grammatik (genbruges fra STX-siden):**
- Ordklasser · Sætningsled (syntaktisk analyse) · Morfologi · Tempus
- (evt. let kasus: genitiv + pronominer — HHX-relevant del af bøjning)

**Nye HHX-kategorier (skrives fra bunden):**
1. **Kommunikation & kommunikationsmodellen** — afsender, modtager, emne, situation,
   medie; det udvidede tekstbegreb; verbal vs. non-verbal kommunikation (kropssprog,
   mimik, gestik, stemmeføring, tegn, signaler).
2. **Sproghandlinger** — påstande, spørgsmål, opfordringer, løfter, råd; direkte og
   indirekte sproghandlinger; hvordan man genkender dem i en tekst.
3. **Semantik (betydning)** — udtryksside vs. indholdsside; synonymer, antonymer,
   homonymer, polysemi; metafor og ords betydning i kontekst; ordforråd og idiomatik.
4. **Pragmatik (sprog i brug)** — situation og kontekst; underforstået betydning;
   høflighed og tone; sprog i **private, faglige og professionelle** sammenhænge
   (fx forskellen på en SMS til en ven og en mail til en kunde).
5. **Genrer & medier** — genrebevidst og mediebevidst formidling; erhvervsrelaterede
   tekster: forretningsmail, reklame, pressemeddelelse, hjemmeside, SoMe-opslag,
   årsrapport; hvordan genre og medie styrer sproget.
6. **Sproghistorie & sprog i verden** — sprogfamilier (indoeuropæisk), ligheder/forskelle
   mellem dansk, engelsk og andre sprog; lånord; engelsk som globalt lingua franca;
   sprog, nationalitet og globalisering.
7. **Læringsstrategier** — små tips-trin om, hvordan man lærer fremmedsprog (ordkort,
   mønstergenkendelse, transfer mellem sprog) — pensum har det som selvstændigt punkt.

**Eksamen på HHX-sporet:** appens "Tag en prøve" får en **HHX-prøve**, der spejler
delprøve 1 (interaktiv multiple-choice over grammatik + sprogstof). Delprøve 2
(skriftlig tekstproduktion) kan senere få en øvelse, hvor man vurderer en teksts
afsender/modtager/situation i faste trin.

**STX-siden:** forbliver præcis som i dag (de opgaver, der er nu).

---

## 7. Teknisk gennemførelse (faser)

| Fase | Indhold |
|------|---------|
| **0** | Denne plan godkendes + afklarende spørgsmål besvares |
| **1** | **Data-model:** `education: "stx" \| "hhx"` i progress; localStorage-nøgler (`aploft.education`, onboarding-flag); migrering af eksisterende brugere → automatisk STX |
| **2** | **Velkomst-/valgskærm** (uddannelsesvalg + brugernavn) med glød-effekt og farver; routing i appen; "2. besøg springer over" |
| **3** | **HHX-kategorier:** nye datafiler med teach-trin + opgaver (kommunikation, sproghandlinger, semantik, pragmatik, genrer/medier, sproghistorie, læringsstrategier) + forløbs-stier; genbrug af fælles grammatik-kategorier |
| **4** | **Profil → Indstillinger:** "Skift uddannelse" (med bekræftelse) |
| **5** | **Tilpas hele appen til spor:** farveprofil (rød/blå), prøve-skærmens spor-muligheder afhænger af uddannelse, Lynkursus + Hjem + Symboler tilpasset |
| **6** | **Butiks-klar:** PWA-manifest, ikoner, splash (forberedelse til App Store/Google Play via Capacitor senere) |
| **7** | Test (typecheck, lint, byg), review af indhold, deploy til preview |

**Afgrænsning i denne omgang:** ingen backend/account-system; progress forbliver lokal
(som i dag). HHX-opgaverne skrives på dansk med engelske eksempler (som pensum lægger op
til), og vi laver ca. 10-15 opgaver pr. ny kategori i første udgave.

---

## 8. Beslutninger (bekræftet 10. august 2026)

1. **Det blå spor = HHX** (det merkantile gymnasium). Appen henvender sig til STX og HHX.
2. **Brugernavn er valgfrit** — man kan springe feltet over og komme direkte ind.
3. **Fælles grammatik genbruges med omtanke:** HHX-sporet får kun den grammatik, der
   faktisk står i HHX-læreplanen (ordklasser, bøjningsformer/morfologi, tempus,
   sætningsled/syntaktisk analyse, sætningstyper) — **ikke** kasus-masterclass eller
   latindelen, som er STX-stof. Alle HHX-specifikke emner (kommunikation, sproghandlinger,
   semantik, pragmatik, genrer & medier, sproghistorie, læringsstrategier) bygges op fra
   bunden med erhvervsrelaterede eksempler.
4. **Ved skift af uddannelse beholdes XP, streak og alle resultater** — kun indholdet
   (kategorier, prøver, lynkursus) skifter.

## 9. Status

- [x] Fase 0: plan + pensum + beslutninger
- [x] Fase 1: data-model (education + onboarding i progress, migrering af eksisterende brugere → STX)
- [x] Fase 2: velkomst-/valgskærm (uddannelsesvalg + valgfrit brugernavn, localStorage, spring over ved 2. besøg)
- [x] Fase 3: HHX-kategorier (7 nye emner + genbrugt fælles grammatik uden latin) med teach-trin og opgaver — 342 opgaver i HHX-banken
- [x] Fase 4: Profil → Indstillinger: "Skift uddannelse" (behold XP/resultater)
- [x] Fase 5: hele appen er uddannelsesbevidst (farveprofil rød/blå, prøver, lynkursus, hjem, udvikling, topbar-chip)
- [x] Fase 6: PWA-manifest (public/manifest.webmanifest) + app-ikoner (192/512/apple-touch/favicon) + og-image (1200×630). Splash-skærm genereres af browseren ud fra manifest + ikoner; Capacitor-splash kan lægges til, når/hvis appen pakkes.
- [ ] Fase 7: ekstern test af indhold med en HHX-elev/ven

**Testet:** typecheck ✅ · build ✅ · unikke opgave-ID'er ✅ · alle forløbs-stier bygger ✅ ·
dev-server kører og svarer ✅ · ingen commits lavet (du commit'er selv).

**Runde 2 (10. aug.):** "mindre predictive opgaver + sjæl + Spørg AI + nyt ikon"
- [x] **Svarmuligheder afbalanceret:** 128 opgaver med kraftig "længst = rigtigt"-skævhed (≥2,5×) er
      omskrevet med jævnbyrdige, plausible distraktorer (STX almen + latin + HHX). Kombineret med
      den eksisterende tilfældige rækkefølge er længde nu et dårligt gæt. (Analysen: 128 → 0 opgaver
      med ratio ≥ 2,5.)
- [x] **Em dashes ryddet op:** 356 stk. "—" i forklaringer/tekster erstattet med pænere tegnsætning.
- [x] **Lidt sjæl:** feedback efter svar er varmere ("Rigtigt! 🎉" / "Næsten! Sådan hænger det sammen:"),
      og nogle forklaringer er omskrevet i et roligere sprog.
- [x] **"Spørg AI"-knap på alle spørgsmål:** åbner chatgpt.com/?q=... med rammesættende dansk
      besked ("Jeg er en dansk gymnasieelev..."). Første gang en bekræftelsesdialog med
      "Vis ikke igen" (gemmes i localStorage).
- [x] **Nyt Symbols-ikon:** sætningsled-symbolerne (○ med ×, △, 〰) i stedet for det gamle.

**Runde 3 (10. aug.):** "HHX-udvidelse + længde-balance + animationer + zip"
- [x] **Længde-balance runde 2+3:** korrekte svar er nu kun længst i 33 % af tilfældene (var 62 %),
      og der er **0 opgaver** tilbage med ratio ≥ 2,0 (var 128). De rigtige svar er kortet ned, og
      nogle distraktorer er gjort længere end det rigtige svar, så længde aldrig er en sikker ledetråd.
- [x] **HHX udvidet med 56 nye opgaver** (kommunikation, sproghandlinger, semantik, pragmatik, genrer,
      sproghistorie, læringsstrategier) — alle skrevet afbalancerede fra starten.
- [x] **Velkomstanimation rettet:** kortene forsvinder ikke længere/blinker. I stedet en glidende
      spring-animation: valgt kort skalerer op med glød + ring, flueben popper ind, de andre kort
      dæmpes let, og "Vælg"-knappen glider op.
- [x] **Små loading-effekter:** "Lingua tænker…" med spinner, før svaret afsløres (~450 ms),
      bløde sideovergange mellem fanerne, og tryk-feedback (scale) på knapper.
- [x] **Zip-fil leveret:** `aploft-updated.zip` (uden .git/node_modules/.next).

**Runde 4 (10. aug.):** "responsiv topbar + oversættelsesark + startguide"
- [x] **Responsiv topbar:** STX/HHX-mærket ligger nu på sin egen række på små skærme (i stedet for
      at kollidere med streak/XP), og på større skærme sidder det pænt ved siden af logoet.
      Streak- og XP-teksterne forkortes (skjuler "dages streak"/"XP") på meget smalle skærme.
- [x] **Oversættelsesark kun når det er relevant:** arket vises nu kun ved latinske opgaver, hvor
      ordforråd/bøjning faktisk er en del af opgaven (oversættelse, grammatik, sum/esse, ordforråd).
      Knappen er en diskret, lille knap i opgavens flow i stedet for en stor fast knap nederst på
      skærmen - og den forsvinder, når man har svaret (man kan ikke "snyde" bagefter).
- [x] **Latin-opgaver i prøver får også arket:** da visningen nu styres af opgaven (ikke af skærmen),
      dukker arket op både i Øv dig og i Tag en prøve på alle relevante latinske opgaver.

**Runde 5 (10. aug.):** "fix af topbar + professionel spotlight-guide"
- [x] **Topbar rettet:** tilbage til den gamle struktur (logo + STX/HHX-mærke venstre, streak/XP/mørk
      højre) med ÉN badge. På smalle skærme "wrapper" mærket ned under logoet via flex-wrap i stedet
      for at kollidere med streak. Den ekstra STX/HHX-chip på Hjem-siden (hero-kortet) er fjernet, så
      mærket kun findes ét sted.
- [x] **Ny spotlight-guide (GuidedTour):** starter på Profil-siden (hvor nye brugere lander efter
      velkomstskærmen) og går derefter igennem alle dele af appen: Hjem → Øv dig → Prøve → Symboler
      → Lynkursus → Din udvikling → tilbage til Hjem. De to sidste trin fremhæver genvejsknapperne
      på forsiden (som tager en ind på siden), ikke selve siderne. Alt andet end det aktuelle element
      mørklægges med et spotlight-"hul", og Lingua forklarer kort i en taleboble. Kan springes over
      ("Spring over", luk-knap eller Escape). Gemmes i progress (guideDone) - vises kun for
      førstegangsbrugere og tager under et minut.
- [x] Den gamle OnboardingGuide-fil er slettet.

**Runde 6 (10. aug.):** "em-dash-oprydning + dark-mode-script + ikoner + PWA + zip"
- [x] **Em dashes helt væk fra src/:** 51 stk. "—" (UI-tekster, metadata og kommentarer) erstattet
      med kolon, komma, punktum eller parentes. `grep -rn "—" src/` giver nu 0.
- [x] **Dark-mode-init via next/script:** layout.tsx bruger nu `<Script strategy="beforeInteractive">`
      i stedet for et raw `<script>` i head (React-advarsel).
- [x] **Manglende ikon-filer oprettet:** /icon-192.png, /icon-512.png, /apple-touch-icon.png,
      /og-image.png (1200×630) + favicon.png erstattet (1,3 MB → 5 KB). Genereres med
      `node scripts/gen-icons.mjs` (sharp, motiv: public/mascot/welcome.png + brandfarver).
- [x] **PWA-manifest:** public/manifest.webmanifest (standalone, da_DK, ikoner 192/512 + maskable).
- [x] **Zip-fil genskabt:** public/aploft-updated.zip (uden .git/node_modules/.next/ubrugte
      billed-duplikater) - og tilføjet til .gitignore, så den aldrig deployes.

**Sådan tester du selv:** start med at rydde localStorage for siden (eller brug inkognito) -
så kommer velkomstskærmen. Vælg HHX, og hop videre: du lander på Profil med spotlight-rundvisningen.
Gennemgå turen (eller spring over), og skift under Profil → Indstillinger, hvis du vil prøve STX-siden.
Tjek topbaren på 375 px: logo + mærke + streak/XP-tal i én lav række uden overlap.

**Runde 7 (10. aug.):** "mobil-indikator + nyt flamme-ikon"
- [x] **STX/HHX-mærket er tilbage i topbaren på alle skærme**, nu med studenterhat- og
      koffert-ikonet synligt også på mobil: streak/XP-teksterne ("dages streak"/"XP")
      skjules på små skærme, og afstande/padding komprimeres, så topbaren altid er
      én lav række.
- [x] **Nyt flamme-ikon** inspireret af Lucide-icons "flame" (ISC-licens): den klassiske,
      genkendelige flamme, stroke-baseret og krystalklar i lille størrelse (FlameIcon i
      components/icons.tsx).
- [x] Hjem-hero-chippen fra runde 7-forsøget er fjernet igen (mærket findes kun i topbaren).

**Runde 8 (10. aug.):** "rundvisning: sidste to trin peger på knapperne på forsiden"
- [x] **Lynkursus-trinet:** man sendes til Hjem, siden scroller ned, og spotlyset rammer
      genvejsknappen "Lynkursus" (ikke selve lynkurset). Boblen forklarer, at knappen
      fører ind på lynkurset og hvad det bruges til.
- [x] **Din udvikling-trinet:** samme princip: spotlyset rammer den aflange "Din udvikling"-
      knap nederst på forsiden, og boblen forklarer, hvor knappen er, hvad den bruges til,
      og hvor den tager dig hen.
- [x] GuidedTour ruller nu målet ind på skærmen: forsidens genvejsknapper scroller
      helt op, så de ligger lige under topbaren (alignTop + scrollBy), og Linguas
      taleboble lægger sig under knappen med god luft, så den aldrig dækker målet.
      Øvrige trin scroller målet ind midt på skærmen (scrollIntoView med kortvarig
      ophævelse af scroll-låsen).
- [x] Når rundvisningen afsluttes (eller springes over), rulles forsiden pænt op til
      toppen, så man starter forfra ved heroen (respecterer reduceMotion).
