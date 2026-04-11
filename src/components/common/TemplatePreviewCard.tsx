import clsx from 'clsx';
import type { Template } from '../../types';

interface TemplatePreviewCardProps {
  template: Template;
  className?: string;
}

const QrMini = ({ accent, label, tilt = 0 }: { accent: string; label: string; tilt?: number }) => (
  <div className="rounded-[22px] border border-white/80 bg-white/90 p-2.5 shadow-sm" style={{ transform: `rotate(${tilt}deg)` }}>
    <div className="h-14 w-14 rounded-[16px] bg-white p-1.5">
      <div
        className="h-full w-full rounded-[12px]"
        style={{
          background: `linear-gradient(135deg, ${accent}, #ffffff)`,
          boxShadow: `inset 0 0 0 1px ${accent}55`,
        }}
      />
    </div>
    <div className="mt-2 text-center text-[10px] font-semibold text-slate-700">{label}</div>
  </div>
);

export const TemplatePreviewCard = ({ template, className }: TemplatePreviewCardProps) => {
  const isDouble = template.mode === 'double';
  const qrA = template.qrElements[0];
  const qrB = template.qrElements[1];
  const hasCharacter = Boolean(template.character);

  return (
    <div
      className={clsx('relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_18px_44px_rgba(143,120,171,0.18)]', className)}
      style={{
        background: `linear-gradient(135deg, ${template.palette.surface}, ${template.palette.surfaceAlt})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 14% 18%, ${template.palette.accentSoft}, transparent 26%), radial-gradient(circle at 86% 22%, ${template.palette.surfaceAlt}, transparent 24%), linear-gradient(180deg, transparent, ${template.palette.surface}55)`,
        }}
      />

      <div
        className="absolute left-3 right-3 top-3 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.18em]"
        style={{ borderColor: template.palette.line, color: template.palette.textSecondary, backgroundColor: 'rgba(255,255,255,0.6)' }}
      >
        {template.scene}
      </div>

      <div className={`absolute left-5 right-5 ${template.layout === 'left-character-right-double' ? 'top-12 text-left' : 'top-12 text-center'}`}>
        <div className="line-clamp-1 text-sm font-black tracking-wide" style={{ color: template.palette.textPrimary }}>
          {template.copy.title}
        </div>
        <div className="mt-1 line-clamp-2 text-[11px]" style={{ color: template.palette.textSecondary }}>
          {template.copy.subtitle}
        </div>
      </div>

      {template.layout === 'left-character-right-double' && hasCharacter && (
        <>
          <div
            className="absolute bottom-4 left-4 rounded-[28px] border border-white/70"
            style={{
              width: '28%',
              height: '62%',
              background: `linear-gradient(180deg, ${template.palette.accentSoft}, ${template.palette.surface})`,
              boxShadow: `0 14px 30px ${template.palette.line}33`,
            }}
          />
          <div className="absolute bottom-8 left-[34%] flex gap-3">
            {qrA && <QrMini accent={qrA.accentColor} label={qrA.platformName} tilt={-4} />}
            {qrB && <QrMini accent={qrB.accentColor} label={qrB.platformName} tilt={4} />}
          </div>
        </>
      )}

      {template.layout === 'classic-double' && (
        <>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-5">
            {qrA && <QrMini accent={qrA.accentColor} label={qrA.platformName} tilt={-2} />}
            {qrB && <QrMini accent={qrB.accentColor} label={qrB.platformName} tilt={2} />}
          </div>
          <div className="absolute bottom-8 left-5 h-14 w-14 rounded-full border border-white/80" style={{ background: `linear-gradient(135deg, ${template.palette.accentSoft}, #ffffff)` }} />
          <div className="absolute right-5 top-[40%] h-12 w-12 rounded-full border border-white/80" style={{ background: `linear-gradient(135deg, ${template.palette.surfaceAlt}, #ffffff)` }} />
        </>
      )}

      {template.layout === 'center-double' && (
        <>
          <div className="absolute left-1/2 top-[54%] flex -translate-x-1/2 -translate-y-1/2 gap-4">
            {qrA && <QrMini accent={qrA.accentColor} label={qrA.platformName} tilt={-5} />}
            {qrB && <QrMini accent={qrB.accentColor} label={qrB.platformName} tilt={5} />}
          </div>
          <div className="absolute left-4 top-[58%] h-10 w-20 rounded-full" style={{ background: template.palette.accentSoft, opacity: 0.7 }} />
          <div className="absolute right-4 top-[54%] h-8 w-8 rotate-12 rounded-[10px]" style={{ background: template.palette.surface, border: `2px solid ${template.palette.line}` }} />
        </>
      )}

      {template.layout === 'single-cute' && qrA && (
        <>
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
            <QrMini accent={qrA.accentColor} label={qrA.platformName} />
          </div>
          <div className="absolute bottom-5 left-1/2 w-[70%] -translate-x-1/2 text-center text-[10px] font-semibold" style={{ color: template.palette.textSecondary }}>
            {template.copy.footer}
          </div>
        </>
      )}

      {isDouble && template.layout !== 'single-cute' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.75)', color: template.palette.textSecondary }}>
          双码横版卡
        </div>
      )}
    </div>
  );
};
