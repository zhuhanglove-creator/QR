import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { defaultTemplates } from '../data/templates/presets';
import { processQrAsset } from '../modules/qr-processing';
import { validateRenderedQr } from '../modules/qr-processing/validator';
import { renderQrDataUrl } from '../modules/qr-processing/renderer';
import { applyTemplateToProject, cloneTemplate } from '../modules/template-engine';
import type {
  AssetLibraryItem,
  BackgroundPattern,
  CharacterElement,
  EditorMode,
  EditorState,
  ExportConfig,
  MockupScene,
  PreviewMode,
  QrElement,
  QrProcessingResult,
  Template,
  TemplateMode,
  TextElement,
} from '../types';
import { loadEditorSnapshot, saveEditorSnapshot } from '../utils/storage';

interface EditorActions {
  applyTemplate: (templateId: string) => void;
  toggleFavorite: (templateId: string) => void;
  setTemplateMode: (mode: TemplateMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  updateCanvasPattern: (pattern: BackgroundPattern) => void;
  updateMockupScene: (scene: MockupScene) => void;
  updateTextByKind: (kind: TextElement['kind'], text: string) => void;
  updateTextStyleByKind: (kind: TextElement['kind'], patch: Partial<Pick<TextElement, 'fontFamily' | 'fontSize' | 'fontWeight' | 'color' | 'align'>>) => void;
  updateQrElement: (id: string, patch: Partial<QrElement>) => void;
  setEditorMode: (mode: EditorMode) => void;
  setExportConfig: (patch: Partial<ExportConfig>) => void;
  importTemplateJson: (json: string) => void;
  exportCurrentTemplateJson: () => string;
  addImageAsset: (asset: AssetLibraryItem) => void;
  attachBackgroundAsset: (assetId: string) => void;
  attachMockupBackgroundAsset: (assetId: string) => void;
  attachCharacterAsset: (assetId: string) => void;
  processQrUpload: (file: File, provider: 'wechat' | 'alipay' | 'generic') => Promise<void>;
  validateQrElement: (qrElementId: string) => Promise<void>;
  setShowDecorations: (visible: boolean) => void;
  setShowCharacter: (visible: boolean) => void;
  setDecorationScale: (scale: number) => void;
  resetProject: () => void;
}

const initialTemplate = cloneTemplate(defaultTemplates[0]);
const initialProject = applyTemplateToProject(initialTemplate);
const rawSnapshot = loadEditorSnapshot<Partial<EditorState>>();

const canHydrateSnapshot = (snapshot: Partial<EditorState> | null): snapshot is Partial<EditorState> =>
  Boolean(
    snapshot &&
      typeof snapshot === 'object' &&
      typeof snapshot.activeTemplateId === 'string' &&
      defaultTemplates.some((item) => item.id === snapshot.activeTemplateId),
  );

const hydratedSnapshot = canHydrateSnapshot(rawSnapshot) ? rawSnapshot : null;

const providerLabels: Record<'wechat' | 'alipay' | 'generic', string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  generic: '收款码',
};

const buildInitialState = (): EditorState => ({
  templates: cloneTemplate(defaultTemplates),
  activeTemplateId: hydratedSnapshot?.activeTemplateId ?? initialProject.activeTemplateId,
  templateMode: hydratedSnapshot?.templateMode ?? initialTemplate.mode,
  previewMode: hydratedSnapshot?.previewMode ?? 'card',
  canvas: hydratedSnapshot?.canvas ?? initialProject.canvas,
  mockup: hydratedSnapshot?.mockup ?? initialProject.mockup,
  textElements: hydratedSnapshot?.textElements ?? initialProject.textElements,
  qrElements: hydratedSnapshot?.qrElements ?? initialProject.qrElements,
  decorations: hydratedSnapshot?.decorations ?? initialProject.decorations,
  character: hydratedSnapshot?.character ?? initialProject.character,
  backgroundImage: hydratedSnapshot?.backgroundImage,
  mockupBackgroundImage: hydratedSnapshot?.mockupBackgroundImage,
  assets: hydratedSnapshot?.assets ?? [],
  exportConfig: hydratedSnapshot?.exportConfig ?? initialProject.exportConfig,
  editorMode: hydratedSnapshot?.editorMode ?? 'safe',
  validationSummary: hydratedSnapshot?.validationSummary ?? {},
  uploadedQrByProvider: hydratedSnapshot?.uploadedQrByProvider ?? {},
  showDecorations: hydratedSnapshot?.showDecorations ?? true,
  showCharacter: hydratedSnapshot?.showCharacter ?? true,
  decorationScale: hydratedSnapshot?.decorationScale ?? 1,
});

