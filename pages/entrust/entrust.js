// pages/entrust/entrust.js

var app = getApp();
var api = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    initLocalStorageUrl: app.buildRequestUrl('initLocalStorage'),
    requestRepeatActionUrl: app.buildRequestUrl('requestRepeatAction'),

    publishFlow: 1,//当前流程值
    editFlow: 1,//当前编辑流程值
    slidWidth: "",//移动滑块背景底盒子总长度
    areaRange: [0, 50, 70, 100, 150, 200, 999999],//面积区间
    priceRange: [],//价格区间
    marginLeft: 0,//面积标题
    pMarginLeft: 0,//价格标题

    chooseBuildFlag: false,//选择 区域/小区
    searchLoupanBox: false,// 楼盘搜索弹框显示
    searchInputValue: '',// 搜索框的值
    buildArr: [],
    buildListLoc: [], //定位推荐的小区
    buildId:'', //楼盘id
    buildName:'', //楼盘名称
    buildRegion:'', //楼盘所在区域id
    buildRegName:'', //楼盘所在区域名称



    areaMoveViewX: 150,//面积滑块x的初始值
    priceMoveViewX: 100,//价格滑块x的初始值
    areaMoveViewXNew: 150,//面积滑块x的实时记录值
    priceMoveViewXNew: 100,//价格滑块x的实时记录值

    areaMoveChoose: '90-110㎡',//面积区间初始值
    princeMoveChoose: '',//价格区间初始值
    regIndexId: '',//当前选中的行政区的所在行数
    houseRegion: '',//行政区id
    regionName: '',//行政区名字
    houseSection: '',//商圈ID(片区id)
    sectionName: '不限',//商圈名称(片区名称)
    houseUseage: '',//用途:1住宅、2别墅、3商铺、4写字楼
    houseFitment: '',//装修:7装修不限、6豪装、3精装、2简装、1毛坯
    roomL: '',//几室-区间最小值
    roomH: '',//几室-区间最大值
    priceUnit: '',//价格-单位
    priceL: '',//价格-区间最小值
    priceH: '',//价格-区间最大值
    areaL: '',//面积[最小]
    areaH: '',//面积[最大]
    wfSex: '0',//经纪人性别，0:随机分配、1:男、2:女
    wfFee: '',//佣金比例
    descp: '',//C端客户留言信

    specialOper: '',//1:从房源详情点击的委托、0:其他业务、后续可能还会增加
    wfRelateId: '',//房源详情的ID
    resource: '',//房源来源

    cityId: '',
    wxId: '',
    caseType: '3',//委托类型（3:求购、4:求租）
    youyouUserId: '',//优优用户ID
    mustpay: '',//是否必须支付（1是、0否、2资金账户还能够满足发布意向金委托）

    isHelp: '0',//是否需要经纪人帮助填写信息-专属委托时候才需要填写，默认:0,需要:1
    isVip: '0',//是否是专属委托，0:否、1:是
    youjiaFlag: '0',//委托登记来源：2微店1优家公众号、0优优好房。默认：0
    //详情页 群发找好房 意向客户调整 
    //意向房源: "英郡 3室2厅"
    intenteHouse:'',

    //专属经纪人信息:
    vipUserInfo: {
      archiveId: '',
      userName: '',
      userPhoto: '',
      userMobile: '',
      buyMoney: '',
      rentMoney: '',
      serviceRegs: '',
    },

    //我的购房需求:
    needsList: {
      'needsSection': { needsFlow: 1, needsName3: '期望区域', needsName4: '期望区域', needsValue: '', defaultTips: '请选择区域' },
      'needsType': { needsFlow: 2, needsName3: '房屋类型', needsName4: '房屋类型', needsValue: '', defaultTips: '请选择类型' },
      'needsArea': { needsFlow: 5, needsName3: '理想面积', needsName4: '理想面积', needsValue: '', defaultTips: '请选择面积' },
      'needsPrice': { needsFlow: 6, needsName3: '购房预算', needsName4: '租房预算', needsValue: '', defaultTips: '请选择价格' },
      'needsFee': { needsFlow: 7, needsName3: '支付中介费', needsName4: '支付中介费', needsValue: '', defaultTips: '请选择中介费' },
      'needsBroker': { needsFlow: 7, needsName3: '服务经纪人', needsName4: '服务经纪人', needsValue: '', defaultTips: '男女均可' },
    },

    //当前选中的商圈数组
    sectionSelectArr: [''],//默认选中不限
    sectionSelectNameArr: [''],//当前选中商圈名字

    //主要流程值 publishFlow
    publishFlowMap: {
      '1': 'region-box',//期望区域筛选
      '2': 'useage-box',//房屋类型筛选
      '3': 'fitment-box',//房屋装修筛选
      '4': 'room-box',//房屋户型筛选
      '5': 'area-box',//理想面积筛选
      '6': 'price-box',//购房预算筛选
      '7': 'broker-sex-box',//挑选经纪人性别
      '8': 'fee-box',//购房佣金筛选

    },
    //房屋用途数组:
    useageMap: [
      { id: 1, name: "住宅", default: 1 },
      { id: 2, name: "别墅" },
      { id: 3, name: "商铺" },
      { id: 4, name: "写字楼" }
    ],
    //房屋装修数组:
    fitmentMap: [
      { id: '2', name: '简装' },
      { id: '3', name: '精装', default: 1 },
      { id: '6', name: '豪装' },
      { id: '1', name: '毛坯' },
      { id: '7', name: '不限' },
    ],
    //房屋户型数组:
    roomMap: [
      { roomL: '1', roomH: '1', name: '一室' },
      { roomL: '2', roomH: '2', name: '二室' },
      { roomL: '3', roomH: '3', name: '三室', default: 1 },
      { roomL: '4', roomH: '4', name: '四室' },
      { roomL: '5', roomH: '5', name: '五室' },
      { roomL: '5', roomH: '20', name: '五室以上' },
    ],
    //佣金比例数组:
    feeMap: {
      3: [{ fee: '0.01|0.015', name: '1-1.5', unit: '%' }, { fee: '0.015|0.02', name: '1.5-2', unit: '%' }],//求购
      4: [{ fee: '0|0.5', name: '10-15', unit: '天' }, { fee: '0.5|1', name: '15-20', unit: '天' }],//求租
    },
    //性别数组 0:随机分配、1:男、2:女
    sexMap: [
      { id: 1, name: "帅哥", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-man.png" },
      { id: 2, name: "美女", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-woman.png" },
    ],
    //原始的行政区数据
    regData: [

    ],
    businessList: [],//商圈数据
    regList: {},
    indexSectionList: [
      // ['致民路',11]
    ],
    regionToastShow: false,  //区域toast提示弹窗
    loadingShow: false,      //提交数据加载
    //
    sectionBoxShow: true,      //商圈显示
    publishErrBox: false, 
    

    // 跟悬赏委托相关变量
    openId:'',
    createCustEntrustUrl: app.buildRequestUrl('createCustEntrust'),
    prepayEntrustUrl: app.buildRequestUrl('prepayEntrust'),
    entrustRepeatBox:false,//重复发布委托提示框
    animationData: '',
    redBefore:true,
    redafter:false,
    redMaskStatus:false,
    yongjin:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();//登录验证

    var _this = this;

    //设置初始参量
    var caseType = options.caseType ? options.caseType : 3;//默认为求购类型
    var specialOper = options.specialOper ? options.specialOper : 0;//1:从房源详情点击的委托
    var yongjin = caseType == 3?1000:500;
    //是否为专属委托(房源详情页小区专家的专属委托)
    var isVip = options.isVip ? options.isVip : '0';
    //从缓存中取城市id和 userId
    var cityId = wx.getStorageSync('cityId');
    var userId = wx.getStorageSync('userId');
    _this.setData({
      caseType: caseType,
      specialOper: specialOper,
      isVip: isVip,
      cityId: cityId,
      wxId: userId,
      openId: app.globalData.openId,
      youyouUserId: userId,
      yongjin:yongjin
    });

    if (specialOper == '1') {
      //是否为群发找好房(详情页群发找好房)
      var wfRelateId = options.wfRelateId ? options.wfRelateId : '';//房源详情的ID
      var resource = options.resource ? options.resource : '';//房源来源
      var houseRegion = options.houseRegion ? options.houseRegion : '';//行政区id
      var houseSection = options.houseSection ? options.houseSection : '';//商圈ID
      var regionName = options.regionName ? options.regionName : '';//行政区名称
      var sectionName = options.sectionName ? options.sectionName : '不限';//行政区名称

      var houseUseage = options.houseUseage ? options.houseUseage : '1';//房屋类型
      var houseUseageCn = options.houseUseageCn ? options.houseUseageCn : '住宅';//房屋类型
      var houseFitment = options.houseFitment ? options.houseFitment : '3';//装修类型
      var houseFitmentCn = options.houseFitmentCn ? options.houseFitmentCn : '精装';//装修类型
      var houseRoom = options.houseRoom ? options.houseRoom : '3';//几室
      var houseTotalPrice = options.houseTotalPrice ? options.houseTotalPrice : '150';//房屋总价
      var houseArea = options.houseArea ? options.houseArea : '89.95';//房屋面积

      //意向房源文案 : 
      var houseHall = options.houseHall ? options.houseHall : '-';//房屋 几厅
      var houseWei = options.houseWei ? options.houseWei : '-';//房屋 几卫
      var buildName = options.buildName ? options.buildName : '';// 楼盘名称
      var intenteHouse = buildName + ' ' + houseRoom+ '室' + houseHall+ '厅' + houseWei+ '卫' ;

      //根据传值的 总价和房屋面积 计算价格和面积区间
      if (caseType == 3) {
        var priceH = parseInt(houseTotalPrice / 10) * 10 + 10;
        var priceL = parseInt(houseTotalPrice / 10) * 10 - 10;
        if(priceL < 0 ){priceL = 0;}
      } else {
        var priceH = parseInt(houseTotalPrice / 100) * 100 + 100;
        var priceL = parseInt(houseTotalPrice / 100) * 100 - 100;
        if(priceL < 0 ){priceL = 0;}
      }
      var areaL = parseInt(houseArea / 10) * 10 - 10;
      var areaH = parseInt(houseArea / 10) * 10 + 10;
      var priceUnitCn = _this.data.caseType == 3 ? '万' : '元';
      var princeMoveChoose = priceL + '-' + priceH + priceUnitCn;
      var areaMoveChoose = areaL + '-' + areaH + '㎡';

      //处理购房需求中的展示项
      var needsList = _this.data.needsList;
      needsList['needsSection']['needsValue'] = regionName + "(" + sectionName + ")";
      needsList['needsPrice']['needsValue'] = princeMoveChoose;
      needsList['needsArea']['needsValue'] = areaMoveChoose;

      needsList['needsBroker']['needsValue'] = "男女均可";
      if (houseUseage == 3 || houseUseage == 4) {
        needsList['needsType']['needsValue'] = houseUseageCn + '-' + houseFitmentCn;
      } else {
        needsList['needsType']['needsValue'] = houseUseageCn + '-' + houseFitmentCn + '-' + _this.getNameByRoomHFromMap(houseRoom, _this.data.roomMap);
      }

      needsList['needsFee']['needsValue'] = _this.data.caseType == 3 ? '1.5-2%' : '15-20天';

       //特殊处理  houseRegion houseSection为空的情况 2018/3/6
      if(!houseRegion || houseRegion =='0'){
        houseRegion = '';
        regionName = '';
        needsList['needsSection']['needsValue'] = '';
        houseSection = '';
        sectionName='';
      }
      if(!houseSection || houseSection =='0'){ houseSection = '';sectionName='';}

      //设置购房(租房)需求默认项
      _this.setData({
        publishFlow: 8,
        wfRelateId: wfRelateId,
        houseRegion: houseRegion,
        regionName: regionName,
        houseSection: houseSection,
        sectionName: sectionName,
        sectionSelectArr: [houseSection],//当前选中商圈
        sectionSelectNameArr: [sectionName],//当前选中商圈名字

        houseUseage: houseUseage,
        houseFitment: houseFitment,
        roomH: houseRoom,
        roomL: houseRoom,
        intenteHouse: intenteHouse,
        priceH: priceH,
        priceL: priceL,
        areaL: areaL,
        areaH: areaH,
        princeMoveChoose: princeMoveChoose,
        areaMoveChoose: areaMoveChoose,


        wfFee: _this.data.caseType == 3 ? '0.015|0.02' : '0.5|1',
        needsFee: _this.data.caseType == 3 ? '1.5-2%' : '15-20天',
        needsList: needsList,

      });

    } else if (isVip == '1') {
      //是否为专属委托(房源详情页小区专家的专属委托)
      var serviceRegs = options.serviceRegs ? options.serviceRegs : '不限';//服务区域
      var vipUserInfo = {
        archiveId: options.archiveId,   //专属委托经纪人id
        userName: options.userName,        //
        userPhoto: options.userPhoto,     //
        userMobile: options.userMobile,  //
        buyMoney: options.buyMoney,         //
        rentMoney: options.rentMoney,          //
        serviceRegs: options.serviceRegs,          //
      };

      //设置购房需求默认项
      var needsList = _this.data.needsList;
      needsList['needsType']['needsValue'] = '住宅';
      needsList['needsBroker']['needsValue'] = options.userName;
      this.setData({
        publishFlow: 8,
        isVip: isVip,
        vipUserInfo: vipUserInfo,
        houseUseage: '1',
        roomH: '0',
        roomL: '0',
        areaMoveChoose: '',
        princeMoveChoose: '',
        wfFee: this.data.caseType == 3 ? '0.015|0.02' : '0.5|1',
        needsFee: _this.data.caseType == 3 ? '1.5-2%' : '15-20天',
        needsList: needsList,

      });

    } else {
      //无缓存时,设置默认值
      _this.setData({
        houseUseage: '1',
        houseFitment: '3',
        roomH: '3',
        roomL: '3',
        wfFee: _this.data.caseType == 3 ? '0.015|0.02' : '0.5|1',
        needsFee: _this.data.caseType == 3 ? '1.5-2%' : '15-20天',
      });
    }

    //获取设备屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var slidingBlockWidth = winWidth - 16;
        _this.setData({
          slidWidth: slidingBlockWidth
        })
      }
    });

    //处理行政区商圈数据
    //是否有缓存
    var savedData = api.getStorageData('filterData_'+_this.data.cityId);
    
    if (savedData) {
      _this.formatRegData(savedData);
    } else {
      var url = _this.data.initLocalStorageUrl;
      var params = { cityId: _this.data.cityId };
      api.getList(url, params).then(res => {
        if (res.STATUS != 1) return;
        //设置行政区商圈缓存
        var storageData = JSON.stringify(res);
        //缓存行政区商圈数据 1天
        api.setStorageData('filterData_'+_this.data.cityId, storageData, 86400);
        _this.formatRegData(storageData);
      });
    }

    //根据城市及定位获取 推荐小区及 面积 价格区间
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var lat = res.latitude;
        var lng = res.longitude;

        _this.formatBaseData(_this.data.cityId, lat, lng);

      }, fail: function (e) {
        _this.formatBaseData(_this.data.cityId);
      }
    })

  },

  /**
   * 请求处理 行政区数据 和 价格/面积区间
   * 
   */
  formatBaseData: function (cityId, lat, lng) {
    var _this = this;
    var _caseType = _this.data.caseType;//求租，求购状态
    if(!!_this.data.cityId){return false}
    lat = !!lat ? lat : '';
    lng = !!lng ? lng : '';
    wx.request({
      url: app.buildRequestUrl('getBaseInfo4Entrust'),
      data: {
        cityId: _this.data.cityId,
        dlat: lng,
        dlng: lat,
      },
      success: function (res) {
        var data = res.data.DATA;
        if (res.statusCode == 200 && !!data) {
          var buildListLoc = !!data.buildList ? data.buildList : [];

          var _priceUnit = _caseType == 1 ? '万' : '元';
          var _priceArr = _caseType == 1 ? data.salePriceList : data.leasePriceList;
          _priceArr.map(function (item, i) {
            _priceArr[i] = parseInt(item);
          })
          var _areaArr = _caseType == 1 ? data.saleArea : data.leaseArea;
          _areaArr.map(function (item, i) {
            _areaArr[i] = parseInt(item);
          })
          var price = _priceArr[2];
          var houseArea = _areaArr[2];

          //设置滑块初始值 总范围 250
          _this.setData({
            // priceRange: _priceArr,
            // areaRange: _areaArr,
            buildListLoc: buildListLoc,
            // price: price,
            // priceUnit: _priceUnit,
            // houseArea: houseArea,
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //页面编辑返回
    //设置编辑后的默认值
    var editDataStr = wx.getStorageSync('publishEntrustData');//取缓存
    if (!!editDataStr) {
      var editData = JSON.parse(editDataStr);
      _this.setData(editData);
    }
  },

  /**
   * 请求处理行政区数据 和 价格/面积区间
   */
  formatRegData: function (resStr) {
    var _this = this;
    var res = JSON.parse(resStr);
    var _caseType = _this.data.caseType;//求租，求购状态
    //判断是求购/求购的时候，定义价格区间数组取值，及初始区间
    var _priceStr = _caseType == 3 ? res.DATA.BUY_PRICE_DATA : res.DATA.RENT_PRICE_DATA;
    var _priceUnit = _caseType == 3 ? '万' : '元';
    var _priceArr = (_priceStr).split(",");
    var _newPriceArr = [];
    for (var i = 0; i < _priceArr.length; i++) {
      if (_newPriceArr.indexOf(Number(_priceArr[i])) == -1) {
        _newPriceArr.push(Number(_priceArr[i]))
      } else {
        return
      }
    }
    _newPriceArr.unshift(0);
    _newPriceArr.push(999999);
    var priceL = _caseType == 3 ? (_newPriceArr[2] - 10) : (_newPriceArr[2] - 100);
    var priceH = _caseType == 3 ? (_newPriceArr[2] + 10) : (_newPriceArr[2] + 100);
    var princeMoveChoose = priceL + '-' + priceH + _priceUnit;

    if (_this.data.specialOper != '1') {
      //非详情页进入的委托需要设置价格面积区间的默认值
      _this.setData({
        priceRange: _newPriceArr,
        princeMoveChoose: princeMoveChoose,
        priceL: priceL,
        priceUnit: _priceUnit,
        priceH: priceH,
        areaL: (_this.data.areaRange[3] - 10),
        areaH: (_this.data.areaRange[3] + 10)
      });
    } else {
      //如果为详情的群发找好房委托
      //计算价格滑块和面积滑块的偏移距离
      var areaMoveViewXNew = _this.getMoveViewX(_this.data.areaL, _this.data.areaH, _this.data.areaRange);
      var priceMoveViewXNew = _this.getMoveViewX(_this.data.priceL, _this.data.priceH, _newPriceArr);
      _this.setData({
        areaMoveViewXNew: areaMoveViewXNew,
        priceMoveViewXNew: priceMoveViewXNew,
        priceRange: _newPriceArr
      });
    }

    //初始化商圈列表
    var businessData = res.DATA.SECTION_DATA;
    for (var i in businessData) {
      businessData[i].unshift(['不限', '']);
    };

    //初始化区域数据
    var regData = res.DATA.REG_DATA;
    _this.setData({ regData: regData });

    //非详情页群发委托及专属委托 , 如果有定位区域 , 默认选中行政区域
    if(_this.data.isVip != '1' && _this.data.specialOper != '1'){
        let locateRegId = wx.getStorageSync('locateRegId');
        let locateRegName = wx.getStorageSync('locateRegName');
        if(locateRegId > 0){
          let regIndexId = 1;
          regData.map(function(ele, i){
           if(ele.REG_ID == locateRegId){regIndexId = i}
          });
          console.log(regIndexId)
          regIndexId = Math.ceil((regIndexId+1)/4);
           console.log(regIndexId)
          
          var indexSectionData = businessData[locateRegId];//获取定位行政区商圈列表
          _this.setData({
            houseRegion: locateRegId,
            regionName: locateRegName,
            sectionBoxShow: true,
            indexSectionList: indexSectionData,
            regIndexId: regIndexId,
          });
        }
    }

    //如果是vip专属委托, 则只能在经纪人的服务区域内旋转
    if (_this.data.isVip == 1) {
      var regDataNew = [];
      var serviceRegs = _this.data.vipUserInfo.serviceRegs;
      var serviceRegArr = serviceRegs.split(',');
      regData.forEach(function (item) {
        if (serviceRegArr.indexOf(item.REG_ID) > -1) {
          regDataNew.push(item);
        }
      });
      regData = regDataNew;
      var needsList = _this.data.needsList;
      needsList['needsSection']['needsValue'] = regData[0].REG_NAME + '(不限)';
      _this.setData({
        needsList: needsList,
        houseRegion: regData[0].REG_ID,
        regIndexId: 1,
        regionName: regData[0].REG_NAME,
        houseSection: '',
        sectionName: '不限',
        princeMoveChoose: '',
        sectionBoxShow: true,
        indexSectionList: businessData[regData[0].REG_ID],
        priceL: '',
        priceH: '',
        areaL: '',
        areaH: '',
      });
    }

    var regLiArr = [];
    var regList = {};
    for (var i = 0; i < regData.length; i++) {
      var regListIndex = parseInt(i / 4);
      regData[i]['index'] = regListIndex + 1;
      if (regLiArr.length == 4) {
        regList[regListIndex] = regLiArr;
        regLiArr = [];
      }
      regLiArr.push(regData[i]);
      if (i + 1 == regData.length && regLiArr.length > 0) {
        //最后一个
        regList[regListIndex + 1] = regLiArr;
      }
    };

    //更新缓存
    var publishEntrustDataStr = wx.getStorageSync('publishEntrustData');//取缓存
    if (!!publishEntrustDataStr) {
      var publishEntrustData = JSON.parse(publishEntrustDataStr);
      publishEntrustData['regList'] = regList;
      publishEntrustData['businessList'] = businessData;
      publishEntrustDataStr = JSON.stringify(publishEntrustData);
      wx.setStorageSync('publishEntrustData', publishEntrustDataStr);//更新设置缓存
    }

    _this.setData({
      regList: regList,
      businessList: businessData,
    });

  },

  /**
   * 点击行政区
   */
  regTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var regId = e.currentTarget.dataset.id;
    var regName = e.currentTarget.dataset.name;

    var indexSectionData = this.data.businessList[regId];//获取当前行政区商圈列表
    if (!indexSectionData) {
      indexSectionData = [["不限", ""]]
    }
    if (regId == this.data.houseRegion) {
      //如果点击的是当前选中的行政区
      var sectionBoxShow = this.data.sectionBoxShow;
      this.setData({ sectionBoxShow: !sectionBoxShow });
      return;
    } else {

      this.setData({
        sectionBoxShow: true,
        houseRegion: regId,
        regionName: regName,
        houseSection: '',
        sectionName: '不限',
        sectionSelectArr: [''],//当前选中商圈数组清空
        sectionSelectNameArr: ['不限'],//当前选中商圈数组清空
        indexSectionList: indexSectionData,
        regIndexId: index,//切换当前显示第几行的商圈块
      });
    }

  },
  /**
   * 点击选中商圈
   */
  sectionTap: function (e) {
    var selectArr = this.data.sectionSelectArr;
    var selectNameArr = this.data.sectionSelectNameArr;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    if (id == '') {
      selectArr = [''];//选中的是不限
      selectNameArr = ['不限'];//选中的是不限
    } else {
      if (selectArr.indexOf(id) > -1) {
        //当前选中,则移除当前选中中状态
        selectArr.splice(selectArr.indexOf(id), 1);
        selectNameArr.splice(selectNameArr.indexOf(name), 1);
      } else {
        if (selectArr.indexOf('') > -1) {
          selectArr.splice(selectArr.indexOf(''), 1);//如果当前选中项里有不限,移除他
          selectNameArr.splice(selectNameArr.indexOf('不限'), 1);//如果当前选中项里有不限,移除他
        }
        if (selectArr.length >= 3) { selectArr.shift(); }
        if (selectNameArr.length >= 3) { selectNameArr.shift(); }
        selectArr.push(id);
        selectNameArr.push(name);
      }
    }
    var selectArrStr = selectArr.join(',');
    var selectNameArrStr = selectNameArr.join(',');
    this.setData({
      houseSection: selectArrStr,
      sectionSelectArr: selectArr,
      sectionSelectNameArr: selectNameArr,
      sectionName: selectNameArrStr,
    });
  },

  /**
   * 选择房屋类型
   */
  useageTap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ houseUseage: id });
  },
  /**
   * 选择房屋装修
   */
  fitmentTap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ houseFitment: id });
  },
  /**
   * 选择房屋户型
   */
  roomTap: function (e) {
    var roomL = e.currentTarget.dataset.rooml;
    var roomH = e.currentTarget.dataset.roomh;
    this.setData({ roomL: roomL, roomH: roomH });

  },
  /**
  * 选择佣金比例
  */
  feeTap: function (e) {
    var fee = e.currentTarget.dataset.fee;
    var name = e.currentTarget.dataset.name;
    this.setData({
      wfFee: fee,
      needsFee: name,
    });
  },
  /**
  * 留言输入
  */
  remarkInput: function (e) {
    var inputValue = e.detail.value;
    this.setData({ descp: inputValue });
  },
  /**
    * 经纪人性别选择
    */
  sexTap: function (e) {
    var id = e.currentTarget.dataset.id;
    var indexId = this.data.wfSex;
    if (id == indexId) { id = 0 };
    this.setData({ wfSex: id });
  },

  /**
   * 根据id在map数组中获取名字
   */
  getNameByIdFromMap: function (id, map) {
    var returnName = '';
    map.forEach(function (item) {
      if (item.id == id) { returnName = item.name }
    });
    return returnName;
  },
  /**
   * 根据roomH在map数组中获取户型名字
   */
  getNameByRoomHFromMap: function (roomH, map) {
    var returnName = '';
    map.forEach(function (item) {
      if (item.roomH == roomH) { returnName = item.name }
    });
    return returnName;
  },

  /** 
   * nextTap:点击 下一步 
   * 备注: 2018-04-12 修改流程 : 合并 原有 2-6 为 第二大流程; 
   * 
   * */
  nextTap: function (e) {
    var _this = this;
    var indexFlow = this.data.publishFlow;
    
    if (indexFlow == 1 && !this.data.chooseBuildFlag) {
      //通过区域选择但是没有选择区域时需要提示
      if(_this.data.houseRegion == ''){
        wx.showToast({title: '请选择区域',icon: 'none',duration: 1000})
        return;
      }
      //已经选择了 区域发布委托 , 则需要 清除已经选择的 buildId 和 buildName
      _this.setData({
        buildId:'',
        buildName:''
      });
      
    }

    if (indexFlow == 1 && !!_this.data.chooseBuildFlag) {
      //选择 指定 小区 但是没有选择小区时需要提示
      if(_this.data.buildName == ''){
        wx.showToast({title: '请选择小区',icon: 'none',duration: 1000})
        return;
      }

      //已经选择了指定小区, 则需要清空 区域选择中的 商圈, 行政区更新为 小区所在区域
      _this.setData({
        houseSection: '',
        sectionName: '不限',
        houseRegion: _this.data.buildRegion,
        regionName:_this.data.buildRegName,
      });
      
    }

    // 如果当前流程为 2-6中任意一个 , 则直接跳转至流程7;
    if(1<indexFlow && indexFlow < 7){
      var nextFlow = 7;
    }else{
      var nextFlow = indexFlow + 1;
    }

    // if (indexFlow == 3 && (this.data.houseUseage == '3' || this.data.houseUseage == '4')) {
    //   //当前流程为装修, 如果 之前房屋类型为 商铺:3,则跳过 户型选择
    //   nextFlow += 1;
    // }

    //更新我的购房需求显示字段
    this.updataNeedsList(nextFlow);
    this.setData({ publishFlow: nextFlow });//切换当前显示第几行的商圈块
  },

  /**
  * 更新我的购房需求显示字段
  */
  updataNeedsList: function (indexFlow) {
    var _data = this.data;
    //期望区域
    var needsSection = _data.regionName + "(" + _data.sectionName + ")";

    //如果是选择的小区 
    if(!!_data.chooseBuildFlag){
      needsSection = _data.buildName;
    }
    var needsName3 = !_data.chooseBuildFlag?"期望区域":"指定小区";
    var needsName4 = !_data.chooseBuildFlag?"期望区域":"指定小区";

    //房屋类型
    var needsType = '';
    var houseUseage = this.getNameByIdFromMap(_data.houseUseage, _data.useageMap);
    var houseFitment = this.getNameByIdFromMap(_data.houseFitment, _data.fitmentMap);
    var houseRoom = this.getNameByRoomHFromMap(_data.roomH, _data.roomMap);

  
    //房屋类型字段区分 : 房屋类型为 商铺和写字楼 的情况
    if (_data.houseUseage == 3 || _data.houseUseage == 4) {
      if(!!houseFitment){
        needsType = houseUseage + "-" + houseFitment;
      }else{
        needsType = houseUseage;
      }
          
    } else {
      if(!!houseFitment && !!houseRoom){
         needsType = houseUseage + "-" + houseFitment + "-" + houseRoom;
      }else if(!!houseFitment){
         needsType = houseUseage + "-" + houseFitment;

         needsType = houseUseage;
      }else if(!!houseRoom){
         needsType = houseUseage + "-" + houseRoom;
      }else{
        needsType = houseUseage;
      }
    }
    
    

    //理想面积 
    var needsArea = _data.areaMoveChoose;
    //购房预算
    var needsPrice = _data.princeMoveChoose;
    //支付中介费
    var needsFee = _data.needsFee;

    
    //服务经纪人
    var wfSex = _data.wfSex;
    var needsBroker = '男女均可';
    if (wfSex == 1) {
      var needsBroker = '帅哥';
    } else if (wfSex == 2) {
      var needsBroker = '美女';
    }
    // VIP时写死为专属经纪人姓名
    if(_data.isVip == 1){
        needsBroker = data.vipUserInfo.userName
    }


    var needsList = _data.needsList;
    needsList['needsSection']['needsValue'] = needsSection;
    needsList['needsSection']['needsName3'] = needsName3;
    needsList['needsSection']['needsName4'] = needsName4;
    needsList['needsType']['needsValue'] = needsType;
    needsList['needsArea']['needsValue'] = needsArea;
    needsList['needsPrice']['needsValue'] = needsPrice;
    needsList['needsFee']['needsValue'] = needsFee;
    needsList['needsBroker']['needsValue'] = needsBroker;
    this.setData({ needsList: needsList });
  },

  /**
   * 购房需求再次编辑
   */
  needsEditTap: function (e) {
    var _this = this;
    if (_this.data.publishFlow != 8) { return };//只有进行到最后一步才可以编辑
    var editFlow = e.currentTarget.dataset.flow;//当前编辑的流程
    _this.setData({ editFlow: editFlow });
    //设置当前页面数据缓存
    var _data = _this.data;
    var storageData = JSON.stringify(_data);
    wx.setStorageSync('publishEntrustData', storageData);

    //跳转进入编辑页
    wx.navigateTo({ url: "/pages/entrustEdit/entrustEdit?caseType=" + _this.data.caseType + '&editFlow=' + editFlow });

  },
  /**
   * 点击 群发委托
   * @param publishType : 发布委托类型 , 1: 普通委托 , 2: 悬赏委托
   */
  submitTap: function (publishType) {
    if(!publishType)publishType = 1;
    var _this = this;
    var _data = _this.data;
    //如果是专属委托, 需要判断是否需要帮填
    if (_data.isVip == 1) {
      if (!_data.houseFitment || !_data.roomL || !_data.roomH || !_data.priceL || !_data.priceH || !_data.areaH || !_data.areaL) {
        _data.isHelp = 1;
      }
    }

    //设置当前页面数据缓存

    var storageData = JSON.stringify(_data);

    wx.setStorageSync('publishEntrustData', storageData);

    _this.setData({ loadingShow: true });//显示加载中弹窗


    //请求接口判断 是否能够发布
    var requestUrl = this.data.requestRepeatActionUrl;
    var params = {
      cityId: this.data.cityId,
      youyouUserId: this.data.wxId,
    };
    api.getList(requestUrl, params).then(res => {
      
      if (res.STATUS != 1) {
        _this.setData({ loadingShow: false });//隐藏加载中弹窗
        wx.showToast({
          title: res.INFO,
          duration: 2000
        });
        return;
      }
      var data = res.DATA;
      if (data.type == 0) {
        //不能发布委托 : 您只能发布3个委托
        _this.setData({ loadingShow: false,publishErrBox: true });//隐藏加载中弹窗
        return;
      } else {
        //可以发布:跳转至支付意向金页面
        var mustpay = data.mustpay;//等于2时，点击支付意向金时直接调用登记委托，弹出推送经纪人页面，不需要调用支付

        _this.setData({mustpay:mustpay});
        
        if(publishType == 1){
          //发布普通委托
          _this.submitEntrust(0);
        }else{
          //发布悬赏委托
          if(_this.data.mustpay == 2){
            //不需要调用支付,直接发布
            _this.submitEntrust(2);
          }else{
           //需要先调支付,才能发布 mustpay:
            _this.submitEntrust(1);
          }
        }
        // wx.navigateTo({ url: "/pages/rewardInstruction/rewardInstruction?mustpay=" + mustpay });
      }
    });
  },

  
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    wx.removeStorageSync('publishEntrustData');
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
   * 重新选择条件
   */
  reChooseCondition:function(){
      this.setData({publishFlow:1});
  },

  
  /**
   * 根据 面积/价格 初始值计算 滑块当前应当的偏移量 (300总长)
   * @param numL 价格或面积(详情页传来的初始值)
   * @param numH 价格或面积(详情页传来的初始值)
   * @param range : 范围数组 :[0, 50, 70, 100, 150, 200, 999999]
   */
  getMoveViewX: function (numL, numH, range) {
    var _this = this;
    var index = 0, percent = 0;
    var moveViewXNew = 150, moveViewMax = 300;
    var num = (numL + numH) / 2;
    if (num == 0) { return 0; }//
    for (var i = 0; i < range.length; i++) {
      if (i > 0) {
        if (range[i] > num && num > range[i - 1]) {
          index = i - 1;
          percent = (range[i] - num) / (range[i] - range[i - 1]);
        } else if (range[i] == num) {
          index = i;
          percent = 0;
        }
      }
    }
    moveViewXNew = parseInt(moveViewMax / 6 * (index + percent));
    return moveViewXNew;
  },
  /**
   * 面积滑块拖拽
   */
  dragAreaMoveBtn: function (e) {
    var _this = this;
    var scollWidth = _this.data.slidWidth,//外层盒子宽度
      areaP = _this.data.areaRange;
    //设置偏移量
    var areaMoveViewXNew = e.changedTouches[0].clientX - 35;
    _this.setData({ areaMoveViewXNew: areaMoveViewXNew });
    var _clientX = e.changedTouches[0].clientX - 8;
    if (_clientX >= 280) {
      _this.setData({ marginLeft: 20 })
    }
    if (_clientX < 280) {
      _this.setData({ marginLeft: 0 })
    }
    _this.calculateCurrentArea(_clientX, scollWidth, areaP)
  },
  /**
  * 价格滑块拖拽
  */
  dragPrinceMoveBtn: function (e) {
    var _this = this;
    var scollWidth = _this.data.slidWidth,
      princeP = _this.data.priceRange;
    //设置偏移量
    var priceMoveViewXNew = e.changedTouches[0].clientX - 35;
    _this.setData({ priceMoveViewXNew: priceMoveViewXNew });
    var _clientX = e.changedTouches[0].clientX - 8;
    if (_clientX >= 280) {
      _this.setData({
        pMarginLeft: 20
      })
    }
    if (_clientX < 280) {
      _this.setData({
        pMarginLeft: 0
      })
    }
    // console.log(_clientX)
    _this.calculateCurrentPrince(_clientX, scollWidth, princeP)
  },
  /**
 * 面积滑块当前的面积
 *  oLeft 距离左边的值
 *  scrollLength 滑槽总长度
 *  priceRange 价格范围
 * */
  calculateCurrentArea: function (oLeft, scrollLength, priceRange) {
    var _this = this;
    var priceStart, priceEnd, priceStr;//定义起始值
    var percent = oLeft * 6 / scrollLength;
    var index = parseInt(percent);//当前索引值

    percent = percent - index;//所在区间占比
    if (index == 0) {
      priceStart = 0, priceEnd = priceRange[1];
      priceStr = priceEnd + '㎡以下';
     
    } else if (index >= 5) {
      priceStart = priceEnd = priceRange[5], priceEnd = priceRange[6];
      priceStr = priceStart + '㎡以上';
      
    } else {
      var divide = priceRange[index + 1] - priceRange[index];//区间价格跨度
      priceStart = priceRange[index] + parseInt(divide * percent);
      //起始值向下取整
      priceStart = parseInt(priceStart / 10) * 10;
      //结束值 = 起始值 + 区间值 * 0.3
      priceEnd = parseInt(priceStart + divide * 0.3);
      //结束值向上取整
      priceEnd = parseInt((priceEnd + 10) / 10) * 10;
      //显示值
      priceStr = priceStart + '-' + priceEnd + '㎡';
      
    }
    _this.setData({
        areaL: priceStart,
        areaH: priceEnd,
        areaMoveChoose: priceStr
      })
  },
  /**
* 价格滑块当前的价格
*  oLeft 距离左边的值
*  scrollLength 滑槽总长度
*  priceRange 价格范围
* */
  calculateCurrentPrince: function (oLeft, scrollLength, priceRange) {
    var _this = this;
    var priceStart, priceEnd, priceStr;//定义起始值
    var percent = oLeft * 6 / scrollLength;
    var index = parseInt(percent);//当前索引值
    percent = percent - index;//所在区间占比
    var priceUnitCn = _this.data.caseType == 3 ? '万' : '元';
    if (index == 0) {
      priceStart = 0, priceEnd = priceRange[1];
      priceStr = priceEnd + priceUnitCn + '以下';
    } else if (index >= 5) {
      priceStart = priceEnd = priceRange[5], priceEnd = priceRange[6];
      priceStr = priceStart + priceUnitCn + '以上';
    } else {
      var divide = priceRange[index + 1] - priceRange[index];//区间价格跨度
      if (_this.data.caseType == 3) {
        priceStart = priceRange[index] + parseInt(divide * percent);
        //起始值向下取整
        priceStart = parseInt(priceStart / 10) * 10;
        //结束值 = 起始值 + 区间值 * 0.3
        priceEnd = parseInt(priceStart + divide * 0.3);
        //结束值向上取整
        priceEnd = parseInt((priceEnd + 10) / 10) * 10;

      } else {
        priceStart = priceRange[index] + parseInt(divide * percent);
        //起始值向下取整
        priceStart = parseInt(priceStart / 100) * 100;
        //结束值 = 起始值 + 区间值 * 0.3
        priceEnd = parseInt(priceStart + divide * 0.3);
        //结束值向上取整
        priceEnd = parseInt((priceEnd + 100) / 100) * 100;
      }

      //显示值
      priceStr = priceStart + '-' + priceEnd + priceUnitCn;
    }
    _this.setData({
        priceL: priceStart,
        priceH: priceEnd,
        princeMoveChoose: priceStr
      })
  },

  
