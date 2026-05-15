'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import './landing.css'

/* ---- Animation Variants ---- */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const trackItemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

/* ---- Intersection Observer Hook ---- */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ---- Section Wrapper ---- */
function AnimatedSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`section ${className || ''}`}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  )
}

/* ---- Navigation ---- */
const NAV_ITEMS = [
  { label: 'Главная', href: '#hero' },
  { label: 'О нас', href: '#about' },
  { label: 'Genotsyd', href: '#genotsyd' },
  { label: 'galixxss', href: '#galixxss' },
  { label: 'Вместе', href: '#collab' },
  { label: 'Галерея', href: '#gallery' },
]

function Navigation({ onSecretTrigger }: { onSecretTrigger: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)
  const clickTimesRef = useRef<number[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = NAV_ITEMS.map((n) => n.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogoSpanClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const now = Date.now()
    const times = clickTimesRef.current.filter((t) => now - t < 4000)
    times.push(now)
    clickTimesRef.current = times
    if (times.length >= 7) {
      clickTimesRef.current = []
      onSecretTrigger()
    } else {
      handleClick('#hero')
    }
  }

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav-scrolled' : ''}`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); handleClick('#hero') }}>
          GENOTSYD <span onClick={handleLogoSpanClick}>×</span> GALIXXSS
        </a>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link${activeSection === item.href.replace('#', '') ? ' active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleClick(item.href) }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Меню">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`nav-link${activeSection === item.href.replace('#', '') ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleClick(item.href) }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---- Photo Data ---- */
const ALL_PHOTOS = [
  { src: '/photo1.jpg', alt: 'Genotsyd × galixxss — Вместе' },
  { src: '/photo2.jpg', alt: 'Школьный класс' },
  { src: '/photo3.jpg', alt: 'Genotsyd' },
  { src: '/photo4.jpg', alt: 'galixxss' },
  { src: '/photo5.jpg', alt: 'На улице' },
  { src: '/photo6.jpg', alt: 'Совместное фото' },
]

/* ---- Zoom Icon SVG ---- */
function ZoomIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

/* ---- Lightbox Component ---- */
function Lightbox({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  src: string
  alt: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="lightbox-image" />
      </motion.div>

      <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Закрыть">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {hasPrev && (
        <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Предыдущее фото">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Следующее фото">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div className="lightbox-counter">
        {(ALL_PHOTOS.findIndex((p) => p.src === src) + 1)} / {ALL_PHOTOS.length}
      </div>
    </motion.div>
  )
}

/* ---- Secret Code Modal ---- */
const SECRET_CODE = 'школа'

function CodeModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.toLowerCase().trim() === SECRET_CODE) {
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <motion.div
      className="secret-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className={`secret-modal${shake ? ' secret-shake' : ''}`}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="secret-modal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="secret-modal-title">Доступ ограничен</h3>
        <p className="secret-modal-desc">Введите код, чтобы попасть в скрытую секцию</p>
        <form onSubmit={handleSubmit} className="secret-modal-form">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Введите код..."
            className={`secret-input${error ? ' secret-input-error' : ''}`}
            autoComplete="off"
          />
          <button type="submit" className="secret-submit">Войти</button>
        </form>
        {error && <p className="secret-error-text">Неверный код</p>}
        <button className="secret-modal-close" onClick={onClose} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ---- Secret Page ---- */
function SecretPage({ onClose }: { onClose: () => void }) {
  const [glitchText, setGlitchText] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const interval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 150)
    }, 4000)
    return () => {
      document.body.style.overflow = ''
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      className="secret-page-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="secret-page-noise" />
      <div className="secret-page-scanlines" />

      <button className="secret-page-close" onClick={onClose} aria-label="Закрыть">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="secret-page-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="secret-badge">СЕКРЕТНАЯ СЕКЦИЯ</div>
        </motion.div>

        <motion.h1
          className={`secret-title${glitchText ? ' glitch-active' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          ТЫ НАШЁЛ <span>ЭТО</span>
        </motion.h1>

        <motion.p
          className="secret-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Только избранные попадают сюда. Добро пожаловать в андеграунд.
        </motion.p>

        <motion.div
          className="secret-divider"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Unreleased tracks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="secret-section-title">Неизданное</h2>
          <p className="secret-section-desc">Треки, которые никогда не выйдут. Только здесь.</p>
          <div className="secret-tracks">
            {[
              { num: '??', name: 'коридоры', status: 'демо' },
              { num: '??', name: 'окно выходного дня', status: 'черновик' },
              { num: '??', name: 'тишина.mp3', status: 'фрагмент' },
              { num: '??', name: 'последний звонок', status: 'демо' },
              { num: '??', name: 'красные розы II', status: 'идея' },
            ].map((track) => (
              <div key={track.name} className="secret-track-item">
                <span className="secret-track-num">{track.num}</span>
                <span className="secret-track-name">{track.name}</span>
                <span className={`secret-track-status status-${track.status}`}>{track.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Secret message */}
        <motion.div
          className="secret-message-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="secret-section-title">Послание</h2>
          <div className="secret-message-text">
            <p>Если ты здесь — значит, ты один из нас.</p>
            <p>Школа — это временно. Музыка — навсегда.</p>
            <p>Каждый трек — это чья-то история. Может, твоя.</p>
            <p className="secret-message-sig">— G × G</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="secret-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="secret-section-title">Статистика проекта</h2>
          <div className="secret-stats-grid">
            <div className="secret-stat">
              <span className="secret-stat-value">13</span>
              <span className="secret-stat-label">треков</span>
            </div>
            <div className="secret-stat">
              <span className="secret-stat-value">3</span>
              <span className="secret-stat-label">совместных</span>
            </div>
            <div className="secret-stat">
              <span className="secret-stat-value">1</span>
              <span className="secret-stat-label">школа</span>
            </div>
            <div className="secret-stat">
              <span className="secret-stat-value">∞</span>
              <span className="secret-stat-label">идей</span>
            </div>
          </div>
        </motion.div>

        {/* Hidden photo grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="secret-section-title">Скрытые кадры</h2>
          <div className="secret-gallery">
            {[
              { src: '/photo3.jpg', alt: 'Genotsyd' },
              { src: '/photo6.jpg', alt: 'Вместе' },
              { src: '/photo4.jpg', alt: 'galixxss' },
            ].map((item) => (
              <div key={item.src} className="secret-gallery-item">
                <img src={item.src} alt={item.alt} />
                <div className="secret-gallery-vignette" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="secret-footer-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          Ты знаешь код. Ты знаешь правду. Не выдавай секрет.
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showSecretPage, setShowSecretPage] = useState(false)

  const openLightbox = useCallback((photoSrc: string) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.src === photoSrc)
    setLightboxIndex(idx >= 0 ? idx : 0)
  }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < ALL_PHOTOS.length - 1 ? prev + 1 : prev
    )
  }, [])

  const handleSecretTrigger = useCallback(() => {
    setShowCodeModal(true)
  }, [])

  const handleCodeSuccess = useCallback(() => {
    setShowCodeModal(false)
    setShowSecretPage(true)
  }, [])

  return (
    <main className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="noise" />

      <Navigation onSecretTrigger={handleSecretTrigger} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            src={ALL_PHOTOS[lightboxIndex].src}
            alt={ALL_PHOTOS[lightboxIndex].alt}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < ALL_PHOTOS.length - 1}
          />
        )}
      </AnimatePresence>

      {/* Secret Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <CodeModal
            onSuccess={handleCodeSuccess}
            onClose={() => setShowCodeModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Secret Page */}
      <AnimatePresence>
        {showSecretPage && (
          <SecretPage onClose={() => setShowSecretPage(false)} />
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero" ref={heroRef}>
        <motion.div className="hero-bg" style={{ y: heroY }}>
          <img src="/photo1.jpg" alt="Genotsyd × galixxss" />
        </motion.div>
        <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            GENOTSYD <span>×</span> GALIXXSS
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Школьный андеграунд. Треки о том, что рядом
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="https://soundcloud.com/genotsyd" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Слушать Genotsyd
            </a>
            <a href="https://soundcloud.com/dumpling21" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Слушать galixxss
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="hero-scroll-line" />
        </motion.div>
      </section>

      {/* ===== О НАС ===== */}
      <AnimatedSection className="section-dark" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <motion.div className="about-photo clickable-photo" variants={slideFromLeft} custom={0} onClick={() => openLightbox('/photo2.jpg')}>
              <img src="/photo2.jpg" alt="О нас" />
              <div className="photo-zoom-icon"><ZoomIcon /></div>
            </motion.div>
            <div>
              <motion.span className="sec-label" variants={fadeUp} custom={0.1}>О нас</motion.span>
              <motion.h2 className="sec-title" variants={fadeUp} custom={0.15}>Два мира. Один круг.</motion.h2>
              <motion.div className="sec-divider" variants={scaleIn} custom={0.2} />
              <motion.p variants={fadeUp} custom={0.25}>
                <strong>Genotsyd</strong> и <strong>galixxss</strong> — два молодых русскоязычных
                андеграунд-исполнителя из одной школы. Их музыка — это честный голос поколения,
                для которого школа, друзья, первые поцелуи и ночные прогулки — не абстракция,
                а каждый день.
              </motion.p>
              <motion.p variants={fadeUp} custom={0.35}>
                Genotsyd — школьный бунтарь с тату-фильтрами, розами на шее и надписями на лице.
                Его треки — короткие, жёсткие, про первые чувства и подростковую агрессию.
                Записывает в перерывах между уроками, но при этом собирает прослушивания.
              </motion.p>
              <motion.p variants={fadeUp} custom={0.45}>
                galixxss — его брат по цеху, ещё один голос школьного андеграунда. В его треках —
                лоуфай-звучание, меланхолия и подростковая романтика. Вместе они создают музыку,
                где переплетаются два мира: агрессия и нежность, бунт и романтика.
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== GENOTSYD ===== */}
      <AnimatedSection id="genotsyd">
        <div className="section-inner">
          <div className="artist-grid">
            <motion.div className="artist-photo clickable-photo" variants={slideFromLeft} custom={0} onClick={() => openLightbox('/photo3.jpg')}>
              <img src="/photo3.jpg" alt="Genotsyd" />
              <div className="photo-zoom-icon"><ZoomIcon /></div>
            </motion.div>
            <div>
              <motion.span className="sec-label" variants={fadeUp} custom={0.1}>Исполнитель</motion.span>
              <motion.h2 className="artist-name artist-name-red" variants={fadeUp} custom={0.15}>GENOTSYD</motion.h2>
              <motion.p className="artist-desc" variants={fadeUp} custom={0.2}>
                Школьный бунтарь с тату-фильтрами, розами на шее и надписями на лице.
                Короткие, честные треки про первые чувства и подростковую агрессию.
                Записывает в перерывах между уроками — и собирает прослушивания.
              </motion.p>
              <motion.div className="sec-divider" variants={scaleIn} custom={0.25} />
              <motion.div className="track-list" variants={staggerContainer} initial="hidden" animate="visible">
                {[
                  { num: '01', name: 'ТЫ МОЯ' },
                  { num: '02', name: 'Пустяки', feat: 'feat. DEFENXCS' },
                  { num: '03', name: 'УБИВАЮ' },
                  { num: '04', name: 'КОГДА ВИЖУ ТЕБЯ', feat: 'feat. galixxss' },
                  { num: '05', name: 'КРОВЬ ИЗ УШЕЙ (СПИД2)' },
                  { num: '06', name: 'ЧАЙНИК' },
                ].map((track) => (
                  <motion.div key={track.num} className="track-item" variants={trackItemVariant}>
                    <span className="track-num">{track.num}</span>
                    <span className="track-name">{track.name}</span>
                    {track.feat && <span className="track-feat">{track.feat}</span>}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== GALIXXSS ===== */}
      <AnimatedSection className="section-dark" id="galixxss">
        <div className="section-inner">
          <div className="artist-grid" style={{ direction: 'rtl' }}>
            <motion.div className="artist-photo clickable-photo" variants={slideFromRight} custom={0} style={{ direction: 'ltr' }} onClick={() => openLightbox('/photo4.jpg')}>
              <img src="/photo4.jpg" alt="galixxss" />
              <div className="photo-zoom-icon"><ZoomIcon /></div>
            </motion.div>
            <div style={{ direction: 'ltr' }}>
              <motion.span className="sec-label" variants={fadeUp} custom={0.1}>Исполнитель</motion.span>
              <motion.h2 className="artist-name artist-name-white" variants={fadeUp} custom={0.15}>galixxss</motion.h2>
              <motion.p className="artist-desc" variants={fadeUp} custom={0.2}>
                Лоуфай-звучание, меланхолия и подростковая романтика. Ещё один голос школьного
                андеграунда, чьи треки звучат как ночные прогулки и невысказанные чувства.
              </motion.p>
              <motion.div className="sec-divider" variants={scaleIn} custom={0.25} />
              <motion.div className="track-list" variants={staggerContainer} initial="hidden" animate="visible">
                {[
                  { num: '01', name: 'поцелуй', feat: 'feat. Genotsyd' },
                  { num: '02', name: 'фонарь', feat: 'feat. Genotsyd' },
                  { num: '03', name: 'СПИД2' },
                  { num: '04', name: 'спид1.mp3' },
                ].map((track) => (
                  <motion.div key={track.num} className="track-item" variants={trackItemVariant}>
                    <span className="track-num">{track.num}</span>
                    <span className="track-name">{track.name}</span>
                    {track.feat && <span className="track-feat">{track.feat}</span>}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== СОВМЕСТНОЕ ===== */}
      <AnimatedSection id="collab">
        <div className="section-inner">
          <div className="collab-grid">
            <div>
              <motion.div className="collab-badge" variants={scaleIn} custom={0}>Совместный проект</motion.div>
              <motion.h2 className="sec-title" variants={fadeUp} custom={0.1}>Вместе</motion.h2>
              <motion.p className="artist-desc" variants={fadeUp} custom={0.15} style={{ marginTop: '0.5rem' }}>
                Когда два мира сталкиваются, получается честно. Совместные треки —
                это точка пересечения агрессии и нежности, школьных коридоров и ночных улиц.
              </motion.p>
              <motion.div className="sec-divider" variants={scaleIn} custom={0.2} />
              <motion.div className="track-list" variants={staggerContainer} initial="hidden" animate="visible">
                {[
                  { num: '01', name: 'КОГДА ВИЖУ ТЕБЯ', feat: 'Genotsyd feat. galixxss' },
                  { num: '02', name: 'поцелуй', feat: 'galixxss feat. Genotsyd' },
                  { num: '03', name: 'фонарь', feat: 'galixxss feat. Genotsyd' },
                ].map((track) => (
                  <motion.div key={track.num} className="track-item" variants={trackItemVariant}>
                    <span className="track-num">{track.num}</span>
                    <span className="track-name">{track.name}</span>
                    {track.feat && <span className="track-feat">{track.feat}</span>}
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div className="collab-photo clickable-photo" variants={slideFromRight} custom={0.1} onClick={() => openLightbox('/photo6.jpg')}>
              <img src="/photo6.jpg" alt="Совместные треки" />
              <div className="photo-zoom-icon"><ZoomIcon /></div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== ГАЛЕРЕЯ ===== */}
      <AnimatedSection className="section-darker" id="gallery">
        <div className="section-inner">
          <motion.span className="sec-label" variants={fadeUp} custom={0}>Атмосфера</motion.span>
          <motion.h2 className="sec-title" variants={fadeUp} custom={0.1}>Галерея</motion.h2>
          <motion.div className="sec-divider" variants={scaleIn} custom={0.15} />
          <div className="gallery-grid">
            {[
              { src: '/photo5.jpg', alt: 'Атмосфера', cls: 'tall' },
              { src: '/photo2.jpg', alt: 'Школа', cls: '' },
              { src: '/photo4.jpg', alt: 'galixxss', cls: '' },
              { src: '/photo1.jpg', alt: 'Вместе', cls: 'wide' },
              { src: '/photo3.jpg', alt: 'Genotsyd', cls: '' },
              { src: '/photo6.jpg', alt: 'Совместные треки', cls: '' },
            ].map((item, i) => (
              <motion.div
                key={item.src}
                className={`gallery-item ${item.cls}`}
                variants={scaleIn}
                custom={0.15 + i * 0.08}
                onClick={() => openLightbox(item.src)}
              >
                <img src={item.src} alt={item.alt} />
                <div className="gallery-zoom-icon"><ZoomIcon /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ===== FOOTER ===== */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="footer-inner">
          <div className="footer-copy">
            <span>Сделано с душой. 2026</span>
            <span className="footer-made">made with narthehunter</span>
          </div>
          <div className="footer-links">
            <a href="#hero" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) }}>Наверх</a>
            <a href="https://soundcloud.com/narthehunter" target="_blank" rel="noopener noreferrer" className="footer-link">SoundCloud</a>
            <a href="https://t.me/uralslons" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
