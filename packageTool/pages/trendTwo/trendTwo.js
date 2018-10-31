const app = getApp();
let wxCharts = require('../../../utils/wxcharts.js');
var util = require('../../../utils/util.js');
let windowWidth = 320;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDataShow:false,
    dataShow: false,
    discountStatus: false,
    toastMask:false,
    cityId: '',
    buildId: '',
    houseType: '',
    floor: '',
    totalFloor: '',
    roomNum: '',
    specialFactors: '',
    totalPrice: '',
    caseId: '',
    caseType: '',
    reSource: '',
    floorBuilding: '',
    builtedTime: '',
    toward: '',
    houseNumber: '',
    renovation: '',
    buildName: '',
    housePer:'',//小区专家
    onSaleHouse:''//小区在售房源
  },

  /**
   * 图表函数
   */
  eachart: function (e) {
    var that = this;
    //如果 渲染数组长度为空 ,则不渲染 ,避免 wxercharts 卡死小程序
    if(this.data.timeArr.length == 0){
      return;
    }
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: this.data.timeArr,
      series: [{
        name: this.data.priceTrendValue.buildName,
        data: this.data.houseArr,
        color: '#ffcd16',
      },
      {
        name: this.data.priceTrendValue.regionName,
        data: this.data.regionArr,
        color: '#1bc964',
      },
      {
        name: this.data.priceTrendValue.cityName,
        data: this.data.cityArr,
        color: '#ff5400',
      },
      ],
      yAxis: {
        title: '均价(元/㎡)',
      },
      xAxis: {

      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });

    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
      }
    });

    var value = wx.getStorageSync('cityId');
    if (value) {
      that.setData({
        cityId: value
      })
    }
    var buildId = options.buildId ? options.buildId : '', houseType = options.houseType ? options.houseType : '',
      houseArea = options.houseArea ? options.houseArea : '', floor = options.floor ? options.floor : '',
      totalFloor = options.totalFloor ? options.totalFloor : '', roomNum = options.roomNum ? options.roomNum : '',
      specialFactors = options.specialFactors ? options.specialFactors : '', totalPrice = options.totalPrice ? options.totalPrice : '',
      caseId = options.caseId ? options.caseId : '', caseType = options.caseType ? options.caseType : '1',
      reSource = options.reSource ? options.reSource : '', floorBuilding = options.floorBuilding ? options.floorBuilding : '',
      builtedTime = options.builtedTime ? options.builtedTime : '', toward = options.toward ? options.toward : '',
      houseNumber = options.houseNumber ? options.houseNumber : '', renovation = options.renovation ? options.renovation : '',
      buildName = options.buildName ? options.buildName : '';
    that.setData({
      buildId: buildId,
      houseType: houseType,
      houseArea: houseArea,
      floor: floor,
      totalFloor: totalFloor,
      roomNum: roomNum,
      specialFactors: specialFactors,
      totalPrice: totalPrice,
      caseId: caseId,
      caseType: caseType,
      reSource: reSource,
      floorBuilding: floorBuilding,
      builtedTime: builtedTime,
      toward: toward,
      houseNumber: houseNumber,
      renovation: renovation,
      buildName: buildName
    })
    // that.estimateResult();
    //获取时间
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.forDayTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    });

    var cityId = that.data.cityId ? that.data.cityId : 1,
      buildId = options.buildId ? options.buildId : 1112920,
      houseType = options.houseType || '1';
    that.setData({
      cityId: cityId,
      buildId: buildId,
      houseType: houseType,
    });
    let userId = wx.getStorageSync('userId');
    wx.request({
      url: app.globalData.javaOnlineHost + '/uuhfWeb/houseAssess/getPriceTrendNew',
      data: {
        cityId: cityId,
        buildId: buildId,
        youyouUserId:userId
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          console.log(res);
          var data = res.data.DATA;
          if(!data || !data.unitPrice){
            that.setData({dataShow: false,noDataShow: true})
            return;
          }
          
          //计算总价 及 变动价格等信息
          var resultData = {};
          resultData['totalprice'] = parseInt(data.unitPrice * that.data.houseArea/10000);
          resultData['ratioByLastMonthForPrice'] = parseFloat(data.ratioByLastMonthForPrice * 100).toFixed(2);
          resultData['ratioByLastMonthForPriceText'] = Math.abs(resultData['ratioByLastMonthForPrice']);
          resultData['offset'] = parseFloat((resultData['totalprice'] /(1+parseFloat(data.ratioByLastMonthForPrice))) * data.ratioByLastMonthForPrice).toFixed(1);
          

          //房源列表数据
          var houseL = data.houseList;
          houseL.map(function (ele, i) {
            if (ele['houseTagDesc']) {
              ele['houseTagDesc'] = ele['houseTagDesc'].split('|').slice(0, 3);
            }
          });

          var cityArr = [], houseArr = [], regionArr = [], timeArr = [];
          for (var i = 0; i < data.city.length; i++) {
            cityArr.push(data.city[i].price);
            if (data.city[i].priceMonths.length == 7) {
              timeArr.push(data.city[i].priceMonths.substr(2, 5));
            }
          }
          for (var i = 0; i < data.house.length; i++) {
            houseArr.push(data.house[i].price);
          }
          for (var i = 0; i < data.region.length; i++) {
            regionArr.push(data.region[i].price);
          }

          that.setData({
            priceTrendValue:data,
            cityArr: cityArr,
            houseArr: houseArr,
            regionArr: regionArr,
            timeArr: timeArr,
            resultData: resultData,
            onSaleHouse: houseL,
            appShow: true,
            ataShow: false,
            noDataShow: false, 
            dataShow:true
          })
          that.eachart();
          that.housePerson();

        }else{
          that.setData({
            dataShow:false,
            noDataShow:true
          })
        }
      }
    });
    wx.request({
        url: app.buildRequestUrl('initMenuUrl'),
        data:{
          cityId: value
        },
        success: function (res) {
        	if(res.data.DAIKUAN_FLAG == 1){
        		that.setData({DAIKUAN_FLAG:true});
        	}
        }
    })
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
      wx.navigateTo({
        url: "/pages/houseDetail/houseDetail?casetype=" + caseType + "&resource=" + reSource + "&cityid=" + cityId + '&caseid=' + caseId
      });
  },
  /**
   *点击查看更多 
   */
  goToList(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  /**
   *小区专家 
   */
  housePerson(){
    var that = this;
    wx.request({
      url: app.buildRequestUrl('expertInfo'),
      data: {
        cityId: that.data.cityId,
        buildId: that.data.buildId
      },
      success: function (res) {
        if (res.statusCode==200){
            var data = res.data;
            that.setData({
              housePer:data
            })
              
        }
      }
    });

  },
  /** 
     * 小区专家咨询点击
     */
  zjAgentChat: function () {
    this.setData({
      discountStatus: true,
      toastMask:false
    })
  },
  /**
    * 小区专家
    */
  xiaoquCallEvent: function (e) {
    var _this = this;
    _this.setData({
      toastMask: true,
      // communityToast: true,
      // guideToast: false,
      // leadToast: false,
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
    var _this = this;
    var myset = e.currentTarget.dataset.hs;
    var caseType = "";
    if (_this.data.caseType == 1) {
      caseType = 3;
    } else {
      caseType = 4;
    }
    wx.navigateTo({
      url: '/pages/entrust/entrust?archiveId=' + myset.brokerArchiveId + '&isVip=1' + '&userMobile=' + myset.brokerMobile + '&userName=' + myset.brokerName + '&serviceRegs=' + myset.serviceReg + '&userPhoto=' + myset.brokerUserPicUrl + '&caseType=' + caseType,
    })
  },
  /** 
   * 我要出租，出售点击跳转
   */
  goToEntrustLiBtn: function (e) {
    var _this = this;
    var _buildOwnerArchiveId = e.currentTarget.dataset.buildownerarchiveid;
    var goToUrl = "";
    if (_this.data.caseType == 1) {
      goToUrl = 'sale';
    } else {
      goToUrl = 'rent';
    }
    wx.navigateTo({
      url: "/pages/registration/registration?caseType="+_this.data.caseType+"&archiveId=" + e.currentTarget.dataset.buildownerarchiveid + "&isVip=1"
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
     * 联系方式在线聊天点击
     */
  onlineChat4C: function (e) {
    var imid = e.currentTarget.dataset.imid;
    if (!!imid) {
      imid = imid.replace("uu_", "");
    }
    var _this = this;
    _this.setData({
      toastMask: false
    })
    wx.navigateTo({
      url: "/pages/im/imc?from=" + _this.data.userId + "&to=" + imid + "&caseId=" + this.data.caseId + "&caseType=" + this.data.caseType
    })
  },
  /**
     * 隐号拨打
     */
  yinhao: function (e) {
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    });
  },
  /**
   *换条件 
   */
  gobackBtn(){
    wx.navigateBack({
      delta: 1
    })
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