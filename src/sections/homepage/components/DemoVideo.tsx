import { useEffect, useRef, useCallback } from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'

// ─── Constants ───────────────────────────────────────────────────────────────
const FPS = 30
const DURATION_SECONDS = 45
const TOTAL_FRAMES = FPS * DURATION_SECONDS
const FADE_FRAMES = 10

// ─── Crossfade wrapper ──────────────────────────────────────────────────────
function FadeScene({ children, durationInFrames }: { children: React.ReactNode; durationInFrames: number }) {
  const frame = useCurrentFrame()

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  )
}

// ─── Narration config per scene ──────────────────────────────────────────────
const NARRATION: { startFrame: number; text: string }[] = [
  { startFrame: 15, text: 'What if your community could save together — and everyone wins?' },
  { startFrame: 4 * FPS + 15, text: 'Marie dreams of a bakery. Jean needs school fees. Amara is saving for her first home.' },
  { startFrame: 9 * FPS + 15, text: 'But traditional tontines break down. Money disappears. Records are lost. Trust is shattered.' },
  { startFrame: 14 * FPS + 15, text: 'CircleUp digitizes your tontine. Every franc tracked. Every payment automatic. Every member accountable.' },
  { startFrame: 19 * FPS + 15, text: 'Create your circle in sixty seconds. Invite members by link. CircleUp handles the rest.' },
  { startFrame: 24 * FPS + 15, text: "Each month, one member receives the full pool. Marie gets her bakery fund. Everyone's turn comes." },
  { startFrame: 29 * FPS + 15, text: 'Life happens. The built-in emergency fund means no member is ever left behind.' },
  { startFrame: 34 * FPS + 15, text: 'Swiss-hosted. Bank-grade security. Trust scores that reward reliability.' },
  { startFrame: 39 * FPS + 15, text: 'Forty-five thousand members already saving together. Start your circle at circleup.ch.' },
]

// ─── Subtitle Bar ────────────────────────────────────────────────────────────
function SubtitleBar() {
  const frame = useCurrentFrame()

  const active = [...NARRATION].reverse().find(n => frame >= n.startFrame)
  if (!active) return null

  const localFrame = frame - active.startFrame
  const opacity = interpolate(localFrame, [0, 8, 100, 120], [0, 1, 1, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      className="absolute bottom-8 left-1/2 z-20 max-w-3xl w-full px-6"
      style={{ transform: 'translateX(-50%)', opacity }}
    >
      <div className="bg-black/70 backdrop-blur-md rounded-xl px-8 py-4 border border-white/10">
        <p className="text-lg text-white text-center font-medium leading-relaxed">
          {active.text}
        </p>
      </div>
    </div>
  )
}

// ─── Sound wave visualizer (decorative) ─────────────────────────────────────
function SoundWave({ color = 'amber' }: { color?: string }) {
  const frame = useCurrentFrame()
  const bars = 5
  const colorClass = color === 'amber' ? 'bg-amber-400' : 'bg-indigo-400'

  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: bars }).map((_, i) => {
        const height = interpolate(
          Math.sin((frame + i * 8) * 0.15),
          [-1, 1],
          [20, 100],
        )
        return (
          <div
            key={i}
            className={`w-1 rounded-full ${colorClass}`}
            style={{ height: `${height}%`, opacity: 0.8 }}
          />
        )
      })}
    </div>
  )
}

