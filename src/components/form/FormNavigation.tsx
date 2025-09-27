import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  canGoNext,
  steps
}: FormNavigationProps) {
  const { t } = useI18n();
  const progressValue = (currentStep / (totalSteps - 1)) * 100;

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {t('form.step', { current: currentStep + 1, total: totalSteps })}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressValue)}%
          </span>
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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
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
    </>
  );
}