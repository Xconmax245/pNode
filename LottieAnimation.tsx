'use client';

import Lottie from 'lottie-react';

// Simple loading animation data (spinner-like)
const loadingAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [60, 60] },
          p: { a: 0, k: [0, 0] },
          nm: "Ellipse"
        },
        {
          ty: "st",
          c: { a: 0, k: [0.055, 0.647, 0.643, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 6 },
          lc: 2,
          lj: 2,
          nm: "Stroke",
          d: [{ n: "d", nm: "dash", v: { a: 0, k: 40 } }, { n: "g", nm: "gap", v: { a: 0, k: 120 } }]
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

// Empty state animation data (simple floating dots)
const emptyAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 100,
  h: 100,
  nm: "Empty",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Dot1",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [30], e: [100] }, { t: 45, s: [100], e: [30] }, { t: 90, s: [30] }] },
        p: { a: 1, k: [{ t: 0, s: [30, 55, 0], e: [30, 45, 0] }, { t: 45, s: [30, 45, 0], e: [30, 55, 0] }, { t: 90, s: [30, 55, 0] }] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{ ty: "el", s: { a: 0, k: [10, 10] }, p: { a: 0, k: [0, 0] } }, { ty: "fl", c: { a: 0, k: [0.5, 0.5, 0.5, 1] }, o: { a: 0, k: 100 } }],
      ip: 0,
      op: 90,
      st: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Dot2",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 15, s: [30], e: [100] }, { t: 60, s: [100], e: [30] }, { t: 90, s: [30] }] },
        p: { a: 1, k: [{ t: 15, s: [50, 55, 0], e: [50, 45, 0] }, { t: 60, s: [50, 45, 0], e: [50, 55, 0] }, { t: 90, s: [50, 55, 0] }] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{ ty: "el", s: { a: 0, k: [10, 10] }, p: { a: 0, k: [0, 0] } }, { ty: "fl", c: { a: 0, k: [0.5, 0.5, 0.5, 1] }, o: { a: 0, k: 100 } }],
      ip: 0,
      op: 90,
      st: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Dot3",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 30, s: [30], e: [100] }, { t: 75, s: [100], e: [30] }, { t: 90, s: [30] }] },
        p: { a: 1, k: [{ t: 30, s: [70, 55, 0], e: [70, 45, 0] }, { t: 75, s: [70, 45, 0], e: [70, 55, 0] }, { t: 90, s: [70, 55, 0] }] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{ ty: "el", s: { a: 0, k: [10, 10] }, p: { a: 0, k: [0, 0] } }, { ty: "fl", c: { a: 0, k: [0.5, 0.5, 0.5, 1] }, o: { a: 0, k: 100 } }],
      ip: 0,
      op: 90,
      st: 0
    }
  ]
};

// Success checkmark animation
const successAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 40,
  w: 100,
  h: 100,
  nm: "Success",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50, 0] },
        s: { a: 1, k: [{ t: 0, s: [0, 0, 100], e: [100, 100, 100] }, { t: 20, s: [100, 100, 100] }] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", s: { a: 0, k: [60, 60] }, p: { a: 0, k: [0, 0] } },
            { ty: "fl", c: { a: 0, k: [0.063, 0.725, 0.506, 1] }, o: { a: 0, k: 100 } }
          ],
          nm: "Circle"
        }
      ],
      ip: 0,
      op: 40,
      st: 0
    }
  ]
};

type LottieAnimationType = 'loading' | 'empty' | 'success';

interface LottieAnimationProps {
  type: LottieAnimationType;
  size?: number;
  className?: string;
  loop?: boolean;
}

const animations = {
  loading: loadingAnimationData,
  empty: emptyAnimationData,
  success: successAnimationData,
};

export default function LottieAnimation({ type, size = 80, className = '', loop = true }: LottieAnimationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Lottie 
        animationData={animations[type]} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
