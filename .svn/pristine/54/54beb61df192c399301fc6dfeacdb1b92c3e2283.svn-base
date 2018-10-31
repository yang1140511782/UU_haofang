// pages/history/history.js
var app = getApp();
var api = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: app.buildRequestUrl('getHistoryList'),
    saleRentList: [],
    wxId: app.globalData.userId,
    pageNum: 1,
    cityId: app.globalData.cityId,
    ajaxListTag: true,
    loadingdata: true,  //正在加载数据
    noMoreData: false, //没有更多数据
    listHiden: true,
    noData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取设备屏幕高度
    try {
      var res = wx.getSystemInfoSync()
      that.setData({
        winHeight: res.windowHeight
      });
    } catch (e) {
      console.log('获取屏幕高度失败')
    };

    that.getListData();
  },
  getListData: function () {
    var that = this,
      requestUrl = that.data.requestUrl,
      params = {
        youyouUserId: that.data.wxId,
        cityId: that.data.cityId,
        pageNum: that.data.pageNum,
      };
    that.setData({
      ajaxListTag: false,
      loadingdata: true,
      noMoreData: false
    });

    api.getList(requestUrl, params).then(res => {
      res = res.DATA.list;
      //出租出售
      res.map(function (ele, i) {
        if (ele['houseTagDesc']) {
          ele['houseTagDesc'] = ele['houseTagDesc'].split('|');
        }
        if (ele['caseType'] == 1) {
          ele['caseTypeCn'] = '出售';
        } else if (ele['caseType'] == 2) {
          ele['caseTypeCn'] = '整租';
        } else if (ele['caseType'] == 3) {
          ele['caseTypeCn'] = '合租';
        }
      });
      that.setData({
        saleRentList: res,
        loadingdata: false
      });

      if ((res.length < 30 && res.length > 0) || (that.data.pageNum > 1 && res.length == 0)) {
        that.setData({
          noMoreData: true
        });
      } else if (res.length == 0&& that.data.pageNum == 1){
        that.setData({
          noData: true
        });
      }

    })
  },
  /**
 * 列表滑动到底部加载更多
 */
  lower() {
    if (this.data.ajaxListTag) {
      var pageNum = this.data.pageNum;
      pageNum++;
      this.setData({
        pageNum: pageNum,
        listHiden: false
      })
      this.getListData();
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