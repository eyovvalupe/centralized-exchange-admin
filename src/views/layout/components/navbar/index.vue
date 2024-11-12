<template>
  <section class="app-header">
    <!-- 第一排 -->
    <header class="header-bg h-[70px] w-full flex text-sm pl-[30px]">
      <el-menu popper-class="header-menus" :default-active="activeIndex" :hide-timeout="100" :show-timeout="0"
        :collapse-transition="false" class="h-[70px] flex-1" mode="horizontal" @select="handleSelect"
        v-show="routesList.length">
        <template v-for="(item, index) in routesList" :key="index">
          <el-menu-item :hide-timeout="100" :show-timeout="0" :collapse-transition="false" :index="item.name || ''"
            v-if="!item.children || item.hiddenChild">
            {{ item.meta.title }}
          </el-menu-item>
          <el-sub-menu :hide-timeout="100" :show-timeout="0" :collapse-transition="false" :index="item.name || ''" v-else
            class="top-sub-menu">
            <template #title>
              <span class="flex items-center">{{ item.meta.title }}</span>
            </template>
            <template v-for="(_item, _index) in item.children" :key="_index">
              <template v-if="!_item.subMenu && !_item.meta.hidden">
                <p class="menu-border border-t" v-if="_item.meta.border"></p>
                <el-menu-item :hide-timeout="100" :show-timeout="0" :index="_item.name || ''"
                  :class="{ 'no-menu-auth': _item.meta.notopen || !checkAuthCode(_item.meta.auth) }"
                  v-if="_item.hidden === undefined">
                  <img :src="`/images/menus/${_item.icon}.svg`" class="w-[16px] h-[16px] mr-2" />
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
      <ul class="menu-two flex items-center">
        <li v-for="item in shortCut" :class="{'disabled':!checkAuthCode(item.auth)}" :key="item.name" class="cursor-pointer flex items-center"
          @click="onShortCut(item)">
          <span class="mr-[20px] flex items-center" :style="{ color: appStore.curTab === item.name ? '#165DFF' : '' }">
            <span class="badge-box">
              <img src="/images/menus/ServiceIcon.svg" class="mr-[6px]" v-if="item.icon == 'service'" />
              <SvgIcon :name="item.icon || item.name" size="16px" v-else class="mr-[6px]"/>
              <span>{{ item.text }}</span>
              <el-badge :value="messageNumObj[item.badge]" v-if="messageNumObj[item.badge]"></el-badge>
            </span>
          </span>
        </li>
      </ul>
      <div class="flex menu-three">
        <div class="menu-icon-btns">
          <div class="menu-icon-btn" @click="sound=!sound;changeVoice(sound)">
            <SvgIcon :name="sound ? 'voice' : 'mute'" size="16px" />
          </div>
          <div class="menu-icon-btn" @click="toggle()">
            <SvgIcon :name="isFullscreen ? 'cancelFullscreen' : 'fullscreen'" size="16px" />
          </div>
        </div>
        <!-- <div class="flex items-center pr-[20px]">
          <el-switch v-model="sound" @change="changeVoice" size="small" />
          <div class="ml-[5px]">声音</div>
        </div> -->
        <!-- <div class="flex items-center pr-[20px] cursor-pointer" @click="toggle()">
          <img src="/images/menus/FullScreen.svg" v-if="isFullscreen" />
          <img v-else src="/images/menus/FullScreen2.svg" />

          <div class="ml-[5px]">全屏</div>
        </div> -->
        <el-dropdown class="avatar-container right-menu-item hover-effect">
          <div class="flex items-center px-[16px]">
            <!-- <span class="mr-2">{{ userName }}</span> -->
            <!-- 顶部导航 用户名改成头像 -->
            <img src="/images/menus/nav-user.svg" />
            <span style="margin: 0 5px;">用户</span>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu" :size="'large'">
              <el-dropdown-item disabled>
                  <div class="username">{{ userName }}</div>
              </el-dropdown-item>
              <el-dropdown-item divided @click="goGooglePage">
                <span class="underline">
                  绑定谷歌验证码
                </span>
              </el-dropdown-item>
              <el-dropdown-item @click="showDialog('loginPassword')">
                <span class="underline">修改登录密码</span>
              </el-dropdown-item>
              <el-dropdown-item @click="showDialog('verifyPassword')">
                <span class="underline">修改交易密码</span>
              </el-dropdown-item>
               <div class="dropdown-split-line"></div>
              <el-dropdown-item divided @click="logout">
                <span class="underline text-[#999]">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <!-- 第三排 -->
    <footer class="bg-white">
      <el-tabs v-model="activeIndex" type="card" class="custom-tab" closable @tab-click="handleClickTab" @tab-remove="removeTab">
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

import SvgIcon from '/@/components/icons/Index.vue'

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
  { name: 'RechargeOrder', icon: "recharge", badge: 'deposit', text: '充值', type: 'badge',auth:'111' },
  { name: 'withdrawlOrder', icon: "withdraw", badge: 'withdraw', text: '提现', type: 'badge', notArrow: false,auth:'112' },
  { name: 'kycList', icon: "realname", badge: 'kyc', text: '实名审核', type: 'badge', notArrow: false,auth:'103' },
  { name: 'notice', icon: "service", badge: 'support', text: '客服', type: 'badge', isDialog: true, notArrow: false,auth:'601' }
])

