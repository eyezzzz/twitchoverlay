const params = new URLSearchParams(window.location.search)

if (params.get('debug') === '1') {
  document.body.classList.add('debug')

  const fitPreviewToViewport = () => {
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720)
    document.documentElement.style.setProperty('--preview-scale', String(scale))
  }

  fitPreviewToViewport()
  window.addEventListener('resize', fitPreviewToViewport)
}
