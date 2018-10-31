const app = getApp();
import drawQrcode from '../../utils/weapp.qrcode.esm.js';
var common = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg:"http://pic.myfun7.com/oss/online/adminFunArchive/2018/01/10/b01aab16cbf943458910936221505972.GIF?x-oss-process=image/resize,m_fill,h_80,w_80",
    couponInfo:{},
    couponId: 0,
    shareArchiveId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if(wx.getStorageSync('userId')){
      app.globalData.userId = wx.getStorageSync('userId');
    }
    _this.initCouponParams(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 生成优惠券兑换二维码
   */
  drawQrcode: function (url) {
    console.log(url);
    drawQrcode({
      width: 115,
      height: 115,
      canvasId: 'myQrcode',
      text: url,
      typeNumber: 4
    })
  },
  /**
  * 以下方法用于优惠券活动
  * lb 2018年8月30日17:29:14
  */
  initCouponParams: function (options) {
    if (typeof (options.couponId) !== 'undefined' && typeof (options.shareArchiveId) !== 'undefined') {
      this.setData({
        couponId: options.couponId,
        shareArchiveId: options.shareArchiveId
      })
      this.initRequestCoupon(options);
    } else {
      console.log('没有优惠券相关参数');
    }
  },
  /**
 * 实例化优惠券的数据
 */
  initRequestCoupon: function (params) {
    var _this = this;
    var couponId = params.couponId;
    var shareArchiveId = params.shareArchiveId;
    var receiveId = params.receiveId;

    wx.request({
      url: app.buildRequestUrl('getCouponReceiveInfo'),
      // url: 'http://lbuuweb.hftsoft.com/Mini/Active/getCouponReceiveInfo',
      data: {
        shareArchiveId: shareArchiveId,
        receiveId:receiveId,
        couponId:couponId,
        youyouUserId: app.globalData.userId
      },
      success: function (res) {
        if (res.data.STATUS == 1) {
          var couponInfo = res.data.DATA;
          couponInfo.validTime = couponInfo.validTime.replace(/-/g, '.');
          _this.setData({
            couponInfo: couponInfo
          })

          _this.drawQrcode(couponInfo.voucherUrl);
        }
      }
    })
  },
  /**
   * 默认头像
   */
  defaultImg: function (ev) {
    console.log(ev);
    //需要访问当前页面的数据对象传递到其它页面上
    var _that = this;
    common.errImgFun(ev, _that, 'avatar');
  },
  /**
   * im聊天
   */
  sendMsg:function(e){
    var url = '/pages/im/im?shareArchiveId=' + this.data.shareArchiveId + '&couponId=' + this.data.couponId;

    wx.navigateTo({
      url: url,
    })
  }
})