import fetch from 'node-fetch'
import { promisify } from 'util'
import { configuration } from './configuration'
const delay = promisify(setTimeout)

export enum Method {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DEL = 'delete',
  ALL = 'all',
}

export class Mail {
  public client: any
  public host: string = configuration.maildevUrl
  public timeout: number = 10

  async timeoutPromise(): Promise<Response> {
    await delay(this.timeout * 1000)
    throw new Error('That last request took too long. Please try again in a few seconds.')
  }

  async getEmails(): Promise<ReadonlyArray<{ subject: string; from: ReadonlyArray<{ name: string }> }>> {
    const options = {
      method: Method.GET,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const request = fetch(`${this.host}/email`, options)

    const response = await Promise.race([request, this.timeoutPromise()])
    if (response.ok) return response.json()
    throw await response.text()
  }

  async removeById(id: string): Promise<string> {
    const options = {
      method: Method.DEL,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const request = fetch(`${this.host}/email/${id}`, options)

    const response = await Promise.race([request, this.timeoutPromise()])
    if (response.ok) return response.text()
    throw await response.text()
  }

  async removeAll(): Promise<string> {
    const options = {
      method: Method.DEL,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const request = fetch(`${this.host}/email/all`, options)

    const response = await Promise.race([request, this.timeoutPromise()])
    if (response.ok) return response.text()
    throw await response.text()
  }
}
