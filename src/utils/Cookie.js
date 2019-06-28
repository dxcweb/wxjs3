/**
 * Created by guowei on 17/6/28.
 */
import Url from 'urijs'
export default {
    getCookie: (name)=> {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return arr[2];
        else
            return '';
    },
    setCookie: (name, value, expiredays)=> {
        var uri = new Url();
        var domain = uri.domain();
        var exdate = new Date();
        if (domain == null || domain == '') {
            domain = location.hostname;
        }
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = name + "=" + encodeURIComponent(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/" + ";domain=" + domain;
    }
};