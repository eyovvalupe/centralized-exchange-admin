import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { useUserStore } from '/@/store'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import menus from './modules/menus'
 
// 配置路由信息
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录'
    }
  },
  {
    path: '/changePassword',
    name: 'ChangePassword',
    component: () => import('/@/views/changePassword/index.vue'),
    meta: {
      hidden: true,
      title: '修改密码'
    }
  },
  {
    path: '/googleValidator',
    name: 'GoogleValidator',
    component: () => import('/@/views/googleValidator/index.vue'),
    meta: {
      hidden: true,
      title: '绑定谷歌验证器'
    }
  }
]

export const asyncRoutes = [
  ...menus
]
const router = createRouter({
  history: createWebHashHistory('./'),
  routes: constantRoutes.concat(asyncRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 })
})
// 路由守卫
router.beforeEach((to, from, next) => {
  const  userStore = useUserStore()
  const token = localStorage.getItem('token') || userStore.token;
  if (to.path === '/') {
    if (token) {
      next('/dashboard');
    } else {
      next('/login');
    }
  } else {
    if(checkAuthCode(to.meta.auth)){
      next();
    }else{
      next('/login');
    }
  }
});
export function resetRouter () {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
