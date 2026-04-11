import { Download, FileJson, ImagePlus, MonitorPlay, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import type Konva from 'konva';
import type { ChangeEvent } from 'react';
import { exportStageAsPng } from '../../modules/export';
import { useEditorStore } from '../../store/editorStore';

interface TopBarProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

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

  const handleExportCard = () => {
    if (!stageRef.current) {
      return;
    }

    exportStageAsPng(stageRef.current, exportConfig, {
      cropRect: {
        x: canvas.cardX,
        y: canvas.cardY,
        width: canvas.width,
        height: canvas.height,
      },
      fileName: `${exportConfig.fileName}-card`,
    });
  };

  const handleExportMockup = () => {
    if (!stageRef.current) {
      return;
    }

    exportStageAsPng(stageRef.current, exportConfig, {
      fileName: `${exportConfig.fileName}-mockup`,
    });
  };

  return (
    <header className="rounded-[36px] border border-white/60 bg-white/80 px-5 py-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
            二次元 / 可爱风 / 陪玩接单风格
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">双码收款卡模板编辑器</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            流程改成先选模板，再上传微信和支付宝二维码，再做少量文字与背景调整，最后直接导出成品横版卡片。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${previewMode === 'card' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
              onClick={() => setPreviewMode('card')}
            >
              <ImagePlus className="mr-1 inline-block h-4 w-4" />
              纯净导出
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${previewMode === 'mockup' ? 'bg-rose-500 text-white' : 'text-slate-700'}`}
              onClick={() => setPreviewMode('mockup')}
            >
              <MonitorPlay className="mr-1 inline-block h-4 w-4" />
              Mockup 预览
            </button>
          </div>

          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${editorMode === 'safe' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
              onClick={() => setEditorMode('safe')}
            >
              <ShieldCheck className="mr-1 inline-block h-4 w-4" />
              安全
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${editorMode === 'advanced' ? 'bg-amber-500 text-white' : 'text-slate-700'}`}
              onClick={() => setEditorMode('advanced')}
            >
              <Sparkles className="mr-1 inline-block h-4 w-4" />
              美化增强
            </button>
          </div>

          <label className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
            <FileJson className="mr-1 inline-block h-4 w-4" />
            导入模板
            <input type="file" accept=".json" className="hidden" onChange={handleImportTemplate} />
          </label>

          <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={handleExportTemplate}>
            <FileJson className="mr-1 inline-block h-4 w-4" />
            导出模板 JSON
          </button>

          <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800" onClick={handleExportCard}>
            <Download className="mr-1 inline-block h-4 w-4" />
            导出卡片 PNG
          </button>

          <button type="button" className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-400" onClick={handleExportMockup}>
            <Download className="mr-1 inline-block h-4 w-4" />
            导出场景图
          </button>

          <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={resetProject}>
            <RefreshCcw className="mr-1 inline-block h-4 w-4" />
            重置
          </button>
        </div>
      </div>
    </header>
  );
};
