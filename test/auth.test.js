/* eslint-disable no-console */
import { createPage, setupTest } from '@nuxt/test-utils'

function fakeCredentials() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const numbers = '123456789012345678901234567890'
  let email = ''
  let phone = ''
  for (let i = 0; i < 10; i++) {
    email += chars[Math.floor(Math.random() * chars.length)]
  }
  for (let i = 0; i < 8; i++) {
    phone += numbers[Math.floor(Math.random() * numbers.length)]
  }

  return { email: `${email}@jest.com`, phone: `+9055${phone}`, password: '12345678' }
}

describe('auth', () => {
  setupTest({ setupTimeout: 600000, browser: true })
  const creds = fakeCredentials()

  // Test Register With Fake Credentials
  test('register', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const { status, data } = await page.evaluate(async (creds) => {
      const { email, phone, password } = creds
      try {
        const res = await window.$nuxt.$axios.post('/user/registerByEmail', {
          email,
          phone,
          password,
          password_confirmation: password,
        })
        return {
          status: res.status || 0,
          data: res.data.data || {},
        }
      } catch (error) {
        console.log(error)
        return {
          status: 0,
          data: {},
        }
      }
    }, creds)

    expect(status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.access_token).toBeDefined()

    await page.close()
  }, 50000)

  // Test Login With Fake Credentials
  test('login', async () => {
    const page = await createPage('/')
    await page.waitForFunction('!!window.$nuxt')

    const { status, data } = await page.evaluate(async (creds) => {
      const { email, password } = creds
      try {
        const res = await window.$nuxt.$auth.loginWith('local', {
          data: { email, password },
          url: `/user/loginByEmail`,
        })
        return {
          status: res.status || 0,
          data: res.data.data || {},
        }
      } catch (error) {
        console.log(error)
        return {
          status: 0,
          data: {},
        }
      }
    }, creds)

    expect(status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.access_token).toBeDefined()

    await page.close()
  }, 50000)
})
