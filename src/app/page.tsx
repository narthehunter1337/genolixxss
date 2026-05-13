'use client'

import { useEffect, useState, useRef } from 'react'
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

/* ---- Section Wrapper with AnimatePresence ---- */
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

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)

      // Determine active section
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

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav-scrolled' : ''}`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); handleClick('#hero') }}>
          GENOTSYD <span>×</span> GALIXXSS
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

      {/* Mobile menu */}
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

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <main className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="noise" />

      <Navigation />

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
            <motion.div className="about-photo" variants={slideFromLeft} custom={0}>
              <img src="/photo2.jpg" alt="О нас" />
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
            <motion.div className="artist-photo" variants={slideFromLeft} custom={0}>
              <img src="/photo3.jpg" alt="Genotsyd" />
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
            <motion.div className="artist-photo" variants={slideFromRight} custom={0} style={{ direction: 'ltr' }}>
              <img src="/photo4.jpg" alt="galixxss" />
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
            <motion.div className="collab-photo" variants={slideFromRight} custom={0.1}>
              <img src="/photo6.jpg" alt="Совместные треки" />
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
              >
                <img src={item.src} alt={item.alt} />
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
