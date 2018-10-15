import * as Joi from 'joi'

import { errors } from '../../errors/errors'
import { WorksController } from '../../modules/Works/Works.controller'
import { logger } from '../../utils/Logger/Logger'
import { Vault } from '../../utils/Vault/Vault'
import { isLiveNetwork } from '../accounts/utils/utils'

export const CreateWorkSchema = () => ({
  name: Joi.string().required(),
  datePublished: Joi.string()
    .required()
    .isoDate(),
  dateCreated: Joi.string()
    .required()
    .isoDate(),
  author: Joi.string().required(),
  tags: Joi.string().allow(''),
  text: Joi.string().required(),
})

export const CreateWork = (poetUrl: string, testPoetUrl: string) => async (ctx: any, next: any): Promise<any> => {
  try {
    const { user, tokenData } = ctx.state
    const {
      data: {
        meta: { network },
      },
    } = tokenData
    const { WorkError } = errors

    const newWork = ctx.request.body
    const privateKey = await Vault.decrypt(user.privateKey)
    const nodeNetwork = isLiveNetwork(network) ? poetUrl : testPoetUrl

    const work = new WorksController(nodeNetwork, privateKey, newWork)
    const claim = await work.generateClaim()

    try {
      await work.create(claim)
    } catch (e) {
      ctx.status = WorkError.code
      ctx.body = WorkError.message
      return
    }

    ctx.status = 200
    ctx.body = { workId: claim.id }
  } catch (e) {
    logger.error('api.CreateWork', e)
    ctx.status = 500
  }
}
