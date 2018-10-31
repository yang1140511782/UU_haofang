// pages/coupon/index.js

var app = getApp();
var api = require('../../utils/common.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        shareId: '', //优惠券分享Id
        couponInfo: {},  //红包数据
        entrustBaseData: '', //专属 委托的基础数据
        caseType: '3', //求购 : 3. 求租:4

        saleList: [],  //专属经纪人的 出售房源
        leaseList: [], //专属经纪人的 出租房源




        //地址选择
        cityId: '',
        wxId: '',
        youyouUserId: '',
        isVip: '1', //1为专属委托

        regData: [], //行政区域
        businessList: [],//商圈数据
        indexSectionList: [], //附近商圈

        initLocalStorageUrl: app.buildRequestUrl('initLocalStorage'),
        isShow: false,  //红包页面是否显示 true为显示 false隐藏
        redPacketNum: 200, //红包数量
        isAddress: false,  //是否显示地址选择弹窗  true显示 false隐藏
        isShowPrice: false,  //价格选择弹窗  true显示  false关闭
        couponBoxFlag: true, //优惠券红包弹窗
        couponBoxshow: false,

        isRegShowOn: '', //区域点击状态 
        isRegShowOnName: '', //区域点击状态 
        isSectionOnName: '', //区域点击状态 
        isSectionOn: '', //商圈点击高亮
        sectionBoxShow: true, //商圈显示

        houseRegion: '',//行政区id
        regionName: '',//行政区名字
        houseSection: '',//商圈ID(片区id)
        sectionName: '',//商圈名称(片区名称)

        buy_houseRegion: '',//行政区id
        buy_regionName: '',//行政区名字
        buy_houseSection: '',//商圈ID(片区id)
        buy_sectionName: '不限',//商圈名称(片区名称)
        sureBuyAddressInfo: '', //确定求购选择的地址

        rent_houseRegion: '',//行政区id
        rent_regionName: '',//行政区名字
        rent_houseSection: '',//商圈ID(片区id)
        rent_sectionName: '不限',//商圈名称(片区名称)
        sureRentAddress: '', //确定求租选择的地址

        // 户型装修数据
        isShowHouseType: false,  //是否显示户型选择  true显示 , false隐藏
        roomL: '',
        roomH: '',
        houseFitment: '',  //装修情况
        indexhouseFitment: [0, 0],
        houseFitment_id: '',

        buy_roomL: '',
        buy_roomH: '',
        buy_houseFitment: '',

        buy_indexHouseFitment: [0, 0], //购房选择值id
        sureBuyHouseType: '',  //求购选择值  

        rent_roomL: '',
        rent_roomH: '',
        rent_houseFitment: '',
        rent_indexHouseFitment: [0, 0], //租房选择值id
        sureRentHouseType: '',  //求租选择值`

        roomNumArr: [
            { text: '1室', value: '1' },
            { text: '2室', value: '2' },
            { text: '3室', value: '3' },
            { text: '4室', value: '4' },
            { text: '5室', value: '5' }
        ],
        fitmentArr: [
            { value: 1, text: '普通' },
            { value: 2, text: '精装' },
            { value: 3, text: '中档' },
            { value: 4, text: '高档' },
            { value: 5, text: '豪装' },
            { value: 6, text: '毛坯' },
            { value: 7, text: '装修不限' }
        ],

        // 价格选择
        priceL: '', //
        priceH: '',
        housePrice: [],
        housePriceIndex: [0],
        price: [],

        surBuyPrice: '',  //初始值
        buy_priceL: '0',  //确定价格最小值
        buy_priceH: '80',  //确定价格最大值
        buy_indexPrice: [0], //默认显示价格
        buyPrice: [], //价格区间

        surRentPrice: '', //初始值
        rent_priceL: '0',  //确定价格最小值
        rent_priceH: '1000',  //确定价格最大值
        rent_indexPrice: [0], //默认显示价格
        rentPrice: [],   //价格区间
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.checkLogin();//登录验证
        var _this = this;
        let shareId = options.shareId ? options.shareId : '';
        
        //有可能是海报识别二维码进入
        if(!shareId && !!options.scene){
            shareId = options.scene;
        }
        let showCoupon = options.showCoupon ? options.showCoupon : '1';//默认展示红包: 但是个人中心 不展示
        //  showCoupon =  '1';

        var cityId = wx.getStorageSync('cityId');
        var userId = wx.getStorageSync('userId');

        _this.setData({
            shareId: shareId,
            cityId: cityId,
            wxId: userId,
            youyouUserId: userId,
            couponBoxFlag: showCoupon == '1' ? true : false,
            couponBoxshow: showCoupon == '1' ? true : false,
        });

        //页面初始化成功前 , 先展示加载动画
        wx.showLoading({ title: '', mask: true });
        wx.showNavigationBarLoading();

        //请求获取红包数据
        _this.initCouponData();

        //初始化专属委托数据
        _this.initEntrustData();

        //初始化 商圈/区域/价格 数据
        var savedData = api.getStorageData('filterData_' + _this.data.cityId);
        if (savedData) {
            _this.formatRegData(savedData);
        } else {
            var url = _this.data.initLocalStorageUrl;
            var params = { cityId: _this.data.cityId };
            api.getList(url, params).then(res => {
                console.log(res)
                if (res.STATUS != 1) return;
                //设置行政区商圈缓存
                var storageData = JSON.stringify(res);
                //缓存行政区商圈数据 1天
                api.setStorageData('filterData_' + _this.data.cityId, storageData, 86400);
                _this.formatRegData(storageData);

            });
        }
    },

    /**
     * 请求获取红包数据
     */
    initCouponData: function () {
        var _this = this;
        wx.request({
            url: app.buildRequestUrl('getCouponInfo'),
            data: {
                shareId: _this.data.shareId,
                youyouUserId: _this.data.youyouUserId,
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.ERROR_CODE == 0) {
                        var couponInfo = res.data.DATA;
                        _this.setData({ couponInfo: couponInfo });
                    }
                }
            }, complete: function () {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            }
        })
    },

    /**
      * 领取获取 红包数据
      */
    getCoupon: function () {
        var _this = this;
        wx.request({
            url: app.buildRequestUrl('customerGetCoupon'),
            data: {
                shareId: _this.data.shareId,
                youyouUserId: _this.data.youyouUserId,
            },
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                    if (res.data.ERROR_CODE == 0) {
                        //领取成功
                        var couponInfo = _this.data.couponInfo;
                        couponInfo.isGet = 1;
                        _this.setData({
                            couponInfo: couponInfo,
                            couponBoxFlag: false
                        });

                    }
                }
            }, complete: function () {
                wx.hideLoading();
            }
        })
    },

    /**
     * 初始化专属委托数据
     */
    initEntrustData: function () {
        var _this = this;
        wx.request({
            url: app.buildRequestUrl('getVipEntrustInit'),
            data: {
                shareId: _this.data.shareId,
                youyouUserId: _this.data.youyouUserId,
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.ERROR_CODE == 0) {
                        var entrustBaseData = res.data.DATA;
                        //如果已经发布了委托 , 处理下委托状态数据
                        if (entrustBaseData.existence == 1) {
                            var pushStatusClassJson = { 0: 1, 2: 1, 5: 2, 3: 3, 4: 4 };
                            entrustBaseData.entrustInfoVO['pushStatusClass'] = pushStatusClassJson[entrustBaseData.entrustInfoVO.pushStatus];
                        }

                        _this.setData({ entrustBaseData: entrustBaseData });
                        //专属委托数据初始化成功后,获取该经纪人的房源
                        _this.getBrokerHouseList();

                    }
                }
            }, complete: function () {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            }
        })
    },

    /**
     * 获取专属委托经纪人的房源
     */
    getBrokerHouseList: function () {
        let _this = this;
        let archiveId = _this.data.entrustBaseData.brokerInfo.archiveId;
        if (!!archiveId) {
            //出售房源
            wx.request({
                url: app.globalData.javaOnlineHost + '/uuhfWeb/secondHouseManager/getSecondHouseListAction',
                data: {
                    pageNum: 1,
                    cityId: _this.data.cityId,
                    caseType: 1,
                    pageSize: 20,
                    archiveId: archiveId,
                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.ERROR_CODE == 0) {
                            var list = res.data.DATA.list;
                            //处理标签
                            list.map(function (ele, i) {
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
                            });
                            _this.setData({ saleList: list });
                        }
                    }
                }
            });

            //出租房源
            wx.request({
                url: app.globalData.javaOnlineHost + '/uuhfWeb/secondHouseManager/getSecondHouseListAction',
                data: {
                    pageNum: 1,
                    cityId: _this.data.cityId,
                    caseType: 2,
                    pageSize: 20,
                    archiveId: archiveId,
                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.ERROR_CODE == 0) {
                            var list = res.data.DATA.list;
                            //处理标签
                            list.map(function (ele, i) {
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
                            });
                            _this.setData({ leaseList: list });
                        }
                    }
                }
            });

        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    // 初始化 商圈/区域/价格 数据
    formatRegData: function (resStr) {
        var _this = this;
        var res = JSON.parse(resStr);

        //初始化商圈列表
        var businessData = res.DATA.SECTION_DATA;
        for (var i in businessData) {
            businessData[i].unshift(['不限', '']);
        };
        //初始化区域数据
        var regData = res.DATA.REG_DATA;
        _this.setData({
            regData: regData,
            businessList: businessData,
            indexSectionList: businessData[1]
        });

        //初始化价格区间
        var _buyPrice = res.DATA.BUY_PRICE_DATA; //求购
        var _rentPrice = res.DATA.RENT_PRICE_DATA; //求租
        function initPrice(data, priceArr) {
            var arr = data.split(',')
            arr.unshift('0');
            arr.push('99999');
            priceArr = [];
            for (let i = 0; i < arr.length - 1; i++) {
                priceArr.push({ id: i, priceL: arr[i], priceH: arr[i + 1] })
            }
            return priceArr;
        }
        _this.setData({
            buyPrice: initPrice(_buyPrice, this.data.buyPrice),
            rentPrice: initPrice(_rentPrice, this.data.rentPrice),
        })
        // console.log(this.data.buyPrice)
    },

    // 切换求购/求租
    changeCaseType: function (e) {
        let caseType = e.currentTarget.dataset.type;
        if (caseType == 3) {
            this.setData({
                caseType: caseType,
            })
        } else {
            this.setData({
                caseType: caseType,
            })
        }
    },

    //显示地址选择
    isShowAddress: function (e) {
        var caseType = this.data.caseType;
        var regId;
        if (caseType == 3) {
            regId = this.data.buy_houseRegion;
            this.setData({
                isAddress: true,
                isRegShowOn: !!this.data.buy_houseRegion ? this.data.buy_houseRegion : this.data.regData[0]['REG_ID'],//行政区id
                isSectionOn: this.data.buy_houseSection,//商圈ID(片区id)
                indexSectionList: regId != '' ? this.data.businessList[regId] : this.data.indexSectionList,
            })
        } else {
            regId = this.data.rent_houseRegion;
            this.setData({
                isAddress: true,
                isRegShowOn: !!this.data.rent_houseRegion ? this.data.rent_houseRegion : this.data.regData[0]['REG_ID'],//行政区id
                isSectionOn: this.data.rent_houseSection,//商圈ID(片区id)
                indexSectionList: regId != '' ? this.data.businessList[regId] : this.data.indexSectionList,
            })
        }
    },
    //隐藏地址选择
    hideAddress: function () {
        this.setData({
            isAddress: false,
        })
    },
    //点击后选择的区域高亮
    isRegShowClick: function (e) {
        var caseType = this.data.caseType;
        var regId = e.currentTarget.dataset.id;
        var regName = e.currentTarget.dataset.name;
        var indexSectionData = this.data.businessList[regId];//获取当前行政区商圈列表

        //
        if (this.data.isRegShowOn == regId) { return; }

        //

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
                isRegShowOn: regId,
                isRegShowOnName: regName,
                isSectionOn: '',
                isSectionOnName: '不限',
                sectionBoxShow: true,
                indexSectionList: indexSectionData,
            });
        }

    },
    isSectionOn: function (e) {
        var caseType = this.data.caseType;
        var SectionID = e.currentTarget.dataset.id;
        var SectionName = e.currentTarget.dataset.name;

        //
        if (this.data.isSectionOn == SectionID) { return; }

        this.setData({
            isSectionOn: SectionID,
            isSectionOnName: SectionName,
        })

    },
    //确定当前选择的地址
    sureAddress: function () {
        var caseType = this.data.caseType;
        this.setData({
            isAddress: false,
        });
        let sectionName = this.data.isSectionOnName == '不限' ? '附近' : this.data.isSectionOnName;
        if (caseType == 3) {
            this.setData({
                sureBuyAddressInfo: this.data.isRegShowOnName + sectionName,
                buy_houseRegion: this.data.isRegShowOn,
                buy_regionName: this.data.isRegShowOnName,
                buy_houseSection: this.data.isSectionOn,
                buy_sectionName: this.data.isSectionOnName,
            })
        } else {
            this.setData({
                sureRentAddress: this.data.isRegShowOnName + sectionName,
                rent_houseRegion: this.data.isRegShowOn,
                rent_regionName: this.data.isRegShowOnName,
                rent_houseSection: this.data.isSectionOn,
                rent_sectionName: this.data.isSectionOnName,
            })
        };
    },
    //户型选择
    houseType: function () {
        var caseType = this.data.caseType;
        let indexhouseFitment = caseType == 3 ? this.data.buy_indexHouseFitment : this.data.rent_indexHouseFitment;
        this.setData({
            isShowHouseType: true,
            indexhouseFitment: indexhouseFitment
        })
    },
    //隐藏户型选择
    hideHouseType: function () {
        this.setData({
            isShowHouseType: false,
        })
    },
    //确定选择的户型
    sureHouseType: function () {
        var caseType = this.data.caseType;
        var val = this.data.indexhouseFitment;
        var room = this.data.roomNumArr[val[0]].value;
        var roomName = this.data.roomNumArr[val[0]].text;
        var houseFitment = this.data.fitmentArr[val[1]].value;
        var houseFitmentName = this.data.fitmentArr[val[1]].text;

        if (caseType == 3) {
            this.setData({
                isShowHouseType: false,  //
                buy_roomL: room,
                buy_roomH: room,
                buy_houseFitment: houseFitment,
                buy_indexHouseFitment: val,
                sureBuyHouseType: roomName + houseFitmentName,    // 
            })
        } else {
            this.setData({
                isShowHouseType: false,
                rent_roomL: room,
                rent_roomH: room,
                rent_houseFitment: houseFitment,
                rent_indexHouseFitment: val,
                sureRentHouseType: roomName + houseFitmentName,    //
            })
        }
    },
    // 户型/装修 滚动改变
    houseTypeDecorateChange: function (e) {
        var val = e.detail.value;
        this.setData({
            indexhouseFitment: val,
        });
    },



    // 打开选择价格弹窗
    isShowPrice: function () {
        var caseType = this.data.caseType;
        let housePriceIndex = caseType == 3 ? this.data.buy_indexPrice : this.data.rent_indexPrice;
        let housePrice = caseType == 3 ? this.data.buyPrice : this.data.rentPrice;
        this.setData({
            isShowPrice: true,
            housePriceIndex: housePriceIndex,
            housePrice: housePrice
        })
    },
    // 价格选择
    priceChange: function (e) {
        var val = e.detail.value;
        this.setData({
            housePriceIndex: val,
        });
    },
    // 确定价格选择值
    surePrice: function () {
        var caseType = this.data.caseType;
        var val = this.data.housePriceIndex;
        let priceL = caseType == 3 ? this.data.buyPrice[val[0]]['priceL'] : this.data.rentPrice[val[0]]['priceL'];
        let priceH = caseType == 3 ? this.data.buyPrice[val[0]]['priceH'] : this.data.rentPrice[val[0]]['priceH'];
        let priceUnit = caseType == 3 ? '万元' : '元';
        let priceStr = '';
        if (val[0] == 0) {
            priceStr = priceH + priceUnit + '以下';
        } else if (val[0] == (this.data.housePrice.length - 1)) {
            priceStr = priceL + priceUnit + '以上';
        } else {
            priceStr = priceL + '-' + priceH + priceUnit;
        }
        if (caseType == 3) {
            this.setData({
                isShowPrice: false,
                buy_indexPrice: val,
                surBuyPrice: priceStr,
                buy_priceL: priceL,
                buy_priceH: priceH,
            })
        } else {
            this.setData({
                isShowPrice: false,
                rent_indexPrice: val,
                surRentPrice: priceStr,
                rent_priceL: priceL,
                rent_priceH: priceH,
            })
        }
    },
    // 取消选择价格弹窗
    hideClose: function () {
        this.setData({
            isShowPrice: false
        })
    },

    /** 
     * 检测当前是否能够发布委托
     */
    checkPublishStatus: function () {
        let _this = this;
        //请求接口判断 是否能够发布
        var requestUrl = app.buildRequestUrl('requestRepeatAction');
        var params = {
            cityId: _this.data.cityId,
            youyouUserId: _this.data.youyouUserId,
        };
        wx.showLoading({ title: '' });
        api.getList(requestUrl, params).then(res => {

            if (res.STATUS != 1) {
                wx.showToast({ title: res.INFO, duration: 2000 });
                return;
            }
            var data = res.DATA;
            if (data.type == 0) {
                //不能发布委托 : 您只能发布3个委托
                wx.hideLoading()
                wx.showModal({
                    title: '',
                    content: data.info,
                    confirmText:'立即查看',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            wx.navigateTo({ url: "/pages/trustList/trustList?caseType="+_this.data.caseType});
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                return;
            }

            //能够发布
            _this.formSubmit();

        });
    },

    formSubmit: function () {
        var _this = this;

        let houseRegion = _this.data.caseType == 3 ? _this.data.buy_houseRegion : _this.data.rent_houseRegion;
        let regionName = _this.data.caseType == 3 ? _this.data.buy_regionName : _this.data.rent_regionName;
        let houseSection = _this.data.caseType == 3 ? _this.data.buy_houseSection : _this.data.rent_houseSection;
        let sectionName = _this.data.caseType == 3 ? _this.data.buy_sectionName : _this.data.rent_sectionName;
        let roomL = _this.data.caseType == 3 ? _this.data.buy_roomL : _this.data.rent_roomL;
        let roomH = _this.data.caseType == 3 ? _this.data.buy_roomH : _this.data.rent_roomH;
        let houseFitment = _this.data.caseType == 3 ? _this.data.buy_houseFitment : _this.data.rent_houseFitment;
        let priceL = _this.data.caseType == 3 ? _this.data.buy_priceL : _this.data.rent_priceL;
        let priceH = _this.data.caseType == 3 ? _this.data.buy_priceH : _this.data.rent_priceH;

        var isHelp = 0;     //默认 不代填
        if (!houseRegion) { isHelp = 1 };
        if (!houseSection) { isHelp = 1 };
        if (!roomL) { isHelp = 1 };
        if (!priceH) { isHelp = 1 };

        var sendData = {
            caseType: _this.data.caseType,
            shareId: _this.data.shareId,
            archiveId: _this.data.entrustBaseData.brokerInfo.archiveId,
            youyouUserId: _this.data.youyouUserId,
            isHelp: isHelp,
            cityId: _this.data.cityId,

            houseRegion: houseRegion,
            regionName: regionName,
            houseSection: houseSection,
            sectionName: sectionName,

            houseFitment: houseFitment,
            roomL: roomL,
            roomH: roomH,
            priceL: priceL,
            priceH: priceH,
            isVip: 1 //
        };
        console.log(sendData);
        wx.showLoading({
            title: ''
        });
        wx.request({
            url: app.buildRequestUrl('createCustEntrust'),
            data: sendData,
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.STATUS == 1) {
                        var data = res.data.DATA
                        if (data.type == 1) {
                            wx.redirectTo({
                                url: "/pages/trustList/trustList?caseType=" + data.caseType  //发布成功跳转委托列表
                            })
                        } else {
                            // 发布失败
                            wx.showModal({
                                title: '',
                                content: data.info,
                                showCancel: false,
                            })
                            return;
                        }
                    } else {
                        wx.showToast({
                            title: res.INFO,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },

    //点击显示红包
    showRedPacket: function () {
        this.setData({ 
            couponBoxFlag: true,
            couponBoxshow: true,
         })
    },

    // 关闭红包弹窗
    couponBoxClose: function () {
        this.setData({ couponBoxFlag: false })
    }






})