import { useState } from 'react'
import type { QuizQuestions } from '@/../product/sections/homepage/types'

interface QuizSectionProps {
  quizQuestions: QuizQuestions
  onQuizStart?: (quizType: 'member' | 'organizer') => void
  onQuizAnswer?: (questionId: string, optionId: string, correct: boolean) => void
  onQuizComplete?: (quizType: 'member' | 'organizer', score: number, maxScore: number) => void
}

type QuizState = 'intro' | 'active' | 'result'

export function QuizSection({
  quizQuestions,
  onQuizStart,
  onQuizAnswer,
  onQuizComplete,
}: QuizSectionProps) {
  const [quizType, setQuizType] = useState<'member' | 'organizer'>('member')
  const [quizState, setQuizState] = useState<QuizState>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)

  const questions = quizType === 'member' ? quizQuestions.member : quizQuestions.organizer
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const maxScore = totalQuestions * 10

  const startQuiz = (type: 'member' | 'organizer') => {
    setQuizType(type)
    setQuizState('active')
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    onQuizStart?.(type)
  }

  const handleAnswerSelect = (optionId: string) => {
    if (showFeedback) return

    const option = currentQuestion.options.find(o => o.id === optionId)
    const isCorrect = option?.correct ?? false

    setSelectedAnswer(optionId)
    setAnsweredCorrectly(isCorrect)
    setShowFeedback(true)

    if (isCorrect) {
      setScore(prev => prev + 10)
    }

    onQuizAnswer?.(currentQuestion.id, optionId, isCorrect)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizState('result')
      onQuizComplete?.(quizType, score + (answeredCorrectly ? 0 : 0), maxScore)
    }
  }

  const restartQuiz = () => {
    setQuizState('intro')
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const getResultRating = () => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return { rating: 'ROSCA Pro', level: 'high', color: 'emerald' }
    if (percentage >= 50) return { rating: 'Ready to Join', level: 'medium', color: 'amber' }
    return { rating: 'Keep Learning', level: 'low', color: 'indigo' }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full mb-4">
            Readiness Assessment
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {quizState === 'intro' && 'Is a Savings Circle Right For You?'}
            {quizState === 'active' && `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            {quizState === 'result' && 'Your Results'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {quizState === 'intro' && 'Take our quick 5-minute quiz to discover if savings circles match your financial goals and learn how CircleUp works.'}
            {quizState === 'active' && 'Answer scenario-based questions to test your ROSCA knowledge.'}
            {quizState === 'result' && 'Based on your answers, here\'s our recommendation for you.'}
          </p>
        </div>

        {/* Quiz intro */}
        {quizState === 'intro' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Member Quiz Card */}
            <button
              onClick={() => startQuiz('member')}
              className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 text-left hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Member Quiz
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Perfect for those looking to join a savings circle. Learn about contributions, payouts, and building trust.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quizQuestions.member.length} questions
                </span>
              </div>
              <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:gap-3 gap-2 transition-all">
                Start Quiz
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>

            {/* Organizer Quiz Card */}
            <button
              onClick={() => startQuiz('organizer')}
              className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 text-left hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Organizer Quiz
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                For those wanting to create and manage circles. Test your knowledge of leadership, defaults, and member management.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quizQuestions.organizer.length} questions
                </span>
              </div>
              <div className="mt-6 flex items-center text-amber-600 dark:text-amber-400 font-medium group-hover:gap-3 gap-2 transition-all">
                Start Quiz
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Active quiz */}
        {quizState === 'active' && currentQuestion && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Progress bar */}
            <div className="h-2 bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Score display */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="capitalize">{quizType} Quiz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
                <span className="text-slate-400">/ {maxScore} pts</span>
              </div>
            </div>

            {/* Question */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option.id
                  const isCorrect = option.correct
                  const showCorrectness = showFeedback

                  let optionClasses = 'w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4'

                  if (!showCorrectness) {
                    optionClasses += isSelected
                      ? ' border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : ' border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  } else {
                    if (isCorrect) {
                      optionClasses += ' border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    } else if (isSelected && !isCorrect) {
                      optionClasses += ' border-red-500 bg-red-50 dark:bg-red-900/20'
                    } else {
                      optionClasses += ' border-slate-200 dark:border-slate-700 opacity-50'
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={showFeedback}
                      className={optionClasses}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        showCorrectness && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : showCorrectness && isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {showCorrectness && isCorrect ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : showCorrectness && isSelected && !isCorrect ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          option.id.toUpperCase()
                        )}
                      </span>
                      <span className={`text-base sm:text-lg ${
                        showCorrectness && isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : showCorrectness && isSelected && !isCorrect
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {option.text}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className={`mt-6 p-4 rounded-xl ${
                  answeredCorrectly
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {answeredCorrectly ? (
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <div>
                      <p className={`font-semibold mb-1 ${
                        answeredCorrectly
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        {answeredCorrectly ? 'Correct! +10 points' : 'Not quite right'}
                      </p>
                      <p className={`text-sm ${
                        answeredCorrectly
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {answeredCorrectly
                          ? currentQuestion.feedback.correct
                          : currentQuestion.feedback.incorrect}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next button */}
              {showFeedback && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {quizState === 'result' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-center p-8 sm:p-12">
            {/* Score circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={`${
                    getResultRating().color === 'emerald'
                      ? 'text-emerald-500'
                      : getResultRating().color === 'amber'
                        ? 'text-amber-500'
                        : 'text-indigo-500'
                  }`}
                  strokeDasharray={`${(score / maxScore) * 440} 440`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{score}</span>
                <span className="text-slate-500 dark:text-slate-400">/ {maxScore}</span>
              </div>
            </div>

            {/* Rating badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              getResultRating().color === 'emerald'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : getResultRating().color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
            }`}>
              {getResultRating().color === 'emerald' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              )}
              {getResultRating().rating}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {getResultRating().level === 'high' && 'You\'re ready to lead!'}
              {getResultRating().level === 'medium' && 'You\'re ready to join!'}
              {getResultRating().level === 'low' && 'Great start! Keep learning.'}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
              {getResultRating().level === 'high' && 'You have excellent knowledge of savings circles. You\'d make a great organizer or power member!'}
              {getResultRating().level === 'medium' && 'You understand the basics well. Jump into a circle and keep learning as you go!'}
              {getResultRating().level === 'low' && 'Savings circles might be new to you. Check out our educational resources to learn more!'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
              <button className={`px-6 py-3 font-semibold rounded-xl text-white transition-colors ${
                getResultRating().level === 'high'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : getResultRating().level === 'medium'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
              }`}>
                {getResultRating().level === 'high' && 'Create a Circle'}
                {getResultRating().level === 'medium' && 'Find a Circle'}
                {getResultRating().level === 'low' && 'Learn More'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
