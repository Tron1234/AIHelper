if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const recording = "/static/recording.svg";
  const record = "/static/record.svg";
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const recorded = vue.ref(false);
      const pic = vue.computed(() => recorded.value ? recording : record);
      let deviceId;
      const recorderManager = uni.getRecorderManager();
      const innerAudioContext = uni.createInnerAudioContext();
      onLoad(() => {
        deviceId = uni.getDeviceInfo().deviceId;
        recorderManager.onStop(function(res) {
          uni.showLoading({});
          uni.uploadFile({
            url: "http://81.71.149.135:3000/upload/audio",
            filePath: res.tempFilePath,
            formData: {
              deviceId
            },
            success: function(data) {
              formatAppLog("log", "at pages/index/index.vue:42", data);
              uni.hideLoading();
              innerAudioContext.src = data;
              innerAudioContext.play();
            }
          });
        });
      });
      function changeRecord(status) {
        recorded.value = status;
        if (status) {
          innerAudioContext.stop();
          innerAudioContext.onStop(() => {
            recorderManager.start({
              duration: 3e4
            });
          });
        } else {
          recorderManager.stop();
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("image", {
          class: "record-icon",
          src: vue.unref(pic),
          mode: "widthFix",
          onTouchstart: _cache[0] || (_cache[0] = ($event) => changeRecord(true)),
          onTouchend: _cache[1] || (_cache[1] = ($event) => changeRecord(false))
        }, null, 40, ["src"]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "/Users/brucewang/Work/AIHelper/AIHelper/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/brucewang/Work/AIHelper/AIHelper/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
