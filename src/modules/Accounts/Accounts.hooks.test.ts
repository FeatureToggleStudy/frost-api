import { describe } from 'riteway'
import { spy } from 'sinon'
import { setVerifiedAccountStatus, createCryptoKeys, validate } from './Accounts.hooks'

describe('createCryptoKeys()', async (should: any) => {
  const { assert } = should('')
  const actual = createCryptoKeys({})

  {
    assert({
      given: 'no arguments',
      should: 'return an object with a publicKey prop',
      actual: typeof actual.publicKey,
      expected: 'string',
    })
  }

  {
    assert({
      given: 'no arguments',
      should: 'return an object with a privateKey prop',
      actual: typeof actual.privateKey,
      expected: 'string',
    })
  }
})

describe('validate() chaining', async (should: any) => {
  const { assert } = should('')
  const next = spy()

  {
    await validate.call({ isNew: false }, next)

    assert({
      given: 'a context of isNew=false and a function',
      should: 'call the function',
      actual: next.calledOnce,
      expected: true,
    })
  }
})

describe('setVerifiedAccountStatus()', async (should: any) => {
  const { assert } = should('')

  {
    const actual = setVerifiedAccountStatus({ verifiedAccount: true })({})

    assert({
      given: 'an object with "verifiedAccount" set to true',
      should: 'return an object with property "verified" set to true',
      actual: actual.verified,
      expected: true,
    })
  }

  {
    const actual = setVerifiedAccountStatus({ verifiedAccount: false })({})

    assert({
      given: 'an object with "verifiedAccount" set to false',
      should: 'return an object with property "verified" set to false',
      actual: actual.verified,
      expected: false,
    })
  }

  {
    const actual = setVerifiedAccountStatus({})({})

    assert({
      given: 'an object without a "verifiedAccount" property',
      should: 'return an object with property "verified" set to false',
      actual: actual.verified,
      expected: false,
    })
  }
})