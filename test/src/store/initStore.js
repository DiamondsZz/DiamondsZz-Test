import Vue from 'vue'
import store from './index'
export default function initStore () {
  store.commit('user/SET_TOKEN', Vue.ss.get('AUTHORIZATION'))
  store.commit('user/SET_USERNAME', Vue.ss.get('USERNAME'))
}
