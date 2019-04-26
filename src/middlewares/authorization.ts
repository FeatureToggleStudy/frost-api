import { verify } from 'jsonwebtoken'

import { AccountController } from '../controllers/AccountController'
import { errors } from '../errors/errors'
import { Vault } from '../utils/Vault/Vault'

const { AuthenticationFailed, ExpiredToken, InvalidToken } = errors

export const extractToken = (ctx: any): string => (ctx.header.token ? ctx.header.token : ctx.params.token) || ''

export const authorization = (accountController: AccountController) => {

  return async (ctx: any, next: any) => {
    // TODO: add configuration to ctx in app.ts so middlewares have access.
    // This is needed until we can figure out how to restart vault between
    // individual tests.
    // Currently a hack used to prevent errors in integration tests.
    if (process.env.SKIP_VAULT === 'true') return (ctx.status = 404)

    const logger = ctx.logger(__dirname)

    try {
      const secret = await Vault.readSecret('frost')
      const { jwt } = secret.data
      const decoded = verify(extractToken(ctx).replace('TEST_', ''), jwt)
      const { client_token, email } = decoded as any

      const tokenData = await Vault.verifyToken(client_token)
      ctx.state.tokenData = tokenData
      ctx.state.user = await accountController.findByEmail(email)
      ctx.state.jwtSecret = jwt
      return ctx.state.user ? next() : (ctx.status = 404)
    } catch (exception) {
      logger.error({ exception }, 'middleware.authorization')

      switch (exception.message) {
        case 'bad token':
          ctx.throw(ExpiredToken.code, ExpiredToken.message)
          break
        case 'invalid token':
          ctx.throw(InvalidToken.code, InvalidToken.message)
          break
        case 'jwt malformed':
          ctx.throw(InvalidToken.code, InvalidToken.message)
          break
        default:
          ctx.throw(AuthenticationFailed.code, AuthenticationFailed.message)
      }
    }
  }
}
