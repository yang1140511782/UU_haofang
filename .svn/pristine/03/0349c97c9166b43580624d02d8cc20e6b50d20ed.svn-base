const app = new getApp();
import { Tools } from '../../../utils/tools';
const tool = new Tools();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    totalImgArr: [],    //总的图片数组
    bigPicBox: false,   //大图盒子
    swiperIndex: -1,    //当前轮播图序号
    imgNumArr: [],      //每个组图片个数的数组
    arrIndex: -1,       //当前高亮的组
    toView: '',         //scroll-view
    houseGalleryUrl: app.buildRequestUrl('houseGallery'),    //数据接口
  },

  /**
   * 由arr,i,j来确定该图片在总图库中的序号
   * i-该组的序号, j-该图在该组中的序号, arr-每个组图片个数的数组
   * eg. [3,11,5,6] i=3 j=2 -> totalIndex=16
   */
  getTotalIndex(i,j,arr){
    var n=0;
    if(i==0){
      n = j;
    }else{
      for(var k=0;k<i;k++){
        n+=arr[k];
      };
      n+=j;
    }
    return n;
  },

  /**
   * 由arr,index来确定该图片所在组的序号
   * index-总图库中的序号, arr-每个组图片个数的数组
   */
  getArrIndex(index, arr) {
    var n = 0;
    for (var i = 0; i < arr.length; i++) {
        n += arr[i];
        if (index<n){
          return i;
        };
    };
    
  },

  /**
   * 点击图片看大图
   */
  lookBigPic(e) {
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    var arr = this.data.imgNumArr;
    console.log(i,j,arr)
    //获取图片在图库中序号
    var index = this.getTotalIndex(i,j,arr);
    var toView = 'btn'+i;
    this.setData({
      bigPicBox: true,
      swiperIndex: index,
      arrIndex: i,
      toView
    });
  },

  /**
   * 点击放大图蒙层,关闭放大图
   */
  closeBigPicBox() {
    this.setData({
      bigPicBox: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  prevent() {

  },

  /**
   * 滑动轮播图时,记录轮播图的index
   */
  getSwiperIndex(e) {
    var arr = this.data.imgNumArr;
    var index = e.detail.current;
    var i = this.getArrIndex(index,arr);
    var toView = 'btn' + i;
    this.setData({
      swiperIndex: index,
      arrIndex: i,
      toView
    });
  },

  /**
   * 轮播图,点击图片种类
   */
  chooseType(e){
    var index = 0;
    var i = e.currentTarget.dataset.i;
    var arr = this.data.imgNumArr;
    if(i==0){
      index = 0;
    }else{
      for (var k = 0; k < i;k++){
        index+=arr[k];
      }
    }
    this.setData({
      swiperIndex: index,
      arrIndex: i
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var buildId = options.buildid;
    var that = this;
    //请求图库数据
    wx.request({
      url: that.data.houseGalleryUrl,
      data: {
        buildId
      },
      success: function (res) {
        if(res.statusCode!=200)return;
        if(!res.data.DATA.list)return;
        var list = res.data.DATA.list;
        //渲染数组
        var arr = [];
        //总图库数组
        var totalImgArr = [];
        //每个组图片个数的数组
        var imgNumArr = [];
        
        list.map(function(ele, i){
        	for(var j=0;j<ele.photoList.length;j++){
        		ele.photoList[j]['photoAddr'] = tool.addImgParamCrop(ele.photoList[j]['photoAddr'],640,480);
        	}
          arr.push(ele);
          imgNumArr.push(parseInt(ele['typeCount']));
          var curPicArr = ele['photoList'];
          for (var i = 0; i < curPicArr.length;i++){
            totalImgArr.push(curPicArr[i]['photoAddr']);
          };
        });

        that.setData({
          datalist: arr,
          totalImgArr,
          imgNumArr
        });
      }
    })
  },

  /**
   * 图片加载失败
   */
  imgloadFail(e) {
    var defaultImg = 'https://weidian.haofang.net/Public/web/default/images/datil-banner-bg.gif';
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    var arr = this.data.datalist;
    arr[i]['photoList'][j]['photoAddr'] = defaultImg;
    this.setData({
      datalist: arr
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