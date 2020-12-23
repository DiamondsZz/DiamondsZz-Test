import Vue from 'vue'
import { login as userLogin } from '@/api/auth'

const user = {
  namespaced: true,
  state: {
    username: '',
    token: ''
  },
  getters: {},

  mutations: {
    SET_USERNAME: (state, username) => {
      Vue.ss.set('USERNAME', username, 7 * 24 * 60 * 60 * 1000)
      state.username = username
    },
    SET_TOKEN: (state, token) => {
      Vue.ss.set('AUTHORIZATION', token, 7 * 24 * 60 * 60 * 1000)
      state.token = token
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise(async (resolve, reject) => {
        let res
        switch (userInfo.loginTilKey) {
          //  账号登录/子账号登录
          case 1:
            res = await userLogin({
              tel: userInfo.values.username,
              passWord: userInfo.values.password
            })
            break
          // 手机号登录
          case 2:
            res = await userLogin({
              tel: userInfo.values.phone,
              verifyCode: userInfo.values.verificateCode
            })
            break
        }
        if (res.status === 200) {
          commit('SET_TOKEN', res.data.token)
          commit('SET_USERNAME', res.data.tel)
          resolve(res)
        } else {
          reject(res)
        }
      })
    },
    Logout ({ commit }) {
      return new Promise(async resolve => {
        Vue.ss.remove('AUTHORIZATION')
        resolve()
      })
    }
  }
}

export default user
