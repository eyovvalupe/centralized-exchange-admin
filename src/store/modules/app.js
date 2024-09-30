import { defineStore } from 'pinia'

const useAppStore = defineStore( {
  persist: {
    paths: ['sidebar', 'lang','tabs','curTab']
  },
  id : 'app',
  state : () => {
    return {
      sidebar : {
        // opened : cookies.get( 'sidebarStatus' ) ? !!+cookies.get( 'sidebarStatus' ) : true,
        withoutAnimation : false
      },
      device : 'desktop',
      size : 'large',
      lang : 'zh',
      tabs : ['Dashboard'], // 缓存的tabs
      curTab : 'Dashboard', // 当前tab
      refreshTab : '' // tab刷新状态
    }
  },
  actions : {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if ( this.sidebar.opened ) {
        // cookies.set( 'sidebarStatus', 1 )
      } else {
        // cookies.set( 'sidebarStatus', 0 )
      }
    },
    CLOSE_SIDEBAR( withoutAnimation ) {
      // cookies.set( 'sidebarStatus', 0 )
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE( device ) {
      this.device = device
    },
    SET_SIZE( size ) {
      this.size = size
      // cookies.set( 'size', size )
    },
    SET_LANG( lang ) {
      this.lang = lang
      // cookies.set( 'lang', lang )
    },
    SET_TABS( tabs ) {
      this.tabs = tabs
    },
    SET_CURTAB( tab ) {
      this.curTab = tab
    },
    SET_REFRESHTAB( tab ) {
      this.refreshTab = tab
    }
  }
} )

export default useAppStore
