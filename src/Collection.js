import { Collection } from 'mobx-rest'

export default class MyCollection extends Collection {
  where = filterObject => this.fetch({ data: { filter: { where: filterObject } } })
}