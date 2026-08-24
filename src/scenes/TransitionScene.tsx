import { FZMark } from '../components/FZMark'

type TransitionMode = 'starting' | 'brb' | 'ending' | 'stinger'

type TransitionSceneProps = {
  mode: TransitionMode
}

const content: Record<Exclude<TransitionMode, 'stinger'>, { eyebrow: string; title: string; subtitle: string }> = {
  starting: {
    eyebrow: 'FIETZLOL / LIVE',
    title: 'A LIVE JÁ VAI COMEÇAR',
    subtitle: 'SUPPORT • LEAGUE OF LEGENDS • RANKED',
  },
  brb: {
    eyebrow: 'PAUSA RÁPIDA',
    title: 'JÁ VOLTO',
    subtitle: 'NÃO SAI DAÍ',
  },
  ending: {
    eyebrow: 'FIETZLOL / OFFLINE',
    title: 'VALEU PELA LIVE',
    subtitle: 'X + INSTAGRAM  @FIETZLOL',
  },
}

export function TransitionScene({ mode }: TransitionSceneProps) {
  if (mode === 'stinger') {
    return (
      <div className="overlay transition-scene transition-scene--stinger">
        <div className="transition-stinger__slash transition-stinger__slash--a" />
        <div className="transition-stinger__slash transition-stinger__slash--b" />
        <div className="transition-stinger__brand">
          <FZMark size={360} />
        </div>
      </div>
    )
  }

  const copy = content[mode]

  return (
    <div className={`overlay transition-scene transition-scene--${mode}`}>
      <div className="transition-grid" aria-hidden="true" />
      <div className="transition-orbit transition-orbit--one" aria-hidden="true" />
      <div className="transition-orbit transition-orbit--two" aria-hidden="true" />
      <div className="transition-scan" aria-hidden="true" />

      <header className="transition-header">
        <div className="transition-header__brand">
          <FZMark size={58} />
          <span>FIETZLOL</span>
        </div>
        <span className="transition-header__role">SUPPORT / VISION / MACRO</span>
      </header>

      <main className="transition-main">
        <div className="transition-mark-wrap" aria-hidden="true">
          <FZMark size={430} />
          <span className="transition-mark-wrap__ring" />
        </div>

        <div className="transition-copy">
          <span className="transition-copy__eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <div className="transition-copy__line"><span /></div>
        </div>
      </main>

      <footer className="transition-footer">
        <span>@fietzlol</span>
        <span className="transition-footer__dot" />
        <span>SMOKE TRAM</span>
        <span className="transition-footer__grow" />
        <span>SUPPORT MAIN</span>
      </footer>
    </div>
  )
}
