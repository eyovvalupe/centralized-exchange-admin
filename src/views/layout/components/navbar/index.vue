<template>
  <section class="app-header">
    <!-- 第一排 -->
    <header class="header-bg h-[40px] w-full flex border-b text-sm">
      <el-menu popper-class="header-menus" :default-active="activeIndex" :hide-timeout="100" :show-timeout="0"
        :collapse-transition="false" class="h-[40px] flex-1" mode="horizontal" @select="handleSelect"
        v-show="routesList.length">
        <template v-for="(item, index) in routesList" :key="index">
          <el-menu-item :hide-timeout="100" :show-timeout="0" :collapse-transition="false" :index="item.name || ''"
            v-if="!item.children || item.hiddenChild">{{ item.meta.title }}</el-menu-item>
          <el-sub-menu :hide-timeout="100" :show-timeout="0" :collapse-transition="false" :index="item.name || ''" v-else
            class="top-sub-menu">
            <template #title>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="(_item, _index) in item.children" :key="_index">
              <template v-if="!_item.subMenu && !_item.meta.hidden">
                <p class="menu-border border-t" v-if="_item.meta.border"></p>
                <el-menu-item :hide-timeout="100" :show-timeout="0" :index="_item.name || ''"
                  :class="{ 'no-menu-auth': _item.meta.notopen || !checkAuthCode(_item.meta.auth) }"
                  v-if="_item.hidden === undefined">
                  <el-image :src="`/images/menus/${_item.icon}.svg`" class="w-4 h-4 mr-2">
                    <template #error>
                      <div class="image-slot">
                        <el-icon>
                          <Picture />
                        </el-icon>
                      </div>
                    </template>
                  </el-image>
                  {{ _item.meta.title }}
                </el-menu-item>
              </template>
              <template v-else-if="!_item.meta.hidden">
                <p class="menu-border border-t" v-if="_item.meta.border"></p>
                <el-sub-menu :class="{ 'no-menu-auth': _item.meta.notopen || !checkAuthCode(_item.meta.auth) }"
                  :hide-timeout="100" :show-timeout="0" :index="_item.name || ''" :collapse-transition="false">
                  <template #title>
                    <el-image :src="`/images/menus/${_item.icon}.svg`" class="w-4 h-4 mr-2">
                      <template #error>
                        <div class="image-slot">
                          <el-icon>
                            <Picture />
                          </el-icon>
                        </div>
                      </template>
                    </el-image>
                    {{ _item.meta.title }}
                  </template>


                  <el-menu-item :hide-timeout="100"
                    :class="{ 'no-menu-auth': __item.meta.notopen || !checkAuthCode(__item.meta.auth) }"
                    :show-timeout="0" :collapse-transition="false" :index="__item.name || ''"
                    v-for="(__item, __index) in _item.children" :key="__index">
                    <el-image :src="`/images/menus/${__item.icon}.svg`" class="w-4 h-4 mr-2">
                      <template #error>
                        <div class="image-slot">
                          <el-icon>
                            <Picture />
                          </el-icon>
                        </div>
                      </template>
                    </el-image>
                    {{ __item.meta.title }}
                  </el-menu-item>

                </el-sub-menu>
              </template>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
      <!-- 第二排 -->
      <ul class="menu-two flex items-center text-sm">
        <li v-for="item in shortCut" :key="item.name" class="cursor-pointer flex items-center"
          @click="onShortCut(item)">
          <span class="px-2 mr-4 flex items-center" :style="{ color: appStore.curTab === item.name ? '#165DFF' : '' }">
            <span class="badge-box">
              <el-image :src="`/images/menus/${item.icon || item.name}.svg`" class="w-5 h-5 mr-1">
                <template #error>
                  <span class="image-slot"> </span>
                </template>
              </el-image>
              <span>{{ item.text }}</span>
              <el-badge :value="messageNumObj[item.badge]" v-if="messageNumObj[item.badge]"></el-badge>
            </span>
          </span>
        </li>
      </ul>
      <div class="flex menu-three">
        <div class="flex items-center pr-5">
          <el-switch v-model="sound" @change="changeVoice" size="small" />
          <div class="ml-2">声音</div>
        </div>
        <div class="flex items-center pr-5 cursor-pointer" @click="toggle()">
          <el-icon>
            <FullScreen v-if="!isFullscreen" />
            <el-image v-else src="/images/menus/FullScreen2.svg"></el-image>
          </el-icon>
          <div class="ml-2">全屏</div>
        </div>
        <el-dropdown class="p8 avatar-container right-menu-item hover-effect">
          <div class="flex items-center pr-2">
            <!-- <span class="mr-2">{{ userName }}</span> -->
            <!-- 顶部导航 用户名改成头像 -->
            <el-image src="/images/menus/nav-user.png" class="nav-user-icon"></el-image>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu :size="'large'">
              <el-dropdown-item>
                <User style="width: 1em; height: 1em; margin-right: 8px" />{{ userName }}
              </el-dropdown-item>
              <el-dropdown-item @click="goGooglePage">
                <span class="flex justify-center align-middle" :class="{ 'no-menu-auth': googlebind }">
                  <TopRight style="width: 1em; margin-right: 8px" />
                  <span>绑定谷歌验证码</span>
                </span>
              </el-dropdown-item>
              <el-dropdown-item @click="showDialog('loginPassword')">
                <Edit style="width: 1em; height: 1em; margin-right: 8px" />修改登录密码
              </el-dropdown-item>
              <el-dropdown-item @click="showDialog('verifyPassword')">
                <EditPen style="width: 1em; height: 1em; margin-right: 8px" />修改交易密码
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <Close style="width: 1em; height: 1em; margin-right: 8px" />退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <!-- 第三排 -->
    <footer class="bg-white">
      <el-tabs v-model="activeIndex" type="card" closable @tab-click="handleClickTab" @tab-remove="removeTab">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.meta.title" :name="item.name">
          <template #label>
            <span>
              <el-icon class="relative top-[2px] mr-2 animate" v-if="appStore.refreshTab == item.name">
                <RefreshRight />
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </footer>
    <Suspense>
      <UpdatePassword v-model="dialogShow" :action="dialogType" @close="dialogShow = false" :key="dialogShow" />
    </Suspense>
      <GoogleValidator ref="googleDialogShowRef" />
      <!-- <GoogleValidator ref="googleDialogShowRef" ></GoogleValidator> -->
  </section>
  <div class="service">
    <!-- @close="handleClose" -->
     <el-dialog :close-on-click-modal="false" v-model="dialogVisible" title="客服工作台" draggable :fullscreen="true" :close-on-press-escape="false"
      >
      <serviceComponents />
    </el-dialog>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, Fragment, watch,unref } from 'vue'