const attachUploadedResultsToQrs = (
  qrElements: QrElement[],
  uploadedQrByProvider: Partial<Record<'wechat' | 'alipay', QrProcessingResult>>,
) => {
  const activeResults = Object.entries(uploadedQrByProvider) as Array<['wechat' | 'alipay', QrProcessingResult]>;
  qrElements.forEach((qr, index) => {
    const targetProvider = qr.provider === 'generic' ? activeResults[0]?.[0] : qr.provider;
    const result = targetProvider ? uploadedQrByProvider[targetProvider] : undefined;
    if (!result) {
      return;
    }

    qr.provider = targetProvider;
    qr.platformName = providerLabels[targetProvider];
    qr.rawAssetId = result.sourceAssetId;
    qr.decodedText = result.decodedText;
    qr.processingResult = result;
    qr.style.validationLevel = result.validation?.level ?? 'warning';

    if (qrElements.length === 1 && index === 0 && activeResults.length === 1) {
      qr.title = providerLabels[targetProvider];
    }
  });
};

const applyTemplateData = (state: EditorState, template: Template) => {
  const project = applyTemplateToProject(template);
  state.activeTemplateId = template.id;
  state.templateMode = template.mode;
  state.canvas = project.canvas;
  state.mockup = project.mockup;
  state.textElements = project.textElements;
  state.qrElements = project.qrElements;
  state.decorations = project.decorations;
  state.character = project.character;
  state.exportConfig = project.exportConfig;
  attachUploadedResultsToQrs(state.qrElements, state.uploadedQrByProvider);
};

const findBestTemplate = (templates: Template[], mode: TemplateMode) => {
  const fallbackId = mode === 'double' ? 'cloud-angel-cat-double' : 'simple-cute-single';
  return templates.find((item) => item.id === fallbackId) ?? templates.find((item) => item.mode === mode) ?? templates[0];
};

