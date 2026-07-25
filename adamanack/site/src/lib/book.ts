// Load + process keepers.json into a flat numbered list of aphorisms.
// This is the single source of truth — the Typst manuscript reads the
// same JSON file. Edit the JSON, both update.

import keepers from "../../../corpus/keepers.json";

export interface Aphorism {
  number: number;          // continuous 1..N across the whole book
  themeIndex: number;      // 0-based index of theme
  themeName: string;       // theme name (lowercase)
  positionInTheme: number; // 1-based position within its theme
  text: string;            // the line itself
  audioPath: string;       // /audio/aph-001.mp3 (may not exist yet)
}

export interface Theme {
  index: number;
  name: string;
  startNumber: number;
  endNumber: number;
  aphorisms: Aphorism[];
}

export interface Book {
  title: string;
  subtitle: string;
  author: string;
  place: string;
  version: string;
  epigraph: string;
  preface: string;
  authorsNote: string;
  colophon: string;
  themes: Theme[];
  flat: Aphorism[];          // every aphorism, in book order
  totalCount: number;
}

function pad(n: number): string {
  return n.toString().padStart(3, "0");
}

function build(): Book {
  const themes: Theme[] = [];
  const flat: Aphorism[] = [];
  let counter = 0;

  keepers.themes.forEach((t: any, themeIndex: number) => {
    const themeAphs: Aphorism[] = [];
    const startNumber = counter + 1;
    t.aphorisms.forEach((line: string, i: number) => {
      counter += 1;
      const aph: Aphorism = {
        number: counter,
        themeIndex,
        themeName: t.name,
        positionInTheme: i + 1,
        text: line,
        audioPath: `/audio/aph-${pad(counter)}.mp3`,
      };
      themeAphs.push(aph);
      flat.push(aph);
    });
    themes.push({
      index: themeIndex,
      name: t.name,
      startNumber,
      endNumber: counter,
      aphorisms: themeAphs,
    });
  });

  return {
    title:        keepers.title,
    subtitle:     keepers.subtitle,
    author:       keepers.author,
    place:        keepers.place,
    version:      keepers.version,
    epigraph:     keepers.epigraph,
    preface:      keepers.preface,
    authorsNote:  keepers.authors_note,
    colophon:     keepers.colophon,
    themes,
    flat,
    totalCount:   counter,
  };
}

export const book: Book = build();
