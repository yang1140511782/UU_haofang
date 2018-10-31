// pages/collectInfo/collectInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    testCodeTime:0,
    pageOptions:{},
    bindUserMobile:'',  //用户绑定的号码
    testCodeShow:true,
    forData:{
      userPhone:'',
    }
  },
  // 页面加载获取默认数据
  // 输入框的双向绑定
  bindKeyInput(e){
    let obj = {};
    obj[e.target.dataset.key] = e.detail.value; 
    this.setData(obj);
  },
  // 验证手机号
  testPhoneNum(){
    let reg = /^((1[3-8][0-9])+\d{8})$/;
    if (!(reg.test(this.data.forData.userPhone)) && this.data.forData.userPhone!='') {
      wx.showToast({ title: '手机号格式不正确', icon: 'none'});
      return true;
    }else{
      return false;
    }
  },
  // 获取初始数据
  getUserLogistcsInfo(){
    wx.request({
      url: app.buildRequestUrl('getUserLogistcsInfo'),
      data: { userMobile: wx.getStorageSync('userMobile')},
      success:(res)=> {
        if (res.statusCode === 200 && res.data.code === 200) {
          if (res.data.data.userAddr){
            let userAddr = res.data.data.userAddr.split(',');
            this.setData({ region: userAddr });
          }
          this.setData({ forData: res.data.data});
        } else {
          wx.showToast({ title: res.data.errMsg, icon: 'none' });
        }
      },
    });
  },
  // 获取验证码
  getTestCode(){
    if (this.testPhoneNum()){return}
    let reduceTime = 60;
    wx.request({
      url: app.buildRequestUrl('sendMsg'),
      data: {
        mobile: this.data.forData.userPhone,
      },
      success: (res)=> {
        if (res.statusCode === 200 && res.data.status===1){
          wx.showToast({ title: res.data.info, icon: 'none' });
          let codeTime = setInterval(() => {
            reduceTime -= 1;
            this.setData({ testCodeTime: reduceTime });
            if (this.data.testCodeTime < 1) {
              clearInterval(codeTime);
            }
          }, 1000);
        }else{
          wx.showToast({ title: res.data.info, icon: 'none' });
          this.setData({ testCodeTime: 0 });
        }
      },
    });
  },
  // 提交物流信息
  formSubmit: function (e) {
    let $r = e.detail.value;
    for (const key in $r) {
      if ($r.hasOwnProperty(key)) {
        const element = $r[key];
        if (typeof (element) === 'string'){
          if (element===''){
            wx.showToast({ title: '请完善信息', icon: 'none' });
            return;
          }
        }
        if (typeof (element) === 'object') {
          if (element.length === 0) {
            wx.showToast({ title: '请完善信息', icon: 'none' });
            return;
          }
        }
      }
    }
    let bindUserMobile = wx.getStorageSync('userMobile')
    let code = '';
    if (bindUserMobile == this.data.forData.userPhone) {
      code = 4321;
    } else {
      code = $r.testCode;
    }
    let dataObj = {
      prizeId: this.data.pageOptions.id,
      userPhone: $r.userPhone,
      code: code,
      userName: $r.userName,
      userAddr: $r.userAddr.join(','),
      addrInfo: $r.addrInfo
    };
    wx.request({
      url: app.buildRequestUrl('createLogistcsInfo'),
      data: dataObj,
      success: function (res) {
        if (res.statusCode === 200 && res.data.STATUS === 1) {
          wx.showToast({ title: res.data.INFO, icon: 'none' });
          setTimeout(()=>{
            wx.navigateBack();
          },1000);
        }else{
          wx.showToast({ title: res.data.INFO, icon: 'none' });
        }
      },
    });
  },
  // 三级选择器
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.pageOptions = options;
    //读取缓存中绑定的手机号码
    let bindUserMobile = wx.getStorageSync('userMobile')
    if (!!bindUserMobile) {
      let forData = this.data.forData
      forData['userPhone'] = bindUserMobile
      this.setData({
        forData:forData,
        bindUserMobile: bindUserMobile
      })
    }
    if (bindUserMobile == this.data.forData.userPhone){
      this.setData({ testCodeShow: false});
    }else{
      this.setData({ testCodeShow: true });
    }
    this.getUserLogistcsInfo();
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