const getTemplateById = (templates: Template[], templateId: string) => templates.find((item) => item.id === templateId);

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    ...buildInitialState(),

    applyTemplate: (templateId) => {
      const template = getTemplateById(get().templates, templateId);
      if (!template) {
        return;
      }

      set((state) => {
        applyTemplateData(state, template);
        saveEditorSnapshot(state);
      });
    },

    toggleFavorite: (templateId) =>
      set((state) => {
        const template = state.templates.find((item) => item.id === templateId);
        if (template) {
          template.favorite = !template.favorite;
        }
        saveEditorSnapshot(state);
      }),

    setTemplateMode: (mode) => {
      const preferred = getTemplateById(get().templates, get().activeTemplateId);
      const next = preferred?.mode === mode ? preferred : findBestTemplate(get().templates, mode);

      set((state) => {
        applyTemplateData(state, next);
        saveEditorSnapshot(state);
      });
    },

    setPreviewMode: (mode) =>
      set((state) => {
        state.previewMode = mode;
        saveEditorSnapshot(state);
      }),

    updateCanvasPattern: (pattern) =>
      set((state) => {
        state.canvas.backgroundPattern = pattern;
        saveEditorSnapshot(state);
      }),

    updateMockupScene: (scene) =>
      set((state) => {
        state.mockup.scene = scene;
        saveEditorSnapshot(state);
      }),

    updateTextByKind: (kind, text) =>
      set((state) => {
        const target = state.textElements.find((item) => item.kind === kind);
        if (target) {
          target.text = text;
        }
        saveEditorSnapshot(state);
      }),

    updateTextStyleByKind: (kind, patch) =>
      set((state) => {
        const target = state.textElements.find((item) => item.kind === kind);
        if (target) {
          Object.assign(target, patch);
        }
        saveEditorSnapshot(state);
      }),

    updateQrElement: (id, patch) =>
      set((state) => {
        const target = state.qrElements.find((item) => item.id === id);
        if (!target) {
          return;
        }

        if (patch.style) {
          target.style = { ...target.style, ...patch.style };
        }

        Object.assign(target, patch);
        saveEditorSnapshot(state);
      }),

    setEditorMode: (mode) =>
      set((state) => {
        state.editorMode = mode;
        state.qrElements.forEach((element) => {
          element.style.safeMode = mode === 'safe';
          if (mode === 'safe') {
            element.style.gradient.enabled = false;
            element.style.glowEnabled = false;
            element.style.shadow.opacity = 0.16;
          }
        });
        saveEditorSnapshot(state);
      }),

    setExportConfig: (patch) =>
      set((state) => {
        Object.assign(state.exportConfig, patch);
        saveEditorSnapshot(state);
      }),

    importTemplateJson: (json) =>
      set((state) => {
        try {
          const template = JSON.parse(json) as Template;
          state.templates.unshift(template);
          applyTemplateData(state, template);
        } catch (error) {
          console.error('Failed to import template json', error);
        }
        saveEditorSnapshot(state);
      }),

    exportCurrentTemplateJson: () => {
      const state = get();
      const activeTemplate = state.templates.find((item) => item.id === state.activeTemplateId);
      const template: Template = {
        ...(activeTemplate ?? initialTemplate),
        canvas: state.canvas,
        mockup: state.mockup,
        textElements: state.textElements,
        qrElements: state.qrElements,
        decorations: state.decorations,
        character: state.character,
        defaultExportConfig: state.exportConfig,
        updatedAt: new Date().toISOString(),
      };
      return JSON.stringify(template, null, 2);
    },

    addImageAsset: (asset) =>
      set((state) => {
        state.assets.unshift(asset);
        saveEditorSnapshot(state);
      }),

    attachBackgroundAsset: (assetId) =>
      set((state) => {
        const asset = state.assets.find((item) => item.id === assetId && item.kind === 'background');
        if (!asset) {
          return;
        }

        state.backgroundImage = asset.src;
        saveEditorSnapshot(state);
      }),

    attachMockupBackgroundAsset: (assetId) =>
      set((state) => {
        const asset = state.assets.find((item) => item.id === assetId && item.kind === 'mockup');
        if (!asset) {
          return;
        }

        state.mockupBackgroundImage = asset.src;
        saveEditorSnapshot(state);
      }),

    attachCharacterAsset: (assetId) =>
      set((state) => {
        const asset = state.assets.find((item) => item.id === assetId && item.kind === 'character');
        if (!asset || !state.character) {
          return;
        }

        state.character.src = asset.src;
        saveEditorSnapshot(state);
      }),

    processQrUpload: async (file, provider) => {
      try {
        const stateSnapshot = get();
        const targetProvider = provider === 'generic' ? (stateSnapshot.templateMode === 'double' ? 'wechat' : 'generic') : provider;
        const targetQr =
          targetProvider === 'generic'
            ? stateSnapshot.qrElements[0]
            : stateSnapshot.qrElements.find((item) => item.provider === targetProvider) ?? stateSnapshot.qrElements[0];
        if (!targetQr) {
          return;
        }

        const { asset, result } = await processQrAsset(file, targetQr.style);
        const nextUploadedProviders = new Set(Object.keys(stateSnapshot.uploadedQrByProvider) as Array<'wechat' | 'alipay'>);
        if (targetProvider !== 'generic') {
          nextUploadedProviders.add(targetProvider);
        }
        const nextMode: TemplateMode = nextUploadedProviders.size >= 2 ? 'double' : 'single';
        const nextTemplate = stateSnapshot.templateMode !== nextMode ? findBestTemplate(get().templates, nextMode) : undefined;

        set((state) => {
          state.assets.unshift({ ...asset, kind: 'qr' });

          if (targetProvider !== 'generic') {
            state.uploadedQrByProvider[targetProvider] = result;
          }

          if (nextTemplate) {
            applyTemplateData(state, nextTemplate);
          }

          if (state.qrElements.length === 1) {
            const single = state.qrElements[0];
            single.provider = targetProvider === 'generic' ? 'generic' : targetProvider;
            single.platformName = providerLabels[targetProvider];
            single.rawAssetId = asset.id;
            single.decodedText = result.decodedText;
            single.processingResult = result;
            single.style.validationLevel = result.validation?.level ?? 'warning';
            state.validationSummary[single.id] = result.validation;
            saveEditorSnapshot(state);
            return;
          }

          attachUploadedResultsToQrs(state.qrElements, state.uploadedQrByProvider);
          state.qrElements.forEach((qr) => {
            if (qr.processingResult?.validation) {
              state.validationSummary[qr.id] = qr.processingResult.validation;
            }
          });
          saveEditorSnapshot(state);
        });
      } catch (error) {
        console.error('Failed to process QR upload', error);
        if (typeof window !== 'undefined') {
          window.alert('二维码处理失败，请换一张更清晰、完整的二维码截图再试。');
        }
      }
    },

    validateQrElement: async (qrElementId) => {
      const qr = get().qrElements.find((item) => item.id === qrElementId);
      if (!qr?.processingResult?.moduleMatrix) {
        return;
      }

      const dataUrl = renderQrDataUrl(qr.processingResult.moduleMatrix, qr.style, 768);
      const validation = await validateRenderedQr(dataUrl, qr.style);

      set((state) => {
        const target = state.qrElements.find((item) => item.id === qrElementId);
        if (!target?.processingResult) {
          return;
        }
        target.processingResult.validation = validation;
        target.style.validationLevel = validation.level;
        state.validationSummary[qrElementId] = validation;
        saveEditorSnapshot(state);
      });
    },

    setShowDecorations: (visible) =>
      set((state) => {
        state.showDecorations = visible;
        saveEditorSnapshot(state);
      }),

    setShowCharacter: (visible) =>
      set((state) => {
        state.showCharacter = visible;
        saveEditorSnapshot(state);
      }),

    setDecorationScale: (scale) =>
      set((state) => {
        state.decorationScale = scale;
        saveEditorSnapshot(state);
      }),

    resetProject: () =>
      set((state) => {
        Object.assign(state, buildInitialState(), {
          templates: cloneTemplate(defaultTemplates),
          activeTemplateId: initialProject.activeTemplateId,
          templateMode: initialTemplate.mode,
          previewMode: 'card',
          canvas: initialProject.canvas,
          mockup: initialProject.mockup,
          textElements: initialProject.textElements,
          qrElements: initialProject.qrElements,
          decorations: initialProject.decorations,
          character: initialProject.character,
          backgroundImage: undefined,
          mockupBackgroundImage: undefined,
          assets: [],
          exportConfig: initialProject.exportConfig,
          validationSummary: {},
          uploadedQrByProvider: {},
          showDecorations: true,
          showCharacter: true,
          decorationScale: 1,
        });
        saveEditorSnapshot(state);
      }),
  })),
);
