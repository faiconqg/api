import React from 'react'
import { apiClient } from 'mobx-rest'
import adapter from './Adapter'

export default (apiPath, token) => {
  apiClient(adapter, {
    apiPath,
    commonOptions: { headers: { 'X-Access-Token': token } }
  })
}
