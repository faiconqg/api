import React from 'react'
import { apiClient } from 'mobx-rest'
import adapter from 'mobx-rest-fetch-adapter'

export default apiPath => {apiClient(adapter, { apiPath })}