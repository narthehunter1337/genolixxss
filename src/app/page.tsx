'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import './landing.css'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorTerritory, setCursorTerritory] = useState<'galixs' | 'genotsyd' | 'merge'>('galixs')
  const [cursorVisible, setCursorVisible] = useState(false)
  const [preSaveRipple, setPreSaveRipple] = useState(false)

  // ---- Intersection Observer for fade-up animations ----
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseenter', handleEnter)
    document.body.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseenter', handleEnter)
      document.body.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  // ---- Visualizer canvas animation ----
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

    const barCount = window.innerWidth < 768 ? 32 : 64
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
          Math.sin(t * 2 + i * 0.3) * 0.3 +
          Math.sin(t * 3.7 + i * 0.5) * 0.2 +
          Math.sin(t * 1.3 + i * 0.8) * 0.15 +
          Math.cos(t * 0.8 + i * 0.15) * 0.1 +
          0.4
        const barH = Math.abs(amp) * h * 0.85

        // Color interpolation based on mouse X position
        let r: number, g: number, b: number
        const distFromMouse = ratio - mouseX

        if (distFromMouse < -0.12) {
          // Cyan (Galixs territory)
          r = 0; g = 240; b = 255
        } else if (distFromMouse > 0.12) {
          // Red (Genotsyd territory)
          r = 255; g = 42; b = 0
        } else {
          // Purple blend zone
          const blend = (distFromMouse + 0.12) / 0.24
          r = Math.round(0 + blend * 255)
          g = Math.round(240 - blend * 198)
          b = Math.round(255 - blend * 255)
        }

        // Main bar
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`
        ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH)

        // Glow effect
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.12)`
        ctx.fillRect(i * barW, h - barH - 6, barW, barH + 12)

        // Reflection (subtle)
        const reflGrad = ctx.createLinearGradient(0, h, 0, h + barH * 0.3)
        reflGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`)
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = reflGrad
        ctx.fillRect(i * barW + 1, h, barW - 2, barH * 0.3)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // ---- Pre-save button handler ----
  const handlePreSave = useCallback(() => {
    setPreSaveRipple(true)
    setTimeout(() => setPreSaveRipple(false), 600)
  }, [])

  // ---- Cursor color map ----
  const cursorColorMap: Record<string, string> = {
    galixs: '#00f0ff',
    genotsyd: '#ff2a00',
    merge: '#8b00ff',
  }

  return (
    <main className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ===== CUSTOM CURSOR ===== */}
      <div
        className={`custom-cursor${cursorVisible ? ' visible' : ''}`}
        style={{
          left: mousePos.x - 6,
          top: mousePos.y - 6,
          backgroundColor: cursorColorMap[cursorTerritory],
          boxShadow: `0 0 12px ${cursorColorMap[cursorTerritory]}, 0 0 24px ${cursorColorMap[cursorTerritory]}44`,
        }}
      />

      {/* ===== A. HERO / SPLIT-SCREEN ===== */}
      <section className="hero-section">
        {/* GALIXS Half */}
        <div className="hero-half hero-galixs">
          <div className="galixs-art" />
          <div className="hero-content noise-overlay">
            <h1 className="hero-name galixs-name">GALIXS</h1>
            <p className="hero-tagline galixs-tagline">
              Born from orbital silence. Transmitting through the void.
            </p>
          </div>
        </div>

        {/* GENOTSYD Half */}
        <div className="hero-half hero-genotsyd">
          <div className="genotsyd-art" />
          <div className="hero-content noise-overlay">
            <h1 className="hero-name genotsyd-name">GENOTSYD</h1>
            <p className="hero-tagline genotsyd-tagline">
              Forged in furnace districts. Unbreakable. Unforgiven.
            </p>
          </div>
        </div>

        {/* VS / × Symbol */}
        <div className="vs-symbol">×</div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <circle cx="12" cy="10" r="2.5" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cy" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </section>

      {/* ===== B. COLLISION NARRATIVE ===== */}
      <section className="collision-section">
        <div className="collision-content fade-up">
          <div className="collision-divider" />
          <p className="collision-text">
            Before the fracture, there was one signal — a single transmission beamed from the dying core of
            Station Vespira into the ether of an abandoned world. The signal split at the event horizon: one
            frequency frozen in the crystalline silence of deep orbit, the other swallowed by the molten crust
            of a planet that forgot its own name. For twenty-seven years they broadcast on opposite wavelengths
            — one singing of stardust and digital afterlife, the other screaming in rust and ancestral memory.
            Neither knew the other still existed. Until the frequencies collapsed back into each other, and the
            collision birthed something neither universe was prepared for.
          </p>
          <div className="collision-divider" />
        </div>
      </section>

      {/* ===== C1. GALIXS PROFILE ===== */}
      <section className="galixs-section">
        <div className="section-inner fade-up">
          <h2 className="section-title galixs-title">GALIXS</h2>

          <div className="galixs-bio glass-card">
            <p>
              GALIXS materialized from the decommissioned orbital relay station OTH-7, a rusting satellite
              graveyard drifting at the edge of known signal range. Raised by maintenance algorithms and
              nourished on intercepted deep-space transmissions, GALIXS learned to speak through frequency
              modulation before ever hearing a human voice. Their sound — zero-gravity trap, quantum drill,
              ambient rage — sounds like the final broadcast of a civilization that achieved digital
              immortality but forgot why it wanted to live. Signed to Phosphor Grid Records in 2021 after a
              demo tape was found embedded in a decommissioned satellite&apos;s firmware, GALIXS has never set
              foot on planetary soil.
            </p>
            <blockquote className="galixs-quote">
              &ldquo;I don&apos;t make music for ears. I make music for the space between stars.&rdquo;
            </blockquote>
          </div>

          <div className="discography">
            <h3 className="discography-title">Discography</h3>
            <div className="discography-grid">
              <div className="glass-card disc-item">
                <span className="disc-year">2022</span>
                <span className="disc-title">Void Protocol</span>
                <span className="disc-type">EP — Phosphor Grid Records</span>
              </div>
              <div className="glass-card disc-item">
                <span className="disc-year">2024</span>
                <span className="disc-title">Stardust Liturgy</span>
                <span className="disc-type">Album — Phosphor Grid Records</span>
              </div>
              <div className="glass-card disc-item">
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
        <div className="section-inner fade-up">
          <h2 className="section-title genotsyd-title">GENOTSYD</h2>

          <div className="genotsyd-bio brutal-block">
            <p>
              GENOTSYD crawled from the collapsed foundry tunnels beneath Krasny-12, a sealed industrial zone
              where the furnaces still burn on autonomic impulse decades after evacuation. Fed on copper dust
              and ancestral field recordings, GENOTSYD&apos;s nervous system is hardwired to the resonant
              frequency of crumbling concrete. Their sound — rust-belt phonk, concrete hardcore, ancestral bass
              — is the audio fossil of a civilization that built monuments to labor and left them to rot.
              Discovered in 2020 after a distorted transmission breached a military-frequency blackout zone,
              GENOTSYD was signed to Sever Wire Collective within forty-eight hours. They record exclusively in
              abandoned infrastructure.
            </p>
            <blockquote className="genotsyd-quote">
              &ldquo;My voice is not mine. It belongs to every structure that was promised a future and given a
              grave.&rdquo;
            </blockquote>
          </div>

          <div className="discography">
            <h3 className="discography-title genotsyd-disc-title">Discography</h3>
            <div className="discography-grid">
              <div className="brutal-block disc-item">
                <span className="disc-year">2021</span>
                <span className="disc-title">Furnace Hymns</span>
                <span className="disc-type">EP — Sever Wire Collective</span>
              </div>
              <div className="brutal-block disc-item">
                <span className="disc-year">2023</span>
                <span className="disc-title">Chromosome Rust</span>
                <span className="disc-type">Album — Sever Wire Collective</span>
              </div>
              <div className="brutal-block disc-item">
                <span className="disc-year">2025</span>
                <span className="disc-title">Inherited Dust</span>
                <span className="disc-type">EP — Sever Wire / Smelt Works</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== D. MERGED REALITY / COLLAB ===== */}
      <section className="collab-section">
        <div className="section-inner fade-up">
          <h2 className="collab-title">FRACTURE MERIDIAN</h2>
          <p className="collab-subtitle">The Joint Transmission — 12 Tracks</p>
          <p className="collab-date">September 13, 2026 — VOID RECORDS</p>

          <div className="collab-tracks">
            <div className="track-preview glass-card brutal-hybrid">
              <h4>01 — Event Horizon Bleed</h4>
              <p className="lyrics-snippet">
                &ldquo;I felt you through the static / A pulse I couldn&apos;t name / Your frequency like
                fracture / Burning through my frame&rdquo;
              </p>
            </div>
            <div className="track-preview glass-card brutal-hybrid">
              <h4>07 — Rust &amp; Radiation</h4>
              <p className="lyrics-snippet">
                &ldquo;Your orbit tastes like iron / My concrete breathes your light / Two signals torn from
                one voice / Relearning how to fight&rdquo;
              </p>
            </div>
            <div className="track-preview glass-card brutal-hybrid">
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
            <span className="pre-save-text">PRE-SAVE</span>
            <span className="ripple-effect" />
          </button>
        </div>
      </section>

      {/* ===== E. VISUALIZER ===== */}
      <section className="visualizer-section">
        <div className="section-inner fade-up">
          <h2 className="visualizer-title">SIGNAL INTERFERENCE</h2>
          <p className="visualizer-subtitle">Move your cursor to shift the frequency</p>
          <div className="visualizer-container">
            <canvas ref={canvasRef} className="visualizer-canvas" />
          </div>
        </div>
      </section>

      {/* ===== F. FOOTER ===== */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-socials">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Nexus link') }}
              className="social-link"
              aria-label="Nexus"
            >
              ◈
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Frequency link') }}
              className="social-link"
              aria-label="Frequency"
            >
              ⬡
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Signal link') }}
              className="social-link"
              aria-label="Signal"
            >
              ◎
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Grid link') }}
              className="social-link"
              aria-label="Grid"
            >
              ⏣
            </a>
          </div>
          <p className="footer-copyright">© 2026 VOID RECORDS</p>
          <p className="footer-cryptic">THE SIGNAL WAS ALWAYS ONE. THE SPLIT WAS THE LIE.</p>
        </div>
      </footer>
    </main>
  )
}
