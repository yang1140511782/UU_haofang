const app = new getApp();
import { Tools } from '../../../utils/tools';
const tool = new Tools();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,  //tab序号
    tabList: [],  //tab渲染数组
    bigPicBox: false,   //大图盒子
    currentSrcArr: [],    //当前浏览的图片数组
    swiperIndex: -1,      //当前轮播图序号
    allHouseTypeUrl: app.buildRequestUrl('allHouseType'),    //数据接口
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var buildId = options.buildid;
    var that = this;

    //请求户型数据
    wx.request({
      url: that.data.allHouseTypeUrl,
      data: {
        buildId: buildId
      },
      success: function (res) {
        if (res.statusCode == 200){
          if(!res.data.DATA)return;
          //生成tab渲染数组
          var arr = res.data.DATA.list;
          var tabList = [];
          var tabObj = {};
          var totalNum = arr.length;
          var allImgArr = [];
          arr.map(function (ele, i) {
            var rooms = ele['rooms'];
            allImgArr.push(tool.addImgParamCrop(ele['layoutPic1'],180,120));
            if (tabObj[rooms]) {
              tabObj[rooms]['num']++;
              tabObj[rooms]['all'].push(ele);
              tabObj[rooms]['imgArr'].push(tool.addImgParamCrop(ele['layoutPic1'],180,120));
            } else {
              tabObj[rooms] = {};
              tabObj[rooms]['num'] = 1;
              tabObj[rooms]['all'] = [];
              tabObj[rooms]['imgArr'] = [];
              tabObj[rooms]['all'].push(ele);
              tabObj[rooms]['imgArr'].push(tool.addImgParamCrop(ele['layoutPic1'],180,120));
            };
          });
          for (var i in tabObj) {
            var obj = {};
            obj['index'] = i;
            obj['text'] = i + '居';
            obj['num'] = tabObj[i]['num'];
            obj['all'] = tabObj[i]['all'];
            obj['imgArr'] = tabObj[i]['imgArr'];
            tabList.push(obj);
          };
          //按房间数降序排列
          tabList.sort(function (x, y) {
            return y.index - x.index;
          });
          var arrData = JSON.parse(JSON.stringify(arr));
          var allObj = {
            text: '全部',
            num: totalNum,
            all: arr,
            imgArr: allImgArr
          };
          tabList.unshift(allObj);
          that.setData({
            tabList,
            currentSrcArr: arrData
          });

        };
      }
    })
  },

  /**
   * 点击tab
   */
  tabClick(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    });
  },

  /**
   * 图片加载失败
   */
  imgloadFail(e){
    var defaultImg = 'http://cdn.haofang.net/static/uuminiapp/default/detail_deafault.png';
    
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    var arr = this.data.tabList;
    arr[i]['all'][j]['layoutPic1'] = defaultImg;
    arr[i]['imgArr'][j] = defaultImg;
    this.setData({
      tabList: arr
    });
  },

  /**
   * 点击图片看大图
   */
  lookBigPic(e){
    var mine = e.currentTarget.dataset.mine;
    var myId = mine.layoutId;
    var all = this.data.currentSrcArr;
    var index = -1;
    for(var i=0;i<all.length;i++){
      if (all[i].layoutId == myId){
        index = i;
        break;
      };
    }
    this.setData({
      bigPicBox: true,
      swiperIndex: index
    });
    // wx.previewImage({
    //   current: imgSrc,
    //   urls: imgArr
    // });
  },

  /**
   * 点击放大图蒙层,关闭放大图
   */
  closeBigPicBox(){
    this.setData({
      bigPicBox: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  prevent(){

  },

  /**
   * 滑动轮播图时,记录轮播图的index
   */
  getSwiperIndex(e){
    var index = e.detail.current;
    this.setData({
      swiperIndex: index
    });
  },

  /**
   * 房贷计算器
   */
  calPrice(){
    var index = this.data.swiperIndex;
    var price = parseInt(this.data.currentSrcArr[index].price) || 100;
    wx.navigateTo({
      url: '/packageTool/pages/calc/calc?price=' + price
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