// pages/findHouse/findHouse.js
var app = getApp();
var api = require('../../utils/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastHide: true,  //弹框隐藏
    locateCityName: '',
    locateCityId: ''
  },

  /**
   * 点击蒙层,关闭弹框
   */
  closeToastBox() {
    this.setData({
      toastHide: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      locateCityName: wx.getStorageSync('locateCityName'),
      locateCityId: wx.getStorageSync('locateCityId')
    });
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



  chooseNavBtn: function (e) {
    this.setData({
      locateCityName: wx.getStorageSync('locateCityName'),
      locateCityId: wx.getStorageSync('locateCityId')
    });
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityName')) {
        //显示切换城市弹框
        this.setData({ toastHide: false });
      } else {
        app.getLocationAgain();
      }
      return;
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.page
    })
  },

  /**
     * 同意切换到定位城市
     */
  changeCity: function () {
    this.setData({ toastHide: true });
    if (this.data.locateCityId > 0) {
      wx.setStorageSync('cityId', wx.getStorageSync('locateCityId'));
      wx.setStorageSync('cityName', wx.getStorageSync('locateCityName'));
      wx.reLaunch({
        url: "/pages/real_index/index"
      });
    } else {
      wx.reLaunch({
        url: "/pages/chooseCity/chooseCity"
      });
    }
  }
})