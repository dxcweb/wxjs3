import browser from "./browser";
import requireJs from "./requireJs";
import { API_PANO_DOMAIN } from "../../constants";

import JsonP from "../utils/JsonP";

const jsApiList = [
  "updateTimelineShareData",
  "updateAppMessageShareData",
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "onMenuShareQQ",
  "onMenuShareWeibo",
  "onMenuShareQZone",
  "startRecord",
  "stopRecord",
  "onVoiceRecordEnd",
  "playVoice",
  "pauseVoice",
  "stopVoice",
  "onVoicePlayEnd",
  "uploadVoice",
  "downloadVoice",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "downloadImage",
  "translateVoice",
  "getNetworkType",
  "openLocation",
  "getLocation",
  "hideOptionMenu",
  "showOptionMenu",
  "hideMenuItems",
  "showMenuItems",
  "hideAllNonBaseMenuItem",
  "showAllNonBaseMenuItem",
  "closeWindow",
  "scanQRCode",
  "chooseWXPay",
  "openProductSpecificView",
  "addCard",
  "chooseCard",
  "openCard",
  "getLocalImgData",
];
let isRequireJs = false;

function initQQ() {
  return new Promise((resolve) => {
    if (isRequireJs) {
      resolve();
    } else {
      isRequireJs = true;
      requireJs("//open.mobile.qq.com/sdk/qqapi.js?_bid=152");
      const interval = setInterval(() => {
        if (!window.mqq) {
          return;
        }
        clearInterval(interval);
        resolve();
      }, 50);
    }
  });
}

const jsonp = (app_id) => {
  return new Promise((resolve) => {
    // const openUrl = location.origin + location.pathname + location.search;
    const url = "https://wop2.tuobacco.com/";
    const fullUrl = url + "wx-base/sign?" + "app_id=" + app_id + "&url=" + encodeURIComponent(Base64.encode(openUrl));
    JsonP(fullUrl, "WopSign" + Math.floor(Math.random() * 10000));
    const timed = setTimeout(function() {
      alert("签名超时！");
    }, 10000);
    window.WopSign = function(res) {
      clearTimeout(timed);
      window.WopSign = null;
      resolve(JSON.parse(response));
    };
  });
};

async function getWxConfig() {
  if (!isRequireJs && !window.wx) {
    isRequireJs = true;
    requireJs("//res.wx.qq.com/open/js/jweixin-1.4.0.js");
  }
  await jsonp();
  return new Promise((resolve, reject) => {
    const url = location.origin + location.pathname + location.search;
    axios
      .get(`${API_PANO_DOMAIN}/wx-config?url=${encodeURIComponent(url)}`)
      .then(({ success, data }) => {
        if (success) {
          data.debug = window.debug;
          data.jsApiList = jsApiList;
          const interval = setInterval(() => {
            if (!window.wx) {
              return;
            }
            clearInterval(interval);
            resolve(data);
          }, 50);
        } else {
          reject("微信签名接口错误");
        }
      })
      .catch(() => {
        reject("微信签名接口错误");
      });
  });
}
function wxConfig(data) {
  window.wx.config(data);
  return new Promise((resolve, reject) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= 1) {
        clearInterval(interval);
        reject("微信签名配置错误");
      }
      i++;
      window.wx.config(data);
    }, 10000);
    window.wx.ready(() => {
      clearInterval(interval);
      resolve();
    });
  });
}
async function sign() {
  if (browser.name == "wechat") {
    const data = await getWxConfig();
    await wxConfig(data);
    return true;
  } else if (browser["name"] == "qq") {
    await initQQ();
    return true;
  }
  return false;
}
export default sign;
