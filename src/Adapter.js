/* global fetch, Headers */
// @flow
import qs from 'qs'
import merge from 'lodash.merge'
import ponyfill from 'fetch-ponyfill'
const Promise = require('es6-promise').Promise

type OptionsRequest = {
  abort: () => void,
  promise: Promise<*>
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type Options = {
  method: Method,
  headers?: ?{ [key: string]: string },
  onProgress?: (num: number) => mixed,
  data?: ?{ [key: string]: mixed }
}

export function ajaxOptions(options: Options): any {
  let HeadersConstructor = Headers
  const { headers, data, ...otherOptions } = options

  if (typeof HeadersConstructor === 'undefined') {
    HeadersConstructor = ponyfill().Headers
  }

  const baseHeaders = {}
  if (data) {
    baseHeaders['Content-Type'] = 'application/json'
  }

  const headersObject = new HeadersConstructor(
    Object.assign(baseHeaders, headers)
  )

  return {
    ...otherOptions,
    headers: headersObject,
    body: data ? JSON.stringify(data) : null
  }
}

export function checkStatus(response: any): any {
  return response.text().then(text => {
    let json = {}
    if (text) {
      try {
        json = JSON.parse(text)
      } catch (e) {
        console.log('Parse JSON fail')
      }
    }
    return response.ok ? json : Promise.reject(json)
  })
}

export function checkDownload(response: any): any {
  return response.blob().then(blob => {
    return response.ok ? blob : Promise.reject(blob)
  })
}

function ajax(url: string, options: Options): OptionsRequest {
  let fetchMethod = fetch
  let rejectPromise

  if (options.method === 'GET' && options.data) {
    url = `${url}?${qs.stringify(options.data)}`
    delete options.data
  }

  if (typeof fetchMethod === 'undefined') {
    fetchMethod = ponyfill().fetch
  }

  let resolveMethod
  if (options.raw) {
    resolveMethod = checkDownload
  } else {
    resolveMethod = checkStatus
  }

  const xhr = fetchMethod(url, ajaxOptions(options))
  const promise = new Promise((resolve, reject) => {
    rejectPromise = reject
    xhr.then(resolveMethod).then(resolve, error => {
      const ret = error && (error.error || error.errors || error)

      return reject(ret || {})
    })
  })

  const abort = () => rejectPromise('abort')

  return { abort, promise }
}

export default {
  apiPath: '',
  commonOptions: {},

  get(path: string, data: ?{}, options?: {} = {}): OptionsRequest {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'GET' }, this.commonOptions, options, { data })
    )
  },

  post(path: string, data: ?{}, options?: {} = {}): OptionsRequest {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'POST' }, this.commonOptions, options, { data })
    )
  },

  put(path: string, data: ?{}, options?: {} = {}): OptionsRequest {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'PUT' }, this.commonOptions, options, { data })
    )
  },

  del(path: string, options?: {} = {}): OptionsRequest {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'DELETE' }, this.commonOptions, options)
    )
  }
}
