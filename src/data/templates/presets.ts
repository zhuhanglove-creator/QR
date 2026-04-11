import { nanoid } from 'nanoid';
import type {
  CanvasConfig,
  CharacterElement,
  DecorationElement,
  LayoutKind,
  MockupConfig,
  QrElement,
  QrFrameTheme,
  QrStyleConfig,
  QrStylePreset,
  Template,
  TemplateCategory,
  TemplateMode,
  TemplatePalette,
  TextElement,
} from '../../types';

const now = new Date().toISOString();

const shadow = {
  enabled: true,
  color: '#443050',
  blur: 24,
  offsetX: 0,
  offsetY: 10,
  opacity: 0.18,
};

const stylePresetMap: Record<QrStylePreset, Partial<QrStyleConfig>> = {
  standard: { moduleShape: 'square', finderStyle: 'classic' },
  'soft-rounded': { moduleShape: 'soft-rounded', moduleRoundness: 0.42, finderStyle: 'rounded' },
  dot: { moduleShape: 'dot', moduleRoundness: 0.42, finderStyle: 'rounded' },
  'bold-rounded': { moduleShape: 'rounded', moduleRoundness: 0.52, finderStyle: 'rounded' },
  'fine-dot': { moduleShape: 'dot', moduleRoundness: 0.18, finderStyle: 'classic' },
  glow: { moduleShape: 'rounded', glowEnabled: true, glowColor: '#ffffff', finderStyle: 'ring' },
  outline: { moduleShape: 'rounded', strokeEnabled: true, strokeColor: '#ffffff', strokeWidth: 1.6, finderStyle: 'ring' },
  duotone: { moduleShape: 'rounded', gradient: { enabled: true, from: '#60a5fa', to: '#f472b6', angle: 40 }, finderStyle: 'rounded' },
  floating: { moduleShape: 'rounded', glassEnabled: true, finderStyle: 'rounded' },
  candy: { moduleShape: 'dot', moduleRoundness: 0.48, finderStyle: 'rounded' },
  sakura: { moduleShape: 'soft-rounded', moduleRoundness: 0.44, finderStyle: 'rounded' },
  starlight: { moduleShape: 'rounded', gradient: { enabled: true, from: '#c084fc', to: '#60a5fa', angle: 0 }, finderStyle: 'ring' },
  bluepink: { moduleShape: 'rounded', gradient: { enabled: true, from: '#60a5fa', to: '#f9a8d4', angle: 0 }, finderStyle: 'rounded' },
  sticker: { moduleShape: 'rounded', border: { enabled: true, color: '#ffffff', width: 12, radius: 28 }, finderStyle: 'rounded' },
};

const createQrStyle = (fgColor: string, bgColor: string, preset: QrStylePreset): QrStyleConfig => ({
  fgColor,
  bgColor,
  gradient: { enabled: false, from: fgColor, to: fgColor, angle: 0 },
  moduleShape: 'rounded',
  moduleRoundness: 0.3,
  finderStyle: 'rounded',
  quietZone: 4,
  border: { enabled: false, color: '#ffffff', width: 0, radius: 24 },
  shadow,
  padding: 18,
  safeMode: true,
  validationLevel: 'pass',
  ...stylePresetMap[preset],
});

const createCanvas = (backgroundColor: string, from: string, to: string, pattern: CanvasConfig['backgroundPattern']): CanvasConfig => ({
  width: 1400,
  height: 900,
  sceneWidth: 1760,
  sceneHeight: 1220,
  cardX: 180,
  cardY: 160,
  backgroundColor,
  padding: 60,
  borderRadius: 50,
  orientation: 'landscape',
  backgroundPattern: pattern,
  backgroundGradientFrom: from,
  backgroundGradientTo: to,
  backgroundImageOpacity: 0.35,
  backgroundImageFit: 'cover',
  overlayColor: '#ffffff',
  overlayOpacity: 0.06,
});

const createText = (
  kind: TextElement['kind'],
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  color: string,
  fontWeight: number | string,
  align: TextElement['align'] = 'left',
): TextElement => ({
  id: nanoid(),
  kind,
  text,
  x,
  y,
  width,
  fontFamily: '"Trebuchet MS", "PingFang SC", "Microsoft YaHei", sans-serif',
  fontSize,
  fontWeight,
  color,
  align,
});

