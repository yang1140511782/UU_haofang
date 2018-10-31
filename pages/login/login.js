var app = getApp();
var api = require('../../utils/common.js');

Page({

  /**
	 * 页面的初始数据
	 */
  data: {
	  url:'/pages/real_index/index'
  },
  isEmptyObject:function(obj){  
	     for(var key in obj){  
	          break;  
	          return false;  
	     };  
	     return true;
	},
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
	  var url = options.skipUrl;
	  if(!!url){
		  url = decodeURIComponent(url);
		  this.setData({url:url});
	  }
  },
  getUserInfo:function(e){
	  wx.showNavigationBarLoading();
	  var that = this;
	  wx.getSetting({
		  success: (res) => {
			  if(res.authSetting['scope.userInfo']){
				  console.log('同意');
				  var userInfo = e.detail;
				  wx.hideNavigationBarLoading();
				  that.loginGetUserInfo(userInfo);
			  }else{
				  wx.showModal({
	      			  title: '授权提示',
	      			  showCancel:true,
	      			  content: '要先允许使用[用户信息]才可以登录哦',
	      			  confirmText:'去设置',
	      			  success: function(res) {
	      				  if (res.confirm) {
	      					  wx.openSetting({
	      						  success: (res1) => {
	      							  console.log('openSetting');
	      							  console.log(res1);
	      							if(res1.authSetting['scope.userInfo']){
										 wx.getUserInfo({
											 success: function(res) {
												 that.loginGetUserInfo(res);
											 }
										 })
	      							}
	      						  }
	      					  })
	      				  }
	      			  }
	      		  })
	      		wx.hideNavigationBarLoading();
			  }
    },fail:function(){
    	wx.hideNavigationBarLoading();
    }
})
	  
  },
  loginGetUserInfo(userInfo){// 调用wx.login获取用户信息
	  let that = this;
	  wx.login({
        success: function (loginRes) {
        	var userInfoStr = JSON.stringify(userInfo);
			wx.request({
				url: app.buildRequestUrl('dealUserInfo'),
				data: {
					code: loginRes.code,
					userInfo: userInfoStr
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				success: function (res) {
					var json = res.data;
					if (json.STATUS==1){
						try {
							wx.setStorageSync('userId', json.DATA.userId);
							wx.setStorageSync('openId', json.DATA.openId);
							wx.setStorageSync('sessionId', json.DATA.sessionId);
							var cityId = wx.getStorageSync('locateCityId');
							// that.bindCity(json.DATA.userId,cityId);
							
							var shareOpen = wx.getStorageSync('shareOpenId');
							var shareArchive = wx.getStorageSync('shareArchiveId');
							var shareUserId = wx.getStorageSync('shareUserId');
							var shareCaseType = wx.getStorageSync('shareCaseType');
							var shareCityId = wx.getStorageSync('shareCityId');
							var shareCaseId = wx.getStorageSync('shareCaseId');
                            var youyouUserId = json.DATA.userId;

							if(!!shareArchive){
								wx.request({
									url: that.buildRequestUrl('stimulerBroker'),
									data: {
										openId:json.DATA.openId,
										caseType:shareCaseType,
										cityId:shareCityId,
										caseId:shareCaseId,
										shareArchiveId:shareArchive,
                                        youyouUserId:youyouUserId,
										come:wx.getStorageSync('come')
									},
									complete: function (res) {
										that.jumpTo();
									}
								});
							}else{
								that.jumpTo();
							}
						} catch (e) {
							console.log(e);
						}
					}
				},
				complete: function (res) {
					wx.hideNavigationBarLoading();
				}
			});
        }
      })
  },
  jumpTo:function(){
	  let that = this;
	  var pageUrl = that.data.url;
	  if(pageUrl.indexOf('real_index/index') > -1 || pageUrl.indexOf('news/news') > -1 || pageUrl.indexOf('mine/mine') > -1){
		    wx.switchTab({url:pageUrl});
		  }else{
		    wx.redirectTo({url:pageUrl});
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
  bindCity:function(userId,cityId){
  	if(userId&&cityId){
  		wx.request({
        url: app.buildRequestUrl('receiveCouponAction'),
  			data: {
  				userId:userId,
  				cityId:cityId
  			},
  			success: function (res) {
  				console.log(res);
  			}
  		})
  	}
  }
})