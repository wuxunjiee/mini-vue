class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

export function defineReactive(target, key, value) {
  observe(value);
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (value === newVal) return;
      value = newVal;
    },
  });
}

export function observe(data) {
  // 只对对象劫持
  if (typeof data !== "object" || data === null) return;
  // 如果一个对象被劫持过了，就不需要再被劫持了
  // 判断一个对象是否被劫持过，添加增添一个实例，用实例来判断是否被劫持过
  return new Observer(data);
}