const createQr = (input: {
  provider: QrElement['provider'];
  platformName: string;
  title: string;
  description?: string;
  badgeText?: string;
  x: number;
  y: number;
  size: number;
  fgColor: string;
  bgColor: string;
  frameTheme: QrFrameTheme;
  stylePreset: QrStylePreset;
  accentColor: string;
}): QrElement => ({
  id: nanoid(),
  provider: input.provider,
  platformName: input.platformName,
  title: input.title,
  description: input.description,
  badgeText: input.badgeText,
  x: input.x,
  y: input.y,
  width: input.size,
  height: input.size,
  frameTheme: input.frameTheme,
  accentColor: input.accentColor,
  iconTone: '#ffffff',
  stylePreset: input.stylePreset,
  style: createQrStyle(input.fgColor, input.bgColor, input.stylePreset),
});

const createDecoration = (
  kind: DecorationElement['kind'],
  x: number,
  y: number,
  width: number,
  height: number,
  palette: string[],
  zIndex: number,
  rotation = 0,
  opacity = 1,
): DecorationElement => ({
  id: nanoid(),
  kind,
  x,
  y,
  width,
  height,
  rotation,
  opacity,
  visible: true,
  zIndex,
  palette,
});

const createCharacter = (
  theme: CharacterElement['theme'],
  x: number,
  y: number,
  width: number,
  height: number,
  place: CharacterElement['place'],
): CharacterElement => ({
  id: nanoid(),
  theme,
  x,
  y,
  width,
  height,
  opacity: 1,
  visible: true,
  zIndex: place === 'behind' ? 8 : 18,
  maskShape: 'soft',
  place,
});

const createMockup = (scene: MockupConfig['scene'], colors: string[], rotation: number): MockupConfig => ({
  scene,
  rotation,
  sceneColors: colors,
  noiseOpacity: 0.08,
  stickerScatter: true,
});

const buildDecorations = (palette: TemplatePalette, mode: TemplateMode, accentKind: DecorationElement['kind']): DecorationElement[] => {
  const colors = [palette.surfaceAlt, palette.accentSoft, palette.line];
  const extra = [palette.surface, palette.accentSoft, palette.line];
  const items = [
    createDecoration('cloud', 84, 90, 190, 126, colors, 3, -6, 0.95),
    createDecoration('star', 1210, 86, 96, 96, extra, 4, 10, 0.9),
    createDecoration('heart', 1250, 714, 94, 84, colors, 4, 10, 0.9),
    createDecoration(accentKind, 110, 694, 96, 96, extra, 4, -8, 0.95),
    createDecoration('ribbon', 1160, 650, 124, 92, [palette.accentSoft, palette.surface, palette.line], 4, 10, 0.9),
  ];

  if (mode === 'double') {
    items.push(createDecoration('wing', 624, 152, 152, 118, [palette.surfaceAlt, palette.accentSoft, palette.line], 4, 0, 0.9));
  }

  return items;
};

const buildTexts = (palette: TemplatePalette, copy: Template['copy'], layout: LayoutKind, mode: TemplateMode) => {
  if (layout === 'single-cute') {
    return [
      createText('title', copy.title, 88, 82, 1224, 54, palette.textPrimary, 800, 'center'),
      createText('subtitle', copy.subtitle, 140, 152, 1120, 24, palette.textSecondary, 500, 'center'),
      createText('footer', copy.footer, 160, 782, 1080, 22, palette.textSecondary, 600, 'center'),
    ];
  }

  if (layout === 'left-character-right-double') {
    return [
      createText('title', copy.title, 520, 84, 720, 56, palette.textPrimary, 800, 'left'),
      createText('subtitle', copy.subtitle, 520, 154, 720, 24, palette.textSecondary, 500, 'left'),
      createText('footer', copy.footer, 540, 768, 700, 22, palette.textSecondary, 600, 'left'),
    ];
  }

  if (mode === 'double') {
    return [
      createText('title', copy.title, 110, 74, 1180, 56, palette.textPrimary, 800, 'center'),
      createText('subtitle', copy.subtitle, 170, 148, 1060, 24, palette.textSecondary, 500, 'center'),
      createText('footer', copy.footer, 220, 790, 960, 22, palette.textSecondary, 600, 'center'),
    ];
  }

  return [
    createText('title', copy.title, 100, 92, 1200, 56, palette.textPrimary, 800, 'center'),
    createText('subtitle', copy.subtitle, 160, 168, 1080, 24, palette.textSecondary, 500, 'center'),
    createText('footer', copy.footer, 170, 780, 1060, 22, palette.textSecondary, 600, 'center'),
  ];
};

