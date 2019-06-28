/**
 * Created by guowei on 17/4/24.
 */
const userAgent = navigator.userAgent.toLowerCase();
let browser = {};
let uaMatch;
if (uaMatch = userAgent.match(/micromessenger\/([\S]+)/)) {
    browser['name'] = 'wechat';
    browser['version'] = uaMatch[1];
} else if (uaMatch = userAgent.match(/qq\/([\S]+)/i)) {
    browser['name'] = 'qq';
    browser['version'] = uaMatch[1];
}
export default browser;