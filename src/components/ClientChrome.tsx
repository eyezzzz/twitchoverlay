import { Brand } from './Brand'

const SMOKE_TRAM_MARK = 'data:image/webp;base64,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'

function InstagramIcon() {
  return (
    <svg
      className="social-item__instagram-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  )
}

function SmokeTramSupport() {
  return (
    <div className="smoke-tram-support">
      <span className="smoke-tram-support__sweep" />
      <span className="smoke-tram-support__mark">
        <img src={SMOKE_TRAM_MARK} alt="" />
      </span>
      <span className="smoke-tram-support__text">
        <span>SUPPORT FOR</span>
        <strong>SMOKE TRAM</strong>
      </span>
    </div>
  )
}

export function ClientChrome() {
  return (
    <>
      <div className="client-header">
        <Brand compact />
        <nav className="client-header__nav" aria-hidden="true">
          <span>SUPPORT</span>
          <i>/</i>
          <span>VISION</span>
          <i>/</i>
          <span>MACRO</span>
        </nav>
        <div className="client-header__mark" aria-hidden="true">
          <span className="vision-dot" />
        </div>
      </div>

      <div className="client-content-frame" aria-hidden="true">
        <span className="edge edge--tl" />
        <span className="edge edge--tr" />
        <span className="edge edge--br" />
        <span className="edge edge--bl" />

        <svg
          className="client-comet"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <filter id="client-comet-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect className="client-comet__trail" x="4" y="4" width="992" height="992" pathLength="1000" />
          <rect className="client-comet__core" x="4" y="4" width="992" height="992" pathLength="1000" />
          <rect className="client-comet__spark" x="4" y="4" width="992" height="992" pathLength="1000" />
        </svg>
      </div>

      <div className="livepix-dock" aria-hidden="true">
        <span className="livepix-dock__corner livepix-dock__corner--tl" />
        <span className="livepix-dock__corner livepix-dock__corner--br" />
        <span className="livepix-dock__label">LIVEPIX</span>
      </div>

      <div className="client-footer" aria-hidden="true">
        <div className="social-rail">
          <div className="social-item social-item--x">
            <span className="social-item__platform">X</span>
            <span className="social-item__handle">@fietzlol</span>
          </div>
          <span className="social-rail__divider" />
          <div className="social-item social-item--instagram">
            <span className="social-item__platform social-item__platform--instagram"><InstagramIcon /></span>
            <span className="social-item__handle">@fietzlol</span>
          </div>
        </div>
        <div className="client-footer__line"><span /></div>
        <SmokeTramSupport />
      </div>
    </>
  )
}
