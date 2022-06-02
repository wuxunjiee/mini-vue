(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分方法
  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto); // 数组中所有的变异方法

  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // 面向切片编程

  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      var inserted;
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case "splice":
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted);
      return (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      Object.defineProperty(data, "__ob__", {
        value: this,
        // 将__ob__变价不可枚举的属性，否则会死循环
        enumerable: false
      }); // 两个效果，一是在数组的重写方法内可以调用observeArray，二是给数据加了标识，有这个属性则说明被观测过，不需要再被观测了
      // data.__ob__ = this;

      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto; // 如果数组中放的是对象，可以监控到对象的变化

        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (value === newVal) return;
        observe(newVal);
        value = newVal;
      }
    });
  }
  function observe(data) {
    // 只对对象劫持
    if (_typeof(data) !== "object" || data === null) return; // 如果一个对象被劫持过了，就不需要再被劫持了
    // 判断一个对象是否被劫持过，添加增添一个实例，用实例来判断是否被劫持过

    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    }

    return new Observer(data);
  }

  /**
   * @description 初始化data,props,computed等状态
   */

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newVal) {
        if (vm[target][key] === newVal) return;
        vm[target][key] = newVal;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data;
    observe(data);

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, "_data", key);
      }
    }
  }

  function initMixin(Vue) {
    /**
     * @description 初始化Vue
     */
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  /**
   * @param options 用户的选项
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
