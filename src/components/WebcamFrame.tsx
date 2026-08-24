import { FZMark } from './FZMark'

type WebcamFrameProps = {
  mode?: 'client' | 'ingame'
}

export function WebcamFrame({ mode = 'client' }: WebcamFrameProps) {
  return (
    <div className={`webcam-frame webcam-frame--${mode}`} aria-hidden="true">
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <div className="webcam-frame__tag">
        <FZMark size={28} />
        <span>FIETZLOL</span>
      </div>
    </div>
  )
}
