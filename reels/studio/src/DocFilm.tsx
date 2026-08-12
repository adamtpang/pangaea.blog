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
import {
  HandDrawnCircle,
  HandDrawnUnderline,
  HandDrawnTimeline,
  HandDrawnTileGrid,
  HandDrawnLabeledBoxes,
} from './HandDrawn';

const PAPER = '#fbf7f0';
const INK = '#1c1917';
const ACCENT = '#b34a2f';
const GOLD = '#8a6d34';

export interface DocBeat {
  layout: 'quote' | 'title' | 'tiles' | 'timeline' | 'grid' | 'photo';
  text: string;
  quote?: string | null;
  source?: string | null;
  progress?: number;
  photo?: string;
  photoCredit?: string;
  audio: string;
  seconds: number;
}

export interface DocFilmProps {
  title: string;
  beats: DocBeat[];
}

const FontLink = () => (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:wght@480&family=Newsreader:ital@0;1&display=swap"
  />
);

const Footer: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 56,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: "'Newsreader', Georgia, serif",
      fontStyle: 'italic',
      fontSize: 22,
      color: GOLD,
      opacity: 0.85,
    }}
  >
    Pangaea &middot; {title}
  </div>
);

const QuoteSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, title, entrance }) => (
  <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 160px' }}>
    <FontLink />
    <div
      style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 480,
        fontSize: 64,
        color: INK,
        textAlign: 'center',
        opacity: Math.min(1, entrance),
        transform: `translateY(${16 * (1 - Math.min(1, entrance))}px)`,
      }}
    >
      {beat.text}
    </div>
    <svg width="500" height="24" style={{ marginTop: 8, opacity: Math.min(1, entrance) }}>
      <HandDrawnUnderline x1={30} y={12} x2={30 + 440 * Math.min(1, entrance * 1.4)} />
    </svg>
    {beat.quote && (
      <div
        style={{
          marginTop: 56,
          maxWidth: 1100,
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 30,
          color: '#403a34',
          textAlign: 'center',
          lineHeight: 1.5,
          opacity: Math.min(1, Math.max(0, entrance - 0.3) * 1.6),
        }}
      >
        &ldquo;{beat.quote}&rdquo;
        {beat.source && (
          <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'normal', fontSize: 20, color: GOLD, marginTop: 12 }}>
            &mdash; {beat.source}
          </div>
        )}
      </div>
    )}
    <Footer title={title} />
  </AbsoluteFill>
);

const TitleSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, entrance }) => (
  <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <FontLink />
    <svg width="1200" height="260" viewBox="0 0 1200 260">
      <HandDrawnUnderline x1={80} y={40} x2={80 + 1040 * Math.min(1, entrance)} color={ACCENT} />
      <text x="600" y="150" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="86" fill={INK} opacity={Math.min(1, entrance)}>
        {beat.text}
      </text>
      <HandDrawnUnderline x1={80} y={220} x2={80 + 1040 * Math.min(1, entrance)} color={ACCENT} seed={9} />
    </svg>
  </AbsoluteFill>
);

const TilesSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, title, entrance }) => {
  const lit = Math.round(3 + entrance * 2);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <FontLink />
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, color: INK, marginBottom: 40, opacity: Math.min(1, entrance) }}>
        {beat.text}
      </div>
      <svg width="900" height="300" viewBox="0 0 900 300">
        <HandDrawnTileGrid x={20} y={20} cols={12} rows={4} cell={72} litCount={Math.min(48, lit * 6)} />
      </svg>
      {beat.quote && (
        <div style={{ marginTop: 24, maxWidth: 1000, fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 26, color: '#403a34', textAlign: 'center' }}>
          &ldquo;{beat.quote}&rdquo;
        </div>
      )}
      <Footer title={title} />
    </AbsoluteFill>
  );
};

const GridSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, title, entrance }) => {
  const labels = (beat.quote ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <FontLink />
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 56, color: INK, marginBottom: 56, opacity: Math.min(1, entrance) }}>
        {beat.text}
      </div>
      <svg width="1400" height="140" viewBox="0 0 1400 140">
        <HandDrawnLabeledBoxes x={20} y={10} width={1360} labels={labels.length ? labels : ['project']} />
        {labels.map((l, i) => {
          const boxW = 1360 / labels.length - 20;
          const bx = 20 + i * (boxW + 20) + boxW / 2;
          return (
            <text key={i} x={bx} y={65} textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontSize="18" fill={INK}>
              {l}
            </text>
          );
        })}
      </svg>
      <Footer title={title} />
    </AbsoluteFill>
  );
};

const TimelineSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, title, entrance }) => (
  <AbsoluteFill style={{ backgroundColor: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <FontLink />
    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, color: INK, marginBottom: 24, opacity: Math.min(1, entrance) }}>
      {beat.text}
    </div>
    <svg width="1100" height="220" viewBox="0 0 1100 220">
      <HandDrawnTimeline
        x={60}
        y={100}
        width={980}
        progress={Math.min(1, (beat.progress ?? 1) * Math.min(1, entrance * 1.5))}
        points={[{ label: '2020', sublabel: '' }, { label: '2022', sublabel: '' }, { label: '2024', sublabel: '' }]}
      />
      <text x={60} y={160} fontFamily="Newsreader, Georgia, serif" fontSize="24" fill={INK}>2020</text>
      <text x={530} y={160} fontFamily="Newsreader, Georgia, serif" fontSize="24" fill={INK}>2022</text>
      <text x={1000} y={160} fontFamily="Newsreader, Georgia, serif" fontSize="24" fill={INK}>2024</text>
    </svg>
    {beat.quote && (
      <div style={{ marginTop: 16, maxWidth: 1000, fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 26, color: '#403a34', textAlign: 'center' }}>
        &ldquo;{beat.quote}&rdquo;
      </div>
    )}
    <Footer title={title} />
  </AbsoluteFill>
);

const PhotoSlide: React.FC<{ beat: DocBeat; title: string; entrance: number }> = ({ beat, title, entrance }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.min(1, frame / Math.max(1, durationInFrames));
  const scale = 1.0 + t * 0.12;
  const panX = -20 + t * 40;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <FontLink />
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <img
          src={staticFile(beat.photo ?? '')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'sepia(0.35) contrast(1.05)',
            transform: `scale(${scale}) translateX(${panX}px)`,
          }}
        />
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(28,25,23,0.15) 0%, rgba(28,25,23,0.05) 40%, rgba(28,25,23,0.75) 100%)' }} />
      </AbsoluteFill>
      <svg width="1920" height="1080" style={{ position: 'absolute', top: 0, left: 0 }} viewBox="0 0 1920 1080">
        <HandDrawnCircle cx={1560} cy={260} r={110} color="#e8cfc3" seed={11} />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          right: 0,
          padding: '0 160px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 480,
            fontSize: 46,
            color: '#fbf7f0',
            marginBottom: beat.quote ? 20 : 0,
            opacity: Math.min(1, entrance),
          }}
        >
          {beat.text}
        </div>
        {beat.quote && (
          <div
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 28,
              color: '#e8cfc3',
              lineHeight: 1.5,
              opacity: Math.min(1, Math.max(0, entrance - 0.2) * 1.5),
            }}
          >
            &ldquo;{beat.quote}&rdquo;
          </div>
        )}
      </div>
      {beat.photoCredit && (
        <div style={{ position: 'absolute', bottom: 24, right: 32, fontFamily: "'Newsreader', Georgia, serif", fontSize: 14, color: 'rgba(251,247,240,0.55)' }}>
          {beat.photoCredit}
        </div>
      )}
    </AbsoluteFill>
  );
};

const DocSlide: React.FC<{ beat: DocBeat; title: string }> = ({ beat, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 200, stiffness: 120 } });

  switch (beat.layout) {
    case 'photo':
      return <PhotoSlide beat={beat} title={title} entrance={entrance} />;
    case 'title':
      return <TitleSlide beat={beat} title={title} entrance={entrance} />;
    case 'tiles':
      return <TilesSlide beat={beat} title={title} entrance={entrance} />;
    case 'grid':
      return <GridSlide beat={beat} title={title} entrance={entrance} />;
    case 'timeline':
      return <TimelineSlide beat={beat} title={title} entrance={entrance} />;
    default:
      return <QuoteSlide beat={beat} title={title} entrance={entrance} />;
  }
};

export const DocFilm: React.FC<DocFilmProps> = ({ title, beats }) => {
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
            <DocSlide beat={beat} title={title} />
            <Audio src={staticFile(beat.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
