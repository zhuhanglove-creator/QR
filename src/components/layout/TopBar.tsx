import { Download, FileJson, ImagePlus, MonitorPlay, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import type Konva from 'konva';
import type { ChangeEvent } from 'react';
import { exportStageAsPng } from '../../modules/export';
import { useEditorStore } from '../../store/editorStore';

interface TopBarProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const waitForFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

export const TopBar = ({ stageRef }: TopBarProps) => {
  const editorMode = useEditorStore((state) => state.editorMode);
  const previewMode = useEditorStore((state) => state.previewMode);
  const exportConfig = useEditorStore((state) => state.exportConfig);
  const canvas = useEditorStore((state) => state.canvas);
  const setEditorMode = useEditorStore((state) => state.setEditorMode);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const exportCurrentTemplateJson = useEditorStore((state) => state.exportCurrentTemplateJson);
  const importTemplateJson = useEditorStore((state) => state.importTemplateJson);
  const resetProject = useEditorStore((state) => state.resetProject);

  const handleExportTemplate = () => {
    const json = exportCurrentTemplateJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    importTemplateJson(text);
  };

  const handleExportCard = async () => {
    if (!stageRef.current) {
      return;
    }

    const previousMode = previewMode;
    if (previousMode !== 'card') {
      setPreviewMode('card');
      await waitForFrame();
    }

    try {
      const cardRoot = stageRef.current.findOne('#card-root');
      if (!cardRoot) {
        throw new Error('Card export node not found');
      }

      await exportStageAsPng(stageRef.current, exportConfig, {
        sourceNode: cardRoot,
        width: canvas.width,
        height: canvas.height,
        fileName: `${exportConfig.fileName}-card`,
        preferShareOnMobile: true,
        backgroundColor: undefined,
        resetPosition: true,
        resetRotation: true,
      });
    } finally {
      if (previousMode !== 'card') {
        setPreviewMode(previousMode);
      }
    }
  };

  const handleExportMockup = async () => {
    if (!stageRef.current) {
      return;
    }

    const previousMode = previewMode;
    if (previousMode !== 'mockup') {
      setPreviewMode('mockup');
      await waitForFrame();
    }

    try {
      const sceneLayer = stageRef.current.findOne('#scene-layer');
      if (!sceneLayer) {
        throw new Error('Scene export node not found');
      }

      await exportStageAsPng(stageRef.current, exportConfig, {
        sourceNode: sceneLayer,
        width: canvas.sceneWidth,
        height: canvas.sceneHeight,
        fileName: `${exportConfig.fileName}-mockup`,
        preferShareOnMobile: true,
        backgroundColor: undefined,
        resetPosition: true,
        resetRotation: true,
      });
    } finally {
      if (previousMode !== 'mockup') {
        setPreviewMode(previousMode);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 rounded-[24px] border border-white/60 bg-white/92 px-3 py-3 shadow-soft backdrop-blur sm:rounded-[28px] sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <p className="mb-1 inline-flex rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-600 sm:mb-2 sm:text-xs">
            二次元 / 可爱风 / 陪玩接单风格
          </p>
          <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-2xl">双码收款卡模板编辑器</h1>
          <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
            先选模板，再上传微信和支付宝二维码，最后微调文案与背景，直接导出横版成品卡片。
          </p>
        </div>

        <div className="grid gap-2 sm:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`rounded-2xl px-3 py-2 text-sm ${previewMode === 'card' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => setPreviewMode('card')}
            >
              <ImagePlus className="mr-1 inline-block h-4 w-4" />
              纯净导出
            </button>
            <button
              type="button"
              className={`rounded-2xl px-3 py-2 text-sm ${previewMode === 'mockup' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => setPreviewMode('mockup')}
            >
              <MonitorPlay className="mr-1 inline-block h-4 w-4" />
              Mockup
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white" onClick={handleExportCard}>
              <Download className="mr-1 inline-block h-4 w-4" />
              导出卡片
            </button>
            <button type="button" className="rounded-2xl bg-rose-500 px-3 py-2 text-sm text-white" onClick={handleExportMockup}>
              <Download className="mr-1 inline-block h-4 w-4" />
              导出场景
            </button>
          </div>

          <details className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <summary className="cursor-pointer list-none font-medium">更多操作</summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-2xl px-3 py-2 text-sm ${editorMode === 'safe' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
                onClick={() => setEditorMode('safe')}
              >
                <ShieldCheck className="mr-1 inline-block h-4 w-4" />
                安全
              </button>
              <button
                type="button"
                className={`rounded-2xl px-3 py-2 text-sm ${editorMode === 'advanced' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700'}`}
                onClick={() => setEditorMode('advanced')}
              >
                <Sparkles className="mr-1 inline-block h-4 w-4" />
                美化
              </button>
              <label className="cursor-pointer rounded-2xl bg-white px-3 py-2 text-center text-sm text-slate-700">
                <FileJson className="mr-1 inline-block h-4 w-4" />
                导入模板
                <input type="file" accept=".json" className="hidden" onChange={handleImportTemplate} />
              </label>
              <button type="button" className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-700" onClick={handleExportTemplate}>
                <FileJson className="mr-1 inline-block h-4 w-4" />
                导出模板
              </button>
              <button type="button" className="col-span-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700" onClick={resetProject}>
                <RefreshCcw className="mr-1 inline-block h-4 w-4" />
                重置
              </button>
            </div>
          </details>
        </div>

        <div className="hidden -mx-1 overflow-x-auto pb-1 sm:block">
          <div className="flex min-w-max flex-nowrap gap-2 px-1 xl:flex-wrap">
            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${previewMode === 'card' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
                onClick={() => setPreviewMode('card')}
              >
                <ImagePlus className="mr-1 inline-block h-4 w-4" />
                纯净导出
              </button>
              <button
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${previewMode === 'mockup' ? 'bg-rose-500 text-white' : 'text-slate-700'}`}
                onClick={() => setPreviewMode('mockup')}
              >
                <MonitorPlay className="mr-1 inline-block h-4 w-4" />
                Mockup 预览
              </button>
            </div>

            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${editorMode === 'safe' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
                onClick={() => setEditorMode('safe')}
              >
                <ShieldCheck className="mr-1 inline-block h-4 w-4" />
                安全
              </button>
              <button
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${editorMode === 'advanced' ? 'bg-amber-500 text-white' : 'text-slate-700'}`}
                onClick={() => setEditorMode('advanced')}
              >
                <Sparkles className="mr-1 inline-block h-4 w-4" />
                美化增强
              </button>
            </div>

            <label className="cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
              <FileJson className="mr-1 inline-block h-4 w-4" />
              导入模板
              <input type="file" accept=".json" className="hidden" onChange={handleImportTemplate} />
            </label>

            <button type="button" className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={handleExportTemplate}>
              <FileJson className="mr-1 inline-block h-4 w-4" />
              导出模板 JSON
            </button>

            <button type="button" className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800" onClick={handleExportCard}>
              <Download className="mr-1 inline-block h-4 w-4" />
              导出卡片 PNG
            </button>

            <button type="button" className="whitespace-nowrap rounded-full bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-400" onClick={handleExportMockup}>
              <Download className="mr-1 inline-block h-4 w-4" />
              导出场景图
            </button>

            <button type="button" className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={resetProject}>
              <RefreshCcw className="mr-1 inline-block h-4 w-4" />
              重置
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
