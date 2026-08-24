type FZMarkProps = {
  size?: number
}

export function FZMark({ size = 44 }: FZMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className="fz-mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M8 9H33V18H19V26H29V35H19V55H8V9Z"
        fill="currentColor"
      />
      <path
        d="M36 9H60V18L45 46H57V55H31V46L46 18H36V9Z"
        fill="var(--accent)"
      />
    </svg>
  )
}
