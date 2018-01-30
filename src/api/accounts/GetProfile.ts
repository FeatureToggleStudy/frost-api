import { errors } from '../../errors/errors'

import { ControllerApi } from '../../interfaces/ControllerApi'

export class GetProfile implements ControllerApi {
  async handler(ctx: any, next: any) {
    try {
      const { user } = ctx.state
      const { createdAt, verified } = user
      ctx.body = { createdAt, verified }
    } catch (e) {
      const { InternalError } = errors
      ctx.throw(InternalError.code, InternalError.message)
    }
  }

  validate() {
    return {}
  }
}