// pages/mine/mine.js
var app = getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',//用户信息
    userMobile:null,
    userId:'',
		userInfo:{},
    ticketCount:0,//优惠券张数
    redNum:0,//有效优惠券张数
    payPaidTotal:0,//意向金
    taxiPaidTotal:0,//打车押金总额,
    DAIKUAN_FLAG:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
		var interval = setInterval(function(){
		var myId = wx.getStorageSync('userId');
		
		if(myId){
			wx.request({
				url: app.buildRequestUrl('getUserInfo')+"?userId="+myId,
				success: function (res) {
					if(res.data.DATA != null){
						var m = res.data.DATA.WX_MOBILE,n=res.data.DATA.WX_NICKNAME,a=res.data.DATA.WX_PHOTO,o=res.data.DATA.YYHF_XCX_OPENID;
						if(a&&a.indexOf("/132")==-1){
							a = a.substr(0 , a.length-1)+"/132";
						}
    					wx.setStorageSync('userMobile', m);
    					wx.setStorageSync('nickName', n);
    					wx.setStorageSync('avatarUrl', a);
    					wx.setStorageSync('openId', o);
						app.globalData.userId = myId;
						app.globalData.openId = o;
						app.globalData.userMobile = m;
						_this.setData({
				            userMobile: m
				          })
						wx.getStorage({
					      key: 'userInfo',
					      success: function (res) {
					        if (!!res.data){
					          // var _data = JSON.parse(res.data.rawData);
					          _this.setData({
                      userInfo: res.data
					          })
					        }
					      }
					    })
					    app.hideToast();
    					clearInterval(interval);
					}
				}
			});

      //请求获取 优惠卷
		    wx.request({
		        url: app.buildRequestUrl('getRedPacketList'),
		        data:{
		          youyouUserId: myId,
		          pageNum: 1,
		          pageSize:30
		        },
		        success: function (res) {
		        	_this.setData({
		            	  ticketCount:res.data.DATA.list.length,
		            	  redNum:res.data.DATA.redNum,
		              });
		        }
		    })
        //请求获取 专车看房押金
      wx.request({
		        url: app.buildRequestUrl('getAcountList'),
		        data:{
		          youyouUserId: myId,
		          pageNum: 1,
              type:1
		        },
		        success: function (res) {
              //专车看房押金
              _this.setData({
                taxiPaidTotal: res.data.DATA.totalMoney,
              })
		        }
		    })
      //请求获取 意向金
      wx.request({
		        url: app.buildRequestUrl('getAcountList'),
		        data:{
		          youyouUserId: myId,
		          pageNum: 1,
              type:0
		        },
		        success: function (res) {
              //设置意向金总额
              _this.setData({
                payPaidTotal: res.data.DATA.totalMoney,
              })
		        }
		    })
		}
	},1000);
      wx.request({
	        url: app.buildRequestUrl('initMenuUrl'),
	        data:{
	          cityId: wx.getStorageSync('cityId')
	        },
	        success: function (res) {
	        	if(res.data.DAIKUAN_FLAG == 1){
	        		_this.setData({DAIKUAN_FLAG:true});
	        	}
	        }
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
		//如果当前未授权 ,则 展示 添加授权蒙层
    if (!!wx.getStorageSync('userInfo')) {
        this.setData({
           userInfo:wx.getStorageSync('userInfo')
        });
    }
    this.setData({ userMobile:app.globalData.userMobile});
    common.initTabUnreadNum();
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
   * 中间导航选择点击
   */
  chooseNavBtn:function(e){
    var currType = e.currentTarget.dataset.type;
	  wx.navigateTo({
	    url: currType,
	  })
  },
  /*头像加载错误*/
  binderrorimg:function(){
    var _this = this;
    var _userInfo = _this.data.userInfo;
    _userInfo.avatarUrl = "http://cdn.haofang.net/static/uuminiapp/mine/fang_default.png";
    _this.setData({
      userInfo: _userInfo
    })
  },

  /**
   * 点击登录 
   */
  loginBtn:function(){
    app.checkLogin();
  },
  /**
   *更新资料 
   */
  upBtn:function(e){
    var _this = this;
    app.showToast('更新中...');
    var userInfo = e.detail.rawData;
    //更新当前 页面头像信息
    if(!!userInfo){
      _this.setData({userInfo: JSON.parse(userInfo)});
    }
    //设置缓存
    wx.setStorageSync('userInfo',e.detail);
	var userInfoStr = e.detail.rawData;
    app.hideToast();
    var userId = wx.getStorageSync('userId');
    if(userId){
	    //请求接口更新线上头像数据
	    wx.request({
	      url: app.buildRequestUrl('updateUserInfo'),
	      data: {
			userId: userId,
			userInfo: userInfoStr
		},
	      header: {
				'content-type': 'application/x-www-form-urlencoded'
		 },
	      method: 'POST',
	      success: function (res) {
	        console.log(res);
	      }
	    });
    }else{
    	var that = this;
    	wx.login({
	    	success: function (loginRes) {
    			if (loginRes.code) {
    				wx.request({
						url: app.buildRequestUrl('dealUserInfo'),
						data:{
							code:loginRes.code,
							userInfo:e.detail
						},
						success: function (res) {
							var json = res.data;
							if (json.STATUS==1){
								try {
									wx.setStorageSync('userId', json.DATA.userId);
									wx.setStorageSync('openId', json.DATA.openId);
									app.globalData.userId = json.DATA.userId;
									app.globalData.openId = json.DATA.openId;
									} catch (e) {
										console.log(e);
									}
								}
							},
							fail: function (res) {
								console.log('刷新session失败！');
								console.log(res)
							},
							complete:function(){
								let userId = wx.getStorageSync('userId');
								let cityId = wx.getStorageSync('locateCityId');
								app.bindCity(userId,cityId);
							}
						});
    			} else {
    				console.log('获取用户登录态失败！' + res.errMsg)
    			}
    		}
	    })
    }

  },
  myAccount:function(){
	  wx.navigateTo({
	    url: '/pages/myAccount/myAccount',
	  })
  },
	/**
   * 授权弹层回调
   */
  getUser:function(e){
    console.log(e);
  	var that = this;
		var userInfo = e.detail.rawData;
    //更新当前 用户信息缓存
    if(!!userInfo){
      that.setData({userInfo: JSON.parse(userInfo)});
      //设置缓存
      wx.setStorageSync('userInfo',JSON.parse(userInfo));
    }
	  wx.login({
    	success: function (loginRes) {
			if (loginRes.code) {
				wx.request({
					url: app.buildRequestUrl('dealUserInfo'),
					data:{
						code:loginRes.code,
						userInfo:e.detail
					},
					success: function (res) {
						var json = res.data;
						if (json.STATUS==1){
							try {
								wx.setStorageSync('userId', json.DATA.userId);
								wx.setStorageSync('openId', json.DATA.openId);
								app.globalData.userId = json.DATA.userId;
								app.globalData.openId = json.DATA.openId;
								that.setData({userId:json.DATA.userId});
								var shareOpen = wx.getStorageSync('shareOpenId');
								var shareArchive = wx.getStorageSync('shareArchiveId');
								var shareUserId = wx.getStorageSync('shareUserId');
								var shareCaseType = wx.getStorageSync('shareCaseType');
								var shareCityId = wx.getStorageSync('shareCityId');
								var shareCaseId = wx.getStorageSync('shareCaseId');
                                var youyouUserId = json.DATA.userId;

								if(!!shareArchive){
									wx.request({
										url: app.buildRequestUrl('stimulerBroker'),
										data: {
											openId:json.DATA.openId,
											caseType:shareCaseType,
											cityId:shareCityId,
											caseId:shareCaseId,
											shareArchiveId:shareArchive,
                                            youyouUserId:youyouUserId,
											come:wx.getStorageSync('come')
										}
									});
								}
								
							} catch (e) {
								console.log(e);
							}
						}
					},
					fail: function (res) {
						console.log('刷新session失败！');
						console.log(res)
					},
					complete:function(){
						let userId = wx.getStorageSync('userId');
						let cityId = wx.getStorageSync('locateCityId');
						app.bindCity(userId,cityId);
					}
				});
			} else {
				console.log('获取用户登录态失败！' + res.errMsg)
			}
		}
    })
	  
  },
	/**
   * 联系在线 客服
   */
	contactCustomService:function(e){
		let to = e.currentTarget.dataset.to;
		let from = 'uu_'+wx.getStorageSync('userId');
		wx.navigateTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
    })
	},
	/**
   * 客服电话 - 拨打
   */
	makePhoneCall:function(e){
		var mobile = e.currentTarget.dataset.mobile;
		if(!!mobile){
			wx.makePhoneCall({
  			phoneNumber: mobile
			})
		}
	},


})