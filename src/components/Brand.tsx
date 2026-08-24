type BrandProps = {
  compact?: boolean
  showDescriptor?: boolean
}

export function Brand({ compact = false, showDescriptor = false }: BrandProps) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__fietz">FIETZ</span>
      <span className="brand__lol">LOL</span>
      {showDescriptor && <span className="brand__descriptor">SUPPORT</span>}
    </div>
  )
}