// ─── Scene 1: The Promise (0–4s) ────────────────────────────────────────────
function IntroScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } })
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = interpolate(frame, [15, 35], [30, 0], { extrapolateRight: 'clamp' })
  const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' })
  const shimmer = interpolate(frame, [0, 120], [-100, 200], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
          top: '10%', left: '15%',
          opacity: interpolate(frame, [0, 40], [0, 0.6], { extrapolateRight: 'clamp' }),
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
          bottom: '10%', right: '15%',
          opacity: interpolate(frame, [10, 50], [0, 0.5], { extrapolateRight: 'clamp' }),
        }}
      />

      <div className="flex flex-col items-center z-10">
        <div
          className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border-2 border-indigo-400/30"
          style={{ transform: `scale(${logoScale})` }}
        >
          <span className="text-4xl font-bold text-white">C</span>
          <span className="text-4xl font-bold text-amber-400">U</span>
        </div>

        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }} className="mt-8">
          <h1 className="text-6xl font-bold text-white tracking-tight text-center">
            Circle<span className="text-amber-400">Up</span>
          </h1>
        </div>

        <div style={{ opacity: subtitleOpacity }} className="mt-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <SoundWave />
            <p className="text-xl text-slate-300 text-center font-medium">
              Save Together, Grow Together
            </p>
            <SoundWave />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              transform: `translateX(${shimmer}%)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 2: The Story — Real People, Real Dreams (4–9s) ───────────────────
function StoryScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const members = [
    { name: 'Marie', flag: '🇨🇲', dream: 'Open a bakery', color: 'from-rose-400 to-rose-600', initials: 'M' },
    { name: 'Jean', flag: '🇨🇩', dream: "Daughter's school fees", color: 'from-indigo-400 to-indigo-600', initials: 'J' },
    { name: 'Amara', flag: '🇳🇬', dream: 'First home deposit', color: 'from-emerald-400 to-emerald-600', initials: 'A' },
    { name: 'Kofi', flag: '🇬🇭', dream: 'Start a business', color: 'from-amber-400 to-amber-600', initials: 'K' },
  ]

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-10 text-center"
          style={{ opacity: headingOpacity }}
        >
          Real <span className="text-amber-400">Dreams</span>
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {members.map((member, i) => {
            const delay = 10 + i * 20
            const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100 } })

            return (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4"
                style={{ transform: `scale(${s})`, opacity: s }}
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{member.name}</span>
                    <span className="text-lg">{member.flag}</span>
                  </div>
                  <p className="text-sm text-slate-400">{member.dream}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 3: The Problem — Trust Broken (9–14s) ────────────────────────────
function ProblemScene() {
  const frame = useCurrentFrame()

  const items = [
    { icon: '💸', text: 'Money disappears without a trace' },
    { icon: '📋', text: 'Handwritten records get lost or disputed' },
    { icon: '🤝', text: 'Broken promises destroy friendships' },
  ]

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const headingY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-16">
      <div className="w-full max-w-2xl">
        <h2
          className="text-4xl font-bold text-white mb-12 text-center"
          style={{ opacity: headingOpacity, transform: `translateY(${headingY}px)` }}
        >
          Trust <span className="text-rose-400">Broken</span>
        </h2>

        <div className="space-y-6">
          {items.map((item, i) => {
            const delay = 15 + i * 20
            const itemOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })
            const itemX = interpolate(frame, [delay, delay + 15], [-40, 0], { extrapolateRight: 'clamp' })
            const strikethrough = interpolate(frame, [delay + 30, delay + 45], [0, 100], { extrapolateRight: 'clamp' })

            return (
              <div
                key={i}
                className="flex items-center gap-5 bg-white/5 rounded-xl px-6 py-5 border border-white/10"
                style={{ opacity: itemOpacity, transform: `translateX(${itemX}px)` }}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-lg text-slate-300 relative">
                  {item.text}
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-rose-400"
                    style={{ width: `${strikethrough}%` }}
                  />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 4: The Solution — Enter CircleUp (14–19s) ────────────────────────
function SolutionScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const features = [
    { icon: '🔄', title: 'Automated Payments', desc: 'Stripe, TWINT & bank transfers', color: 'from-indigo-500 to-indigo-600' },
    { icon: '📊', title: 'Live Dashboard', desc: 'Every franc tracked in real-time', color: 'from-emerald-500 to-emerald-600' },
    { icon: '🛡️', title: 'Trust Scores', desc: 'Accountability built in', color: 'from-amber-500 to-amber-600' },
    { icon: '🏦', title: 'Swiss QR-Bills', desc: 'Bank-grade compliance', color: 'from-violet-500 to-violet-600' },
  ]

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-3 text-center"
          style={{ opacity: headingOpacity }}
        >
          Enter <span className="text-amber-400">CircleUp</span>
        </h2>
        <p
          className="text-slate-400 text-center mb-10"
          style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }) }}
        >
          Your tontine, digitized and protected
        </p>

        <div className="grid grid-cols-2 gap-5">
          {features.map((feat, i) => {
            const delay = 15 + i * 18
            const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100 } })

            return (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                style={{ transform: `scale(${s})`, opacity: s }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-sm text-slate-400">{feat.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 5: How It Works — 3 Steps (19–24s) ──────────────────────────────
function HowItWorksScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const steps = [
    { num: '1', title: 'Create a Circle', desc: 'Set amount, frequency & rules' },
    { num: '2', title: 'Invite Members', desc: 'Share a link — they join instantly' },
    { num: '3', title: 'Sit Back', desc: 'CircleUp collects & distributes' },
  ]

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-12 text-center"
          style={{ opacity: headingOpacity }}
        >
          How It <span className="text-amber-400">Works</span>
        </h2>

        <div className="flex items-start justify-between gap-4">
          {steps.map((step, i) => {
            const delay = 15 + i * 25
            const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 90 } })
            const lineWidth = i < steps.length - 1
              ? interpolate(frame, [delay + 20, delay + 40], [0, 100], { extrapolateRight: 'clamp' })
              : 0

            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-2xl font-bold text-slate-900 shadow-xl shadow-amber-500/30 mb-4"
                  style={{ transform: `scale(${s})` }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-1 text-center" style={{ opacity: s }}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 text-center" style={{ opacity: s }}>
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-8 left-[60%] h-0.5 bg-gradient-to-r from-amber-400/60 to-amber-400/20"
                    style={{ width: `${lineWidth}%` }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 6: Round-Robin Payouts — Dreams Fulfilled (24–29s) ───────────────
function PayoutScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  const members = [
    { name: 'Marie', dream: 'Bakery fund', amount: 'CHF 1,200', month: 'Jan', color: 'from-rose-400 to-rose-600' },
    { name: 'Jean', dream: 'School fees', amount: 'CHF 1,200', month: 'Feb', color: 'from-indigo-400 to-indigo-600' },
    { name: 'Amara', dream: 'Home deposit', amount: 'CHF 1,200', month: 'Mar', color: 'from-emerald-400 to-emerald-600' },
    { name: 'Kofi', dream: 'Business', amount: 'CHF 1,200', month: 'Apr', color: 'from-amber-400 to-amber-600' },
  ]

  const cycleFrame = interpolate(frame, [30, 120], [0, 3], { extrapolateRight: 'clamp' })
  const activeIndex = Math.min(Math.floor(cycleFrame), 3)

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-4 text-center"
          style={{ opacity: headingOpacity }}
        >
          Dreams <span className="text-emerald-400">Fulfilled</span>
        </h2>
        <p
          className="text-slate-400 text-center mb-10"
          style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }) }}
        >
          Each member receives the full pool in turn
        </p>

        <div className="flex items-center justify-center gap-4">
          {members.map((member, i) => {
            const delay = 20 + i * 15
            const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100 } })
            const isHighlighted = i <= activeIndex

            return (
              <div
                key={i}
                className={`flex flex-col items-center p-5 rounded-2xl border transition-all ${
                  isHighlighted
                    ? 'bg-white/10 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 border-white/10'
                }`}
                style={{ transform: `scale(${s})`, opacity: s }}
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg`}>
                  {member.name[0]}
                </div>
                <span className="text-white font-semibold text-sm">{member.name}</span>
                <span className="text-slate-500 text-xs mb-1">{member.month}</span>
                {isHighlighted && (
                  <div className="flex flex-col items-center mt-1">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-400 text-xs font-bold">{member.amount}</span>
                    </div>
                    <span className="text-slate-500 text-[10px] mt-0.5">{member.dream}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div
          className="flex items-center justify-center gap-6 mt-8"
          style={{ opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' }) }}
        >
          {['Stripe', 'TWINT', 'Bank Transfer'].map((method, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 text-sm font-medium">{method}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 7: Emergency Fund — Safety Net (29–34s) ──────────────────────────
function EmergencyFundScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const shieldScale = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 10, stiffness: 70 } })
  const fundProgress = interpolate(frame, [30, 80], [0, 75], { extrapolateRight: 'clamp' })
  const alertSlide = interpolate(frame, [50, 65], [60, 0], { extrapolateRight: 'clamp' })
  const alertOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' })
  const disburseOpacity = interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' })
  const disburseScale = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 12, stiffness: 100 } })

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-4 text-center"
          style={{ opacity: headingOpacity }}
        >
          No One <span className="text-rose-400">Left Behind</span>
        </h2>
        <p
          className="text-slate-400 text-center mb-10"
          style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }) }}
        >
          Built-in emergency fund for when life happens
        </p>

        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center border-2 border-rose-400/30 shadow-2xl shadow-rose-500/20 mb-6"
              style={{ transform: `scale(${shieldScale})` }}
            >
              <svg className="w-16 h-16 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div className="w-full max-w-[200px]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Fund Balance</span>
                <span className="text-amber-400 font-bold">CHF {Math.round(fundProgress * 16)}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
                  style={{ width: `${fundProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4"
              style={{ opacity: alertOpacity, transform: `translateX(${alertSlide}px)` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-rose-300 font-semibold text-sm">Emergency Request</p>
                  <p className="text-slate-400 text-xs">Marie needs urgent assistance</p>
                </div>
              </div>
            </div>

            <div
              className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4"
              style={{ opacity: disburseOpacity, transform: `scale(${disburseScale})` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold text-sm">Fund Disbursed</p>
                  <p className="text-slate-400 text-xs">CHF 500 sent to Marie instantly</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white/5 border border-white/10 rounded-xl p-4"
              style={{
                opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(frame, [100, 115], [20, 0], { extrapolateRight: 'clamp' })}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="text-indigo-300 font-semibold text-sm">Repayment Plan</p>
                  <p className="text-slate-400 text-xs">Flexible schedule over 3 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 8: Trust & Security (34–39s) ─────────────────────────────────────
function TrustScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Trust score meter animation
  const trustScore = Math.round(interpolate(frame, [20, 70], [0, 850], { extrapolateRight: 'clamp' }))
  const trustArc = interpolate(frame, [20, 70], [0, 306], { extrapolateRight: 'clamp' }) // 85% of 360

  const badges = [
    { icon: '🇨🇭', label: 'Swiss Hosted', delay: 25 },
    { icon: '🔐', label: 'End-to-End Encrypted', delay: 40 },
    { icon: '🏦', label: 'Stripe & TWINT', delay: 55 },
    { icon: '✅', label: 'FINMA Compliant', delay: 70 },
  ]

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-center px-12">
      <div className="w-full max-w-3xl">
        <h2
          className="text-4xl font-bold text-white mb-10 text-center"
          style={{ opacity: headingOpacity }}
        >
          Your Money Is <span className="text-amber-400">Safe</span>
        </h2>

        <div className="grid grid-cols-2 gap-10 items-center">
          {/* Trust Score Meter */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#trustGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${trustArc} 360`}
                />
                <defs>
                  <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{trustScore}</span>
                <span className="text-xs text-slate-400">Trust Score</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 text-center">Reliability rewarded.<br />Accountability built in.</p>
          </div>

          {/* Security Badges */}
          <div className="space-y-4">
            {badges.map((badge, i) => {
              const s = spring({ frame: Math.max(0, frame - badge.delay), fps, config: { damping: 12, stiffness: 100 } })
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-3.5 border border-white/10"
                  style={{ transform: `scale(${s})`, opacity: s }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-white font-medium">{badge.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene 9: CTA Outro — Join the Movement (39–45s) ────────────────────────
function OutroScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const s = spring({ frame, fps, config: { damping: 10, stiffness: 60 } })
  const ctaScale = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 100 } })
  const pulseOpacity = interpolate(frame % 30, [0, 15, 30], [0.4, 0.8, 0.4])

  const memberCount = Math.round(interpolate(frame, [0, 40], [0, 45000], { extrapolateRight: 'clamp' }))
  const circleCount = Math.round(interpolate(frame, [5, 45], [0, 3200], { extrapolateRight: 'clamp' }))

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div
        className="absolute w-80 h-80 rounded-full border-2 border-amber-400"
        style={{ opacity: pulseOpacity, transform: `scale(${0.8 + pulseOpacity * 0.3})` }}
      />
      <div
        className="absolute w-96 h-96 rounded-full border border-indigo-400/30"
        style={{ opacity: pulseOpacity * 0.5, transform: `scale(${0.7 + pulseOpacity * 0.2})` }}
      />

      <div className="flex flex-col items-center z-10">
        <h2
          className="text-5xl font-bold text-white text-center mb-4"
          style={{ transform: `scale(${s})`, opacity: s }}
        >
          Start Your <span className="text-amber-400">Circle</span>
        </h2>

        <div
          className="flex items-center gap-8 mb-8"
          style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }) }}
        >
          <div className="text-center">
            <span className="text-2xl font-bold text-amber-400">{memberCount.toLocaleString()}+</span>
            <p className="text-slate-400 text-sm">Members</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-2xl font-bold text-emerald-400">{circleCount.toLocaleString()}+</span>
            <p className="text-slate-400 text-sm">Circles</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-2xl font-bold text-indigo-400">CHF 28.5M</span>
            <p className="text-slate-400 text-sm">Total Saved</p>
          </div>
        </div>

        <div
          className="px-10 py-4 bg-amber-500 rounded-xl text-slate-900 font-bold text-xl shadow-xl shadow-amber-500/30 flex items-center gap-3"
          style={{ transform: `scale(${ctaScale})` }}
        >
          <SoundWave color="indigo" />
          www.circleup.ch
          <SoundWave color="indigo" />
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Scene timing (with overlap for crossfade) ──────────────────────────────
const SCENES = [
  { start: 0, duration: 4 * FPS + FADE_FRAMES },                                          // 1: Intro        0–4s
  { start: 4 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                  // 2: Story        4–9s
  { start: 9 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                  // 3: Problem      9–14s
  { start: 14 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                 // 4: Solution     14–19s
  { start: 19 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                 // 5: How It Works 19–24s
  { start: 24 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                 // 6: Payouts      24–29s
  { start: 29 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                 // 7: Emergency    29–34s
  { start: 34 * FPS - FADE_FRAMES, duration: 5 * FPS + 2 * FADE_FRAMES },                 // 8: Trust        34–39s
  { start: 39 * FPS - FADE_FRAMES, duration: TOTAL_FRAMES - (39 * FPS - FADE_FRAMES) },   // 9: CTA          39–45s
]

// ─── Main Composition ────────────────────────────────────────────────────────
export function DemoVideoComposition() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      <Sequence from={Math.round(SCENES[0].start)} durationInFrames={Math.round(SCENES[0].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[0].duration)}>
          <IntroScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[1].start)} durationInFrames={Math.round(SCENES[1].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[1].duration)}>
          <StoryScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[2].start)} durationInFrames={Math.round(SCENES[2].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[2].duration)}>
          <ProblemScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[3].start)} durationInFrames={Math.round(SCENES[3].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[3].duration)}>
          <SolutionScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[4].start)} durationInFrames={Math.round(SCENES[4].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[4].duration)}>
          <HowItWorksScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[5].start)} durationInFrames={Math.round(SCENES[5].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[5].duration)}>
          <PayoutScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[6].start)} durationInFrames={Math.round(SCENES[6].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[6].duration)}>
          <EmergencyFundScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[7].start)} durationInFrames={Math.round(SCENES[7].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[7].duration)}>
          <TrustScene />
        </FadeScene>
      </Sequence>
      <Sequence from={Math.round(SCENES[8].start)} durationInFrames={Math.round(SCENES[8].duration)}>
        <FadeScene durationInFrames={Math.round(SCENES[8].duration)}>
          <OutroScene />
        </FadeScene>
      </Sequence>

      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <SubtitleBar />
      </Sequence>
    </AbsoluteFill>
  )
}

