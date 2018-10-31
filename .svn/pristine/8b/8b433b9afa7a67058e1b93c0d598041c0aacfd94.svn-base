Page({
  data: {
    picUrl: [],
    autoplay: false,//自动切换
    interval: 5000,
    duration: 500,
    currentPic: 1,
    totalPics: 0,
    videoPhoto: 'btn-video',
    picFlag: false,
    imgLists: [],//轮播图路径
    totalImg: 0,//轮播图总张数
    mapImgUrl: '',
    closepic: false,
    preLoading: false,
    picLoading: false,
    footerShow: false,
    videoShow: false,
    videoShowLater: false,
    boxShow: true,//外层盒子
    shareUrl: '',
    showmor: true,
    showtitle: true,
    btnHiden: true
  },
  videoPhotoChange: function (e) {
    var currentBtn = this.data.videoPhoto == 'btn-video' ? 'btn-photo' : 'btn-video';
    var picFlag = this.data.picFlag ? false : true;
    this.setData({
      videoPhoto: currentBtn,
      picFlag: picFlag
    });
    console.log(e);
  },
  onLoad: function (options) {
    console.log(options)
    app.WeToast();
    //加载loading
    // wx.showLoading({
    // title: '加载中',
    // });
    // 页面初始化 options为页面跳转所带来的参数
    if (options) {
      if (caseType == 1) {
        var requestUrl = app.globalData.online + app.globalData.ajaxDetail;
      } else {
        var requestUrl = app.globalData.online + app.globalData.ajaxDetail;
      }
      var that = this;
      console.log(requestUrl)
      wx.request({
        url: requestUrl,

        data: {
          cityId: cityId,
          caseType: caseType,
          caseId: caseId,
          openId: app.globalData.openid
        },
        success: function (res) {
          console.log(res.data)
          if (!!res.data) {
            var data = res.data;
          } else {
            return;
          }
          /******************图片数据*****************/
          var imgLists = res.data.imgLists;

          console.log(imgLists)
          if (data.hasVideo) {
            var totalImg = imgLists.length + parseInt(data.videoNum);
          } else {
            var totalImg = imgLists.length;
          }
          /***********************设置房源数据*********************/

          that.setData({
            loading: false,
            houseData: res.data,
            hcontent: res.data.houseCharact,//.replace(/\<br\>/g, '\\n'),
            //brokerInfo: data.shareArchiveData.length ? data.shareArchiveData : data.brokerInfo,
            imgLists: imgLists,
            totalImg: totalImg,
            caseType: caseType,
            saleOrLease: caseType == 1 ? 'sale' : 'lease',
            collectIcon: res.data.hasCollect == true ? that.data.collectYes : that.data.collectNo,
            isGuanzhu: res.data.hasAttention ? 1 : 0,
            guanZhuText: res.data.hasAttention == true ? that.data.guanZhuTextin : that.data.guanZhuTextno
          });

          if (that.data.hcontent != undefined) {
            if (that.data.hcontent.length < 120) {
              that.setData({
                btnHiden: false
              })
            }
          }

          var mapImgUrl = "https://apis.map.qq.com/ws/staticmap/v2/"
            + "?center=" + data.buildPositionx + "," + data.buildPositiony
            + "&zoom=16"
            + "&markers=icon:https://cd.haofang.net/Public/images/wap/icon_mylocation.png|" + data.buildPositionx + "," + data.buildPositiony
            + "&labels=border:1|size:12|color:0x000000|bgcolor:0x2fe40000|anchor:3|offset:0_-5|" + data.buildName + "|" + data.buildPositionx + "," + data.buildPositiony
            + "&key=DGFBZ-3IFW2-PDEUL-CBLCE-XOSYK-K5B5I"
            + "&size=360*240";
          /****************************地图数据*****************************/
          that.setData({
            mapImgUrl: mapImgUrl,
            preLoading: true,
            picLoading: false,
            footerShow: true,
          });
          //经纪人头像默认
          if (that.data.brokerInfo.currUserPhotoUrlPath == undefined) {
            that.setData({
              'brokerInfo.currUserPhotoUrlPath': 'www.baidu.com/1.jpg'
            });
          }
          var charact = that.data.houseData.houseCharact;
          //console.log(charact)
          WxParse.wxParse('article', 'html', charact, that, 5);
          //分享链接
          var shareUrl = "/pages/detail/detail?case_id=" + that.data.houseData.houseId + "&caseType=" + that.data.houseData.caseType + "&cityId=" + that.data.houseData.cityId + "&reSource=1";
          that.setData({
            shareUrl: shareUrl
          });
          //隐藏加载
          wx.hideLoading();
        },
        fail: function (fail) {
          console.log(fail);
        }
      })
    }
  },
  onShareAppMessage: function () {

  },
  onReady: function () {
    // 页面渲染完成
    var totalNums = this.data.picUrl.length + 1;
    this.setData({
      totalImg: totalNums
    })

  },
  /*vr点击跳转*/
  vrBtnTo: function () {
    var that = this;
    var _url = this.data.houseData.panoramaPicsUrlPath;
    if (!_url) { return; }
    _url = 'https://pano.haofang.net/' + _url;
    console.log(_url)
    // 页面渲染完成
    wx.setStorage({
      key: "vrUrl",
      data: _url
    });
    wx.navigateTo({
      url: '/pages/vrVideo/vrVideo',
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
    console.log(ev);
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
   * 图片全屏预览
   */
  getImageInfo: function (e) {
    var that = this
    console.log(e)
    var currentImage = e.currentTarget.dataset.image;

    var imageArr = that.data.imgLists;

    console.log(imageArr)
    wx.previewImage({
      current: currentImage,// 当前显示图片的http链接
      urls: imageArr // 需要预览的图片http链接列表
    })
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

})