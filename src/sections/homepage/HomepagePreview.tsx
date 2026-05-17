import data from '@/../product/sections/homepage/data.json'
import { Homepage } from './components/Homepage'
import type { HomepageProps } from '@/../product/sections/homepage/types'

// Type assertion for the imported data
const homepageData = data as unknown as Omit<HomepageProps,
  | 'onPrimaryCtaClick'
  | 'onSecondaryCtaClick'
  | 'onCtaClick'
  | 'onVideoPlay'
  | 'onVideoComplete'
  | 'onViewTestimonial'
  | 'onPartnerClick'
  | 'onFaqExpand'
  | 'onPersonaSelect'
  | 'onCalculatorSubmit'
  | 'onQuizStart'
  | 'onQuizAnswer'
  | 'onQuizComplete'
  | 'onSelectTier'
  | 'onContactSales'
  | 'onChatOpen'
  | 'onContactSubmit'
  | 'onDemoBook'
  | 'onNewsletterSubscribe'
  | 'onRegisterStart'
  | 'onRegisterComplete'
  | 'onReferralCodeEnter'
  | 'onLanguageChange'
  | 'onAppDownload'
  | 'onExitIntentShow'
  | 'onExitIntentDismiss'
  | 'onExitIntentAction'
  | 'onSandboxStart'
  | 'onCircleExampleClick'
  | 'onCommunityClick'
  | 'onAmbassadorClick'
>

export default function HomepagePreview() {
  return (
    <Homepage
      // Data props
      heroContent={homepageData.heroContent}
      trustBadges={homepageData.trustBadges}
      benefits={homepageData.benefits}
      testimonials={homepageData.testimonials}
      platformStats={homepageData.platformStats}
      partners={homepageData.partners}
      faqs={homepageData.faqs}
      howItWorks={homepageData.howItWorks}
      roscaComparison={homepageData.roscaComparison}
      circleExamples={homepageData.circleExamples}
      culturalCommunities={homepageData.culturalCommunities}
      associationFeatures={homepageData.associationFeatures}
      pricingTiers={homepageData.pricingTiers}
      feeStructure={homepageData.feeStructure}
      quizQuestions={homepageData.quizQuestions}
      activityFeed={homepageData.activityFeed}
      ambassadors={homepageData.ambassadors}
      referralProgram={homepageData.referralProgram}
      mobileFeatures={homepageData.mobileFeatures}
      impactMetrics={homepageData.impactMetrics}
      demoSlots={homepageData.demoSlots}
      languages={homepageData.languages}
      appDownload={homepageData.appDownload}

      // Callbacks - Navigation
      onPrimaryCtaClick={() => console.log('Primary CTA clicked')}
      onSecondaryCtaClick={() => console.log('Secondary CTA (Watch Demo) clicked')}
      onCtaClick={(ctaId, section) => console.log('CTA clicked:', ctaId, 'in section:', section)}

      // Callbacks - Video
      onVideoPlay={(videoId) => console.log('Video play:', videoId)}
      onVideoComplete={(videoId) => console.log('Video complete:', videoId)}

      // Callbacks - Trust & Social Proof
      onViewTestimonial={(id) => console.log('View testimonial:', id)}
      onPartnerClick={(id) => console.log('Partner clicked:', id)}
      onFaqExpand={(id) => console.log('FAQ expanded:', id)}

      // Callbacks - Persona Selection
      onPersonaSelect={(persona) => console.log('Persona selected:', persona)}

      // Callbacks - Calculator Tools
      onCalculatorSubmit={(type, values) => console.log('Calculator submit:', type, values)}

      // Callbacks - Quiz
      onQuizStart={(quizType) => console.log('Quiz start:', quizType)}
      onQuizAnswer={(questionId, optionId, correct) => console.log('Quiz answer:', questionId, optionId, correct)}
      onQuizComplete={(quizType, score, maxScore) => console.log('Quiz complete:', quizType, score, '/', maxScore)}

      // Callbacks - Pricing
      onSelectTier={(tierId) => console.log('Tier selected:', tierId)}
      onContactSales={() => console.log('Contact sales clicked')}

      // Callbacks - Support
      onChatOpen={() => console.log('Chat opened')}
      onContactSubmit={(data) => console.log('Contact form submitted:', data)}
      onDemoBook={(slotId) => console.log('Demo booked:', slotId)}
      onNewsletterSubscribe={(email) => console.log('Newsletter subscribe:', email)}

      // Callbacks - Registration
      onRegisterStart={() => console.log('Registration started')}
      onRegisterComplete={(method) => console.log('Registration complete via:', method)}
      onReferralCodeEnter={(code) => console.log('Referral code entered:', code)}

      // Callbacks - Localization
      onLanguageChange={(languageCode) => console.log('Language changed:', languageCode)}

      // Callbacks - App Download
      onAppDownload={(platform) => console.log('App download:', platform)}

      // Callbacks - Exit Intent
      onExitIntentShow={() => console.log('Exit intent modal shown')}
      onExitIntentDismiss={() => console.log('Exit intent dismissed')}
      onExitIntentAction={(action) => console.log('Exit intent action:', action)}

      // Callbacks - Interactive Features
      onSandboxStart={() => console.log('Sandbox started')}
      onCircleExampleClick={(exampleId) => console.log('Circle example clicked:', exampleId)}
      onCommunityClick={(communityId) => console.log('Community clicked:', communityId)}
      onAmbassadorClick={(ambassadorId) => console.log('Ambassador clicked:', ambassadorId)}
    />
  )
}
