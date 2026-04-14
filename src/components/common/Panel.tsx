import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface PanelProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export const Panel = ({ title, className, children }: PanelProps) => (
  <section className={clsx('flex flex-col rounded-3xl border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur', className)}>
    <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
    {children}
  </section>
);
