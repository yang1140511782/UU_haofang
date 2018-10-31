// pages/houseRegisterIndex/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastHide: true,  //弹框隐藏
    bindMobile: '',
    trustList: "/pages/trustList/trustList",
    rentRegistration: "/pages/registration/registration?caseType=2",
    saleRegistration: "/pages/registration/registration?caseType=1",
    locateCityId: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ 
      userMobile: wx.getStorageSync('userMobile'), 
      locateCityName: wx.getStorageSync('locateCityName'), 
      locateCityId: wx.getStorageSync('locateCityId') 
    });
    //获取设备屏幕高度
    try {
      var res = wx.getSystemInfoSync()
      that.setData({
        winHeight: res.windowHeight
      });
    } catch (e) {
      console.log('获取屏幕高度失败')
    };
    //获取城市ID
    var value = wx.getStorageSync('cityId');
    that.setData({
      cityId: value,
      locateCityId: wx.getStorageSync('locateCityId')
    });

    var userMobile = app.globalData.userMobile;

    if (!userMobile) {
      wx.request({
        url: app.buildRequestUrl('getUserInfo'),
        data: { userId: app.globalData.userId },
        success: function (res) {
          if (res.data.STATUS == 1) {
            var userMobile = res.data.DATA.WX_MOBILE;
            var openId = res.data.DATA.WX_USERNAME;
            var nickName = res.data.DATA.WX_NICKNAME;

            app.globalData.userMobile = userMobile;
            app.globalData.openId = openId;
            app.globalData.nickName = nickName;
            that.setData({ bindMobile: userMobile });
            wx.setStorageSync('userMobile', userMobile);
            wx.setStorageSync('openId', openId);
            wx.setStorageSync('nickName', nickName);
          }
        }
      })
    }else{
    	that.setData({ bindMobile: userMobile });
    }
  },
  /**
   * 点击蒙层,关闭弹框
   */
  closeToastBox() {
    this.setData({
      toastHide: true
    });
  },
  /**
   *  阻止冒泡
   */
  cancelBubble() {
    return false;
  },
  /**
   * 同意切换到定位城市
   */
  changeCity: function () {
    this.setData({ toastHide: true });
    if(this.data.locateCityId>0){
    	wx.setStorageSync('cityId', this.data.locateCityId);
        wx.setStorageSync('cityName', this.data.locateCityName);
        wx.reLaunch({
            url: "/pages/real_index/index"
          });
    }else{
        wx.reLaunch({
	        url: "/pages/chooseCity/chooseCity"
	    });
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
	  this.setData({bindMobile:app.globalData.userMobile});
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
   * 跳转链接
   */
  goToUrl: function (e) {
    var urlType = e.currentTarget.dataset.type,
      that = this,
      usermobile = that.data.bindMobile,
      redirUrl;
    //我要出售,我要出租不是定位城市不能发布
    if (urlType == 1 || urlType == 2) {
        if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
            if (!!wx.getStorageSync('locateCityId')) {
                //显示切换城市弹框
                this.setData({ toastHide: false });
            } else {
                app.getLocationAgain();
            }
            return;
        }
    };
    if (urlType == 1) {
      redirUrl = that.data.saleRegistration;
    } else if (urlType == 2) {
      redirUrl = that.data.rentRegistration;
    } else if (urlType == 3) {
      redirUrl = that.data.trustList;
    }

    wx.navigateTo({
      url: redirUrl,
    })
  },
  /**
   * 跳转了解详情
   */
  redirDetail: function (e) {
    wx.navigateTo({
      url: '/pages/houseRegisterDetail/detail',
    })
  }
})