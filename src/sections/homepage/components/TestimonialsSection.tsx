import { useState } from 'react'
import type { Testimonial, MemberTestimonial, OrganizerTestimonial } from '@/../product/sections/homepage/types'

function isMemberTestimonial(t: Testimonial): t is MemberTestimonial {
  return t.role === 'member'
}

function isOrganizerTestimonial(t: Testimonial): t is OrganizerTestimonial {
  return t.role === 'organizer'
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function TestimonialCard({
  testimonial,
  onViewTestimonial,
}: {
  testimonial: Testimonial
  onViewTestimonial?: (id: string) => void
}) {
  const isMember = isMemberTestimonial(testimonial)
  const isOrganizer = isOrganizerTestimonial(testimonial)

  return (
    <div
      className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => onViewTestimonial?.(testimonial.id)}
    >
      {/* Quote */}
      <div className="relative mb-6">
        <svg
          className="absolute -top-2 -left-2 w-8 h-8 text-indigo-200 dark:text-indigo-900"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-lg"
        />
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {testimonial.community}
          </p>
        </div>
        <span
          className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
            isMember
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}
        >
          {isMember ? 'Member' : 'Organizer'}
        </span>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
        {isMember && (
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Saved:</span>
              <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(testimonial.savingsAchieved)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Circles:</span>
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {testimonial.circlesCompleted}
              </span>
            </div>
          </div>
        )}
        {isOrganizer && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Circles:</span>
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {testimonial.circlesManaged}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Members:</span>
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {testimonial.membersManaged}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">On-time:</span>
              <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">
                {testimonial.onTimePaymentRate}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  onViewTestimonial?: (id: string) => void
}

export function TestimonialsSection({
  testimonials,
  onViewTestimonial,
}: TestimonialsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'member' | 'organizer'>('all')

  const featuredTestimonials = testimonials.filter((t) => t.featured)
  const filteredTestimonials =
    filter === 'all'
      ? featuredTestimonials
      : featuredTestimonials.filter((t) => t.role === filter)

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Real People, Real Results
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Hear from members and organizers who've transformed their savings with CircleUp.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { key: 'all' as const, label: 'All Stories' },
            { key: 'member' as const, label: 'Members' },
            { key: 'organizer' as const, label: 'Organizers' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onViewTestimonial={onViewTestimonial}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified testimonials from real users</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Stats confirmed from platform data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
