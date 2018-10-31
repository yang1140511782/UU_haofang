const app = new getApp();
var api = require('../../utils/common.js')
import {
    Tools
} from '../../utils/tools';
import { BehaviorTools } from '../../utils/behaviorTools'
var _im = require('../../utils/_im.js');
const tool = new Tools();
const behaviorTool = new BehaviorTools();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        animationData: {},
        showFlas: true,
        offFlag: false,
        ajaxUrl: '',
        info: '',
        banner: [],
        userName: '', //客户名
        userTel: '', //客户电话
        currentPic: 1, //当前轮播图的index
        longitude: '', //经度
        latitude: '', //纬度
        hasloaded: false, //初次进入页面,数据是否加载完
        bigPicBox: false,
        hasCollect: false,
        bookToLookBox: false,
        telephone: '',
        archiveId: '',
        userId: '',
        markers: [],
        buildId: 0,
        imgUrls: [], //banner图
        newHouseDetailUrl: app.buildRequestUrl('newHouseDetail'), //新房详情数据接口
        addOrDeleteCollectUrl: app.buildRequestUrl('addOrDeleteCollectUrl'), //新房收藏接口
        getSaleUserListUrl: app.buildRequestUrl('getSaleUserList'), //置业顾问接口
        winWidth: '', //屏幕宽度
        typeList: {
            '公交': {
                typeId: 'bus',
                typeName: '公交'
            },
            '地铁': {
                typeId: 'subway',
                typeName: '地铁'
            },
            '学校': {
                typeId: 'school',
                typeName: '学校'
            },
            '医院': {
                typeId: 'hospital',
                typeName: '医院'
            },
            '银行': {
                typeId: 'bank',
                typeName: '银行'
            },
            '休闲娱乐': {
                typeId: 'leisure',
                typeName: '休闲娱乐'
            },
            '购物': {
                typeId: 'shopping',
                typeName: '购物'
            },
            '餐饮': {
                typeId: 'food',
                typeName: '餐饮'
            },
            '运动健身': {
                typeId: 'sports',
                typeName: '运动健身'
            },
        },
        queryBoxHide: true, //置业顾问弹框
        downBox: false, //引导下载弹框
        userList: [], //置业顾问列表
        currentIndex: 0, //当前置业顾问的序号
        collectToast: false, //收藏tosat弹框
        collectTxt: "", //收藏提示文字
        downAppBoxShow: false,
        backToIndexBtn: false, //是否展示 返回首页按钮
        unreadNum: 0,
        archiveId: '',
        shareArchiveId:'',
        archiveInfo: '',
        caseType: 6,
        cityId: null,
        // 绑定手机弹出表单
        forData: {
            userName: '',
            userPhone: '',
            phoneCode: ''
        },
        testCodeTime: 0, // 发送短信倒计时
        phoneModalFlag: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        //二维码扫码进入的详情页
        var scene = options.scene;
        if (!!scene) {
            scene = decodeURIComponent(scene).split("&");
            if(scene.length > 3){
                options.caseType = scene[0];
                options.resource = scene[1];
                options.cityId = scene[2];
                options.buildid = scene[3];
                options.archiveId = scene[4];
              //二维码进入详情页 (有经纪人) 也可以参与新用户赚现金活动
              if (!!options.archiveId) {
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
        let isIphoneX = app.globalData.isIphoneX;
        this.setData({
            isIphoneX: isIphoneX,
            userInfo: wx.getStorageSync('userInfo'),
            archiveId: options.archiveId || ''
        });
        console.log(options);
        //
        if (options.source == 'uuapp' || options.source == 'zshft' || options.source == 'personalStore') {
            if (options.activity == 1) {
                wx.setStorageSync('shareArchiveId', options.archive_id?options.archive_id:(options.archiveId ? options.archiveId : ''));
                wx.setStorageSync('shareCaseType', options.casetype);
                wx.setStorageSync('shareCityId', options.cityid);
                wx.setStorageSync('shareCaseId', options.caseid);
            }
            this.setData({
                shareArchiveId: options.archive_id?options.archive_id:(options.archiveId ? options.archiveId : ''),
                archiveId: options.archive_id?options.archive_id:(options.archiveId ? options.archiveId : ''),
                cityId: options.cityid ? options.cityid : options.cityId
            });

            console.log(that.data.cityId);
        };
        if (wx.getStorageSync('userId') && wx.getStorageSync('openId')) {
            if (wx.getStorageSync('shareArchiveId')) {
                wx.request({
                    url: app.buildRequestUrl('stimulerBroker'), //2018.08.24  lwj
                    data: {
                        openId: wx.getStorageSync('openId'),
                        caseType: wx.getStorageSync('shareCaseType'),
                        cityId: wx.getStorageSync('shareCityId') ? wx.getStorageSync('shareCityId') : that.data.cityId,
                        caseId: wx.getStorageSync('shareCaseId'),
                        shareArchiveId: wx.getStorageSync('shareArchiveId'),
                        youyouUserId: wx.getStorageSync('userId')
                    }
                });
            }
        }
        //获取当前页面层级
        var getCurrentPagesLength = getCurrentPages().length;
        if (getCurrentPagesLength == 1) {
            //分享出来页面右下角都要显示
            that.setData({
                backToIndexBtn: true
            });
        }
        var userId = wx.getStorageSync('userId');
        that.setData({
            buildId: options.buildid,
            userId: userId
        });
        if (!wx.getStorageSync('openId')) {
            app.saveUserData();
        }
        //获取设备宽度
        try {
            var winWidth = wx.getSystemInfoSync().windowWidth;
        } catch (e) {
            console.log('获取设备宽度失败!')
        };
        wx.request({
            url: that.data.newHouseDetailUrl,
            data: {
                buildId: that.data.buildId,
                archiveId: that.data.shareArchiveId ? that.data.shareArchiveId:that.data.archiveId,
                youyouUserId: userId
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    if (!res.data.DATA) return;
                    var arr = res.data.DATA;
                    //设置页面标题
                    var buildName = arr.buildName;
                    wx.setNavigationBarTitle({
                        title: buildName
                    });
                    //楼盘标签
                    arr['BUILDING_FEATURE'] = [];
                    if (!!arr['buildTag'] && arr['buildTag'] != '-') {
                        arr['BUILDING_FEATURE'] = (arr['buildTag'].split(','));
                    }
                    if (!!arr['buildType'] && arr['buildType'] != '-') {
                        arr['BUILDING_FEATURE'].push(arr['buildType'].split(','));
                    };
                    if (!!arr['buildFitment'] && arr['buildFitment'] != '-') {
                        arr['BUILDING_FEATURE'].push(arr['buildFitment'].split(','));
                    };
                    arr['BUILDING_FEATURE'] = arr['BUILDING_FEATURE'].slice(0, 3);
                    //展示分享经纪人信息
                    if (arr['archiveInfo']) {
                        // that.setData({
                        //     archiveInfo: arr['archiveInfo']
                        // });
                    }
                    //是否收藏
                    if (arr['isCollected'] == 1) {
                        that.setData({
                            hasCollect: true
                        });
                    };
                    //是否有置业顾问
                    if (arr['userList']) {
                        arr['userList'].map(function(ele, i) {
                            ele['userId'] = 'ld_' + ele['userId']; //置业顾问Id = ld_ + userId;
                        });
                        that.setData({
                            userList: arr['userList']
                        });
                    };
                    //户型数据
                    if (arr['layoutCount'] != 0) {
                        var huxing = arr['layoutList'];
                        for (var i = 0; i < huxing.length; i++) {
                            if (huxing[i]['layoutTag']) {
                                huxing[i]['layoutTag'] = huxing[i]['layoutTag'].split(' ').splice(0, 3);
                            } else {
                                huxing[i]['layoutTag'] = [];
                            };
                        };
                        arr['HUXINGS'] = huxing;
                    };
                    //地图
                    var mapImgUrl = "https://apis.map.qq.com/ws/staticmap/v2/" + "?center=" + arr.positionX + "," + arr.positionY + "&zoom=16" + "&markers=size:large|icon:https://cd.haofang.net/Public/images/wap/icon_mylocation.png|" + arr.positionX + "," + arr.positionY + "&key=DGFBZ-3IFW2-PDEUL-CBLCE-XOSYK-K5B5I" + "&size=" + winWidth + "*" + parseInt(winWidth * 0.5);
                    //地图数据
                    that.setData({
                        mapImgUrl: mapImgUrl,
                        preLoading: true,
                        maskShow: false,
                        buildName: buildName
                    });
                    //坐标
                    var marker = [{
                        iconPath: "https://weidian.haofang.net/Public/images/newhouse/images/mymy.png",
                        id: 0,
                        latitude: arr.positionX ? arr.positionX : '',
                        longitude: arr.positionY ? arr.positionY : '',
                        width: 30,
                        height: 30,
                        // callout: {
                        //   content: arr.BUILDING_NAME,
                        //   bgColor: '#00ca85',
                        //   color: '#fff',
                        //   fontSize: 15,
                        //   padding: 10,
                        //   borderRadius: 5,
                        //   display: 'ALWAYS'
                        // }
                    }];
                    //banner图
                    var bannerArr = [];
                    if (arr.photoList) {
                        arr.photoList.map(function(ele, i) {
                            var a = tool.addImgParam(ele.photoAddr, 640, 480);
                            bannerArr.push(a);
                        });
                    };
                    if (arr.buildPhotoList) {
                        var b = arr.buildPhotoList;
                        var plArr = [];
                        for (var i = 0; i < b.length; i++) {
                            for (var j = 0; j < b[i]['photoListSub'].length; j++) {
                                b[i]['photoListSub'][j]['photoAddr'] = tool.addImgParamCrop(b[i]['photoListSub'][j]['photoAddr'], 133, 100);
                            }
                        }
                    };
                    if (arr.hasSaleUsers == 1) {
                        that.setData({
                            info: arr,
                            latitude: arr.positionX ? arr.positionX : '',
                            longitude: arr.positionY ? arr.positionY : '',
                            imgUrls: bannerArr,
                            markers: marker,
                            hasloaded: true,
                            winWidth: winWidth
                        });
                        //获取置业顾问数据
                        wx.request({
                            url: that.data.getSaleUserListUrl,
                            data: {
                                buildId: arr.buildId
                            },
                            success: function(res) {
                                if (res.data.STATUS != 1) return;
                                that.setData({
                                    userList: res.data.DATA.userList,
                                    telephone: res.data.DATA.userList[0].phone400Num ? res.data.DATA.userList[0].phone400Num : "",
                                    archiveId: res.data.DATA.userList[0].imId
                                });
                            }
                        });
                    } else {
                        that.setData({
                            telephone: arr.buildPhone400Num ? arr.buildPhone400Num : '',
                            info: arr,
                            latitude: arr.positionX ? arr.positionX : '',
                            longitude: arr.positionY ? arr.positionY : "",
                            imgUrls: bannerArr,
                            markers: marker,
                            hasloaded: true,
                            winWidth: winWidth
                        });
                    };
                }
            }
        })
        _im.initIm();
        this.initUnreadNum();
        //如果有经纪人
        // this.getArchiveInfo();
        //用户进入详情统计行为
        behaviorTool.inStoreAction(that);


    },
    /**
     * 有多个置业顾问,切换置业顾问
     */
    changeArchive(e) {
        var index = e.detail.current;
        var userList = this.data.userList;
        this.setData({
            telephone: userList[index].phone400Num ? userList[index].phone400Num : '',
            archiveId: userList[index].userId,
            currentIndex: index
        });
    },
    /**
     * 点击咨询置业顾问
     */
    showQueryBox() {
        this.setData({
            queryBoxHide: false
        });
    },
    /**
     * 点击置业顾问的叉
     */
    hideQueryBox() {
        this.setData({
            queryBoxHide: true
        });
    },
    /**
     * 关闭引导下载弹框
     */
    closeDownBox() {
        this.setData({
            downBox: false
        });
    },
    /**
     * 点击隐号通话
     */
    clickHiddenCall() {
        this.setData({
            downAppBoxShow: true,
            queryBoxHide: true
        });
    },
    downCloseEvent() {
        this.setData({
            downAppBoxShow: false
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
     * 调整地图页
     */
    goToMap(e) {
        var lat = e.currentTarget.dataset.lat;
        var lng = e.currentTarget.dataset.lng;
        var type = e.currentTarget.dataset.type;
        var buildname = e.currentTarget.dataset.buildname;
        wx.setStorageSync('mapType', type)
        //收集行为数据
        behaviorTool.saveCustBehaviorForStore('39', this);
        if (!!type) {
            behaviorTool.saveCustBehaviorForStore('42', this);
            wx.navigateTo({
                url: "/packageTool/pages/map/map?lat=" + lat + "&long=" + lng + "&type=" + type + '&buildname=' + buildname
            });
        } else {
            behaviorTool.saveCustBehaviorForStore('43', this);
            wx.navigateTo({
                url: "/packageTool/pages/map/map?lat=" + lat + "&long=" + lng + '&buildname=' + buildname
            });
        }
    },
    /**
     * 滑动轮播图
     */
    changePic: function(e) {
        var current = e.detail.current;
        this.setData({
            currentPic: current + 1
        });
    },
    /**
     * 点击收藏按钮
     */
    collectEvent() {
        //登录验证
        let checkLoginFlag = app.checkLogin();
        if (!checkLoginFlag) {
            return;
        }
        var that = this;
        var boo = !that.data.hasCollect;
        var info = that.data.info;
        wx.request({
            url: that.data.addOrDeleteCollectUrl,
            data: {
                cityId: info.cityId,
                caseType: 6,
                caseId: info.buildId,
                reSource: 6,
                userId: app.globalData.userId
            },
            success: function(res) {
                if (res.data.STATUS == 1) {
                    that.setData({
                        hasCollect: boo,
                        collectToast: true,
                        collectTxt: res.data.INFO
                    });
                    setTimeout(function() {
                        that.setData({
                            collectToast: false
                        });
                    }, 1000);
                } else {
                    that.setData({
                        collectToast: true,
                        collectTxt: res.data.INFO
                    });
                    setTimeout(function() {
                        that.setData({
                            collectToast: false
                        });
                    }, 1000);
                };
            }
        });
      if (that.data.shareArchiveId || that.data.archiveId){
        if (that.data.hasCollect) {
          behaviorTool.saveCustBehaviorForStore('52', that);
        } else {
          behaviorTool.saveCustBehaviorForStore('51', that);
        }
      }
        
       // behaviorTool.saveCustBehaviorForStore('51', this);
    },
    /**
     * 点击轮播图,看大图
     */
    bigImg(e) {
         // 采集用户行为数据
        behaviorTool.saveCustBehaviorForStore('38', this)

        var currentImage = e.currentTarget.dataset.image;
        var imageArr = this.data.imgUrls;
        wx.previewImage({
            current: currentImage,
            urls: imageArr
        })
    },
    /**
     * map周边
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    viewDetailMap: function(e) {
        var data = this.data.info;
        var type = e.currentTarget.dataset.type;
        console.log(data);
        var url = '/packageTool/pages/map/map?type=' + type + '&buildName=' + data.BUILDING_NAME + '&lat=' + data.POSITION_X + '&long=' + data.POSITION_Y;
        wx.navigateTo({
            url: url
        })
    },
    /**
     * 点击预约看房
     */
    openBookToLookBox() {
        this.setData({
            bookToLookBox: true
        });
    },
    /**
     * 点击弹框的叉和蒙层,关闭弹框
     */
    closeBookToLookBox() {
        this.setData({
            bookToLookBox: false
        });
    },
    /**
     * 点击弹框,阻止事件冒泡
     */
    prevent() {},
    /**
     * 电话咨询
     */
    makeacall() {
        var tel = this.data.telephone;
        wx.makePhoneCall({
            phoneNumber: tel
        });
    },
    /**
     * 进入户型页
     */
    goTohuxing() {
        wx.navigateTo({
          url: '/packageTool/pages/allHouseType/allHouseType?buildid=' + this.data.buildId
        });
    },
    /**
     * 进入图库页
     */
    goTotuku() {
        wx.navigateTo({
            url: '/packageTool/pages/houseGallery/houseGallery?buildid=' + this.data.buildId
        });
    },
    /**
     * 进入周边新房详情
     */
    goToSurroundNewHouse(e) {
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: '../newHouseDetail/newHouseDetail?buildid=' + id
        });
    },
    /**
     * 周边新房查看更多
     */
    goToSurroundNewHouseList(e) {
        var regId = e.currentTarget.dataset.regid;
        var regName = e.currentTarget.dataset.regname
        wx.redirectTo({
            url: '../newHouseList/newHouseList?buildregion=' + regId + '&regname=' + regName
        });
    },
    /**
     * 点击在线聊天
     */
    goToIM() {
        var data = this.data;
        var userId = data.archiveId;
        var caseId = data.buildId;
        wx.navigateTo({
            url: '../im/im?to=' + userId
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},
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
    offToast: function() {
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},
    /**
     * 返回首页按钮
     */
    backToIndex: function() {
        wx.reLaunch({
            url: "/pages/real_index/index"
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var _this = this;
        var data = this.data;

        var pathUrl = tool.getCurrentPageUrlWithArgs();
        //分享调用
        return {
            title: _this.data.buildName,
            path:pathUrl,
            success: function(res){
        　　　　　　// 转发成功之后的回调
        　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
                  // 采集用户分享行为
                  behaviorTool.saveCustBehaviorForStore('41', _this);
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
    initUnreadNum: function() {
        var _this = this;
        var unreadNum = wx.getStorageSync('unreadNum') ? parseInt(wx.getStorageSync('unreadNum')) : 0;
        _this.setData({
            unreadNum: unreadNum
        });
    },
    //页面右侧提示有未读消息
    hintUnread: function() {
        var unreadNum = this.data.unreadNum + 1;
        this.setData({
            unreadNum: unreadNum
        })
    },
    //点击消息提示，跳转到联系人列表
    msgNotifyClick: function(e) {
        wx.switchTab({
            url: '/pages/news/news'
        })
    },
    getUser: function(e) {
        var that = this;
        wx.login({
            success: function(loginRes) {
                if (loginRes.code) {
                    wx.request({
                        url: app.buildRequestUrl('dealUserInfo'),
                        data: {
                            code: loginRes.code,
                            userInfo: e.detail
                        },
                        success: function(res) {
                            var json = res.data;
                            console.log(json);
                            wx.setStorageSync('userInfo', e.detail.userInfo);
                            that.setData({
                                userInfo: e.detail.userInfo
                            });
                            if (json.STATUS == 1) {
                                try {
                                    wx.setStorageSync('userId', json.DATA.userId);
                                    wx.setStorageSync('openId', json.DATA.openId);
                                    app.globalData.userId = json.DATA.userId;
                                    app.globalData.openId = json.DATA.openId;
                                    that.setData({
                                        userId: json.DATA.userId,
                                        userInfo: e.detail.userInfo
                                    });
                                    var shareArchive = wx.getStorageSync('shareArchiveId');
                                    var shareUserId = wx.getStorageSync('shareUserId');
                                    var shareCaseType = wx.getStorageSync('shareCaseType');
                                    var shareCityId = wx.getStorageSync('shareCityId');
                                    var shareCaseId = wx.getStorageSync('shareCaseId');
                                    var youyouUserId = json.DATA.userId;
                                    if (!!shareArchive) {
                                        wx.request({
                                            url: app.buildRequestUrl('stimulerBroker'), //2018.08.24  lwj
                                            data: {
                                                openId: json.DATA.openId,
                                                caseType: shareCaseType,
                                                cityId: shareCityId ?shareCityId : that.data.cityId,
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
                                //用户进入新房详情
                                behaviorTool.inStoreAction(that);
                                //调用一下是否显示蒙层
                                that.showMaskBox();
                            }
                        },
                        fail: function(res) {
                            console.log('刷新session失败！');
                            console.log(res)
                        },
                        complete: function() {
                            let userId = wx.getStorageSync('userId');
                            let cityId = wx.getStorageSync('locateCityId');
                            app.bindCity(userId, cityId);
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    },
    //展示蒙层
    showMaskBox: function() {
        var _this = this;
        //获取当前页面层级
        var getCurrentPagesLength = getCurrentPages().length;
        if (getCurrentPagesLength == 1) {
            //分享出来页面右下角都要显示
            _this.setData({
                backToIndexBtn: true
            });
            //如果分享出来的详情页为首页,则展示首页按钮
            var userId = wx.getStorageSync('userId');
            wx.request({
                url: app.buildRequestUrl('hasFormIdUrl'),
                // url:'http://lbuuweb.hftsoft.com/Mini/App/hasFormId',
                data: {
                    youyouUserId: userId
                },
                success: function(res) {
                    if (res.data.hasForm == 0) {
                        _this.setData({
                            guideBackIndex: true
                        });
                    }
                }
            })
        }
    },
    getArchiveInfo: function(cb) {
        var that = this;
        var archiveId = that.data.shareArchiveId ? that.data.shareArchiveId : that.data.archiveId;
        if(!archiveId){return false}
        wx.request({
          url: 'https://uu.haofang.net/Wap/Store/headInfo?archiveId=' + archiveId,
            success: function(res) {
              console.log(res.statusCode);
              if (res.statusCode == 200) {
                var brokerInfo = res.data.archiveInfo
                console.log(brokerInfo);
               
                    brokerInfo.brokerPhoto = brokerInfo.USER_PHOTO;
                    brokerInfo.brokerName = brokerInfo.USER_NAME;
                    that.setData({
                        agentCont: true,
                        archiveId: that.data.shareArchiveId,
                        currUserMobile: brokerInfo.USER_MOBILE,
                        currUserPhotoUrlPath: brokerInfo.USER_PHOTO,
                        currUserName: brokerInfo.USER_NAME,
                        archiveInfo: brokerInfo
                    })
                typeof (cb) == 'function' && cb(brokerInfo);
                }
            }
        })
    },
    /** 点击预约看房 */
    goToEntrust: function() {
      behaviorTool.saveCustBehaviorForStore('45', this);

      this.showPhoneModalFn()
    },
    /**
     * 咨询置业顾问
     */
    chooseContactType: function(e) {
      behaviorTool.saveCustBehaviorForStore('44', this);

      wx.navigateTo({
          url: '/pages/im/im?to=' + this.data.archiveId
      })
    },
    // 输入框的双向绑定
    bindKeyInput(e) {
        let obj = {}
        obj[e.target.dataset.key] = e.detail.value
        this.setData(obj)
    },
    // 验证手机号
    testPhoneNum() {
        let reg = /^((1[3-8][0-9])+\d{8})$/
        if (!(reg.test(this.data.forData.userPhone)) && this.data.forData.userPhone != '') {
            wx.showToast({
                title: '手机号格式不正确',
                icon: 'none'
            })
            return false
        } else {
            return true
        }
    },
    // 获取验证码
    getTestCode() {
        let that = this
        if (this.data.forData.userPhone == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            })
            return
        }
        // 验证手机号
        if (!this.testPhoneNum()) {
            return
        }
        let reduceTime = 60
        wx.request({
            url: app.buildRequestUrl('sendMsg'),
            data: {
                mobile: this.data.forData.userPhone
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.status === 1) {
                    wx.showToast({
                        title: res.data.info,
                        icon: 'none'
                    })
                    that.setData({
                        testCodeTime: reduceTime
                    })
                    let codeTime = setInterval(() => {
                        reduceTime -= 1
                        if (that.data.testCodeTime < 1) {
                            clearInterval(codeTime);
                            return;
                        }
                        that.setData({
                            testCodeTime: reduceTime
                        })
                    }, 1000)
                } else {
                    wx.showToast({
                        title: res.data.info,
                        icon: 'none'
                    })
                    that.setData({
                        testCodeTime: 0
                    })
                }
            }
        })
    },
    // 关闭 预约看房 弹出
    closePhoneModalFn() {
        this.setData({
            phoneModalFlag: false
        })
    },
    // 弹出 预约看房 弹出
    showPhoneModalFn() {
        this.setData({
            phoneModalFlag: true
        })
    },
    /**
     * 提交预约看房信息
     */
    submitBindPhone: function() {
        let that = this
        if (this.data.forData.userName == '') {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            });
            return;
        }
        if (this.data.forData.userPhone == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            });
            return;
        }
        if (this.data.forData.phoneCode == '') {
            wx.showToast({
                title: '请输验证码',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: '提交中',
            mask: true
        })
        wx.request({
            url: app.buildRequestUrl('saveIntentionCustomerInfo'),
            data: {
                cityId: wx.getStorageSync('cityId'),
                bCityId: that.data.info.dataCityId,
                buildId: that.data.info.buildId,
                custName: that.data.forData.userName,
                custMobile: that.data.forData.userPhone,
                code: that.data.forData.phoneCode,
                archiveId: that.data.archiveId
            },
            success: function(res) {
                var json = res.data
                console.log(json)
                wx.hideLoading()
                if (json.code == 1) {
                    // 提交成功
                    wx.showToast({
                        title: json.msg,
                        icon: 'none'
                    })
                    that.closePhoneModalFn(); // 关闭绑定弹窗
                } else {
                    wx.showToast({
                        title: json.msg,
                        icon: 'none'
                    })
                }
                // 验证完毕, 重置验证码发送机制 
                that.setData({
                    testCodeTime: 0
                })
            }
        })
    },
    /**
     * 返回首页
     */
    indexBtnEvent: function() {
      behaviorTool.saveCustBehaviorForStore('46', this);

      wx.switchTab({
          url: '/pages/real_index/index'
      })
    },
})