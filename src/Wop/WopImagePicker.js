/**
 * Created by guowei on 2017/7/26.
 */
import React, {Component, PropTypes} from 'react';
import {WxFlowLayoutImagePicker} from 'react-imagepicker'
import {Loading} from 'fs-loading'
import WopUploadImgToOss from './WopUploadImgToOss'

export default class WopImagePicker extends Component {
    state = {
        update_loading: false
    };

    componentWillMount() {
        if (!wx) wx = {};
        if (!wx.chooseImage) {
            wx.chooseImage = ({success}) => {
                success({localIds: ['11']});
            };
        }
        if (!wx.uploadImage) {
            wx.uploadImage = ({success}) => {
                if (window.serverId) {
                    success({serverId: window.serverId});
                } else {
                    console.log('window下没有定义serverId');
                }
            };
        }
        if (!wx.previewImage) {
            wx.previewImage = (res) => {
                console.log(res);
            };
        }
    }

    getImageUrl(value) {
        return location.protocol + value.url + "?x-oss-process=image/quality,q_99/format,jpg";
    }

    uploadImage(serverId, localId, callback) {
        WopUploadImgToOss(wop_url, wop_app_id, serverId).then(function (res) {
            if (res.result) {
                callback(res.data);
            } else {
                alert(res.msg);
                callback(false);
            }
        }).catch(function (ex) {
            alert("上传错误,请重试！");
            callback(false);
        });
    }

    onLoading(update_loading) {
        this.setState({update_loading})
    }

    render() {
        const {update_loading} = this.state;
        const defaultProps = {
            getImageUrl: this.getImageUrl.bind(this),
            uploadImage: this.uploadImage.bind(this),
            onLoading: this.onLoading.bind(this),
        };
        const newProps = {...defaultProps, ...this.props};
        return <div>
            <Loading isShow={update_loading}/>
            <WxFlowLayoutImagePicker {...newProps}/>
        </div>
    }
}