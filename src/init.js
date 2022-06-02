import { initState } from "./state";

export function initMixin(Vue) {
  /**
   * @description 初始化Vue
   */
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
  };
}
