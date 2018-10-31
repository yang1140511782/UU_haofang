// pages/rewardInstruction/rewardInstruction.js

var app = getApp();
var api = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'', //
    wxId: '',
    mustpay:'', //
    createCustEntrustUrl: app.buildRequestUrl('createCustEntrust'),
    prepayEntrustUrl: app.buildRequestUrl('prepayEntrust'),

    entrustRepeatBox:false,//重复发布委托提示框
    animationData: '',
    redBefore:true,
    redafter:false,
    redMaskStatus:false,
    caseType:'3',
    //专属经纪人信息:
    vipUserInfo:{
      archiveId:'',
      userName:'',
      userPhoto:'',
      userMobile:'',
      buyMoney:'',
      rentMoney:'',
      serviceRegs:'',
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userId: app.globalData.userId, openId: app.globalData.openId, wxId: app.globalData.userId});
    var mustpay = options.mustpay?options.mustpay:1;  //悬赏委托时是否需要调用支付
    this.setData({mustpay:mustpay});

    //获取缓存中的提交表单数据
    var dataStr = wx.getStorageSync('publishEntrustData');//取缓存
    if(!!dataStr){
      var publishData = JSON.parse(dataStr);
      if(publishData.isVip == 1){

        //去除专属委托红包 20180404
        this.setData({
          // redMaskStatus:true,
          caseType:publishData.caseType,
          vipUserInfo:publishData.vipUserInfo
        });
      }
    }

  },
  /**
   * 支付悬赏金
   * @param moneyPay: 支付金额
   * @param skipUrl: 支付成功后的
   */
  prepayEntrust:function(moneyPay,skipUrl,caseId,caseType,cityId){

    var _this = this;
      wx.request({
          url: _this.data.prepayEntrustUrl,
          data: {
              openId:_this.data.openId,
              wxId:_this.data.wxId,
              caseId:caseId,
              caseType:caseType,
              cityId:cityId,
              moneyPay:moneyPay
          },
          success: function (res) {
              console.log('初始化支付');
              console.log(res);
              var data = res.data.DATA;
              var status = res.data.STATUS;
              
              if(status==1){
            	  wx.requestPayment({
            		  'appId': data.appId,
            		  'timeStamp': data.timeStamp,
            		  'nonceStr': data.nonceStr,
            		  'package': data.package,
            		  'signType': 'MD5',
            		  'paySign': data.paySign,
            		  'success': function (res) {
            			  console.log('支付成功回调');
                    _this.clearPublishLocalstorage();//清除发布数据缓存
                    wx.redirectTo({url:skipUrl});
            		  },
            		  'fail': function (res) {
                    
            			  console.log('支付失败');
            		  }
            	  })
              }else{
            	  wx.showToast({
	        		  title: '预支付失败',
	        		  icon: 'success',
	        		  duration: 2000
	        		})
              }
          },
          fail: function () {
              console.log('初始化支付失败');
          }
      })
  },
  /**
   * 发布悬赏委托
   */
  rewardEntrustBtn:function(){
    var _this = this;
    if(_this.data.mustpay == 2){
      //不需要调用支付,直接发布
      this.submitEntrust(2);
    }else{
      //需要先调支付,才能发布 mustpay:
      this.submitEntrust(1);
    }
  },
  /**
   * 发布普通委托
   */
  commonEntrustBtn:function(){
      //直接发布委托
      this.submitEntrust(0);
  },
  /**
   * @param mustpay:0,1,2
   * 提交委托
   */
  submitEntrust:function(mustpay){
    var _this = this;
    //获取缓存中的提交表单数据
    var dataStr = wx.getStorageSync('publishEntrustData');//取缓存
    if(!!dataStr){
      var publishData = JSON.parse(dataStr);
      //准备提交委托数据
      var sendData = {
        houseRegion:publishData.houseRegion,
        regionName:publishData.regionName,
        houseSection:publishData.houseSection,
        sectionName:publishData.sectionName,
        houseUseage:publishData.houseUseage,
        houseFitment:publishData.houseFitment,
        roomL:publishData.roomL,
        roomH:publishData.roomH,
        areaL:publishData.areaL,
        areaH:publishData.areaH,
        priceL:publishData.priceL,
        priceH:publishData.priceH,
        wfFee:publishData.wfFee,
        descp:publishData.descp,
        wfSex:publishData.wfSex,
        caseType:publishData.caseType,
        youyouUserId:publishData.youyouUserId,
        cityId:publishData.cityId,

        wfRelateId:publishData.wfRelateId,
        resource:publishData.resource,
        specialOper:publishData.specialOper,

        isHelp:publishData.isHelp,
        youjiaFlag:'0',
        archiveId:publishData.vipUserInfo.archiveId,
        isVip:publishData.isVip,

      };
      sendData['mustpay'] = mustpay;//
      var url = _this.data.createCustEntrustUrl;
      console.log(sendData);
      api.getList(url, sendData).then(res => {
       if(res.STATUS != 1){
         if (res.STATUS == 0){
           wx.showModal({
             title: '提示',
             content: res.INFO,
             success: function (res) {
               if (res.confirm) {
                 
               } else if (res.cancel) {
                
               }
             }
           })
         }
         return;
       }
        var data = res.DATA;
        if(data.type != 1){
          //发布失败
          console.log(data.info);
          this.setData({entrustRepeatBox:true});
        }else{
          //发布成功
          if(publishData.isVip == '1'){
            var skipUrl = "/pages/trustList/trustList?caseType="+data.caseType;//直接进入委托流程页
          }else{
            var skipUrl = "/pages/entrustAgent/entrustAgent?caseId="+data.caseId+"&caseType="+data.caseType+"&cityId="+data.cityId+"&wxId="+data.wxId;
          }
          var totalFee = data.totalFee;

          if(mustpay == 1){
            //mustpay:是否必须支付（1是、0否、2资金账户还能够满足发布意向金委托）
            _this.prepayEntrust(totalFee,skipUrl,data.caseId,data.caseType,data.cityId);
          }else{
            //无需支付,直接跳转至下一页:
            _this.clearPublishLocalstorage();//清除发布数据缓存
            wx.redirectTo({url:skipUrl});
          }
        }
        
      });
    }
  },

  /**
   * 清除发布委托的缓存数据 (发布成功后)
   */
  clearPublishLocalstorage: function () {
    wx.removeStorageSync('publishEntrustData');
  },

  /**
   * 关闭 发布委托 提示框
   */
  publishErrBoxTapL: function () {
    this.setData({entrustRepeatBox:false});
  },
   /**
   * 查看委托列表
   */
  publishErrBoxTapR: function () {
    wx.redirectTo({url:"/pages/trustList/trustList"});
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
    var _this = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    })
    this.animation = animation
    animation.rotate(0).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.rotateY(180).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
    setTimeout(function(){
      _this.setData({
        redBefore:false,
        redafter:true
      })
    },2000)
  },
  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotateY(180).step()
    this.setData({
      animationData: animation.export()
    })
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
   * 关闭红包弹框
  */
  closeBtnRed:function(){
      this.setData({
        redMaskStatus:false
      })
  }
})