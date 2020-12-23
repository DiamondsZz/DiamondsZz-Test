import Vue from 'vue'
import Storage from 'vue-ls'

/*
 *  同时使用 loal 和 session
 * */

const SessionStorage = {
  install (Vue, options = {}) {
    const _options = Object.assign({}, options, {
      storage: options.storage || 'session',
      name: options.name || 'ss'
    })

    Storage.install(Vue, _options)
  }
}

Vue.use(Storage, { namespace: 'ECO_ASSOCIATION_' })
Vue.use(SessionStorage, { namespace: 'ECO_ASSOCIATION_' })
