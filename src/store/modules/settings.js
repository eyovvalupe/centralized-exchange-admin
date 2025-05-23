import { defineStore } from 'pinia'
import variables from '/@/assets/styles/element-variables.scss'
// import { localStorageHandle } from '/@/utils/storage'
// import defaultSettings from '/@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const useSettingsStore = defineStore( {
  id : 'settings',
  state : () => {
    // const localTagsView = localStorageHandle.getItem( 'tagsView' )
    // const localFixedHeader = localStorageHandle.getItem( 'fixedHeader' )
    // const localSidebarLogo = localStorageHandle.getItem( 'sidebarLogo' )
    // const localFinanceSettings = localStorageHandle.getItem( 'financeSettings' )
    // return {
    //   theme : variables.theme,
    //   showSettings,
    //   tagsView : localTagsView ? !!+localTagsView : tagsView,
    //   fixedHeader : localFixedHeader ? !!+localFixedHeader : fixedHeader,
    //   sidebarLogo : localSidebarLogo ? !!+localSidebarLogo : sidebarLogo,
    //   layoutMod : localStorageHandle.getItem( 'layoutMod' ) == 'horizontal' ? 'vertical' : 'vertical',
    //   financeSettings : localFinanceSettings
    // }
  },
  actions : {
    CHANGE_SETTING( { key, value } ) {
      // eslint-disable-next-line no-prototype-builtins
      // if ( this.hasOwnProperty( key ) ) {
      //   this[key] = value
      //   localStorageHandle.setItem( key, +value )
      // }
    },
    CHANGE_LAYOUT_MOD( val = 'vertical' ) {
      const mod = val == 'vertical' ? 'vertical' : 'horizontal'
      // localStorageHandle.setItem( 'layoutMod', mod )
      this.layoutMod = mod
    }
  }
} )
export default useSettingsStore
