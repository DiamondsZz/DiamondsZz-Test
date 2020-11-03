let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      }
    });
  }
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    // observable
    this.data = _Vue.observable({
      current: "/"
    });
    this.init();
  }
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }
  createRouteMap() {
    //遍历所有的路由规则 把路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach(route => {
      this.routeMap[`${route.path}`] = route.component;
    });
  }
  initComponent(Vue) {
    Vue.component("router-link", {
      props: {
        to: String
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: `#${this.to}`
            },
            on: {
              click: this.clickhander
            }
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickhander(e) {
          window.location.hash = `#${this.to}`;
          this.$router.data.current = `${this.to}`;
          e.preventDefault();
        }
      }
      // template:"<a :href='to'><slot></slot><>"
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        const cm = self.routeMap[self.data.current];
        return h(cm);
      }
    });
  }
  initEvent() {
    //初始加载时
    window.addEventListener("DOMContentLoaded", () => {
      window.location.hash = `#/`;
    });
    //监听hash路由改变时触发
    window.addEventListener("hashchange", () => {
      this.data.current = window.location.hash.substring(1);
    });
  }
}
