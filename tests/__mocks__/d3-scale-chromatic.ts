// Mock d3-scale-chromatic module
export const schemeCategory10 = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

export const schemeAccent = [
  '#7fc97f',
  '#beaed4',
  '#fdc086',
  '#ffff99',
  '#386cb0',
  '#f0027f',
  '#bf5b17',
  '#666666',
];

export const schemeDark2 = [
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666666',
];

export const schemePaired = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a6a6a',
  '#ffff99',
  '#b15928',
];

export const schemePastel1 = [
  '#fbb4ae',
  '#b3cde3',
  '#ccebc5',
  '#decbe4',
  '#fed9a6',
  '#ffffcc',
  '#e5d8bd',
  '#fddaec',
  '#f2f2f2',
];

export const schemePastel2 = [
  '#b3e2cd',
  '#fdcdac',
  '#cbd5e8',
  '#f4cae4',
  '#e6f5c9',
  '#fff2ae',
  '#f1e2cc',
  '#cccccc',
];

export const schemeSet1 = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

export const schemeSet2 = [
  '#66c2a5',
  '#fc8d62',
  '#8da0cb',
  '#e78ac3',
  '#a6d854',
  '#ffd92f',
  '#e5c494',
  '#b3b3b3',
];

export const schemeSet3 = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
];

export const interpolateBlues = () => (t: number) =>
  `rgb(${Math.round(255 * (1 - t))}, ${Math.round(255 * (1 - t))}, 255)`;
export const interpolateGreens = () => (t: number) =>
  `rgb(0, ${Math.round(255 * t)}, 0)`;
export const interpolateGreys = () => (t: number) =>
  `rgb(${Math.round(255 * t)}, ${Math.round(255 * t)}, ${Math.round(255 * t)})`;
export const interpolateOranges = () => (t: number) =>
  `rgb(255, ${Math.round(255 * (1 - t))}, 0)`;
export const interpolatePurples = () => (t: number) =>
  `rgb(${Math.round(255 * t)}, 0, ${Math.round(255 * t)})`;
export const interpolateReds = () => (t: number) =>
  `rgb(255, 0, ${Math.round(255 * (1 - t))})`;

export const interpolateBuGn = () => (t: number) =>
  `rgb(0, ${Math.round(255 * t)}, ${Math.round(255 * (1 - t))})`;
export const interpolateBuPu = () => (t: number) =>
  `rgb(0, ${Math.round(255 * (1 - t))}, ${Math.round(255 * t)})`;
export const interpolateGnBu = () => (t: number) =>
  `rgb(0, ${Math.round(255 * (1 - t))}, ${Math.round(255 * t)})`;
export const interpolateOrRd = () => (t: number) =>
  `rgb(255, ${Math.round(255 * (1 - t))}, 0)`;
export const interpolatePuBu = () => (t: number) =>
  `rgb(${Math.round(255 * t)}, 0, ${Math.round(255 * (1 - t))})`;
export const interpolatePuBuGn = () => (t: number) =>
  `rgb(${Math.round(255 * t)}, 0, ${Math.round(255 * (1 - t))})`;
export const interpolatePuRd = () => (t: number) =>
  `rgb(${Math.round(255 * t)}, 0, ${Math.round(255 * (1 - t))})`;
export const interpolateRdPu = () => (t: number) =>
  `rgb(255, 0, ${Math.round(255 * t)})`;
export const interpolateYlGn = () => (t: number) =>
  `rgb(${Math.round(255 * (1 - t))}, 255, 0)`;
export const interpolateYlGnBu = () => (t: number) =>
  `rgb(${Math.round(255 * (1 - t))}, 255, ${Math.round(255 * t)})`;
export const interpolateYlOrBr = () => (t: number) =>
  `rgb(255, ${Math.round(255 * (1 - t))}, 0)`;
export const interpolateYlOrRd = () => (t: number) =>
  `rgb(255, ${Math.round(255 * (1 - t))}, 0)`;
