import type { RoscaComparison } from '../types'

interface ComparisonSectionProps {
  comparison: RoscaComparison
}

export function ComparisonSection({ comparison }: ComparisonSectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full mb-4">
            The Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Traditional vs. CircleUp
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We honor the tradition while solving the problems that held it back.
          </p>
        </div>

        {/* Comparison table - Desktop */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 w-1/4">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border-l border-slate-200 dark:border-slate-700 w-[37.5%]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    Traditional ROSCA
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/20 border-l border-slate-200 dark:border-slate-700 w-[37.5%]">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    CircleUp
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.categories.map((category, index) => (
                <tr
                  key={category.name}
                  className={index % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {category.traditional}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {category.circleup}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison cards - Mobile */}
        <div className="md:hidden space-y-4">
          {comparison.categories.map((category) => (
            <div
              key={category.name}
              className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {category.name}
                </h4>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Traditional
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{category.traditional}</p>
                </div>
                <div className="px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/10">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    CircleUp
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{category.circleup}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary callout */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Same Community Spirit, Modern Protection
          </h3>
          <p className="text-indigo-100 max-w-2xl mx-auto">
            CircleUp doesn't replace your savings circle tradition—it makes it safer, easier, and more accessible than ever before.
          </p>
        </div>
      </div>
    </section>
  )
}
