import * as Joi from 'joi'
import bytesToUuid = require('uuid/lib/bytesToUuid' )

import { AccountNotFound } from '../../errors/errors'
import { ValidateParams } from '../../middlewares/validate'
import { AccountsController } from '../../modules/Accounts/Accounts.controller'

export const GetAccountSchema: ValidateParams = {
  params: () => ({
    issuer: Joi.string().required(),
  }),
}

export const GetAccount = () => async (ctx: any, next: any): Promise<any> => {
  const logger = ctx.logger(__dirname)
  const { issuer } = ctx.params

  logger.info({ issuer }, 'GetAccount')

  const accountsController = new AccountsController(ctx.logger, false, null)

  const response = await accountsController.getByIssuer(issuer)

  if (!response)
    throw new AccountNotFound()

  const { id, email, createdAt, name, bio, ethereumAddress } = response
  ctx.body = { id: id && bytesToUuid(id), email, createdAt, name, bio, ethereumAddress }
}
