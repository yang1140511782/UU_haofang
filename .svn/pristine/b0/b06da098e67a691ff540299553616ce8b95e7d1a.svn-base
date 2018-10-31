var app = getApp();
let common = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipCaseId: 28632,
    caseType: 2,
    cityId:1,
    youyouUserId: 176991,
    trackInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    wx.request({
      url: app.buildRequestUrl('entrustTrack'), 
      data: {
        'vipCaseId': options.vipCaseId,
        'caseType': options.caseType,
        'cityId': options.cityId,
        'youyouUserId': options.youyouUserId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
         wx.hideLoading();
        if (res.statusCode == 200){
          _this.setData({
            trackInfo: res.data
          })

          console.log(_this.data.trackInfo);
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
  customerSercive: function(e){
    let to = app.globalData.imService;
    let from = 'uu_' + app.globalData.userId;

    if (getCurrentPages().length < 5) {
      wx.navigateTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    } else {
      wx.redirectTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    }
  }
})