import * as KoaRouter from 'koa-router'

import { AccountController } from '../controllers/AccountController'
import { authorization } from '../middlewares/authorization'
import { isLoggedIn } from '../middlewares/isLoggedIn'
import { monitor } from '../middlewares/monitor'
import { requireEmailVerified } from '../middlewares/requireEmailVerified'
import { validate } from '../middlewares/validate'
import { SendEmail, SendEmailConfiguration } from '../utils/SendEmail'

import { PasswordComplexConfiguration } from './PasswordComplexConfiguration'
import { Path } from './Path'

import { CreateAccount, CreateAccountSchema } from './accounts/CreateAccount'
import { ForgotPassword, ForgotPasswordSchema } from './accounts/ForgotPassword'
import { GetAccount, GetAccountSchema } from './accounts/GetAccount'
import { Login, LoginSchema } from './accounts/Login'
import { PasswordChange, PasswordChangeSchema } from './accounts/PasswordChange'
import { PasswordChangeToken, PasswordChangeTokenSchema } from './accounts/PasswordChangeToken'
import { PatchAccount, PatchAccountSchema } from './accounts/PatchAccount'
import { VerifyAccount } from './accounts/Verify'
import { VerifyAccountToken } from './accounts/VerifyToken'

import { GetHealth } from './health/GetHealth'

import { CreateToken } from './tokens/CreateToken'
import { GetToken } from './tokens/GetToken'
import { RemoveToken, RemoveTokenSchema } from './tokens/RemoveToken'

import { CreateWork, CreateWorkSchema } from './works/CreateWork'
import { GetWork, GetWorkSchema } from './works/GetWork'
import { GetWorks } from './works/GetWorks'

export const routes = (accountController: AccountController) => (
  passwordComplexConfiguration: PasswordComplexConfiguration,
  sendEmailConfiguration: SendEmailConfiguration,
  poetUrl: string,
  maxApiTokens: number,
  testPoetUrl: string,
  verifiedAccount: boolean,
  pwnedCheckerRoot: string,
) => {
  const router = new KoaRouter()
  const sendEmail = SendEmail(sendEmailConfiguration)

  router.use([Path.WORKS, Path.WORKS_WORKID], (ctx: any, next: any) => {
    ctx.set('Access-Control-Allow-Methods', 'POST,GET')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type,token')

    return next()
  })

  router.use([Path.PASSWORD_CHANGE, Path.PASSWORD_CHANGE_TOKEN, Path.PASSWORD_RESET])
  router.use([Path.ACCOUNTS])
  router.use([Path.LOGIN])

  router.use(
    [
      Path.ACCOUNTS_VERIFY_TOKEN,
      Path.ACCOUNTS_VERIFY,
      Path.PASSWORD_CHANGE,
      Path.PASSWORD_CHANGE_TOKEN,
      Path.WORKS,
      Path.WORKS_WORKID,
      Path.TOKENS,
      Path.TOKENS_TOKENID,
    ],
    authorization(verifiedAccount, pwnedCheckerRoot),
  )

  router.use([Path.WORKS, Path.WORKS_WORKID], requireEmailVerified())

  router.use([Path.TOKENS], isLoggedIn())

  const secureKeys = ['password', 'token', 'tokenId']
  router.use(monitor(secureKeys))

  router.post(
    Path.ACCOUNTS,
    validate({ body: CreateAccountSchema(passwordComplexConfiguration) }),
    CreateAccount(accountController),
  )
  router.get(
    Path.ACCOUNTS_ID,
    validate(GetAccountSchema),
    GetAccount(accountController),
  )
  router.patch(
    Path.ACCOUNTS_ID,
    authorization(verifiedAccount, pwnedCheckerRoot),
    validate(PatchAccountSchema),
    PatchAccount(),
  )

  router.post(
    Path.PASSWORD_RESET,
    validate({ body: ForgotPasswordSchema }),
    ForgotPassword(sendEmail, verifiedAccount, pwnedCheckerRoot),
  )
  router.post(Path.LOGIN, validate({ body: LoginSchema }), Login(verifiedAccount, pwnedCheckerRoot))
  router.post(
    Path.PASSWORD_CHANGE,
    validate({ body: PasswordChangeSchema(passwordComplexConfiguration) }),
    PasswordChange(verifiedAccount, pwnedCheckerRoot),
  )
  router.post(
    Path.PASSWORD_CHANGE_TOKEN,
    validate({ body: PasswordChangeTokenSchema(passwordComplexConfiguration) }),
    PasswordChangeToken(sendEmail, verifiedAccount, pwnedCheckerRoot),
  )
  router.post(Path.ACCOUNTS_VERIFY, VerifyAccount(sendEmail))
  router.get(Path.ACCOUNTS_VERIFY_TOKEN, VerifyAccountToken(verifiedAccount, pwnedCheckerRoot))

  router.post(Path.TOKENS, CreateToken(maxApiTokens))
  router.get(Path.TOKENS, GetToken(verifiedAccount, pwnedCheckerRoot))
  router.get(Path.HEALTH, GetHealth())
  router.del(Path.TOKENS_TOKENID, validate({ params: RemoveTokenSchema }), RemoveToken())

  router.post(
    Path.WORKS,
    validate({ body: CreateWorkSchema, options: { allowUnknown: true } }),
    CreateWork(poetUrl, testPoetUrl),
  )
  router.get(Path.WORKS_WORKID, validate({ params: GetWorkSchema }), GetWork(poetUrl, testPoetUrl))
  router.get(Path.WORKS, GetWorks(poetUrl, testPoetUrl))

  return router
}
