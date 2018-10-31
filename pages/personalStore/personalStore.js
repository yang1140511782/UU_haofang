var app = getApp();
var api = require('../../utils/common.js');
var _im = require('../../utils/_im.js');
import {
  BehaviorTools
} from '../../utils/behaviorTools';
import {
  Tools
} from '../../utils/tools';
const tool = new Tools();
const behaviorTool = new BehaviorTools();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    acShow: false,
    indexTab: 3, //底部TAB切换
    animationData: {},
    showFlas: true,
    offFlag: false,
    scrollSearch: true, //滚动是搜索框
    toastHide: true,
    cityId: 1, //城市ID
    getListDataUrl: app.globalData.javaOnlineHost + '/uuhfWeb/secondHouseManager/getSecondHouseListAction',
    getNewBuildListUrl: app.buildRequestUrl('newBuildListUrl'), //获取新房列表
    // getNewBuildListUrl: 'http://uuweb.hftsoft.com/Mini/App/getNewBuildList',
    // getArchiveUrl: 'https://uu.haofang.net/Wap/Store/headInfo',//获取经纪人信息
    getArchiveUrl: 'http://cd.lb.net/Wap/Store/headInfo', //获取经纪人信息
    // getArchiveUrl: 'http://gray.haofang.net/Wap/Store/headInfo',//获取经纪人信息
    archiveInfo: '', //经纪人信息
    archiveId: '', //
    msgShow: false,
    tabFlag: 1,
    initLocalStorageUrl: app.buildRequestUrl('initLocalStorage'), //筛选数据接口
    getNewBuildListConditionUrl: app.buildRequestUrl('newBuildListConditionUrl'), //新房筛选数据接口

    //控制条件筛选按钮的样式
    conditionScreening: [{
        text: '区域',
        bcg: false
      }, //区域
      {
        text: '价格',
        bcg: false
      }, //价格
      {
        text: '户型',
        bcg: false
      }, //户型
      {
        text: '更多',
        bcg: false
      } //筛选
    ],

    //条件筛选 当点击区域的时候要把所有的筛选条件复原
    oldConditionScreening: [{
        text: '区域',
        bcg: false
      }, //区域
      {
        text: '价格',
        bcg: false
      }, //价格
      {
        text: '户型',
        bcg: false
      }, //户型
      {
        text: '更多',
        bcg: false
      } //筛选
    ],
    conditionModel: false, //条件弹框
    conditionModelIndex: 0, //控制是哪一个弹框显示
    regionList: [], //区域
    regionListIndex: 0, //控制选择哪一个区域的索引值
    newhouseCityList: [], //新房区域
    newhouseCityListIndex: 0, //控制选择新房区域的索引值
    regionText: '不限', //控制选择的时候哪一个区域
    RegionId: 0, //区域ID
    businessList: [ //商圈
      {
        CITY_ID: '',
        SECTION_NAME: '不限'
      }
    ],
    businessListIndex: 0,
    newhouseRegionList: [{
      regionId: '',
      regionName: "不限"
    }],
    newhouseRegionListIndex: 0,
    ifClickBuxian: false,
    roomList: [], //面积的列表
    roomListIndex: 0, //控制面积 筛选条件 的选中样式
    usageListIndex: 0, //控制新房用途 筛选条件 的选中样式
    priceList: [], //价格列表
    priceListIndex: 0, //控制价格 筛选条件 的选中样式
    useageList: [], //新房用途列表
    useageListIndex: 0, //控制用途 筛选条件 的选中样式
    ifClickBuxian: false,
    listHiden: true,
    newhouseListHiden: true,
    more_reSourceIndex: -1, //更多筛选_来源
    more_areaIndex: -1, //更多筛选_面积
    more_houseUseageIndex: -1, //更多筛选_类型
    more_specialIndex: [], //更多筛选_特色
    more_specialTag: [], //更多筛选-特色标签
    moreResetObj: { //更多筛选_重置筛选条件
      more_reSourceIndex: -1,
      more_areaIndex: -1,
      more_houseUseageIndex: -1,
      more_specialIndex: [],
      more_specialTag: []
    },
    ajaxListData: { //发送ajax请求的数据
      buildName: '', //楼盘名
      buildId: '', //楼盘ID
      sort: '', //排序
      tagId: '', //特色
      regionId: '', //区域
      sectionId: '', //商圈
      pageNum: 1, //页码
      cityId: 1, //城市ID
      caseType: 1, //查询类型
      price: '', //价格区间
      room: '', //户型
      area: '', //面积
      houseUseage: '', //类型
      youyouUserId: '', //用户Id
      archiveId: '', //经纪人ID
      fromSource: 3, //查询来源: 3公司微店
      reSource: '', //来源
      pageSize: 10
    },
    ajaxNewhouseListData: { //发送ajax请求的数据
      archiveId: '', //经济人id,save
      bCityId: '', //楼盘所在城市 id	
      brokerCityId: '', //	经纪人所在城市 id
      cityId: '',
      houseUsage: '', //房屋类型，如，别墅
      isWeiStore: 1, //是否是微店查询 0.否，1.是
      operatorType: '', //	配合经济人查询转入楼盘那些 1=转入的 2=未转入的
      pageOffset: '',
      pageRows: 10,
      regionId: '', //楼盘所在行政区域 id
      sourceType: 0, //新盘来源 0，公司内部房源；1，平台分销房源
      totalPriceMax: '', //最大总价，单位为万元
      totalPriceMin: '', //最小总价，单位为万元
    },
    isNewhouseDataFlag: false, //新房数据是否有值
    listValue: [], //房源列表数据
    listValueNext: [], //提前缓存好的下一页房源列表数据
    newhouseListValue: [], //房源列表数据
    newhouseListNext: [], //提前缓存好的下一页房源列表数据
    getNextListFlag: false, //缓存下一页数据完成的标志量
    selectCityId: '', //新房选择的城市ID
    winHeight: 0, //屏幕高度
    ajaxListTag: true, //下拉加载控制
    noMoreData: false, //没有更多数据
    ajaxNewhouseListTag: true, //新房下拉加载控制
    noMoreNewhouseData: false, //没有更多新房数据
    inputText: '', //输入框文字
    loadingdata: true, //正在加载数据
    loadingNewhouseData: true, //正在加载新房数据
    searchbox: false, //搜索弹框
    searchBuildList: [], //搜索联想楼盘名
    searchHistory: [], //搜索历史
    orderList: [], //排序列表
    orderListIndex: 0, //当前排序选项的序号
    orderBox: false, //排序弹框
    pageSize: 10, //每页返回的数据条数
    buildExpert: {}, //小区专家数据
    expertBox: false, //小区专家盒子
    discountStatus: false, //委托弹框
    userPhone: '', //用户手机号
    contactBox: false, //小区专家联系弹框
    downBox: false, //引导下载弹框
    scrollTopNum: 0, //
    scrollFlag: true, //滚动标示量
    userInfo: {},
    housePriceText: '',
    inStoreCountData: '', //用户访问
    unreadNum: 0,//总的消息未读数，包括经纪人和客服发来的消息（之所以要和brokerUnreadNum作区分是/utils/_im.js这个公用页面已经将该字段占用了，表示所有的未读消息，然后发送到所有引入了该公共文件的页面）
    brokerUnreadNum:0,//指定经纪人发来的消息未读数，不包括其他人的消息（区分原因同上）
    shareArchiveId: '',

    //关注经纪人业务
    focusStatus: 0, //是否关注该经纪人

  },

  /**
   * 关注/取消关注经纪人
   * @param {*} options 
   */
  swichFocusStatus: function () {
    let focusStatus = this.data.focusStatus
    let focusStatusNew = focusStatus == 1 ? 0 : 1;
    var that = this
    wx.request({
      url: app.buildRequestUrl('addOrRemoveAttention'),
      data: {
        wxId: wx.getStorageSync('userId'),
        archiveId: this.data.archiveId,
        status: focusStatusNew, //0 取消关注 1 添加关注
        cityId: this.data.cityId
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode === 200 && res.data.ERROR_CODE == 0) {
          //关注或取消关注成功
          this.setData({
            focusStatus: focusStatusNew
          })
        }
      },
    });
  },

  /**
   * 请求判断当前C端用户是否关注 该 经纪人
   * @param {*} options 
   */
  getFocusStatus: function () {
    let userId = wx.getStorageSync('userId')
    let archiveId = this.data.archiveId
    if (!userId || !archiveId) return
    wx.request({
      url: app.buildRequestUrl('isAttentionBroker'),
      data: {
        wxId: userId,
        archiveId: archiveId,
        cityId: this.data.cityId
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.ERROR_CODE == 0) {
            this.setData({
              focusStatus: res.data.DATA.STATUS
            })
          }
          //关注或取消关注成功
        } else {

        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var _data = that.data.ajaxListData;
    let isIphoneX = app.globalData.isIphoneX
    _data.archiveId = options.scene;
    that.setData({
      ajaxListData: _data,
      archiveId: options.scene,
      userMobile: wx.getStorageSync('userMobile'),
      locateCityName: wx.getStorageSync('locateCityName'),
      locateCityId: wx.getStorageSync('locateCityId'),
      isIphoneX: isIphoneX
    });
    if (!wx.getStorageSync('openId')) {
      wx.setStorageSync('shareArchiveId', _data.archiveId);
      app.saveUserData(function () {
        behaviorTool._getInStoreCount('', that);
      });
    }
    that.getArchiveInfo();
    that.actInit();
    var curCityId = wx.getStorageSync('cityId');
    var userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '';
    //更新城市
    that.setData({
      cityId: curCityId,
      userInfo: userInfo
    });
    that.rejectAjaxData('cityId', curCityId);
    //获取设备屏幕高度
    try {
      var res = wx.getSystemInfoSync();
      that.setData({
        winHeight: res.windowHeight
      });
    } catch (e) {

    };

    //获取是否关注当前经纪人的 状态
    this.getFocusStatus();

    //首页 -> 搜索页 ->here
    if (options.word) {
      this.setData({
        inputText: options.word
      });
      if (!!app.globalData.searchBuildId) {
        var buildId = app.globalData.searchBuildId;
        app.globalData.searchBuildId = '';
        this.rejectAjaxData('buildId', buildId);
        this.getListValue();
      } else {
        this.rejectAjaxData('buildName', options.word);
        this.getListValue();
      };
    } else {
      //初次进入页面,加载数据 (请求数据放在)
      // this.getListValue(false, true);
    };

    //获取用户电话号码
    that.setData({
      userPhone: wx.getStorageSync('userMobile')
    });

    //获取新房列表数据
    this.rejectAjaxNewhouseData('archiveId', options.scene, 'brokerCityId', wx.getStorageSync('cityId'));
    this.getNewhouseListValue(false);
    //获取筛选列表数据
    this.getRegData();

    //户型数据
    var layoutList = [{
        text: '不限',
        value: ''
      },
      {
        text: '1室',
        value: '1:1'
      },
      {
        text: '2室',
        value: '2:2'
      },
      {
        text: '3室',
        value: '3:3'
      },
      {
        text: '4室',
        value: '4:4'
      },
      {
        text: '5室',
        value: '5:5'
      },
      {
        text: '5室以上',
        value: '5:100'
      }
    ];

    //排序数据
    var orderList = [{
        text: '默认排序',
        value: ''
      },
      {
        text: '价格从低到高',
        value: '1'
      },
      {
        text: '价格从高到低',
        value: '2'
      },
      {
        text: '面积从小到大',
        value: '3'
      },
      {
        text: '面积从大到小',
        value: '4'
      },
    ];

    //用途数据
    var useageList = [{
        text: '不限',
        value: ''
      },
      {
        text: '住宅',
        value: '1'
      },
      {
        text: '别墅',
        value: '2'
      },
      {
        text: '商铺',
        value: '3'
      },
      {
        text: '写字楼',
        value: '4'
      },
    ]

    //更多筛选数据
    var more = {
      reSourceList: [{
          text: '业主房源',
          value: '0'
        },
        {
          text: '经纪人',
          value: '1'
        }
      ],
      areaList: [{
          text: '50以下',
          value: '0:50'
        },
        {
          text: '50-70',
          value: '50:70'
        },
        {
          text: '70-90',
          value: '70:90'
        },
        {
          text: '90-110',
          value: '90:110'
        },
        {
          text: '110以上',
          value: '110:999'
        }
      ],
      usageList: [{
          text: '住宅',
          value: 1
        },
        {
          text: '别墅',
          value: 2
        },
        {
          text: '商铺',
          value: 3
        },
        {
          text: '写字楼',
          value: 4
        },
        {
          text: '其他',
          value: 8
        },
      ],
      specialList: [{
          text: '两证齐全',
          value: 1
        },
        {
          text: '满两年',
          value: 2
        },
        {
          text: '免税',
          value: 3
        },
        {
          text: '急售',
          value: 4
        },
        {
          text: '学区房',
          value: 5
        },
        {
          text: '低于市价',
          value: 6
        },
        {
          text: '顶楼花园',
          value: 7
        },
        {
          text: '底楼花园',
          value: 8
        },
        {
          text: '带车位',
          value: 64
        },
        {
          text: '地下室',
          value: 96
        }
      ]
    };
    this.setData({
      roomList: layoutList,
      orderList: orderList,
      useageList: useageList,
      more_reSourceList: more.reSourceList,
      more_areaList: more.areaList,
      more_houseUseageList: more.usageList,
      more_specialList: more.specialList
    });
    //收集用户行为 进入微店
    behaviorTool.inStoreAction(this);
  },
  pushMsg: function () {
    var that = this;
    var archiveId = that.data.archiveId;
    if (archiveId > 0) {
      wx.request({
        url: app.buildRequestUrl('pushViewMsgStoreUrl'),
        data: {
          userId: wx.getStorageSync('userId'),
          archiveId: archiveId
        },
        success: function (res) {}
      })
    }
  },
  /**
   * 点击二手房房源, 进入详情页
   */
  goToHouseDetail(e) {
    var caseId = e.currentTarget.dataset.id;
    var cityId = e.currentTarget.dataset.cityid;
    var reSource = e.currentTarget.dataset.resource;
    var caseType = e.currentTarget.dataset.casetype || 1;
    var buildid = e.currentTarget.dataset.buildid;
    if (caseType == 9) {
      wx.navigateTo({
        url: "/pages/posterDetail/posterDetail?cityId=" + cityId + '&buildId=' + buildid
      });
    } else if (caseType == 6) {
      wx.navigateTo({
        url: "/pages/newHouseDetail/newHouseDetail?buildid=" + buildid + '&cityid=' + cityId + '&archive_id=' + this.data.archiveId + '&source=personalStore'
      });
    } else {
      wx.navigateTo({
        url: "/pages/houseDetail/houseDetail?casetype=" + caseType + "&resource=" + reSource + "&cityid=" + cityId + '&caseid=' + caseId + '&source=personalStore&archive_id=' + this.data.archiveId
      });
    };
  },

  /**
   * 点击新房房源, 进入详情页
   */
  goToNewhouseDetail(e) {
    var cityId = e.currentTarget.dataset.cityid;
    var buildid = e.currentTarget.dataset.buildid;
    var archiveId = this.data.archiveId;
    wx.navigateTo({
      url: "/pages/newHouseDetail/newHouseDetail?cityid=" + cityId + '&buildid=' + buildid + '&archiveId=' + archiveId + '&source=personalStore'
    });
  },
  /**
   * 滚到顶部
   */
  upper() {
    this.setData({
      scrollSearch: true,
      scrollFlag: true
    })
  },

  /**
   * 点击顶部筛选按钮的模态框事件
   */
  conditionScreeningEvent(event) {

    this.setData({
      listHiden: true ? false : true
    });
    if (this.data.conditionModel && this.data.conditionModelIndex == event.currentTarget.dataset.index) {
      //模态框存在时
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionModelIndex: 0,
      });
    } else {
      //未出现模态框
      this.setData({
        conditionModel: true,
        conditionModelIndex: event.currentTarget.dataset.index,
      });
    };
  },
  /**
   * 筛选更多-点击事件(面积, 类型)
   */
  moreClickEvent(e) {
    var item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index,
      type = e.currentTarget.dataset.type;
    var typeName = 'more_' + type + 'Index';
    if (this.data[typeName] == index) {
      var obj = {};
      this.rejectAjaxData(type, '');
      obj[typeName] = '';
    } else {
      var obj = {};
      this.rejectAjaxData(type, item.value);
      obj[typeName] = index;
    }
    this.setData(obj);
  },

  /**
   * 筛选更多(特色)-点击事件
   */
  moreSpecialClickEvent(e) {
    var item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index,
      arr = this.data.more_specialIndex,
      tagArr = this.data.more_specialTag;
    var n = arr.indexOf(index);
    if (n != -1) {
      arr.splice(n, 1);
      tagArr.splice(n, 1);
    } else {
      arr.push(index);
      tagArr.push(item.value);
      if (arr.length > 3) {
        arr.shift();
        tagArr.shift();
      };
    }
    this.setData({
      more_specialIndex: arr,
      more_specialTag: tagArr
    });
    var tagStr = tagArr.join('|');
    this.rejectAjaxData('tagId', tagStr);
  },

  /**
   * 筛选更多-重置
   */
  moreReset() {
    var obj = this.data.moreResetObj;
    this.setData(obj);
    this.rejectAjaxData('tagId', '', 'reSource', '');
    this.rejectAjaxData('houseUseage', '', 'area', '');
  },
  /**
   * 筛选更多 - 确定
   */
  moreconfirm() {
    var data = this.data;
    if (data.ajaxListData.area || data.ajaxListData.houseUseage || data.ajaxListData.tagId || data.ajaxListData.reSource) {
      var ifModify = true;
    } else {
      var ifModify = false;
    }
    var conditionScreening = this.rejectConditionScreening(
      this.data.conditionScreening,
      3,
      '更多',
      ifModify
    );
    this.setData({
      conditionModel: false,
      listHiden: true,
      conditionScreening: conditionScreening
    })
    this.getListValue();

    if (data.ajaxListData.area) {
      behaviorTool.saveCustBehaviorForStore('10', this);
    }
    if (data.ajaxListData.houseUseage) {
      behaviorTool.saveCustBehaviorForStore('11', this);
    }
  },

  /**
   * 筛选条件中的弹框点击事件
   */
  cdMaskEvent() {
    this.setData({
      listHiden: true ? true : false,
      conditionModel: false
    });
  },

  /**
   * 点击<区域>列表事件
   */
  regionListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;

    if (index > 0) {
      this.setData({
        regionText: item.REG_NAME,
        regionListIndex: index,
        businessListIndex: 0,
        RegionId: item.REG_ID,
        ifClickBuxian: true
      });

    } else {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        '区域',
        false
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        businessListIndex: 0,
        regionListIndex: 0,
        ifClickBuxian: false,
        regionText: '不限',
        RegionId: 0,
        expertBox: false,
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('regionId', '', 'sectionId', '');
      this.getListValue();
    }
  },

  /**
   * 点击新房城市列表事件
   */
  newRegionListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;
    var cityId = this.data.cityId;
    //筛选新盘
    behaviorTool.saveCustBehaviorForStore('48', this);

    if (index > 0) {
      this.setData({
        regionText: item.REG_NAME ? item.REG_NAME : '',
        newhouseRegionList: item.regList,
        newhouseCityListIndex: index,
        newhouseRegionListIndex: 0,
        selectCityId: item.cityId,
        ifClickBuxian: true,
      });
    } else {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        '区域',
        false
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        newhouseRegionList: [{
          regionId: '',
          regionName: "不限"
        }],
        newhouseRegionListIndex: 0,
        newhouseCityListIndex: 0,
        ifClickBuxian: false,
        selectCityId: '',
        expertBox: false,
        inputText: ''
      });
      this.rejectAjaxNewhouseData('cityId', this.data.cityId, 'regionId', '');
      this.getNewhouseListValue();
    }
  },

  /**
   * 点击商圈中的每个Li
   */
  businessListListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;
    if (index > 0) {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        item[0],
        true
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        businessListIndex: index,
        expertBox: false,
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('regionId', this.data.RegionId, 'sectionId', item[1]);
      this.getListValue();
    } else {
      if (!this.data.ifClickBuxian) { //如果当前区域名为[不限]
        var conditionScreening = this.rejectConditionScreening(
          this.data.conditionScreening,
          this.data.conditionModelIndex,
          '区域',
          false
        );
      } else {
        var conditionScreening = this.rejectConditionScreening(
          this.data.conditionScreening,
          this.data.conditionModelIndex,
          this.data.regionText,
          true
        );
      };

      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        businessListIndex: 0,
        expertBox: false,
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('regionId', this.data.RegionId, 'sectionId', '');
      this.getListValue();
    }

    //筛选区域行为上传
    behaviorTool.saveCustBehaviorForStore('7', this);
    //客户检索了区域，提交行为
  },

  /**
   * 点击新房区域中的每个Li
   */
  newhouseRegionListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;
    console.log(item);
    var selectCityId = this.data.selectCityId ? this.data.selectCityId : this.data.cityId;
    if (index > 0) {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        item.regionName,
        true
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        newhouseRegionListIndex: index,
        expertBox: false,
        inputText: '',
        regionText: item.regionName
      });
      this.rejectAjaxNewhouseData('cityId', selectCityId, 'regionId', item.regionId);
      this.getNewhouseListValue();
    } else {
      if (!this.data.ifClickBuxian) { //如果当前区域名为[不限]
        var conditionScreening = this.rejectConditionScreening(
          this.data.conditionScreening,
          this.data.conditionModelIndex,
          '区域',
          false
        );
      } else {
        var conditionScreening = this.rejectConditionScreening(
          this.data.conditionScreening,
          this.data.conditionModelIndex,
          this.data.regionText,
          true
        );
      };

      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        newhouseRegionListIndex: 0,
        expertBox: false,
        inputText: '',
        regionText: item.regionName
      });
      this.rejectAjaxNewhouseData('cityId', selectCityId, 'regionId', '');
      this.getNewhouseListValue();
    }
    //记录新房筛选区域
    behaviorTool.saveCustBehaviorForStore('48', this);
  },

  /**
   * 列表页点击输入框,进入搜索页
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search?casetype=1'
    });
  },

  /**
   * 搜索框点返回
   */
  backToList() {
    this.setData({
      searchbox: false,
      searchBuildList: []
    });
  },

  /**
   * 点击排序
   */
  orderClickEvent(e) {
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    if (this.data.orderListIndex == index) {
      return;
    };
    this.setData({
      orderListIndex: index,
      orderBox: false
    });
    this.rejectAjaxData('sort', item.value);
    this.getListValue();
  },

  /**
   * 点击排序按钮
   */
  orderBtnClick() {
    this.setData({
      orderBox: true
    });
  },

  /**
   * 同意切换到定位城市
   */
  changeCity: function () {
    this.setData({
      toastHide: true
    });
    if (this.data.locateCityId > 0) {
      wx.setStorageSync('cityId', this.data.locateCityId);
      wx.setStorageSync('cityName', this.data.locateCityName);
      wx.reLaunch({
        url: "/pages/real_index/index"
      });
    } else {
      wx.reLaunch({
        url: "/pages/chooseCity/chooseCity"
      });
    }
  },

  /**
   * 点击排序蒙层,关闭排序弹框
   */
  closeOrderBox() {
    this.setData({
      orderBox: false
    });
  },

  /**
   * 阻止冒泡
   */
  stopBubble() {

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
   * 点击列表页的叉
   */
  clearBuildName() {
    this.setData({
      expertBox: false,
      inputText: ''
    });
    this.rejectAjaxData('buildName', '', 'buildId', '');
    this.getListValue();
  },

  /**
   * 点击价格列表 中的每个li
   */
  priceListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;

    if (this.data.priceItemIndex == 1) {
      this.rejectAjaxData('priceUnit', '');
      this.clickLiEvent(index, 'priceListIndex', '价格', 'price', item, 'minPrice', 'maxPrice');
    } else {
      this.rejectAjaxData('price', '');
      this.clickLiEvent(index, 'priceListIndex', '价格', 'priceUnit', item, 'minPrice', 'maxPrice');
    }
    this.setData({
      listHiden: true,
      housePriceText: item.text
    });
    //记录用户筛选价格的行为
    behaviorTool.saveCustBehaviorForStore('8', this);
  },

  /**
   * 新房列表点击价格列表 中的每个li
   */
  priceNewhouseListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;
    console.log(item);
    if (index > 0) {
      this.rejectAjaxNewhouseData('priceMin', item.priceMin, 'priceMax', item.priceMax);
      this.newhouseclickLiEvent(index, 'priceListIndex', '价格', 'price', item, 'priceMin', 'priceMax');
    } else {
      this.rejectAjaxNewhouseData('priceMin', '', 'priceMax', '');
      this.newhouseclickLiEvent(index, 'priceListIndex', '价格', 'price', item, 'priceMin', 'priceMax');
    }
    this.setData({
      listHiden: true,
      housePriceText: item.text,
      minPrice: '',
      maxPrice: '',
    });

    //新房筛选价格
    behaviorTool.saveCustBehaviorForStore('49', this);
  },

  /**
   * 点击户型筛选中筛选条件
   */
  roomListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;

    this.clickLiEvent(index, 'roomListIndex', '户型', 'room', item, 'minPrice', 'maxPrice');
    this.setData({
      listHiden: true,
      roomText: item.text
    });
    //记录用户筛选户型的行为
    behaviorTool.saveCustBehaviorForStore('9', this);
  },

  /**
   * 点击用途筛选中筛选条件
   */
  useListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;


    this.newhouseclickLiEvent(index, 'usageListIndex', '用途', 'houseUsage', item);

    behaviorTool.saveCustBehaviorForStore('50', this);
    this.setData({
      listHiden: true,
    });
  },

  /**
   * 点击清除历史记录
   */
  deleteHistory() {
    this.setData({
      searchHistory: []
    });
  },

  /**
   * 点击历史记录标签
   */
  clickHistoryWord(e) {
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    var history = this.data.searchHistory;
    history.splice(index, 1);
    history.unshift({
      text: item.text,
      type: item.type
    });
    this.setData({
      inputText: item.text,
      searchbox: false,
      searchBuildList: [],
      searchHistory: history
    });
    this.rejectAjaxData('buildName', item.text);
    this.getListValue();
  },

  /**
   * 点击模态框筛选条件事件
   */
  clickLiEvent(index, listIndexKey, txt, key, item, minKey, maxKey) {
    //index 点击的li的索引值,listIndexKey,确定是哪个列表的索引，txt  默认文字
    //key,改变ajax中的KEY，minKey，maxKey最小和最大值
    //item 传过来的参数
    if (index > 0) { //除去不限,因为不限不需出现在按钮上
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        item.text,
        true
      );
      var data = {};
      data['conditionModel'] = false;
      data['conditionScreening'] = conditionScreening;
      data[listIndexKey] = index;
      this.setData(data);
    } else {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        txt,
        false
      );
      var data = {};
      data['conditionModel'] = false;
      data['conditionScreening'] = conditionScreening;
      data[listIndexKey] = 0;
      this.setData(data);
    }
    if (!!minKey || !!maxKey) {
      var data = {};
      data[minKey] = '';
      data[maxKey] = '';
      this.setData(data);
    }
    this.rejectAjaxData(key, item.value);
    this.getListValue();
  },

  newhouseclickLiEvent(index, listIndexKey, txt, key, item) {
    //index 点击的li的索引值,listIndexKey,确定是哪个列表的索引，txt  默认文字
    //key,改变ajax中的KEY
    //item 传过来的参数
    if (index > 0) { //除去不限,因为不限不需出现在按钮上
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        item.text,
        true
      );
      var data = {};
      data['conditionModel'] = false;
      data['conditionScreening'] = conditionScreening;
      data[listIndexKey] = index;
      this.setData(data);
    } else {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        txt,
        false
      );
      var data = {};
      data['conditionModel'] = false;
      data['conditionScreening'] = conditionScreening;
      data[listIndexKey] = 0;
      this.setData(data);
    }
    this.rejectAjaxNewhouseData(key, item.value);
    this.getNewhouseListValue();
  },

  /**
   * 点击立即发布
   */
  toFindHouse() {
    wx.navigateTo({
      url: '/packageTool/pages/findHouseByMap/findHouseByMap'
    });
  },

  /**
   * 先将ajax默认参数全部导入，然后修改自己要请求的的参数
   */
  rejectAjaxData(key1, value1, key2, value2) { //对参数的处理
    var data = this.data.ajaxListData;
    if (!!key1) {
      data[key1] = value1;
    };
    if (!!key2) {
      data[key2] = value2;
    };
    this.setData(data);
    this.setData({
      buildName: '输入小区名称'
    })
  },

  /**
   * 先将ajax默认参数全部导入，然后修改自己要请求的的参数
   */
  rejectAjaxNewhouseData(key1, value1, key2, value2) { //对参数的处理
    var data = this.data.ajaxNewhouseListData;
    if (!!key1) {
      data[key1] = value1;
    };
    if (!!key2) {
      data[key2] = value2;
    };
    this.setData({
      ajaxNewhouseListData: data,
    });
  },

  /**
   * 对条件筛选栏中文字和状态的处理
   */
  rejectConditionScreening(obj, index, text, tag) {
    obj[index].text = text;
    obj[index].bcg = tag;
    return obj;
  },

  /**
   * 获取房源列表信息
   */
  getListValue(blooean, firstIn) {
    var startTime = Date.now();
    //blooen  true => 滚动加载 false => 非滚动加载
    var _this = this;
    var url = _this.data.getListDataUrl;
    var params = this.data.ajaxListData;
    params = this.dealParam(params);
    var resData = this.data.listValue;

    if (blooean) {
      //从缓存中取出下一页数据
      _this.setData({
        ajaxListTag: false,
        loadingdata: true
      });

    } else {
      _this.setData({
        listValue: [],
        ajaxListTag: true,
        loadingdata: true,
      });
      this.rejectAjaxData('pageNum', 1);
    };

    //取缓存:首次进入列表页时取缓存
    var saleListData = wx.getStorageSync('saleListData');
    if (firstIn && !!saleListData) {
      saleListData = JSON.parse(saleListData);
      _this.setData({
        listValue: saleListData,
        ajaxListTag: true,
        listHiden: true,
        noMoreData: false
      });
    };

    api.getList(url, params).then(res => {
      var endTime = Date.now();
      var timeStr = (endTime - startTime) / 1000 + 's';
      console.log('\n请求接口耗时: ' + timeStr);
      console.log(params);

      var paramStr = '';
      for (var p in params) { //遍历json对象的每个key/value对,p为key
        paramStr += "&" + p + "=" + params[p];
      }
      console.log(paramStr);
      if (res.STATUS != 1) return;
      if (!res.DATA) return;
      //如果没有页面条数信息,赋值每页返回的数据条数
      if (!_this.data.pageSize) {
        _this.setData({
          pageSize: res.DATA.pageSize
        });
      };
      //如果有返回小区专家的数据,赋值
      if (res.DATA.biddBuilder.isExist != 0) {
        _this.setData({
          expertBox: true,
          buildExpert: res.DATA.biddBuilder
        });
      };
      res = res.DATA.list;
      res.map(function (ele, i) {
        if (ele['houseTagDesc']) {
          ele['houseTagDesc'] = ele['houseTagDesc'].split('|').slice(0, 3);
        } else if (ele.projectSpec) {
          if (ele['projectSpec'].indexOf('、') > -1) {
            ele['houseTagDesc'] = ele['projectSpec'].split('、').slice(0, 3);
          } else {
            ele['houseTagDesc'] = ele['projectSpec'].split(',').slice(0, 3);
          };
        } else if (ele['buildType']) {
          ele['houseTagDesc'] = ele['buildType'].split(',').slice(0, 3);
          if (ele['buildFitment']) {
            ele['houseTagDesc'].push(ele['buildFitment']);
          }
        }
        if (ele['thumbUrl']) {
          ele['thumbUrl'] = tool.addImgParamCrop(ele['thumbUrl'], 180, 120);
        };
      });

      if (true) {
        //对列表的赋值  
        if (blooean) {
          resData = !!res ? resData.concat(res) : resData;
        } else {
          resData = res;
        };
        //初次进入,列表数据存缓存
        if (firstIn) {
          var storageData = JSON.stringify(resData);
          wx.setStorageSync('saleListData', storageData);
        };
        _this.setData({
          listValue: resData,
          listValueNext: [],
          ajaxListTag: true,
          listHiden: true,
          noMoreData: false
        });
      };

      if (res.length == 0) {
        _this.setData({
          loadingdata: false
        });
      };

      if (res.length < _this.data.pageSize && res.length > 0 || res.length == 0 && _this.data.ajaxListData.pageOffset > 1) {
        _this.setData({
          ajaxListTag: false,
          loadingdata: false,
          noMoreData: true
        });
      };

      var renderTime = Date.now();
      console.log('渲染页面耗时: ' + (renderTime - endTime) / 1000 + 's');
    });
  },

  /**
   * 获取新房楼盘列表信息
   */
  getNewhouseListValue(blooean, firstIn) {
    var startTime = Date.now();
    //blooen  true => 滚动加载 false => 非滚动加载
    var _this = this;
    var url = _this.data.getNewBuildListUrl;
    var params = this.data.ajaxNewhouseListData;
    params = this.dealParam(params);
    console.log(params);
    var resData = this.data.newhouseListValue;

    if (blooean) {
      //从缓存中取出下一页数据
      _this.setData({
        ajaxNewhouseListTag: false,
        loadingNewhouseData: true
      });

    } else {
      _this.setData({
        newhouseListValue: [],
        ajaxNewhouseListTag: true,
        loadingNewhouseData: true,
      });
      this.rejectAjaxNewhouseData('pageOffset', 1);
    };

    //取缓存:首次进入列表页时取缓存
    var newhouseListData = wx.getStorageSync('newhouseListData');
    if (firstIn && !!newhouseListData) {
      newhouseListData = JSON.parse(newhouseListData);
      _this.setData({
        newhouseListValue: newhouseListData,
        ajaxNewhouseListTag: true,
        newhouseListHiden: true,
        noMoreNewhouseData: false
      });
    };

    api.getList(url, params).then(res => {
      if (res.errCode != 200) return;
      if (!res.data) return;
      res = res.data.newBuildList;
      if (_this.data.tabFlag != 3) {
        _this.setData({
          newhouseListValue: res,
          isNewhouseDataFlag: res.length > 0 ? true : false
        });
      } else {
        var endTime = Date.now();
        var timeStr = (endTime - startTime) / 1000 + 's';
        console.log('\n请求接口耗时: ' + timeStr);
        var paramStr = '';
        for (var p in params) { //遍历json对象的每个key/value对,p为key
          paramStr += "&" + p + "=" + params[p];
        }

        for (var i in res) {
          if (!!res[i].buildTag) {
            res[i].buildTag = res[i].buildTag.split(',')
            if (typeof (res[i].roomText) != 'undefined') {
              res[i].roomText = res[i].roomText.replace(/\s/g, '居、');
            }
          }
        }

        //对列表的赋值  
        if (blooean) {
          resData = !!res ? resData.concat(res) : resData;
        } else {
          resData = res;
        };
        //初次进入,列表数据存缓存
        if (firstIn) {
          var storageData = JSON.stringify(resData);
          wx.setStorageSync('newhouseListData', storageData);
        };
        _this.setData({
          newhouseListValue: resData,
          newhouseListValueNext: [],
          ajaxNewhouseListTag: true,
          NewhouseListHiden: true,
          noMoreNewhouseData: false
        });

        if (res.length == 0) {
          _this.setData({
            loadingNewhouseData: false
          });
        };

        if (res.length < _this.data.pageSize && res.length > 0 || res.length == 0 && _this.data.ajaxNewhouseListData.pageNum > 1) {
          _this.setData({
            ajaxNewhouseListTag: false,
            loadingNewhouseData: false,
            noMoreNewhouseData: true
          });
        };

        _this.setData({
          newhouseListValue: res,
          isNewhouseDataFlag: res.length > 0 ? true : false
        });
        console.log(res);
        var renderTime = Date.now();
        console.log('渲染页面耗时: ' + (renderTime - endTime) / 1000 + 's');

      }
    });
  },

  /**
   * 列表滑动到底部加载更多
   */
  lower() {
    if (this.data.tabFlag != 3) {
      if (this.data.ajaxListTag && this.data.noMoreData) {
        var data = this.data.ajaxListData;
        data.pageNum++;
        this.setData({
          ajaxListData: data
        })
        this.getListValue(true);
      }
    } else {
      if (this.data.ajaxNewhouseListTag && this.data.noMoreNewhouseData) {
        var data = this.data.ajaxNewhouseListData;
        data.pageOffset++;
        this.setData({
          ajaxNewhouseListData: data
        })
        this.getNewhouseListValue(true);
      }
    }
  },
  upper() {
    this.setData({
      scrollSearch: true,
      scrollFlag: true
    });
  },
  scrollToL(e) {
    var that = this;
    var scrollFlag = that.data.scrollFlag;
    if (!scrollFlag) {
      return false;
    };
    var topNum = e.detail.scrollTop;
    if (topNum >= 100) {
      that.setData({
        scrollSearch: false,
        scrollFlag: false
      });
    };
  },

  /**
   * 处理发送请求参数
   */
  dealParam: function (params) {
    for (var obj in params) {
      if (!params[obj]) {
        delete params[obj];
      }
    }
    return params;
  },

  /**
   * 获取区域,商圈,价格筛选数据
   */
  getRegData() {
    var _this = this;
    var cityId = _this.data.cityId;
    //是否有缓存
    var savedData = wx.getStorageSync('filterData' + cityId);
    if (!!savedData) {
      _this.initFilterData(savedData);
    } else {
      var url = _this.data.initLocalStorageUrl;
      var params = {
        cityId: _this.data.cityId
      };
      api.getList(url, params).then(res => {
        if (res.STATUS != 1) return;
        var data_str = JSON.stringify(res);
        wx.setStorageSync('filterData' + cityId, data_str);
        _this.initFilterData(data_str);
      });
    };
  },

  /**
   * 获取当前经纪人新房区域筛选条件
   */
  getNewhouseRegData() {
    var _this = this;
    var cityId = _this.data.cityId;
    var url = _this.data.getNewBuildListConditionUrl;
    var params = {
      archiveId: _this.data.archiveId,
      brokerCityId: cityId,
      compId: _this.data.archiveInfo.compId.erpCompId,
      personalVersion: 1,
    };
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var data_str = JSON.stringify(res.data);
        _this.initFilterNewhouseData(data_str);
      }
    })
  },

  /**
   * 初始化筛选数据
   */
  initFilterData(resStr) {
    var _this = this;
    var res = JSON.parse(resStr);
    console.log(res);
    //初始化区域列表
    var regionData = res.DATA.REG_DATA;
    regionData.unshift({
      REG_ID: '',
      REG_NAME: '不限'
    });

    //初始化商圈列表
    var businessData = res.DATA.SECTION_DATA;
    for (var i in businessData) {
      businessData[i].unshift(['不限', '']);
    };
    businessData['0'] = [
      ['不限', '']
    ];

    //初始化价格列表
    wx.setStorageSync('salePrice', res.DATA.SALE_PRICE_DATA);
    wx.setStorageSync('leasePrice', res.DATA.LEASE_PRICE_DATA);
    var priceData = res.DATA.SALE_PRICE_DATA;
    var arr = [];
    priceData.map(function (ele, i) {
      if (i == priceData.length - 1) {
        arr.push({
          text: ele + '万以上',
          value: ele + ':9999'
        });
      } else {
        if (i == 0) {
          arr.push({
            text: '不限',
            value: ''
          });
          arr.push({
            text: ele + '万以下',
            value: '0:' + ele
          });
        };
        var obj = {};
        obj['text'] = ele + '-' + priceData[i + 1] + '万';
        obj['value'] = ele + ':' + priceData[i + 1];
        arr.push(obj);
      };

    });
    _this.setData({
      regionList: regionData,
      businessList: businessData,
      priceList: arr,
    });
  },

  /**
   * 初始化新房筛选数据
   */
  initFilterNewhouseData(resStr) {
    var _this = this;
    var res = JSON.parse(resStr);
    console.log(res);
    //初始化区域列表
    var cityList = res.data.cityList;
    cityList.unshift({
      cityId: this.data.cityId,
      cityName: '不限'
    });
    cityList[1].regList.unshift({
      regionId: '',
      regionName: '不限'
    })
    for (var i in cityList) {
      if (!cityList[i]['regList']) {
        cityList[i]['regList'] = [{
          regionId: '',
          regionName: '不限'
        }];
      }
    }
    //初始化商圈列表
    var regionData = res.data.cityList[1].regList;
    regionData['0'] = {
      regionId: '',
      regionName: '不限'
    };
    console.log(cityList);
    _this.setData({
      newhouseCityList: cityList,
    });
  },

  /**
   * 价格输入最小值
   */
  minPriceEvent(event) {
    this.inputEvent(event.detail.value, 'minPrice');
  },

  /**
   * 价格输入最大值
   */
  maxPriceEvent(event) {
    this.inputEvent(event.detail.value, 'maxPrice');
  },


  /**
   * 价格输入最大值最小值后点筛选
   */
  minAndMaxPriceEvent(event) {
    var max = parseInt(this.data.maxPrice),
      min = parseInt(this.data.minPrice);
    var priceUnit = this.data.tabFlag == 1 ? '万元' : '元';
    this.minAndMaxEvent(min, max, 'priceListIndex', '价格', priceUnit, 'price', 'minPrice', 'maxPrice');
    //记录用户筛选价格行为
    if (this.data.tabFlag == 3) {
      behaviorTool.saveCustBehaviorForStore('8', this);
    } else {
      behaviorTool.saveCustBehaviorForStore('8', this);
    }
  },

  /**
   * 对所有输入事件的处理
   */
  inputEvent(value, data) {
    var reg = /^[0-9]{1,100}$/;
    var setInputData = {};
    if (!reg.test(value)) {
      setInputData[data] = '';
      this.setData(setInputData);
    } else {
      setInputData[data] = value;
      this.setData(setInputData);
    }
  },

  minAndMaxEvent(min, max, listIndexKey, txt, unit, key, minKey, maxKey) {
    if (!max && !min) {
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        txt,
        false
      );
      var data = {};
      data['conditionModel'] = false;
      data['conditionScreening'] = conditionScreening;
      data[listIndexKey] = 0;
      this.setData(data);
    } else {
      var text = '';
      var data;
      min = min || 0;
      max = max || 0;
      if (min == 0) {
        text = max + unit + "以下";
        data = '0:' + max;
      } else if (max == 0) {
        text = min + unit + '以上';
        data = min + ':' + 99999;
      } else {
        var temp = min;
        min = max > min ? min : max;
        max = max > temp ? max : temp;
        text = min + '-' + max + unit;
        data = min + ':' + max;
      }
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        text,
        true
      );
      var obj = {};
      obj['conditionModel'] = false;
      obj['conditionScreening'] = conditionScreening;
      obj[listIndexKey] = 999;
      obj[maxKey] = max;
      obj[minKey] = min;
      this.setData(obj);
      if (this.data.tabFlag != 3) {
        this.rejectAjaxData(key, data);
        this.getListValue();
      } else {
        this.rejectAjaxNewhouseData('priceMax', max, 'priceMin', min);
        this.getNewhouseListValue();
      }
    }
  },

  /**
   * 拨打小区专家电话
   */
  dial(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    });
  },

  /** 
   * 小区专家咨询点击
   */
  zjAgentChat() {
    this.setData({
      discountStatus: true
    })
  },

  /** 
   * 点击蒙层,关闭弹框
   */
  diCloseBtn() {
    this.setData({
      discountStatus: false
    })
  },

  /**
   * 点击蒙层,关闭弹框
   */
  closeToastBox() {
    this.setData({
      toastHide: true
    });
  },
  /**
   *  阻止冒泡
   */
  cancelBubble() {
    return false;
  },

  /** 
   * 我要买房点击跳转
   */
  goToBuyHouseBtn: function (e) {
    var _this = this;
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityId')) {
        //显示切换城市弹框
        this.setData({
          toastHide: false
        });
      } else {
        app.getLocationAgain();
      }
      return;
    }
    var _buildOwnerArchiveId = e.currentTarget.dataset.buildownerarchiveid;
    var _buildOwnerMobile = e.currentTarget.dataset.buildownermobile;
    var _buildOwnerName = e.currentTarget.dataset.buildownername;
    var _rentMoney = e.currentTarget.dataset.rentmoney;
    var _buyMoney = e.currentTarget.dataset.buymoney;
    var _serviceRegs = e.currentTarget.dataset.serviceregs;
    var _buildOwnerPicUrl = e.currentTarget.dataset.buildownerpicurl;
    var _userPhone = _this.data.userPhone;
    var caseType = 3; //3:出售     4:出租
    wx.navigateTo({
      url: '/pages/entrust/entrust?archiveId=' + _buildOwnerArchiveId + '&isVip=1' + '&userMobile=' + _buildOwnerMobile + '&userName=' + _buildOwnerName + '&rentMoney=' + _rentMoney + '&buyMoney=' + _buyMoney + '&serviceRegs=' + _serviceRegs + '&userPhoto=' + _buildOwnerPicUrl + '&caseType=' + caseType,
    })
  },
  /** 
   * 我要出租，出售点击跳转
   */
  goToEntrustLiBtn: function (e) {
    var _this = this;
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityId')) {
        //显示切换城市弹框
        this.setData({
          toastHide: false
        });
      } else {
        app.getLocationAgain();
      }
      return;
    }
    var _userPhone = _this.data.userPhone;
    var archiveId = e.currentTarget.dataset.buildownerarchiveid;
    var goToUrl = "/pages/registration/registration?caseType=1&archiveId=" + archiveId + '&isVip=1';
    wx.navigateTo({
      url: goToUrl,
    });
  },

  /**
   * 小区专家,点立即联系
   */
  showContactBox() {
    this.setData({
      contactBox: true
    });
  },

  /**
   * 点击蒙层,关闭弹框
   */
  closeContactBox() {
    this.setData({
      contactBox: false
    });
  },

  /**
   * 点击在线聊天
   */
  goToIM(e) {
    var userId = e.currentTarget.dataset.archiveid;
    var caseId = this.data.ajaxListData.buildId;
    wx.navigateTo({
      url: '/pages/im/im?caseType=6&caseId=' + caseId + '&to=' + userId
    });
  },

  /**
   * 点击隐号通话
   */
  clickHiddenCall() {
    this.setData({
      downBox: true,
      contactBox: false
    });
  },

  /**
   * 关闭引导下载弹框
   */
  closeDownBox() {
    this.setData({
      downBox: false,
      contactBox: true
    });
  },

  /**
   * 点击引导下载图片
   */
  clickToDownloadApp() {
    wx.navigateTo({
      url: "/packageWeb/pages/download/download",
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
    var _this = this;
    //列表 -> 搜索页 ->here
    var text = app.globalData.searchText;
    var buildId = app.globalData.searchBuildId;
    if (!!buildId) {
      this.setData({
        inputText: text
      });
      app.globalData.searchText = '';
      app.globalData.searchBuildId = '';
      this.rejectAjaxData('buildId', buildId, );
      this.rejectAjaxData('regionId', '', 'sectionId', '');
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        '区域',
        false
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        businessListIndex: 0,
        regionListIndex: 0,
        ifClickBuxian: false,
        regionText: '不限',
        RegionId: 0
      });
      this.getListValue();
    } else if (!!text) {
      this.setData({
        inputText: text
      });
      app.globalData.searchText = '';
      this.rejectAjaxData('buildName', text);
      this.rejectAjaxData('regionId', '', 'sectionId', '');
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        this.data.conditionModelIndex,
        '区域',
        false
      );
      this.setData({
        listHiden: true,
        conditionModel: false,
        conditionScreening: conditionScreening,
        businessListIndex: 0,
        regionListIndex: 0,
        ifClickBuxian: false,
        regionText: '不限',
        RegionId: 0
      });
      this.getListValue();
    };

    //实例化im
    if (app.globalData.accid && app.globalData.accidToken) {
      _im.initIm();
    } else {
      setTimeout(function () {
        _im.initIm();
      }, 2000)
    }
    //实例化未读数
    this.initUnreadNum();
    //每次跟新用户访问次数
    behaviorTool._getInStoreCount('', this);
  },
  /**
   * 请求经纪人信息
   */
  getArchiveInfo(cb) {
    var that = this;
    wx.request({
      url: that.data.getArchiveUrl,
      data: {
        archiveId: that.data.archiveId
      },
      success: function (res) {
        if (res.statusCode != 200) return;
        if (!!res.data.archiveInfo) {
          if (res.data.archiveInfo.length > 0) {
            that.setData({
              msgShow: true,
              cityId: res.data.archiveInfo.CITY_ID
            })
          }
          wx.setStorageSync('cityId', res.data.archiveInfo.CITY_ID);
          typeof (cb) == 'function' && cb(res.data.archiveInfo);
        }
        //获取经纪人姓名后 重置标题
        if (typeof (res.data.archiveInfo) != 'undefined' && !!res.data.archiveInfo['USER_NAME']) {
          var newTitle = res.data.archiveInfo['USER_NAME'] + '的微店';
          wx.setNavigationBarTitle({
            title: newTitle
          });
        }
        that.setData({
          leaseCount: res.data.leaseCount,
          saleCount: res.data.saleCount,
          archiveInfo: res.data.archiveInfo
        })

        let _ajaxData = that.data.ajaxListData;
        _ajaxData.cityId = res.data.archiveInfo.CITY_ID;
        //判断是精英版还是门店版
        if (typeof (res.data.archiveInfo.compId.erpCompId) != 'undefined' && res.data.archiveInfo.compId.erpCompId > 10000) {
          _ajaxData.compId = res.data.archiveInfo.compId.erpCompId;
          delete _ajaxData.archiveId;
        } else {

        }
        that.setData(_ajaxData);

        //获取筛选新房列表数据
        that.getNewhouseRegData();

        //
        //如果是初次进入页面,加载数据
        if (typeof (cb) == 'undefined') {
          that.getListValue(false, true);
        }
      }
    })
  },
  /**
   * 选择出租出售
   */
  chooseCaseType(e) {
    var that = this;
    var _priceArr = [];
    var _priceArrN = [];
    var _data = that.data.ajaxListData;
    var _type = e.currentTarget.dataset.type;
    _data.caseType = _type;
    that.setData({
      ajaxListData: _data,
      conditionScreening: [{
          text: '区域',
          bcg: false
        }, //区域
        {
          text: '价格',
          bcg: false
        }, //价格
        {
          text: '户型',
          bcg: false
        }, //户型
        {
          text: '更多',
          bcg: false
        } //筛选
      ],
      tabFlag: _type,
    })
    if (_type == 1) {
      _priceArr = wx.getStorageSync('salePrice');
      _priceArr.map(function (ele, i) {
        if (i == _priceArr.length - 1) {
          _priceArrN.push({
            text: ele + '万以上',
            value: ele + ':9999'
          });
        } else {
          if (i == 0) {
            _priceArrN.push({
              text: '不限',
              value: ''
            });
            _priceArrN.push({
              text: ele + '万以下',
              value: '0:' + ele
            });
          };
          var obj = {};
          obj['text'] = ele + '-' + _priceArr[i + 1] + '万';
          obj['value'] = ele + ':' + _priceArr[i + 1];
          _priceArrN.push(obj);
        };

      });

    } else {
      _priceArr = wx.getStorageSync('leasePrice');
      _priceArr.map(function (ele, i) {
        if (i == _priceArr.length - 1) {
          _priceArrN.push({
            text: ele + '元以上',
            value: ele + ':9999'
          });
        } else {
          if (i == 0) {
            _priceArrN.push({
              text: '不限',
              value: ''
            });
            _priceArrN.push({
              text: ele + '元以下',
              value: '0:' + ele
            });
          };
          var obj = {};
          obj['text'] = ele + '-' + _priceArr[i + 1] + '元';
          obj['value'] = ele + ':' + _priceArr[i + 1];
          _priceArrN.push(obj);
        };

      });
    }
    that.setData({
      priceList: _priceArrN
    })
    that.getListValue();
  },

  /**
   * 选择新房
   */
  chooseNewhouse(e) {
    var that = this;
    var _priceArr = [];
    var _priceArrN = [];
    var _data = that.data.ajaxListData;
    var _type = e.currentTarget.dataset.type;
    _data.caseType = _type;
    that.setData({
      ajaxListData: _data,
      tabFlag: _type,
      conditionScreening: [{
          text: '区域',
          bcg: false
        }, //区域
        {
          text: '价格',
          bcg: false
        }, //价格
        {
          text: '用途',
          bcg: false
        }, //用途
      ],
    })
    _priceArr = [8000, 10000, 15000, 20000, 25000, 35000, 50000];
    _priceArr.map(function (ele, i) {
      if (i == _priceArr.length - 1) {
        _priceArrN.push({
          text: ele + '元以上',
          priceMax: '',
          priceMin: ele
        });
      } else {
        if (i == 0) {
          _priceArrN.push({
            text: '不限',
            priceMax: '',
            priceMin: ''
          });
          _priceArrN.push({
            text: ele + '元以下',
            priceMax: ele,
            priceMin: ''
          });
        };
        var obj = {};
        obj['text'] = ele + '-' + _priceArr[i + 1] + '元';
        obj['priceMax'] = _priceArr[i + 1];
        obj['priceMin'] = ele;
        _priceArrN.push(obj);
      };

    });

    that.setData({
      priceList: _priceArrN
    });
    that.getNewhouseListValue();
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
   * 跳转至对应详情页 
   */
  skipToUrl: function (e) {
    var archiveInfo = this.data.archiveInfo;
    var type = e.currentTarget.dataset.type;
    var url = '';
    if (type == 'entrust') {
      url = '/pages/trustList/trustList';
    } else if (type == 'sale') {
      url = '/pages/registration/registration?caseType=1&archiveId=' + archiveInfo.ARCHIVE_ID + '&isVip=1';
    } else if (type == 'lease') {
      url = '/pages/registration/registration?caseType=2&archiveId=' + archiveInfo.ARCHIVE_ID + '&isVip=1';
    } else if (type == 'buy') {
      url = '/pages/entrust/entrust?archiveId=' + archiveInfo.ARCHIVE_ID + '&isVip=1&userMobile=' + archiveInfo.USER_MOBILE + '&userName=' +
        archiveInfo.USER_NAME + '&rentMoney=' + archiveInfo.RENT_MONEY + '&buyMoney=' + archiveInfo.BUY_MONEY + '&serviceRegs=' + archiveInfo.SERVICE_REG +
        '&userPhoto=' + archiveInfo.USER_PHOTO + "&caseType=3";;
    } else if (type == 'rent') {
      url = '/pages/entrust/entrust?archiveId=' + archiveInfo.ARCHIVE_ID + '&isVip=1&userMobile=' + archiveInfo.USER_MOBILE + '&userName=' +
        archiveInfo.USER_NAME + '&rentMoney=' + archiveInfo.RENT_MONEY + '&buyMoney=' + archiveInfo.BUY_MONEY + '&serviceRegs=' + archiveInfo.SERVICE_REG +
        '&userPhoto=' + archiveInfo.USER_PHOTO + "&caseType=4";
    }
    if (!!url) {
      wx.navigateTo({
        url: url
      });
    }
  },
  /**
   * 拨打电话
   */
  callTel: function (e) {
    //提交点击im行为
    behaviorTool.saveCustBehaviorForStore('3', this);

    var tel = e.currentTarget.dataset.nums;
    if (!!tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    }
  },
  /**
   * 跳转至Im 
   */
  skipToIm: function () {
    //pages/im/im?to=792740&caseId=3943633&caseType=2
    //提交点击im行为
    behaviorTool.saveCustBehaviorForStore('2', this);

    var archiveInfo = this.data.archiveInfo;
    var url = '/pages/im/im?to=' + archiveInfo.ARCHIVE_ID;
    if (!!url) {
      //清除未读数
      wx.setStorageSync('unreadNum', 0);
      wx.setStorageSync('unreadMsg', '');
      this.setData({
        brokerUnreadNum: 0
      });
      wx.navigateTo({
        url: url
      });
    }
  },

  /**
   * 切换底部tab栏
   */
  swichTab: function (e) {
    var that = this;

    var currentTab = that.data.indexTab;
    var tab = e.currentTarget.dataset.tab;
    console.log(tab);
    if (tab == 1) {
      //点击首页

      //退出微店,提交行为数据
      var inStoreCountData = behaviorTool.getInstoreCountData(that);
      if (inStoreCountData.inStoreCount) {
        behaviorTool.saveCustBehaviorForStore('6', that);
      } else {
        behaviorTool.saveCustBehaviorForStore('5', that);
      }
      wx.switchTab({
        url: '/pages/real_index/index',
      })
    }
    if (currentTab == tab) {
      return;
    }
    that.setData({
      indexTab: tab,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getListValue();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   *立即参加 
   */
  joinBtn: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/promoteActivity/promoteActivity?userId=' + app.globalData.userId,
    })
  },
  /**
   *关闭活动弹框 
   */
  offAcToast: function () {
    var that = this;
    that.setData({
      acShow: false
    })
  },
  /**
   *活动接口初始化 
   */
  actInit: function () {
    var that = this;
    var url = app.buildRequestUrl("actShowUrl");
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data) {
          var _data = res.data.DATA;
          if (!!_data) {
            if (_data.showFlag == 1) {
              that.setData({
                acShow: true
              })
            }
          }
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var userName = that.data.archiveInfo.USER_NAME ? that.data.archiveInfo.USER_NAME : '';
    var title = '金牌经纪人' + userName + '微信买房租房联系我';
    var imageUrl = that.data.archiveInfo.USER_PHOTO ? that.data.archiveInfo.USER_PHOTO : '';
    var shareObj = {
      title: title, // 默认是小程序的名称(可以写slogan等)
      imageUrl: imageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          behaviorTool.saveCustBehaviorForStore('4', that);
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    // 返回shareObj
    return shareObj;
    //提交点击im行为
  },
  /**
   * 授权弹层回调
   */
  getUser: function (e) {
    var that = this;

    if (wx.getStorageSync('userInfo') && that.data.userInfo) {
      return false
    }
    var userInfo = e.detail.rawData;
    //更新当前 用户信息缓存
    if (!!userInfo) {
      that.setData({
        userInfo: JSON.parse(userInfo)
      });
      //设置缓存
      wx.setStorageSync('userInfo', JSON.parse(userInfo));
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
              var json = res.data;
              if (json.STATUS == 1) {
                try {
                  wx.setStorageSync('userId', json.DATA.userId);
                  wx.setStorageSync('openId', json.DATA.openId);
                  app.globalData.userId = json.DATA.userId;
                  app.globalData.openId = json.DATA.openId;
                  that.setData({
                    userId: json.DATA.userId
                  });
                  var shareOpen = wx.getStorageSync('shareOpenId');
                  var shareArchive = wx.getStorageSync('shareArchiveId');
                  var shareUserId = wx.getStorageSync('shareUserId');
                  var shareCaseType = wx.getStorageSync('shareCaseType');
                  var shareCityId = wx.getStorageSync('shareCityId');
                  var shareCaseId = wx.getStorageSync('shareCaseId');
                  var youyouUserId = json.DATA.userId;

                  //请求判断当前用户是否关注了该经纪人
                  that.getFocusStatus();

                  that.getRegData();
                  if (!!shareArchive) {
                    wx.request({
                      url: app.buildRequestUrl('stimulerBroker'),
                      data: {
                        openId: json.DATA.openId,
                        caseType: shareCaseType,
                        cityId: shareCityId,
                        caseId: shareCaseId,
                        shareArchiveId: shareArchive,
                        youyouUserId: youyouUserId,
                        come: wx.getStorageSync('come')
                      }
                    });
                  }
                } catch (e) {
                  console.log(e);
                }
              }
            },
            fail: function (res) {
              console.log('刷新session失败！');
              console.log(res)
            },
            complete: function () {
              let userId = wx.getStorageSync('userId');
              let cityId = wx.getStorageSync('locateCityId');
              app.bindCity(userId, cityId);
              //采集用户的信息
              behaviorTool.getUserInfoAfter(that);
            }
          });
        } else {
          console.log('获取用户登录态失败！')
        }
      }
    })
  },
  //加载未读消息
  initUnreadNum: function () {
    var _this = this;
    //查看缓存中是否有该经纪人发来的未读消息
    var unreadMsg = wx.getStorageSync('unreadMsg');
    let unreadLen = unreadMsg.length;
    let unreadNum = 0;
    //遍历消息，查看是否有该经纪人的未读消息
    if (unreadLen > 0) {
      for (var a in unreadMsg) {
        if (unreadMsg[a].id == 'p2p-' + _this.data.archiveId) {
          unreadNum = unreadMsg[a].unread
        }
      }
    }

    _this.setData({
      brokerUnreadNum: unreadNum
    });
  },
  //页面右侧提示有未读消息
  hintUnread: function () {
    var unreadNum = this.data.unreadNum + 1;
    this.setData({
      brokerUnreadNum: unreadNum
    })
  }
})