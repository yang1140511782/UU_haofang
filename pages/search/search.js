var app = getApp();
var api = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityId:1,
    getBuildByKeyWordUrl: app.buildRequestUrl('getBuildByKeyWord'),  //数据接口
    searchBuildList: [], //搜索联想楼盘名
    searchHistory: [],   //搜索历史
    inputText: '',       //输入框文字
    caseType: 1,         //类型
    caseBox: false,      //类型选择弹框
    caseText: '二手房',   //类型text
    fromIndexPage: false, //是否从首页跳转过来
  },

  /**
   * 搜索框输入事件
   */
  searchInputEvent(e) {
    var that = this;
    var val = e.detail.value;
    var url = this.data.getBuildByKeyWordUrl;
    var caseType = this.data.caseType;
    var params = {
      caseType: caseType,
      cityId: that.data.cityId,
      keyWord: val,
      pageNum: 1,
      pageSize: 10
    };
    this.setData({
      inputText: val
    });
    api.getList(url, params).then(res => {
      var searchBuildList = res.DATA.list;
      that.setData({
        searchBuildList
      });
    });
  },

  /**
   * 点击联想的楼盘名
   */
  clickWord(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var buildId = item.buildId;
    var word = item.buildName;
    //历史记录存缓存
    var history = wx.getStorageSync('searchHistory' + that.data.caseType) || [];
    //历史记录去重
    for (var i = 0; i < history.length; i++) {
      if (history[i].text == word) {
        history.splice(i, 1);
        break;
      };
    };
    history.unshift({
      text: item.buildName,
      type: '小区',
      buildId: buildId
    });
    if (history.length > 10) {
      history.pop();
    };
    this.setData({
      searchHistory: history
    });
    wx.setStorageSync('searchHistory' + that.data.caseType, history);

    that.goToPageByResource(item.buildName,buildId);
  },

  /**
   * 点击清除历史记录
   */
  deleteHistory() {
    var that = this;
    this.setData({
      searchHistory: []
    });
    wx.setStorageSync('searchHistory' + that.data.caseType, []);
  },

  /**
   * 点击历史记录标签
   */
  clickHistoryWord(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var buildId = item.buildId;
    var index = e.currentTarget.dataset.index;
    var history = this.data.searchHistory;
    history.splice(index, 1);
    history.unshift({
      text: item.text,
      type: item.type,
      buildId: item.buildId
    });
    this.setData({
      searchHistory: history
    });
    wx.setStorageSync('searchHistory' + that.data.caseType, history);
    if(item.type == '小区'){
      that.goToPageByResource(item.text, buildId);
    }else{
      that.goToPageByResource(item.text);
    };
  },

  /**
   * 点击搜索按钮
   */
  searchMyWord() {
    var that = this;
    var word = this.data.inputText;
    //历史记录存缓存
    if (word) {
      var history = wx.getStorageSync('searchHistory' + that.data.caseType) || [];
      //历史记录去重
      for(var i=0;i<history.length;i++){
        if(history[i].text == word){
          history.splice(i,1);
          break;
        };
      };
      history.unshift({
        text: word,
        type: '关键字'
      });
      if(history.length>10){
        history.pop();
      };
      this.setData({
        searchHistory: history
      });
      wx.setStorageSync('searchHistory' + that.data.caseType, history);
    };

    that.goToPageByResource(word);
  },

  /**
   * 根据页面来源决定返回的方式
   */
  goToPageByResource(word,buildId){
    var that = this;
    var caseType = this.data.caseType;
    if (that.data.fromIndexPage) {
      if (caseType == 1) {
        if(!!buildId){
          app.globalData.searchBuildId = buildId;
        };
        wx.navigateTo({
          url: '../list/list?word=' + word
        });
      } else if (caseType == 2) {
        if (!!buildId) {
          app.globalData.searchBuildId = buildId;
        };
        wx.navigateTo({
          url: '../leaseList/leaseList?word=' + word
        });
      } else if (caseType == 4) {
        wx.navigateTo({
          url: '../newHouseList/newHouseList?word=' + word
        });
      } else if (caseType == 5) {
        wx.navigateTo({
          url: '../apartmentList/list?word=' + word
        });
      }
    } else {
      if (!!buildId) {
        app.globalData.searchBuildId = buildId;
      };
      app.globalData.searchText = word;
      wx.navigateBack({
        delta: 1
      });
    };
  },

  /**
   * 点击房源类型
   */
  caseBoxToggle(){
    this.setData({
      caseBox: true
    });
  },

  /**
   * 选择房源类型
   */
  chooseCaseType(e){
    var text = e.currentTarget.dataset.text;
    var type = e.currentTarget.dataset.type;
    var history = wx.getStorageSync('searchHistory' + type) || [];
    this.setData({
      caseType: type,         
      caseBox: false,     
      caseText: text,
      searchHistory: history
    });
  },

  /**
   * 点击蒙层关闭弹框
   */
  closeCaseBox(){
    this.setData({
      caseBox: false
    });
  },

  /**
   * 点击搜索页的搜索框的叉
   */
  clearword() {
    this.setData({
      inputText: '',
      searchBuildList: []
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var curCityId = wx.getStorageSync('cityId');
    //更新城市
    that.setData({
      cityId: curCityId
    });
    var fromIndex = options.fromindex;
    var caseType = options.casetype || that.data.caseType;
    var history = wx.getStorageSync('searchHistory' + caseType) || [];
    if (fromIndex){
      this.setData({
        fromIndexPage: true,
        searchHistory: history
      });
    }else{
      this.setData({
        caseType: caseType,
        searchHistory: history
      });
    };
    
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