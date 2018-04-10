import { Model as BaseModel } from 'mobx-rest'

export default class Model extends BaseModel {
  _query = { data: { filter: { } } }

  where = filterObject => {
    Object.assign(this._query.data.filter,  { where: filterObject } )
    return this
  }

  include = includes => {
    Object.assign(this._query.data.filter,  { include: includes } )
    return this
  }

  one = () => this.fetch(this._query)

  busy = () => !!this.request

  g = key => this.get(key)
}