const buildQrs = (palette: TemplatePalette, layout: LayoutKind, mode: TemplateMode, frameTheme: QrFrameTheme) => {
  if (mode === 'single') {
    return [
      createQr({
        provider: 'generic',
        platformName: '收款码',
        title: '请扫码支持',
        description: '',
        badgeText: '单码',
        x: 510,
        y: 250,
        size: 380,
        fgColor: palette.accent,
        bgColor: '#ffffff',
        frameTheme,
        stylePreset: frameTheme === 'glow' ? 'glow' : frameTheme === 'sticker' ? 'sticker' : 'soft-rounded',
        accentColor: palette.accent,
      }),
    ];
  }

  if (layout === 'left-character-right-double') {
    return [
      createQr({
        provider: 'wechat',
        platformName: '微信支付',
        title: '微信',
        description: '',
        badgeText: 'WeChat',
        x: 820,
        y: 250,
        size: 230,
        fgColor: '#1f9d55',
        bgColor: '#ffffff',
        frameTheme,
        stylePreset: 'soft-rounded',
        accentColor: '#64d2a6',
      }),
      createQr({
        provider: 'alipay',
        platformName: '支付宝',
        title: '支付宝',
        description: '',
        badgeText: 'Alipay',
        x: 1086,
        y: 250,
        size: 230,
        fgColor: '#1677ff',
        bgColor: '#ffffff',
        frameTheme,
        stylePreset: frameTheme === 'glow' ? 'bluepink' : 'soft-rounded',
        accentColor: '#78aefb',
      }),
    ];
  }

  return [
    createQr({
      provider: 'wechat',
      platformName: '微信支付',
      title: '微信',
      description: '',
      badgeText: 'WeChat',
      x: 330,
      y: 260,
      size: 280,
      fgColor: '#1f9d55',
      bgColor: '#ffffff',
      frameTheme,
      stylePreset: frameTheme === 'candy' ? 'candy' : frameTheme === 'glow' ? 'glow' : 'soft-rounded',
      accentColor: '#61d6a6',
    }),
    createQr({
      provider: 'alipay',
      platformName: '支付宝',
      title: '支付宝',
      description: '',
      badgeText: 'Alipay',
      x: 790,
      y: 260,
      size: 280,
      fgColor: '#1677ff',
      bgColor: '#ffffff',
      frameTheme,
      stylePreset: frameTheme === 'glow' ? 'starlight' : frameTheme === 'ribbon' ? 'bluepink' : 'soft-rounded',
      accentColor: '#7daefc',
    }),
  ];
};

const createTemplate = (input: {
  id: string;
  name: string;
  category: TemplateCategory;
  mode: TemplateMode;
  layout: LayoutKind;
  scene: string;
  tags: string[];
  palette: TemplatePalette;
  copy: Template['copy'];
  pattern: CanvasConfig['backgroundPattern'];
  frameTheme: QrFrameTheme;
  accentKind: DecorationElement['kind'];
  character?: CharacterElement['theme'];
  mockup: MockupConfig;
}): Template => {
  const canvas = createCanvas(input.palette.surface, input.palette.surfaceAlt, input.palette.accentSoft, input.pattern);
  const texts = buildTexts(input.palette, input.copy, input.layout, input.mode);
  const qrElements = buildQrs(input.palette, input.layout, input.mode, input.frameTheme);
  const decorations = buildDecorations(input.palette, input.mode, input.accentKind);
  const character =
    input.character &&
    createCharacter(
      input.character,
      input.layout === 'left-character-right-double' ? 60 : 68,
      input.layout === 'left-character-right-double' ? 198 : 468,
      input.layout === 'left-character-right-double' ? 420 : 260,
      input.layout === 'left-character-right-double' ? 520 : 240,
      input.layout === 'left-character-right-double' ? 'front' : 'behind',
    );

  return {
    id: input.id,
    name: input.name,
    category: input.category,
    mode: input.mode,
    orientation: 'landscape',
    layout: input.layout,
    thumbnail: '',
    tags: input.tags,
    scene: input.scene,
    palette: input.palette,
    copy: input.copy,
    canvas,
    textElements: texts,
    imageElements: [],
    qrElements,
    decorations,
    character,
    mockup: input.mockup,
    defaultExportConfig: {
      width: canvas.width,
      height: canvas.height,
      scale: 2,
      fileName: input.id,
    },
    editableSchema: [],
    favorite: false,
    createdAt: now,
    updatedAt: now,
    version: '3.0.0',
  };
};

