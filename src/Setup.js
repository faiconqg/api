import React from 'react'
import { apiClient } from 'mobx-rest'
import adapter from './Adapter'

export default (apiPath, token, headers) => {
  apiClient(adapter, {
    apiPath,
    // commonOptions: { headers: { 'X-Access-Token': token } }
    commonOptions: {
      headers: Object.assign({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }, headers)
    }
  })
}
