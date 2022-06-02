import { observe } from "./observe";

/**
 *
 * @description 初始化data,props,computed等状态
 */
export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newVal) {
      if (vm[target][key] === newVal) return;
      vm[target][key] = newVal;
    },
  });
}

function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;
  observe(data);
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm, "_data", key);
    }
  }
}
