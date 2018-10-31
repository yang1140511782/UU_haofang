import { Tools } from '../../utils/tools';
var app = getApp();
var api = require('../../utils/common.js');
var tool = new Tools();
var interval = null //倒计时函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1, //当前 步骤
    caseType: 1, //出售 , 出租
    ishezu: 0, //当录入租房信息时，是否是合租信息，0:不是、1:是
    toSend: 0, //出售/出租方式 : 委托经纪人:0. 自助卖房:1
    hasPhone: 0, //自助卖房已有号码 1
    houseUseage: '1',//1住宅 2别墅 3商铺
    houseRoom: 3,//几室:默认3室
    houseArea: 100, //房屋面积，必须为数字，允许小数
    houseAreaStr: '', //房屋面积文案



    caseAccount: 1,//付款方式:1月付、2季付、3半年付、4年付----整租合租信息才有该值-必填
    masterRoom: 1,//合租的房间类型：1类型不限、2次卧、3主卧、4单间、默认:0----合租信息才有该值
    houseType:'', //编辑时的房间类型

    houseFitment: '7',//7装修不限、5豪装、4精装、2简装、1毛坯-合租信息才需要该字段
    houseSet: '',// 当录入租房信息是合租,配套设施 7宽带、8电视、9洗衣机、10冰箱、11空调、13热水器、19双人床、27暖气，提交的参数格式：1,2,3,4 用逗号分割
    houseSetArr: [],//已选择的 配套设施

    searchLoupanBox: false,// 楼盘搜索弹框显示
    searchInputValue: '',// 搜索框的值
    buildArr: [],
    buildListLoc: [], //定位推荐的小区
    buildId: 0,
    buildName: '',

    imgArr: [],
    imgUrlArr: [],
    uploadingFlag: false,
    requesting: false,

    isEdit: 0,// 是否为编辑状态
    brokerArchiveId: '',
    pushLogId: '',
    vipCaseId: '',


    slidWidth: "",//移动滑块背景底盒子总长度
    floorRange: [1, 15, 30, 60, 90],//楼层区间
    areaRange: [50, 70, 100, 150, 200],//面积区间
    hezuAreaRange:[],
    priceRange: [],//价格区间

    fmarginLeft: 0,//楼层标题
    marginLeft: 0,//面积标题
    pMarginLeft: 0,//价格标题

    floorMoveViewX: 62.5,//楼层滑块x的初始值
    areaMoveViewX: 125,//面积滑块x的初始值
    priceMoveViewX: 125,//价格滑块x的初始值
    floorMoveViewXNew: 125,//楼层滑块x的实时记录值
    areaMoveViewXNew: 125,//面积滑块x的实时记录值
    priceMoveViewXNew: 125,//价格滑块x的实时记录值


    houseFloor: '15', //楼层
    price: '',//价格
    priceUnit: '',//价格-单位

    wfSex: '0',//经纪人性别，0:随机分配、1:男、2:女
    descp: '',//房源信息描述内容
    isVip: '0',//是否是专属委托，0:否、1:是
    archiveId: '',  //经纪人ID-专属委托的时候该值必填，isVip=1时

    resource: '',//房源来源

    cityId: '',
    wxId: '',
    caseType: '1',//委托类型（3:求购、4:求租）
    youyouUserId: '',//优优用户ID
    mustpay: '',//是否必须支付（1是、0否、2资金账户还能够满足发布意向金委托）


    sexLimit:'3', //合租的性别限制
    youjiaFlag: '0',//委托登记来源：2微店1优家公众号、0优优好房。默认：0
    sourceType: '1',//委托来源 1 微信 2 APP 3 SOLR 4优家公众号 5 优家微店公众号 6公司微店公众号 7 门店微店

    rewardType: '0', //奖励类型（0普通类型1有奖委托 默认0）
    rewardMoney: '', //奖励金额（如果是有奖委托必传）

    inputPhone: '', //输入的手机号
    inputCode: '',  //输入的验证码
    getCodeFlag: false, //验证码标志
    time: '获取验证码',
    currentTime: 61,
    //详情页 群发找好房 意向客户调整 

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

    //房屋用途数组:
    useageMap: [
      { id: 1, name: "住宅", default: 1 },
      { id: 2, name: "别墅" },
      { id: 3, name: "商铺" }
    ],
    //房屋户型数组:
    roomMap: [
      { room: '1', name: '一室' },
      { room: '2', name: '二室' },
      { room: '3', name: '三室', default: 1 },
      { room: '4', name: '四室' },
      { room: '5', name: '五室' },
      { room: '6', name: '五室以上' },
    ],
    //租金收款方式数组:
    caseAccountMap: [
      { id: 1, name: "月付" },
      { id: 2, name: "季付" },
      { id: 3, name: "半年付" },
      { id: 4, name: "年付" },
      { id: 5, name: "面议" },
    ],
    //出租的房间类型数组:
    masterRoomMap: [
      { id: 2, name: "次卧" },
      { id: 3, name: "主卧" },
      { id: 4, name: "单间" },
      { id: 1, name: "不限" },
    ],
    //房屋装修情况数组:
    houseFitmentMap: [
      { id: 5, name: "豪装" },
      { id: 4, name: "精装" },
      { id: 2, name: "简装" },
      { id: 1, name: "毛坯" },
      { id: 7, name: "不限" },
    ],
    //房屋配套情况:
    // 7宽带、8电视、9洗衣机、10冰箱、11空调、13热水器、19双人床、27暖气，
    houseSetMap: [
      { id: 7, name: "宽带" },
      { id: 13, name: "热水器" },
      { id: 9, name: "洗衣机" },
      { id: 10, name: "冰箱" },
      { id: 21, name: "衣柜" },
      { id: 44, name: "厨房" },
      { id: 11, name: "空调" },
      { id: 27, name: "暖气" },
    ],
    //合租的性别限制
    sexLimitMap:[
      {id:1, name:'男士'},
      {id:2, name:'女士'},
      {id:3, name:'不限'},
    ],
    //性别数组 0:随机分配、1:男、2:女
    sexMap: [
      { id: 1, name: "帅哥", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-man.png" },
      { id: 2, name: "美女", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-woman.png" },
    ],

    regionToastShow: false,  //区域toast提示弹窗
    loadingShow: false,      //提交数据加载
    //
    publishErrBox: false,


    // 跟悬赏委托相关变量
    openId: '',
    createCustEntrustUrl: app.buildRequestUrl('createCustEntrust'),
    prepayEntrustUrl: app.buildRequestUrl('prepayEntrust'),
    entrustRepeatBox: false,//重复发布委托提示框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin();//登录验证

    var _this = this;

    //设置初始参量
    var caseType = options.caseType ? options.caseType : 1;//默认为 出售类型
    var ishezu = options.isHezu ? options.isHezu : 0; 

    //是否为专属委托(房源详情页小区专家的专属委托)
    var isVip = options.isVip ? options.isVip : '0';
    var archiveId = options.archiveId ? options.archiveId : '';
    

    //是否编辑委托
    var isEdit = options.isEdit ? options.isEdit : '0';
    if (isEdit == 1) {
      let newTitle = '出售房源编辑';
      if(caseType == 2 && ishezu ==0){newTitle='整租房源编辑'}
      if(caseType == 2 && ishezu ==1){newTitle='合租房源编辑'}
      wx.setNavigationBarTitle({title: newTitle});
     
      
      _this.setData({
        step: 2,
        brokerArchiveId: options.brokerArchiveId || '',
        pushLogId: options.pushLogId || '',
        vipCaseId: options.vipCaseId || '',
      })
    };

    //从缓存中取城市id和 userId
    var cityId = wx.getStorageSync('cityId');
    var userId = wx.getStorageSync('userId');
    _this.setData({
      isEdit: isEdit,
      ishezu: ishezu,
      isVip: isVip,
      archiveId: archiveId,
      caseType: caseType,
      cityId: cityId,
      wxId: userId,
      openId: wx.getStorageSync('openId'),
      youyouUserId: userId,
    });

    //获取设备屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var slidingBlockWidth = winWidth - 125;
        _this.setData({
          slidWidth: slidingBlockWidth
        })
      }
    });

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkHasPhone();
  },

  //查询当前用户是否已经绑定号码
  checkHasPhone: function () {
    var _this = this;
    var userId = wx.getStorageSync('userId');
    if (!userId) { return };

    let userMobile = wx.getStorageSync('userMobile');
    let hasPhone = 0;
    if (!!userMobile) {
      _this.setData({ hasPhone: 1 });
    } else {
      wx.request({
        url: app.buildRequestUrl('getUserInfo'),
        data: { userId: userId },
        success: function (res) {
          var data = res.data.DATA;
          if (res.statusCode == 200 && !!data) {
            if (!!data.WX_MOBILE) {
              wx.setStorageSync('userMobile', data.WX_MOBILE);
              _this.setData({ hasPhone: 1 });
            }
            else {
              _this.setData({ hasPhone: 0 });
            }
          } else {
            _this.setData({ hasPhone: 0 });
          }
        },
        fail: function (res) {
          _this.setData({ hasPhone: 0 });
        }
      })
    }


  },

  /**
   * 请求处理行政区数据 和 价格/面积区间
   * 
   */
  formatBaseData: function (cityId, lat, lng) {
    var _this = this;
    var _caseType = _this.data.caseType;//
    var _ishezu = _this.data.ishezu;  //是否为合租
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
          var houseArea = _areaArr[2];
          var _hezuAreaArr = [];
          //合租面积区间和默认面积
          if(_ishezu == 1 && _caseType ==2){
            var _hezuAreaArr = data.hezuArea;
            _hezuAreaArr.map(function (item, i) {
              _hezuAreaArr[i] = parseInt(item);
            });
            houseArea = _hezuAreaArr[2];
          }

         

          var hezuAreaDefault = data.hezuAreaDefault;

          //楼层
          var floorList = data.floorList;
          floorList.map(function (item, i) {
            floorList[i] = parseInt(item);
          })
          var houseFloor = parseInt(data.floorDefault);
          
          
          var price = _priceArr[2];
            

          //设置滑块初始值 总范围 250
          _this.setData({
            floorRange: floorList,
            priceRange: _priceArr,
            areaRange: _areaArr,
            hezuAreaRange: _hezuAreaArr,
            buildListLoc: buildListLoc,
            houseFloor: houseFloor,
            price: price,
            priceUnit: _priceUnit,
            houseArea: houseArea,
          });


          //如果是编辑当前委托需要初始化 参数值
          if (_this.data.isEdit != 1) {
            return;
          }
          wx.showLoading({
            title: '加载中'
          });
          var params = {
            cityId: _this.data.cityId,
            brokerArchiveId: _this.data.brokerArchiveId,
            pushLogId: _this.data.pushLogId,
            vipCaseId: _this.data.vipCaseId,
            caseType: _this.data.caseType
          };
          wx.request({
            url: app.buildRequestUrl('getCaseDetailInfo'),
            data: params,
            success: function (res) {
              if (res.data.STATUS == 1) {
                console.log(res);
                res = res.data.DATA;
                var imgUrlArr = [];

                let houseFloor = (!!res.houseFloor && res.houseFloor!=0)?res.houseFloor:'15';
                //价格及面积滑块位置的初始化
                
                var areaRange =  _this.data.areaRange;
                if(_this.data.caseType == 2 && _this.data.ishezu == 1){
                  areaRange =  _this.data.hezuAreaRange;
                }
                let areaMoveViewX = _this.getMoveViewX(res.houseArea, areaRange);
                let priceMoveViewX = _this.getMoveViewX(res.houseTotalPrice, _this.data.priceRange);
                let floorMoveViewX = _this.getMoveViewX(houseFloor, _this.data.floorRange);

                let masterRoom = (!!res.houseType && res.houseType !=0)?res.houseType:'1';

                _this.setData({
                  buildId: res.buildId,
                  buildName: res.buildName,
                  houseUseage: res.houseUseage,
                  houseRoom: res.houseRoom,
                  houseArea: res.houseArea,
                  masterRoom: masterRoom,
                  sexLimit: res.sexLimit,
                  houseFloor: houseFloor,
                  price: res.houseTotalPrice,
                  descp: res.houseDesc != undefined ? decodeURI(res.houseDesc) : '',
                  areaMoveViewX: areaMoveViewX,
                  priceMoveViewX: priceMoveViewX,
                  floorMoveViewX: floorMoveViewX,
                  imgArr: res.photoList,
                  imgUrlArr: imgUrlArr,
                });

                if (_this.data.caseType == 2) {
                  _this.setData({
                    caseAccount: res.caseAccount,
                    ishezu: res.isHezu,
                  })
                  //合租
                  if (_this.data.ishezu == 1) {
                    var houseSet = res.houseSet;
                    houseSetArr = [];
                    if(!!houseSet){
                      var houseSetArr = houseSet.split(',');
                    }
                    
                    houseSetArr.map(function (item, index) {
                      houseSetArr[index] = parseInt(item);
                    })

                    _this.setData({
                      caseAccount: res.caseAccount,
                      houseSet: houseSet,
                      houseSetArr: houseSetArr,
                      houseFitment: res.houseFitment,
                    })
                  }
                }

              } else {
                wx.showToast({ title: res.data.INFO, icon: 'none', duration: 2000 });
              }
            }, complete: function () {
              wx.hideLoading();
            }
          })

        }
      }
    })
  },

  /**
   * 选择出租类型
   */
  rentTypeTap: function (e) {
    var ishezu = e.currentTarget.dataset.id;
    var toSend = ishezu == 1 ? 1 : 0;
    this.setData({
      ishezu: ishezu,
      houseUseage: 1,
      toSend: toSend, //
    });
  },

  /**
   * 选择 房屋配套
   */
  houseSetTap: function (e) {
    var id = e.currentTarget.dataset.id;
    let houseSetArr = this.data.houseSetArr;
    let index = houseSetArr.indexOf(id);
    if (index > -1) {
      houseSetArr.splice(index, 1); //当前已选中,去除选中
    } else {
      houseSetArr.push(id); //当前未选中, 添加选中
    }
    let houseSet = houseSetArr.join(',');
    this.setData({ houseSet: houseSet, houseSetArr: houseSetArr });
  },

  /**
   * 选择房屋类型
   */
  useageTap: function (e) {
    //如果当前是 出租的合租 ,屏蔽 房屋类型切换
    if (this.data.caseType == 2 && this.data.ishezu == 1) { return; }
    var id = e.currentTarget.dataset.id;
    this.setData({ houseUseage: id });
  },
  /**
   * 选择房屋类型
   */
  sexTap:function(e){
    var id = e.currentTarget.dataset.value;
    let wfSex = this.data.wfSex;
    if(wfSex == id){
      wfSex = '';
    }else{
      wfSex = id;
    }
    this.setData({wfSex:wfSex})
  },
  /**
  * 留言输入
  */
  remarkInput: function (e) {
    var inputValue = e.detail.value;
    this.setData({ descp: inputValue });
  },

  /**
  * 号码输入
  */
  phoneInput: function (e) {
    var inputValue = e.detail.value;
    this.setData({ inputPhone: inputValue });
  },

  /**
  * 验证码输入
  */
  codeInput: function (e) {
    var inputValue = e.detail.value;
    this.setData({ inputCode: inputValue });
  },
  /**
  * 获取验证码
  */
  getCode: function () {
    var _this = this;
    //检测号码是否符合要求
    var phone = _this.data.inputPhone;
    var reg = /^1[3-9][0-9]{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({ title: '请输入11位有效手机号', icon: 'none' });
      return;
    }
    if (!!_this.data.getCodeFlag) { return; }//避免重复点击
    //发送验证码
    wx.request({
      url: app.buildRequestUrl('sendMobileCaptchaUrl'),
      data: { mobile: phone },
      success: function (res) {
        if (res.data.STATUS == 1) {
          var currentTime = _this.data.currentTime;
          wx.showToast({ title: '发送成功', icon: 'none' });
          _this.setData({
            getCodeFlag: true
          })
          interval = setInterval(function () {
            currentTime--;
            _this.setData({
              time: currentTime + '秒'
            });
            if (currentTime <= 0) {
              clearInterval(interval)
              _this.setData({
                time: '重新发送',
                currentTime: 61,
                getCodeFlag: false
              })
            }
          }, 1000);
        } else {

        }
      }, fail: function (res) {
        wx.showToast({ title: '发送失败', icon: 'none' });
        _this.setData({
          time: '重新发送',
          currentTime: 61,
          getCodeFlag: false
        })
      }
    })

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
   * 
   * */
  nextTap: function (e) {
    var _this = this;
    var step = this.data.step;
    if (step == 1) {
      //第一步时判断是否选择了小区
      if (!_this.data.buildName) {
        wx.showToast({ icon: 'none', title: '请选择小区' }); return;
      }
    }
    step++;
    this.setData({ step: step });//切换当前显示第几行的商圈块
  },


  /**
   * 点击 群发委托
   * @param publishType : 发布委托类型 , 1: 普通委托 , 2: 悬赏委托
   */
  submitTap: function (publishType) {
    if (!publishType) publishType = 1;
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
        _this.setData({ loadingShow: false, publishErrBox: true });//隐藏加载中弹窗
        return;
      } else {
        //可以发布:跳转至支付意向金页面
        var mustpay = data.mustpay;//等于2时，点击支付意向金时直接调用登记委托，弹出推送经纪人页面，不需要调用支付

        _this.setData({ mustpay: mustpay });

        if (publishType == 1) {
          //发布普通委托
          _this.submitEntrust(0);
        } else {
          //发布悬赏委托
          if (_this.data.mustpay == 2) {
            //不需要调用支付,直接发布
            _this.submitEntrust(2);
          } else {
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
   * 根据 面积/价格 初始值计算 滑块当前应当的偏移量 (250总长)
   * @param numL 价格或面积(详情页传来的初始值)
   * @param numH 价格或面积(详情页传来的初始值)
   * @param range : 范围数组 :[ 50, 70, 100, 150, 200]
   */
  getMoveViewX: function (num, range) {
    var _this = this;
    var index = 0, percent = 0;
    var moveViewXNew = 125, moveViewMax = 250;
    if (num == range[0]) { return 0; } //
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
    moveViewXNew = parseInt(moveViewMax / 4 * (index + percent));
    return moveViewXNew;
  },
  /**
   * 楼层滑块拖拽
   */
  dragFloorMoveBtn: function (e) {
    var _this = this;
    var scollWidth = _this.data.slidWidth,//外层盒子宽度
      floorP = _this.data.floorRange;
    //设置偏移量
    var floorMoveViewXNew = e.changedTouches[0].clientX - 60;

    _this.setData({ floorMoveViewXNew: floorMoveViewXNew });
    var _clientX = e.changedTouches[0].clientX - 60;
    _this.calculateCurrentFloor(_clientX, scollWidth, floorP)
  },
  /**
   * 面积滑块拖拽
   */
  dragAreaMoveBtn: function (e) {
    var _this = this;
    var scollWidth = _this.data.slidWidth,//外层盒子宽度
      areaP = _this.data.areaRange;
    if(_this.data.caseType == 2 && _this.data.ishezu ==1){
        areaP = _this.data.hezuAreaRange;
      }
    //设置偏移量
    var areaMoveViewXNew = e.changedTouches[0].clientX - 60;

    _this.setData({ areaMoveViewXNew: areaMoveViewXNew });
    var _clientX = e.changedTouches[0].clientX - 60;
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
    var priceMoveViewXNew = e.changedTouches[0].clientX - 60;
    _this.setData({ priceMoveViewXNew: priceMoveViewXNew });
    var _clientX = e.changedTouches[0].clientX - 60;
    _this.calculateCurrentPrince(_clientX, scollWidth, princeP)
  },

  /**
 *  楼层滑块当前的面积
 *  oLeft 距离左边的值
 *  scrollLength 滑槽总长度
 *  priceRange 价格范围
 * */
  calculateCurrentFloor: function (oLeft, scrollLength, priceRange) {
    var _this = this;
    var priceStart, priceEnd, priceStr;//定义起始值
    var indexMax = (priceRange.length - 1);

    var percent = oLeft * indexMax / scrollLength;
    var index = parseInt(percent);//当前索引值
    var houseFloor = _this.data.houseFloor;
    percent = percent - index;//所在区间占比
    if (percent <= 0) {
      houseFloor = priceRange[0];
    }
    else if (index >= indexMax) {
      houseFloor = priceRange[indexMax];
    } else {
      var divide = priceRange[index + 1] - priceRange[index];//区间跨度
      houseFloor = priceRange[index] + parseInt(divide * percent);
    }
    _this.setData({
      houseFloor: houseFloor
    })
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
    var indexMax = (priceRange.length - 1);

    var percent = oLeft * indexMax / scrollLength;
    var index = parseInt(percent);//当前索引值
    var houseArea = _this.data.houseArea;
    var houseAreaStr = _this.data.houseAreaStr;
    percent = percent - index;//所在区间占比
    if (percent <= 0) {
      houseArea = priceRange[0];
    }
    else if (index >= indexMax) {
      houseArea = priceRange[indexMax];
    } else {
      var divide = priceRange[index + 1] - priceRange[index];//区间跨度
      houseArea = priceRange[index] + parseInt(divide * percent);
    }
    _this.setData({
      houseArea: houseArea
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
    var indexMax = (priceRange.length - 1);
    var percent = oLeft * indexMax / scrollLength;
    var index = parseInt(percent);//当前索引值
    var price = _this.data.price;
    percent = percent - index;//所在区间占比
    if (percent < 0) {
      price = priceRange[0];
    }
    else if (index >= indexMax) {
      price = priceRange[indexMax];
    } else {
      var divide = priceRange[index + 1] - priceRange[index];//区间价格跨度
      price = priceRange[index] + parseInt(divide * percent);//显示值

      //如果是出租登记 , 调整价格步长为 100
      if(_this.data.caseType == '2'){
        price = parseInt(price/100) * 100;
      }
    }
    _this.setData({
      price: price,
    })
  },

  /**
  * 关闭 发布委托 提示框
  */
  publishErrBoxTapL: function () {
    this.setData({ entrustRepeatBox: false, publishErrBox: false });
  },
  /**
  * 查看委托列表
  */
  publishErrBoxTapR: function () {
    wx.removeStorageSync('publishEntrustData');
    wx.redirectTo({ url: "/pages/trustList/trustList?caseType=" + this.data.caseType });
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
          caseType: this.data.caseType,
          keyWord: kwd
        },
        success: function (res) {
          var dataArr = res.data.DATA.list;
          if (res.statusCode == 200 && dataArr.length > 0) {
            if (dataArr.length > 0) {
              var buildArr = [];
              for (var i = 0; i < dataArr.length; i++) {
                var data = dataArr[i];
                buildArr.push({ buildName: data['buildName'], buildId: data['buildId'], regName: data['regName'] });
              }
              that.setData({ buildArr: buildArr });
            }
          }
        }
      })
    }
  },
  listTap: function (e) {
    var buildName = e.currentTarget.dataset.text;
    var buildId = e.currentTarget.dataset.id;
    this.setData({
      buildName: buildName,
      buildId: buildId,
      searchLoupanBox: false,
      searchInputValue: ''
    })
  },
  /**
    * 选择上传图片
  */
  chooseImg: function (e) {
    var _that = this, imgArr = _that.data.imgArr || [], imgUrlArr = _that.data.imgUrlArr || [];
    _that.setData({ uploadingFlag: true });
    wx.chooseImage({
      count: 9 - _that.data.imgArr.length, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var count = res.tempFilePaths.length;
        for (var i = 0; i < tempFilePaths.length; i++) {
          (function (j) {
            wx.uploadFile({
              url: app.buildRequestUrl('uploadFile'),
              filePath: tempFilePaths[j],
              name: 'file',
              'content-type': 'multipart/form-data',
              complete: function (res) {
                var json = JSON.parse(res.data);
                var status = json.STATUS;
                if (status == 1) {
                  var url = json.DATA.data[0]['saveName'];
                  imgUrlArr.push(url);
                  _that.setData({ imgUrlArr: imgUrlArr });
                  count--;
                }
                imgArr.push({ photoId: '', picUrl: tempFilePaths[j], saveUrl: url });

                _that.setData({
                  imgArr: imgArr
                });
                if (count == 0) {
                  _that.setData({
                    uploadingFlag: false
                  });
                }
              }
            })
          })(i)
        }
      },
      fail: function (res) {
        _that.setData({ uploadingFlag: false });
      }
    })
  },
  deleteImg: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var photoId = e.currentTarget.dataset.photoid;

    if (photoId != '') {
      //有Id的
      var requestUrl = app.buildRequestUrl('deleteVipPhoto');
      var param = {
        cityId: _this.data.cityId,
        photoId: photoId
      };
      api.getList(requestUrl, param).then(res => { });
    } else {
      //无Id的
      var imgSrc = e.currentTarget.dataset.src;
      var urlArr = _this.data.imgUrlArr;
      for (var i in urlArr) {
        if (urlArr[i].indexOf(imgSrc) >= 0) {
          delete urlArr[i];
        }
      }
      _this.setData({ imgUrlArr: urlArr });
    }

    var arr = this.data.imgArr;
    for (var i = 0; i < arr.length; i++) {
      if (i == id) {
        tool.remove(arr, i);
        // tool.remove(urlArr, i);
      }
    }
    this.setData({ imgArr: arr });
    // this.setData({ imgUrlArr: urlArr });
  },
  //选择设置值
  setVal: function (e) {
    var _this = this;
    var t = e.currentTarget.dataset.type;
    var v = e.currentTarget.dataset.value;

    //委托经纪人和自主 卖房和租房 切换时 , 合租只能选择自助租房
    if ('toSend' == t && '0' == v && _this.data.ishezu == 1) {
      wx.showToast({ title: '合租只能自助出租哦', icon: 'none' });
      return;
    }
    this.setData({ [t]: v });
  },

  //提交发布

  checkData: function (e) {
    var _data = this.data;
    var _this = this;
    if (_data['uploadingFlag']) {
      wx.showToast({ title: '图片上传中...', icon: 'loading' });
      return;
    }
    var sendArr = {
      caseType: _data.caseType,
      cityId: _data.cityId,
      buildId: _data.buildId,
      buildName: _data.buildName,
      houseUseage: _data.houseUseage,
      houseArea: _data.houseArea,
      houseRoom: _data.houseRoom,
      price: _data.price,
      descp: _data.descp,
      isVip: _data.isVip,
      youyouUserId: _data.youyouUserId,
      sourceType: _data.sourceType,
      rewardType: _data.rewardType,
      rewardMoney: _data.rewardMoney,
      toSend: _data.toSend, //(1自助 0委托 默认0)
    };

    //兼容处理 提交时 houseArea 为空导致报错的问题 
    if (!sendArr['houseArea']){
      sendArr['houseArea'] = 90;
    }

    sendArr['fileAddrs'] = _data['imgUrlArr'].join(',');

    //出租委托
    if (_data.caseType == 2) {
      sendArr['caseAccount'] = _data.caseAccount; //付款方式
      sendArr['ishezu'] = _data.ishezu;           //是否是合租信息

      if (_data.ishezu == 1) {
        //合租委托
        sendArr['masterRoom'] = _data.masterRoom;     //合租的房间类型
        sendArr['houseFitment'] = _data.houseFitment; //合租的房间装修
        sendArr['houseSet'] = _data.houseSet;         //合租,配套设施
        // sendArr['publishUserName'] = _data.publishUserName; //发布人姓名（合租时必填）
        // sendArr['publishUserMobile'] = _data.publishUserMobile; //发布人电话（合租时必填）
      }
    }

    //专属委托
    if (_data.isVip == 1) {
      sendArr['archiveId'] = _data.archiveId;
      _this.submitData(sendArr);
      return;
    }

    //如果是编辑委托
    if (_data.isEdit == 1) {
      sendArr['vipCaseId'] = _data.vipCaseId;
      sendArr['houseType'] = _data.masterRoom; //编辑委托时 , masterRoom 字段修改为 houseType
      sendArr['dataCityId'] = _data.cityId;
      sendArr['houseFloor'] = _data.houseFloor;
      sendArr['sexLimit'] = _data.sexLimit;
      _this.updateData(sendArr);
      return;
    }

    //非专属委托 和编辑委托
    if (_data.toSend == 0) {
      //委托经纪人时选择性别
      sendArr['wfSex'] = _data['wfSex'];
      _this.submitData(sendArr);
    } else {
      //自助时 需要判断手机号码是否绑定
      if (!!_data.hasPhone) {
        _this.submitData(sendArr);
      } else {
        if (!_data.inputPhone) {
          wx.showToast({ title: '为了客户能及时联系到您，请绑定手机号码', icon: 'none' });
          return;
        }
        if (!_data.inputCode) {
          wx.showToast({ title: '为了客户能及时联系到您，请绑定手机号码', icon: 'none' });
          return;
        }
        // 验证 验证码
        wx.request({
          url: app.buildRequestUrl('checkMobileCaptcha'),
          data: {
            mobile: _data.inputPhone,
            captcha: _data.inputCode,
            userId: _data.wxId,
          },
          success: function (res) {
            if (res.data.STATUS == 1) {
              _this.submitData(sendArr);
            } else {
              wx.showToast({ title: res.data.INFO, icon: 'none' });
            }
          }, fail: function () {
            wx.showToast({ title: '', icon: 'none' });
          }
        })
      }
    }


  },

  //提交委托
  submitData: function (sendArr) {
    var that = this;
    if (that.data.requesting) {
      wx.showToast({ title: '数据提交中...', icon: 'loading' });
      return;
    }
    wx.showLoading({ title: '数据提交中...', mask: true });
    wx.request({
      url: app.buildRequestUrl('createHouseEntrust'),
      data: sendArr,
      success: function (res) {
        if (res.data.STATUS == 1) {
          wx.showToast({ title: '发布成功', icon: 'none', duration: 2000,mask: true });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/trustList/trustList?caseType=' + that.data.caseType
            })
          }, 1000)
        } else {
          wx.showModal({
            title: '',
            content: res.data.INFO,
            showCancel: false,
          });
          // wx.showToast({ title: res.data.INFO, icon: 'none', duration: 2000 });
        }
      }, complete: function () {
        that.setData({ requesting: false });
        wx.hideLoading();
      }
    })
  },
  //更新 保存 委托
  updateData: function (sendArr) {
    var that = this;
    if (that.data.requesting) {
      wx.showToast({ title: '数据提交中...', icon: 'loading' });
      return;
    }
    var url = that.data.caseType == 1 ? app.buildRequestUrl('updateVipSaleInfo') : app.buildRequestUrl('updateVipLeaseInfo');
    wx.showLoading({ title: '数据提交中...', mask: true });
    wx.request({
      url: url,
      data: sendArr,
      success: function (res) {
        if (res.data.STATUS == 1) {
          //编辑成功就返回列表页面
          wx.navigateBack();
          return;
          // wx.redirectTo({
          //   url: '/pages/trustList/trustList?caseType=' + that.data.caseType
          // })
        } else {
          wx.showToast({ title: res.data.INFO, icon: 'none', duration: 2000 });
        }
      }, complete: function () {
        that.setData({ requesting: false });
        wx.hideLoading();
      }
    })
  }


})