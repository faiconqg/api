import React from 'react'
import { apiClient } from 'mobx-rest'
// import adapter from './Adapter'
import axios from 'axios'
const createAdapter: any = require('mobx-rest-axios-adapter').default

export default (
  apiPath,
  token = null,
  headers = null,
  tokenKey = 'Authorization'
) => {
  let headersObj = { 'Content-Type': 'application/json' }

  if (headers) {
    headersObj = Object.assign(headersObj, headers)
  }

  if (token) {
    headersObj[tokenKey] = token
  }

  apiClient(createAdapter(axios), {
    apiPath,
    commonOptions: {
      headers: headersObj
    }
  })
}
