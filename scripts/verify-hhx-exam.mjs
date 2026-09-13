import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(join(tmpdir(), "apklar-hhx-"));
const entry = join(temp, "verify-entry.ts");
const bundle = join(temp, "verify-entry.mjs");
const dataPath = join(root, "src/data/hhxExam.ts");
const gradingPath = join(root, "src/lib/hhxExamGrading.ts");

const verification = `
import { EXAM_TEXTS } from ${JSON.stringify(dataPath)};
import { emptyExamAnswers, gradeHhxExam } from ${JSON.stringify(gradingPath)};

const failures = [];
const wordCount = (value) => value.trim().split(/\\s+/).filter(Boolean).length;
const includesExact = (text, sentence) => text.some((paragraph) => {
  const withoutFinalStop = sentence.replace(/[.!?]$/, "");
  return paragraph.includes(sentence) || paragraph.includes(withoutFinalStop);
});
const answerFor = (text) => {
  const answer = emptyExamAnswers();
  answer.genre = text.correctGenreIndex;
  answer.genreBegrundelse = text.begrundKeywords[0];
  for (const field of ["afsender", "emne", "modtager", "situation", "sprog", "formaal"]) {
    answer.pentagram[field] = text.pentagram[field].keywords[0];
  }
  answer.saertraek = text.saertraek.kategorier.map((category) => category.keywords[0]).join(" ");
  text.morfologi.forEach((word, index) => {
    answer.morfologi[index] = { split: word.solution.join("-"), fleksiv: word.fleksiv ?? "" };
  });
  text.analyse.correctMap.forEach((symbol, index) => {
    answer.analyse[index] = symbol;
  });
  text.tider.forEach((time, index) => {
    answer.tider[index] = { tid: time.tid, omskrivning: time.omskrivGodkendte[0] };
  });
  text.hsls.correctMap.forEach((kind, index) => {
    answer.hsls.markeringer[index] = kind;
  });
  answer.hsls.indleder = text.hsls.indlederGodkendte[0];
  answer.hsls.funktion = text.hsls.funktionCorrect;
  return answer;
};

if (EXAM_TEXTS.length !== 10) failures.push("forventede 10 tekster");
const genreCounts = Object.fromEntries(EXAM_TEXTS.map((text) => [text.genre, 0]));
for (const text of EXAM_TEXTS) {
  genreCounts[text.genre] = (genreCounts[text.genre] ?? 0) + 1;
  const words = wordCount(text.paragraphs.join(" "));
  if (text.paragraphs.length < 7 || text.paragraphs.length > 12) failures.push(text.id + ": afsnitstal " + text.paragraphs.length);
  if (words < 250 || words > 430) failures.push(text.id + ": ordtal " + words);
  if (!includesExact(text.paragraphs, text.analyse.sentence)) failures.push(text.id + ": analyse.sentence mangler i teksten");
  for (const time of text.tider) {
    if (!includesExact(text.paragraphs, time.sentence)) failures.push(text.id + ": tidssætning mangler: " + time.sentence);
  }
  if (!includesExact(text.paragraphs, text.hsls.sentence)) failures.push(text.id + ": hsls.sentence mangler i teksten");
  const lowerText = [text.title, text.subtitle ?? "", text.source, ...text.paragraphs].join(" ").toLocaleLowerCase("da-DK");
  for (const word of text.morfologi) {
    if (!lowerText.includes(word.word.toLocaleLowerCase("da-DK"))) failures.push(text.id + ": morfologiord mangler: " + word.word);
    if (!word.note.toLocaleLowerCase("da-DK").includes("afsnit") && !word.note.toLocaleLowerCase("da-DK").includes("kildelinje") && !word.note.toLocaleLowerCase("da-DK").includes("titel")) {
      failures.push(text.id + ": morfologinote angiver ikke placering: " + word.word);
    }
  }
  const firstWord = text.hsls.sentence.trim().split(/\\s+/)[0].replace(/^[^a-zæøå]+/i, "").toLocaleLowerCase("da-DK");
  if (!text.hsls.indlederGodkendte.map((word) => word.toLocaleLowerCase("da-DK")).includes(firstWord)) failures.push(text.id + ": hsls-indleder passer ikke til sætningen");
  const perfect = gradeHhxExam(text, answerFor(text));
  if (perfect.grade !== 12 || perfect.pct !== 100 || perfect.points !== perfect.max) failures.push(text.id + ": perfekt svar gav " + perfect.grade + "/" + perfect.pct + "%");
  const empty = gradeHhxExam(text, emptyExamAnswers());
  if (empty.grade !== -3 || empty.pct !== 0) failures.push(text.id + ": tom besvarelse gav " + empty.grade + "/" + empty.pct + "%");
  console.log(text.id + ": " + words + " ord, " + text.paragraphs.length + " afsnit, perfekt " + perfect.grade + "/" + perfect.pct + "%, tom " + empty.grade + "/" + empty.pct + "%");
}
for (const genre of ["Politisk tale", "Ejendomsannonce", "Opinionsartikel", "Informerende artikel", "Reklame"]) {
  if (genreCounts[genre] !== 2) failures.push(genre + ": forventede 2 tekster, fandt " + (genreCounts[genre] ?? 0));
}
if (failures.length > 0) {
  console.error("HHX-verificering fejlede:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("HHX-verificering OK: 10 tekster, 2 pr. genre, facit i tekst, og bedømmelse testet.");
`;

try {
  writeFileSync(entry, verification);
  execFileSync("npx", ["--yes", "esbuild", entry, "--bundle", "--platform=node", "--format=esm", "--outfile=" + bundle], { cwd: root, stdio: "inherit" });
  execFileSync(process.execPath, [bundle], { cwd: root, stdio: "inherit" });
} finally {
  rmSync(temp, { recursive: true, force: true });
}
