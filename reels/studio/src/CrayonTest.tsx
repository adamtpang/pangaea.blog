import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HandDrawnTimeline, HandDrawnCircle, HandDrawnUnderline } from './HandDrawn';

const PAPER = '#fbf7f0';
const INK = '#1c1917';
const GOLD = '#8a6d34';

export const CrayonTest: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:wght@480&family=Newsreader:ital@1&display=swap"
      />
      <div
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 58,
          color: INK,
          textAlign: 'center',
          marginBottom: 100,
        }}
      >
        Finished high school in <span style={{ position: 'relative' }}>2020</span>
      </div>

      <svg viewBox="0 0 1080 300" width="900" height="250" style={{ overflow: 'visible' }}>
        <HandDrawnTimeline
          x={80}
          y={150}
          width={800}
          progress={1}
          points={[
            { label: '2020', sublabel: 'Finished high school' },
            { label: '2022', sublabel: 'App Academy + ChatGPT' },
            { label: '2024', sublabel: 'Network School launch' },
          ]}
        />
        <text x={80} y={210} fontFamily="Newsreader, Georgia, serif" fontSize="28" fill={INK}>2020</text>
        <text x={460} y={210} fontFamily="Newsreader, Georgia, serif" fontSize="28" fill={INK}>2022</text>
        <text x={840} y={210} fontFamily="Newsreader, Georgia, serif" fontSize="28" fill={INK}>2024</text>
        <HandDrawnCircle cx={460} cy={150} r={40} seed={7} />
      </svg>

      <div
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 26,
          color: GOLD,
          marginTop: 40,
        }}
      >
        Pangaea &middot; Early to Big Things (hand-drawn prototype)
      </div>
    </AbsoluteFill>
  );
};