// ─── Voice narration via Web Speech API ──────────────────────────────────────
function useVoiceNarration(playerRef: React.RefObject<PlayerRef | null>) {
  const lastSpokenIndex = useRef(-1)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const speakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() ?? []
      voiceRef.current = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google'))
      ) || voices.find(v => v.lang.startsWith('en')) || null
    }
    loadVoices()
    synthRef.current?.addEventListener('voiceschanged', loadVoices)

    return () => {
      synthRef.current?.removeEventListener('voiceschanged', loadVoices)
      synthRef.current?.cancel()
      if (speakTimerRef.current) clearTimeout(speakTimerRef.current)
      lastSpokenIndex.current = -1
    }
  }, [])

  const onFrameUpdate = useCallback(() => {
    const player = playerRef.current
    const synth = synthRef.current
    if (!player || !synth) return

    const frame = player.getCurrentFrame()

    const narrationIndex = NARRATION.findIndex((n, i) => {
      const nextStart = NARRATION[i + 1]?.startFrame ?? TOTAL_FRAMES
      return frame >= n.startFrame && frame < nextStart
    })

    if (narrationIndex === -1 || narrationIndex === lastSpokenIndex.current) return

    lastSpokenIndex.current = narrationIndex
    synth.cancel()
    if (speakTimerRef.current) clearTimeout(speakTimerRef.current)

    speakTimerRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(NARRATION[narrationIndex].text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.9
      if (voiceRef.current) utterance.voice = voiceRef.current
      synth.speak(utterance)
    }, 150)
  }, [playerRef])

  return { onFrameUpdate }
}

