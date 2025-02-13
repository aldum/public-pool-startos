import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string } = matches
const shape = object({
  STRATUM_URL: string
})
type shapetype = typeof shape._TYPE

const toEnv = (obj: shapetype): string => {
  return `(function (window) {
window.__env = window.__env || {}
window.__env.STRATUM_URL = '${obj.STRATUM_URL}'
}(this))`
}

const cfgPrefix = /window\.__env\./
const fromEnv = (text: string): shapetype => {
  const lines = text.split('\n')
  const records = lines.filter((s) =>
    s.match(cfgPrefix))

  const conf: Record<string, string> = {}
  records.map(line => {
    const [keyRaw, valueRaw] = line.split('=', 2)
    const key =
      keyRaw
        ?.replace(cfgPrefix, '')
        ?.trim()
    const value =
      valueRaw
        ?.replace(/['"]+/g, '')
        ?.trim()
    if (key && value) {
      conf[key] = value
    }
  })
  // TODO: doesn't work yet
  return conf as shapetype
}

export const envjs = FileHelper.raw(
  '/media/startos/volumes/pool/env/env.js',
  (obj: shapetype) => toEnv(obj),
  (str) => fromEnv(str),
  (obj) => shape.unsafeCast(obj)
)
