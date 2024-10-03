import { defineStore } from 'pinia'
import { getAllAuth } from '/@/api/modules/base.api.js'
// import useTagsViewStore from './tagsView'
const allAuths=[];
const useUserStore = defineStore({
  persist: true,
  id: 'users',
  state: () => {
    return {
      token: localStorage.getItem('token') || '',
      auth_arr: [],
      userName: '',
      timestamp: null,
      userInfo: {
        userName: ''
      }
    }
  },
  getters: {
  },
  actions: {
    getAuthMatch() {
      return new Promise(r => {
        getAllAuth({ codes: '' }).then(res => {
          const tmp = []
          for (const key in res) {
            if (res[key]==0) {
              tmp.push(Number(key))
            }
          }
          this.auth_arr = tmp;
          r(tmp);
        })
      })
    },
    SET_TOKEN(token = '') {
      this.token = token;
      localStorage.setItem('token', token)
    },
    SET_USERNAME(username = '') {
      this.userName = username
    },
    SET_USERINFO(userInfo) {
      this.userInfo = userInfo
    },
    SET_TIMESTAMP(timestamp) {
      this.timestamp = timestamp
    },
    LOGOUT() {
      this.token = ''
      this.userInfo = {}
    }
    // async GET_USER_INFO() {
    //   try {
    //     const getInfo = {
    //       code : 200,
    //       message : 'success',
    //       data : {
    //         id : 9527,
    //         avatar : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    //         name : '',
    //         phone : '',
    //         email : '',
    //         identity : '',
    //         roles : ['admin']
    //       }
    //     }
    //     const { code, data } = getInfo
    //     // const { code, data } = await getInfo()
    //     if ( code == 200 ) {
    //       const { id, name, avatar, roles, phone, email, identity } = data
    //       this.uid = id || '9528'
    //       this.name = name || ''
    //       this.phone = phone || ''
    //       this.email = email || ''
    //       this.identity = identity || ''
    //       this.avatar = avatar || AVATAR
    //       this.roles = roles || ['editor']
    //       return {
    //         ...data,
    //         uid : this.uid,
    //         roles : this.roles
    //       }
    //     }
    //   } catch ( error ) {
    //     return error
    //   }
    // },
    // async LOGIN_OUT() {
    //   try {
    //     const code = 200
    //     // const { code } = await logout( this.token )
    //     if ( code == 200 ) {
    //       this.token = ''
    //       this.name = ''
    //       this.avatar = ''
    //       this.phone = ''
    //       this.email = ''
    //       this.identity = ''
    //       this.roles = []

    //       this.userInfo = {
    //         avatar : '',
    //         uid : '',
    //         token : '',
    //         userName : ''
    //       }
    //       localStorageHandle.removeItem( 'userInfo' )
    //       this.RESET_INFO()
    //     }
    //   } catch ( error ) {
    //     return error
    //   }
    // },
    // 清空所有登录信息
    // RESET_INFO() {
    //   return new Promise( resolve => {
    //     const tagsViewStore = useTagsViewStore()
    //     cookies.clearAll()
    //     window.sessionStorage.removeItem( TOKEN )
    //     resetRouter()
    //     tagsViewStore.DEL_ALL_VIEWS( null )
    //     resolve()
    //   } )
    // }
  }
})
export default useUserStore
