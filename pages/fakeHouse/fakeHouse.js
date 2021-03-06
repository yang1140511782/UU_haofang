const app = getApp();
var api = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chik:'',
    archiveId: '',
    toastShow: false,
    hasRelation: false,
    caseType: 3,
    cityId: 1,
    caseId:'',
    houseInfo: '',
    clickTimes:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let archiveId = options.archiveId;
    let caseType = options.caseType;
    let caseId = options.caseId;
    let houseInfo = options.houseInfo;
    let userId = wx.getStorageSync('userId');
    let cityId = wx.getStorageSync('cityId');
    _this.setData({
      archiveId: archiveId,
      caseType: caseType == 1 ? 3 : 4,
      cityId: cityId,
      caseId: caseId,
      houseInfo: houseInfo
    })
    
    wx.request({
      url: app.buildRequestUrl('entrustList'),
      data: {
        cityId: cityId,
        youyouUserId: app.globalData.userId,
        pageNum: 1,
        pageSize: 10
      },
      success: function(res){
        if (res.statusCode == 200){
          let list = res.data.DATA.list;
          if(list.length > 0){
            for(var i=0; i<list.length; i++){
              let entrustUsers = list[i].entrustUsers;
              if(entrustUsers.length > 0){
                for (var j = 0; j < entrustUsers.length;j++){
                  if (entrustUsers[j].brokerArchiveId == archiveId){
                    _this.setData({
                      hasRelation: true,
                      toastShow: false,
                      archiveId: archiveId
                    })
                  }
                }
              }
            }
          }
        }
       
      }
    })
  },
  /**
   *每项点击 
   */
  clickLi(e){
      var that = this;
      var num = e.currentTarget.dataset.num;
      //如果第一次选择，弹出提示框
      if (that.data.clickTimes == 0){
        // wx.showToast({
        //   title: '感谢您对优优好房的支持与监督',
        //   icon:"none"
        // })
      }
      if(that.data.chik == num){
        num = '';
      }
      that.setData({
        chik: num,
        clickTimes: that.data.clickTimes + 1
      })
      //提交form收集formId

  },
  /**
   *点击了解规则 
   */
  goToRule(){
    wx.navigateTo({
      url: '/packageWeb/pages/realHouseRule/index',
    })
  },
  /**
   *点击提交 
   */
  subBtn(){
    var that = this;
   
    if (!that.data.chik){
      wx.showToast({
        title: '请先选择投诉原因',
        icon: 'none',
        duration: 1000
      })

      return false;
    }
  
    if (that.data.hasRelation == true){
      //直接提交数据
      wx.request({
        url: app.buildRequestUrl('compalaintUrl'),
        data:{
          chik: that.data.chik,
          userId: app.globalData.userId,
          archiveId: that.data.archiveId
        },
        success: function(res){
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500,
              success: function () {
                wx.navigateBack();
              }
            })
        }
      })
    }else{
      //没有过关系的话，先提示去委托
      let isShow = that.data.hasRelation == false ? true : false;
      that.setData({
        toastShow: isShow
      })
    }
  },
  /**
   *遮罩层点击 
   */
  closeToast(){
    var that = this;
    that.setData({
      toastShow: false
    })
  },
  /**
   *我要委托点击 
   */
  entrustBtn(){
    let _this = this;
    let queryUrl = '';
    wx.request({
      url: app.buildRequestUrl('getArchiveInfoUrl'),
      data: { 
        archiveId: _this.data.archiveId,
        cityId: _this.data.cityId
      },
      success:function(res){
        console.log(res);
        if (res.data.length != 0){
          let archiveInfo = res.data;

          queryUrl = "&serviceRegs=" + archiveInfo.serviceReg.join(',') + "&caseType=" + _this.data.caseType + "&test=10&archiveId=" + _this.data.archiveId + "&isVip=1&userMobile=" + archiveInfo.brokerMobile + "&userName=" + archiveInfo.brokerName + "&rentMoney=20&buyMoney=100&userPhoto=" + archiveInfo.brokerUserPicUrl;
          wx.navigateTo({
            url: '/pages/entrust/entrust?' + queryUrl,
          })
        }else{
          wx.navigateTo({
            url: '/pages/entrust/entrust?' + queryUrl,
          })
        }
      }
    })
  },
  entrustQuit: function(){
    this.setData({
      toastShow: false
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
  formSubmit(e) {
    let _this = this;
    let formId = e.detail.formId;
    let openId = wx.getStorageSync('openId');
    let userInfo = wx.getStorageSync('userInfo');
    let cacheKey = app.globalData.userId + '_' + 'compalaintForm';
    if (!api.getStorageData(cacheKey) && false){
      console.log('上次点击还在有效时间内');
      return false;
    } else if (formId.indexOf('mock') != -1){
      console.log('请在真机上操作');
      return false;
    }

    //发送模板消息
    wx.request({
      url: app.buildRequestUrl('collectFormIdUrl'),
      data: {
        formId: formId,
        userId: app.globalData.userId,
        openId: openId,
        formType: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //缓存一天
        api.setStorageData(cacheKey, true, 86400);
        console.log(res.data)
      }
    })
    
  }
})