import React from "react";
import userinfo from "./userinfo";
import JsonP from "../utils/JsonP";
import Base64 from "../utils/Base64";

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    const user = userinfo.get();
    this.state = {
      isLogin: user.isLogin,
      manualLogin: false,
      manualLoginUrl: true,
    };
  }
  componentWillMount() {
    const { url, localKey } = this.props;
    if (!url || !localKey) {
      return false;
    }
    if (!this.state.isLogin) {
      this.login();
    }
  }
  jsonp() {
    return new Promise((resolve, reject) => {
      const { url, localKey } = this.props;
      const fullUrl =
        url + "login" + "?url=" + encodeURIComponent(Base64.encode(location.href)) + "&token=" + window.localStorage.getItem(localKey);
      JsonP(fullUrl, "QyWxUserInfo" + Math.floor(Math.random() * 10000));
      const timed = setTimeout(function() {
        alert("登录超时！");
      }, 10000);
      window.QyWxUserInfo = function(res) {
        clearTimeout(timed);
        window.QyWxUserInfo = null;
        resolve(res);
      };
    });
  }
  login = async () => {
    const response = await jsonp();
    const res = JSON.parse(response);
    if (!res) {
      this.setState({ error: true, msg: "服务器繁忙请稍后再试" });
      return false;
    }
    const { ok, msg, url, token, user } = res;
    if (!ok) {
      this.setState({ error: true, msg });
      return false;
    }
    if (url) {
      const { localKey } = this.props;
      window.localStorage.setItem(localKey, token);
      userinfo.set({ token });
      this.redirect(url);
      return;
    }

    this.setState({ isLogin: true });
    userinfo.set({ ...user, isLogin: true });
  };
  redirect(url) {
    const wx_login = document.createElement("a");
    wx_login.href = url;
    if (typeof wx_login.click == "undefined") {
      window.location.href = url;
    } else {
      wx_login.click();
    }
    this.setTimeout = setTimeout(() => {
      this.setState({ manualLogin: true, manualLoginUrl: url });
    }, 10000);
  }
  render() {
    const { isLogin, manualLoginUrl, manualLogin, error, msg } = this.state;
    if (error) {
      return <div style={{ textAlign: "center", margin: "50px 15px", fontSize: 16 }}>{msg}</div>;
    }

    if (manualLogin) {
      return (
        <div style={{ textAlign: "center", margin: "50px 15px", fontSize: 16 }}>
          <a href={manualLoginUrl}>点击手动登录</a>
        </div>
      );
    }
    const { url, localKey, children } = this.props;
    if (!url || !localKey) {
      return <div style={{ textAlign: "center", margin: "50px 15px", fontSize: "0.32rem" }}>请设置url和localKey</div>;
    }
    if (!isLogin) {
      return <div />;
    }
    return children;
  }
}
