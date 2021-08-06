import { getModule } from 'vuex-module-decorators'
import CountriesModule from './countries'
import NewsModule from './news'
import SourcesModule from './sources'
import UsersModule from './users'
import NotificationModule from './notifications'

export function getNotificationModule(store: any): NotificationModule {
  return getModule(NotificationModule, store)
}

export function getSourceModule(store: any): SourcesModule {
  return getModule(SourcesModule, store)
}
export function getUsersModule(store: any): UsersModule {
  return getModule(UsersModule, store)
}
export function getNewsModule(store: any): NewsModule {
  return getModule(NewsModule, store)
}
export function getCountriesModule(store: any): CountriesModule {
  return getModule(CountriesModule, store)
}
