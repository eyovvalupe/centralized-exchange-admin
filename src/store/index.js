import { createPinia } from 'pinia'
import useUserStore from './modules/users'
import useTagsViewStore from './modules/tagsView'
import useAppStore from './modules/app'
// import useSettingsStore from './modules/settings'
import usePermissionStore from './modules/permission'
import useServiceStore from './modules/service'
import useServiceStoreC2C from './modules/serviceC2C'
import useSocketStore from './modules/socket'
import useCommonStore from './modules/common'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export function registerStore (app) {
  app.use(store)
}

export { useUserStore,useServiceStoreC2C,useServiceStore,useSocketStore, useTagsViewStore, useAppStore, usePermissionStore, useCommonStore }

export default store
