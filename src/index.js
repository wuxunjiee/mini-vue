import { initMixin } from "./init";

/**
 * @param options 用户的选项
 */
function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
