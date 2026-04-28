export type { PatternMatch, PatternScanner } from './types';

export { scanWhiteOnWhite } from './whiteOnWhite';
export { scanZeroWidth } from './zeroWidth';
export { scanHiddenCss } from './hiddenCss';
export { scanOffScreen } from './offScreen';
export { scanTinyFont } from './tinyFont';
export { scanMetaTags } from './metaTags';
export { scanAriaHidden } from './ariaHidden';

import type { PatternScanner } from './types';
import { scanWhiteOnWhite } from './whiteOnWhite';
import { scanZeroWidth } from './zeroWidth';
import { scanHiddenCss } from './hiddenCss';
import { scanOffScreen } from './offScreen';
import { scanTinyFont } from './tinyFont';
import { scanMetaTags } from './metaTags';
import { scanAriaHidden } from './ariaHidden';

/** 전체 7종 패턴 스캐너 배열 */
export const ALL_SCANNERS: PatternScanner[] = [
  scanWhiteOnWhite,
  scanZeroWidth,
  scanHiddenCss,
  scanOffScreen,
  scanTinyFont,
  scanMetaTags,
  scanAriaHidden,
];
