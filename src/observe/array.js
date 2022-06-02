// 重写数组中的部分方法

let oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto);

// 数组中所有的变异方法
const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

// 面向切片编程
methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    let inserted;
    const ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted);
    return oldArrayProto[method].call(this, ...args);
  };
});
