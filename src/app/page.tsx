'use client'

import { useEffect } from 'react'
import './landing.css'

export default function Home() {
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

  return (
    <main className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Noise overlay */}
      <div className="noise" />

      {/* ===== A. HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src="/photo1.jpg" alt="Genotsyd × galixxss" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            GENOTSYD <span>×</span> GALIXXSS
          </h1>
          <p className="hero-subtitle">Школьный андеграунд. Треки о том, что рядом</p>
          <div className="hero-buttons">
            <a href="#collab" className="btn btn-primary">Слушать</a>
            <a href="#about" className="btn btn-outline">О нас</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ===== B. О НАС ===== */}
      <section className="section section-dark" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-photo reveal">
              <img src="/photo2.jpg" alt="О нас" />
            </div>
            <div className="about-text">
              <span className="sec-label reveal">О нас</span>
              <h2 className="sec-title reveal reveal-d1">Два мира. Один круг.</h2>
              <div className="sec-divider reveal reveal-d2" />
              <p className="reveal reveal-d2">
                <strong>Genotsyd</strong> и <strong>galixxss</strong> — два молодых русскоязычных
                андеграунд-исполнителя из одной школы. Их музыка — это честный голос поколения,
                для которого школа, друзья, первые поцелуи и ночные прогулки — не абстракция,
                а каждый день.
              </p>
              <p className="reveal reveal-d3">
                Genotsyd — школьный бунтарь с тату-фильтрами, розами на шее и надписями на лице.
                Его треки — короткие, жёсткие, про первые чувства и подростковую агрессию.
                Записывает в перерывах между уроками, но при этом собирает прослушивания.
              </p>
              <p className="reveal reveal-d4">
                galixxss — его брат по цеху, ещё один голос школьного андеграунда. В его треках —
                лоуфай-звучание, меланхолия и подростковая романтика. Вместе они создают музыку,
                где переплетаются два мира: агрессия и нежность, бунт и романтика.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== C. GENOTSYD ===== */}
      <section className="section" id="genotsyd">
        <div className="section-inner">
          <div className="artist-grid">
            <div>
              <div className="artist-photo reveal">
                <img src="/photo4.jpg" alt="Genotsyd" />
              </div>
            </div>
            <div>
              <span className="sec-label reveal">Исполнитель</span>
              <h2 className="artist-name artist-name-red reveal reveal-d1">GENOTSYD</h2>
              <p className="artist-desc reveal reveal-d2">
                Школьный бунтарь с тату-фильтрами, розами на шее и надписями на лице.
                Короткие, честные треки про первые чувства и подростковую агрессию.
                Записывает в перерывах между уроками — и собирает прослушивания.
              </p>
              <div className="sec-divider reveal reveal-d2" />
              <div className="track-list reveal reveal-d3">
                <div className="track-item">
                  <span className="track-num">01</span>
                  <span className="track-name">ТЫ МОЯ</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">02</span>
                  <span className="track-name">Пустяки</span>
                  <span className="track-feat">feat. DEFENXCS</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">03</span>
                  <span className="track-name">УБИВАЮ</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">04</span>
                  <span className="track-name">КОГДА ВИЖУ ТЕБЯ</span>
                  <span className="track-feat">feat. galixxss</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">05</span>
                  <span className="track-name">КРОВЬ ИЗ УШЕЙ (СПИД2)</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">06</span>
                  <span className="track-name">ЧАЙНИК</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== D. GALIXXSS ===== */}
      <section className="section section-dark" id="galixxss">
        <div className="section-inner">
          <div className="artist-grid" style={{ direction: 'rtl' }}>
            <div style={{ direction: 'ltr' }}>
              <div className="artist-photo reveal">
                <img src="/photo3.jpg" alt="galixxss" />
              </div>
            </div>
            <div style={{ direction: 'ltr' }}>
              <span className="sec-label reveal">Исполнитель</span>
              <h2 className="artist-name artist-name-white reveal reveal-d1">galixxss</h2>
              <p className="artist-desc reveal reveal-d2">
                Лоуфай-звучание, меланхолия и подростковая романтика. Ещё один голос школьного
                андеграунда, чьи треки звучат как ночные прогулки и невысказанные чувства.
              </p>
              <div className="sec-divider reveal reveal-d2" />
              <div className="track-list reveal reveal-d3">
                <div className="track-item">
                  <span className="track-num">01</span>
                  <span className="track-name">поцелуй</span>
                  <span className="track-feat">feat. Genotsyd</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">02</span>
                  <span className="track-name">фонарь</span>
                  <span className="track-feat">feat. Genotsyd</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">03</span>
                  <span className="track-name">СПИД2</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">04</span>
                  <span className="track-name">спид1.mp3</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== E. СОВМЕСТНОЕ ===== */}
      <section className="section" id="collab">
        <div className="section-inner">
          <div className="collab-grid">
            <div>
              <div className="collab-badge reveal">Совместный проект</div>
              <h2 className="sec-title reveal reveal-d1">Вместе</h2>
              <p className="artist-desc reveal reveal-d2" style={{ marginTop: '0.5rem' }}>
                Когда два мира сталкиваются, получается честно. Совместные треки —
                это точка пересечения агрессии и нежности, школьных коридоров и ночных улиц.
              </p>
              <div className="sec-divider reveal reveal-d2" />
              <div className="track-list reveal reveal-d3">
                <div className="track-item">
                  <span className="track-num">01</span>
                  <span className="track-name">КОГДА ВИЖУ ТЕБЯ</span>
                  <span className="track-feat">Genotsyd feat. galixxss</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">02</span>
                  <span className="track-name">поцелуй</span>
                  <span className="track-feat">galixxss feat. Genotsyd</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
                <div className="track-item">
                  <span className="track-num">03</span>
                  <span className="track-name">фонарь</span>
                  <span className="track-feat">galixxss feat. Genotsyd</span>
                  <button className="track-play" aria-label="Играть">▶</button>
                </div>
              </div>
            </div>
            <div className="collab-photo reveal">
              <img src="/photo6.jpg" alt="Совместные треки" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== F. ГАЛЕРЕЯ ===== */}
      <section className="section section-darker" id="gallery">
        <div className="section-inner">
          <span className="sec-label reveal">Атмосфера</span>
          <h2 className="sec-title reveal reveal-d1">Галерея</h2>
          <div className="sec-divider reveal reveal-d2" />
          <div className="gallery-grid reveal reveal-d3">
            <div className="gallery-item tall">
              <img src="/photo5.jpg" alt="Атмосфера" />
            </div>
            <div className="gallery-item">
              <img src="/photo2.jpg" alt="Школа" />
            </div>
            <div className="gallery-item">
              <img src="/photo4.jpg" alt="Genotsyd" />
            </div>
            <div className="gallery-item wide">
              <img src="/photo1.jpg" alt="Вместе" />
            </div>
            <div className="gallery-item">
              <img src="/photo3.jpg" alt="galixxss" />
            </div>
            <div className="gallery-item">
              <img src="/photo6.jpg" alt="Совместные треки" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== G. FOOTER ===== */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="footer-inner">
          <p className="footer-copy">Сделано с душой. 2026</p>
          <div className="footer-links">
            <a href="#hero" className="footer-link">Наверх</a>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              SoundCloud
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
