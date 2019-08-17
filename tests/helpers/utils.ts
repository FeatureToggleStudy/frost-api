/* tslint:disable:no-relative-imports */
import { promisify } from 'util'

import { Frost } from '../../src/Frost'
import { dbHelper } from './database'

export const FROST_HOST = 'localhost'
export const FROST_PORT = '30080'
export const FROST_URL = `http://${FROST_HOST}:${FROST_PORT}`

export const testUserEmail = 'test-ci@po.et'
export const testUserPassword = 'aB%12345678910'

export const runtimeId = () => `${process.pid}-${new Date().getMilliseconds()}-${Math.floor(Math.random() * 10)}`
export const delay = promisify(setTimeout)

export const createDatabase = async (prefix: string) => {
  const db = dbHelper()

  return {
    teardown: db.teardown,
    settings: await db.setup(prefix),
  }
}

const defaultBlockchainSettings = {
  MINIMUM_BLOCK_HEIGHT: 100,
  ANCHOR_INTERVAL_IN_SECONDS: 10,
  BATCH_CREATION_INTERVAL_IN_SECONDS: 5,
  READ_DIRECTORY_INTERVAL_IN_SECONDS: 5,
  UPLOAD_CLAIM_INTERVAL_IN_SECONDS: 5,
}

export const setUpServerAndDb = async ({
  PREFIX,
  NODE_PORT,
  blockchainSettings = defaultBlockchainSettings,
}: {
  PREFIX: string
  NODE_PORT: string
  blockchainSettings?: any,
}) => {
  const db = await createDatabase(PREFIX)
  const server = await Frost({
    BITCOIN_URL: process.env.BITCOIN_URL || 'bitcoind-1',
    API_PORT: NODE_PORT,
    MONGODB_DATABASE: db.settings.tempDbName,
    MONGODB_USER: db.settings.tempDbUser,
    MONGODB_PASSWORD: db.settings.tempDbPassword,
    EXCHANGE_PREFIX: PREFIX,
    ...blockchainSettings,
  })
  await delay(5 * 1000)
  return { db, server }
}

export const baseUrl = (port: string, host: string = 'localhost') => `http://${host}:${port}`

export const getHeader = (result: any, property: string) => {
  const headers = result.headers
  const value = headers.get(property)
  return value
}
