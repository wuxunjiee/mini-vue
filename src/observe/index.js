import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    Object.defineProperty(data, "__ob__", {
      value: this,
      // 将__ob__变价不可枚举的属性，否则会死循环
      enumerable: false,
    });
    // 两个效果，一是在数组的重写方法内可以调用observeArray，二是给数据加了标识，有这个属性则说明被观测过，不需要再被观测了
    // data.__ob__ = this;
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto;
      // 如果数组中放的是对象，可以监控到对象的变化
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
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
      observe(newVal);
      value = newVal;
    },
  });
}

export function observe(data) {
  // 只对对象劫持
  if (typeof data !== "object" || data === null) return;
  // 如果一个对象被劫持过了，就不需要再被劫持了
  // 判断一个对象是否被劫持过，添加增添一个实例，用实例来判断是否被劫持过
  if (data.__ob__ instanceof Observer) {
    return data.__ob__;
  }
  return new Observer(data);
}