import { UserFilled, FullScreen } from '@element-plus/icons-vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import serviceComponents from '../service/index.vue'
import { useRouter } from 'vue-router'
import { useServiceStore, useUserStore, useAppStore, useCommonStore } from '/@/store'
import { apilogout } from '/@/api/modules/login.api'
import routes from '/@/router/modules/menus'
import UpdatePassword from '../../components/updatePwd'

// import ServiceDialog from './components/service'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { ServiceChat } from '../service/components/common/ServiceChat'
import GoogleValidator from './components/index.vue'
const googleDialogShowRef = ref(); // 实例化
const useService = useServiceStore()
const userStore = useUserStore()
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
// const getImage = name => {
//   return new URL(`/src/assets/images/menus/${name}.svg`, import.meta.url).href
// }
const el = ref(document.body)
const { toggle, isFullscreen } = useFullscreen(el)

const routesList = ref(routes)
// 是否显示弹框
const dialogShow = ref(false)
const dialogType = ref('loginPassword')

const showDialog = type => {
  dialogType.value = type
  dialogShow.value = true
}
// 谷歌验证器弹窗
const googleDialogShow = ref(false)

const dialogVisible = ref(false)
const sound = ref(useService.playVoice)
const messageNumObj = computed(() => useService.messageNumObj)
const shortCut = ref([
  { name: 'RechargeOrder', icon: "RechargeOrder", badge: 'deposit', text: '充值', type: 'badge' },
  { name: 'DepositOrder', icon: "tx", badge: 'withdraw', text: '提现', type: 'badge', notArrow: false },
  { name: 'kycList', icon: "smrz", badge: 'kyc', text: '实名审核', type: 'badge', notArrow: false },
  { name: 'notice', icon: "kf", badge: 'support', text: '客服', type: 'badge', isDialog: true, notArrow: false },
  // { name: 'service', text: '客服', type: 'arrow', isDialog: true },
  // { name: 'service', text: '客服', isDialog: true },
  // { name: 'Console', text: 'Crash控制台', isRoute: true },
  // { name: 'Player', text: '玩家', isRoute: true },
])
const showService = ref(false)
// short cut click
const onShortCut = item => {
  if (checkAuthCode(601)) {
    if (item.isDialog) {
      // console.log('客服')
      showService.value = !showService.value
      dialogVisible.value = true
    } else {
      if (!appStore.tabs.includes(item.name)) {
        appStore.tabs.push(item.name)
      }
      appStore.curTab = item.name
      router.push({ name: item.name })
    }
  }
}
const changeVoice = (val: any) => {
  useService.setPlayVoice(val);
}
// 扁平路由
const getFlatRoutes = routes => {
  const _routes = []
  routes.map(item => {
    // 打平路由
    if (item.children && item.children.length) {
      item.children.map(_item => {
        if (!_item.subMenu) {
          _routes.push(_item)
        }
        if (_item.children && _item.children.length) {
          _item.children.map(__item => {
            _routes.push(__item)
          })
        }
      })
    }
  })
  return _routes
}

