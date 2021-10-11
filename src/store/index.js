import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 将后端返回的token存储到state------用于用户的登录状态信息
    user:getItem(USER_KEY)// 当前登录用户的登录状态（token等数据）
    //user: JSON.parse(window.localStorage.getItem('TOUTIAO_USER'))
  },
  mutations: {
    // 将token放入本地存储-----持久化数据
    setUser(state,data){
      state.user = data
      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是为了持久化数据
      setItem(USER_KEY,state.user)
     // window.localStorage.getItem('TOUTIAO_USER',JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
  }
})
