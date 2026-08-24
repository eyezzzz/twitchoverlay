import { FZ_APPROVED_PNG } from '../assets/fzApproved'

type FZMarkProps = {
  size?: number
}

export function FZMark({ size = 44 }: FZMarkProps) {
  return (
    <img
      aria-hidden="true"
      className="fz-mark"
      src={FZ_APPROVED_PNG}
      width={size}
      height="auto"
      draggable={false}
      alt=""
    />
  )
}
