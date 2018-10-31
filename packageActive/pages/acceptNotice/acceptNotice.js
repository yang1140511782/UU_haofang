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
    
    // var url = 'http://lcl_uuweb.hftsoft.com/Home/Activity/accept_Notice';
    var url = 'http://uuweb.haofang.net/Home/Activity/accept_Notice';
    this.setData({url:url});
    //屏蔽小程序分享
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
	  return {
	      title: '同学，有一份你的大学录取通知书等待领取！',
	      path:'/packageActive/pages/acceptNotice/acceptNotice',
	      imageUrl:'http://lcl_uuweb.hftsoft.com/Public/images/acceptNotice/wxapp_share_icon.png',//分享图片路径
	      success:function(){
	    	  //发送模板消息
    	    
	      },complete:function(){
	    	  console.log(url);
	      }
	    }
  }
})