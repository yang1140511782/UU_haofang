
const app = getApp();

let imSdk = require('../../utils/NIM_Web_NIM_v5.0.0.js');
let util = require('../../utils/util.js');
let common = require('../../utils/common.js');
let nim = '';
var data = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contacts: [], //最近咨询列表
    contactList: [],//当前用户的所有聊天记录
    userInfo: [],
    appKey: app.globalData.appKey,
    account: 'uu_' + app.globalData.userId,
    toUserId: app.globalData.imService,
    toUserInfo: [],
    sessions: [],
    serviceInfo: {
      id: app.globalData.imService,
      photo: 'http://cdn.haofang.net/static/uuminiapp/im/server_icon.png?t=20180427',
      name: '客服',
      time: new Date().getTime(),
      msg: '欢迎使用优优好房',
      sendtime: new Date().getTime()
    },
    caseId:'',
    caseType:'',
    dataCityId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let caseId = options.caseId;
    let caseType = options.caseType;
    let dataCityId = options.dataCityId;

    _this.setData({
      caseId:caseId,
      caseType:caseType,
      dataCityId:dataCityId,
    })
    

  },
  //获取最近咨询列表数据
  initRecentList:function(){
    let _this = this;
    let pageNum = 1;
    let pageSize = 20;
    wx.request({
      url: app.buildRequestUrl('getConsultationList'),
      data: {
        youyouUserId: wx.getStorageSync('userId'),
        caseId: _this.data.caseId,
        caseType: _this.data.caseType,
        dataCityId: _this.data.dataCityId,
        pageNum: pageNum,
        pageSize: pageSize,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.STATUS == 1) {
            _this.setData({
              contacts: res.data.DATA.list
            })
            _this.getRecentMsg();
          }
        }
      }
    })
  },
  //获取最近聊天消息
  getRecentMsg: function () {
    var _this = this;
    //初始化获取最近咨询列表数据
    wx.request({
      url: app.buildRequestUrl('contactListUrl'),
      data: {
        accid: 'uu_' + wx.getStorageSync('userId'),
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (!!res.data.contactList) {
            _this.setData({ contactList: res.data.contactList });
            _this.updateRecentMsg();
          }
        }
      }
    })
  },
  //更新最近聊天消息
  updateRecentMsg: function () {
    var _this = this;
    let contactList = _this.data.contactList;
    let contacts = _this.data.contacts;
    contacts.map(function(item,i){
      let imId = item.imId;
      contactList.map(function(itemList,j){
        if(item.imId == itemList.accid){
          contacts[i]['msg'] = itemList.body;
        }
      })
    })
    _this.setData({contacts:contacts});
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.compInfo.FCompName,
      path: app.globalData.sharePublicUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  changeData: function (list) {
    this.setData({
      contacts: list
    })
  },
  onError: function (error) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var _this = this;
    //初始化获取最近咨询列表数据
    _this.initRecentList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log('onHide');
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
   * 跳转到IM页面
   */
  goIm: function (e) {
    let to = e.currentTarget.dataset.to;
    let from = 'uu_' + app.globalData.userId;

    if (getCurrentPages().length < 5) {
      wx.navigateTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    } else {
      wx.redirectTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    }
  },

})