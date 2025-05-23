import router from './router'
import getPageTitle from '/@/utils/getPageTitle'
import { useUserStore } from '/@/store' // usePermissionStore
import NProgress from '/@/utils/progress'

const whiteList = ['/login']
router.beforeEach( async( to, from, next ) => {
  NProgress.start()
  document.title = getPageTitle( to.meta?.title )
  const userStore = useUserStore()
  const hasToken = userStore.token
  // const permissionStore = usePermissionStore()
  if ( hasToken ) {
    if ( to.path === '/login' ) {
      next( { path : '/' } )
      // NProgress.done()
    } else {
      next()
      // const hasRoles = userStore.roles && userStore.roles.length > 0
      // if ( hasRoles ) {
      //   next()
      // } else {
      //   try {
      //     const { roles } = await userStore.GET_USER_INFO()
      //     const accessRoutes = await permissionStore.SET_ROUTES( roles )
      //     accessRoutes.forEach( item => {
      //       router.addRoute( item )
      //     } )
      //     next( { ...to, replace : true } )
      //   } catch ( error ) {
      //     // await userStore.RESET_INFO()
      //     next( '/login' )
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    if ( whiteList.indexOf( to.path ) !== -1 ) {
      next()
    } else {
      next( '/login' )
      NProgress.done()
    }
  }
} )

router.afterEach( () => {
  NProgress.done()
} )
