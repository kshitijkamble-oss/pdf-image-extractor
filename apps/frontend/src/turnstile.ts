const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const TOKEN_TIMEOUT_MS = 60_000

interface TurnstileRenderOptions {
  sitekey: string
  appearance: 'interaction-only'
  callback: (token: string) => void
  'error-callback': (errorCode?: string) => void
  'expired-callback': () => void
  'timeout-callback': () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | undefined

function loadScript(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile)
      } else {
        reject(new Error('Turnstile script loaded but window.turnstile is missing'))
      }
    }
    script.onerror = () => {
      script.remove()
      reject(new Error('Could not load the Turnstile script'))
    }
    document.head.appendChild(script)
  })
  // A failed load must not be cached, or every later upload would fail too.
  scriptPromise.catch(() => {
    scriptPromise = undefined
  })
  return scriptPromise
}

export async function getTurnstileToken(): Promise<string> {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  if (!siteKey) {
    throw new Error('VITE_TURNSTILE_SITE_KEY is not set')
  }

  const turnstile = await loadScript()

  return new Promise<string>((resolve, reject) => {
    const container = document.createElement('div')
    container.className = 'turnstile-container'
    document.body.appendChild(container)

    let widgetId: string | undefined
    let timer: ReturnType<typeof setTimeout> | undefined

    const settle = (finish: () => void) => {
      clearTimeout(timer)
      if (widgetId !== undefined) turnstile.remove(widgetId)
      container.remove()
      finish()
    }
    const fail = (message: string) => settle(() => reject(new Error(message)))

    timer = setTimeout(
      () => fail('Bot check timed out'),
      TOKEN_TIMEOUT_MS,
    )

    try {
      widgetId = turnstile.render(container, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        callback: (token) => settle(() => resolve(token)),
        'error-callback': (errorCode) =>
          fail(`Bot check failed${errorCode ? ` (${errorCode})` : ''}`),
        'expired-callback': () => fail('Bot check expired'),
        'timeout-callback': () => fail('Bot check timed out'),
      })
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Bot check failed to start')
    }
  })
}