const palettes = {
  cloudCat: { surface: '#fff8fb', surfaceAlt: '#e6f6ff', line: '#efb4cb', accent: '#ff8db7', accentSoft: '#d8f1ff', textPrimary: '#7a4965', textSecondary: '#a06d86' },
  dreamBlue: { surface: '#fdf6ff', surfaceAlt: '#ddeeff', line: '#d5b4ee', accent: '#79a8ff', accentSoft: '#ffd7ef', textPrimary: '#73518f', textSecondary: '#8f72a8' },
  sheepGirl: { surface: '#fffdf6', surfaceAlt: '#f5ebff', line: '#d9b389', accent: '#ffba79', accentSoft: '#ead9ff', textPrimary: '#7f5d43', textSecondary: '#9e7d63' },
  sakura: { surface: '#fff7f9', surfaceAlt: '#ffe8f0', line: '#f0a4c4', accent: '#ff7db2', accentSoft: '#ffd9ea', textPrimary: '#904f6d', textSecondary: '#b06f8d' },
  cream: { surface: '#fffdf7', surfaceAlt: '#fff1de', line: '#e6c8a6', accent: '#f6a49a', accentSoft: '#fff0d1', textPrimary: '#84614f', textSecondary: '#aa856f' },
  starnight: { surface: '#f9f6ff', surfaceAlt: '#ece4ff', line: '#bda4f1', accent: '#a97eff', accentSoft: '#dde5ff', textPrimary: '#67519a', textSecondary: '#8671b8' },
  idol: { surface: '#fffafb', surfaceAlt: '#eef4ff', line: '#f1aac5', accent: '#ff7fb3', accentSoft: '#dce9ff', textPrimary: '#82506c', textSecondary: '#9e6c88' },
  lolita: { surface: '#fff9fb', surfaceAlt: '#f8ecf7', line: '#d9a7bf', accent: '#d282b6', accentSoft: '#ffe2f6', textPrimary: '#73495e', textSecondary: '#916579' },
  social: { surface: '#f8fdff', surfaceAlt: '#dff5ff', line: '#9dc7e8', accent: '#ff9dc5', accentSoft: '#d9efff', textPrimary: '#4c6791', textSecondary: '#6b83a8' },
  neon: { surface: '#12131f', surfaceAlt: '#271b3f', line: '#ff4aa3', accent: '#8d5bff', accentSoft: '#23335e', textPrimary: '#f6f1ff', textSecondary: '#d1c5ff' },
  glow: { surface: '#fbfbff', surfaceAlt: '#e9ecff', line: '#94b6ff', accent: '#6f8fff', accentSoft: '#ffd5ef', textPrimary: '#4f5b9a', textSecondary: '#727db4' },
  gradient: { surface: '#fef7ff', surfaceAlt: '#eadbff', line: '#d497ff', accent: '#ff80d8', accentSoft: '#d8d9ff', textPrimary: '#6f4f9a', textSecondary: '#8f6bb8' },
  singleCute: { surface: '#fff9fd', surfaceAlt: '#ffe2ee', line: '#f2b7cf', accent: '#ff8fbc', accentSoft: '#fff2f8', textPrimary: '#8d5672', textSecondary: '#b27a95' },
  singleBlue: { surface: '#f5fbff', surfaceAlt: '#dff2ff', line: '#9cccec', accent: '#66aef8', accentSoft: '#edf8ff', textPrimary: '#466f97', textSecondary: '#6b8eaf' },
  singleStar: { surface: '#f6f3ff', surfaceAlt: '#dfe0ff', line: '#afa8ef', accent: '#887dff', accentSoft: '#edf1ff', textPrimary: '#5e58a2', textSecondary: '#807ac1' },
  singleGuochao: { surface: '#fff7ef', surfaceAlt: '#ffe3c7', line: '#d77c54', accent: '#e84a3a', accentSoft: '#fff2db', textPrimary: '#8c3b2a', textSecondary: '#ab5b40' },
} satisfies Record<string, TemplatePalette>;

