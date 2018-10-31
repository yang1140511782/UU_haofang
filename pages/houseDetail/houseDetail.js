var app = getApp()
var api = require('../../utils/common.js')
var _im = require('../../utils/_im.js')
import { Tools } from '../../utils/tools'
import { BehaviorTools } from '../../utils/behaviorTools'
const tool = new Tools()
const behaviorTool = new BehaviorTools();

var myJson = {}
Page({
  data: {
    shareInfoFlag: false, // 经纪人个人微店 进入及掌通分享:新房显示
    animationData: {},
    showFlas: true,
    offFlag: false,
    toastHide: true,
    isShield: 0, // 是否已经屏蔽该经纪人（1是0否）
    caseId: 0,
    caseType: 1,
    cityId: null,
    reSource: 1,
    fromDetail: '',
    picUrl: [], // 房源图片数组
    videoUrlPath: '', // 视频地址
    videoTopPicUrlPath: '', // 视频预览图片地址,
    houseSubject: '',
    tagArr: [], // 房源标签
    isCollected: 0, // 收藏五角星的显示状态，1是收藏，0是未收藏
    agentCont: false, // 控制咨询经纪人显示
    advisoryArchive:true,
    allAgentCont: false, // 控制群发委托显示
    yezhuCont: false, // 控制咨询业主显示
    hezu: false,
    indicatorDots: false, // swiper是否显示面板指示点
    autoplay: false, // 自动切换
    loadingFlag: true,
    interval: 5000,
    duration: 500,
    currentPic: 1,
    totalPics: 0,
    imId: '',
    houseSubject: '',
    houseTotalPrice: '',
    houseUnitPrice: '',
    priceUnitCn: '',
    priceUnit: '',
    houseUseage: '',
    houseUseageCn: '',
    totalPrice: '',
    houseArea: '',
    houseRoom: '0',
    houseHall: '0',
    houseWei: '0',
    buildType: '--',
    houseFitment: '',
    houseFitmentCn: '--',
    houseDirectCn: '--',
    houseYear: '--',
    houseFloor: '--',
    houseFloors: '--',
    buildName: '',
    rightYears: '--',
    costStandard: '--',
    projectGreen: '--',
    projectSpace: '--',
    submitDate: '--',
    builder: '--',
    propertyComp: '--',
    buildDescript: '--',
    hasPullDown: false,
    busLine: '--',
    addCase: '--',
    houseList: [],
    buildPositionx: 0,
    buildPositiony: 0,
    panoramaMap: 0,
    panoramaThumbUrl: '',
    _top: 0,
    _left: 0,
    vrUrl: '',
    vrIconShow: false,
    videoPhoto: 'btn-video',
    picFlag: false,
    trueFlag: 0,
    oldTrueFlag: 0,
    imgLists: [], // 轮播图路径
    totalImg: 0, // 轮播图总张数
    sealedHouse: false, // 房源下架弹框控制显示
    toastMask: false, // 弹框外层
    guideToast: false, // 引导弹框
    leadToast: false, // 引导弹框显示控制
    footerNav: false, // 底部
    lazyLoad: true,
    discountStatus: false, // 折扣弹框
    userPhone: '', // 用户电话
    collectToast: false, // 收藏
    collectTxt: '', // 收藏提示
    is400Mobile: 0,
    cursorUrl: '../../images/detail/cursor.png',
    map: {
      lat: 0,
      lng: 0,
      markers: [],
      hasMarkers: false
    },
    closeCont: false, // 小区信息展开控制
    houseShowTitle: true, // 小区信息查看更多文章更换
    closepic: false,
    footerShow: false,
    videoShowLater: false,
    autoplay: false,
    boxShow: true, // 外层盒子
    shareUrl: '',
    showmor: true,
    showtitle: true,
    showmorZb: true, // 周边信息
    showtitleZb: true, // 周边信息
    zbShowTitle: true, // 周边信息查看更多文章更换
    zbClosepic: false, // 周边
    xqClosepic: false, // 小区
    lookMoreHide: true, // 查看更多隐藏
    lookMoreZbHide: true, // 周边查看更多隐藏
    wHeight: '', // 屏幕高度
    toView: 'aaa',
    scrollTop: 100,
    morejt: 'http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png',
    btnHiden: true,
    currUserMobile: '',
    currUserName: '',
    currUserPhotoUrlPath: 'http://uuweb.haofang.net/Public/wxApp/images/detail/fang_default.png',
    // 小区专家相关
    buildOwnerArchiveId: '',
    buildOwnerName: '',
    buildOwnerPicUrl: 'http://uuweb.haofang.net/Public/wxApp/images/detail/fang_default.png',
    buildOwnerMobile: '',
    brokerMoney: '',
    buyMoney: '',
    rentMoney: '',
    serviceRegs: '',
    buildIntegrity: 0,
    buildOwnerHouseList: [],
    gpBrokerList: [], // 挂牌经纪人数组,
    gpBrokerCount: '', // 挂牌经纪人数
    ownerName: '',
    setting: [],
    archiveId: '',
    buildRegionId: '',
    sectionId: '',
    regionName: '',
    sectionName: '',
    recomInfoId: '',
    userId: '', //
    isVip: '',
    showKanFang: false,
    isOwner: false,
    evaluateValue: '', // 房价评估数据
    ratioByLastMonthForPrice: '',
    ratioByLastYearForPrice: '',
    AgentUserId: '', // 经纪人ID
    buildId: '',
    imId: '',
    openHuabei: 0,
    yezhuContactFlag: false,
    shareArchiveId: '',
    animationCloudData: '',
    typeList: {
      '公交': { typeId: 'bus', typeName: '公交' },
      '地铁': { typeId: 'subway', typeName: '地铁' },
      '学校': { typeId: 'school', typeName: '学校' },
      '医院': { typeId: 'hospital', typeName: '医院' },
      '银行': { typeId: 'bank', typeName: '银行' },
      '休闲娱乐': { typeId: 'leisure', typeName: '休闲娱乐' },
      '购物': { typeId: 'shopping', typeName: '购物' },
      '餐饮': { typeId: 'food', typeName: '餐饮' },
      '运动健身': { typeId: 'sports', typeName: '运动健身' }
    },
    serviceArchiveId: app.globalData.imService,
    communityToast: false,
    wWidth: '',
    videoHeight: '',
    shareOpenId: '', // 分享人openId
    backToIndexBtn: false,
    surroudMore: false,
    describeHouse: false,
    lessContent: true,
    guideBackIndex: false,
    seeEvaluateBox: false, // 带看评价弹框
    showCompleteEvaDialog: false, // 服务评价弹窗
    isSee: false, // 是否要展示带看评价按钮
    isSeeEvaluate: false, // 是否显示底部服务评价按钮
    showPay: false, // 是否显示佣金支付按钮
    seeStarVal: 0, // 带看评价点击服务态度五角星的值
    levStarVal: 0, // 带看评价点击专业水平五角星的值
    serverStarVal: 4, // 成交评价点击五角星的值
    realPayMoney4C: '', // 成交后显示的实际支付金额
    completeEvaContent: '', // 成交评价手动填写内容,
    // 带看评价原因
    seeReasonArr: {
      1: ['讲解很不清晰', '专业知识不强', '与推荐房源不符', '服务态度不好'],
      2: ['讲解一般', '专业度不高', '与推荐房源不符', '服务态度一般'],
      3: ['讲解有待提升', '专业度有待提升', '与推荐房源不符', '服务态度一般']
    },
    // 服务评价原因
    serverReasonArr: {
      1: ['讲解很不清晰', '专业知识不强', '反馈不及时', '服务态度不好'],
      2: ['讲解一般', '专业度不高', '反馈一般', '服务态度一般'],
      3: ['讲解有待提升', '专业度有待提升', '反馈一般', '服务态度一般']
    },
    // 服务评价  假房源原因
    serverFakeReasonArr: {
      1: ['房源不存在', '房源已出租', '图片不真实', '价格不真实']
    },
    isLike: 1, // 带看评价要提交的数据
    realHouse: 1, // 带看评价要提交的数据,
    evaContent: '', // 带看评价手动填写内容
    checkedEvaReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    },
    checkedCompleteReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    }, // 选中服务评价原因
    pushLogId: '', // 经纪人接单信息ID
    brokerarchiveId: '', // 委托详情页带过来的经纪人id,
    checkCodeCityName: '',
    checkCodeFun: '',
    checkCodeFunUrl: '',
    unreadNum: 0,

    //
    currentTab:0,

    // 详情展示活动悬浮按钮
    activeFlag: false,
    activeData: ''

  },
  videoPhotoChange: function (e) {
    var currentBtn = this.data.videoPhoto == 'btn-video' ? 'btn-photo' : 'btn-video'
    var picFlag = this.data.picFlag ? false : true
    this.setData({
      videoPhoto: currentBtn,
      picFlag: picFlag
    })
  },
  // 查看全部
  lookMoreFeature() {
    var that = this
    var boo = !that.data.lessContent,
      // zbShowss = !that.data.showmorZb,
      // zbShowtt = !that.data.showtitleZb,
      xqClosess = !that.data.xqClosepic
    that.setData({
      // showmorZb: zbShowss,
      // showtitleZb: zbShowtt,
      xqClosepic: xqClosess,
      lessContent: boo
    // btnHiden:false
    })

    // 提交行为户数
    behaviorTool.saveCustBehaviorForStore('17', that)
  },
  /**
   * 点击蒙层,关闭弹框
   */
  closeToastBox() {
    this.setData({
      toastHide: true
    })
  },
  /**
   *  阻止冒泡
   */
  cancelBubble() {
    return false
  },

  /**
   * 初始化活动信息
   */
  initActivityData() {
    // 详情展示活动悬浮按钮
    // activeFlag:true,
    // activeData:'',
    wx.request({
      url: app.buildRequestUrl('isShowActive'),
      success: (res) => {
        if (res.statusCode == 200) {
          let resData = res.data
          let activeData = {
            activePage: resData.jjysPageUrl,
            activeImageUrl: resData.jjysActionUrl
          }
          this.setData({
            activeFlag: resData.isShowJjysAct == 1 ? true : false,
            activeData: activeData
          })
        }
      }
    })
  },

  /**
   * 同意切换到定位城市
   */
  changeCity: function () {
    this.setData({ toastHide: true })
    if (this.data.locateCityId > 0) {
      wx.setStorageSync('cityId', this.data.locateCityId)
      wx.setStorageSync('cityName', this.data.locateCityName)
      wx.reLaunch({
        url: '/pages/real_index/index'
      })
    }else {
      wx.reLaunch({
        url: '/pages/chooseCity/chooseCity'
      })
    }
  },
  onLoad: function (options) {
    var _this = this
    let isIphoneX = app.globalData.isIphoneX
    this.setData({
      isIphoneX: isIphoneX
    })
    if (!wx.getStorageSync('openId')) {
      app.saveUserData(function (res) {
        _this.showMaskBox()
        _this.setData({
          userId: wx.getStorageSync('userId')
        })
      })
    }else {
      _this.showMaskBox()
    }
    var _this = this
    if (!!options.cityid) {
      var curCityId = options.cityid
    // 进入详情页 不重新设置城市Id缓存  20180528 23:51
    // wx.setStorageSync('cityId', options.cityid)
    }else {
      var curCityId = wx.getStorageSync('cityId')
    }
    var userId = wx.getStorageSync('userId')
    // 更新城市
    _this.setData({
      cityId: curCityId,
      userId: userId > 0 ? userId : ''
    })
    _this.setData({
      userMobile: wx.getStorageSync('userMobile'),
      locateCityName: wx.getStorageSync('locateCityName'),
      locateCityId: wx.getStorageSync('locateCityId'),
      userInfo: wx.getStorageSync('userInfo')
    })

    var scene = options.scene

    if (!!scene) {
      scene = decodeURIComponent(scene).split('&')
      if(scene.length >= 3){
        options.caseType = scene[0]
        options.resource = scene[1]
        options.cityId = scene[2]
        options.caseId = scene[3]
        options.shareArchiveId = scene[4]
        //二维码进入详情页 (有经纪人) 也可以参与新用户赚现金活动
        if (!!options.shareArchiveId){
          options.source = 'zshft'
          options.casetype = scene[0]
          options.resource = scene[1]
          options.cityid = scene[2]
          options.caseid = scene[3]
          options.archive_id = scene[4]
          options.activity = 1
        }
      }
    }

    if (options.source == 'uuapp' || options.source == 'zshft' || options.source == 'personalStore') {
      if (options.activity == 1) {
        wx.setStorageSync('shareArchiveId', options.archive_id)
        wx.setStorageSync('shareCaseType', options.casetype)
        wx.setStorageSync('shareCityId', options.cityid)
        wx.setStorageSync('shareCaseId', options.caseid)
      }
      this.setData({
        shareArchiveId: options.archive_id
      })
    }

    if (wx.getStorageSync('userId') && wx.getStorageSync('openId')) {
      if (wx.getStorageSync('shareArchiveId')) {
        wx.request({
          url: app.buildRequestUrl('stimulerBroker'), // 2018.08.24  lwj
          data: {
            openId: wx.getStorageSync('openId'),
            caseType: wx.getStorageSync('shareCaseType'),
            cityId: wx.getStorageSync('shareCityId'),
            caseId: wx.getStorageSync('shareCaseId'),
            shareArchiveId: wx.getStorageSync('shareArchiveId'),
            youyouUserId: wx.getStorageSync('userId')
          }
        })
      }
    }
    

    /** 添加活动展示信息 */
    this.initActivityData()

    /*个人微店进入详情和掌通分享进入详情,不展示周边新房及小区专家*/
    if (options.source == 'personalStore' || options.source == 'zshft') {
      this.setData({
        shareInfoFlag: true
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          wHeight: res.windowHeight - 50,
          wWidth: res.windowWidth
        })
      }
    })
    _this.setData({
      videoHeight: _this.data.wWidth * 0.75
    })
    _this.setData({ userPhone: wx.getStorageSync('userMobile') })
    var setDa = { userId: userId,caseId: options.caseId || options.caseid, caseType: options.caseType || options.casetype, cityId: options.cityId || options.cityid, reSource: options.reSource || options.resource}
    if (options.fromDetail || options.fromdetail) {
      setDa['fromDetail'] = options.fromDetail || options.fromdetail
    }
    if (options.shareOpenId || options.shareopenid) {
      setDa['shareOpenId'] = options.shareOpenId || options.shareopenid
    }
    this.setData(setDa)
    if (options.recomInfoId && options.userId && options.isVip != undefined) {
      this.setData({ recomInfoId: options.recomInfoId,userId: options.userId,isVip: options.isVip})
    }

    // 从委托带看房源进入房源详情页面的相关判断
    if (options.pushLogId) {
      this.setData({ pushLogId: options.pushLogId })
    }
    if (options.isShield) {
      this.setData({ isShield: options.isShield })
    }
    if (options.recomInfoId) {
      this.setData({recomInfoId: options.recomInfoId})
    }
    if (options.seeStatus == 2) {
      this.setData({ isSee: true, isShield: options.isShield})
    }
    if (options.brokerMoney) {
      this.setData({ brokerMoney: options.brokerMoney})
    }
    if (options.brokerarchiveId) {
      this.setData({ brokerarchiveId: options.brokerarchiveId })
    }
    if (options.caseid || options.caseId) {
      this.setData({ caseId: options.caseId || options.caseid })
    }
    if (options.caseType) {
      this.setData({ caseType: options.caseType })
    }
    if (options.seeStatus == 3 && options.brokerMoney > -1 && options.recomhousestatus == 0) {
      this.setData({ showPay: true})
    }
    if (options.seeStatus == 0 && options.recomhousestatus != 1) {
      this.setData({ showKanFang: true })
    }
    if (options.seeStatus == 4 && options.isEvaluate != 1) {
      this.setData({ isSeeEvaluate: true })
    }
    if (options.shareArchiveId) {
      this.setData({ shareArchiveId: options.shareArchiveId})
    }
    if (options.seeStatus == 3 && options.brokerMoney == -1 && options.recomhousestatus != 2 && options.delStatus!=1){
      this.setData({ advisoryArchive: false })
    }

    // 出租
    this.initData()
  },
  initData: function () { // 初始化页面数据
    var info = this.data
    var that = this
    var reqUrl = app.globalData.javaOnlineHost + '/uuhfWeb/houseInfoManager/getHouseInfo?caseId=' + info.caseId + '&caseType=' + info.caseType + '&cityId=' + info.cityId + '&reSource=' + info.reSource + '&youyouUserId=' + info.userId
    var shareArchiveId = that.data.shareArchiveId
    if (shareArchiveId > 0) {
      reqUrl += '&shareArchiveId=' + shareArchiveId
    }
    wx.request({
      url: reqUrl,
      header: {
        'webPass': true,
        'U-FS': 'uuWeb'
      },
      success: function (res) {
        var isExist = res.data.DATA.houseIsExist
        if (isExist != 1) {
          that.setData({
            hasPullDown: true
          })
          return
        }

        var info = res.data.DATA
        myJson = info
        delete myJson['userId']
        var _agentUserID = info.userId
        var picUrlArr = [], videoNum = 0
        // 如果登录人的ID是该条房源经纪人的ID则不显示底部
        if (!!_agentUserID && (_agentUserID == app.globalData.userId)) {
          myJson['agentCont'] = false
          myJson['allAgentCont'] = false
          myJson['yezhuCont'] = false
          myJson['showKanFang'] = false
        }else {
          that.setData({
            footerNav: true
          })
        }

        //如果有分享人 , 则底部展示分享人信息
        if (!!that.data.shareArchiveId && !!info.shareBrokerInfoVO) {
          info.archiveId = info.shareBrokerInfoVO.shareArchiveId
          info.currUserPhotoUrlPath = info.shareBrokerInfoVO.userPhoto
          info.currUserName = info.shareBrokerInfoVO.userName
        }
        

        if (!!info.photoList) {
          var photoList = info.photoList
          for (var i = 0; i < photoList.length; i++) {
            if (!!(photoList[i].picUrl)) {
              picUrlArr.push(tool.addImgParam(photoList[i].picUrl, 600, 480))
            }
          }
          myJson['picUrl'] = picUrlArr
        }
        if (!!info.videoUrlPath) {
          myJson['videoUrlPath'] = info.videoUrlPath
          myJson['videoTopPicUrlPath'] = info.videoTopPicUrlPath
          videoNum = 1
        }
        myJson['totalImg'] = picUrlArr.length
        that.d(info, 'houseSubject')
        that.d(info, 'isCollected')
        that.d(info, 'houseTotalPrice')
        that.d(info, 'houseUnitPrice')
        that.d(info, 'priceUnitCn')
        that.d(info, 'priceUnit')
        that.d(info, 'houseRoom')
        that.d(info, 'houseHall')
        that.d(info, 'houseWei')
        that.d(info, 'checkCodeCityName')
        that.d(info, 'checkCodeFun')
        that.d(info, 'checkCodeFunUrl')
        if ((!!info.houseArea) && info.houseArea > 0) {
          myJson['houseArea'] = info.houseArea
        }
        if (!!info.houseTagDesc) {
          myJson['tagArr'] = info.houseTagDesc.split('|').slice(0, 4); //详情页最多展示4个标签  2018.10.13  lwj
        }
        if (!!info.houseList) {
          var houseList = info.houseList
          for (var i = 0; i < houseList.length; i++) {
            houseList[i]['photoAddr'] = tool.addImgParamCrop(houseList[i]['photoAddr'], 180, 120)
          }
          myJson['houseList'] = houseList
        }
        if (info.houseDesc) {
          var describeHouse = decodeURIComponent(info.houseDesc)
          describeHouse = describeHouse.replace(/\\r\\n/g, '\n')
          myJson['houseDesc'] = describeHouse
          if (describeHouse.length > 70) {
            that.setData({
              describeHouse: true
            })
          }else {
            that.setData({
              describeHouse: false
            })
          }
        }
        if (info.buildDescript) {
          myJson['buildDescript'] = decodeURIComponent(info.buildDescript)
        }
        if (info.busLine) {
          myJson['busLine'] = decodeURIComponent(info.busLine)
        }
        if (info.addCase) {
          var addCase = decodeURIComponent(info.addCase)
          myJson['addCase'] = addCase.replace(/\\r\\n/g, '\n')
          if (addCase.length > 50) {
            that.setData({
              surroudMore: true
            })
          }
        }

        // 处理物业费数据
        if (info.costStandard) {
          var subStr = new RegExp('\\.\\d+', 'i'); // 创建正则表达式对象
          info.costStandard = info.costStandard.replace(subStr, '') //
        }

        if (info.gpBrokerList) {
          var gpBrokerList = info.gpBrokerList
          for (var t = 0;t < gpBrokerList.length;t++) {
            if ((!gpBrokerList[t].gpBroker400Phone) && (!gpBrokerList[t].brokerMobilePhone)) {
              gpBrokerList.splice(t, 1)
            }
          }
          myJson['gpBrokerList'] = gpBrokerList
        }
        wx.setNavigationBarTitle({
          title: info.buildName
        })
        that.d(info, 'houseUseage')
        that.d(info, 'houseUseageCn')
        that.d(info, 'houseFitment')
        that.d(info, 'houseFitmentCn')
        that.d(info, 'houseDirectCn')
        that.d(info, 'houseYear')
        that.d(info, 'houseFloor')
        that.d(info, 'houseFloors')
        that.d(info, 'buildName')
        that.d(info, 'buildType')
        that.d(info, 'rightYears')
        that.d(info, 'costStandard')
        that.d(info, 'projectGreen')
        that.d(info, 'projectSpace')
        that.d(info, 'submitDate')
        that.d(info, 'builder')
        that.d(info, 'propertyComp')
        that.d(info, 'buildPositionx')
        that.d(info, 'buildPositiony')
        that.d(info, 'panoramaMap')
        that.d(info, 'trueFlag')
        that.d(info, 'oldTrueFlag')
        that.d(info, 'currUserMobile')
        that.d(info, 'imId')
        that.d(info, 'currUserName')
        that.d(info, 'currUserPhotoUrlPath')
        that.d(info, 'archiveId')
        that.d(info, 'buildOwnerArchiveId')
        that.d(info, 'buyMoney')
        that.d(info, 'rentMoney')
        that.d(info, 'serviceRegs')
        that.d(info, 'buildOwnerName')
        that.d(info, 'buildOwnerPicUrl')
        that.d(info, 'buildOwnerMobile')
        that.d(info, 'buildIntegrity')
        that.d(info, 'buildOwnerHouseList')
        that.d(info, 'gpBrokerCount')
        that.d(info, 'ownerName')
        that.d(info, 'setting')
        that.d(info, 'buildRegionId')
        that.d(info, 'sectionId')
        that.d(info, 'regionName')
        that.d(info, 'sectionName')
        that.d(info, 'sectionName')
        that.d(info, 'buildId')
        that.d(info, 'imId')
        that.d(info, 'openHuabei')
        that.d(info, 'is400Mobile')
        that.d(info, 'isDecrypt')

        if (info.wxId && info.wxId == app.globalData.userId) {
          myJson['isOwner'] = true
        }
        if (info.panoramaMap > 0) {
          var vrUrl = 'https://pano.haofang.net/pano/pano720.jsp?CITY_ID=' + that.data.cityId + '&CASE_TYPE=' + that.data.caseType + '&CASE_ID=' + that.data.caseId + '&APP_SOURCE=1&SOURCE=WEB&SSL=1'
          if (info.shareArchiveId > 0) {
            vrUrl += '&ARCHIVE_ID=' + that.data.shareArchiveId
          }
          myJson['vrUrl'] = vrUrl

          // 获取VR首图
          var panoramaThumbUrl = info.panoramaThumbUrl

          if (!panoramaThumbUrl) {
            // 如果 java接口还没添加 VR首图 则 请求php接口获取 VR首图
            wx.request({
              url: app.buildRequestUrl('getVRFirstPhotoUrl'),
              data: {
                caseId: that.data.caseId,
                caseType: that.data.caseType,
                cityId: that.data.cityId
              },
              success: function (res) {
                if (res.data.STATUS == 1) {
                  var panoramaThumbUrl = res.data.DATA
                  if (!!panoramaThumbUrl) {
                    that.setData({panoramaThumbUrl: panoramaThumbUrl,vrIconShow: true})
                  }
                }
              }
            })
          }else {
            that.setData({panoramaThumbUrl: panoramaThumbUrl,vrIconShow: true})
          }

          // 如果有VR 初始化VR动画
          var WIN_W = wx.getSystemInfoSync().windowWidth
          // 换算盒子宽高 : 750:479.25
          var WIN_H = WIN_W * 480 / 750
          var _leftMax = WIN_W / 2
          var _topMax = WIN_H / 2

          wx.onAccelerometerChange(function (res) {
            var _x = res.x.toFixed(2), // 横向 X 轴 -1 ~ 1
              _y = res.y.toFixed(2), // 纵向 Y 轴 -1 ~ 1
              _z = res.z.toFixed(2); // 纵向 Z 轴 -1 ~ 1

            var _topOld = that.data._top
            var _leftOld = that.data._left
            var _top, _left
            var _top = (_y * _topMax) * (-1) //
            _left = (_x * _leftMax)
            _left = _left > 0 ? (_left > _leftMax ? _leftMax : _left) : (_left < -_leftMax ? -_leftMax : _left)
            _top = _top > 0 ? (_top > _topMax ? _topMax : _top) : (_top < -_topMax ? -_topMax : _top)

            // 只有在变化 不超过  一定范围才移动 , 防止剧烈抖动

            //  _left = (_left - _leftOld)/_leftOld < 0.02?_left:_leftOld
            //  _top =  (_top - _topOld)/_topOld < 0.02?_top:_topOld

            that.setData({_top: _top,_left: _left})
          })

          setTimeout(function () {
            that.setData({vrIconShow: true})
          }, 800)
          // 如果有VR图 , 则初始化VR动态

        }
        if (!!info.houseSetCn) {
          myJson['houseSetCn'] = info.houseSetCn.split('||')
        }
        // if (!that.data.houseDesc || that.data.houseDesc.length < 100) {
        // 	myJson['lookMoreHide'] = false
        // }
        if (!that.data.addCase || that.data.addCase.length < 100) {
          myJson['lookMoreZbHide'] = false
        }
        var buildOwnerHouseList = that.data.buildOwnerHouseList
        if (buildOwnerHouseList) {
          for (var i = 0;i < buildOwnerHouseList.length;i++) {
            var desc = buildOwnerHouseList[i].houseTagDesc
            if (!!desc) {
              buildOwnerHouseList[i].houseTagDesc = desc.split('|')
            }
          }
          myJson['buildOwnerHouseList'] = buildOwnerHouseList
        }

        // 判断底部按钮显示情况
        if (that.data.reSource == 1 && (myJson.trueFlag > 0 || myJson.oldTrueFlag > 0)) { // 真房源
          myJson['agentCont'] = true; // 展示经纪人的联系方式
        }else if (that.data.reSource == 1 && myJson.trueFlag == 0) { // 20171208 段成伟 最新逻辑 普通ERP经纪人房源和搜搜经纪人房源展示挂牌经纪人同时联系方式展示小区专家的,如果没有小区专家那么展示客服的
          myJson['allAgentCont'] = true
          myJson['gpBrokerCount'] = 4
        }else if (that.data.reSource == 2) { // 搜搜中介房源,也就是挂牌房源,展示挂牌经纪人
          myJson['allAgentCont'] = true
        }else if (that.data.reSource == 3 || that.data.reSource == 4 && (!myJson.isOwner)) { // 搜搜个人和优优好房个人, 3和4一样展示房东和咨询业主按钮，点击咨询业主按钮，提示下载
          myJson['yezhuCont'] = true
        }else if (that.data.reSource == 5) { // 搜搜合租 显示X先生/女士 和咨询业主电话，点击咨询业主直接拨打真实电话
          myJson['hezu'] = true
        }
        myJson['reSource'] = info.resource

        if (!myJson['currUserPhotoUrlPath']) {
          myJson['currUserPhotoUrlPath'] = that.data.buildOwnerPicUrl
        }
        that.setData(myJson)
        // 请求房价评估
        that.requstEvaluate()

        // 初始化用户进入详情次数
        if (that.data.shareArchiveId) {
          var archiveId = that.data.shareArchiveId
        }else {
          var archiveId = that.data.archiveId
        }

        behaviorTool.getInStoreCount(archiveId, wx.getStorageSync('userId'), that.data.caseId, that.data.caseType);
        //用户进入详情统计行为
        behaviorTool.inStoreAction(that);
      },
      fail: function () {
        // 该房源已下架
        alert('该房源已下架')
      },complete: function () {
        that.setData({
          loadingFlag: false
        })
      }
    })
  },
  onShareAppMessage: function () {
    var that = this
    var pathUrl = tool.getCurrentPageUrlWithArgs();
    return {
      title: that.data.buildName,
      path: pathUrl,
   　　success: function(res){
　　　　　　// 转发成功之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
          // 采集用户分享行为
          behaviorTool.saveCustBehaviorForStore('25', that)
　　　　　　}
　　　　},
　　　　fail: function(){
　　　　　　// 转发失败之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
　　　　　　　　// 用户取消转发
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
　　　　　　}
　　　　},
　　　　complete: function(){
　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
　　　　}
    }
  },
  onReady: function () {
    // 页面渲染完成
    var that = this
    var i = 0
    var ii = 0
    var animationCloudData = wx.createAnimation({
      duration: 800, // 默认为400     动画持续时间，单位ms
      timingFunction: 'ease-in-out'
    })
    // 动画的脚本定义必须每次都重新生成，不能放在循环外
    animationCloudData.scale(1, 1).step({ duration: 800 }).scale(1.5, 1.5).step({ duration: 800 })

    // 更新数据
    that.setData({
      // 导出动画示例
      // animationData: animationData.export(),
      animationCloudData: animationCloudData.export()
    })

    setInterval(function () {
      // 动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.scale(1.2, 1.2).step({ duration: 800 }).scale(0.8, 0.8).step({ duration: 800 })

      // 更新数据
      that.setData({
        // 导出动画示例
        // animationData: animationData.export(),
        animationCloudData: animationCloudData.export()
      })
      ++ii
    }.bind(that), 1500); // 3000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错
  },
  /*vr点击跳转*/
  vrBtnTo: function (e) {
    // 采集用户行为数据
    behaviorTool.saveCustBehaviorForStore('14', this)

    var url = '/packageWeb/pages/vr/vr?caseId=' + this.data.caseId + '&caseType=' + this.data.caseType + '&cityId=' + this.data.cityId
    if (this.data.shareArchiveId > 0) {
      url += '&ARCHIVE_ID=' + this.data.shareArchiveId
    }
    wx.navigateTo({
      url: url
    })
  },
  onShow: function () {
    var _this = this

    _im.initIm()
    this.initUnreadNum()
    // 进入开始计时
    if (_this.data.archiveId && wx.getStorageSync('userId') && _this.data.caseId && _this.data.caseType) {
      behaviorTool.getInStoreCount(_this.data.archiveId, wx.getStorageSync('userId'), _this.data.caseId, _this.data.caseType)
    }
  },
  onHide: function () {

  },
  /**
   * 页面返回,页面重定向,重启动
   * @return {[type]} [description]
   */
  onUnload:function(){
    behaviorTool.saveCustBehaviorForStore('29', this);
  },
  errImg: function (ev) {
    // 需要访问当前页面的数据对象传递到其它页面上
    var _that = this
    api.errImgFun(ev, _that, 'avatar')
  },
  changePic: function (e) {
    var current = e.detail.current
    let currentPic = current;
    if (this.data.panoramaMap > 0 && this.data.videoUrlPath != ''){
      currentPic -= 1;
    } else if (this.data.panoramaMap > 0 || this.data.videoUrlPath != '') {
      currentPic -= 0;
    }else{
      currentPic += 1;
    }
    this.setData({
      currentTab: current,
      currentPic: currentPic
    })
  },
  /**
   * 切换swiper tab
   */
  switchPic: function (e) {
    let clickType = e.currentTarget.dataset.type;
    let currentTab = 0;
    if (clickType == 'vr') {
      currentTab = 0
    } else if (clickType == 'vd') {
      currentTab = this.data.panoramaMap > 0?1:0
    }else{
      if (this.data.panoramaMap > 0 && this.data.videoUrlPath != '') {
        currentTab = 2;
      } else if (this.data.panoramaMap > 0 || this.data.videoUrlPath != '') {
        currentTab = 1;
      } else {
        currentTab = 0;
      }
    }
    this.setData({
      currentTab: currentTab
    })
  },

  /**
   * 播放视频
   */
  playVideo: function () {
    var that = this
    that.setData({
      videoShow: true,
      boxShow: false
    })
    setTimeout(function () { // 视频延迟加载
      that.setData({
        videoShowLater: true,
        autoplay: true
      })
    }, 500)
  },
  closeBtn: function () { // 关闭视频
    this.setData({
      videoShow: false,
      boxShow: true
    })
  },
  moreBtn: function () { // 点击查看更多
    var that = this,
      showss = !that.data.showmor,
      showtt = !that.data.showtitle,
      closess = !that.data.closepic
    that.setData({
      showmor: showss,
      showtitle: showtt,
      closepic: closess
    // btnHiden:false
    })
  },
  closeBtn: function () { // 关闭视频
    this.setData({
      videoShow: false,
      boxShow: true
    })
  },
  moreBtn: function () { // 点击查看更多
    var that = this,
      showss = !that.data.showmor,
      showtt = !that.data.showtitle,
      closess = !that.data.closepic
    that.setData({
      showmor: showss,
      showtitle: showtt,
      closepic: closess
    // btnHiden:false
    })
  },
  moreZbBtn: function () { // 周边信息点击查看更多
    var that = this,
      zbShowss = !that.data.showmorZb,
      zbShowtt = !that.data.showtitleZb,
      zbClosess = !that.data.zbClosepic
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
      closess = !that.data.closeCont
    that.setData({
      houseShowTitle: houseshowtt,
      closeCont: closess
    })
  },
  /*
  *五角星收藏控制
  */
  starBtn: function () { // 点击查看更多
    app.checkLogin(); // 登录验证
    var that = this,v = !that.data.isCollected
    that.setData({
      isCollected: v
    })
    wx.request({
      url: app.buildRequestUrl('addOrDeleteCollectUrl') + '?caseId=' + that.data.caseId + '&caseType=' + that.data.caseType + '&cityId=' + that.data.cityId + '&reSource=' + that.data.reSource + '&userId=' + app.globalData.userId,
      success: function (res) {
        var status = res.data.STATUS
        that.setData({
          collectToast: true,
          collectTxt: res.data.INFO
        })
        setTimeout(function () {
          that.setData({
            collectToast: false
          })
        }, 2000)
        if (status == 0) {
          v = !that.data.isCollected
          that.setData({
            isCollected: v
          })
        //                	alert("操作太频繁啦")
        }
      }
    })

    // 采集用户行为
    if (v) {
      behaviorTool.saveCustBehaviorForStore('23', that)
    }else {
      behaviorTool.saveCustBehaviorForStore('24', that)
    }
  },
  /**
   * 图片全屏预览
   */
  getImageInfo: function (e) {
    var that = this
    var currentImage = e.currentTarget.dataset.image
    var imageArr = that.data.picUrl
    // 采集用户行为数据
    behaviorTool.saveCustBehaviorForStore('14', that)
    wx.previewImage({
      current: currentImage, // 当前显示图片的http链接
      urls: imageArr // 需要预览的图片http链接列表
    })
  },
  /**
   * 房价评估跳转
   */
  calculator: function (e) { // 房贷计算器跳转
    var that = this
    // 提交行为数据
    behaviorTool.saveCustBehaviorForStore('15', that)

    var buildName = that.data.buildName
    var houseRoom = that.data.houseRoom
    var area = that.data.houseArea
    var houseWhere = that.data.houseDirectCn
    var floor = ''
    var toatleFloor = that.data.houseFloors
    var floor = that.getFloor(that.data.houseFloor, toatleFloor)
    var url = '/packageTool/pages/evaluationEntry/evaluationEntry?buildName=' + buildName + '&buildId=' + that.data.buildId + '&houseRoom=' + houseRoom + '&area=' + area + '&houseWhere=' + houseWhere + '&floor=' + floor + '&totalFloor=' + toatleFloor + '&houseType=' + that.data.houseUseage + '&whereFrom=detail'
    wx.navigateTo({
      url: url
    })
  },
  getFloor: function (houseFloor, totalFloorNum) {
    var highFloor = 40
    var floor = 0
    if (houseFloor == '低楼层' || houseFloor == '低层') {
      floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 1 / 6 + 1
    } else if (houseFloor == '中楼层' || houseFloor == '中层') {
      floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 3 / 6 + 1
    } else if (houseFloor == '高楼层' || houseFloor == '高层') {
      floor = (totalFloorNum > highFloor ? highFloor : totalFloorNum) * 5 / 6 + 1
    }else if (houseFloor == '超高层') {
      floor = totalFloorNum - abs(totalFloorNum - 40) / 2
    }else if (houseFloor == '其它') {
      floor = totalFloorNum
    }
    return Math.round(floor)
  },
  /**
   * 调整地图页
   */
  goToMap(e) {
    var lat = e.currentTarget.dataset.lat
    var lng = e.currentTarget.dataset.lng
    var type = e.currentTarget.dataset.type
    var buildname = e.currentTarget.dataset.buildname
    wx.setStorageSync('mapType', type)
    // 采集用户行为
    if (!!type) {
      behaviorTool.saveCustBehaviorForStore('22', this)
    }else {
      behaviorTool.saveCustBehaviorForStore('21', this)
    }

    if (!!type) {
      wx.navigateTo({
        url: '/packageTool/pages/map/map?lat=' + lat + '&long=' + lng + '&type=' + type + '&buildname=' + buildname
      })
    } else {
      wx.navigateTo({
        url: '/packageTool/pages/map/map?lat=' + lat + '&long=' + lng + '&buildname=' + buildname
      })
    }
  },
  d: function (info, item, setValue) { // 处理数据的
    if (!!setValue) {
      myJson[item] = setValue
    }else if (!!info[item]) {
      myJson[item] = info[item]
    }
  },    dial: function (e) { // 拨打电话
    var _this = this
    var yezhu = e.currentTarget.dataset.yezhu
    var _imid = e.currentTarget.dataset.imid
    var hezu = e.currentTarget.dataset.hezu
    if (yezhu == 1 && hezu == 1) { // 合租直接拨打
      if (_this.data.isDecrypt == 1) {
        wx.request({
          url: app.globalData.javaOnlineHost + '/uuhfWeb/othenBiz/otherBizController/getAesEncrypt?type=decrypt&content=' + e.currentTarget.dataset.mobile,
          success: function (res) {
            var status = res.data.STATUS
            if (status == 1) {
              var phoneNum = res.data.DATA
              if (tool.isIOS()) {
                wx.makePhoneCall({
                  phoneNumber: phoneNum,
                  success: function () {
                    _this.createCallHistory(2, 'uu_' + _this.data.userId, _this.data.imId, 1)
                  }
                })
              } else {
                wx.showModal({
                  title: '拨打电话',
                  content: phoneNum.replace(',', ' 转 '),
                  success: function (res) {
                    if (res.confirm) {
                      wx.makePhoneCall({
                        phoneNumber: phoneNum,
                        success: function () {
                          _this.createCallHistory(4, 'uu_' + _this.data.userId, _this.data.imId, 1)
                        }
                      })
                    }
                  }
                })
              }
            }
          }, complete: function () { app.hideToast(); }
        })
      }else {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.mobile,
          success: function () {
            _this.createCallHistory(2, 'uu_' + _this.data.userId, _this.data.imId, 1)
          }
        })
      }
    }else if (yezhu == 1) { // 整租和出售拨打400
      // 业主电话
      var mobile = e.currentTarget.dataset.mobile
      if (!!mobile) {
        app.showToast('加载中')
        if (_this.data.is400Mobile == 1) {
          wx.request({
            url: app.globalData.javaOnlineHost + '/uuhfWeb/othenBiz/otherBizController/getAesEncrypt?type=decrypt&content=' + mobile,
            success: function (res) {
              var status = res.data.STATUS
              if (status == 1) {
                var phoneNum = res.data.DATA
                if (tool.isIOS()) {
                  wx.makePhoneCall({
                    phoneNumber: phoneNum
                  })
                } else {
                  wx.showModal({
                    title: '拨打电话',
                    content: phoneNum.replace(',', ' 转 '),
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: phoneNum,
                          success: function () {
                            _this.createCallHistory(4, 'uu_' + _this.data.userId, _this.data.imId, 1)
                          }
                        })
                      }
                    }
                  })
                }
              }
            }, complete: function () { app.hideToast(); }
          })
        } else {
          wx.request({
            url: app.buildRequestUrl('getHouse400Phone'),
            data: {
              resource: this.data.reSource,
              cityId: this.data.cityId,
              mobilePhone: mobile
            },
            success: function (res) {
              var phoneNum = res.data.DATA.currUser400Mobile
              app.hideToast()
              if (res.data.STATUS == 1) {
                _this.setData({
                  toastMask: false,
                  guideToast: false,
                  toastMask: false
                })
                if (tool.isIOS()) {
                  wx.makePhoneCall({
                    phoneNumber: phoneNum,
                    success: function () {
                      _this.createCallHistory(4, 'uu_' + _this.data.userId, _this.data.imId, 1)
                    }
                  })
                } else {
                  wx.showModal({
                    title: '拨打电话',
                    content: phoneNum.replace(',', ' 转 '),
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: phoneNum,
                          success: function () {
                            _this.createCallHistory(4, 'uu_' + _this.data.userId, _this.data.imId, 1)
                          }
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        }
      }else {
        if (!!_imid) {
          if (yezhu == 1) {
            wx.navigateTo({
              url: '/pages/im/im?to=' + _imid + '&caseId=' + _this.data.caseId + '&caseType=' + this.data.caseType + '&resource=' + _this.data.reSource,
              success: function () {
                _this.createCallHistory(5, 'uu_' + _this.data.userId, _this.data.imId, 1)
              }
            })
          }else {
            wx.navigateTo({
              url: '/pages/im/im?to=' + _imid + '&caseId=' + _this.data.caseId + '&caseType=' + this.data.caseType + '&resource=' + _this.data.reSource,
              success: function () {
                _this.createCallHistory(5, 'uu_' + _this.data.userId, _this.data.archiveId, 2)
              }
            })
          }
        }
      }
    }else {
      this.setData({toastMask: false,
        guideToast: false,
        toastMask: false
      })
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.mobile,
        success: function () {
          _this.createCallHistory(5, 'uu_' + _this.data.userId, _this.data.archiveId, 2)
        }
      })
    }
  },
  houseDetail: function (e) { // 跳转到其他房源详情页
    wx.redirectTo({
      url: e.currentTarget.dataset.url
    })
  },
  /** 
  * 小区专家咨询点击
  */
  zjAgentChat: function () {
    this.setData({
      discountStatus: true
    })
  },
  /** 
   * 折扣弹框隐藏
   */
  diCloseBtn: function () {
    this.setData({
      discountStatus: false
    })
  },
  /** 
   * 我要买房点击跳转
   */
  goToBuyHouseBtn: function (e) {
    var _this = this
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityId')) {
        // 显示切换城市弹框
        this.setData({ toastHide: false })
      } else {
        app.getLocationAgain()
      }
      return
    }
    var myset = e.currentTarget.dataset
    var caseType = ''
    if (_this.data.caseType == 1) {
      caseType = 3
    } else {
      caseType = 4
    }
    wx.navigateTo({
      url: '/pages/entrust/entrust?archiveId=' + myset.buildownerarchiveid + '&isVip=1' + '&userMobile=' + myset.buildownermobile + '&userName=' + myset.buildownername
        + '&rentMoney=' + myset.rentmoney + '&buyMoney=' + myset.buymoney + '&serviceRegs=' + myset.serviceregs + '&userPhoto=' + myset.buildownerpicurl + '&caseType=' + caseType
    })
  },
  /** 
   * 我要出租，出售点击跳转
   */
  goToEntrustLiBtn: function (e) {
    var _this = this
    let locateCityId = wx.getStorageSync('locateCityId')
    let cityId = wx.getStorageSync('cityId')
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityId')) {
        // 显示切换城市弹框
        this.setData({ toastHide: false })
      } else {
        app.getLocationAgain()
      }
      return
    }
    var _buildOwnerArchiveId = e.currentTarget.dataset.buildownerarchiveid
    var goToUrl = ''
    if (_this.data.caseType == 1) {
      goToUrl = 'sale'
    } else {
      goToUrl = 'rent'
    }
    wx.navigateTo({
      url: '/pages/registration/registration?caseType=' + _this.data.caseType + '&archiveId=' + e.currentTarget.dataset.buildownerarchiveid + '&isVip=1'
    })
  },
  /** 
   * 弹框蒙层点击隐藏
   */
  maskHideBtn: function () {
    this.setData({
      toastMask: false,
      communityToast: false
    })
  },
  /** 
   * 房源下架弹框确定点击
   */
  outedHouseBtn: function () {
    wx.navigateTo({
      url: ''
    })
    this.setData({
      toastMask: false
    })
  },
  /** 
   * 联系方式在线聊天点击
   */
  onlineChat: function (e) {
    // 登录验证
    let checkLoginFlag = app.checkLogin()
    if (!checkLoginFlag) {return;}

    var _this = this
    _this.setData({
      toastMask: false
    })
    if (!app.globalData.userId || app.globalData.userId == undefined) {
      app.saveUserData(function (res) {
        wx.navigateTo({
          url: '/pages/im/im?to=' + e.currentTarget.dataset.archive + '&caseId=' + _this.data.caseId + '&caseType=' + _this.data.caseType + '&reSource=' + _this.data.reSource
        })
      })
    }else {
      wx.navigateTo({
        url: '/pages/im/im?to=' + e.currentTarget.dataset.archive + '&caseId=' + _this.data.caseId + '&caseType=' + _this.data.caseType + '&reSource=' + _this.data.reSource
      })
    }
  },
  downBtn: function (e) {
    this.setData({
      toastMask: true,
      sealedHouse: false,
      guideToast: false,
      leadToast: true
    })
  },
  chooseContactType: function (e) {
    var _this = this
    // 采集行为数据
    behaviorTool.saveCustBehaviorForStore('19', _this)

    if (!app.globalData.userId || app.globalData.userId == undefined || app.globalData.userId == null) {
      app.saveUserData(function (res) {
        wx.navigateTo({
          url: '/pages/im/im?to=' + e.currentTarget.dataset.archive + '&caseId=' + _this.data.caseId + '&caseType=' + _this.data.caseType,
          success: function () {
            _this.createCallHistory(5, 'uu_' + _this.data.userId, e.currentTarget.dataset.archive, 2)
          }
        })
      })
    } else {
      wx.navigateTo({
        url: '/pages/im/im?to=' + e.currentTarget.dataset.archive + '&caseId=' + _this.data.caseId + '&caseType=' + _this.data.caseType,
        success: function () {
          _this.createCallHistory(5, 'uu_' + _this.data.userId, e.currentTarget.dataset.archive, 2)
        }
      })
    }
  },
  /*引导下载板块点击*/
  goToDownLoad: function () {
    wx.navigateTo({
      url: '/packageWeb/pages/download/download'
    })
  },
  /** 
   * 拒绝看房
   */
  disagreen4Daikan: function () {
    var that = this
    if (that.data.isShield == 1) {
      wx.showToast({
        title: '您已把对方屏蔽，暂时不能发起此服务',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: app.buildRequestUrl('disagreen4Daikan'),
      data: {
        recomInfoId: that.data.recomInfoId,
        isVip: that.data.isVip
      },
      success: function (res) {
        var status = res.data.STATUS
        if (status == 1) {
          that.setData({noSeeConfirmBox: false})
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              wx.redirectTo({
                url: '/pages/entrustDetail/entrustDetail?pushLogId=' + that.data.pushLogId
              })
            }
          })
        }else {
          wx.showToast({
            title: '未知错误',
            image: '../../images/warning.png',
            duration: 1500,
            success: function () {}
          })
        }
      }
    })
  },
  /** 
   * 同意看房
   */
  agreen4Daikan: function () {
    var that = this
    if (that.data.isShield == 1) {
      wx.showToast({
        title: '您已把对方屏蔽，暂时不能发起此服务',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: app.buildRequestUrl('agreen4Daikan'),
      data: {
        recomInfoId: that.data.recomInfoId,
        userId: that.data.userId,
        isVip: that.data.isVip
      },
      success: function (res) {
        var status = res.data.STATUS
        if (status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              wx.redirectTo({
                url: '/pages/entrustDetail/entrustDetail?pushLogId=' + that.data.pushLogId
              })
            }
          })
        }else {
          wx.showToast({
            title: '未知错误',
            image: '../../images/warning.png',
            duration: 1500,
            success: function () {}
          })
        }
      }
    })
  },
  serviceBtn: function () {},
  /**
   * 群发委托
   */
  goToEntrust: function (e) {
    let _this = this
    // 采集用户行为
    behaviorTool.saveCustBehaviorForStore('27', _this)

    //该行为触发退出详情行为
    behaviorTool.saveCustBehaviorForStore('29', _this)

    if (_this.data.backToIndexBtn === true) {
      wx.switchTab({
        url: '/pages/real_index/index'
      })
      return
    }
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityId')) {
        // 显示切换城市弹框
        this.setData({ toastHide: false })
      } else {
        app.getLocationAgain()
      }
      return
    }
    var that = this,
      caseType,
      wfRelateId,
      resource,
      houseRegion,
      houseSection,
      regionName,
      sectionName,
      houseUseage,
      houseUseageCn,
      houseFitment,
      houseFitmentCn,
      houseRoom,
      houseHall,
      houseWei,
      buildName,
      houseTotalPrice,
      houseArea

    if (that.data.caseType == 1) {
      caseType = 3
    } else {
      caseType = 4
    }

    wfRelateId = that.data.caseId
    resource = that.data.reSource
    houseRegion = that.data.buildRegionId
    houseSection = that.data.sectionId
    regionName = that.data.regionName
    sectionName = that.data.sectionName
    houseUseage = that.data.houseUseage
    houseUseageCn = that.data.houseUseageCn
    houseFitment = that.data.houseFitment
    houseFitmentCn = that.data.houseFitmentCn
    houseRoom = that.data.houseRoom
    houseHall = that.data.houseHall
    houseWei = that.data.houseWei
    buildName = that.data.buildName
    houseTotalPrice = that.data.houseTotalPrice
    houseArea = that.data.houseArea

    wx.navigateTo({
      url: '/pages/entrust/entrust?caseType=' + caseType + '&specialOper=1&wfRelateId=' + wfRelateId + '&resource=' + resource + '&houseRegion=' + houseRegion + '&houseSection=' + houseSection + '&regionName=' + regionName + '&sectionName=' + sectionName + '&houseUseage=' + houseUseage + '&houseUseageCn=' + houseUseageCn + '&houseFitment=' + houseFitment + '&houseFitmentCn=' + houseFitmentCn + '&houseRoom=' + houseRoom + '&houseTotalPrice=' + houseTotalPrice + '&houseArea=' + houseArea
        + '&houseHall=' + houseHall + '&houseWei=' + houseWei + '&buildName=' + buildName
    })
  },
  guideBackHome: function (e) {
    let _this = this

    let formId = e.detail.formId
    let openId = wx.getStorageSync('openId')
    let userInfo = wx.getStorageSync('userInfo')
    // 发送模板消息
    wx.request({
      url: app.buildRequestUrl('collectFormIdUrl'),
      // url:'http://lbuuweb.hftsoft.com/Mini/App/collectFormId',
      data: {
        formId: formId,
        userId: app.globalData.userId,
        openId: openId,
        formType: 1,
        caseId: _this.data.caseId,
        caseType: _this.data.caseType,
        cityId: _this.data.cityId,
        reSource: _this.data.reSource
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // 缓存一天
        // api.setStorageData(cacheKey, true, 86400)
      },
      complete: function () {
        _this.setData({
          guideBackIndex: false
        })
      }
    })
  },
  /**
   * 新房详情跳转
   */
  goToNewHouseDetail: function (e) {
    var that = this
    var _uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/newHouseDetail/newHouseDetail?buildid=' + _uid
    })
  },
  /**
   * 房价评估接口
   */
  requstEvaluate: function (e) {
    var _this = this
    var data = {
      cityId: _this.data.cityId,
      buildId: _this.data.buildId
    }
    wx.request({
      url: app.buildRequestUrl('getPriceTrendNew'),
      data: data,
      success: function (res) {
        try {
          if (res.data.STATUS == 1) {
            var data = res.data.DATA
            if (data) {
              var ratioByLastYearForPrice = parseFloat(Math.abs(data.ratioByLastYearForPrice * 100)).toFixed(2)
              var ratioByLastMonthForPrice = parseFloat(Math.abs(data.ratioByLastMonthForPrice * 100)).toFixed(2)
              _this.setData({
                evaluateValue: data,
                ratioByLastYearForPrice: ratioByLastYearForPrice,
                ratioByLastMonthForPrice: ratioByLastMonthForPrice
              })
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  /**
   * 去评估页面
   */
  goEvaluateEvent: function (e) {
    var _this = this,data = _this.data,houseType
    if (data.houseUseageCn == '住宅' || !data.houseUseageCn) {
      houseType = 1
    }else if (data.houseUseageCn == '别墅') {
      houseType = 2
    }
    wx.navigateTo({
      url: '/pages/priceTrend/priceTrend?cityId=' + _this.data.cityId + '&buildId=' + _this.data.buildId + '&houseType=' + houseType
    })
  },
  /**
   * 挂牌经纪人联系
   */
  gpCallBtn: function (e) {
    var that = this
    var phone400N = e.currentTarget.dataset.mobilefour
    if (!!phone400N) {
      if (tool.isIOS()) {
        wx.makePhoneCall({
          phoneNumber: phone400N
        })
        return
      } else {
        wx.showModal({
          title: '拨打电话',
          content: phone400N.replace(',', ' 转 '),
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: phone400N,
                success: function () {
                  that.createCallHistory(5, 'uu_' + that.data.userId, that.data.archiveId, 2)
                }
              })
            }
          }
        })
      }
      return
    }
    var phoneN = e.currentTarget.dataset.mobile
    if (!!phoneN) {
      wx.request({
        url: app.buildRequestUrl('getHouse400Phone'),
        data: {
          resource: this.data.reSource,
          cityId: this.data.cityId,
          mobilePhone: phoneN
        },
        success: function (res) {
          var phoneNum = res.data.DATA.currUser400Mobile
          app.hideToast()
          if (res.data.STATUS == 1) {
            that.setData({toastMask: false,
              guideToast: false,
              toastMask: false
            })
            if (tool.isIOS()) {
              wx.makePhoneCall({
                phoneNumber: phoneNum
              })
            }else {
              wx.showModal({
                title: '拨打电话',
                content: phoneNum.replace(',', ' 转 '),
                success: function (res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: phoneNum,
                      success: function () {
                        that.createCallHistory(5, 'uu_' + that.data.userId, that.data.archiveId, 2)
                      }
                    })
                  }
                }
              })
            }
          }
        }
      })
    }else {
      that.setData({
        collectToast: true,
        collectTxt: '无号码或号码错误！'
      })
      setTimeout(function () {
        that.setData({
          collectToast: false
        })
      }, 2000)
    }
  },
  /**
   * 隐藏引导下载
   */
  orderClose: function (e) {
    var _this = this
    _this.setData({
      leadToast: false,
      toastMask: false,
      guideToast: false,
      communityToast: false
    })
  },
  /**
   * 小区专家
   */
  xiaoquCallEvent: function (e) {
    var _this = this
    _this.setData({
      toastMask: true,
      communityToast: true,
      guideToast: false,
      leadToast: false
    })
  },
  /**
   *tab导航点击 
   */
  tabBtnCheck(e) {
    var that = this
    var _t = e.currentTarget.dataset.shows
    if (_t == 's') {
      that.setData({
        showFlas: false,
        offFlag: true
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.animation = animation

      animation.translateX(-195).step()

      this.setData({
        animationData: animation.export()
      })
    } else {
      that.setData({
        showFlas: true,
        offFlag: false
      })
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.animation = animation

      animation.translateX(0).step()

      this.setData({
        animationData: animation.export()
      })
    }
  },
  /**
   *点击导航遮罩层 
   */
  offToast: function () {
    var that = this
    that.setData({
      showFlas: true,
      offFlag: false
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    this.animation = animation

    animation.translateX(0).step()

    this.setData({
      animationData: animation.export()
    })
  },
  /**
   * 隐号拨打
   */
  yinhao: function (e) {
    var _this = this
    _this.setData({
      communityToast: false,
      yezhuContactFlag: false,
      leadToast: true
    })
  },
  /** 
   * 联系方式在线聊天点击
   */
  onlineChat4C: function (e) {
    var imid = e.currentTarget.dataset.imid
    if (!!imid) {
      imid = imid.replace('uu_', '')
    }
    var _this = this
    _this.setData({
      toastMask: false
    })
    wx.navigateTo({
      url: '/pages/im/imc?from=' + _this.data.userId + '&to=' + imid + '&caseId=' + this.data.caseId + '&caseType=' + this.data.caseType
    })
  },
  goToFenQi: function (e) {
    wx.navigateTo({
      url: '/pages/fenqi/fenqi?mobile=' + e.currentTarget.dataset.mobile
    })
  },
  iHaveKnowItPullOff() {
    wx.reLaunch({
      url: '/pages/real_index/index'
    })
  },
  // 点击假一赔百的活动banner
  actBanner(e) {},
  formSubmit(e) {
    app.checkLogin(); // 登录验证
    let _this = this
    let str = _this.data.buildName + ' ' + _this.data.houseRoom + '室' + _this.data.houseHall + '厅' + _this.data.houseWei + '卫' + ' ' + _this.data.houseArea + '㎡' + ' ' + _this.data.houseTotalPrice + _this.data.priceUnitCn
    // 跳转到规则页
    wx.navigateTo({
      url: '/packageTool/pages/fakeHouse/fakeHouse?archiveId=' + _this.data.archiveId + '&caseType=' + _this.data.caseType + '&caseId=' + _this.data.caseId + '&houseInfo=' + str
    })
  },
  // 显示带看评价弹框
  daikanEva: function (e) {
    if (this.data.isShield == 1) {
      wx.showToast({
        title: '您已把对方屏蔽，暂时不能发起此服务',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    this.setData({
      seeEvaluateBox: true,
      isSee: false
    })
  },
  // 关闭带看评价弹框
  daikanEvaClose: function (e) {
    this.setData({
      seeEvaluateBox: false,
      isSee: true
    })
  },
  chooseServeStar: function (e) { // 改变带看评价服务态度星级
    this.setData({
      seeStarVal: e.target.dataset.val,
      checkedEvaReasonArr: { 0: 0, 1: 0, 2: 0, 3: 0 }
    })
  },
  chooseLevelStar: function (e) { // 改变带看评价专业水平星级
    this.setData({
      levStarVal: e.target.dataset.val,
      checkedEvaReasonArr: { 0: 0, 1: 0, 2: 0, 3: 0 }
    })
  },
  toggleRealHouse: function (e) { // 切换选择真房源/假房源
    this.setData({
      realHouse: e.target.dataset.val,
      evaContent: '',
      seeStarVal: 0, // 带看评价点击服务态度五角星的值
      levStarVal: 0
    })
  },
  chooseHouseIntentDialog: function (e) {
    var that = this
    // 带看评价四星以下必选原因或者必填文字,否则按钮颜色为灰色不可点
    var evaContent = that.data.evaContent; // 带看评价
    that.setData({
      isLike: e.target.dataset.val
    })
    var indexArr = []
    for (var i in that.data.checkedEvaReasonArr) {
      if (that.data.checkedEvaReasonArr[i] == 1) {
        indexArr.push(i)
      }
    }
    if (that.data.realHouse == '0') { // 选择假房源
      if (evaContent.length == 0) {
        wx.showToast({
          title: '请填写评论指出经纪人的不足吧',
          icon: 'none',
          duration: 1500,
          success: function () {}
        })
        return false
      }

      if (evaContent.length < 15) {
        wx.showToast({
          title: '请至少输入15个字',
          icon: 'none',
          duration: 1500,
          success: function () {}
        })
        return false
      }
      that.submitEvaData()
    } else { // 真房源
      if (that.data.realHouse == '1') {
        if (that.data.seeStarVal < 1) {
          wx.showToast({
            title: '请给经纪人服务态度评分',
            icon: 'none',
            duration: 1500,
            success: function () {}
          })
          return false
        }
        if (that.data.levStarVal < 1) {
          wx.showToast({
            title: '请给经纪人专业水平评分',
            icon: 'none',
            duration: 1500,
            success: function () {}
          })
          return false
        }
        if (evaContent.length < 1) {
          wx.showToast({
            title: '请输入内容',
            icon: 'none',
            duration: 1500,
            success: function () {}
          })
          return false
        }
        that.submitEvaData()
      }
    }
  },
  submitEvaData: function (e) { // 提交带看评价数据
    var that = this
    var indexArr = []
    for (var i in that.data.checkedEvaReasonArr) {
      if (that.data.checkedEvaReasonArr[i] == 1) {
        indexArr.push(i)
      }
    }
    wx.request({
      url: app.buildRequestUrl('createWfRecomHouseEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        realHouse: that.data.realHouse,
        evaContent: that.data.evaContent,
        evaTagIndex: indexArr.join(','),
        recomInfoId: that.data.recomInfoId,
        seeStar: that.data.seeStarVal,
        levStar: that.data.levStarVal,
        isLike: that.data.isLike
      },
      success: function (res) {
        var status = res.data.STATUS
        if (status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({ seeEvaluateBox: false, isSee: false })
          that.initEntrustData(that.data.entrustUser.pushLogId, that.data.userId)
        } else {
          wx.showToast({
            title: res.data.INFO,
            icon: 'none',
            duration: 2000
          })
          return false
        }
      }
    })
  },
  toogleEvaReason: function (e) {
    var checkedEvaReasonArr = this.data.checkedEvaReasonArr
    var nowIndex = e.currentTarget.dataset.index
    if (checkedEvaReasonArr[nowIndex] == 0) {
      checkedEvaReasonArr[nowIndex] = 1
    } else {
      checkedEvaReasonArr[nowIndex] = 0
    }
    this.setData({ checkedEvaReasonArr: checkedEvaReasonArr })
  },
  // 填写评价内容
  evaContentBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    })
  },
  initEntrustData: function (pushLogId, userId) {
    var that = this
    wx.request({
      url: app.buildRequestUrl('getEntrustHouseInfo'),
      data: {
        pushLogId: pushLogId,
        userId: userId
      },
      success: function (res) {
        wx.hideLoading()
        var status = res.data.STATUS
        var info = res.data.DATA
        if (status != 1) {
        }
        that.dealData(info, 'entrustUser')
        that.dealData(info, 'custHouseList')
        if (info.custHouseList && info.custHouseList.length > 0) {
          for (var i = 0; i < info.custHouseList.length; i++) {
            if (!!info.custHouseList[i]['tagIds']) {
              info.custHouseList[i]['tagIds'] = info.custHouseList[i]['tagIds'].split('|')
            }
            // 价格取整
            if (!!info.custHouseList[i]['houseTotalPrice']) {
              info.custHouseList[i]['houseTotalPrice'] = parseInt(info.custHouseList[i]['houseTotalPrice'])
            }
          }
          that.setData({ custHouseList: info.custHouseList })
        }
        that.setData({ userId: userId })
        var pushStatusClassJson = { 0: 1, 2: 1, 5: 2, 3: 3, 4: 4 }
        that.dealData(info, 'pushStatusClass', pushStatusClassJson[info.entrustUser.pushStatus])
        var u = info.entrustUser
        if (u.isEvaluate == 1) {
          that.getServiceEvaAction()
        }
        that.initTrackData(u.vipCaseId, u.caseType, u.cityId, userId, u.brokerArchiveId)
      },
      fail: function () {}, complete: function () {
        app.hideToast()
      }
    })
  },
  dealData: function (info, item, setValue) {
    var v = info[item]
    if (setValue !== undefined) {
      var json = {}
      json[item] = setValue
      this.setData(json)
    } else if (v !== undefined) {
      var json = {}
      json[item] = v
      this.setData(json)
    }
  },
  // 展示蒙层
  showMaskBox: function () {
    var _this = this
    // 获取当前页面层级
    var getCurrentPagesLength = getCurrentPages().length
    if (getCurrentPagesLength == 1) {
      // 分享出来页面右下角都要显示
      _this.setData({ backToIndexBtn: true })
      // 如果分享出来的详情页为首页,则展示首页按钮
      var userId = wx.getStorageSync('userId')
      // 在次设置解决延时导致没有userid 而显示不出来引导按钮的问题
      _this.setData({
        userId: userId
      })
      wx.request({
        url: app.buildRequestUrl('hasFormIdUrl'),
        // url:'http://lbuuweb.hftsoft.com/Mini/App/hasFormId',
        data: {
          youyouUserId: userId
        },
        success: function (res) {
          if (res.data.hasForm == 1) {
            _this.setData({ guideBackIndex: true })
          }
        }
      })
    }
  },
  // 支付佣金
  weikuanPrePay: function (e) {
    if (this.data.isShield == 1) {
      wx.showToast({
        title: '您已把对方屏蔽，暂时不能发起此服务',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/commissionpay/commissionpay?pushLogId=' + this.data.pushLogId + '&recomInfoId=' + this.data.recomInfoId
        + '&money=' + e.target.dataset.money + '&caseId=' + this.data.caseId + '&caseType=' + this.data.caseType
        + '&cityId=' + this.data.cityId + '&userId=' + this.data.userId
    })
  },
  getUser: function (e) {
    var that = this;

    if(wx.getStorageSync('userInfo') && that.data.userInfo){return false}
    var userInfo = e.detail.rawData
    // 更新当前 用户信息缓存
    if (!!userInfo) {
      that.setData({userInfo: JSON.parse(userInfo)})
      // 设置缓存
      wx.setStorageSync('userInfo', JSON.parse(userInfo))
    }
    wx.login({
      success: function (loginRes) {
        if (loginRes.code) {
          wx.request({
            url: app.buildRequestUrl('dealUserInfo'),
            data: {
              code: loginRes.code,
              userInfo: e.detail
            },
            success: function (res) {
              var json = res.data
              if (json.STATUS == 1) {
                try {
                  wx.setStorageSync('userId', json.DATA.userId)
                  wx.setStorageSync('openId', json.DATA.openId)
                  wx.setStorageSync('openId', json.DATA.openId)
                  app.globalData.userId = json.DATA.userId
                  app.globalData.openId = json.DATA.openId
                  that.setData({userId: json.DATA.userId})

                  var shareOpen = wx.getStorageSync('shareOpenId')
                  var shareArchive = wx.getStorageSync('shareArchiveId')
                  var shareUserId = wx.getStorageSync('shareUserId')
                  var shareCaseType = wx.getStorageSync('shareCaseType')
                  var shareCityId = wx.getStorageSync('shareCityId')
                  var shareCaseId = wx.getStorageSync('shareCaseId')
                  var youyouUserId = json.DATA.userId

                  if (!!shareArchive) {
                    wx.request({
                      url: app.buildRequestUrl('stimulerBroker'), // 2018.08.24  lwj
                      data: {
                        openId: json.DATA.openId,
                        caseType: shareCaseType,
                        cityId: shareCityId,
                        caseId: shareCaseId,
                        shareArchiveId: shareArchive,
                        youyouUserId: youyouUserId,
                        come: wx.getStorageSync('come')
                      }
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
                // 调用一下是否显示蒙层
                that.showMaskBox()
              }
            },
            fail: function (res) {
              console.log('刷新session失败！')
              console.log(res)
            },
            complete: function () {
              let userId = wx.getStorageSync('userId')
              let cityId = wx.getStorageSync('locateCityId')
              app.bindCity(userId, cityId)

              //采集用户的信息
              var cacheKey = that.data.caseId+that.data.archiveId+wx.getStorageSync('userId')+'_inDetailCount';
              var inStoreCountData = wx.getStorageSync(cacheKey);
              if(!!inStoreCountData){
                if(inStoreCountData.inStoreCount > 0){
                  behaviorTool.saveCustBehaviorForStore('13', that);
                }else{
                  behaviorTool.saveCustBehaviorForStore('12', that);
                }
              }else{
                that._getInStoreCount(function(inStoreCountData){
                  if(inStoreCountData.inStoreCount > 0){
                    behaviorTool.saveCustBehaviorForStore('13', that);
                  }else{
                    behaviorTool.saveCustBehaviorForStore('12', that);
                  }
                });
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  createCallHistory: function (callType, callImid, calledImid, callSource) {
    var that = this
    // 1语音拨打 2直拨 3IP拨打 4;400拨打 5:IM聊天 其中1语音拨打 3IP拨打小程序不行
    wx.request({
      url: app.buildRequestUrl('createCallHistory'),
      data: {
        callType: callType,
        cityId: that.data.cityId,
        callImid: callImid,
        calledImid: calledImid,
        callSource: callSource,
        resource: that.data.resource,
        deviceType: tool.isIOS() ? 2 : 1,
        caseId: that.data.caseType,
        caseType: that.data.caseType
      },
      success: function (res) {}
    })
  },
  // 显示服务评价弹窗
  showCompleteEvaDialog: function (e) {
    this.setData({
      showCompleteEvaDialog: true
    })
    app.showToast()
    this.getServiceEvaAction()
  },
  getServiceEvaAction: function () {
    var that = this
    wx.request({
      url: app.buildRequestUrl('getServiceEvaAction'),
      data: {
        pushLogId: that.data.pushLogId
      },
      success: function (res) {
        app.hideToast()
        var status = res.data.STATUS
        var data = res.data.DATA
        if (status == 1) {
          that.dealData(data, 'brokerMoney')
          that.dealData(data, 'houseMoney')
          that.dealData(data, 'priceUnit')
          that.dealData(data, 'onlinePayMoney')
          that.dealData(data, 'prizeRedMoney')
          that.dealData(data, 'brokerBuTieMoneyDesc')
          that.dealData(data, 'realPayMoney4C')
          that.dealData(data, 'offlinePayMoney')
          // 这种情况表示已经评价了
          if (data.evaStar > 0) {
            that.setData({ serverStarVal: data.evaStar })
            if (data.evaTag) {
              that.setData({ evaTag: data.evaTag.split('|') })
            }
          }
        }
      }
    })
  },
  chooseCompleteEvaStar: function (e) { // 改变成交评价星级
    this.setData({
      serverStarVal: e.target.dataset.val
    })
  },
  chooseCompleteReason: function (e) { // 选择服务评价四星以下原因
    var checkedCompleteReasonArr = this.data.checkedCompleteReasonArr
    var nowIndex = e.currentTarget.dataset.index
    if (checkedCompleteReasonArr[nowIndex] == 0) {
      checkedCompleteReasonArr[nowIndex] = 1
    } else {
      checkedCompleteReasonArr[nowIndex] = 0
    }
    this.setData({ checkedCompleteReasonArr: checkedCompleteReasonArr })
  },
  completeEvaContentBlur: function (e) { // 成交评价内容
    this.setData({
      completeEvaContent: e.detail.value
    })
  },
  submitCompleteEvaData: function () { // 提交成交评价
    app.showToast()
    var that = this
    var indexArr = []
    for (var i in that.data.checkedCompleteReasonArr) {
      if (that.data.checkedCompleteReasonArr[i] == 1) {
        indexArr.push(i)
      }
    }
    if (that.data.serverStarVal < 4 && indexArr.length == 0 && that.data.completeEvaContent.length == 0) { // 四星以下必须选择标签或填写评论
      wx.showToast({
        title: '请选择标签或填写评论指出经纪人的不足吧',
        image: '../../images/warning.png',
        duration: 1500,
        success: function () {}
      })
      return
    }
    wx.request({
      url: app.buildRequestUrl('createServiceEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        userId: app.globalData.userId,
        archiveId: that.data.brokerarchiveId,
        cityId: that.data.cityId,
        evaContent: that.data.completeEvaContent,
        evaTagIndex: indexArr.join(','),
        evaStar: that.data.serverStarVal
      },
      success: function (res) {
        app.hideToast()
        var status = res.data.STATUS
        if (status == 1) {
          wx.redirectTo({
            url: '/pages/entrustDetail/entrustDetail?pushLogId=' + that.data.pushLogId
          })
        }
      }
    })
  },checkCode: function () {
    var url = '/packageWeb/pages/webView/webView?url=' + encodeURIComponent(this.data.checkCodeFunUrl) + '&title=' + encodeURIComponent(this.data.checkCodeCityName.replace('：', ''))
    wx.navigateTo({
      url: url
    })
  },
  // 接着下面写其他方法。。。。。。
  initUnreadNum: function () {
    var _this = this
    var unreadNum = wx.getStorageSync('unreadNum') ? parseInt(wx.getStorageSync('unreadNum')) : 0
    _this.setData({
      unreadNum: unreadNum
    })
  },
  // 页面右侧提示有未读消息
  hintUnread: function () {
    var unreadNum = this.data.unreadNum + 1
    this.setData({
      unreadNum: unreadNum
    })
  },
  // 点击消息提示，跳转到联系人列表
  msgNotifyClick: function (e) {
    wx.switchTab({
      url: '/pages/news/news'
    })
  },
  getArchiveInfo:function(cb){
    var that = this;
    var archiveId = that.data.shareArchiveId ? that.data.shareArchiveId : that.data.archiveId;
    wx.request({
      url: app.buildRequestUrl('getBrokerInfo') + '?archiveId=' + archiveId,
      success: function (res) {
        if (res.data.STATUS == 1) {
          var brokerInfo = res.data.DATA
          typeof(cb) == 'function' && cb(brokerInfo);
          that.setData({ agentCont: true, archiveId: archiveId,currUserMobile: brokerInfo.USER_MOBILE,currUserPhotoUrlPath: brokerInfo.USER_PHOTO,currUserName: brokerInfo.USER_NAME})
        }
      }
    })
  },
  //跳转经纪人个人微店页面
  goToPerStore: function () {
    var url = "/pages/personalStore/personalStore?scene=" + this.data.archiveId
    wx.navigateTo({
      url: url
    })
  },
  //小区专家经纪人跳转个人微店
  goToPerStoreOwner:function(){
    var url = "/pages/personalStore/personalStore?scene=" + this.data.buildOwnerArchiveId
    console.log(url);
    wx.navigateTo({
      url: url
    })
  }
})
