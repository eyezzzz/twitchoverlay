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
      viewBox="0 0 100 90"
      fill="none"
    >
      {/* Approved channel mark: open angular F, long lower stem. */}
      <path
        d="M25 16H73L66 27H38L34 35H54L46 44H29L21 69L8 76L25 16Z"
        fill="currentColor"
      />

      {/* Approved Z: complete top-to-bottom diagonal, eating into the F at the top. */}
      <path
        d="M66 16H92L83 28H73L48 63H77L86 54L80 75H36L45 62L70 28H58L66 16Z"
        fill="var(--accent)"
      />
    </svg>
  )
}
