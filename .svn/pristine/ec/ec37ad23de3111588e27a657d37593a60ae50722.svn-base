const app = getApp();
let wxCharts = require('../../utils/wxcharts.js');
var _im = require('../../utils/_im.js');
var util = require('../../utils/util.js');
let windowWidth = 320;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityId: '',
    buildId: '',
    cityName:'',
    currentPrice:'',
    dk:'',
    currentMonth:'',
    newClient:'',
    newHouse:'',
    houseType: '',
    unreadNum: 0,
  },

  /**
   * 图表函数
   */
  eachart: function (e) {
    var that = this;
    //如果 渲染数组长度为空 ,则不渲染 ,避免 wxercharts 卡死小程序
    if(this.data.timeArr.length == 0){
      return;
    }
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: this.data.timeArr,
      series: [
      {
        name: this.data.cityName,
        data: this.data.cityArr,
        color: '#ff5400',
      },
      ],
      yAxis: {
        title: '均价(元/㎡)',
      },
      xAxis: {

      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '城市均价'
    })
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
      }
    });

    var value = wx.getStorageSync('cityId');
    if (value) {
      that.setData({
        cityId: value
      })
    }else{
      that.setData({
        cityId: options.cityId
      })
    }
    that.priceTrendInit();

    _im.initIm();
    this.initUnreadNum();
  },

 /**
  *价格走势 
  */
  priceTrendInit(){
    var that =this;
    var data = {
      cityId: that.data.cityId
    }
    wx.request({
      url: app.buildRequestUrl('cityTrendPrice'),
      // url: "http://lbuuweb.hftsoft.com/Mini/App/cityTrendPriceTest",
      data: data,
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode==200){
          console.log(res)
          var data = res.data.list;
          var _data = res.data;
          var cityArr = [], houseArr = [], regionArr = [], timeArr = [];
          if (!!data){
            for (var i = (data.length-1); i >= 0; i--) {
              cityArr.push(data[i].price);
              if (data[i].priceMonths.length == 7) {
                timeArr.push(data[i].priceMonths.substr(2, 5));
              }
              
            }
          }

          
          that.setData({
            cityName: _data.cityName,
            currentPrice: _data.currentMonth,
            currentMonth: _data.months.slice(5),
            dk: _data.dkNum,
            newClient: _data.custNum,
            newHouse: _data.houseNum,
            cityArr: cityArr,
            timeArr: timeArr,
            appShow: true
          })
          that.eachart();
          // for (var i = 0; i < data.house.length; i++) {
          //   houseArr.push(data.house[i].price);
          // }
          // for (var i = 0; i < data.region.length; i++) {
          //   regionArr.push(data.region[i].price);
          // }
        }
        console.log(data)
      }
    })
  },
  /**
   *跳转放假评估 
   */
  gotoFjPg(){
    wx.navigateTo({
      url: '/packageTool/pages/evaluationEntry/evaluationEntry',
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

  initUnreadNum: function () {
    var _this = this;
    var unreadNum = wx.getStorageSync('unreadNum') ? parseInt(wx.getStorageSync('unreadNum')) : 0;
    _this.setData({
      unreadNum: unreadNum
    });
  },
  //页面右侧提示有未读消息
  hintUnread: function () {
    var unreadNum = this.data.unreadNum + 1;
    this.setData({
      unreadNum: unreadNum
    })
  },
  //点击消息提示，跳转到联系人列表
  msgNotifyClick: function (e) {
    wx.switchTab({
      url: '/pages/news/news'
    })
  }
})