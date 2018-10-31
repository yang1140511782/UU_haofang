var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushLogId: '',
    recomInfoId: '',
    caseId: '',
    caseType: '',
    cityId: '',
    money: '',
    userId: '',
    shareMoney: '', //专属优惠券金额
    shareId: '',  //专属优惠券Id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var pushLogId = options.pushLogId;
    this.setData({ pushLogId: pushLogId, recomInfoId: options.recomInfoId, caseId: options.caseId, caseType: options.caseType, cityId: options.cityId, money: options.money, userId: options.userId });
    wx.request({
      url: app.buildRequestUrl('brokeragePay4Deal'),
      data: {
        pushLogId: options.pushLogId,
        recomInfoId: options.recomInfoId,
      },
      success: function (res) {
        var info = res.data.DATA;
        var status = res.data.STATUS;
        if (status == 1) {
          console.log(info);
          that.dealData(info, 'houseMoney');
          that.dealData(info, 'priceUnit');
          that.dealData(info, 'brokerMoney');
          that.dealData(info, 'rewardMoney');
          that.dealData(info, 'onlinePayMoney');
          that.dealData(info, 'offlinePayMoney');
          that.dealData(info, 'redMoney');
          that.dealData(info, 'subsidyMoney');
          that.dealData(info, 'prizeRedMoney');
          that.dealData(info, 'brokerBuTieMoney');
          that.dealData(info, 'brokerBuTieMoneyDesc');
          that.dealData(info, 'supplementaryMoney');
          that.dealData(info, 'shareMoney');
          that.dealData(info, 'shareId');
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
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
  onUnload: function (options) {

  },
  dealData: function (info, item, setValue) {
    var v = info[item];
    if (setValue !== undefined) {
      var json = {};
      json[item] = setValue;
      this.setData(json);
    } else if (v !== undefined) {
      var json = {};
      json[item] = v;
      this.setData(json);
    }
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
  weikuanPrePay: function (e) {
    var that = this;
    wx.request({
      url: app.buildRequestUrl('weiKuanPrePay'),
      data: {
        openId: app.globalData.openId,
        money: e.currentTarget.dataset.money,
        caseId: that.data.caseId,
        caseType: that.data.caseType,
        cityId: that.data.cityId,
        userId: that.data.userId,
        logId: that.data.pushLogId,
        recomHouseId: that.data.recomInfoId,
      },
      success: function (res) {
        console.log('初始化支付');
        console.log(res);
        var data = res.data.DATA;
        var status = res.data.STATUS;
        if (status == 1) {
          if (e.currentTarget.dataset.money == 0){
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.requestPayment({
              'appId': data.appId,
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res) {
                console.log('支付成功回调');
                wx.navigateBack({
                  delta: 1
                })
              },
              'fail': function (res) {
                console.log('支付失败');
              }
            })
          }
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function () {
        console.log('初始化支付失败');
      }
    })
  }
})