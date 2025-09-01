// Mock d3-scale module
export const scaleLinear = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleOrdinal = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleThreshold = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleQuantile = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleQuantize = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleLog = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleSqrt = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleSequential = () => {
  const scale = (value: number) => `#${value.toString(16).padStart(6, '0')}`;
  scale.domain = () => ({
    interpolator: () => scale,
  });
  scale.interpolator = () => ({ domain: () => ({}) });
  return scale;
};

export const scalePow = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleTime = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleUtc = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleDiverging = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});

export const scaleBand = () => ({
  domain: () => ({ range: () => ({ padding: () => ({}) }) }),
  range: () => ({ domain: () => ({ padding: () => ({}) }) }),
  padding: () => ({ domain: () => ({ range: () => ({}) }) }),
});

export const scalePoint = () => ({
  domain: () => ({ range: () => ({ padding: () => ({}) }) }),
  range: () => ({ domain: () => ({ padding: () => ({}) }) }),
  padding: () => ({ domain: () => ({ range: () => ({}) }) }),
});

export const scaleImplicit = Symbol('implicit');
