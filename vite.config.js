
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// import { composePlugins } from './config/plugins'

function resolve (dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, process.cwd())
  const { VITE_PORT, VITE_LEGACY } = env
  return {
    root,
    base: '/', //
    resolve: {
      alias: {
        '/@': resolve('src')
      },
      extensions: ['.js', '.json', '.ts', '.vue']
    },

    // plugins : composePlugins( command, VITE_LEGACY ),
    plugins: [
      vue(),
      // eslintPlugin( {
      //   include : ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      // } ),
      
      Components({
        resolvers: [VantResolver()]
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        eslintrc: {
          enabled: false, //
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        },
        imports: ['vue', 'vue-router', '@vueuse/core'],
        dts: './auto-import.d.ts'
      })
    ],

    server: {
      port: VITE_PORT || 9527,
      proxy : {
        // '/api': {
        //   target : "http://146.70.86.141:8001",
        //   changeOrigin : true,
        //   rewrite : ( path ) => path.replace( /^\/api/, '' )
        // },
        // '/ws': {
        //   target : "ws://62.112.10.184:8303",
        //   changeOrigin : true,
        //   rewrite : ( path ) => path.replace( /^\/ws/, '' )
        // }
      }
    },

    define: {
      // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#quasar-cli
      // 消除 vue-i18n 警告
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify({
        version: '3.0.0'
      })
    },

    build: {
      outDir: './dist/admin/',
      sourcemap: false,
      brotliSize: false,
      chunkSizeWarningLimit: 2500,

      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },

      rollupOptions: {
        output: {
          manualChunks (id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/')
              : []
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `js/${fileName}/[name].[hash].js`
          }
        }
      }
    }
  }
})
