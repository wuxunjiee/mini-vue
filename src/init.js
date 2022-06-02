import { initState } from "./state";
import { compileToFunction } from "./compiler";

export function initMixin(Vue) {
  /**
   * @description 初始化Vue
   */
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
    if (options.el) {
      vm.$mount(options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const el = document.querySelector(el);
    const opts = vm.$options;
    if (!opts.render) {
      let template;
      if (el) {
        if (!opts.template) {
          template = el.outerHTML;
        } else {
          template = opts.template;
        }
        if (template) {
          const render = compileToFunction(template);
          opts.render = render;
        }
      }
    }
  };
}
