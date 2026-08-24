const params = new URLSearchParams(window.location.search)
if (params.get('debug') === '1') {
  document.body.classList.add('debug')
}
