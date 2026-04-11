import { AlertTriangle, CheckCircle2, Layers3, Palette, QrCode, Sparkles, Type, Wand2 } from 'lucide-react';
import { useMemo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import type { BackgroundPattern, MockupScene, QrStylePreset, TextElement } from '../../types';
import { fontOptions } from '../../utils/fonts';
import { Panel } from '../common/Panel';

const patternOptions: Array<{ value: BackgroundPattern; label: string }> = [
  { value: 'gradient', label: '浅渐变' },
  { value: 'grid', label: '细格纹' },
  { value: 'lace', label: '蕾丝纹理' },
  { value: 'cloud', label: '云朵纹理' },
  { value: 'paper', label: '手账纸感' },
  { value: 'sparkle', label: '星点光斑' },
  { value: 'solid', label: '纯色底' },
];

const mockupScenes: Array<{ value: MockupScene; label: string }> = [
  { value: 'fabric', label: '布料背景' },
  { value: 'desk', label: '桌面摆拍' },
  { value: 'sparkle', label: '梦幻闪光' },
  { value: 'studio', label: '柔光摄影' },
];

const qrStylePresets: Array<{ value: QrStylePreset; label: string }> = [
  { value: 'soft-rounded', label: '柔和圆角' },
  { value: 'candy', label: '糖果圆框' },
  { value: 'bluepink', label: '粉蓝渐变' },
  { value: 'sticker', label: '贴纸白边' },
  { value: 'glow', label: '发光描边' },
  { value: 'starlight', label: '星夜光感' },
];

const textLabels: Record<TextElement['kind'], { field: string; font: string }> = {
  title: { field: '主标题', font: '标题字体' },
  subtitle: { field: '副标题', font: '副标题字体' },
  footer: { field: '底部说明', font: '底部说明字体' },
};

const TextFontControl = ({
  kind,
  value,
  onChange,
}: {
  kind: TextElement['kind'];
  value: string;
  onChange: (nextValue: string) => void;
}) => (
  <label className="grid gap-1">
    <span>{textLabels[kind].font}</span>
    <div className="relative">
      <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {fontOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </label>
);

export const InspectorPanel = () => {
  const templates = useEditorStore((state) => state.templates);
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId);
  const templateMode = useEditorStore((state) => state.templateMode);
  const previewMode = useEditorStore((state) => state.previewMode);
  const canvas = useEditorStore((state) => state.canvas);
  const mockup = useEditorStore((state) => state.mockup);
  const qrElements = useEditorStore((state) => state.qrElements);
  const textElements = useEditorStore((state) => state.textElements);
  const showDecorations = useEditorStore((state) => state.showDecorations);
  const showCharacter = useEditorStore((state) => state.showCharacter);
  const decorationScale = useEditorStore((state) => state.decorationScale);
  const updateCanvasPattern = useEditorStore((state) => state.updateCanvasPattern);
  const updateMockupScene = useEditorStore((state) => state.updateMockupScene);
  const updateTextByKind = useEditorStore((state) => state.updateTextByKind);
  const updateTextStyleByKind = useEditorStore((state) => state.updateTextStyleByKind);
  const updateQrElement = useEditorStore((state) => state.updateQrElement);
  const validateQrElement = useEditorStore((state) => state.validateQrElement);
  const setShowDecorations = useEditorStore((state) => state.setShowDecorations);
  const setShowCharacter = useEditorStore((state) => state.setShowCharacter);
  const setDecorationScale = useEditorStore((state) => state.setDecorationScale);

  const activeTemplate = useMemo(() => templates.find((item) => item.id === activeTemplateId), [activeTemplateId, templates]);
  const titleElement = textElements.find((item) => item.kind === 'title');
  const subtitleElement = textElements.find((item) => item.kind === 'subtitle');
  const footerElement = textElements.find((item) => item.kind === 'footer');
  const validationIssues = qrElements.flatMap((item) => item.processingResult?.validation?.issues ?? []);

  return (
    <div className="grid gap-4">
      <Panel title="3. 常用编辑">
        <div className="grid gap-4 text-sm">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-800">
              <Wand2 className="h-4 w-4" />
              <span className="font-semibold">{activeTemplate?.name}</span>
            </div>
            <p className="leading-6 text-slate-500">
              {activeTemplate?.scene} / {templateMode === 'double' ? '双码横版卡' : '单码卡'} / {previewMode === 'mockup' ? '场景预览' : '纯净导出'}
            </p>
          </div>

          <label className="grid gap-1">
            <span>{textLabels.title.field}</span>
            <input className="rounded-2xl border border-slate-200 px-3 py-2" value={titleElement?.text ?? ''} onChange={(event) => updateTextByKind('title', event.target.value)} />
          </label>

          <TextFontControl kind="title" value={titleElement?.fontFamily ?? fontOptions[0].value} onChange={(nextValue) => updateTextStyleByKind('title', { fontFamily: nextValue })} />

          <label className="grid gap-1">
            <span>{textLabels.subtitle.field}</span>
            <textarea className="min-h-24 rounded-2xl border border-slate-200 px-3 py-2" value={subtitleElement?.text ?? ''} onChange={(event) => updateTextByKind('subtitle', event.target.value)} />
          </label>

          <TextFontControl kind="subtitle" value={subtitleElement?.fontFamily ?? fontOptions[0].value} onChange={(nextValue) => updateTextStyleByKind('subtitle', { fontFamily: nextValue })} />

          <label className="grid gap-1">
            <span>{textLabels.footer.field}</span>
            <textarea
              className="min-h-20 rounded-2xl border border-slate-200 px-3 py-2"
              value={footerElement?.text ?? ''}
              onChange={(event) => updateTextByKind('footer', event.target.value)}
              placeholder="留空则不显示底部这行提示文案"
            />
          </label>

          <TextFontControl kind="footer" value={footerElement?.fontFamily ?? fontOptions[0].value} onChange={(nextValue) => updateTextStyleByKind('footer', { fontFamily: nextValue })} />

          <label className="grid gap-1">
            <span>卡片背景风格</span>
            <span className="text-xs text-slate-500">这里修改的是卡片内部的底纹和氛围，不会影响外部 mockup 场景。</span>
            <select className="rounded-2xl border border-slate-200 px-3 py-2" value={canvas.backgroundPattern} onChange={(event) => updateCanvasPattern(event.target.value as BackgroundPattern)}>
              {patternOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span>Mockup 场景风格</span>
            <span className="text-xs text-slate-500">这里修改的是卡片外部摆拍背景，仅在 mockup 预览模式下生效。</span>
            <select className="rounded-2xl border border-slate-200 px-3 py-2" value={mockup.scene} onChange={(event) => updateMockupScene(event.target.value as MockupScene)}>
              {mockupScenes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[22px] border border-rose-100 bg-rose-50/70 p-3">
              <div className="text-xs font-semibold text-rose-700">卡片内部</div>
              <div className="mt-2 h-16 rounded-[18px] border border-white/80 bg-[linear-gradient(135deg,#fff7fb,#ffe7ef)]" />
            </div>
            <div className="rounded-[22px] border border-violet-100 bg-violet-50/70 p-3">
              <div className="text-xs font-semibold text-violet-700">外部场景</div>
              <div className="mt-2 h-16 rounded-[18px] border border-white/80 bg-[linear-gradient(135deg,#f3f7ff,#efe7ff)]" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="4. 二维码与文案">
        <div className="grid gap-4 text-sm">
          {qrElements.map((qr) => (
            <div key={qr.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{qr.platformName}</div>
                  <div className="text-xs text-slate-500">{qr.description?.trim() || '下方说明已经支持留空，留空时不会显示在成品里。'}</div>
                </div>
                <QrCode className="h-4 w-4 text-slate-500" />
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1">
                  <span>角标文案</span>
                  <input
                    className="rounded-2xl border border-slate-200 px-3 py-2"
                    value={qr.badgeText ?? ''}
                    onChange={(event) => updateQrElement(qr.id, { badgeText: event.target.value })}
                    placeholder="例如 WeChat / 推荐 / 支付方式"
                  />
                </label>

                <label className="grid gap-1">
                  <span>平台名称</span>
                  <input className="rounded-2xl border border-slate-200 px-3 py-2" value={qr.platformName} onChange={(event) => updateQrElement(qr.id, { platformName: event.target.value })} />
                </label>

                <label className="grid gap-1">
                  <span>下方说明文案</span>
                  <textarea
                    className="min-h-20 rounded-2xl border border-slate-200 px-3 py-2"
                    value={qr.description ?? ''}
                    onChange={(event) => updateQrElement(qr.id, { description: event.target.value })}
                    placeholder="留空则不显示下方提示文案"
                  />
                </label>

                <label className="grid gap-1">
                  <span>二维码尺寸 {qr.width}px</span>
                  <input
                    type="range"
                    min={180}
                    max={420}
                    step={2}
                    value={qr.width}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      updateQrElement(qr.id, { width: next, height: next });
                    }}
                  />
                </label>

                <label className="grid gap-1">
                  <span>容器风格</span>
                  <select className="rounded-2xl border border-slate-200 px-3 py-2" value={qr.stylePreset} onChange={(event) => updateQrElement(qr.id, { stylePreset: event.target.value as QrStylePreset })}>
                    {qrStylePresets.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <details className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-soft">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">高级设置</summary>

        <div className="mt-4 grid gap-4 text-sm">
          <Panel title="装饰图层" className="border border-slate-100 bg-slate-50/80 shadow-none">
            <div className="grid gap-3">
              <label className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-700">
                  <Layers3 className="h-4 w-4" />
                  显示装饰元素
                </span>
                <input type="checkbox" checked={showDecorations} onChange={(event) => setShowDecorations(event.target.checked)} />
              </label>

              <label className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="h-4 w-4" />
                  显示角色插画
                </span>
                <input type="checkbox" checked={showCharacter} onChange={(event) => setShowCharacter(event.target.checked)} />
              </label>

              <label className="grid gap-1">
                <span>装饰缩放 {decorationScale.toFixed(2)}x</span>
                <input type="range" min={0.6} max={1.6} step={0.01} value={decorationScale} onChange={(event) => setDecorationScale(Number(event.target.value))} />
              </label>
            </div>
          </Panel>

          <Panel title="导出规格" className="border border-slate-100 bg-slate-50/80 shadow-none">
            <div className="grid gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                横版卡片基准：1400 x 900
              </div>
              <div className="pl-6 text-xs text-slate-500">场景画布更大，纯净导出会自动裁切到卡片主体。</div>
            </div>
          </Panel>

          <Panel title="可扫校验" className="border border-slate-100 bg-slate-50/80 shadow-none">
            <div className="grid gap-3">
              {qrElements.map((qr) => (
                <div key={qr.id} className="rounded-2xl bg-white p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-800">{qr.platformName}</span>
                    <button type="button" className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white" onClick={() => validateQrElement(qr.id)}>
                      重新校验
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">识别置信度：{qr.processingResult ? `${Math.round(qr.processingResult.confidence * 100)}%` : '未上传'}</p>
                </div>
              ))}

              <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${validationIssues.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {validationIssues.length === 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <span className="text-sm">{validationIssues.length === 0 ? '当前没有明显扫码风险。' : `当前有 ${validationIssues.length} 条扫码风险提醒。`}</span>
              </div>
            </div>
          </Panel>
        </div>
      </details>
    </div>
  );
};
