import { Heart, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Panel } from '../common/Panel';
import { TemplatePreviewCard } from '../common/TemplatePreviewCard';

const categoryLabels = {
  all: '全部',
  anime: '二次元',
  cute: '可爱风',
  commission: '陪玩接单',
  gaming: '电竞社交',
  single: '单码',
} as const;

export const TemplateLibraryPanel = ({ mobile = false }: { mobile?: boolean }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<keyof typeof categoryLabels>('all');
  const templates = useEditorStore((state) => state.templates);
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId);
  const templateMode = useEditorStore((state) => state.templateMode);
  const applyTemplate = useEditorStore((state) => state.applyTemplate);
  const toggleFavorite = useEditorStore((state) => state.toggleFavorite);
  const setTemplateMode = useEditorStore((state) => state.setTemplateMode);

  const filtered = useMemo(
    () =>
      templates.filter(
        (template) =>
          (category === 'all' || template.category === category) &&
          template.mode === templateMode &&
          (keyword.trim() === '' ||
            template.name.includes(keyword) ||
            template.tags.some((tag) => tag.includes(keyword)) ||
            template.scene?.includes(keyword)),
      ),
    [category, keyword, templateMode, templates],
  );

  const activeTemplate = filtered.find((item) => item.id === activeTemplateId) ?? filtered[0];

  return (
    <Panel title="1. 先选模板" className={mobile ? '' : 'max-h-[calc(100vh-170px)] overflow-hidden'}>
      <div className="grid h-full gap-4">
        <div className="rounded-[28px] border border-rose-100 bg-[linear-gradient(135deg,#fff7fb,#eef7ff)] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Sparkles className="h-4 w-4 text-rose-500" />
            先看整张模板，再决定套用
          </div>
          <p className="text-sm leading-6 text-slate-600">默认优先展示横版双码卡。手机上可以直接看大缩略图，不用切来切去。</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${templateMode === 'double' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              onClick={() => setTemplateMode('double')}
            >
              双码模板
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${templateMode === 'single' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              onClick={() => setTemplateMode('single')}
            >
              单码模板
            </button>
          </div>
        </div>

        {activeTemplate && (
          <div className="rounded-[30px] border border-slate-200 bg-white/90 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">{activeTemplate.name}</div>
                <div className="text-xs text-slate-500">{activeTemplate.scene}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">当前大预览</span>
            </div>
            <TemplatePreviewCard template={activeTemplate} className="min-h-[260px] sm:min-h-[320px]" />
            <button
              type="button"
              className="mt-3 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm text-white transition hover:bg-slate-800"
              onClick={() => applyTemplate(activeTemplate.id)}
            >
              使用当前大预览模板
            </button>
          </div>
        )}

        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none"
          placeholder="搜索模板关键词"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs ${category === key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              onClick={() => setCategory(key as keyof typeof categoryLabels)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={`grid gap-4 pr-1 ${mobile ? '' : 'overflow-y-auto'}`}>
          {filtered.map((template) => (
            <article
              key={template.id}
              className={`rounded-[30px] border bg-white/90 p-3 transition ${activeTemplateId === template.id ? 'border-slate-900 shadow-soft' : 'border-slate-200'}`}
            >
              <button type="button" className="block w-full text-left" onClick={() => applyTemplate(template.id)}>
                <TemplatePreviewCard template={template} className="min-h-[240px] sm:min-h-[280px]" />
              </button>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate font-semibold text-slate-900">{template.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {template.scene} / {template.mode === 'double' ? '双码横版卡' : '单码卡'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{template.tags.join(' / ')}</p>
                </div>
                <button type="button" className="text-slate-400" onClick={() => toggleFavorite(template.id)}>
                  <Heart className={`h-4 w-4 ${template.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Panel>
  );
};
