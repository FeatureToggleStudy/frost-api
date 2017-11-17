import * as Joi from 'joi'
import { SendEmail } from '../../../modules/SendEmail/SendEmail'
import { usersController } from '../../../modules/Users/User'
import { errors } from '../../errors/errors'
import { getToken } from '../utils/utils'

import { ControllerApi } from '../../../interfaces/ControllerApi'

export class CreateAccount implements ControllerApi {
  async handler(ctx: any, next: any): Promise<any> {
    try {
      const user = ctx.request.body
      const response = await usersController.create(user)
      const { email } = response
      const sendEmail = new SendEmail(email)

      const token = await getToken(email)
      await sendEmail.sendVerified(token)

      ctx.body = { token }
    } catch (e) {
      const { AccountAlreadyExists } = errors
      ctx.throw(AccountAlreadyExists.code, AccountAlreadyExists.message)
    }
  }

  validate(): object {
    return {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required()
    }
  }
}