/** 与发布委托相关的方法(2018-04-16 调整至同一页面):  **/ 
/**
   * 支付悬赏金
   * @param moneyPay: 支付金额
   * @param skipUrl: 支付成功后的
   */
  prepayEntrust:function(moneyPay,skipUrl,caseId,caseType,cityId){

    var _this = this;
      wx.request({
          url: _this.data.prepayEntrustUrl,
          data: {
              openId:_this.data.openId,
              wxId:_this.data.wxId,
              caseId:caseId,
              caseType:caseType,
              cityId:cityId,
              moneyPay:moneyPay
          },
          success: function (res) {
              console.log('初始化支付');
              console.log(res);
              var data = res.data.DATA;
              var status = res.data.STATUS;
              
              if(status==1){
            	  wx.requestPayment({
            		  'appId': data.appId,
            		  'timeStamp': data.timeStamp,
            		  'nonceStr': data.nonceStr,
            		  'package': data.package,
            		  'signType': 'MD5',
            		  'paySign': data.paySign,
            		  'success': function (res) {
            			  console.log('支付成功回调');
                    
                    _this.clearPublishLocalstorage();//清除发布数据缓存
                    wx.redirectTo({url:skipUrl});
            		  },
            		  'fail': function (res) {
                    
            			  console.log('支付失败');
                    _this.setData({ loadingShow: false });
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                    })
            		  }
            	  })
              }else{
                _this.setData({loadingShow: false});
            	  wx.showToast({
	        		  title: '预支付失败',
	        		  icon: 'success',
	        		  duration: 2000
	        		})
              }
          },
          fail: function () {
              console.log('初始化支付失败');
          }
      })
  },
  /**
   * 发布悬赏委托
   */
  rewardEntrustBtn:function(){
    this.submitTap(2);
  },
  /**
   * 发布普通委托
   */
  commonEntrustBtn:function(){
      //直接发布委托
      this.submitTap(1);
  },
  /**
   * @param mustpay:0,1,2
   * 提交委托
   */
  submitEntrust:function(mustpay){
    var _this = this;
    //获取缓存中的提交表单数据
    var dataStr = wx.getStorageSync('publishEntrustData');//取缓存
    
    var publishData = _this.data;
      //准备提交委托数据
      var sendData = {
        houseRegion:publishData.houseRegion,
        regionName:publishData.regionName,
        houseSection:publishData.houseSection,
        sectionName:publishData.sectionName,
        houseUseage:publishData.houseUseage,
        houseFitment:publishData.houseFitment,
        roomL:publishData.roomL,
        roomH:publishData.roomH,
        areaL:publishData.areaL,
        areaH:publishData.areaH,
        priceL:publishData.priceL,
        priceH:publishData.priceH,
        wfFee:publishData.wfFee,
        descp:publishData.descp,
        wfSex:publishData.wfSex,
        caseType:publishData.caseType,
        youyouUserId:publishData.youyouUserId,
        cityId:publishData.cityId,

        wfRelateId:publishData.wfRelateId,
        resource:publishData.resource,
        specialOper:publishData.specialOper,

        isHelp:publishData.isHelp,
        youjiaFlag:'0',
        archiveId:publishData.vipUserInfo.archiveId,
        isVip:publishData.isVip,
        buildId:publishData.buildId,
        buildName:publishData.buildName,

      };
      sendData['mustpay'] = mustpay;//
      var url = _this.data.createCustEntrustUrl;
      console.log(sendData);
      api.getList(url, sendData).then(res => {
       if(res.STATUS != 1){
         if (res.STATUS == 0){
           wx.showToast({
             title: res.INFO,
             icon: 'none',
             duration: 2000
           })
         }
         _this.setData({loadingShow: false});
         return;
       }
        var data = res.DATA;
        if(data.type != 1){
          //发布失败
          console.log(data.info);
          _this.setData({loadingShow: false,entrustRepeatBox:true});
        }else{
          //发布成功
          if(publishData.isVip == '1'){
            var skipUrl = "/pages/trustList/trustList?caseType="+data.caseType;//直接进入委托流程页
          }else{
            var skipUrl = "/pages/entrustAgent/entrustAgent?caseId="+data.caseId+"&caseType="+data.caseType+"&cityId="+data.cityId+"&wxId="+data.wxId;
          }
          var totalFee = data.totalFee;

          if(mustpay == 1){
            //mustpay:是否必须支付（1是、0否、2资金账户还能够满足发布意向金委托）
            _this.prepayEntrust(totalFee,skipUrl,data.caseId,data.caseType,data.cityId);
          }else{
            //无需支付,直接跳转至下一页:
            _this.clearPublishLocalstorage();//清除发布数据缓存
            wx.redirectTo({url:skipUrl});
          }
        }
        
      });
  },

  /**
   * 清除发布委托的缓存数据 (发布成功后)
   */
  clearPublishLocalstorage: function () {
    wx.removeStorageSync('publishEntrustData');
  },
   /**
   * 关闭 发布委托 提示框
   */
  publishErrBoxTapL: function () {
    this.setData({entrustRepeatBox:false,publishErrBox: false});
  },
  /**
  * 查看委托列表
  */
  publishErrBoxTapR: function () {
    wx.removeStorageSync('publishEntrustData');
    wx.redirectTo({ url: "/pages/trustList/trustList?caseType="+this.data.caseType});
  },

  /***** 楼盘检索相关 *****/
  /**
       * 弹出搜索框
       */
  buildSearchBompEvent: function (e) {
    var _this = this;
    this.setData({ searchLoupanBox: true })
  },
  /**
     * 取消弹框
     */
  searchCancleEvent: function (e) {
    var _this = this;
    _this.setData({
      searchLoupanBox: false,
      searchInputValue: ''
    })
  },
  /**
     * 搜索输入框赋值
     */
  searchInputEvent: function (e) {
    var _this = this;
    var value = e.detail.value;
    _this.setData({
      searchInputValue: value
    })
  },
  /**
    * 删除搜索关键字
  */
  deleteKedEvent: function (e) {
    var _this = this;
    _this.setData({
      searchInputValue: '',
      buildArr: []
    });
  },
  /**
    * 删除搜索关键字
  */
  searchBuildData: function (e) {
    var kwd = e.detail.value;
    var that = this;
    if (!!kwd) {
      wx.request({
        url: app.buildRequestUrl('getBuildListAction'),
        data: {
          cityId: this.data.cityId,
          caseType: this.data.caseType==3?1:2,
          keyWord: kwd
        },
        success: function (res) {
          var dataArr = res.data.DATA.list;
          if (res.statusCode == 200 && dataArr.length > 0) {
            if (dataArr.length > 0) {
              var buildArr = [];
              for (var i = 0; i < dataArr.length; i++) {
                var data = dataArr[i];
                buildArr.push(data);
              }
              that.setData({ buildArr: buildArr });
            }
          }
        }
      })
    }
  },
  //选择某个小区
  listTap: function (e) {
    var buildName = e.currentTarget.dataset.text;
    var buildId = e.currentTarget.dataset.id;
    var buildRegion = e.currentTarget.dataset.buildregion;
    var buildRegName = e.currentTarget.dataset.regname;
    this.setData({
      buildName: buildName,
      buildId: buildId,
      buildRegion: buildRegion,
      buildRegName: buildRegName,
      searchLoupanBox: false,
      searchInputValue: ''
    })
  },
  /**
   * 切换  区域和小区选择
   */
  changeBuildArea:function(){
    this.setData({chooseBuildFlag:!this.data.chooseBuildFlag})
  }

})