import type { CharacterElement, DecorationElement, StickerKind, Template, TemplatePalette } from '../types';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const shapeFill = (palette: string[], index: number, fallback: string) => palette[index] ?? fallback;

export const createPatternSvg = (pattern: Template['canvas']['backgroundPattern'], palette: TemplatePalette, width = 1400, height = 900) => {
  switch (pattern) {
    case 'grid':
      return encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <pattern id="g" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke="${palette.line}" stroke-opacity="0.24" stroke-width="1.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>
      `);
    case 'lace':
      return encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g fill="none" stroke="${palette.line}" stroke-opacity="0.28" stroke-width="3">
            <path d="M0 120 C60 30 140 30 200 120 S340 210 400 120 S540 30 600 120 S740 210 800 120 S940 30 1000 120 S1140 210 1200 120 S1340 30 1400 120"/>
            <path d="M0 780 C60 690 140 690 200 780 S340 870 400 780 S540 690 600 780 S740 870 800 780 S940 690 1000 780 S1140 870 1200 780 S1340 690 1400 780"/>
          </g>
          <g fill="${palette.surfaceAlt}" fill-opacity="0.3">
            <circle cx="140" cy="120" r="18"/><circle cx="420" cy="120" r="18"/><circle cx="700" cy="120" r="18"/><circle cx="980" cy="120" r="18"/><circle cx="1260" cy="120" r="18"/>
            <circle cx="140" cy="780" r="18"/><circle cx="420" cy="780" r="18"/><circle cx="700" cy="780" r="18"/><circle cx="980" cy="780" r="18"/><circle cx="1260" cy="780" r="18"/>
          </g>
        </svg>
      `);
    case 'cloud':
      return encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g fill="${palette.surfaceAlt}" fill-opacity="0.42">
            <path d="M120 160c0-42 36-74 80-74 30 0 56 14 70 34 12-10 30-16 50-16 42 0 76 30 76 68 0 8-2 14-4 22H150c-18-8-30-20-30-34z"/>
            <path d="M980 182c0-38 34-68 78-68 28 0 50 10 66 26 14-16 34-24 60-24 40 0 74 28 74 64 0 10-2 18-6 26h-250c-12-6-22-12-22-24z"/>
            <path d="M320 720c0-36 30-64 70-64 22 0 42 8 56 24 14-10 30-16 50-16 38 0 70 24 70 58 0 8-2 14-4 22H360c-22-8-40-16-40-24z"/>
          </g>
        </svg>
      `);
    case 'paper':
      return encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.08"/></feComponentTransfer></filter>
          <rect width="100%" height="100%" filter="url(#n)" fill="${palette.line}"/>
        </svg>
      `);
    case 'sparkle':
      return encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g fill="${palette.surfaceAlt}" fill-opacity="0.5">
            <path d="M180 132l12 30 30 12-30 12-12 30-12-30-30-12 30-12z"/>
            <path d="M1120 180l8 20 20 8-20 8-8 20-8-20-20-8 20-8z"/>
            <path d="M260 650l10 24 24 10-24 10-10 24-10-24-24-10 24-10z"/>
            <path d="M1210 680l12 28 28 12-28 12-12 28-12-28-28-12 28-12z"/>
          </g>
        </svg>
      `);
    default:
      return undefined;
  }
};

const stickerPath = (kind: StickerKind, fillA: string, fillB: string, stroke: string) => {
  switch (kind) {
    case 'cloud':
      return `<path d="M22 58c0-15 13-28 30-28 6 0 12 2 17 5 8-12 22-19 38-19 24 0 43 16 48 38 20 1 35 14 35 30 0 18-18 32-40 32H54C36 116 22 102 22 86c0-10 5-19 13-28Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M82 38c12 4 22 13 26 24" stroke="${fillB}" stroke-width="6" stroke-linecap="round"/>`;
    case 'star':
      return `<path d="M90 14l16 38 40 8-30 28 8 40-34-20-34 20 8-40-30-28 40-8Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><circle cx="90" cy="70" r="10" fill="${fillB}"/>`;
    case 'heart':
      return `<path d="M90 120 28 58c-16-16-16-42 0-58s42-16 58 0l4 4 4-4c16-16 42-16 58 0s16 42 0 58Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><circle cx="88" cy="54" r="10" fill="${fillB}"/>`;
    case 'ribbon':
      return `<path d="M18 26h144c12 0 22 10 22 22s-10 22-22 22h-34l18 42-40-26-16 30-16-30-40 26 18-42H18C6 70-4 60-4 48S6 26 18 26Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/>`;
    case 'wing':
      return `<path d="M34 86c-10-36 6-62 42-72 8 20 8 38 0 54 18-20 42-28 72-24-6 28-22 50-48 62 24 0 44 6 62 18-30 12-60 14-90 4-12 12-24 18-38 20Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M68 34c8 18 10 34 4 48M100 46c4 14 2 28-6 40" stroke="${fillB}" stroke-width="5" stroke-linecap="round"/>`;
    case 'feather':
      return `<path d="M118 16c-28 10-56 34-72 66-14 28-20 54-18 78 24-4 48-18 70-42 30-32 42-70 36-102-2 0-8 0-16 0Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M62 102 118 16M56 80l24 8M42 96l24 10M36 118l24 8" stroke="${fillB}" stroke-width="5" stroke-linecap="round"/>`;
    case 'flower':
      return `<g stroke="${stroke}" stroke-width="4"><circle cx="90" cy="48" r="20" fill="${fillA}"/><circle cx="54" cy="76" r="20" fill="${fillA}"/><circle cx="126" cy="76" r="20" fill="${fillA}"/><circle cx="64" cy="114" r="20" fill="${fillA}"/><circle cx="116" cy="114" r="20" fill="${fillA}"/><circle cx="90" cy="88" r="18" fill="${fillB}"/></g>`;
    case 'leaf':
      return `<path d="M32 96c0-48 36-80 116-84 2 54-26 108-86 118-20 4-30-10-30-34Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M62 100c26-26 52-48 78-64" stroke="${fillB}" stroke-width="5" stroke-linecap="round"/>`;
    case 'envelope':
      return `<rect x="18" y="28" width="144" height="92" rx="20" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M28 44 90 84 152 44" fill="none" stroke="${fillB}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 114 64 78M152 114 116 78" fill="none" stroke="${fillB}" stroke-width="6" stroke-linecap="round"/>`;
    case 'bag':
      return `<path d="M40 54h100l10 70c4 18-8 34-28 34H58c-20 0-32-16-28-34Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M62 54c0-20 12-32 28-32s28 12 28 32" fill="none" stroke="${fillB}" stroke-width="6" stroke-linecap="round"/><circle cx="90" cy="100" r="12" fill="${fillB}"/>`;
    case 'key':
      return `<circle cx="60" cy="64" r="28" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M82 64h72v18h-16v16h-18V82h-18z" fill="${fillB}" stroke="${stroke}" stroke-width="4"/>`;
    case 'hourglass':
      return `<path d="M42 20h96M42 140h96M56 28c0 22 20 28 34 42-14 14-34 20-34 42M124 28c0 22-20 28-34 42 14 14 34 20 34 42" fill="none" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/><path d="M76 54h28l-14 16zM76 106h28l-14-16z" fill="${fillA}"/><circle cx="90" cy="78" r="10" fill="${fillB}"/>`;
    case 'bunny':
      return `<g stroke="${stroke}" stroke-width="4"><path d="M54 26c0-16 8-26 20-26s20 10 20 26v28H54Zm42 0c0-16 8-26 20-26s20 10 20 26v28H96Z" fill="${fillA}"/><circle cx="92" cy="88" r="40" fill="${fillA}"/><circle cx="76" cy="86" r="5" fill="${fillB}"/><circle cx="108" cy="86" r="5" fill="${fillB}"/><path d="M82 104c6 8 14 8 20 0" fill="none" stroke="${fillB}" stroke-linecap="round"/></g>`;
    case 'bear':
      return `<g stroke="${stroke}" stroke-width="4"><circle cx="56" cy="42" r="18" fill="${fillA}"/><circle cx="124" cy="42" r="18" fill="${fillA}"/><circle cx="90" cy="92" r="52" fill="${fillA}"/><circle cx="70" cy="88" r="5" fill="${fillB}"/><circle cx="110" cy="88" r="5" fill="${fillB}"/><ellipse cx="90" cy="108" rx="16" ry="12" fill="${fillB}"/></g>`;
    case 'bird':
      return `<path d="M22 96c0-34 28-62 68-62 22 0 40 8 54 24 14 0 26 8 34 20-18 4-32 14-42 28 0 30-24 54-54 54-34 0-60-28-60-64Z" fill="${fillA}" stroke="${stroke}" stroke-width="4"/><path d="M140 74h36l-18 16z" fill="${fillB}" stroke="${stroke}" stroke-width="4"/><circle cx="92" cy="82" r="6" fill="${fillB}"/>`;
    default:
      return '';
  }
};