const showService = ref(false)
// short cut click
const onShortCut = item => {
  console.log(item)
  if (checkAuthCode(item.auth)) {
    if ("shrtcut", item.isDialog) {
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
Bus.on("navbarShortCut",(item)=>{
  onShortCut(item)
})
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
      appStore.SET_TABS([...appStore.tabs])
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
  })
    .then(() => {
      apilogout({}).then(res => {
        ElMessage({
          type: 'success',
          message: '退出成功',
        })
      })
      userStore.LOGOUT()
      ServiceChat.destroy()
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
  //if(!googlebind.value){
    unref(googleDialogShowRef).open()
  //}
  // this.$refs.googleDialogShowRef.openDialog(scope.row.userName)
}
</script>

<style lang="scss">

.header-menus {
  border:0px !important;
  background: none !important;
  top:70px !important;
  .el-menu {
    width: 200px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 10px 20px;
    background: #fff;
    
    .menu-border{
      margin: 10px 0;
      border-color: #ECECEC;
    }

  }

}


// 覆盖tab 样式
.app-header {
  --el-menu-bg-color:rgba(255,255,255,0);
  .line-top {
    border: 1px solid #C7C7C7;
    width: 1px;
    height: 40%;
    margin: 0 10px;
  }

 

  .top-sub-menu {
    padding: 0 34px 0 14px;
    --el-menu-text-color:#33353D;
    
    > .el-sub-menu__title {
      padding: 0px !important;
      font-size: 16px;
      
    }

    &.is-active {
      background-color: #EFF2F8;
      .el-sub-menu__title {
        color: var(--el-color-primary);
        border: none;
        font-size: 16px;
        font-weight: 600;
      }
      svg path{
        fill:var(--el-color-primary);
      }
    }
   
  }
  .el-menu-item{
    padding: 0 24px;
    font-size: 16px;
    &.is-active {
      background-color: #EFF2F8;
      color:var(--el-color-primary);
      font-weight: 600;
      border-bottom: 0px !important;
    }
  }
  .el-sub-menu__title{
    border-bottom: 0px !important;
  }

  .el-sub-menu .el-sub-menu__icon-arrow{
    right: -20px;
    font-size: 14px;
    margin-top: -7px;
  }
}

.el-sub-menu__title {
  font-weight: 400;
  color: #000;
}

.menu-two{
  border-left: 1px solid #EFF2F8;
  padding-left: 16px;
  .disabled{
     span{
      color:#bfbfbf;
      svg path{
        fill: #bfbfbf;
      }
     }
     .el-badge .el-badge__content{
      background-color: #ccc;
     }
  }
}
.badge-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: .3s;
  color:#33353D;
  svg path{
    fill:var(--el-color-primary); 
  }
  &:hover{
    color:var(--el-color-primary);
  }
 
  .el-badge .el-badge__content{
     font-size: 11px;
     border-radius: 14px;
      border:0px;
      height: 14px;
      min-width: 14px;
      padding: 0 4px;
      box-sizing: border-box;
      line-height:14px;
      position: relative;
      top:-8px;
      padding-top:2px;
  }

  .el-menu--horizontal .el-menu .el-menu-item,
  .el-menu--horizontal .el-menu .el-sub-menu__title {
    height: auto;
  }
  .el-menu--horizontal>.el-sub-menu .el-sub-menu__title{
    border-bottom: 0px;
  }
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
    height: calc(100% - 50px);
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

.custom-tab :deep(.el-tabs__nav){
  border: 0px !important;
}
.custom-tab :deep(.el-tabs__nav-wrap){
  margin-bottom: 0px;
  height: 40px;
  background: linear-gradient(0deg, rgba(239, 242, 248, 0.00) 0%, #EFF2F8 100%);
  border-bottom: 1px solid #EFF2F8 !important;
}
.custom-tab :deep(.el-tabs__header){
  border-bottom: 0px;
}
.custom-tab :deep(.el-tabs__header .el-tabs__item){
  margin:0px !important;
  padding: 0px !important;
  box-shadow: 0 0 0 #f5f5f5 !important;
  border:0px !important;
  height: 39px !important;
  border-radius: 0px;
  font-weight: normal;
  color:#65749C;
  > span{
    padding:0 35px;
  }
  .is-icon-close{
    position: absolute;
    right:5px;
    top:5px;
    opacity: 0;
  }
  &:hover .is-icon-close{
      opacity: 1;
  }
  &:hover {
    color:var(--el-color-primary);
    background:none;
  }
  &.is-active {
    padding: 0px;
    color: var(--el-color-primary);
    background-color: #E1EAFF !important;
    .is-icon-close{
      opacity: 1;
    }
   
  }
}
.menu-icon-btns{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 11px;
  border-left: 1px solid #EFF2F8;
  border-right: 1px solid #EFF2F8;
}
.menu-icon-btn{
  width:30px;
  height: 30px;
  display: flex;
  margin: 0 5px;
  align-items: center;
  justify-content: center;
  border: 1px solid #D0D8E2;
  box-sizing: border-box;
  border-radius: 50%;
}

.username{
  text-align: center;
  color:#000 !important;
}

.user-dropdown-menu{
  width: 180px;
  box-sizing: border-box;
  padding: 10px 20px;
  
  :deep(.el-dropdown-menu__item){
    padding: 10px 0;
    line-height: 20px;
    justify-content: center;
    align-items: center;
    color:#000;
  }
  :deep(.el-dropdown-menu__item--divided){
    margin:10px 0;
  }
}
</style>
