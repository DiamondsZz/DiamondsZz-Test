Vue.prototype.$mount = function (el?: string | Element,hydrating?: boolean): Component {

  //先对el进行处理
  el = el && query(el);
 //如果el是body或html时，在开发环境会有警告
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }
 //获取options选项
  const options = this.$options;
 //如果没有传render函数
  if (!options.render) {
    //获取模板字符串
    let template = options.template;
    //对模板字符串进行处理
    if (template) {

      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } 
    //没有模板时，获取el的outerHtml作为模板
    else if (el) {
      template = getOuterHTML(el);
    }

    //将模板生成渲染函数
    if (template) {}
  }

  //进行挂载
  return mount.call(this, el, hydrating);
};
