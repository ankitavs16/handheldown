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

  // 2. Pre-paid demo claim visible: item 2 ships claimed & paid (gel pens ₹30)
  let feedText = await textOf(page, 'body')
  ok('feed hides donation items (jacket absent)', !feedText.includes('Cozy blue winter jacket'))
  ok('feed shows public items', feedText.includes('Box of gel pens'))
  ok('feed shows priced chip ₹30', feedText.includes('₹30'))
  ok('pre-paid demo claim visible on feed', feedText.includes('Claimed by Aisha R.'))

  // 3. Check payment trail in My Items (poster Carlos sees paid ₹30)
  await signIn(page, 'Carlos M.')
  await page.goto(BASE + '/mine', { waitUntil: 'networkidle0' })
  const mineText = await textOf(page, 'body')
  ok('poster sees pre-paid claim with amount', mineText.includes('Claimed by Aisha R.') && mineText.includes('paid ₹30'))

  // 4. Priced checkout on item 4 (backpack ₹150)
  await page.goto(BASE + '/item/4', { waitUntil: 'networkidle0' })
  let detailText = await textOf(page, 'body')
  ok('detail shows price ₹150', detailText.includes('₹150'))
  await clickByText(page, 'button', 'I want this — ₹150')
  await page.waitForFunction(() => location.pathname === '/checkout/4')
  let checkoutText = await textOf(page, 'body')
  ok('checkout page shows total ₹150', checkoutText.includes('Total') && checkoutText.includes('₹150'))
  await clickByText(page, 'button', 'Pay ₹150 and claim it')
  await page.waitForFunction(() => location.pathname === '/done', { timeout: 6000 })
  ok('priced checkout -> /done', true)

  // 5. Second claimer is blocked on a priced item
  await signIn(page, 'Aisha R.')
  await page.goto(BASE + '/item/4', { waitUntil: 'networkidle0' })
  ok('second claimer sees already-claimed', (await textOf(page, 'body')).includes('Already claimed!'))

  // 6. Free instant claim (item 5, striped shirt, price 0)
  await page.goto(BASE + '/item/5', { waitUntil: 'networkidle0' })
  detailText = await textOf(page, 'body')
  ok('free item shows Free', detailText.includes('Free'))
  await clickByText(page, 'button', 'I want this! — Free')
  await page.waitForFunction(() => location.pathname === '/done')
  ok('free claim -> /done', true)

  // 7. Dark/light mode toggle persists to <html data-mode>
  await page.goto(BASE + '/feed', { waitUntil: 'networkidle0' })
  ok('light mode by default', (await page.evaluate(() => document.documentElement.dataset.mode)) === 'light')
  await clickByText(page, 'button', '☀')
  await sleep(200)
  ok('toggle -> dark mode', (await page.evaluate(() => document.documentElement.dataset.mode)) === 'dark')
  await clickByText(page, 'button', '☾')
  await sleep(200)
  ok('toggle back -> light mode', (await page.evaluate(() => document.documentElement.dataset.mode)) === 'light')

  // 8. Donation: Maya posts a donation with approximate weight
  await signIn(page, 'Maya T.')
  await page.goto(BASE + '/post', { waitUntil: 'networkidle0' })
  await page.type('input[placeholder^="e.g. Blue winter jacket"]', 'My old skateboard')
  await page.click('input[type=checkbox]')
  await sleep(200)
  const postText = await textOf(page, 'body')
  ok('weight picker + good cause shown on post', postText.includes('~1 kg') && postText.includes('good cause'))
  await clickByText(page, 'button', 'Send it to our donation inbox')
  await page.waitForFunction(() => location.pathname === '/donation-posted')
  ok('donation post -> /donation-posted', true)

  // 9. Donation NOT on public feed
  await page.goto(BASE + '/feed', { waitUntil: 'networkidle0' })
  const feed2 = await textOf(page, 'body')
  ok('new donation hidden from feed', !feed2.includes('My old skateboard'))

  // 10. Admin: PIN gate, then accept donation (bill based on ~1 kg = ₹30)
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  await page.type('input[placeholder="Admin PIN"]', '1234')
  await clickByText(page, 'button', 'Unlock')
  await sleep(300)
  let adminText = await textOf(page, 'body')
  ok('admin inbox shows donations', adminText.includes('My old skateboard'))
  await clickByText(page, 'button', 'Accept from donor (bill ₹30)')
  await sleep(300)
  adminText = await textOf(page, 'body')
  ok('admin sees awaiting-payment state', adminText.includes('Awaiting donor payment'))

  // 11. Donor pays the ₹30 donation (demo checkout modal, good cause)
  await page.goto(BASE + '/mine', { waitUntil: 'networkidle0' })
  let donorText = await textOf(page, 'body')
  ok('donor sees accepted donation + pay button', donorText.includes('Pay ₹30 donation'))
  await clickByText(page, 'button', 'Pay ₹30 donation')
  await sleep(400)
  await clickByText(page, 'button', 'Pay ₹30 (demo)')
  await page.waitForFunction(() => !document.body.textContent.includes('Pay us securely'), { timeout: 6000 })
  await sleep(400)
  donorText = await textOf(page, 'body')
  ok('donor sees collected status + good cause', donorText.includes('Collected by us') && donorText.includes('good cause'))

  // 12. Admin reflects collected status
  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  adminText = await textOf(page, 'body')
  ok('admin sees collected status', adminText.includes('Collected by us'))

  // 13. Reset demo state for handover
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