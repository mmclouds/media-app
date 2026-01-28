'use client';

import { useMemo, useState } from 'react';

export type AssetDetailItem = {
  label: string;
  value: string;
  href?: string;
};

export type AssetDetailSection = {
  id: string;
  label: string;
  items?: AssetDetailItem[];
  text?: string;
  code?: string;
};

interface AssetDetailTabsProps {
  sections: AssetDetailSection[];
  className?: string;
}

export function AssetDetailTabs({ sections, className }: AssetDetailTabsProps) {
  const visibleSections = useMemo(
    () =>
      sections.filter(
        (section) =>
          (section.items && section.items.length > 0) ||
          (section.text && section.text.trim().length > 0) ||
          (section.code && section.code.trim().length > 0)
      ),
    [sections]
  );
  const [activeId, setActiveId] = useState(visibleSections[0]?.id ?? '');
  const activeSection = visibleSections.find(
    (section) => section.id === activeId
  );

  if (!visibleSections.length) {
    return (
      <div
        className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/60 ${
          className || ''
        }`}
      >
        No details available.
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 p-1 text-xs font-semibold">
        {visibleSections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveId(section.id)}
            className={`rounded-lg px-3 py-1 transition ${
              activeId === section.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        {activeSection?.items && activeSection.items.length > 0 && (
          <dl className="space-y-3 text-sm">
            {activeSection.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-wide text-white/40">
                  {item.label}
                </dt>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline decoration-white/30 underline-offset-2"
                  >
                    {item.value}
                  </a>
                ) : (
                  <dd className="text-white/80 break-words">{item.value}</dd>
                )}
              </div>
            ))}
          </dl>
        )}

        {activeSection?.text && activeSection.text.trim().length > 0 && (
          <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
            {activeSection.text}
          </p>
        )}

        {activeSection?.code && activeSection.code.trim().length > 0 && (
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-black/40 p-3 text-xs text-white/80">
            {activeSection.code}
          </pre>
        )}
      </div>
    </div>
  );
}
