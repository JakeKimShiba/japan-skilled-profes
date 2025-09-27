import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/i18n";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canGoNext: boolean;
  steps: Array<{ id: string; key: string; shortKey: string }>;
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; key: string; shortKey: string }>;
  onGoTo: (index: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, steps, onGoTo }: ProgressBarProps) {
  const { t } = useI18n();
  const progressValue = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mb-6">
      {/* Desktop: Step Navigation + Progress */}
      <div className="hidden md:flex items-center justify-center mb-4">
        {/* Step Navigation Buttons */}
        <nav 
          className="flex gap-1 items-center"
          role="tablist"
          aria-label={t('form.steps')}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { 
              e.preventDefault(); 
              const next = Math.min(currentStep + 1, totalSteps - 1);
              onGoTo(next);
            }
            if (e.key === 'ArrowLeft') { 
              e.preventDefault(); 
              const prev = Math.max(currentStep - 1, 0);
              onGoTo(prev);
            }
          }}
        >
          {steps.map((step, idx) => (
            <TooltipProvider key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onGoTo(idx)}
                    aria-current={idx === currentStep ? 'step' : undefined}
                    aria-label={`${idx + 1}. ${t(step.key)}`}
                    className={`flex-shrink-0 inline-flex items-center gap-1 h-8 px-2 rounded border transition whitespace-nowrap leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      idx === currentStep 
                        ? 'bg-primary text-primary-foreground font-semibold' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-5 h-5 text-[11px] rounded-full ${
                      idx === currentStep 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium">{t(step.shortKey)}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(step.key)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
      
      <Progress value={progressValue} className="w-full" />
      
      {/* Step indicators for mobile */}
      <div className="flex justify-center mt-3 md:hidden">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep 
                  ? 'bg-primary' 
                  : index < currentStep 
                    ? 'bg-primary/60' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  canGoNext
}: Omit<FormNavigationProps, 'steps'>) {
  const { t } = useI18n();

  return (
    <div className="flex justify-between pt-4 border-t mt-6">
      <Button 
        type="button" 
        variant="outline" 
        disabled={currentStep === 0} 
        onClick={onPrev}
      >
        {t('nav.prev')}
      </Button>
      
      {currentStep < totalSteps - 1 ? (
        <Button 
          type="button" 
          disabled={!canGoNext}
          onClick={onNext}
        >
          {t('nav.next')}
        </Button>
      ) : (
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onReset}
        >
          {t('nav.reset')}
        </Button>
      )}
    </div>
  );
}