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
      </div>

      <div className="client-footer" aria-hidden="true">
        <Brand compact showDescriptor />
        <div className="client-footer__line" />
        <span className="client-footer__signature">VISION • MAP • TEAM</span>
      </div>
    </>
  )
}
