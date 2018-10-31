var app = getApp();
var _im = require('../../utils/_im.js');

Page({
  data: {
    animationData: {},
    showFlas: true,
    offFlag: false,
    caseId: 0,
    caseType: 1,
    cityId: null,
    reSource: 1,
    picUrl: [],//房源图片数组
    videoUrlPath: '',//视频地址
    videoTopPicUrlPath: '',//视频预览图片地址,
    houseSubject: '',
    tagArr: [],//房源标签
    isCollected: 0,//收藏五角星的显示状态，1是收藏，0是未收藏
    agentCont: false,//控制咨询经纪人显示
    allAgentCont: false,//控制群发委托显示
    yezhuCont: false,//控制咨询业主显示
    hezu: false,
    indicatorDots: false,//swiper是否显示面板指示点
    autoplay: false,//自动切换
    loadingFlag: true,
    apartmentData:"",//公寓详情数据
    apartmentUuid: "", 
    rentType:"",//整租，合租
    numShows:true,//控制banner数量显示
    Uuid:"",
    userId:'',
    interval: 5000,
    duration: 500,
    currentPic: 1,
    totalPics: 0,
    buildPositionx: 0,
    buildPositiony: 0,
    buildName:'',//公寓名称
    panoramaMap: 0,
    vrUrl: '',
    videoPhoto: 'btn-video',
    picFlag: false,
    trueFlag: 0,
    imgLists: [],//轮播图路径
    totalImg: 0,//轮播图总张数
    sealedHouse: false,//房源下架弹框控制显示
    toastMask: false,//弹框外层
    guideToast: false,//引导弹框
    leadToast: true,//引导弹框显示控制
    detailBoxWidth:"",//房间图片长图盒子长度
    map: {
      lat: 0,
      lng: 0,
      markers: [],
      hasMarkers: false
    },
    mapIcon: [
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/transport.png",
        txt: "公交",
        typeId: "bus"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/subway.png",
        txt: "地铁",
        typeId: "subway"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/school.png",
        txt: "学校",
        typeId: "school"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/hospital.png",
        txt: "医院",
        typeId: "hospital"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/bank.png",
        txt: "银行",
        typeId: "bank"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/leisure.png",
        txt: "休闲娱乐",
        typeId: "leisure"
      },
      {
        iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/shopping.png",
        txt: "购物",
        typeId: "shopping"
      },
    ],
    closeCont: false,//小区信息展开控制
    houseShowTitle: true, //小区信息查看更多文章更换
    closepic: false,
    footerShow: false,
    videoShowLater: false,
    boxShow: true,//外层盒子
    shareUrl: '',
    showmor: true,
    showtitle: true,
    showmorZb: true,//周边信息
    showtitleZb: true,//周边信息
    zbShowTitle: true, //周边信息查看更多文章更换
    zbClosepic: false,//周边
    lookMoreHide: true,//查看更多隐藏
    lookMoreZbHide: true,//周边查看更多隐藏
    wHeight: '',//屏幕高度
    toView: 'aaa',
    scrollTop: 100,
    morejt: 'http://cdn.haofang.net/static/uuminiapp/detail/arrow_down.png',
    btnHiden: true,
    currUserMobile: '',
    currUserName: '',
    currUserPhotoUrlPath: 'http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png',
    setting: [],
    archiveId: '',
    unfoldStatus:false,//下拉展开
    unfoldJtstatus:true,//展开箭头状态
    roomData:[],//房间数据
    lazyLoad:true,
    typeList: {
      '公交': { typeId: 'bus', typeName: '公交' },
      '地铁': { typeId: 'subway', typeName: '地铁' },
      '学校': { typeId: 'school', typeName: '学校' },
      '医院': { typeId: 'hospital', typeName: '医院' },
      '银行': { typeId: 'bank', typeName: '银行' },
      '休闲娱乐': { typeId: 'leisure', typeName: '休闲娱乐' },
      '购物': { typeId: 'shopping', typeName: '购物' },
      '餐饮': { typeId: 'food', typeName: '餐饮' },
      '运动健身': { typeId: 'sports', typeName: '运动健身' },
    },
    backToIndexBtn:false, //是否展示 返回首页按钮
    unreadNum: 0,
  },
  videoPhotoChange: function (e) {
    var currentBtn = this.data.videoPhoto == 'btn-video' ? 'btn-photo' : 'btn-video';
    var picFlag = this.data.picFlag ? false : true;
    this.setData({
      videoPhoto: currentBtn,
      picFlag: picFlag
    });
  },
  onLoad: function (options) {
    var _this = this;
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    //获取当前页面层级
    var getCurrentPagesLength = getCurrentPages().length;
    if (getCurrentPagesLength == 1) {
      //分享出来页面右下角都要显示
      _this.setData({ backToIndexBtn: true });
    }
    var userId = wx.getStorageSync("userId");
    if (options.rentType ==1){
      _this.setData({
        apartmentUuid: options.apartmentUuid,
        roomUuid: "",
        userId: userId
      })
    }else{
      _this.setData({
        apartmentUuid: options.apartmentUuid,
        roomUuid: options.roomUuid,
        userId: userId
      })
    }
    if (isIphoneX){
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            wHeight: res.windowHeight - 78
          })
        }
      })
    }else{
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            wHeight: res.windowHeight - 50
          })
        }
      })
    }
    this.initData();

    _im.initIm();
    this.initUnreadNum();
  },
  /*初始化页面数据*/
  initData: function () {
    var that = this;
    // var info = that.data;
    
    wx.request({
      url: app.buildRequestUrl('apartmentDetailUrl') + "?apartmentUuid=" + that.data.apartmentUuid + "&roomUuid=" + that.data.roomUuid + "&userId=" + that.data.userId,
      success: function (res) {
        if(!!res){
            if(!!res.data){
              var _data = res.data.DATA;
              var _tagArr = (_data.tags).split(",");
              var _uId = "";
              var _isCollected = _data.isCollected;

              that.setData({
                tagArr: _tagArr,
                rentType: _data.rentType,
                isCollected: _isCollected,
                buildPositionx: _data.yCoord,
                buildPositiony: _data.xCoord,
                buildName: _data.aptBuildName,
              })
              var _imgpiclength = _data.apartmentPhotoList.length;
              if (!!_data.apartmentRoomList){
                var roomDatas = _data.apartmentRoomList;
                var imgArrLength = [];
                for (var i = 0; i < roomDatas.length;i++){
                  roomDatas[i].tags = roomDatas[i].tags.split(",");
                  imgArrLength.push(((roomDatas[i].roomPhotoList.length) * 101 + ((roomDatas[i].roomPhotoList.length) - 1) * 10) - 10);
                }
              }
              if (!_data.houseDesc || _data.houseDesc.length< 150){
                that.setData({
                  lookMoreHide:false
                })
              }
              if (_data.rentType == 1) {
                _uId = _data.uuid
              } else {
                _uId = roomDatas[0].uuid
              }
              // var detailBox = ((_this.data.detailImgUrl.length) * 101 + ((_this.data.detailImgUrl.length) - 1) * 10) - 10;
              // _this.setData({
              //   detailBoxWidth: detailBox
              // })
              that.setData({
                apartmentData:_data,
                roomData: roomDatas,
                detailBoxWidth: imgArrLength,
                totalImg: _imgpiclength,
                Uuid: _uId
              })
            }else{
              console.log("返回数据问题！")
            }
        }else{
          console.log("请求数据失败！")
        }
      },
      fail: function () {
        //该房源已下架
        //alert('该房源已下架');
        //  wx.navigateBack({
        //      delta: 1,
        //  })
      }, complete: function () {
        that.setData({ loadingFlag: false });
      }
    })
  },
  onShareAppMessage: function () {

  },
  onReady: function () {
    // 页面渲染完成
  },
  /*vr点击跳转*/
  vrBtnTo: function () {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  errImg: function (ev) {
    //需要访问当前页面的数据对象传递到其它页面上
    var _that = this;
    common.errImgFun(ev, _that, 'avatar');
  },
  changePic: function (e) {
    var current = e.detail.current;
    this.setData({
      currentPic: current + 1
    });
  },
  /**
   * 播放视频
   */
  playVideo: function () {
    var that = this;
    that.setData({
      videoShow: true,
      boxShow: false
    })
    setTimeout(function () {//视频延迟加载
      that.setData({
        videoShowLater: true,
      })
    }, 500)
  },
  closeBtn: function () {//关闭视频
    this.setData({
      videoShow: false,
      boxShow: true
    })
  },
  moreBtn: function () {//点击查看更多
    var that = this,
      showss = !that.data.showmor,
      showtt = !that.data.showtitle,
      closess = !that.data.closepic;
    that.setData({
      showmor: showss,
      showtitle: showtt,
      closepic: closess
      // btnHiden:false
    })
  },

  closeBtn: function () {//关闭视频
    this.setData({
      videoShow: false,
      boxShow: true
    })
  },
  moreBtn: function () {//点击查看更多
    var that = this,
      showss = !that.data.showmor,
      showtt = !that.data.showtitle,
      closess = !that.data.closepic;
    that.setData({
      showmor: showss,
      showtitle: showtt,
      closepic: closess
      // btnHiden:false
    })
  },
  moreZbBtn: function () {//周边信息点击查看更多
    var that = this,
      zbShowss = !that.data.showmorZb,
      zbShowtt = !that.data.showtitleZb,
      zbClosess = !that.data.zbClosepic;
    that.setData({
      showmorZb: zbShowss,
      showtitleZb: zbShowtt,
      zbClosepic: zbClosess
      // btnHiden:false
    })
  },
  /*
  *小区信息查看更多
  */
  houseMoreBtn: function () {
    var that = this,
      houseshowtt = !that.data.houseShowTitle,
      closess = !that.data.closeCont;
    that.setData({
      houseShowTitle: houseshowtt,
      closeCont: closess
    })
  },
  /*
  *五角星收藏控制
  */
  aptStarBtn: function () {
    //登录验证
    let checkLoginFlag = app.checkLogin();
    if(!checkLoginFlag){return;}

    var that = this;
    var url='';
    if(that.data.rentType==1){
      url=app.buildRequestUrl('collectApartment') + "?uuid=" + that.data.Uuid + "&youyouUserId=" + that.data.userId + "&rentType=" + that.data.rentType
    }else{
      url=app.buildRequestUrl('collectApartment') + "?uuid=" + that.data.roomUuid + "&youyouUserId=" + that.data.userId + "&rentType=" + that.data.rentType
    }
      wx.request({
        url: url,
        success: function (res) {
          wx.showToast({
            title: res.data.INFO,
            icon: '',
            duration: 2000
          })
          var status = res.data.STATUS;
          if (status == 1) {
            if (res.data.DATA.collect == 1){
              that.setData({
                isCollected: 1
              });
            }else{
              that.setData({
                isCollected: 0
              })
            };
          }
        }
      });
  },
  /** 
   * 图片全屏预览
   */
  getImageInfo: function (e) {
    var that = this;
    var currentImage = e.currentTarget.dataset.image;
    var imgList=that.data.apartmentData.apartmentPhotoList;
    var imageArr=[];
    for(var i=0;i<imgList.length;i++){
      imageArr.push(imgList[i].photoAddr)
    }
    wx.previewImage({
      current: currentImage,// 当前显示图片的http链接
      urls: imageArr // 需要预览的图片http链接列表
    })
  },

  /**
   * 调整地图页
   */
  goToMap(e) {
    var lat = e.currentTarget.dataset.lat;
    var lng = e.currentTarget.dataset.lng;
    var type = e.currentTarget.dataset.type;
    var buildname = e.currentTarget.dataset.buildname;
    if (!!type) {
      wx.navigateTo({
        url: "/packageTool/pages/map/map?lat=" + lat + "&long=" + lng + "&type=" + type + '&buildname=' + buildname
      });
    } else {
      wx.navigateTo({
        url: "/packageTool/pages/map/map?lat=" + lat + "&long=" + lng + '&buildname=' + buildname
      });
    }
  },
  dealData: function (info, item, setValue) {
    var v = info[item];
    if (setValue !== undefined) {
      var json = {};
      json[item] = setValue;
      this.setData(json);
    } else if (v !== undefined) {
      var json = {};
      json[item] = v;
      this.setData(json);
    }
  }
  , dial: function (e) {//拨打电话
    //        this.setData({
    //          toastMask: true,
    //          sealedHouse: false,
    //          guideToast: true,
    //          leadToast: false,
    //        })
    this.setData({
      toastMask: false,
      guideToast: false
    });
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    });
  },
  houseDetail: function (e) {//跳转到其他房源详情页
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /** 
   * 弹框蒙层点击隐藏
   */
  maskHideBtn: function () {
    this.setData({
      toastMask: false
    })
  }, 
  /** 
  * 拨打电话点击
  */
  callBtn: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  downBtn: function (e) {
    this.setData({
      toastMask: true,
      toView: "lead-down",
      sealedHouse: false,
      guideToast: false,
      leadToast: true,
    })
  },
  chooseContactType: function () {
    this.setData({
      toastMask: true,
      guideToast: true
    });
  },
  /*引导下载板块点击*/
  goToDownLoad: function () {
    wx.navigateTo({
      url: "/packageWeb/pages/download/download",
    })
  },
  /*展开*/
  unfoldBoxBtn:function(e){
    //如果 已出租则不能展开
    let isRent = e.currentTarget.dataset.isrent;
    if (!!isRent && isRent == 1) {return;}

    var currIndex =  e.currentTarget.dataset.idx;
    
      var _this = this;
      // var _status = !_this.data.unfoldStatus,
      //     jtStatus = !_this.data.unfoldJtstatus;
      var unfoldStatus = _this.data.unfoldStatus;
      if (currIndex == unfoldStatus){
        if (unfoldStatus == -1){
          _this.setData({
            numShows: true,
            unfoldStatus: currIndex,
            unfoldJtstatus: currIndex
          })
        }else{
          _this.setData({
            numShows: true,
            unfoldStatus: -1,
            unfoldJtstatus: -1
          })
        }
        
      }else{
        _this.setData({
          numShows: true,
          unfoldStatus: currIndex,
          unfoldJtstatus: currIndex
        })
      }
  },
  /** 
  * 点击预约看房
  */
  lookHouseBtn:function(){
    this.setData({
      toastMask: true,
    })
  },
  /** 
  * 点击关闭
  */
  orderClose:function(){
    this.setData({
      toastMask: false
    })
  },
  /**
     *tab导航点击 
     */
  tabBtnCheck(e) {
    var that = this;
    var _t = e.currentTarget.dataset.shows;
    if (_t == 's') {
      that.setData({
        showFlas: false,
        offFlag: true,
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
      })
      this.animation = animation

      animation.translateX(-195).step();

      this.setData({
        animationData: animation.export()
      })
    } else {
      that.setData({
        showFlas: true,
        offFlag: false,
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
      })
      this.animation = animation

      animation.translateX(0).step();

      this.setData({
        animationData: animation.export()
      })
    }

  },
  /**
   *点击导航遮罩层 
   */
  offToast: function () {
    var that = this;
    that.setData({
      showFlas: true,
      offFlag: false,
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    })
    this.animation = animation

    animation.translateX(0).step();

    this.setData({
      animationData: animation.export()
    })
  },
  /**
   * 返回首页按钮
   */
  backToIndex:function(){
    wx.reLaunch({
              url: "/pages/real_index/index"
    });
  },
  /**
   * 房间查看大图
   */
  roomBigImg:function(e){
    var _this=this,data=_this.data;
    var index=e.currentTarget.dataset.index;
    var img=e.currentTarget.dataset.img;
    var imgaArr=[];
    for(var i=0;i<data.roomData[index].roomPhotoList.length;i++){
      imgaArr.push(data.roomData[index].roomPhotoList[i].photoAddr);
    }
    wx.previewImage({
      current: img,// 当前显示图片的http链接
      urls: imgaArr // 需要预览的图片http链接列表
    })
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