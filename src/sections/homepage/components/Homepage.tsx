import type { HomepageProps } from '@/../product/sections/homepage/types'

import { HeroSection } from './HeroSection'
import { StatsSection } from './StatsSection'
import { BenefitsSection } from './BenefitsSection'
import { HowItWorksSection } from './HowItWorksSection'
import { TestimonialsSection } from './TestimonialsSection'
import { ComparisonSection } from './ComparisonSection'
import { CircleExamplesSection } from './CircleExamplesSection'
import { TrustSection } from './TrustSection'
import { CommunityShowcaseSection } from './CommunityShowcaseSection'
import { PricingSection } from './PricingSection'
import { FaqSection } from './FaqSection'
import { QuizSection } from './QuizSection'
import { CtaSection } from './CtaSection'
import { Footer } from './Footer'

export function Homepage({
  // Data props
  heroContent,
  trustBadges,
  benefits,
  testimonials,
  platformStats,
  partners,
  faqs,
  howItWorks,
  roscaComparison,
  circleExamples,
  culturalCommunities,
  pricingTiers,
  feeStructure,
  quizQuestions,
  languages,
  appDownload,

  // Callbacks - Navigation
  onPrimaryCtaClick,
  onSecondaryCtaClick,

  // Callbacks - Trust & Social Proof
  onViewTestimonial,
  onPartnerClick,
  onFaqExpand,

  // Callbacks - Persona Selection
  onPersonaSelect,

  // Callbacks - Pricing
  onSelectTier,
  onContactSales,

  // Callbacks - Interactive Features
  onCircleExampleClick,
  onCommunityClick,

  // Callbacks - Quiz
  onQuizStart,
  onQuizAnswer,
  onQuizComplete,

  // Callbacks - Localization
  onLanguageChange,

  // Callbacks - App Download
  onAppDownload,

  // Callbacks - Newsletter
  onNewsletterSubscribe,

  // Callbacks - Demo booking
  onDemoBook,
}: HomepageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <HeroSection
        content={heroContent}
        trustBadges={trustBadges}
        onPrimaryClick={onPrimaryCtaClick}
        onSecondaryClick={onSecondaryCtaClick}
      />

      {/* Platform Stats */}
      <StatsSection stats={platformStats} />

      {/* Benefits Overview */}
      <BenefitsSection
        benefits={benefits}
        onPersonaSelect={onPersonaSelect}
      />

      {/* How It Works */}
      <HowItWorksSection
        steps={howItWorks}
        onCtaClick={onPrimaryCtaClick}
      />

      {/* Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        onViewTestimonial={onViewTestimonial}
      />

      {/* Traditional vs CircleUp Comparison */}
      <ComparisonSection comparison={roscaComparison} />

      {/* Circle Examples */}
      <CircleExamplesSection
        examples={circleExamples}
        onCircleExampleClick={onCircleExampleClick}
        onCreateCircle={onPrimaryCtaClick}
      />

      {/* Cultural Communities */}
      <CommunityShowcaseSection
        communities={culturalCommunities}
        onCommunityClick={onCommunityClick}
      />

      {/* Trust & Security */}
      <TrustSection
        trustBadges={trustBadges}
        partners={partners}
        onPartnerClick={onPartnerClick}
      />

      {/* Pricing */}
      <PricingSection
        tiers={pricingTiers}
        feeStructure={feeStructure}
        onSelectTier={onSelectTier}
        onContactSales={onContactSales}
      />

      {/* FAQ */}
      <FaqSection
        faqs={faqs}
        onFaqExpand={onFaqExpand}
      />

      {/* Quiz Section */}
      {quizQuestions && (
        <QuizSection
          quizQuestions={quizQuestions}
          onQuizStart={onQuizStart}
          onQuizAnswer={onQuizAnswer}
          onQuizComplete={onQuizComplete}
        />
      )}

      {/* Final CTA */}
      <CtaSection
        onPrimaryClick={onPrimaryCtaClick}
        onSecondaryClick={() => onDemoBook?.('demo')}
      />

      {/* Footer */}
      <Footer
        languages={languages}
        appDownload={appDownload}
        onLanguageChange={onLanguageChange}
        onAppDownload={onAppDownload}
        onNewsletterSubscribe={onNewsletterSubscribe}
      />
    </div>
  )
}
