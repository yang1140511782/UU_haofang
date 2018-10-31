Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    showFlas: true,
    offFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
     *tab导航点击 
     */
  tabBtnCheck(e) {
    var that = this;
    var _t = e.currentTarget.dataset.shows;
    if (_t == 's') {
      that.setData({
        showFlas: false,
        offFlag: true,
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
      })
      this.animation = animation

      animation.translateX(-195).step();

      this.setData({
        animationData: animation.export()
      })
    } else {
      that.setData({
        showFlas: true,
        offFlag: false,
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
      })
      this.animation = animation

      animation.translateX(0).step();

      this.setData({
        animationData: animation.export()
      })
    }

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
    
  }
})