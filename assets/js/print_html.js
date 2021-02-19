export const printHtml = (el, localOptions, cb = () => true) => {
  const defaultName = '_blank'
  const defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes']
  const defaultReplace = true
  const defaultStyles = [
    '/print.css',
    '/css/quill.bubble.css',
    '/css/quill.core.css',
    '/css/quill.snow.css'
  ]
  let name = defaultName
  let specs = defaultSpecs
  let replace = defaultReplace
  let styles = defaultStyles

  // If has localOptions
  // TODO: improve logic
  if (localOptions) {
    if (localOptions.name) {
      name = localOptions.name
    }
    if (localOptions.specs) {
      specs = localOptions.specs
    }
    if (localOptions.replace) {
      replace = localOptions.replace
    }
    if (localOptions.styles) {
      styles = localOptions.styles
    }
  }

  specs = specs.length ? specs.join(',') : ''

  const element = window.document.getElementById(el)

  if (!element) {
    alert(`Element to print #${el} not found!`)
    return
  }

  const url = ''
  const win = window.open(url, name, specs, replace)

  win.document.write(`
    <html>
      <head>
        <title>${window.document.title}</title>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)

  addStyles(win, styles)

  setTimeout(() => {
    win.document.close()
    win.focus()
    win.print()
    setTimeout(() => {
      win.close()
      cb()
    }, 500)
  }, 1000)

  return true
}

function addStyles (win, styles) {
  styles.forEach((style) => {
    const link = win.document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', style)
    win.document.getElementsByTagName('head')[0].appendChild(link)
  })
}
