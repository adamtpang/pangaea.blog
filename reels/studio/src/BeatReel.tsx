import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface Beat {
  text: string;
  audio: string;
  seconds: number;
}

export interface BeatReelProps {
  title: string;
  beats: Beat[];
}

const PAPER = '#fbf7f0';
const INK = '#1c1917';
const ACCENT = '#b34a2f';
const GOLD = '#8a6d34';

const BeatSlide: React.FC<{ beat: Beat; title: string }> = ({ beat, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 200, stiffness: 120 } });
  const barWidth = Math.min(1, entrance) * 90;
  const textOpacity = Math.min(1, entrance);
  const textY = 24 * (1 - Math.min(1, entrance));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 96px',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:wght@480&family=Newsreader:ital@1&display=swap"
      />
      <div style={{ width: barWidth, height: 6, background: ACCENT, borderRadius: 3, marginBottom: 56 }} />
      <div
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 480,
          fontSize: 76,
          lineHeight: 1.18,
          color: INK,
          textAlign: 'center',
          maxWidth: 880,
          whiteSpace: 'pre-line',
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        {beat.text}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 28,
          color: GOLD,
          opacity: 0.9,
        }}
      >
        Pangaea &middot; {title}
      </div>
    </AbsoluteFill>
  );
};

export const BeatReel: React.FC<BeatReelProps> = ({ title, beats }) => {
  const { fps } = useVideoConfig();
  let startFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      {beats.map((beat, i) => {
        const durationInFrames = Math.round(beat.seconds * fps);
        const from = startFrame;
        startFrame += durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <BeatSlide beat={beat} title={title} />
            <Audio src={staticFile(beat.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
