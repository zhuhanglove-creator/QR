import type {
  AssetLibraryItem,
  CanvasConfig,
  CharacterElement,
  DecorationElement,
  EditorMode,
  ExportConfig,
  MockupConfig,
  PreviewMode,
  QrElement,
  QrProcessingResult,
  Template,
  TemplateMode,
  TextElement,
  ValidationResult,
} from './template';

export interface EditorState {
  templates: Template[];
  activeTemplateId: string;
  templateMode: TemplateMode;
  previewMode: PreviewMode;
  canvas: CanvasConfig;
  mockup: MockupConfig;
  textElements: TextElement[];
  qrElements: QrElement[];
  decorations: DecorationElement[];
  character?: CharacterElement;
  backgroundImage?: string;
  mockupBackgroundImage?: string;
  assets: AssetLibraryItem[];
  exportConfig: ExportConfig;
  editorMode: EditorMode;
  validationSummary: Record<string, ValidationResult | undefined>;
  uploadedQrByProvider: Partial<Record<'wechat' | 'alipay', QrProcessingResult>>;
  showDecorations: boolean;
  showCharacter: boolean;
  decorationScale: number;
}
