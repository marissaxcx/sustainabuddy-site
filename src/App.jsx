import { useMemo, useState, useEffect } from 'react'
import './App.css'
import { donationLink, mailingListAction, betaInquiryAction } from './config.js'

function App() {
  const [donationAmount, setDonationAmount] = useState('25')
  const [subscribed, setSubscribed] = useState(false)
  const [betaSent, setBetaSent] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const tabs = ['Overview', 'Features', 'Requirements', 'Roadmap']
  const toSlug = (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  useEffect(() => {
    const hash = (window.location.hash || '').replace('#', '')
    const match = tabs.find((t) => toSlug(t) === hash)
    if (match) setActiveTab(match)
    const onHash = () => {
      const h = (window.location.hash || '').replace('#', '')
      const m = tabs.find((t) => toSlug(t) === h)
      if (m) setActiveTab(m)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const slug = toSlug(activeTab)
    if (slug) window.history.replaceState(null, '', `#${slug}`)
  }, [activeTab])
  const donateHref = useMemo(() => {
    try {
      const url = new URL(donationLink)
      if (donationAmount) url.searchParams.set('amount', donationAmount)
      return url.toString()
    } catch (e) {
      return donationLink || '#'
    }
  }, [donationLink, donationAmount])

  function handleSubscribe(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const existing = JSON.parse(localStorage.getItem('sustainabuddy:list') || '[]')
      existing.push({ ...payload, ts: Date.now() })
      localStorage.setItem('sustainabuddy:list', JSON.stringify(existing))
      setSubscribed(true)
      e.currentTarget.reset()
    } catch {}
  }

  function handleBetaInquiry(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const existing = JSON.parse(localStorage.getItem('sustainabuddy:beta') || '[]')
      existing.push({ ...payload, ts: Date.now() })
      localStorage.setItem('sustainabuddy:beta', JSON.stringify(existing))
      setBetaSent(true)
      e.currentTarget.reset()
    } catch {}
  }

  return (
    <>
      <div className="bg-gif" aria-hidden="true" />
      <main className="site">
      <header className="hero">
        <h1 className="hero-title">Sustaina‑buddy</h1>
        <p>Build sustainable habits with a friendly nudge. <span className="pill pill-iridescent" style={{marginLeft: '0.4rem'}}>Coming soon</span></p>
        <div className="cta">
          <a className="btn btn-primary" href="#donate">Donate</a>
          <a className="btn btn-ghost" href="#subscribe">Join the mailing list</a>
        </div>
      </header>

      <section className="grid">
        <div className="col-6">
          <div className="glass card" id="donate">
            <h2 className="section-title">Support Sustaina‑buddy</h2>
            <p className="muted">Your donation helps us build tools that make sustainable choices easy.</p>
            <div className="field">
              <label htmlFor="amount">Amount (USD)</label>
              <input id="amount" name="amount" type="number" min="1" step="1" placeholder="25" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
            </div>
            <div className="inline">
              <a className="btn btn-primary" href={donateHref} target="_blank" rel="noreferrer">Donate</a>
              <span className="muted">We’ll send a receipt via email from your payment provider.</span>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="glass card" id="subscribe">
            <h2 className="section-title">Join the mailing list</h2>
            <p className="muted">Get occasional updates about features, tips, and ways to help.</p>
            {subscribed ? (
              <div className="muted">Thanks for subscribing! Check your inbox for a welcome note.</div>
            ) : (
              <form onSubmit={mailingListAction ? undefined : handleSubscribe} action={mailingListAction || undefined} method={mailingListAction ? 'POST' : undefined}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" placeholder="Alex" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="alex@email.com" required />
                </div>
                {mailingListAction && (
                  <>
                    <input type="hidden" name="_subject" value="Sustaina-buddy: Mailing List Subscription" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={typeof window !== 'undefined' ? new URL('thanks.html', window.location.href).toString() : '/thanks.html'} />
                  </>
                )}
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="grid spaced">
        <div className="col-6">
          <div className="glass card">
            <h2 className="section-title">SustainaBuddy</h2>
            <p className="muted">SustainaBuddy is an iOS app built with SwiftUI that gamifies sustainable living. Care for your sea‑creature buddy, track eco activities, and share progress with friends — now with Sign in with Apple integration.</p>
          </div>
        </div>

        <div className="col-6">
          <div className="glass card" id="beta">
            <h2 className="section-title">Beta inquiry</h2>
            <p className="muted">Interested in early access? Send us a note and we’ll reach out — coming soon.</p>
            {betaSent ? (
              <div className="muted">Thanks! We’ll be in touch when the beta opens.</div>
            ) : (
              <form onSubmit={betaInquiryAction ? undefined : handleBetaInquiry} action={betaInquiryAction || undefined} method={betaInquiryAction ? 'POST' : undefined}>
                <div className="field">
                  <label htmlFor="beta-name">Name</label>
                  <input id="beta-name" name="name" type="text" placeholder="Alex" required />
                </div>
                <div className="field">
                  <label htmlFor="beta-email">Email</label>
                  <input id="beta-email" name="email" type="email" placeholder="alex@email.com" required />
                </div>
                <div className="field">
                  <label htmlFor="beta-message">Message</label>
                  <input id="beta-message" name="message" type="text" placeholder="Tell us about your use case" />
                </div>
                {betaInquiryAction && (
                  <>
                    <input type="hidden" name="_subject" value="Sustaina-buddy: Beta Inquiry" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={typeof window !== 'undefined' ? new URL('thanks.html', window.location.href).toString() : '/thanks.html'} />
                  </>
                )}
                <button className="btn btn-primary" type="submit">Request beta</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="grid spaced">
        <div className="col-12">
          <div className="glass card">
            <h2 className="section-title">Further info</h2>
            <div className="tabs">
              <div className="tab-list" role="tablist" aria-label="Further info tabs">
                {tabs.map((t, idx) => {
                  const slug = toSlug(t)
                  const isActive = activeTab === t
                  const onKeyDown = (e) => {
                    const key = e.key
                    let nextIdx = null
                    if (key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length
                    else if (key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length
                    else if (key === 'Home') nextIdx = 0
                    else if (key === 'End') nextIdx = tabs.length - 1
                    if (nextIdx !== null) {
                      e.preventDefault()
                      const nextTab = tabs[nextIdx]
                      setActiveTab(nextTab)
                      const nextSlug = toSlug(nextTab)
                      setTimeout(() => {
                        const el = document.getElementById(`tab-${nextSlug}`)
                        if (el) el.focus()
                      }, 0)
                    }
                  }
                  return (
                    <button
                      key={t}
                      type="button"
                      id={`tab-${slug}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${slug}`}
                      tabIndex={isActive ? 0 : -1}
                      className={`tab ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveTab(t)}
                      onKeyDown={onKeyDown}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>

              {activeTab === 'Overview' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Overview')}`} aria-labelledby={`tab-${toSlug('Overview')}`}>
                  <p className="muted">SustainaBuddy is an iOS app built with SwiftUI that gamifies sustainable living. Care for your sea‑creature buddy, track eco activities, and share progress with friends — now with Sign in with Apple integration.</p>
                </div>
              )}

              {activeTab === 'Features' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Features')}`} aria-labelledby={`tab-${toSlug('Features')}`}>
                  <ul>
                    <li>Marine tracker and animal profiles</li>
                    <li>Tamagotchi‑style buddy care and customization</li>
                    <li>Eco footprint and dining suggestions</li>
                    <li>Social challenges and achievements</li>
                    <li>Real Sign in with Apple (AuthenticationServices)</li>
                  </ul>
                </div>
              )}

              {activeTab === 'Requirements' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Requirements')}`} aria-labelledby={`tab-${toSlug('Requirements')}`}>
                  <ul>
                    <li>iPhone running iOS 17 or later</li>
                  </ul>
                  <p className="muted">No development tools needed — just install and use the app.</p>
                </div>
              )}



              {activeTab === 'Roadmap' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Roadmap')}`} aria-labelledby={`tab-${toSlug('Roadmap')}`}>
                  <ul>
                    <li>Cloud sync for profiles and activity logs</li>
                    <li>More buddy species, outfits, and accessories</li>
                    <li>Community feed and richer social features</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">Made with love ❤️ in San Diego · © {new Date().getFullYear()} Sustaina‑buddy</footer>
    </main>
    </>
  )
}

export default App
