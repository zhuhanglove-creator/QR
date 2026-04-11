import { Download, FileJson, ImagePlus, MonitorPlay, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import type Konva from 'konva';
import type { ChangeEvent } from 'react';
import { expandCropRect, exportStageAsPng } from '../../modules/export';
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
      await exportStageAsPng(stageRef.current, exportConfig, {
        cropRect: expandCropRect(
          {
            x: canvas.cardX,
            y: canvas.cardY,
            width: canvas.width,
            height: canvas.height,
          },
          72,
          canvas.sceneWidth,
          canvas.sceneHeight,
        ),
        fileName: `${exportConfig.fileName}-card`,
        preferShareOnMobile: true,
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
      await exportStageAsPng(stageRef.current, exportConfig, {
        fileName: `${exportConfig.fileName}-mockup`,
        preferShareOnMobile: true,
      });
    } finally {
      if (previousMode !== 'mockup') {
        setPreviewMode(previousMode);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 rounded-[28px] border border-white/60 bg-white/88 px-4 py-4 shadow-soft backdrop-blur sm:px-5 sm:py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 inline-flex rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-600 sm:text-xs">
            二次元 / 可爱风 / 陪玩接单风格
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">双码收款卡模板编辑器</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            先选模板，再上传微信和支付宝二维码，最后微调文案与背景，直接导出横版成品卡片。
          </p>
        </div>

        <div className="-mx-1 overflow-x-auto pb-1">
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
