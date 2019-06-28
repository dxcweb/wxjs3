/**
 * Created by guowei on 17/4/24.
 */
import browser from '../utils/browser'
import Url from 'urijs'
function _initWX(obj) {
    //obj.link
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: obj.titleTimeline,
        link: obj.link,
        imgUrl: obj.imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            obj.onSuccess.apply(this, ['onMenuShareTimeline','分享到朋友圈']);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            obj.onCancel.apply(this, ['onMenuShareTimeline','分享到朋友圈']);
        }
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: obj.title,
        desc: obj.desc,
        link: obj.link,
        imgUrl: obj.imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            obj.onSuccess.apply(this, ['onMenuShareAppMessage','分享给朋友']);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            obj.onCancel.apply(this, ['onMenuShareAppMessage','分享给朋友']);
        }
    });

    //获取“分享到QQ”按钮点击状态及自定义分享内容接口
    wx.onMenuShareQQ({
        title: obj.title,
        desc: obj.desc,
        link: obj.link,
        imgUrl: obj.imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            obj.onSuccess.apply(this, ['onMenuShareQQ','分享到QQ']);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            obj.onCancel.apply(this, ['onMenuShareQQ','分享到QQ']);
        }
    });
    wx.onMenuShareQZone({
        title: obj.title,
        desc: obj.desc,
        link: obj.link,
        imgUrl: obj.imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            obj.onSuccess.apply(this, ['onMenuShareQQ','分享到QQ空间']);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            obj.onCancel.apply(this, ['onMenuShareQQ','分享到QQ空间']);
        }
    });
    //分享到腾讯微博
    wx.onMenuShareWeibo({
        title: obj.title,
        desc: obj.desc,
        link: obj.link,
        imgUrl: obj.imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            obj.onSuccess.apply(this, ['onMenuShareQQ','分享到腾讯微博']);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            obj.onCancel.apply(this, ['onMenuShareQQ','分享到腾讯微博']);
        }
    });
}
function _initQQ(obj) {
    mqq.invoke("data", "setShareInfo", {
        share_url: obj.link,
        title: obj.title,
        desc: obj.desc,
        image_url: obj.imgUrl,
        callback: function(ret){
        }
    });
}
export default(obj)=> {
    const defaultObj = {
        link: location.href,
        share_url: '',
        title: '',
        desc: '',
        imgUrl: '',
        onSuccess:()=>{},
        onCancel:()=>{}
    };
    const newObj = {...defaultObj, ...obj};
    if (newObj.titleTimeline == null || newObj.titleTimeline == '') {
        newObj.titleTimeline = newObj.title
    }
    newObj.link = Url(newObj.link).addQuery('isappinstalled', 0).toString();
    
    if (browser.name == 'wechat') {
        _initWX(newObj);
    } else if (browser.name == 'qq') {
        _initQQ(newObj);
    }
}