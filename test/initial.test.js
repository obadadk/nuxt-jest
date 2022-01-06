import { createPage, setupTest } from '@nuxt/test-utils'

describe('initial', () => {
  setupTest({ browser: true })

  test('initial state', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const state = await page.evaluate(() => window.__NUXT__.state)

    expect(state).toEqual({
      user: { name: 'obada' },
      loggedIn: true,
    })

    await page.close()
  })
})
