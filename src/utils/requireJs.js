/**
 * Created by guowei on 17/4/24.
 */
export default (url, onload) => {
    var doc = document;
    var head = doc.head || (doc.getElementsByTagName("head")[0] || doc.documentElement);
    var node = doc.createElement("script");
    node.onload = onload;
    node.onerror = function () {
    };
    node.async = true;
    node.src = url;
    head.appendChild(node);
}