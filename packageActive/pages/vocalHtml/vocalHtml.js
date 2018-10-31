var app = getApp();
var api = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  shareUserId:'',
	  shareOpenId:'',
	  txShow:true,
    userId:'',
    isHelp:0, //用户是否已助力
    ticketJoinFlag:true, //活动是否还能继续参与
    friendNum:0,
    btntxta:'邀请好友助力',
    codeNum:'',
    imgUrl0:'',
    imgUrl1: '',
    imgUrl2: '',
    imgUrl3: '',
    imgUrl4: '',
    step:0,
    type: '5' //活动类别 1: 周杰伦  2: 反贪风暴3  3: 反贪风暴3(第二轮) 4: 好声音巅峰夜门票 5:欢乐谷万圣节门票
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shareUserId = options.shareUserId;
    var shareOpenId = options.shareOpenId;
    //如果没有获取到分享者信息,设置分享者为当前用户
    if (!shareUserId && !shareOpenId) {
      shareOpenId = wx.getStorageSync('openId')
      shareUserId = wx.getStorageSync('userId')
    }
    var vocalType = options.type;
    
    if(!wx.getStorageSync('openId')){
  	  app.saveUserData();
    }
    var that = this;
    var intval = setInterval(function(){
    	var userId = wx.getStorageSync('userId');
      console.log('userId',userId);
    	if(userId){
    		console.log(userId);
    		var isSelf = false;
    		if((!!shareUserId) && userId != shareUserId){
    			wx.request({
    				url: app.buildRequestUrl('isHelpInfo'),
    				data: {
              type: that.data.type,
    					openId: wx.getStorageSync('openId')
    				},
    				success: function (res) {
    					clearInterval(intval);
              var count = res.data.data.count;
              var helpShareWxId = res.data.data.shareWxId;
              var step = 1,isHelp=0;
    					if(res.data.data.count == 0){//未助力
                  step = 2;
    					}else{
                //已助力:助力页面分享人显示已助力 , 其他人的展示 助力按钮
                  step = helpShareWxId ==shareUserId?3:4;
                  isHelp = 1;
    					}
              that.setData({step:step,isHelp:isHelp});

    				}
    			})
    		}else{
    			clearInterval(intval);
    			that.setData({
					step:1
				})    			
				that.friendInit(shareUserId);
    		}
    		that.setData({
    			userId: userId ? userId : app.globalData.userId,
				shareUserId:!!shareUserId?shareUserId:'',
				shareOpenId:!!shareOpenId?shareOpenId:'',
    		});
    	}
    },400)

    //请求判断活动 是否还能继续参与
        wx.request({
    				url: app.buildRequestUrl('actShowUrl'),
    				header: {
              'content-type': 'application/json' // 默认值
            },
    				success: function (res) {
    					if (!!res.data) {
                var _data = res.data.DATA;
                if (!!_data) {
                  if (!_data.ticketJoinFlag) {
                    that.setData({
                      ticketJoinFlag:_data.ticketJoinFlag,
                    })
                  }
                }
              }

    				}
    			})
    
  },
  /**
   *查询已经助力的好友 
   */
  friendInit(shareUserId){
    var that = this;
    wx.request({
      url: app.buildRequestUrl('getAttendMember'),
      data: {
        type:that.data.type,
        userId: shareUserId
      },
      success: function (res) {
        if (res.statusCode==200){
          var _data = res.data.info.img;
          if(!!_data && _data.length>0){
            for(var i=0;i<_data.length;i++){
              var up = "imgUrl" + i ;
              var imgul = _data[i].WX_PHOTO;
                that.setData({
                  [up]: imgul
                })
            }
            var _num = res.data.info.count;
            that.setData({
              friendNum: _num
            })
            if (_num>=3){
              //需要拼接抽奖码
        	  that.setData({
        		  // btntxta:'抽奖码：'+res.data.info.code,
        		  codeNum: res.data.info.code,
        	  })
            }
          }
        }
      }
    })
  },
  /**
   *点击参与助力 
   */
  setClipboard:function(){
    var codeNum = this.data.codeNum + '';
    if(!!codeNum){
         wx.setClipboardData({
          data: codeNum,
            success: function(res) {
               wx.showToast({
			          title: '复制成功',
			          icon: 'none',
			          duration: 1500
			        })
            }
          })
    }
   
  },
  /**
   *点击参与助力 
   */
  helpBtn(e){
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.buildRequestUrl('ticket'),
      data: {
        type:that.data.type,
        shareUserId:that.data.shareUserId,
        shareOpenId:that.data.shareOpenId,
        openId:wx.getStorageSync('openId'),
        formId:formId
      },
      success: function (res) {
    	  console.log({shareUserId:that.data.shareUserId,
    	        shareOpenId:that.data.shareOpenId,
    	        openId:wx.getStorageSync('openId'),
    	        formId:formId});
    	  console.log(res);
    	  if(res.data.status == 1){
    		that.setData({
      			step:3
  		    })
    	  }else{
    		  wx.showToast({
			  title: res.data.info,
			  icon: 'none',
			  duration: 1500
			})
    	  }
      }
    })
    
  },
  /**
   *返回首页 
   */
  goToHome(){
    wx.switchTab({
      url: '/pages/real_index/index',
    })
  },
  goToListDetail:function(){
    //进入助力列表的web-view网页
    var userId = wx.getStorageSync('userId');
    var openId = wx.getStorageSync('openId');
    var voclType = this.data.type;
    wx.navigateTo({ url:'/packageActive/pages/vocalHelpList/vocalHelpList?userId='+userId+ '&openId='+openId+'&type='+voclType});
   
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
    var url = '/packageActive/pages/vocalHtml/vocalHtml?shareUserId='+wx.getStorageSync('userId')+"&shareOpenId="+wx.getStorageSync('openId');
	  return {
	      title: '我正在免费抢欢乐谷万圣节活动门票，来帮我助力一下吧！',
	      path:url,
	      imageUrl: 'http://cdn.haofang.net/static/uuweb/activity/new20181019/wxapp_share_pic.png', //分享图片路径
	      success:function(){
	    	  //发送模板消息
    	    wx.request({
    	        url: app.buildRequestUrl('sendShareMsg'),
    	        data: {
    	          userId: wx.getStorageSync('userId'),
    	          openId: wx.getStorageSync('openId'),
    	        },
    	        success: function (res) {}
    	      })
	      },complete:function(){
	    	  console.log(url);
	      }
	    }
  }
})