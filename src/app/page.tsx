'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import './landing.css'

/* ---- Gold Particles — hardcoded to guarantee SSR/client hydration match ---- */
const PARTICLES = [
  { id: 0, left: '12.5%', size: 1.4, duration: 14, delay: 2, opacity: 0.18 },
  { id: 1, left: '28.3%', size: 2.1, duration: 18, delay: 7, opacity: 0.25 },
  { id: 2, left: '45.7%', size: 1.8, duration: 11, delay: 0, opacity: 0.12 },
  { id: 3, left: '63.2%', size: 1.2, duration: 22, delay: 12, opacity: 0.3 },
  { id: 4, left: '81.9%', size: 2.6, duration: 16, delay: 5, opacity: 0.2 },
  { id: 5, left: '5.4%', size: 1.9, duration: 20, delay: 9, opacity: 0.35 },
  { id: 6, left: '37.1%', size: 1.1, duration: 13, delay: 14, opacity: 0.15 },
  { id: 7, left: '52.8%', size: 2.3, duration: 17, delay: 3, opacity: 0.28 },
  { id: 8, left: '74.6%', size: 1.5, duration: 24, delay: 11, opacity: 0.1 },
  { id: 9, left: '91.3%', size: 1.7, duration: 12, delay: 8, opacity: 0.22 },
  { id: 10, left: '18.7%', size: 2.8, duration: 19, delay: 1, opacity: 0.32 },
  { id: 11, left: '33.5%', size: 1.3, duration: 15, delay: 6, opacity: 0.17 },
  { id: 12, left: '48.2%', size: 2.0, duration: 21, delay: 13, opacity: 0.26 },
  { id: 13, left: '66.9%', size: 1.6, duration: 10, delay: 4, opacity: 0.14 },
  { id: 14, left: '85.4%', size: 2.4, duration: 23, delay: 10, opacity: 0.38 },
  { id: 15, left: '9.1%', size: 1.0, duration: 16, delay: 15, opacity: 0.11 },
  { id: 16, left: '22.6%', size: 2.2, duration: 14, delay: 2, opacity: 0.29 },
  { id: 17, left: '57.3%', size: 1.8, duration: 18, delay: 7, opacity: 0.19 },
  { id: 18, left: '70.8%', size: 1.4, duration: 25, delay: 0, opacity: 0.36 },
  { id: 19, left: '95.2%', size: 2.7, duration: 11, delay: 9, opacity: 0.23 },
] as const

