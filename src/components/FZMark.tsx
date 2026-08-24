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
      <path d="M8 10H37L31 20H20V29H31L25 39H8V10Z" fill="currentColor" />
      <path d="M39 10H58L50 22H42L29 44H47L54 34H58L47 54H20L37 25H29L39 10Z" fill="currentColor" opacity=".88"/>
      <path d="M43 10H58L51 21H36L43 10Z" fill="var(--accent)" />
      <path d="M29 44H47L54 34H58L47 54H23L29 44Z" fill="var(--accent)" />
    </svg>
  )
}
