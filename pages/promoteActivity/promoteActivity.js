var app = getApp();
// pages/promoteActivity/promoteActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = options.userId;
    if(!userId){userId = wx.getStorageSync('userId');}
    var url = 'https://uuweb.haofang.net/Mini/Active/promoteActivityIndex?userId='+userId;
    // var url = 'http://lcl_uuweb.hftsoft.com/Mini/Active/promoteActivityIndex?userId='+userId;
    this.setData({url:url});
    

    //进入页面统计
    wx.request({
    		  url: app.buildRequestUrl('addShare'),
    		  data: {type:1,userId:userId}
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
  onShareAppMessage: function (res) {
    var shareOpenId = app.globalData.openId;
    var shareUserId = app.globalData.userId;
    if(!shareOpenId){
      shareOpenId = wx.getStorageSync('openId');
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我在参加租房节免费拿大礼，快来帮我助力一把吧！',
      imageUrl: 'http://uuweb.haofang.net/Public/wxApp/images/promoteActivity/promoteActiveSharePic.png',
      // imageUrl: 'http://lcl_uuweb.hftsoft.com/Public/wxApp/images/promoteActivity/promoteActiveSharePic.png',
      path: '/pages/real_index/index?shareOpenId='+shareOpenId+'&shareUserId='+shareUserId,
      success: function(res) {
        // 转发成功
        //进入页面统计
        var userId = app.globalData.userId;
         if(!userId){userId = wx.getStorageSync('userId');}
        wx.request({
    		  url: app.buildRequestUrl('addShare'),
    		  data: {type:2,userId:userId}
        });
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})