export const createStickerSvg = (element: DecorationElement) => {
  const fillA = shapeFill(element.palette, 0, '#ffffff');
  const fillB = shapeFill(element.palette, 1, '#ffd6e7');
  const stroke = shapeFill(element.palette, 2, '#f6a6c1');

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="0 0 180 160">
      ${stickerPath(element.kind, fillA, fillB, stroke)}
    </svg>
  `);
};

export const createCharacterSvg = (character: CharacterElement, palette: TemplatePalette) => {
  const body = palette.surfaceAlt;
  const accent = palette.accent;
  const accentSoft = palette.accentSoft;
  const line = palette.line;
  const themeMarkup: Record<CharacterElement['theme'], string> = {
    'angel-cat': `
      <path d="M120 26c-24-2-42 6-54 24-10 16-12 34-6 52 10 30 34 48 70 54 20 2 36-2 48-12-10-4-18-12-26-22 20 4 38 0 54-12-16-6-28-18-36-34 0-28-20-48-50-50Z" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M98 20 76 42l10-28M148 16l-6 32 24-20" fill="${accentSoft}" stroke="${line}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M72 74c-22-20-44-20-66-2 8 14 20 26 42 28M170 74c22-20 44-20 66-2-8 14-20 26-42 28" fill="none" stroke="${accentSoft}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="116" cy="92" r="8" fill="${line}"/><circle cx="154" cy="92" r="8" fill="${line}"/><path d="M126 118c10 12 18 12 28 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'dream-sheep': `
      <circle cx="132" cy="96" r="62" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M84 78c-14-22-14-42 0-60 20 8 28 22 24 42M180 78c14-22 14-42 0-60-20 8-28 22-24 42" fill="${accentSoft}" stroke="${line}" stroke-width="6"/>
      <path d="M72 90c-10-18-24-24-44-18 8 16 20 30 38 34M192 90c10-18 24-24 44-18-8 16-20 30-38 34" fill="${accentSoft}" stroke="${line}" stroke-width="6"/>
      <circle cx="112" cy="96" r="7" fill="${line}"/><circle cx="152" cy="96" r="7" fill="${line}"/><path d="M118 124c12 10 20 10 28 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'sakura-girl': `
      <path d="M78 52c12-28 36-40 72-36 16 2 32 8 48 20-6 14-20 26-40 34 20 8 34 22 40 40-20 16-44 24-72 24-36 0-62-12-78-36-12-18-14-30-10-46 10-2 24 0 40 8-6-18-6-32 0-44Z" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M64 120c-24 22-48 26-74 12 6 20 22 34 48 42M198 138c26 16 54 14 84-6-4 24-20 42-50 52" fill="none" stroke="${accentSoft}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="118" cy="94" r="8" fill="${line}"/><circle cx="158" cy="94" r="8" fill="${line}"/><path d="M126 122c14 10 22 10 30 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'cream-bunny': `
      <path d="M104 14c0-18 10-30 24-30s24 12 24 30v40h-48Zm52 0c0-18 10-30 24-30s24 12 24 30v40h-48Z" fill="${accentSoft}" stroke="${line}" stroke-width="6"/>
      <circle cx="148" cy="98" r="62" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M100 108c-22-20-44-22-68-8 10 16 28 30 54 38" fill="none" stroke="${accentSoft}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="128" cy="94" r="7" fill="${line}"/><circle cx="170" cy="94" r="7" fill="${line}"/><path d="M136 122c12 12 22 12 32 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'idol-messenger': `
      <path d="M104 42c10-20 30-30 60-30 30 0 54 8 72 26-2 18-10 30-24 38 20 8 32 22 36 44-20 20-46 30-80 30-40 0-68-14-84-42-10-18-12-36-6-54 10-6 18-10 26-12Z" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M72 92 30 62l8 58M238 86l44-14-4 54" fill="${accentSoft}" stroke="${line}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="152" cy="92" r="8" fill="${line}"/><circle cx="194" cy="92" r="8" fill="${line}"/><path d="M160 120c12 12 22 12 32 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'lolitia-doll': `
      <path d="M94 46c14-24 40-36 78-36 28 0 52 8 72 24 0 20-8 38-22 52 12 8 20 20 24 36-18 24-44 36-80 36-42 0-72-14-90-42-12-18-16-36-10-52 10-10 20-16 28-18Z" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M90 146c-34 18-62 16-84-8 0 30 18 54 50 68M230 148c30 20 60 18 88-8-2 28-18 54-50 74" fill="none" stroke="${accentSoft}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="148" cy="96" r="8" fill="${line}"/><circle cx="192" cy="96" r="8" fill="${line}"/><path d="M160 126c12 10 22 10 32 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
    'neon-player': `
      <path d="M98 54c16-22 42-34 76-34 38 0 66 10 86 30-2 18-10 34-24 46 18 14 28 30 28 50-20 18-48 28-86 28-42 0-74-14-94-40-18-24-20-50-8-76 10-2 18-4 22-4Z" fill="${body}" stroke="${line}" stroke-width="6"/>
      <path d="M118 18h92c8 0 14 6 14 14v18H104V32c0-8 6-14 14-14Z" fill="${accentSoft}" stroke="${line}" stroke-width="6"/>
      <circle cx="150" cy="100" r="8" fill="${line}"/><circle cx="196" cy="100" r="8" fill="${line}"/><path d="M162 128c12 12 22 12 32 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    `,
  };

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${character.width}" height="${character.height}" viewBox="0 0 320 240">
      ${themeMarkup[character.theme]}
    </svg>
  `);
};