// ─── CSS-only sound wave (for use outside Remotion context) ──────────────────
function CssSoundWave() {
  return (
    <>
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-1 rounded-full bg-amber-400 css-sound-bar"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <style>{`
        .css-sound-bar {
          height: 40%;
          animation: css-sound-pulse 0.8s ease-in-out infinite alternate;
        }
        @keyframes css-sound-pulse {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </>
  )
}

// ─── Demo Video Modal ────────────────────────────────────────────────────────
export function DemoVideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const playerRef = useRef<PlayerRef | null>(null)
  const rafRef = useRef<number>(0)
  const { onFrameUpdate } = useVoiceNarration(playerRef)

  useEffect(() => {
    if (!isOpen) return

    window.speechSynthesis?.getVoices()

    const poll = () => {
      onFrameUpdate()
      rafRef.current = requestAnimationFrame(poll)
    }
    rafRef.current = requestAnimationFrame(poll)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [isOpen, onFrameUpdate])

  const handleClose = useCallback(() => {
    window.speechSynthesis?.cancel()
    onClose()
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors border border-white/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
          <CssSoundWave />
          <span className="text-white text-xs font-medium">Voice narration</span>
        </div>

        <Player
          ref={playerRef}
          component={DemoVideoComposition}
          compositionWidth={1280}
          compositionHeight={720}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          autoPlay
          controls
          style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
        />
      </div>
    </div>
  )
}
