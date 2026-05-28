"use client";

import * as Popover from "@radix-ui/react-popover";
import { HelpCircle } from "lucide-react";

interface HelpHintProps {
  content: React.ReactNode;
  title?: string;
}

export default function HelpHint({ content, title }: HelpHintProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Show help"
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-fg-faint hover:text-accent-fg focus-visible:text-accent-fg focus-visible:outline-none transition-colors align-middle ml-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-w-xs bg-panel border border-line rounded-xl px-3 py-2.5 shadow-xl text-xs text-fg-2 leading-relaxed normal-case tracking-normal font-normal"
        >
          {title && (
            <p className="text-[11px] font-semibold text-accent-fg mb-1">
              {title}
            </p>
          )}
          <div>{content}</div>
          <Popover.Arrow className="fill-line" width={10} height={5} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
