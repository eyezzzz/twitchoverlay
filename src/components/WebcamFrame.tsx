import { FZMark } from './FZMark'

type WebcamFrameProps = {
  mode?: 'client' | 'ingame'
}

function InstagramIcon() {
  return (
    <span className="webcam-frame__instagram" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
      </svg>
    </span>
  )
}

export function WebcamFrame({ mode = 'client' }: WebcamFrameProps) {
  return (
    <div className={`webcam-frame webcam-frame--${mode}`} aria-hidden="true">
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <div className="webcam-frame__tag">
        {mode === 'ingame' && <span className="webcam-frame__tag-sweep" />}
        <span className="webcam-frame__brand-lockup">
          <FZMark size={28} />
          <span>FIETZLOL</span>
        </span>

        {mode === 'ingame' && (
          <span className="webcam-frame__socials">
            <span className="webcam-frame__social">
              <strong>X</strong>
              <span>@fietzlol</span>
            </span>
            <span className="webcam-frame__social-divider" />
            <span className="webcam-frame__social webcam-frame__social--instagram">
              <InstagramIcon />
              <span>@fietzlol</span>
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
