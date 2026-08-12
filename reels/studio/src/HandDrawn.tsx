import React, { useLayoutEffect, useRef } from 'react';
import rough from 'roughjs/bundled/rough.esm';

const INK = '#1c1917';
const ACCENT = '#b34a2f';

export const HandDrawnCircle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color?: string;
  seed?: number;
}> = ({ cx, cy, r, color = ACCENT, seed = 1 }) => {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const rc = rough.svg(ref.current.ownerSVGElement as unknown as SVGSVGElement);
    const node = rc.circle(cx, cy, r * 2, {
      stroke: color,
      strokeWidth: 4,
      roughness: 2.2,
      seed,
      fill: 'none',
    });
    ref.current.appendChild(node);
  }, [cx, cy, r, color, seed]);
  return <g ref={ref} />;
};

export const HandDrawnUnderline: React.FC<{
  x1: number;
  y: number;
  x2: number;
  color?: string;
  seed?: number;
}> = ({ x1, y, x2, color = ACCENT, seed = 2 }) => {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const rc = rough.svg(ref.current.ownerSVGElement as unknown as SVGSVGElement);
    const node = rc.line(x1, y, x2, y, {
      stroke: color,
      strokeWidth: 5,
      roughness: 2.5,
      seed,
    });
    ref.current.appendChild(node);
  }, [x1, y, x2, color, seed]);
  return <g ref={ref} />;
};

export const HandDrawnTileGrid: React.FC<{
  x: number;
  y: number;
  cols: number;
  rows: number;
  cell: number;
  litCount: number;
  seed?: number;
}> = ({ x, y, cols, rows, cell, litCount, seed = 5 }) => {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const svg = ref.current.ownerSVGElement as unknown as SVGSVGElement;
    const rc = rough.svg(svg);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = x + c * cell;
        const cy = y + r * cell;
        const lit = i < litCount;
        const node = rc.rectangle(cx, cy, cell * 0.7, cell * 0.7, {
          stroke: lit ? ACCENT : '#c9bfa8',
          strokeWidth: lit ? 3 : 1.5,
          roughness: lit ? 2 : 1.2,
          fill: lit ? ACCENT : 'none',
          fillStyle: 'hachure',
          fillWeight: 1.5,
          seed: seed + i,
        });
        ref.current!.appendChild(node);
        i++;
      }
    }
  }, [x, y, cols, rows, cell, litCount, seed]);
  return <g ref={ref} />;
};

export const HandDrawnLabeledBoxes: React.FC<{
  x: number;
  y: number;
  width: number;
  labels: string[];
  seed?: number;
}> = ({ x, y, width, labels, seed = 6 }) => {
  const ref = useRef<SVGGElement>(null);
  const boxW = width / labels.length - 20;
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const svg = ref.current.ownerSVGElement as unknown as SVGSVGElement;
    const rc = rough.svg(svg);
    labels.forEach((_, i) => {
      const bx = x + i * (boxW + 20);
      const node = rc.rectangle(bx, y, boxW, 90, {
        stroke: INK,
        strokeWidth: 2.5,
        roughness: 1.8,
        fill: 'none',
        seed: seed + i,
      });
      ref.current!.appendChild(node);
    });
  }, [x, y, width, labels, seed, boxW]);
  return <g ref={ref} />;
};

export const HandDrawnTimeline: React.FC<{
  x: number;
  y: number;
  width: number;
  points: { label: string; sublabel: string }[];
  progress: number;
  seed?: number;
}> = ({ x, y, width, points, progress, seed = 3 }) => {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const svg = ref.current.ownerSVGElement as unknown as SVGSVGElement;
    const rc = rough.svg(svg);
    const drawnWidth = width * progress;
    const line = rc.line(x, y, x + drawnWidth, y, {
      stroke: INK,
      strokeWidth: 3,
      roughness: 2,
      seed,
    });
    ref.current.appendChild(line);
    const step = width / (points.length - 1);
    points.forEach((_, i) => {
      const px = x + step * i;
      if (px > x + drawnWidth + 2) return;
      const dot = rc.circle(px, y, 22, {
        stroke: ACCENT,
        strokeWidth: 3,
        roughness: 1.8,
        fill: '#fbf7f0',
        fillStyle: 'solid',
        seed: seed + i,
      });
      ref.current!.appendChild(dot);
    });
  }, [x, y, width, points, progress, seed]);
  return <g ref={ref} />;
};