const flatRoutes = computed(() => {
  return getFlatRoutes(routes)
})

const router = useRouter()
const appStore = useAppStore()

// 用户名
const userName = computed(() => userStore.userInfo.username)
const googlebind = computed(() => userStore.userInfo.googlebind)
// const goGooglePage = () => {
//   if (!googlebind.value) {
//     // router.push('/googleValidator')
//     googleDialogShow.value = true
//   }
// }
// 当前激活的tabs
const tabs = computed(() => {
  return flatRoutes.value.filter(item => appStore.tabs.includes(item.name))
})

const activeIndex = computed(() => appStore.curTab || 'Dashboard')
const useCommon = useCommonStore()
// 选中菜单
const handleSelect = (key) => {
  if (key === 'UserData') {
    useCommon.userDataDialog = true
    useCommon.selectUser = true
  } else {
    if (!appStore.tabs.includes(key)) {
      appStore.tabs.push(key)
    }
    appStore.curTab = key
    router.push({ name: key })
  }
  setTimeout(() => {
    useAppStore().SET_REFRESHTAB('') // 关闭刷新
  }, 2000);
}

onMounted(() => {
  const { name, meta } = router.currentRoute.value
  if (appStore.curTab !== name) {
    if (name !== '') {
      if (!appStore.tabs.includes(name)) {
        appStore.tabs.push(name)
      }
      appStore.curTab = name
    }
  }
  if (!appStore.curTab || !checkAuthCode(meta.auth)) {
    // appStore.tabs = [];
    appStore.curTab = 'Dashboard'
  }
  ServiceChat.initNum()
})
// changeScale(scale);
// 点击第三排tab
const handleClickTab = pane => {
  //location.reload()
  const tab = pane.paneName
  appStore.curTab = tab
  // appStore.refreshTab = tab
  if (router.currentRoute.value.path == '/' + tab || router.currentRoute.value.name == tab) {
    Bus.emit(`update:${pane.paneName}`, pane.paneName)
  } else {
    appStore.SET_REFRESHTAB(tab)
    router.push({name:tab})
    // router.push(`/${tab}`)
  }
  setTimeout(() => {
    useAppStore().SET_REFRESHTAB('') // 关闭刷新
  }, 2000);
}