export const defaultTemplates: Template[] = [
  createTemplate({
    id: 'cloud-angel-cat-double',
    name: '云朵天使猫双码卡',
    category: 'anime',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '奶白云朵 / 天使贴纸',
    tags: ['双码', '天使猫', '原创'],
    palette: palettes.cloudCat,
    copy: { title: '今日收款小卡', subtitle: '云朵、猫耳和软糖质感一起把氛围拉满。', footer: '支持微信与支付宝双码并排' },
    pattern: 'cloud',
    frameTheme: 'cloud',
    accentKind: 'bunny',
    character: 'angel-cat',
    mockup: createMockup('fabric', ['#fff8fb', '#f2f8ff', '#fde7f2'], -5),
  }),
  createTemplate({
    id: 'pinkblue-dream-double',
    name: '粉蓝梦幻双码卡',
    category: 'cute',
    mode: 'double',
    layout: 'center-double',
    scene: '粉蓝果冻 / 星星漂浮',
    tags: ['双码', '粉蓝', '马卡龙'],
    palette: palettes.dreamBlue,
    copy: { title: 'Dream Pay Card', subtitle: '像陪玩小卡，也像手账贴纸拼成的软萌名片。', footer: '中置双码布局' },
    pattern: 'sparkle',
    frameTheme: 'candy',
    accentKind: 'star',
    mockup: createMockup('sparkle', ['#ffe5f3', '#dcecff', '#fbf7ff'], -4),
  }),
  createTemplate({
    id: 'sheep-girl-double',
    name: '小羊少女双码卡',
    category: 'anime',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '奶油米白 / 少女小羊',
    tags: ['双码', '小羊', '少女感'],
    palette: palettes.sheepGirl,
    copy: { title: '温柔接单中', subtitle: '轻柔奶油底色，角色区与收款区保持清晰分区。', footer: '像约稿卡一样精致' },
    pattern: 'paper',
    frameTheme: 'lace',
    accentKind: 'flower',
    character: 'dream-sheep',
    mockup: createMockup('desk', ['#fffdf6', '#faf0e1', '#f4e6ff'], -3),
  }),
  createTemplate({
    id: 'sakura-sweet-double',
    name: '樱花甜妹双码卡',
    category: 'cute',
    mode: 'double',
    layout: 'classic-double',
    scene: '樱花粉 / 甜系贴纸',
    tags: ['双码', '樱花', '甜妹'],
    palette: palettes.sakura,
    copy: { title: '请扫樱花小卡', subtitle: '圆角外框、浅描边和贴纸感角标一起构成甜软气质。', footer: '双码并排更清晰' },
    pattern: 'lace',
    frameTheme: 'ribbon',
    accentKind: 'flower',
    character: 'sakura-girl',
    mockup: createMockup('fabric', ['#fff5fa', '#ffe9f1', '#fff4fd'], -6),
  }),
  createTemplate({
    id: 'cream-bunny-double',
    name: '奶油兔兔双码卡',
    category: 'cute',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '奶油曲奇 / 兔兔丝带',
    tags: ['双码', '兔兔', '奶油'],
    palette: palettes.cream,
    copy: { title: '奶油兔兔请付款', subtitle: '暖奶油底色配丝带二维码框，适合软萌向接单。', footer: '左角色右双码布局' },
    pattern: 'paper',
    frameTheme: 'ribbon',
    accentKind: 'bag',
    character: 'cream-bunny',
    mockup: createMockup('studio', ['#fff9ef', '#f8ebdb', '#fff2de'], -4),
  }),
  createTemplate({
    id: 'starnight-lilac-double',
    name: '星夜浅紫双码卡',
    category: 'anime',
    mode: 'double',
    layout: 'center-double',
    scene: '浅紫夜空 / 星星漂浮',
    tags: ['双码', '星夜', '浅紫'],
    palette: palettes.starnight,
    copy: { title: 'Starry Support Card', subtitle: '更轻更净的浅紫夜空，不走厚重海报感。', footer: '星光环绕双码' },
    pattern: 'sparkle',
    frameTheme: 'glow',
    accentKind: 'star',
    mockup: createMockup('sparkle', ['#f7f5ff', '#ebe7ff', '#dde7ff'], -5),
  }),
  createTemplate({
    id: 'idol-cheer-double',
    name: '偶像应援风双码卡',
    category: 'anime',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '应援小卡 / 信使翅膀',
    tags: ['双码', '偶像', '应援'],
    palette: palettes.idol,
    copy: { title: '应援收款小卡', subtitle: '适合头像定制、应援赞助、陪伴型服务展示。', footer: '角色可替换' },
    pattern: 'grid',
    frameTheme: 'sticker',
    accentKind: 'envelope',
    character: 'idol-messenger',
    mockup: createMockup('desk', ['#fff8fb', '#ecf3ff', '#ffe7f0'], -3),
  }),
  createTemplate({
    id: 'lolita-lace-double',
    name: '洛丽塔蕾丝双码卡',
    category: 'cute',
    mode: 'double',
    layout: 'classic-double',
    scene: '蕾丝边 / 手账卡',
    tags: ['双码', '洛丽塔', '蕾丝'],
    palette: palettes.lolita,
    copy: { title: 'Lolita Pay Card', subtitle: '蕾丝纹理、白边贴纸和淡粉阴影强调成品感。', footer: '双码小卡风格' },
    pattern: 'lace',
    frameTheme: 'lace',
    accentKind: 'key',
    character: 'lolitia-doll',
    mockup: createMockup('fabric', ['#fff8fb', '#f8eef9', '#fbeaf3'], -5),
  }),
  createTemplate({
    id: 'pinkblue-social-double',
    name: '粉蓝社交接单卡',
    category: 'commission',
    mode: 'double',
    layout: 'classic-double',
    scene: '社交引流 / 粉蓝渐变',
    tags: ['双码', '接单', '社交'],
    palette: palettes.social,
    copy: { title: '社交接单双码卡', subtitle: '更适合引流、陪玩、接单、打赏等多平台触达场景。', footer: '社交风双码卡' },
    pattern: 'grid',
    frameTheme: 'cloud',
    accentKind: 'bird',
    mockup: createMockup('desk', ['#f3fcff', '#dff3ff', '#ffe7f2'], -2),
  }),
  createTemplate({
    id: 'blackpink-esports-double',
    name: '黑粉电竞双码卡',
    category: 'gaming',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '电竞霓虹 / 黑粉发光',
    tags: ['双码', '电竞', '黑粉'],
    palette: palettes.neon,
    copy: { title: '电竞接单双码卡', subtitle: '保留电竞感，但版式仍然是横版卡片。', footer: '双平台收款' },
    pattern: 'sparkle',
    frameTheme: 'glow',
    accentKind: 'hourglass',
    character: 'neon-player',
    mockup: createMockup('studio', ['#0f1020', '#25173f', '#1b2948'], -4),
  }),
  createTemplate({
    id: 'glow-frame-double',
    name: '发光边框双码卡',
    category: 'commission',
    mode: 'double',
    layout: 'center-double',
    scene: '浅冷光 / 发光描边',
    tags: ['双码', '发光', '边框'],
    palette: palettes.glow,
    copy: { title: 'Glowing Duo Card', subtitle: '把双码做成像实体塑封卡一样的发光边框效果。', footer: '发光边框双码' },
    pattern: 'sparkle',
    frameTheme: 'glow',
    accentKind: 'feather',
    mockup: createMockup('studio', ['#f9fbff', '#ebefff', '#f8e9ff'], -3),
  }),
  createTemplate({
    id: 'violet-gradient-double',
    name: '紫粉渐变接单卡',
    category: 'commission',
    mode: 'double',
    layout: 'classic-double',
    scene: '紫粉渐变 / 引流卡',
    tags: ['双码', '紫粉', '接单'],
    palette: palettes.gradient,
    copy: { title: '紫粉渐变接单卡', subtitle: '偏陪玩和社交名片方向，轻甜而不廉价。', footer: '默认横版导出' },
    pattern: 'gradient',
    frameTheme: 'candy',
    accentKind: 'star',
    mockup: createMockup('fabric', ['#fcf4ff', '#eadbff', '#ffdff3'], -4),
  }),
  createTemplate({
    id: 'social-funnel-double',
    name: '社交平台引流风双码卡',
    category: 'commission',
    mode: 'double',
    layout: 'left-character-right-double',
    scene: '轻社交 / 导流小卡',
    tags: ['双码', '引流', '平台'],
    palette: palettes.social,
    copy: { title: '双平台引流收款卡', subtitle: '更像社交主页延伸出来的可爱小卡，而不是纯付款工具。', footer: '平台名可自定义' },
    pattern: 'cloud',
    frameTheme: 'sticker',
    accentKind: 'envelope',
    character: 'idol-messenger',
    mockup: createMockup('desk', ['#f7fdff', '#e8f6ff', '#fdf2f9'], -2),
  }),
  createTemplate({
    id: 'simple-cute-single',
    name: '简约可爱单码卡',
    category: 'single',
    mode: 'single',
    layout: 'single-cute',
    scene: '奶白单码 / 轻贴纸',
    tags: ['单码', '简约', '可爱'],
    palette: palettes.singleCute,
    copy: { title: '请扫码支持', subtitle: '简约可爱版本，适合只上传一个二维码的场景。', footer: '' },
    pattern: 'cloud',
    frameTheme: 'sticker',
    accentKind: 'heart',
    mockup: createMockup('fabric', ['#fff8fc', '#ffe6ef', '#fff3f8'], -5),
  }),
  createTemplate({
    id: 'pink-single-card',
    name: '粉色单码卡',
    category: 'single',
    mode: 'single',
    layout: 'single-cute',
    scene: '粉色奶油 / 少女感',
    tags: ['单码', '粉色', '甜系'],
    palette: palettes.singleCute,
    copy: { title: '粉色单码收款卡', subtitle: '留白更柔和，二维码边框像奶油贴纸。', footer: '' },
    pattern: 'lace',
    frameTheme: 'ribbon',
    accentKind: 'flower',
    mockup: createMockup('fabric', ['#fff7fb', '#ffe5ef', '#fff0f6'], -4),
  }),
  createTemplate({
    id: 'blue-single-card',
    name: '蓝色单码卡',
    category: 'single',
    mode: 'single',
    layout: 'single-cute',
    scene: '轻蓝云朵 / 清爽单码',
    tags: ['单码', '蓝色', '云朵'],
    palette: palettes.singleBlue,
    copy: { title: '蓝色单码小卡', subtitle: '适合更干净清爽的付款展示，也能维持可爱气质。', footer: '' },
    pattern: 'cloud',
    frameTheme: 'cloud',
    accentKind: 'bird',
    mockup: createMockup('desk', ['#f3fbff', '#dff1ff', '#edf7ff'], -3),
  }),
  createTemplate({
    id: 'starry-single-card',
    name: '星空单码卡',
    category: 'single',
    mode: 'single',
    layout: 'single-cute',
    scene: '浅紫星空 / 发光边',
    tags: ['单码', '星空', '梦幻'],
    palette: palettes.singleStar,
    copy: { title: '星空单码卡', subtitle: '把单码卡也做成完整的小成品，而不是双码阉割版。', footer: '' },
    pattern: 'sparkle',
    frameTheme: 'glow',
    accentKind: 'star',
    mockup: createMockup('sparkle', ['#f7f4ff', '#e6e4ff', '#edf1ff'], -5),
  }),
  createTemplate({
    id: 'guochao-red-single',
    name: '国潮红包单码卡',
    category: 'single',
    mode: 'single',
    layout: 'single-cute',
    scene: '红包国潮 / 暖金边',
    tags: ['单码', '国潮', '红包'],
    palette: palettes.singleGuochao,
    copy: { title: '红包单码小卡', subtitle: '保留国潮喜庆感，但依然维持卡片化和轻量排版。', footer: '' },
    pattern: 'grid',
    frameTheme: 'lace',
    accentKind: 'bag',
    mockup: createMockup('desk', ['#fff8ee', '#ffe7c9', '#fff2dd'], -2),
  }),
];
