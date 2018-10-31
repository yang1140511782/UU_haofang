var app = getApp();
var api = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	 url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = options.userId;
    var openId = options.openId;
    var vocalType = options.type;
    
    var url = 'https://uuweb.haofang.net/Mini/App/vocalHelpList?userId=' + userId + '&openId=' + openId + '&type=' + vocalType;
    // var url = 'http://lcl_uuweb.hftsoft.com/Mini/App/vocalHelpList?shareUserId=' + userId + '&openId=' + openId + '&type=' + vocalType;
    this.setData({url:url});
    //屏蔽小程序分享
    wx.hideShareMenu();
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
	  
  }
})