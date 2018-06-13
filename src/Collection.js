import { Collection as BaseCollection } from 'mobx-rest'

export default class Collection extends BaseCollection {
  _forceBusy = false
  _query = { data: { filter: { } } }

  where = filterObject => {
    Object.assign(this._query.data.filter,  { where: filterObject } )
    return this
  }

  include = includes => {
    Object.assign(this._query.data.filter,  { include: includes } )
    return this
  }

  custom = (method, body, forceBusy = false) => {
    this._forceBusy = forceBusy
    return this.rpc(method, body)
  }

  all = () => this.fetch(this._query)

  busy = () => !!this.request || this._forceBusy
}