function GoldParticles() {
  return (
    <div className="gold-particles">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="gold-particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorTerritory, setCursorTerritory] = useState<'galixs' | 'genotsyd' | 'merge'>('galixs')
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorHovering, setCursorHovering] = useState(false)
  const [preSaveRipple, setPreSaveRipple] = useState(false)

  // ---- Intersection Observer for reveal animations ----
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // ---- Custom cursor tracking ----
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      const xRatio = e.clientX / window.innerWidth
      if (xRatio < 0.4) setCursorTerritory('galixs')
      else if (xRatio > 0.6) setCursorTerritory('genotsyd')
      else setCursorTerritory('merge')
    }

    const handleEnter = () => setCursorVisible(true)
    const handleLeave = () => setCursorVisible(false)

    // Detect hovering over interactive elements
    const handleOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, .style-tag, .disc-item, .track-preview, .social-link')) {
        setCursorHovering(true)
      } else {
        setCursorHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleOverInteractive)
    document.body.addEventListener('mouseenter', handleEnter)
    document.body.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleOverInteractive)
      document.body.removeEventListener('mouseenter', handleEnter)
      document.body.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  // ---- Visualizer canvas ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mouseX = 0.5

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
    }
    window.addEventListener('mousemove', handleMouseMove)

    const barCount = window.innerWidth < 768 ? 40 : 80
    const timeRef = { value: 0 }

    const animate = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const w = rect.width
      const h = rect.height
      const barW = w / barCount
      timeRef.value = Date.now() / 1000
      const t = timeRef.value

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < barCount; i++) {
        const ratio = i / barCount
        const amp =
          Math.sin(t * 1.5 + i * 0.25) * 0.25 +
          Math.sin(t * 2.8 + i * 0.4) * 0.18 +
          Math.sin(t * 0.7 + i * 0.6) * 0.12 +
          Math.cos(t * 1.1 + i * 0.12) * 0.08 +
          0.35
        const barH = Math.abs(amp) * h * 0.75

        // Gold → Copper → Gold gradient based on mouse position
        const distFromMouse = ratio - mouseX
        let r: number, g: number, b: number

        if (distFromMouse < -0.1) {
          // Platinum / Ice gold (Galixs)
          r = 201; g = 169; b = 110
        } else if (distFromMouse > 0.1) {
          // Rose gold / Copper (Genotsyd)
          r = 183; g = 110; b = 121
        } else {
          // Blend zone
          const blend = (distFromMouse + 0.1) / 0.2
          r = Math.round(201 - blend * 18)
          g = Math.round(169 - blend * 59)
          b = Math.round(110 + blend * 11)
        }

        // Main bar with gradient
        const grad = ctx.createLinearGradient(0, h - barH, 0, h)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.3)`)
        ctx.fillStyle = grad
        ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH)

        // Top highlight
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`
        ctx.fillRect(i * barW, h - barH - 3, barW, 4)

        // Reflection
        const reflGrad = ctx.createLinearGradient(0, h, 0, h + barH * 0.2)
        reflGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`)
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = reflGrad
        ctx.fillRect(i * barW + 1, h, barW - 2, barH * 0.2)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // ---- Pre-save handler ----
  const handlePreSave = useCallback(() => {
    setPreSaveRipple(true)
    setTimeout(() => setPreSaveRipple(false), 800)
  }, [])

  // ---- Cursor colors ----
  const cursorColorMap: Record<string, string> = {
    galixs: '#C9A96E',
    genotsyd: '#B76E79',
    merge: '#D4AF37',
  }

  return (
    <main className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ===== GOLD PARTICLES ===== */}
      <GoldParticles />

      {/* ===== CUSTOM CURSOR ===== */}
      <div
        className={`custom-cursor${cursorVisible ? ' visible' : ''}${cursorHovering ? ' hovering' : ''}`}
        style={{
          left: mousePos.x - (cursorHovering ? 20 : 8),
          top: mousePos.y - (cursorHovering ? 20 : 8),
          backgroundColor: cursorColorMap[cursorTerritory],
          boxShadow: `0 0 15px ${cursorColorMap[cursorTerritory]}88, 0 0 30px ${cursorColorMap[cursorTerritory]}44`,
        }}
      />

      {/* ===== A. HERO / SPLIT-SCREEN ===== */}
      <section className="hero-section">
        <div className="hero-half hero-galixs">
          <div className="galixs-art" />
          <div className="hero-content">
            <h1 className="hero-name galixs-name">GALIXS</h1>
            <p className="hero-tagline galixs-tagline">
              Born from orbital silence — transmitting through the void
            </p>
          </div>
        </div>

        <div className="hero-half hero-genotsyd">
          <div className="genotsyd-art" />
          <div className="hero-content">
            <h1 className="hero-name genotsyd-name">GENOTSYD</h1>
            <p className="hero-tagline genotsyd-tagline">
              Forged in furnace districts — unbreakable, unforgiven
            </p>
          </div>
        </div>

        <div className="vs-symbol">×</div>

        <div className="scroll-indicator">
          <span className="scroll-indicator-text">Descend</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* ===== B. COLLISION NARRATIVE ===== */}
      <section className="collision-section">
        <div className="collision-content">
          <div className="reveal">
            <span className="collision-label">The Collision</span>
          </div>
          <div className="reveal reveal-delay-1">
            <div className="gold-divider-wide" style={{ marginBottom: '2.5rem' }} />
          </div>
          <p className="collision-text reveal reveal-delay-2">
            Before the fracture, there was one signal — a single transmission beamed from the dying core of
            Station Vespira into the ether of an abandoned world. The signal split at the event horizon: one
            frequency frozen in crystalline silence, the other swallowed by molten crust. For twenty-seven years
            they broadcast on opposite wavelengths — one singing of stardust and digital afterlife, the other
            screaming in rust and ancestral memory. Neither knew the other still existed. Until the frequencies
            collapsed back into each other, and the collision birthed something neither universe was prepared for.
          </p>
          <div className="reveal reveal-delay-3">
            <div className="gold-divider-wide" style={{ marginTop: '2.5rem' }} />
          </div>
        </div>
      </section>

      {/* ===== C1. GALIXS PROFILE ===== */}
      <section className="galixs-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-number">01</span>
            <h2 className="section-title galixs-title">GALIXS</h2>
          </div>

          <div className="bio-grid">
            <div className="luxury-card reveal reveal-delay-1">
              <div className="bio-text">
                <p>
                  GALIXS materialized from the decommissioned orbital relay station OTH-7, a rusting satellite
                  graveyard drifting at the edge of known signal range. Raised by maintenance algorithms and
                  nourished on intercepted deep-space transmissions, GALIXS learned to speak through frequency
                  modulation before ever hearing a human voice. Their sound — zero-gravity trap, quantum drill,
                  ambient rage — is the final broadcast of a civilization that achieved digital immortality
                  but forgot why it wanted to live. Signed to Phosphor Grid Records in 2021 after a demo
                  tape was found embedded in decommissioned satellite firmware, GALIXS has never set foot
                  on planetary soil.
                </p>
                <blockquote className="bio-quote">
                  &ldquo;I don&apos;t make music for ears. I make music for the space between stars.&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="bio-style">
                <div>
                  <span className="style-label">Sound</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">Zero-Gravity Trap</span>
                    <span className="style-tag">Quantum Drill</span>
                    <span className="style-tag">Ambient Rage</span>
                  </div>
                </div>
                <div>
                  <span className="style-label">Label</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">Phosphor Grid</span>
                  </div>
                </div>
                <div>
                  <span className="style-label">Origin</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">OTH-7 Station</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="discography reveal">
            <h3 className="discography-header">Discography</h3>
            <div className="discography-grid">
              <div className="disc-item">
                <span className="disc-year">2022</span>
                <span className="disc-title">Void Protocol</span>
                <span className="disc-type">EP — Phosphor Grid Records</span>
              </div>
              <div className="disc-item">
                <span className="disc-year">2024</span>
                <span className="disc-title">Stardust Liturgy</span>
                <span className="disc-type">Album — Phosphor Grid Records</span>
              </div>
              <div className="disc-item">
                <span className="disc-year">2025</span>
                <span className="disc-title">Terminal Luminance</span>
                <span className="disc-type">EP — Phosphor Grid / Stellar Veil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== C2. GENOTSYD PROFILE ===== */}
      <section className="genotsyd-section">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-number">02</span>
            <h2 className="section-title genotsyd-title">GENOTSYD</h2>
          </div>

          <div className="bio-grid genotsyd-bio">
            <div className="copper-card reveal reveal-delay-1">
              <div className="bio-text">
                <p>
                  GENOTSYD crawled from the collapsed foundry tunnels beneath Krasny-12, a sealed industrial
                  zone where the furnaces still burn on autonomic impulse decades after evacuation. Fed on
                  copper dust and ancestral field recordings, GENOTSYD&apos;s nervous system is hardwired to
                  the resonant frequency of crumbling concrete. Their sound — rust-belt phonk, concrete
                  hardcore, ancestral bass — is the audio fossil of a civilization that built monuments
                  to labor and left them to rot. Discovered in 2020 after a distorted transmission breached
                  a military-frequency blackout zone, GENOTSYD was signed to Sever Wire Collective within
                  forty-eight hours. They record exclusively in abandoned infrastructure.
                </p>
                <blockquote className="bio-quote">
                  &ldquo;My voice is not mine. It belongs to every structure that was promised a future
                  and given a grave.&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="bio-style">
                <div>
                  <span className="style-label">Sound</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">Rust-Belt Phonk</span>
                    <span className="style-tag">Concrete Hardcore</span>
                    <span className="style-tag">Ancestral Bass</span>
                  </div>
                </div>
                <div>
                  <span className="style-label">Label</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">Sever Wire</span>
                  </div>
                </div>
                <div>
                  <span className="style-label">Origin</span>
                  <div className="style-tags" style={{ marginTop: '0.75rem' }}>
                    <span className="style-tag">Krasny-12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="discography reveal">
            <h3 className="discography-header">Discography</h3>
            <div className="discography-grid">
              <div className="disc-item">
                <span className="disc-year">2021</span>
                <span className="disc-title">Furnace Hymns</span>
                <span className="disc-type">EP — Sever Wire Collective</span>
              </div>
              <div className="disc-item">
                <span className="disc-year">2023</span>
                <span className="disc-title">Chromosome Rust</span>
                <span className="disc-type">Album — Sever Wire Collective</span>
              </div>
              <div className="disc-item">
                <span className="disc-year">2025</span>
                <span className="disc-title">Inherited Dust</span>
                <span className="disc-type">EP — Sever Wire / Smelt Works</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== D. FRACTURE MERIDIAN ===== */}
      <section className="collab-section">
        <div className="section-inner">
          <div className="reveal">
            <span className="collab-label">Joint Transmission</span>
          </div>
          <h2 className="collab-title reveal reveal-delay-1">FRACTURE MERIDIAN</h2>
          <p className="collab-subtitle reveal reveal-delay-2">12 Tracks — The Convergence</p>
          <p className="collab-date reveal reveal-delay-2">September 13, 2026 — VOID RECORDS</p>

          <div className="collab-tracks reveal reveal-delay-3">
            <div className="track-preview">
              <h4>01 — Event Horizon Bleed</h4>
              <p className="lyrics-snippet">
                &ldquo;I felt you through the static / A pulse I couldn&apos;t name / Your frequency like
                fracture / Burning through my frame&rdquo;
              </p>
            </div>
            <div className="track-preview">
              <h4>07 — Rust &amp; Radiation</h4>
              <p className="lyrics-snippet">
                &ldquo;Your orbit tastes like iron / My concrete breathes your light / Two signals torn from
                one voice / Relearning how to fight&rdquo;
              </p>
            </div>
            <div className="track-preview">
              <h4>12 — Meridian Collapse</h4>
              <p className="lyrics-snippet">
                &ldquo;Where your stardust meets my ash / Where the transmission finally cracks / We are the
                fault line / We are the fracture made flesh&rdquo;
              </p>
            </div>
          </div>

          <button
            className={`pre-save-btn${preSaveRipple ? ' ripple' : ''}`}
            onClick={handlePreSave}
            type="button"
          >
            <span className="pre-save-icon">◇</span>
            <span className="pre-save-text">Pre-Save</span>
            <span className="ripple-effect" />
          </button>
        </div>
      </section>

      {/* ===== E. VISUALIZER ===== */}
      <section className="visualizer-section">
        <div className="section-inner">
          <span className="visualizer-label reveal">Signal Interference</span>
          <h2 className="visualizer-title reveal reveal-delay-1">FREQUENCY VISUALIZER</h2>
          <p className="visualizer-subtitle reveal reveal-delay-2">Move cursor to shift the frequency</p>
          <div className="visualizer-container reveal reveal-delay-3">
            <canvas ref={canvasRef} className="visualizer-canvas" />
          </div>
        </div>
      </section>

      {/* ===== F. FOOTER ===== */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-socials">
            <a href="#" onClick={(e) => { e.preventDefault() }} className="social-link" aria-label="Nexus">NXS</a>
            <a href="#" onClick={(e) => { e.preventDefault() }} className="social-link" aria-label="Frequency">FRQ</a>
            <a href="#" onClick={(e) => { e.preventDefault() }} className="social-link" aria-label="Signal">SGN</a>
            <a href="#" onClick={(e) => { e.preventDefault() }} className="social-link" aria-label="Grid">GRD</a>
          </div>
          <div className="gold-divider" style={{ marginBottom: '1.5rem' }} />
          <p className="footer-copyright">© 2026 VOID RECORDS</p>
          <p className="footer-cryptic">The signal was always one. The split was the lie.</p>
        </div>
      </footer>
    </main>
  )
}
