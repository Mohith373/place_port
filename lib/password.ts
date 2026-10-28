export type PasswordCheck = { label: string; ok: boolean }

const COMMON = ['password', 'password1', '12345678', '123456789', 'qwerty123', 'iloveyou', 'admin123', 'welcome1', 'abc12345']

export function checkPassword(pw: string) {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'An uppercase letter (A-Z)', ok: /[A-Z]/.test(pw) },
    { label: 'A lowercase letter (a-z)', ok: /[a-z]/.test(pw) },
    { label: 'A number (0-9)', ok: /[0-9]/.test(pw) },
    { label: 'A special character (!@#$%...)', ok: /[^A-Za-z0-9]/.test(pw) },
    { label: 'Not a common password', ok: pw.length > 0 && !COMMON.includes(pw.toLowerCase()) },
  ]
  const score = checks.filter((c) => c.ok).length
  return { checks, score, total: checks.length, strong: score === checks.length }
}

// unbiased random number from the browser's secure generator
function randomInt(max: number) {
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= limit)
  return buf[0] % max
}

export function generatePassword(length = 14): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnpqrstuvwxyz'
  const digits = '23456789'
  const special = '!@#$%^&*?-_'
  const all = upper + lower + digits + special
  const pick = (set: string) => set[randomInt(set.length)]

  const chars = [pick(upper), pick(lower), pick(digits), pick(special)]
  while (chars.length < length) chars.push(pick(all))

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}