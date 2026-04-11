import { FolderHeart, ImageUp, MonitorSmartphone, SlidersHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';
import type Konva from 'konva';
import { CanvasWorkspace } from '../components/canvas/CanvasWorkspace';
import { TopBar } from '../components/layout/TopBar';
import { AssetLibraryPanel } from '../components/panels/AssetLibraryPanel';
import { InspectorPanel } from '../components/panels/InspectorPanel';
import { TemplateLibraryPanel } from '../components/panels/TemplateLibraryPanel';

type LeftTab = 'templates' | 'assets';
type MobileTab = 'preview' | 'templates' | 'assets' | 'settings';

const mobileTabs: Array<{ id: MobileTab; label: string; icon: typeof MonitorSmartphone }> = [
  { id: 'preview', label: '预览', icon: MonitorSmartphone },
  { id: 'templates', label: '模板', icon: FolderHeart },
  { id: 'assets', label: '上传', icon: ImageUp },
  { id: 'settings', label: '编辑', icon: SlidersHorizontal },
];

export const EditorPage = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [leftTab, setLeftTab] = useState<LeftTab>('templates');
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview');

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8fb_0%,#f6f7ff_38%,#eef8ff_100%)]">
      <div className="mx-auto grid max-w-[1720px] gap-4 p-3 pb-24 sm:p-4 sm:pb-28 lg:p-6 xl:pb-6">
        <TopBar stageRef={stageRef} />

        <div className="grid gap-4 xl:hidden">
          {mobileTab === 'preview' && <CanvasWorkspace stageRef={stageRef} compact />}
          {mobileTab === 'templates' && <TemplateLibraryPanel mobile />}
          {mobileTab === 'assets' && <AssetLibraryPanel mobile />}
          {mobileTab === 'settings' && <InspectorPanel />}
        </div>

        <div className="hidden gap-4 xl:grid xl:grid-cols-[380px_minmax(0,1fr)_360px]">
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/92 px-3 py-2 shadow-[0_-10px_30px_rgba(148,163,184,0.18)] backdrop-blur xl:hidden">
        <div className="mx-auto grid max-w-[720px] grid-cols-4 gap-2">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const active = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-medium transition ${
                  active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
                onClick={() => setMobileTab(tab.id)}
              >
                <Icon className="mb-1 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
};
