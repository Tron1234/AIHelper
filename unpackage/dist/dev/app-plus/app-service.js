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
  const _imports_0 = "/static/recording.svg";
  const _imports_1 = "/static/record.svg";
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
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const recorded = vue.ref(false);
      const recorderManager = uni.getRecorderManager();
      const innerAudioContext = uni.createInnerAudioContext();
      onLoad(() => {
        const {
          deviceId,
          deviceBrand,
          deviceModel,
          system
        } = uni.getDeviceInfo();
        recorderManager.onStop(function(res) {
          uni.showLoading({});
          uni.uploadFile({
            url: "http://81.71.149.135:3000/upload/audio",
            filePath: res.tempFilePath,
            name: "audio",
            formData: {
              deviceId,
              deviceBrand,
              deviceModel,
              system
            },
            success: function(data) {
              uni.hideLoading();
              innerAudioContext.src = JSON.parse(data.data).data;
              innerAudioContext.play();
            },
            fail: function() {
              uni.hideLoading();
            }
          });
        });
      });
      function changeRecord(status) {
        recorded.value = status;
        if (status) {
          recorderManager.start({
            duration: 3e4
          });
        } else {
          recorderManager.stop();
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", {
          class: "record-icon",
          onTouchstart: _cache[0] || (_cache[0] = ($event) => changeRecord(true)),
          onTouchend: _cache[1] || (_cache[1] = ($event) => changeRecord(false))
        }, [
          vue.withDirectives(vue.createElementVNode("image", {
            src: _imports_0,
            mode: "widthFix"
          }, null, 512), [
            [vue.vShow, recorded.value]
          ]),
          vue.withDirectives(vue.createElementVNode("image", {
            src: _imports_1,
            mode: "widthFix"
          }, null, 512), [
            [vue.vShow, !recorded.value]
          ])
        ], 32);
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
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "D:/\u8BFE\u4EF6/Vue\u5B66\u4E60/AIHelper/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      const {
        deviceId,
        deviceBrand,
        deviceModel,
        system
      } = uni.getDeviceInfo();
      uni.request({
        url: "http://81.71.149.135:3000/device/addDevice",
        method: "POST",
        data: {
          deviceId,
          deviceBrand,
          deviceModel,
          system
        },
        success: function(res) {
          formatAppLog("log", "at App.vue:21", res);
        },
        fail: function(error) {
          formatAppLog("log", "at App.vue:24", error);
        }
      });
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:29", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:32", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/\u8BFE\u4EF6/Vue\u5B66\u4E60/AIHelper/App.vue"]]);
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
