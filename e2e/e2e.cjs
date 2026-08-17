const puppeteer = require('puppeteer-core')

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:4173'
const results = []
const ok = (name, pass) => results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}`)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function textOf(page, sel) {
  const el = await page.$(sel)
  return el ? (await el.evaluate((n) => n.textContent)).trim() : null
}

async function clickByText(page, selector, text) {
  const handle = await page.evaluateHandle(
    (sel, t) => {
      const nodes = [...document.querySelectorAll(sel)]
      return nodes.find((n) => n.textContent.includes(t)) || null
    },
    selector,
    text,
  )
  const el = await handle.asElement()
  if (!el) throw new Error(`No element: ${selector} contains "${text}"`)
  await el.click()
}

async function signIn(page, name) {
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await clickByText(page, 'button.badge', name)
  await clickByText(page, 'button', 'Come in')
  await page.waitForFunction(() => location.pathname === '/feed')
  ok(`sign in as ${name}`, true)
}

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  const page = await browser.newPage()
  page.on('pageerror', (e) => ok('NO JS ERROR: ' + e.message, false))
  await page.setViewport({ width: 420, height: 800 })
  page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()) })

  // 1. sign in as Aisha
  await signIn(page, 'Aisha R.')

  // 2. Feed hides donations: only 3 seed public items
  const feedText = await textOf(page, 'body')
  ok('feed hides donation items (jacket absent)', !feedText.includes('Cozy blue winter jacket'))
  ok('feed shows public items', feedText.includes('Box of gel pens'))

  // 3. Claim item 2 (gel pens) instantly
  await page.goto(BASE + '/item/2', { waitUntil: 'networkidle0' })
  await clickByText(page, 'button', 'I want this!')
  await page.waitForFunction(() => location.pathname === '/done')
  ok('instant claim -> /done', true)

  // 4. Request an item as another user
  await signIn(page, 'Carlos M.')
  await page.goto(BASE + '/item/5', { waitUntil: 'networkidle0' }) // striped shirt (Maya T.)
  await clickByText(page, 'button', 'Or request it instead')
  await page.type('textarea', 'Hi Maya, I would love this for myself. Can I grab it?')
  await clickByText(page, 'button', 'Send request')
  await page.waitForFunction(() => location.pathname === '/requested')
  ok('request -> /requested', true)

  // 5. Poster (Maya) approves the request
  await signIn(page, 'Maya T.')
  await page.goto(BASE + '/mine', { waitUntil: 'networkidle0' })
  let mineText = await textOf(page, 'body')
  ok('poster sees pending request', mineText.includes('request') && mineText.includes('Carlos M.'))
  await clickByText(page, 'button', 'Approve')
  await sleep(300)
  mineText = await textOf(page, 'body')
  ok('poster sees claim after approve', mineText.includes('Claimed by Carlos M.'))

  // 6. Donation: Maya posts a donation item
  await page.goto(BASE + '/post', { waitUntil: 'networkidle0' })
  await page.type('input[placeholder^="e.g. Blue winter jacket"]', 'My old skateboard')
  await page.click('input[type=checkbox]')
  await clickByText(page, 'button', 'Send it to our donation inbox')
  await page.waitForFunction(() => location.pathname === '/donation-posted')
  ok('donation post -> /donation-posted', true)

  // 7. Donation NOT on public feed
  await page.goto(BASE + '/feed', { waitUntil: 'networkidle0' })
  const feed2 = await textOf(page, 'body')
  ok('new donation hidden from feed', !feed2.includes('My old skateboard'))

  // 8. Admin: PIN gate, then accept donation
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  await page.type('input[placeholder="Admin PIN"]', '1234')
  await clickByText(page, 'button', 'Unlock')
  await sleep(300)
  let adminText = await textOf(page, 'body')
  ok('admin inbox shows donations', adminText.includes('My old skateboard'))
  await clickByText(page, 'button', 'Accept from donor')
  await sleep(300)
  adminText = await textOf(page, 'body')
  ok('admin sees awaiting-payment state', adminText.includes('Awaiting donor payment'))

  // 9. Donor pays the pickup fee (demo checkout)
  await page.goto(BASE + '/mine', { waitUntil: 'networkidle0' })
  let donorText = await textOf(page, 'body')
  ok('donor sees accepted donation + pay button', donorText.includes('Pay $2 pickup fee'))
  await clickByText(page, 'button', 'Pay $2 pickup fee')
  await sleep(400)
  await clickByText(page, 'button', 'Pay $2 (demo)')
  await page.waitForFunction(() => !document.body.textContent.includes('Pay us securely'), { timeout: 6000 })
  await sleep(400)
  donorText = await textOf(page, 'body')
  ok('donor sees collected status after payment', donorText.includes('Collected by us'))

  // 10. Admin reflects collected status
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  adminText = await textOf(page, 'body')
  ok('admin sees collected status', adminText.includes('Collected by us'))

  // 11. Reset demo state for handover
  await page.evaluate(() => localStorage.clear())
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })

  await browser.close()
  console.log(results.join('\n'))
  const fails = results.filter((r) => r.startsWith('FAIL')).length
  console.log(`\n${results.length - fails}/${results.length} passed`)
  process.exit(fails ? 1 : 0)
})().catch((e) => {
  console.error('E2E CRASH:', e.message)
  console.log(results.join('\n'))
  process.exit(1)
})
