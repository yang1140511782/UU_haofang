//index.js
//获取应用实例
let app = getApp();

Page({
  data: {
   imgUrls:[],
   buildPositionx:'21.97608',
   buildPositiony:'100.454967',
   buildName:'勐巴拉国际旅游度假区',
   houseData:[],//房源数据
   collectTxt:'收藏',//收藏
   collectFlag:'',//收藏标识
   loadingFlag:true,
   introduceSwiperTotal:'',//小区介绍length
   introduceCurrentPic:1,
   layoutSwiperIndex:1,
   layoutSwiperActiveIndex:0,//户型活动index
  },
  onLoad: function (options) {
    var _this=this;
    var cityId,buildId;
    cityId=options.cityId?options.cityId:'296';
    buildId=options.buildId?options.buildId:'2054467';
    wx.request({
          url: app.buildRequestUrl('getTourismBuildInfo'),
          data:{
            cityId:cityId,
            buildId:buildId,
            userId:app.globalData.userId
          },
          success: function (res) {
              var status = res.data.STATUS;
              //如果当前返回数据为空,跳转至新房详情页
              if(status != 1){
                  wx.redirectTo({
                    url: '/pages/newHouseDetail/newHouseDetail?buildid=' + buildId,
                  });
                  return;
              }
              _this.setData({
                houseData:res.data.DATA,
                buildPositionx:res.data.DATA.lat,
                buildPositiony:res.data.DATA.lng,
              });
              //初始化收藏
              if(res.data.DATA.isCollect==0){
                _this.setData({
                  collectTxt:'收藏',
                  collectFlag:false,
                })
              }else{
                _this.setData({
                  collectTxt:'已收藏',
                  collectFlag:true,
                })
              };
            // 小区介绍swiper的长度
            _this.setData({
              introduceSwiperTotal:_this.data.houseData.introducePicList.length
            });
            _this.setData({ loadingFlag: false });

          },
          fail: function(){
            _this.setData({ loadingFlag: false });
          }
      })
  },
  /**
   * 收藏操作
   */
  collectEvent:function(e){
    var _this=this;
    wx.request({
      url:app.buildRequestUrl('addOrDeleteCollectUrl'),
      data:{
        caseId:_this.data.houseData.buildId,
        caseType:'9',
        cityId:_this.data.houseData.cityId,
        reSource:'9',
        userId:app.globalData.userId
      },
      success:function(res){
        if(res.data.STATUS==1){
          if(res.data.DATA.collect==1){
            _this.setData({
              collectFlag:true,
              collectTxt:'已收藏',
            })
          }else{
            _this.setData({
              collectFlag:false,
              collectTxt:'收藏',
            });
          }
        }else{
          wx.showToast({ title: res.data.INFO, icon: 'none', duration: 1000 });
        }
      }
    })
  },
  /**
   * 拨打电话
   */
  callEvent:function(e){
    var _this=this;
    console.log(e)
    var phoneNumbe=e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: phoneNumbe
    })
  },
  /**
   * 小区介绍swiper
   */
  introduceSwiperEvent:function(e){
    var _this=this;
    var current = e.detail.current;
    this.setData({
      introduceCurrentPic: current + 1
    });
  },
  /**
   * 户型swiper
   */
  layoutSwiperChange:function(e){
    var _this =this;
    var current = e.detail.current;
    this.setData({
      layoutSwiperIndex: current + 1,
      layoutSwiperActiveIndex:current
    });
  },
  /**
   * 指向swiper
   */
  layoutSwiperTo:function(e){
    var _this=this;
    var index=e.currentTarget.dataset.index;
    _this.setData({
      layoutSwiperActiveIndex:index-1
    })
  }
})
