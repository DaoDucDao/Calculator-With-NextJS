"use client";

import HelpHint from "./HelpHint";

interface HelpFieldProps {
  label: React.ReactNode;
  title: string;
  content: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function HelpField({
  label,
  title,
  content,
  className = "space-y-2",
  children,
}: HelpFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs text-fg-muted font-medium uppercase tracking-wider flex items-center">
        {label}
        <HelpHint title={title} content={content} />
      </p>
      {children}
    </div>
  );
}
