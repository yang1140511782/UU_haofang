// pages/appointAgent/appointAgent.js
//获取应用实例
const app = getApp();
var api = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAppointAgentInfoUrl: app.buildRequestUrl('getAppointAgentInfo'),
    publishEntrustShow: false,
    evaAvgClass:'',
    brokerInfo: {
      archiveId: '',
      deptName: '',
      cityId: '',
      buyMoney: '',
      rentMoney: '',
      evaAvg: '5',
      integrity: '',
      serviceReg: '',
      userName:'',
      userMobile:'',
      userPhotoMin: '',
    }
  },
  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var q = options.q;
    q = decodeURIComponent(q);
    var archiveId = '';
    if (!!q) {
      var qArr = q.match(/archive_id=(\d+)/);
      if (!!qArr && qArr.length > 1) {
        archiveId = qArr[1];
      }
    }
    if (!!archiveId) {
      var requestUrl = this.data.getAppointAgentInfoUrl;
      var params = {
        archiveId: archiveId,
      };
      api.getList(requestUrl, params).then(res => {
        console.log(res);
        if (res.STATUS != 1) {
          wx.showToast({
            title: res.INFO,
            duration: 2000
          });
          return;
        }
        var data = res.DATA;
        if (!!data) {
          var evaAvgClass = data.evaAvg.replace('.','d');
          _this.setData({
            brokerInfo: data,
            evaAvgClass: evaAvgClass,
          });
        }
      });
    }
  },

  /**
   * 点击:提交委托
   */
  btnTap: function (e) {
    this.setData({ publishEntrustShow: true });
  },
  /**
   * 取消:提交委托
   */
  publishCancleEvent: function (e) {
    this.setData({ publishEntrustShow: false });
  },
  /**
   * 取消:提交委托
   */
  publishTap: function (e) {
    var baseUrl = e.currentTarget.dataset.url;
    var paramsArr = this.data.brokerInfo;
    var paramsArrNew = ["isVip=1"];
    for(var x in paramsArr){
        paramsArrNew.push(x+'='+paramsArr[x]);
        if(x =='userPhotoMin'){
          paramsArrNew.push('userPhoto='+paramsArr[x]);
        }else if(x == 'serviceReg'){
          paramsArrNew.push('serviceRegs='+paramsArr[x]);
        }
    }
    var paramsStr = paramsArrNew.join('&');
    if(baseUrl.indexOf('entrust') > -1){
      //求租求购
      var url = baseUrl+'&'+paramsStr;
    }else{
      //出租出售房源登记
      var url = baseUrl + '?'+paramsStr;
    }
    
    wx.navigateTo({
      url:url
    });

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