// 删除tab
const removeTab = pane => {
  const index = appStore.tabs.findIndex(item => item == pane)
  let needPush = false
  if (index === 0 && appStore.tabs.length === 1) {
    // 只有一个 的时候不允许删除
    return
  }
  appStore.curTab = appStore.tabs[appStore.tabs.length - 1]
  if (pane === appStore.curTab) {
    // 删除的是当前激活的tab
    const lastIndex = appStore.tabs.length - 1
    if (index === lastIndex) {
      appStore.curTab = appStore.tabs[lastIndex - 1]
    } else {
      appStore.curTab = appStore.tabs[lastIndex]
    }
    needPush = true
  }
  appStore.tabs.splice(index, 1)
  if (needPush) {
    // 删除的是当前激活的tab需要跳转路由
    router.push(`/${appStore.curTab}`)
  }
}
// 修改密码
const handleChangePassword = () => {
  router.push('/changePassword')
}

// 退出登录
const logout = async () => {
  ElMessageBox.confirm(`确定要退出系统吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      apilogout({}).then(res => {
        ElMessage({
          type: 'success',
          message: '退出成功',
        })
      })
      userStore.LOGOUT()
      setTimeout(() => {
        router.push('/login')
      }, 500)
    })
    .catch(() => { })
}
const closeUserDataDialog = () => {
  useCommon.userDataDialog = false
  useCommon.selectUser = true
}
// 在组件挂载时或事件触发时操作这个引用


function goGooglePage(){
  unref(googleDialogShowRef).open()
  // this.$refs.googleDialogShowRef.openDialog(scope.row.userName)
}
</script>

<style lang="scss">
// 覆盖tab 样式
.app-header {
  .line-top {
    border: 1px solid #C7C7C7;
    width: 1px;
    height: 40%;
    margin: 0 10px;
  }

  .header-bg,
  .el-menu {
    flex: none;
    min-width: 660px !important;
    background: #fff !important;
  }

  .el-menu-item,
  .el-sub-menu {
    width: 55px !important;
    text-align: center;
    flex: none;

    &:hover {
      color: #333 !important;
      background: #f5f5f5 !important;
    }
  }

  .top-sub-menu {
    .el-icon {
      display: none;
    }

    &.is-active {
      // background: #e8ebee !important;

      .el-sub-menu__title {
        color: #165DFF !important;
        border: none !important;
      }
    }
  }
}

.el-sub-menu__title {
  font-weight: 400;
  color: #666 !important;
}

.badge-box {
  position: relative;
  background-color: #f5f5f5;
  padding: 5px;
  height: 30px;
  line-height: 22px;
  width: auto;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
}

.el-popper.is-light {
  // margin-top: -6px;
  transform: translateY(-6px);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-sub-menu__title {
  height: auto;
}

.el-dialog__body {
  // padding: 0px !important;
}

.service {
  .h-home {
    width: 350px;
    overflow: hidden;
    height: calc(100vh - 39px);
  }

  .h-rightcon {
    width: calc(100% - 350px);
  }

  .el-dialog__body {
    padding: 0px !important;
    height: calc(100% - 36px);
  }

  .el-dialog {
    border-radius: 0 !important;
  }
}

.menu-three {
  color: #666;
}
</style>

<style scoped lang="scss">
.animate {
  animation: circle 0.5s linear infinite;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.service-enter-active,
.service-leave-active {
  transition: all 0.3s ease-in-out;
}

.service-enter-from,
.service-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>(: string)(: { notArrow: any; name: any; isRoute: any; isDialog: any }): any(: any[])(: { children: any[] })(:
{ subMenu: any; children: any[] })(: any): string: any(: { paneName: any })(: any)(: any)(: any)
