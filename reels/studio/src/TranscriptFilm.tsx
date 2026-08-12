import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const PAPER = '#fbf7f0';
const INK = '#1c1917';
const MUTED = '#c9bfa8';
const ACCENT = '#b34a2f';
const CHUNK_SIZE = 7;

export interface Word {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptFilmProps {
  title: string;
  words: Word[];
  audio: string;
}

const FontLink = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,380;0,480;0,600;1,480&display=swap"
  />
);

export const TranscriptFilm: React.FC<TranscriptFilmProps> = ({ title, words, audio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let activeIndex = 0;
  for (let i = 0; i < words.length; i++) {
    if (t >= words[i].start) activeIndex = i;
    else break;
  }

  const chunkStart = Math.floor(activeIndex / CHUNK_SIZE) * CHUNK_SIZE;
  const chunk = words.slice(chunkStart, chunkStart + CHUNK_SIZE);

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', flexDirection: 'column' }}>
      <FontLink />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          textAlign: 'center',
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 600,
          fontSize: 44,
          color: INK,
          paddingTop: 90,
        }}
      >
        {title}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 200px' }}>
        <div
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 480,
            fontSize: 64,
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          {chunk.map((w, i) => {
            const globalIndex = chunkStart + i;
            const color = globalIndex < activeIndex ? INK : globalIndex === activeIndex ? ACCENT : MUTED;
            return (
              <span key={globalIndex} style={{ color }}>
                {w.text}{' '}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
