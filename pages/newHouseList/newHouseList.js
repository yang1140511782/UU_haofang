var app = getApp();
var api = require('../../utils/common.js');
var _im = require('../../utils/_im.js');
import { Tools } from '../../utils/tools';
const tool = new Tools();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    showFlas: true,
    offFlag: false,
    cityId: '',       //城市id
    getListDataUrl: app.buildRequestUrl('getListData'),     //列表数据接口
    initLocalStorageUrl: app.buildRequestUrl('initLocalStorage'),     //筛选数据接口
    //控制条件筛选按钮的样式
    conditionScreening: [
      { text: '区域', bcg: false },    //区域
      { text: '价格', bcg: false },    //价格
      { text: '用途', bcg: false }     //户型
    ],

    //条件筛选 当点击区域的时候要把所有的筛选条件复原
    oldConditionScreening: [
      { text: '区域', bcg: false },   //区域
      { text: '价格', bcg: false },   //价格
      { text: '用途', bcg: false }    //户型
    ],
    conditionModel: false,  //条件弹框
    conditionModelIndex: 0,   //控制是哪一个弹框显示
    regionList: [], //区域
    regionListIndex: 0,    //控制选择哪一个区域的索引值
    regionText: '不限',  //控制选择的时候哪一个区域
    RegionId: 0,        //区域ID
    businessList: [    //商圈
      { CITY_ID: '', SECTION_NAME: '不限' }
    ],
    businessListIndex: 0,
    ifClickBuxian: false,
    roomList: [],  //面积的列表
    roomListIndex: 0,  //控制面积 筛选条件 的选中样式
    oldLayout: '不限',  //老户型
    oldLayoutIndex: 0,
    oldLayoutBcg: false,
    oldUse: '不限',   //老用途
    oldUseBcg: false,
    oldUseIndex: 0,
    ifClickBuxian: false,
    listHiden: true,
    more_areaIndex: -1,     //更多筛选_面积
    more_houseUseageIndex: -1,     //更多筛选_类型
    more_specialIndex: [],     //更多筛选_特色
    more_specialTag: [],        //更多筛选-特色标签
    moreResetObj: {            //更多筛选_重置筛选条件
      more_areaIndex: -1,
      more_houseUseageIndex: -1,
      more_specialIndex: [],
      more_specialTag: []
    },
    ajaxListData: {             //发送ajax请求的数据
      buildName: '',    //楼盘名
      sort: '',         //排序
      tagId: '',        //特色
      buildRegion: '',     //区域
      sectionId: '',    //商圈
      pageNum: 1,       //页码
      useageType: '',   //用途
      cityId: 1,        //城市ID
      caseType: 4,      //查询类型
      price: '',        //价格区间
      room: '',         //户型
      priceUnit:'',     //新房单价
      area: '',         //面积
      houseUseage: '',  //类型
      youyouUserId: '', //用户Id
      archiveId: '',    //经纪人ID
      fromSource: 1,    //来源
      compId: '',       //公司ID
    },
    oldAjaxListData: {
      buildName: '',    //楼盘名
      sort: '',         //排序
      tagId: '',        //特色
      buildRegion: '',     //区域
      sectionId: '',    //商圈
      pageNum: 1,       //页码
      priceUnit: '',     //新房单价
      useageType: '',   //用途
      cityId: 1,        //城市ID
      caseType: 4,      //查询类型
      price: '',        //价格区间
      room: '',         //户型
      area: '',         //面积
      houseUseage: '',  //类型
      youyouUserId: '', //用户Id
      archiveId: '',    //经纪人ID
      fromSource: 1,    //来源
      compId: '',       //公司ID
    },
    listValue: [],      //房源列表数据
    listValueNext: [],  //提前缓存好的下一页房源列表数据
    getNextListFlag: false,   //缓存下一页数据完成的标志量
    winHeight: 0,       //屏幕高度
    ajaxListTag: true,  //下拉加载控制
    noMoreData: false,  //没有更多数据
    inputText: '',      //输入框文字
    loadingdata: true,  //正在加载数据
    searchbox: false,    //搜索弹框
    searchBuildList: [],//搜索联想楼盘名
    searchHistory: [],  //搜索历史
    orderList: [],      //排序列表
    orderListIndex: 0,  //当前排序选项的序号
    orderBox: false,     //排序弹框
    priceItem: [],       //新房价格分类
    priceItemIndex: 0,   //价格分类的序号
    priceList: [],       //新房价格筛选
    priceListIndex: 0,   //新房价格序号
    scrollTopNum:0,
    scrollSearch: true,//滚动是搜索框
    scrollFlag: true,
    unreadNum: 0,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取城市ID
    //查看缓存中是否有cityId
    var cityId = wx.getStorageSync('cityId');
    if (cityId) {
      this.setData({
        cityId: cityId
      });
      this.rejectAjaxData('cityId', cityId);
    } else {
      cityId = app.globalData.cityId;
      this.setData({
        cityId: cityId
      });
      //取缓存
      wx.setStorageSync('cityId', cityId);
      this.rejectAjaxData('cityId', cityId);
    };

    //从新房周边楼盘跳转过来
    if (options.regname){
      var buildregion = options.buildregion;
      var regName = options.regname;
      this.rejectAjaxData('buildRegion', buildregion);
      var conditionScreening = this.rejectConditionScreening(
        this.data.conditionScreening,
        0,
        regName,
        true
      );
      this.setData({
        conditionScreening: conditionScreening
      });
      //获取筛选列表数据
      this.getRegData(buildregion);
    }else{
      //获取筛选列表数据
      this.getRegData();
    };

    //首页 -> 搜索页 ->here
    if (options.word) {
      this.setData({
        inputText: options.word
      });
      this.rejectAjaxData('buildName', options.word);
    }else{
      //初次进入页面,加载数据
      this.getListValue(false, true);
    }
    
     //初次进入页面,需要提前加载下一页数据
    this.getNextPageListData();

    var that = this;
    //获取设备屏幕高度
    try {
      var res = wx.getSystemInfoSync()
      that.setData({
        winHeight: res.windowHeight
      });
    } catch (e) {
      console.log('获取屏幕高度失败')
    };

    //新房价格
    var priceItem = [
      { text: '均价', value: 0 },
      { text: '总价', value: 1 }
    ];

    //户型数据
    var layoutList = [
      { text: '不限', value: '' },
      { text: '住宅', value: '1' },
      { text: '别墅', value: '2' },
      { text: '商铺', value: '3' },
      { text: '写字楼', value: '4' },
      { text: '旅游地产', value: '5' }
    ];

    //排序数据
    var orderList = [
      { text: '默认排序', value: '' },
      { text: '价格从低到高', value: '1' },
      { text: '价格从高到低', value: '2' },
      { text: '面积从小到大', value: '3' },
      { text: '面积从大到小', value: '4' },
    ];

    //更多筛选数据
    var more = {
      areaList: [
        { text: '50以下', value: '0:50' },
        { text: '50-70', value: '50:70' },
        { text: '70-90', value: '70:90' },
        { text: '90-110', value: '90:110' },
        { text: '110以上', value: '110:999' }
      ],
      usageList: [
        { text: '住宅', value: 1 },
        { text: '别墅', value: 2 },
        { text: '商铺', value: 3 },
        { text: '写字楼', value: 4 },
        { text: '其他', value: 8 },
      ],
      specialList: [
        { text: '两证齐全', value: 1 },
        { text: '满两年', value: 2 },
        { text: '免税', value: 3 },
        { text: '急售', value: 4 },
        { text: '学区房', value: 5 },
        { text: '低于市价', value: 6 },
        { text: '顶楼花园', value: 7 },
        { text: '底楼花园', value: 8 },
        { text: '带车位', value: 64 },
        { text: '地下室', value: 96 }
      ]
    };
    this.setData({
      roomList: layoutList,
      orderList: orderList,
      more_areaList: more.areaList,
      more_houseUseageList: more.usageList,
      more_specialList: more.specialList,
      priceItem
    });
    _im.initIm();

    this.initUnreadNum();
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
    }
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
    this.rejectAjaxData('tagId', '');
    this.rejectAjaxData('houseUseage', '', 'area', '');
  },

  /**
   * 筛选更多- 确定
   */
  moreconfirm() {
    var data = this.data;
    if (data.ajaxListData.area || data.ajaxListData.houseUseage || data.ajaxListData.tagId) {
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
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('buildRegion', '', 'sectionId', '');
      this.getListValue();
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
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('buildRegion', this.data.RegionId, 'sectionId', item[1]);
      this.getListValue();
    } else {
      if (!this.data.ifClickBuxian) {  //如果当前区域名为[不限]
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
        inputText: ''
      });
      this.rejectAjaxData('buildName', '', 'buildId', '');
      this.rejectAjaxData('buildRegion', this.data.RegionId, 'sectionId', '');
      this.getListValue();
    }
  },

  /**
   * 列表页点击输入框,进入搜索页
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search?casetype=4'
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
   * 搜索框输入事件
   */
  searchInputEvent(e) {
    var that = this;
    var val = e.detail.value;
    var url = this.data.online + 'getBuildByKeyWord';
    var params = {
      caseType: 1,
      cityId: 1,
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
    var item = e.currentTarget.dataset.item;
    var history = this.data.searchHistory;
    history.unshift({
      text: item.buildName,
      type: '小区'
    });
    this.setData({
      inputText: item.buildName,
      searchbox: false,
      searchBuildList: [],
      searchHistory: history
    });
    this.rejectAjaxData('buildName', item.buildName);
    this.getListValue();
  },

  /**
   * 点击搜索按钮
   */
  searchMyWord() {
    var word = this.data.inputText;
    var history = this.data.searchHistory;
    history.unshift({
      text: word,
      type: '关键字'
    });
    this.setData({
      searchbox: false,
      searchBuildList: [],
      searchHistory: history
    });
    this.rejectAjaxData('buildName', word);
    this.getListValue();
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
      inputText: ''
    });
    this.rejectAjaxData('buildName', '');
    this.getListValue();
  },

  /**
   * 点击价格列表 中的每个li
   */
  priceListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;

    if(this.data.priceItemIndex == 1){
      this.rejectAjaxData('priceUnit', '');
      this.clickLiEvent(index, 'priceListIndex', '价格', 'price', item, 'minPrice', 'maxPrice');
    }else{
      this.rejectAjaxData('price', '');
      this.clickLiEvent(index, 'priceListIndex', '价格', 'priceUnit', item, 'minPrice', 'maxPrice');
    }
    this.setData({
      listHiden: true
    });
  },

  /**
   * 点击户型筛选中筛选条件
   */
  roomListEvent(event) {
    var item = event.currentTarget.dataset.item,
      index = event.currentTarget.dataset.index;

    this.clickLiEvent(index, 'roomListIndex', '用途', 'useageType', item, 'minPrice', 'maxPrice');
    this.setData({
      listHiden: true
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
    if (index > 0) {     //除去不限,因为不限不需出现在按钮上
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

  /**
   * 先将ajax默认参数全部导入，然后修改自己要请求的的参数
   */
  rejectAjaxData(key1, value1, key2, value2) {   //对参数的处理
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
  getListValue(blooean,firstIn) {

    //blooen  true => 滚动加载 false => 非滚动加载
    var _this = this;
    var url = _this.data.getListDataUrl;
    var params = this.data.ajaxListData;
    var resData = this.data.listValue;

    if (blooean) {
      _this.setData({
        ajaxListTag: false,
        loadingdata: true
      });
      _this.getFirstListStorage();
      return;
    } 
    else {
      _this.setData({
        listValue: [],
        ajaxListTag: true,
        loadingdata: true,
      });
      this.rejectAjaxData('pageNum', 1);
    };

    //取缓存
    var newHouseListData = wx.getStorageSync('newHouseListData');
    if (firstIn && !!newHouseListData) {
      newHouseListData = JSON.parse(newHouseListData);
      _this.setData({
        listValue: newHouseListData,
        ajaxListTag: true,
        listHiden: true,
        noMoreData: false
      });
    };

    api.getList(url, params).then(res => {
      if (!res.DATA) return;
      res = res.DATA.list;
      res.map(function (ele, i) {
        //新增tagArr 用于 存放所有的tag 顺序buildTag/buildType/buildFitment

        ele['buildTagArr'] = [];

        if (ele['buildTag']) {
          ele['buildTag'] = ele['buildTag'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildTag']);
          res[i]['priceNumText'] = parseInt(ele['priceText']);
          if(ele['priceText']){res[i]['priceUnitText'] = ele['priceText'].replace(ele['priceNumText'],'');}
        };

        if (ele['buildType']) {
          ele['buildType'] = ele['buildType'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildType']);
          res[i]['priceNumText'] = parseInt(ele['priceText']);
          if(ele['priceText']){res[i]['priceUnitText'] = ele['priceText'].replace(ele['priceNumText'],'');}
        };

        if(ele['buildFitment']){
          ele['buildFitment'] = ele['buildFitment'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildFitment']);
        }

        res[i]['buildTagArr'] = ele['buildTagArr'].slice(0,3);//只取前三个标签
        var pa = ele.photoAddr;
      	if(!!pa){
      		ele.photoAddr = tool.addImgParamCrop(pa,180,120);
      	}
      });

      //
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
          wx.setStorageSync('newHouseListData', storageData);
        };
        _this.setData({
          listValue: resData,
          ajaxListTag: true,
          listHiden: true,
          noMoreData: false
        });
      };
      if (res.length == 0 || res.length < 10 && _this.data.ajaxListData.pageNum == 1) {
        _this.setData({
          loadingdata: false
        });
      };
      if (res.length < 10 && res.length > 3 && _this.data.ajaxListData.pageNum == 1 || res.length < 10 && res.length >= 0 && _this.data.ajaxListData.pageNum > 1) {
        _this.setData({
          ajaxListTag: false,
          noMoreData: true,
          loadingdata: false
        });
      };

    });
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
   * 获取列表下一页缓存数据中的一条数据
   * 
   */
  getFirstListStorage() {
    var _this = this;
    if (!_this.data.getNextListFlag) {
      //缓存ajax数据还没有返回
      setTimeout(function () {
        _this.getFirstListStorage();
      }, 1000);
      return;
    } else {
      var resData = _this.data.listValue;
      var listValueNext = _this.data.listValueNext;

      resData = !!listValueNext ? resData.concat(listValueNext) : resData;
      _this.setData({
        listValue: resData,
        listValueNext: [],    //置空下一页缓存数据
        listHiden: true,
        ajaxListTag: true,
        noMoreData: false
      });

      if (listValueNext.length == 0 && _this.data.ajaxListData.pageNum > 1) {
        _this.setData({
          ajaxListTag: false,
          noMoreData: true
        });
      } else {
        //滚动加载下一页数据
        _this.getNextPageListData();
      }
    }
  },

  /**
   * 滚动获取(加载)下一页数据
   * 
   */
  getNextPageListData() {
    var ajaxListData = this.data.ajaxListData;
    ajaxListData.pageNum++;
    this.setData({ajaxListData: ajaxListData});

    //blooen  true => 滚动加载 false => 非滚动加载
    var _this = this;
    var url = _this.data.getListDataUrl;
    var params = this.data.ajaxListData;
    var resData = this.data.listValue;
    var listValueNext = _this.data.listValueNext;
    if (listValueNext.length > 0) {
      //已经缓存了下一页数据

    } else {
      // console.log('开始加载第 ' + params.pageNum + ' 页数据'); 
      _this.setData({ getNextListFlag: false });
      api.getList(url, params).then(res => {
        if (res.STATUS != 1) return;
        if (!res.DATA) return;

        //如果没有页面条数信息,赋值每页返回的数据条数
        if (!_this.data.pageSize) {
          _this.setData({ pageSize: res.DATA.pageSize });
        };

        res = res.DATA.list;
        res.map(function (ele, i) {
        //新增tagArr 用于 存放所有的tag 顺序buildTag/buildType/buildFitment

        ele['buildTagArr'] = [];

        if (ele['buildTag']) {
          ele['buildTag'] = ele['buildTag'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildTag']);
          res[i]['priceNumText'] = parseInt(ele['priceText']);
          if(ele['priceText']){res[i]['priceUnitText'] = ele['priceText'].replace(ele['priceNumText'],'');}
        };

        if (ele['buildType']) {
          ele['buildType'] = ele['buildType'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildType']);
          res[i]['priceNumText'] = parseInt(ele['priceText']);
          if(ele['priceText']){res[i]['priceUnitText'] = ele['priceText'].replace(ele['priceNumText'],'');}
        };

        if(ele['buildFitment']){
          ele['buildFitment'] = ele['buildFitment'].split(',');
          ele['buildTagArr'] = ele['buildTagArr'].concat(ele['buildFitment']);
        }

        res[i]['buildTagArr'] = ele['buildTagArr'].slice(0,3);//只取前三个标签
          var pa = ele.photoAddr;
        	if(!!pa){
        		ele.photoAddr = tool.addImgParamCrop(pa,180,120);
        	}
        });

        //如果是滚动加载.则提前缓存好下一页的数据
        console.log('请求缓存数据完成');
        _this.setData({
          getNextListFlag: true,
          listValueNext: res,
        });
      });
    }
  },


  /**
   * 列表滑动到底部加载更多
   */
  lower() {
    if (this.data.ajaxListTag) {
      this.getListValue(true);
    }
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
   * 获取区域,商圈,价格筛选数据
   */
  getRegData(surroundRegionId) {
    var _this = this;
    var cityId = _this.data.cityId;
    //是否有缓存
    var savedData = wx.getStorageSync('filterData' + cityId);
    if (!!savedData) {
      _this.initFilterData(savedData, surroundRegionId);
    } else {
      var url = _this.data.initLocalStorageUrl;
      var params = { cityId: _this.data.cityId };
      api.getList(url, params).then(res => {
        if (res.STATUS != 1) return;
        var data_str = JSON.stringify(res);
        wx.setStorageSync('filterData' + cityId, data_str);
        _this.initFilterData(data_str, surroundRegionId);
      });
    };
  },

  /**
   * 初始化筛选数据
   */
  initFilterData(resStr, surroundRegionId) {
    var _this = this;
    var res = JSON.parse(resStr);

    //初始化区域列表
    var regionData = res.DATA.REG_DATA;
    regionData.unshift({ REG_ID: '', REG_NAME: '不限' });
    if (!!surroundRegionId) {
      var currentRegionIndex = -1;
      for (var i = 0; i < regionData.length; i++) {
        if (regionData[i].REG_ID == surroundRegionId) {
          currentRegionIndex = i;
          break;
        };
      };
      _this.setData({
        regionListIndex: currentRegionIndex,
        businessListIndex: 0,
        RegionId: surroundRegionId
      });
    };

    //初始化商圈列表
    var businessData = res.DATA.SECTION_DATA;
    for (var i in businessData) {
      businessData[i].unshift(['不限', '']);
    };
    businessData['0'] = [['不限', '']];

    //初始化价格列表
    var priceData0 = res.DATA.NEW_HOUSE_PRICE;
    var priceData1 = res.DATA.NEW_HOUSE_TOTAL_PRICE;
    var arr0 = [];
    var arr1 = [];
    var priceArr = [];
    priceData0.map(function (ele, i) {
      if (i == priceData0.length - 1) {
        arr0.push({ text: ele + '元以上', value: ele + ':9999' });
      } else {
        if (i == 0) {
          arr0.push({ text: '不限', value: '' });
          arr0.push({ text: ele + '元以下', value: '0:' + ele });
        };
        var obj = {};
        obj['text'] = ele + '-' + priceData0[i + 1] + '元';
        obj['value'] = ele + ':' + priceData0[i + 1];
        arr0.push(obj);
      };
    });
    priceData1.map(function (ele, i) {
      if (i == priceData1.length - 1) {
        arr1.push({ text: ele + '万以上', value: ele + ':9999' });
      } else {
        if (i == 0) {
          arr1.push({ text: '不限', value: '' });
          arr1.push({ text: ele + '万以下', value: '0:' + ele });
        };
        var obj = {};
        obj['text'] = ele + '-' + priceData1[i + 1] + '万';
        obj['value'] = ele + ':' + priceData1[i + 1];
        arr1.push(obj);
      };
    });
    priceArr.push(arr0,arr1);
    _this.setData({
      regionList: regionData,
      businessList: businessData,
      priceList: priceArr,
    });
  },

  /**
   * 点击价格筛选(均价,总价)
   */
  priceItemEvent(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      priceItemIndex: index,
      minPrice: '',
      maxPrice: ''
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
    var max = parseInt(this.data.maxPrice), min = parseInt(this.data.minPrice);
    if (this.data.priceItemIndex == 1) {
      this.minAndMaxEvent(min, max, 'priceListIndex', '价格', '万', 'price', 'minPrice', 'maxPrice');
    } else {
      this.minAndMaxEvent(min, max, 'priceListIndex', '价格', '元/㎡', 'priceUnit', 'minPrice', 'maxPrice');
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
    };
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
      this.rejectAjaxData(key, '');
      this.getListValue();
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
      this.rejectAjaxData(key, data);
      this.getListValue();
    }
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
    //列表 -> 搜索页 ->here
    var text = app.globalData.searchText;
    if (text) {
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  * 点击地图按钮
  */
  mapBtnClick() {
    wx.navigateTo({
      url: '/packageTool/pages/findHouseByMap/findHouseByMap?caseType=6'
    });
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