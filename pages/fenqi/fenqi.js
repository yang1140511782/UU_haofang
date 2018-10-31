var app = getApp();

// pages/vr/vr.js
Page({
	/**
	 * 页面的初始数据
	 */
	data : {
		url : ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad : function(options) {
		var mobile = options.mobile;
		mobile = (mobile == "undefined" || mobile == undefined) ? '' : mobile;
    	var url = app.buildRequestUrl('crashPrize')+'?userMobile='
				+ options.mobile;
		console.log(url);
		this.setData({
			url : url
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady : function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow : function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide : function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload : function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh : function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom : function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage : function() {

	}
})