import { useRef, useState } from 'react';
import type Konva from 'konva';
import { CanvasWorkspace } from '../components/canvas/CanvasWorkspace';
import { TopBar } from '../components/layout/TopBar';
import { AssetLibraryPanel } from '../components/panels/AssetLibraryPanel';
import { InspectorPanel } from '../components/panels/InspectorPanel';
import { TemplateLibraryPanel } from '../components/panels/TemplateLibraryPanel';

export const EditorPage = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [leftTab, setLeftTab] = useState<'templates' | 'assets'>('templates');

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8fb_0%,#f6f7ff_38%,#eef8ff_100%)]">
      <div className="mx-auto grid max-w-[1720px] gap-4 p-4 lg:p-6">
        <TopBar stageRef={stageRef} />
        <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)_360px]">
          <div className="grid gap-4 self-start xl:sticky xl:top-6">
            <div className="rounded-[30px] border border-white/70 bg-white/80 p-2 shadow-soft backdrop-blur">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`rounded-[22px] px-4 py-3 text-sm font-semibold transition ${leftTab === 'templates' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  onClick={() => setLeftTab('templates')}
                >
                  选模板
                </button>
                <button
                  type="button"
                  className={`rounded-[22px] px-4 py-3 text-sm font-semibold transition ${leftTab === 'assets' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'}`}
                  onClick={() => setLeftTab('assets')}
                >
                  上传图片
                </button>
              </div>
            </div>

            {leftTab === 'templates' ? <TemplateLibraryPanel /> : <AssetLibraryPanel />}
          </div>

          <div className="min-w-0">
            <CanvasWorkspace stageRef={stageRef} />
          </div>

          <div className="grid gap-4">
            <InspectorPanel />
          </div>
        </div>
      </div>
    </main>
  );
};
