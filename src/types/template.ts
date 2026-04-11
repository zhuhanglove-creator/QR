export type TemplateCategory = 'anime' | 'cute' | 'commission' | 'gaming' | 'single';
export type ValidationLevel = 'pass' | 'warning' | 'fail';
export type EditorMode = 'safe' | 'advanced';
export type TemplateMode = 'single' | 'double';
export type TemplateOrientation = 'landscape' | 'portrait';
export type LayoutKind = 'classic-double' | 'left-character-right-double' | 'center-double' | 'single-cute';
export type PreviewMode = 'card' | 'mockup';
export type BackgroundPattern = 'solid' | 'gradient' | 'grid' | 'lace' | 'cloud' | 'paper' | 'sparkle';
export type StickerKind =
  | 'cloud'
  | 'star'
  | 'heart'
  | 'ribbon'
  | 'wing'
  | 'feather'
  | 'flower'
  | 'leaf'
  | 'envelope'
  | 'bag'
  | 'key'
  | 'hourglass'
  | 'bunny'
  | 'bear'
  | 'bird';
export type CharacterTheme = 'angel-cat' | 'dream-sheep' | 'sakura-girl' | 'cream-bunny' | 'idol-messenger' | 'lolitia-doll' | 'neon-player';
export type QrFrameTheme = 'lace' | 'candy' | 'cloud' | 'ribbon' | 'glow' | 'sticker';
export type QrStylePreset = 'standard' | 'soft-rounded' | 'dot' | 'bold-rounded' | 'fine-dot' | 'glow' | 'outline' | 'duotone' | 'floating' | 'candy' | 'sakura' | 'starlight' | 'bluepink' | 'sticker';
export type MockupScene = 'fabric' | 'desk' | 'sparkle' | 'studio';

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  orientation: TemplateOrientation;
  sceneWidth: number;
  sceneHeight: number;
  cardX: number;
  cardY: number;
  backgroundPattern: BackgroundPattern;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
  backgroundImageFit?: 'cover' | 'contain';
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface BorderConfig {
  enabled: boolean;
  color: string;
  width: number;
  radius: number;
}

export interface GradientConfig {
  enabled: boolean;
  from: string;
  to: string;
  angle: number;
}

export interface TextElement {
  id: string;
  kind: 'title' | 'subtitle' | 'footer';
  x: number;
  y: number;
  width: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface ImageElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string;
  fit: 'cover' | 'contain';
  opacity: number;
  rotation?: number;
  borderRadius?: number;
  role?: 'background' | 'mockup' | 'character' | 'decoration';
}

export interface DecorationElement {
  id: string;
  kind: StickerKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  zIndex: number;
  palette: string[];
}

export interface CharacterElement {
  id: string;
  theme: CharacterTheme;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  visible: boolean;
  zIndex: number;
  maskShape: 'soft' | 'circle' | 'rounded-rect';
  place: 'front' | 'behind';
  src?: string;
}

export interface QrStyleConfig {
  fgColor: string;
  bgColor: string;
  gradient: GradientConfig;
  moduleShape: 'square' | 'dot' | 'rounded' | 'soft-rounded';
  moduleRoundness: number;
  finderStyle: 'classic' | 'rounded' | 'ring';
  quietZone: number;
  border: BorderConfig;
  shadow: ShadowConfig;
  padding: number;
  safeMode: boolean;
  validationLevel: ValidationLevel;
  glowEnabled?: boolean;
  glowColor?: string;
  strokeEnabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  glassEnabled?: boolean;
}

export interface ValidationIssue {
  code: string;
  level: ValidationLevel;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  level: ValidationLevel;
  scannable: boolean;
  contrastScore: number;
  quietZoneScore: number;
  decodePassed: boolean;
  issues: ValidationIssue[];
  lastCheckedAt: string;
}

export interface QrProcessingResult {
  success: boolean;
  sourceAssetId: string;
  boundingBox?: Rect;
  cornerPoints?: Point[];
  decodedText?: string;
  correctedImageSrc?: string;
  binaryImageSrc?: string;
  moduleMatrix?: boolean[][];
  gridSize?: number;
  analysisMode?: 'exact' | 'inferred' | 'fallback';
  confidence: number;
  warnings: string[];
  validation?: ValidationResult;
}

export interface QrElement {
  id: string;
  provider: 'wechat' | 'alipay' | 'generic';
  platformName: string;
  title: string;
  description?: string;
  badgeText?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  frameTheme: QrFrameTheme;
  accentColor: string;
  iconTone: string;
  stylePreset: QrStylePreset;
  style: QrStyleConfig;
  rawAssetId?: string;
  decodedText?: string;
  processingResult?: QrProcessingResult;
}

export interface AssetLibraryItem {
  id: string;
  name: string;
  kind: 'qr' | 'background' | 'mockup' | 'character';
  mimeType: string;
  src: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface ExportConfig {
  width: number;
  height: number;
  scale: 1 | 2 | 3 | 4;
  fileName: string;
}

export interface MockupConfig {
  scene: MockupScene;
  rotation: number;
  sceneColors: string[];
  noiseOpacity: number;
  stickerScatter: boolean;
}

export interface EditableSchemaField {
  key: string;
  label: string;
  type: 'color' | 'text' | 'number' | 'boolean' | 'select' | 'image';
  target: string;
  options?: { label: string; value: string }[];
}

export interface TemplatePalette {
  surface: string;
  surfaceAlt: string;
  line: string;
  accent: string;
  accentSoft: string;
  textPrimary: string;
  textSecondary: string;
}

export interface TemplateCopy {
  title: string;
  subtitle: string;
  footer: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  mode: TemplateMode;
  orientation: TemplateOrientation;
  layout: LayoutKind;
  thumbnail: string;
  tags: string[];
  scene?: string;
  palette: TemplatePalette;
  copy: TemplateCopy;
  canvas: CanvasConfig;
  textElements: TextElement[];
  imageElements: ImageElement[];
  qrElements: QrElement[];
  decorations: DecorationElement[];
  character?: CharacterElement;
  mockup: MockupConfig;
  defaultExportConfig: ExportConfig;
  editableSchema: EditableSchemaField[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  version: string;
}
