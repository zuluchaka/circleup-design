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

interface SurveyBuilderProps {
  eventId: string
  onSave: (questions: SurveyQuestion[]) => void
  onSend: (questions: SurveyQuestion[]) => void
  onCancel: () => void
  initialQuestions?: SurveyQuestion[]
}

// ============================================
// Component
// ============================================

export function SurveyBuilder({
  onSave,
  onSend,
  onCancel,
  initialQuestions = [],
}: SurveyBuilderProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ question: '', type: 'text' }]
  )
  const [previewMode, setPreviewMode] = useState(false)

  const addQuestion = (type: QuestionType) => {
    const newQuestion: SurveyQuestion = {
      question: '',
      type,
      options: type === 'multiple_choice' ? [''] : undefined,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof SurveyQuestion, value: unknown) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    const q = updated[questionIndex]
    updated[questionIndex] = { ...q, options: [...(q.options || []), ''] }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    const options = [...(updated[questionIndex].options || [])]
    options[optionIndex] = value
    updated[questionIndex] = { ...updated[questionIndex], options }
    setQuestions(updated)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    const options = (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex)
    updated[questionIndex] = { ...updated[questionIndex], options }
    setQuestions(updated)
  }

  const validQuestions = questions.filter((q) => q.question.trim() !== '')

  if (previewMode) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Survey Preview
          </h2>
          <button
            onClick={() => setPreviewMode(false)}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
          >
            Back to Edit
          </button>
        </div>
        <div className="space-y-6">
          {validQuestions.map((q, i) => (
            <div key={i} className="space-y-2">
              <p className="font-medium text-slate-900 dark:text-white">
                {i + 1}. {q.question}
              </p>
              {q.type === 'text' && (
                <textarea
                  disabled
                  placeholder="Text answer..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400"
                  rows={2}
                />
              )}
              {q.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-400"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {q.type === 'multiple_choice' && (
                <div className="space-y-1">
                  {q.options?.map((opt, j) => (
                    <label key={j} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <input type="radio" disabled name={`preview-${i}`} />
                      {opt || '(empty)'}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Build Post-Event Survey
      </h2>

      {/* Questions */}
      <div className="space-y-6 mb-6">
        {questions.map((q, i) => (
          <div
            key={i}
            className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Question {i + 1} - {q.type.replace('_', ' ')}
              </span>
              <button
                onClick={() => removeQuestion(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(i, 'question', e.target.value)}
              placeholder="Enter question..."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />

            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                {q.options?.map((opt, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, j, e.target.value)}
                      placeholder={`Option ${j + 1}`}
                      className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => removeOption(i, j)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(i)}
                  className="text-sm text-indigo-600 dark:text-indigo-400"
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => addQuestion('text')}
          className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
        >
          + Text Question
        </button>
        <button
          onClick={() => addQuestion('rating')}
          className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
        >
          + Rating Question
        </button>
        <button
          onClick={() => addQuestion('multiple_choice')}
          className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
        >
          + Multiple Choice
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => setPreviewMode(true)}
          disabled={validQuestions.length === 0}
          className="text-sm text-indigo-600 dark:text-indigo-400 font-medium disabled:opacity-50"
        >
          Preview
        </button>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(validQuestions)}
            disabled={validQuestions.length === 0}
            className="px-4 py-2 text-sm border border-indigo-200 dark:border-indigo-700 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => onSend(validQuestions)}
            disabled={validQuestions.length === 0}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            Send to Attendees
          </button>
        </div>
      </div>
    </div>
  )
}
