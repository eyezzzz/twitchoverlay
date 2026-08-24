import { Brand } from './Brand'

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
            <span className="social-item__platform">IG</span>
            <span className="social-item__handle">@fietzlol</span>
          </div>
        </div>
        <div className="client-footer__line"><span /></div>
        <span className="client-footer__signature">SUPPORT • VISION • TEAM</span>
      </div>
    </>
  )
}
