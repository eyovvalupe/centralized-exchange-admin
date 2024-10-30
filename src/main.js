import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerStore } from '/@/store'
// import { useSvgIcon } from './assets/icons'
import ElementPlus from 'element-plus'
import './permission'

// tailwindcss 按需引入
import 'tailwindcss/tailwind.css'
import 'element-plus/dist/index.css'

//svg icon
import 'virtual:svg-icons-register'

// 导入公共样式
// import './assets/styles/index.scss'

// 自定义指令
import registerDirective from '/@/directive'
// 注册所有element icons
import { setupElementIcons } from '/@/plugins/elementIcons'
// import { useTable } from '/@/plugins/vxeTable'
// 注册所有的自定义组件
import GlobalComponent from '/@/components/index.js'
import mitt from 'mitt'

const app = createApp( App )
app.config.globalProperties.$mitt = mitt()

for ( const componentItem in GlobalComponent ) {
  app.component( componentItem, GlobalComponent[componentItem] )
}

const initApp = async() => {
  app.use( router )
  // useSvgIcon( app )
  registerStore( app )
  registerDirective( app )
  await router.isReady()

  setupElementIcons( app )

  // app.use( globalEmitter )
  app.use( ElementPlus )
  // app.use( useTable )
  app.mount( '#app' )
}

initApp()
