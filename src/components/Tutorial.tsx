"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Check, BookOpen, HelpCircle } from "lucide-react";
import { TUTORIALS, GLOBAL_TUTORIAL, type Tutorial } from "@/utils/tutorials";

interface TutorialContextValue {
  openCurrent: () => void;
  openGlobal: () => void;
}

const TutorialContext = createContext<TutorialContextValue>({
  openCurrent: () => {},
  openGlobal: () => {},
});

export function useTutorial() {
  return useContext(TutorialContext);
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState<Tutorial | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const close = useCallback(() => {
    setActive(null);
    setStepIndex(0);
  }, []);

  const openCurrent = useCallback(() => {
    const tut = TUTORIALS[pathname] ?? GLOBAL_TUTORIAL;
    setActive(tut);
    setStepIndex(0);
  }, [pathname]);

  const openGlobal = useCallback(() => {
    setActive(GLOBAL_TUTORIAL);
    setStepIndex(0);
  }, []);

  const next = () => {
    if (!active) return;
    if (stepIndex < active.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      close();
    }
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const isLast = active ? stepIndex === active.steps.length - 1 : false;
  const step = active?.steps[stepIndex];

  const currentTutorial = TUTORIALS[pathname];
  const currentPageName = currentTutorial?.pageName ?? "this page";

  return (
    <TutorialContext.Provider value={{ openCurrent, openGlobal }}>
      {children}

      {/* Floating help button — visible on every page */}
      <button
        onClick={openCurrent}
        title={`How to use ${currentPageName}`}
        className="fixed top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-panel border border-line text-fg-3 text-xs font-medium hover:bg-raised hover:text-accent-fg hover:border-accent/50 transition-colors shadow-lg"
      >
        <HelpCircle className="w-4 h-4" />
        How to use this page
      </button>

      <Dialog.Root open={!!active} onOpenChange={(o) => !o && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-panel border border-line rounded-2xl shadow-2xl z-50 overflow-hidden">
            {active && step && (
              <>
                <div className="flex items-center justify-between px-5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-fg-muted font-medium uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    {active.pageName}
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="p-1 rounded-md text-fg-faint hover:text-fg-2 hover:bg-raised transition-colors"
                      aria-label="Close tutorial"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="px-5 pb-2 pt-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/15 text-accent-fg rounded-xl p-3 flex-shrink-0">
                        <step.Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Dialog.Title className="text-base font-semibold text-fg">
                          {step.title}
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-fg-3 mt-1.5 leading-relaxed">
                          {step.description}
                        </Dialog.Description>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step dots */}
                <div className="flex justify-center gap-1.5 py-3">
                  {active.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStepIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === stepIndex
                          ? "w-6 bg-accent"
                          : i < stepIndex
                          ? "w-1.5 bg-fg-muted"
                          : "w-1.5 bg-line"
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-4 bg-raised/40 border-t border-line-soft">
                  <button
                    onClick={prev}
                    disabled={stepIndex === 0}
                    className="px-3 py-1.5 rounded-lg text-sm text-fg-3 hover:bg-raised disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <span className="text-xs text-fg-faint">
                    {stepIndex + 1} of {active.steps.length}
                  </span>
                  <button
                    onClick={next}
                    className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-2 transition-colors flex items-center gap-1"
                  >
                    {isLast ? (
                      <>
                        <Check className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </TutorialContext.Provider>
  );
}
