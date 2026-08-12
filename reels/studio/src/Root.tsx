import React from 'react';
import { Composition } from 'remotion';
import { BeatReel } from './BeatReel';
import { CrayonTest } from './CrayonTest';
import { DocFilm } from './DocFilm';
import agencyReel from './reels/agency-is-the-only-skill.json';
import earlyReel from './reels/early-to-big-things.json';
import rockefellerReel from './reels/rockefeller-the-flywheel.json';
import backyardReel from './reels/the-backyard.json';

const FPS = 30;
const totalSeconds = agencyReel.beats.reduce((sum, b) => sum + b.seconds, 0);
const earlyTotalSeconds = earlyReel.beats.reduce((sum, b) => sum + b.seconds, 0);
const rockefellerTotalSeconds = rockefellerReel.beats.reduce((sum, b) => sum + b.seconds, 0);
const backyardTotalSeconds = backyardReel.beats.reduce((sum, b) => sum + b.seconds, 0);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BeatReel"
        component={BeatReel}
        durationInFrames={Math.round(totalSeconds * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          title: agencyReel.title,
          beats: agencyReel.beats,
        }}
      />
      <Composition
        id="CrayonTest"
        component={CrayonTest}
        durationInFrames={30}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="DocFilm"
        component={DocFilm}
        durationInFrames={Math.round(earlyTotalSeconds * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: earlyReel.title,
          beats: earlyReel.beats,
        }}
      />
      <Composition
        id="Rockefeller"
        component={DocFilm}
        durationInFrames={Math.round(rockefellerTotalSeconds * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: rockefellerReel.title,
          beats: rockefellerReel.beats,
        }}
      />
      <Composition
        id="Backyard"
        component={DocFilm}
        durationInFrames={Math.round(backyardTotalSeconds * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: backyardReel.title,
          beats: backyardReel.beats,
        }}
      />
    </>
  );
};
