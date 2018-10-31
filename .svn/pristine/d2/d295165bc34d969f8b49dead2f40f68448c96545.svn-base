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
    var proxyId = options.proxyId ;
    var mobile = options.mobile ;
    var cityId = options.cityId;
    var caseType = options.caseType;
    var caseId = options.caseId;
    var compId = options.compId;
    var url = app.buildRequestUrl('standingOrderUrl')+'?proxyId=' + proxyId + '&mobile=' + mobile + '&cityId=' + cityId + '&caseType=' + caseType + '&caseId=' + caseId + '&compId=' + compId;
    //var url = 'http://lcl_uuweb.hftsoft.com/Mini/Html/standingOrder?proxyId=' + proxyId + '&mobile=' + mobile + '&cityId=' + cityId + '&caseType=' + caseType + '&caseId=' + caseId + '&compId=' + compId;
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