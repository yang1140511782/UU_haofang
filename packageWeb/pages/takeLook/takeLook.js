// pages/vr/vr.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var lookOrderUuid = options.lookOrderUuid || options.scene;
    var url = app.buildRequestUrl('takeLookInfoUrl')+'?isMiniProgram=1&lookOrderUuid='+lookOrderUuid;
    // var url = 'http://ygyuuweb.hftsoft.com/Mini/Html/takeLookInfo?isMiniProgram=1&lookOrderUuid='+lookOrderUuid;
    this.setData({
       url: url,
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

})