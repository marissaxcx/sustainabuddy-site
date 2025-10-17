import { useMemo, useState, useEffect } from 'react'
import './App.css'
import { donationLink, contactFormAction } from './config.js'

function App() {
  const [donationAmount, setDonationAmount] = useState('25')
  const [activeTab, setActiveTab] = useState('Overview')
  const tabs = ['Overview', 'Features', 'Requirements', 'Roadmap', 'Contact']
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

  // Removed legacy subscribe/beta handlers to keep one contact form only
  /* removed legacy handlers: subscribe and beta inquiry */

  return (
    <>
      <div className="bg-gif" aria-hidden="true" />
      <main className="site">
      <header className="hero">
        <h1 className="hero-title">SustainaBuddy</h1>
        <p>Adopt a playful sea-buddy and build everyday eco habits. Track actions, earn badges, and celebrate progress with friends. <span className="pill pill-iridescent" style={{marginLeft: '0.4rem'}}>Coming soon</span></p>
        <div className="cta">
          <a className="btn btn-primary" href="#contact">Contact the developer</a>
          <a className="btn btn-ghost" href="#donate">Donate</a>
        </div>
      </header>

      <section className="grid">
        <div className="col-12">
          <div className="glass card" id="donate">
            <h2 className="section-title">Support SustainaBuddy</h2>
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
      </section>

      <section className="grid spaced">
        <div className="col-6">
          <div className="glass card">
            <h2 className="section-title">SustainaBuddy</h2>
            <p className="muted">SustainaBuddy helps you build sustainable habits with a playful sea-buddy. Log daily eco actions, earn badges, keep streaks, and share your progress with friends. Private by design — use Sign in with Apple to sync without passwords.</p>
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
                  <p className="muted">Adopt your sea-buddy, choose simple eco actions, and build habits that stick. Track what you do, grow your buddy, and celebrate milestones — all while keeping your data private with Sign in with Apple.</p>
                </div>
              )}

              {activeTab === 'Features' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Features')}`} aria-labelledby={`tab-${toSlug('Features')}`}>
                  <ul>
                    <li>Adopt and customize your sea-buddy</li>
                    <li>Daily eco actions with streaks and badges</li>
                    <li>Smart suggestions to reduce waste and save energy</li>
                    <li>Friendly challenges and progress sharing</li>
                    <li>Private Sign in with Apple — no passwords</li>
                  </ul>
                </div>
              )}

              {activeTab === 'Requirements' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Requirements')}`} aria-labelledby={`tab-${toSlug('Requirements')}`}>
                  <ul>
                    <li>iPhone (iOS 17 or later)</li>
                  </ul>
                  <p className="muted">Just install and start playing — Sign in with Apple optional for sync.</p>
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

              {activeTab === 'Contact' && (
                <div className="tab-panel" role="tabpanel" id={`panel-${toSlug('Contact')}`} aria-labelledby={`tab-${toSlug('Contact')}`}>
                  <p className="muted">Reach out directly — happy to collaborate, answer questions, or chat about the roadmap.</p>
                  <form action={contactFormAction} method="POST">
                    <div className="field">
                      <label htmlFor="contact-name">Name</label>
                      <input id="contact-name" name="name" type="text" placeholder="Alex" required />
                    </div>
                    <div className="field">
                      <label htmlFor="contact-email">Email</label>
                      <input id="contact-email" name="email" type="email" placeholder="alex@email.com" required />
                    </div>
                    <div className="field">
                      <label htmlFor="contact-topic">Topic</label>
                      <select id="contact-topic" name="topic">
                        <option value="General">General</option>
                        <option value="Beta Inquiry">Beta Inquiry</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="contact-message">Message</label>
                      <input id="contact-message" name="message" type="text" placeholder="How can we help?" required />
                    </div>
                    {/* FormSubmit options */}
                    <input type="hidden" name="_subject" value="Sustaina-buddy: Developer Contact" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={typeof window !== 'undefined' ? new URL('thanks.html', window.location.href).toString() : '/thanks.html'} />
                    {/* Honeypot to reduce spam */}
                    <input type="text" name="_honey" style={{ display: 'none' }} />

                    <button className="btn btn-primary" type="submit">Send message</button>
                  </form>
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
