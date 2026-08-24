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
      {/* Angular F: keeps the original cut/forward aesthetic, but reads clearly. */}
      <path
        d="M8 10H36L31 19H20V27H31L26 36H20V53H8V10Z"
        fill="currentColor"
      />
      <path
        d="M28 10H36L31 19H23L28 10Z"
        fill="var(--accent)"
      />

      {/* Z: visibly separate from the F, with the same diagonal-tech language. */}
      <path
        d="M39 10H59L54 19H48L32 45H48L54 36H60L50 54H27L32 45L48 19H39V10Z"
        fill="var(--accent)"
      />
      <path
        d="M44 19H48L32 45H28L44 19Z"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  )
}
