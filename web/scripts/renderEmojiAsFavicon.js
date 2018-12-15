// assuming you define your favicon with an emoji and data...
// <link rel='icon' data-emoji='✈️' type='image/png' />

async function renderEmojiAsFavicon () {
  // needed to ensure render is complete
  await new Promise((resolve) => { setTimeout(resolve, 1) })

  const canvasSize = 64
  const favicon = document.querySelector('link[rel=icon]')
  const emoji = favicon.getAttribute('data-emoji')
  const canvas = document.createElement('canvas')
  canvas.height = canvasSize
  canvas.width = canvasSize

  const ctx = canvas.getContext('2d')
  ctx.font = '64px serif'
  ctx.fillText(emoji, 0, canvasSize)

  favicon.href = canvas.toDataURL()
}

export default renderEmojiAsFavicon
