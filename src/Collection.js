import { Collection as BaseCollection } from 'mobx-rest'

export default class Collection extends BaseCollection {
  where = filterObject => this.fetch({ data: { filter: { where: filterObject } } })
  busy = () => this.isRequest('fetching')
}