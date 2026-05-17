import { useState } from 'react'

// ============================================
// Types
// ============================================

type QuestionType = 'text' | 'rating' | 'multiple_choice'

interface SurveyQuestion {
  question: string
  type: QuestionType
  options?: string[]
}

interface SurveyResponseProps {
  surveyId: string
  questions: SurveyQuestion[]
  eventTitle: string
  onSubmit: (answers: Record<string, string>) => void
  onCancel: () => void
  existingAnswers?: Record<string, string>
  readOnly?: boolean
}

// ============================================
// Component
// ============================================

export function SurveyResponse({
  questions,
  eventTitle,
  onSubmit,
  onCancel,
  existingAnswers,
  readOnly = false,
}: SurveyResponseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    existingAnswers || {}
  )

  const updateAnswer = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex.toString()]: value })
  }

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k]?.trim() !== ''
  ).length

  const handleSubmit = () => {
    onSubmit(answers)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Post-Event Survey
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {eventTitle}
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <p className="font-medium text-slate-900 dark:text-white">
              {i + 1}. {q.question}
            </p>

            {q.type === 'text' && (
              <textarea
                value={answers[i.toString()] || ''}
                onChange={(e) => updateAnswer(i, e.target.value)}
                disabled={readOnly}
                placeholder="Your answer..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
                rows={3}
              />
            )}

            {q.type === 'rating' && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => !readOnly && updateAnswer(i, n.toString())}
                    disabled={readOnly}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                      answers[i.toString()] === n.toString()
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                    } disabled:cursor-default`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                {q.options?.map((opt, j) => (
                  <label
                    key={j}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={answers[i.toString()] === opt}
                      onChange={() => !readOnly && updateAnswer(i, opt)}
                      disabled={readOnly}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {answeredCount} of {questions.length} answered
          </span>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            >
              Submit Survey
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
