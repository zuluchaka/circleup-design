interface WizardProgressDotsProps {
  totalSteps: number
  currentStep: number
  /** Labels for each step (shown on larger screens) */
  labels?: string[]
  onStepClick?: (step: number) => void
}

/**
 * Mobile-friendly progress indicator for wizards.
 * Shows dots on small screens, labeled bar on larger screens.
 */
export function WizardProgressDots({
  totalSteps,
  currentStep,
  labels,
  onStepClick,
}: WizardProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3 sm:hidden">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep

        return (
          <button
            key={i}
            type="button"
            onClick={() => onStepClick?.(i)}
            disabled={!onStepClick || i > currentStep}
            className={`rounded-full transition-all duration-200 ${
              isActive
                ? 'w-6 h-2 bg-indigo-600 dark:bg-indigo-500'
                : isCompleted
                  ? 'w-2 h-2 bg-indigo-400 dark:bg-indigo-600'
                  : 'w-2 h-2 bg-slate-300 dark:bg-slate-600'
            } ${onStepClick && i <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={labels?.[i] ?? `Step ${i + 1}`}
            aria-current={isActive ? 'step' : undefined}
          />
        )
      })}
    </div>
  )
}
