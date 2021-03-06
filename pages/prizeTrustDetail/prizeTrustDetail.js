var app = getApp();
//im相关
let imSdk = require('../../utils/NIM_Web_NIM_v5.0.0.js');
let common = require('../../utils/common.js');
let _im = require('../../utils/_im.js');
let nim = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    pushLogId: '',
    isEvaluate: false,                 //是否评价
    toastMask: false,
    guideToast: true,
    currentManagerCondition: 1,      //当前流程
    modalText: '',                   //是否同意看房弹框文字
    showOrHideModal: false,          //是否同意看房弹框
    serverStarVal: 0,                 //成交评价点击五角星的值
    serviceEvaluateBox: false,       //服务评价弹框
    realHouseOrNot: true,            //真房源还是假房源  (写错了)
    seeEvaluateBox: false,             //带看评价弹框
    seeStarVal: 4,                 //带看评价点击五角星的值
    houseIntentionBox: false,         //房源意向弹窗
    noSeeConfirmBox: false,          //不看该房的确认弹窗
    refuseBrokerBox: false,           //拒绝经纪人弹窗
    pushStatusClass: '1',//流程对应的进度条值(1-4):新增
    trackInfos: [],
    avatarUrl: '',//C端用户头像
    entrustUser: {
      "integrity": 0, //"是否是诚信经纪人（1是0否）", 
      "brokerArchiveId": "",
      "brokerName": "",
      "brokerUserPicUrl": "",
      "brokerMobile": "",//接单经纪人的手机号
      "entrustHouseNum": "0",
      "receivingNum": "",//经纪人的成功接单次数-用于IM聊天界面、委托详情界面
      "currVipQueueStatus": "",
      //求租求购：2接单、3带看、4完成、5推荐，出租出售：2已接单 3已联系 4申请房勘 5同意房勘 6转入系统 7房勘完成
      "pushStatus": "2",
      "requireStatus": "",//委托状态：0已取消 1委托中 2已成交
      "isEvaluate": 0,//成交以后是否对服务评价，1：已评价，非1未评价
      "starLevel": "",//星级1-5
      "starLevelShow": "",
      "pushLogId": "",//经纪人接单信息ID
      "recomInfoId": "",//经纪人的推荐信息ID，这个值只有在推荐信息成交后才会有值，非成交情况该值没有用
      "vipCaseId": "",
      "caseType": "",//委托类型：1出售 2整租 3求购 4求租 5合租
      "daikanCount": "0",
      "isUpdateRedFlag": "0",
      "isVip": "0",
      "isContact": "0",
      "rewardType": "",//0普通委托1有奖委托
      "rewardStatus": "4",//有奖委托状态0默认 1已支付 2投诉中 3投诉成功 4投诉失败
      "isAppeal": "",//是否有申诉1是0否
      "complaintId": "",//投诉ID,
    	"reWardMoney":''  
    },
    "custHouseList": [],
    "housingHouseList": [],
    checkedEvaReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    },
    checkedCompleteReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    }, //选中服务评价原因
    checkedRefuseReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }, //拒绝经纪人原因
    //服务评价原因
    serverReasonArr: {
      1: ["讲解很不清晰", "专业知识不强", "反馈不及时", "服务态度不好"],
      2: ["讲解一般", "专业度不高", "反馈一般", "服务态度一般"],
      3: ["讲解有待提升", "专业度有待提升", "反馈一般", "服务态度一般"],
      4:["讲解有待提升", "专业度有待提升","反馈比较及时","服务有待提升"]
    },
    //带看评价原因
    seeReasonArr: {
      1: ["讲解很不清晰", "专业知识不强", "与推荐房源不符", "服务态度不好"],
      2: ["讲解一般", "专业度不高", "与推荐房源不符", "服务态度一般"],
      3: ["讲解有待提升", "专业度有待提升", "与推荐房源不符", "服务态度一般"],
    },
    //拒绝经纪人原因
    refuseBrokerReason: [
      '暂不出租/售', '房源信息登记错误', '经纪人态度恶劣', '长期未出售/租'
    ],
    archiveInfo: {
      USER_NAME: "是否是",
      EVA_AVG: 3,
    },      // 经纪人信息
    caseInfo: {},          // 委托信息
    wholeBoxHidden: false, // 最外层盒子(数据加载完后再显示)
    cancelReasonBox: false,  //取消委托弹框
    cancelText: '',       // 记录填写的取消委托原因
    tradeType: 1,   // 交易种类,控制取消委托原因的内容
    //取消委托原因
    cancelReasonData: {
      '1': ["暂不出售/租", "房源信息登记错误", "经纪人态度恶劣", "长期未出售/租"],
      '2': ["暂不出售/租", "房源信息登记错误", "无合适经纪人", "长期未出售/租"]

    },
    checkedArr: [false, false, false, false],
    oldCheckedArr: [false, false, false, false],
    isLike: 1,//带看评价要提交的数据
    realHouse: 1,//带看评价要提交的数据,
    evaContent: '',//带看评价手动填写内容
    recomInfoId: '',//当前操作的房源推荐房源id,
    showCompleteEvaDialog: false,
    realPayMoney4C: '',//成交后显示的实际支付金额
    completeEvaContent: '',//成交评价手动填写内容,
    refuseContent: '',//拒绝经纪人手动填写内容
    appealContent: '',//申诉内容
    followDetailShow: false,//委托跟进详情显示
    showTrackNum: 2,      //刚进页面显示条数
    partTrackInfos: [],   //局部跟进数组
    privacyBoxShow:false,//隐私弹框
    appealFlag: false,//申诉弹窗
    grievanceResultShow:false,//投诉结果处理弹框
    grievanceBomp:false,
    prizeTrustBompShow:false,
    isFirst: false,//是否第一层级
    lastMsg: '',//最后一条消息体,默认值
    lastMsgTime: '',//最后一条消息发送时间
    unreadNum: 0,//总的消息未读数，包括经纪人和客服发来的消息（之所以要和brokerUnreadNum作区分是/utils/_im.js这个公用页面已经将该字段占用了，表示所有的未读消息，然后发送到所有引入了该公共文件的页面）
    brokerUnreadNum: 0,//指定经纪人发来的消息未读数，不包括其他人的消息（区分原因同上）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userId = wx.getStorageSync('userId');
    this.setData({ pushLogId: pushLogId,userId:userId });
    var pushLogId = options.pushLogId;
    that.initEntrustData(pushLogId, userId);
    this.setData({ pushLogId: pushLogId });
    //实例化IM
    //确保用户信息已经实例化
    if (app.globalData.imUserInfo.token) {
      that.initIm();
    } else {
      app.initImUser(function () {
        that.initIm();
      })
    }

    //判断是否是第一层级
    var getCurrentPagesLength = getCurrentPages().length;
    if (getCurrentPagesLength == 1) {
      that.setData({
        isFirst: true
      });
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
    this.initEntrustData(this.data.pushLogId, this.data.userId);
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
	  var that = this;
      return {
        title: '优优好房',
        path: '/pages/real_index/index',
        imageUrl:'http://uuweb.haofang.net/Public/wxApp/images/index/share.png'
      }
  },
  /**
   * 点击查看 委托跟进详情
   */
  followDetailTap: function (e) {
    this.setData({ followDetailShow: !this.data.followDetailShow,privacyBoxShow:false})
  },

  chooseTab: function (e) {
    this.setData({
      tabActive: e.currentTarget.dataset.i
    })
  },
  cancelModal: function () {
    this.setData({
      showOrHideModal: false
    })
  },
  showModal: function (e) {
    if (e.currentTarget.dataset.type == 0) {
      this.setData({
        showOrHideModal: true,
        modalText: '确定不看该房吗？'
      })
    } else {
      this.setData({
        showOrHideModal: true,
        modalText: '确定要接受带看吗？'
      })
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
  },
  initEntrustData: function (pushLogId, userId) {
    var that = this;
    wx.request({
      url: app.buildRequestUrl('getEntrustHouseInfo'),
      data: {
        pushLogId: pushLogId,
        userId: userId
      },
      success: function (res) {
        var status = res.data.STATUS;
        var info = res.data.DATA;
        if (status != 1) {

        }
        that.setData({
          isEvaluate: res.data.DATA.entrustUser.isEvaluate==1?true:false
        });
        if(!!info.entrustUser){
          //处理时间
          if (info.entrustUser.pushLogTime.length > 5) {
            info.entrustUser.pushLogTime = info.entrustUser.pushLogTime.substr(-11, 11);
          }
        	if(info.entrustUser.starLevel){
        		info.entrustUser.starLevelShow = info.entrustUser.starLevel.replace('.','-');
        	}
        	that.setData({entrustUser:info.entrustUser});
        }
        //拉取聊天历史
        that.getChatHistory();
        that.dealData(info, 'entrustUser');
        that.dealData(info, 'housingHouseList');
        //取整
        var delegateHouse = that.data.housingHouseList
        delegateHouse.map(function(ele,i){
           ele['houseArea'] = parseInt(ele.houseArea)
           ele['houseTotalPrice'] = parseInt(ele.houseTotalPrice)
        });
//        that.setData({
//            prizeTrustBompShow:true
//          })
        //判断有奖委托并且 已经支付 取房源id youjiangBomp
        var  delegateEntrustUser=that.data.entrustUser,
            youjiangBomp=wx.getStorageSync('youjiangBomp'),//有奖委托奖励弹框
            grievanceBomp=wx.getStorageSync('grievanceBomp'),
            grievanceResultShow=wx.getStorageSync('grievanceResultShow');
            wx.setStorageSync('brokerArchiveId',delegateEntrustUser.brokerArchiveId);
        if(delegateEntrustUser.rewardType==1&&delegateEntrustUser.rewardStatus==1){
            var brokerArchiveId = wx.getStorageSync('brokerArchiveId');
           if(brokerArchiveId==delegateEntrustUser.brokerArchiveId&&youjiangBomp!=delegateEntrustUser.brokerArchiveId&&delegateEntrustUser.requireStatus!=2){
              that.setData({
                prizeTrustBompShow:true
              })
            }
        }
        if(delegateEntrustUser.rewardType==1&&delegateEntrustUser.rewardStatus==2){
          
          var brokerArchiveId = wx.getStorageSync('brokerArchiveId');
           if(brokerArchiveId==delegateEntrustUser.brokerArchiveId&&grievanceBomp!=delegateEntrustUser.brokerArchiveId&&delegateEntrustUser.requireStatus!=2){
              that.setData({
                grievanceBomp:true
              })
            }
        }
        if(delegateEntrustUser.rewardType==1&&(delegateEntrustUser.rewardStatus==4||delegateEntrustUser.rewardStatus==3)&&delegateEntrustUser.requireStatus!=2){
          var brokerArchiveId = wx.getStorageSync('brokerArchiveId');
          if(brokerArchiveId==delegateEntrustUser.brokerArchiveId&&grievanceResultShow!=delegateEntrustUser.brokerArchiveId){
            that.setData({
              grievanceResultShow:true
            })
          }
      }
        that.setData({
          housingHouseList: delegateHouse
        });
        if (info.custHouseList && info.custHouseList.length > 0) {
          for (var i = 0; i < info.custHouseList.length; i++) {
            if (!!info.custHouseList[i]['tagIds']) {
              info.custHouseList[i]['tagIds'] = info.custHouseList[i]['tagIds'].split("|");
            }
          }
          that.setData({ custHouseList: info.custHouseList });
        }
        that.setData({ userId: userId });

        var pushStatusClassJson = { 2: 1, 3: 1,4: 2, 5: 2, 7: 3 };
        that.dealData(info, 'pushStatusClass', pushStatusClassJson[info.entrustUser.pushStatus]);
        var u = info.entrustUser;
        if (u.isEvaluate == 1) {
          that.getServiceEvaAction();
        }
        that.initTrackData(u.vipCaseId, u.caseType, u.cityId, userId, u.brokerArchiveId);
        if(that.data.entrustUser.pushStatus>4){
          that.setData({
            privacyBoxShow:true
          })
        }
      },
      fail: function () {

      }, complete: function () {
        app.hideToast();
      }
    })
  },
  initTrackData(vipCaseId, caseType, cityId, userId, archiveId) {
    var that = this;
    wx.request({
      url: app.buildRequestUrl('getUUHouseTrackInfos'),
      data: {
        vipCaseId: vipCaseId,
        caseType: caseType,
        cityId: cityId,
        userId: userId,
        archiveId: archiveId,
        userId: userId
      },
      success: function (res) {
        var userInfo = wx.getStorageSync('userInfo');
        userInfo = userInfo.userInfo;
        if (userInfo && userInfo['avatarUrl']) {
          that.setData({ avatarUrl: userInfo['avatarUrl'].substring(0, userInfo['avatarUrl'].length - 1) + "132" });
        }
        var status = res.data.STATUS;

        //	            trackList": [
        //	            {
        //	                "date": "2016-01-01", 
        //	                "trackInfos": [
        //	                    {
        //	                        "hour": "18:30", 
        //	                        "trackTitle": "根据标题", 
        //	                        "fromSource": "来源(0C端用户1经纪人)", 
        //	                        "item": "跟进内容1"
        //	                    }
        //	                ]
        //	            }
        //	        ]
        //	    }
        var trackInfosArr = new Array();
        var trackList = res.data.DATA.trackList;

        console.log(trackList);
        if (trackList.length > 0) {
          for (var i = 0; i < trackList.length; i++) {
            var date = trackList[i].date;
            var trackInfos = trackList[i].trackInfos;
            for (var j = 0; j < trackInfos.length; j++) {
              var x = { photoUrl: (trackInfos[j]['fromSource'] == 1 ? that.data.entrustUser['brokerUserPicUrl'] : that.data.avatarUrl), trackTitle: "【" + trackInfos[j].trackTitle + "】 " + date + " " + trackInfos[j].hour, trackContent: trackInfos[j].item }
              trackInfosArr.push(x);
            }
          }
          //如果跟进数组长度大于刚进页面限制显示条数
          var showTrackNum = that.data.showTrackNum;
          var partArr = trackInfosArr.slice(0, showTrackNum);
          that.setData({
            trackInfos: trackInfosArr,
            partTrackInfos: partArr
          });
        }
        //				console.log(info);
      },
      fail: function () {

      }
    })
  },
  agreen4FangKan: function (e) {
    console.log(e);
    var that = this;
    wx.request({
      url: app.buildRequestUrl('agreen4FangKan'),
      data: {
        pushLogId: e.target.dataset.pushlogid,
        youyouUserId: app.globalData.userId,
        isVip: e.target.dataset.isvip
      },
      success: function (res) {
        var status = res.data.STATUS;
        if (status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500
          });
          that.initEntrustData(that.data.entrustUser.pushLogId, that.data.userId);
        }else{
        	wx.showToast({
                title: res.data.INFO,
                image:'../../images/warning.png',
                duration: 1500
              });
        }
      }
    })
  },
  disagreen4FangKanDialog: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定拒绝看房吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.disagreen4FangKan(e);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  disagreen4FangKan: function (e) {
    var that = this;
    wx.request({
      url: app.buildRequestUrl('disagreen4FangKan'),
      data: {
        pushLogId: e.target.dataset.pushlogid,
        isVip: e.target.dataset.isvip,
        youyouUserId: app.globalData.userId
      },
      success: function (res) {
        console.log(res);
        var status = res.data.STATUS;
        if (status == 1) {
          that.setData({ noSeeConfirmBox: false });
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500
          });
          that.initEntrustData(that.data.entrustUser.pushLogId, that.data.userId);
        }else{
        	wx.showToast({
                title: res.data.INFO,
                image:'../../images/warning.png',
                duration: 1500
              });
        }
      }
    })
  },
  /**
   * 关闭 点击拨打电话蒙层
   */
  maskHideBtn: function () {
    this.setData({
      toastMask: false
    })
  },
  /**
   * 点击拨打电话
   */
  showPhoneMask: function (e) {
    //直接拨打电话
    var brokerMobile = e.currentTarget.dataset.tel;
    if (!!brokerMobile) {
      wx.makePhoneCall({
        phoneNumber: brokerMobile //仅为示例，并非真实的电话号码
      })
    }
    //   this.setData({toastMask: true})
  },
  /**
   * 点击拨打电话
   */
  makeCall: function (e) {
    var brokerMobile = e.currentTarget.dataset.mobile;
    if (!!brokerMobile) {
      wx.makePhoneCall({
        phoneNumber: brokerMobile //仅为示例，并非真实的电话号码
      })
    }
  },
  /**
   * 咨询经纪人
   */
  imContact: function (e) {
    var archiveId = e.currentTarget.dataset.archive;
    if (!!archiveId) {
      //如果有房源(1条),带上房源信息
      var custHouseList = this.data.custHouseList;
      if (custHouseList.length == 1) {
        var custHouseData = custHouseList[0];
        var url = "/pages/im/im?to=" + archiveId + "&caseId=" + custHouseData.houseId + "&caseType=" + custHouseData.caseType;
      } else {
        var url = "/pages/im/im?to=" + archiveId;
      }
      wx.navigateTo({
        url: url
      })
    }
  },

  daikanEva: function (e) {//显示带看评价弹框
    this.setData({
      seeEvaluateBox: true,
      recomInfoId: e.target.dataset.recominfoid
    })
  },
  /**
   * 关闭带看评价弹框
   */
  daikanEvaClose: function (e) {
    this.setData({
      seeEvaluateBox: false,
    })
  },
  chooseEvaStar: function (e) {//改变带看评价星级
    this.setData({
      seeStarVal: e.target.dataset.val
    })
  },
  toggleRealHouse: function (e) {//切换选择真房源/假房源
    this.setData({
      realHouse: e.target.dataset.val
    })
  },
  chooseHouseIntentDialog: function (e) {
    //带看评价四星以下必选原因或者必填文字,否则按钮颜色为灰色不可点
    var evaContent = that.data.evaContent;
    var indexArr = new Array();
    for (var i in that.data.checkedEvaReasonArr) {
      if (that.data.checkedEvaReasonArr[i] == 1) {
        indexArr.push(i);
      }
    }
    if (indexArr.length == 0 && evaContent.length == 0) {
      //alert('请填写完整');
    } else {
      this.setData({
        houseIntentionBox: true
      })
    }
  },
  chooseHouseIntent: function (e) {
    this.setData({
      houseIntentionBox: true
    })
  },
  toogleEvaReason: function (e) {
    var checkedEvaReasonArr = this.data.checkedEvaReasonArr;
    var nowIndex = e.currentTarget.dataset.index;
    if (checkedEvaReasonArr[nowIndex] == 0) {
      checkedEvaReasonArr[nowIndex] = 1;
    } else {
      checkedEvaReasonArr[nowIndex] = 0;
    }
    this.setData({ checkedEvaReasonArr: checkedEvaReasonArr });
  },
  submitEvaData: function (e) {//提交带看评价数据
    var that = this;
    wx.request({
      url: app.buildRequestUrl('createWfRecomHouseEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        realHouse: that.data.realHouse,
        evaContent: that.data.evaContent,
        evaTagIndex: '1,2',
        recomInfoId: that.data.recomInfoId,
        evaStar: that.data.seeStarVal,
        isLike: that.data.isLike
      },
      success: function (res) {
        var status = res.data.STATUS;
        if (status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500
          });
          that.initEntrustData(that.data.entrustUser.pushLogId, that.data.userId);
          that.setData({ houseIntentionBox: false, seeEvaluateBox: false });
        }
      }
    })
  },
  evaContentBlur: function (e) {//填写评价内容
    this.setData({
      evaContent: e.detail.value
    })
  },
  completeEvaContentBlur: function (e) {//成交评价内容
    this.setData({
      completeEvaContent: e.detail.value
    })
  },
  showCompleteEvaDialog: function (e) {
    this.setData({
      showCompleteEvaDialog: true
    })
    app.showToast();
    this.getServiceEvaAction();
  },
  chooseCompleteEvaStar: function (e) {//改变成交评价星级
    this.setData({
      serverStarVal: e.target.dataset.val,
      checkedCompleteReasonArr:[],
    })
  },
  chooseCompleteReason: function (e) {//选择成交评价四星以下原因
    console.log(e);
    var checkedCompleteReasonArr = this.data.checkedCompleteReasonArr;
    var nowIndex = e.currentTarget.dataset.index;
    if (checkedCompleteReasonArr[nowIndex] == 0) {
      checkedCompleteReasonArr[nowIndex] = 1;
    } else {
      checkedCompleteReasonArr[nowIndex] = 0;
    }
    this.setData({ checkedCompleteReasonArr: checkedCompleteReasonArr });
  },
  submitCompleteEvaData: function () {//提交成交评价
    app.showToast();
    var that = this;
    var indexArr = new Array();
    for (var i in that.data.checkedCompleteReasonArr) {
      if (that.data.checkedCompleteReasonArr[i] == 1) {
        indexArr.push(i);
      }
    }
    wx.request({
      url: app.buildRequestUrl('createServiceEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        userId: app.globalData.userId,
        archiveId: that.data.entrustUser.brokerArchiveId,
        cityId: that.data.entrustUser.cityId,
        evaContent: that.data.completeEvaContent,
        evaTagIndex: indexArr.join(","),
        evaStar: that.data.serverStarVal
      },
      success: function (res) {
        console.log(res);
        app.hideToast();
        var status = res.data.STATUS;
        if (status == 1) {
          wx.redirectTo({
            url: '/pages/prizeTrustDetail/prizeTrustDetail?pushLogId=' + that.data.pushLogId
          });
        }
      }
    })
  },
  getServiceEvaAction: function () {
	  var that = this;
	  wx.request({
		  url: app.buildRequestUrl('getServiceEvaAction'),
		  data:{
			  pushLogId:that.data.pushLogId,
		  },
		  success: function (res) {
			  app.hideToast();
			  var status = res.data.STATUS;
			  var data = res.data.DATA;
			  if(status==1){
				  that.dealData(data, 'brokerMoney');
				  that.dealData(data, 'houseMoney');
				  that.dealData(data, 'priceUnit');
				  that.dealData(data, 'onlinePayMoney');
				  that.dealData(data, 'prizeRedMoney');
				  that.dealData(data, 'brokerBuTieMoneyDesc');
				  that.dealData(data, 'realPayMoney4C');
				  that.dealData(data, 'offlinePayMoney');
				  //这种情况表示已经评价了
				  if(data.evaStar>0){
					  that.setData({serverStarVal:data.evaStar});
					  if(data.evaTag){
						  that.setData({evaTag:data.evaTag.split("|")});
					  }
				  }
			  }
		  }
	  })
  },
  showRefuseBrokerDialog: function (e) {//拒绝经纪人
    this.setData({ refuseBrokerBox: true })
  },
  /**
   * 关闭拒绝经纪人弹窗
   */
  closeRefuseBrokerDialog: function (e) {
    this.setData({ refuseBrokerBox: false })
  },
  refuseContentBlur: function (e) {//拒绝经纪人
    this.setData({
      refuseContent: e.detail.value
    })
  },
  appealContentBlur: function (e) {//申诉
    this.setData({
      appealContent: e.detail.value
    })
  },
  toogleRefuseReason: function (e) {//切换选中原因
    var checkedRefuseReasonArr = this.data.checkedRefuseReasonArr;
    var nowIndex = e.currentTarget.dataset.index;
    if (checkedRefuseReasonArr[nowIndex] == 0) {
      checkedRefuseReasonArr[nowIndex] = 1;
    } else {
      checkedRefuseReasonArr[nowIndex] = 0;
    }
    this.setData({ checkedRefuseReasonArr: checkedRefuseReasonArr });
  },
  submitRefuseData: function (e) {
    var that = this;
    var indexArr = new Array();
    for (var i in that.data.checkedRefuseReasonArr) {
      if (that.data.checkedRefuseReasonArr[i] == 1) {
        indexArr.push(i);
      }
    }
    app.showToast();
    wx.request({
      url: app.buildRequestUrl('reFuseBrokerAction'),
      data: {
        pushLogId: that.data.pushLogId,
        refuseReason: that.data.refuseContent,
        refuseTag: indexArr.join(","),
      },
      success: function (res) {
        app.hideToast();
        var status = res.data.STATUS;
        that.setData({
          refuseBrokerBox: false
        });
        if (status == 1) {
        	wx.redirectTo({
    		  url: '/pages/trustList/trustList'
    		})
        }else{
        	wx.showToast({
	            title: res.data.INFO,
	            image:'../../images/warning.png',
	            duration: 1500
	          });
        }
      }
    })
  },
  defaultImg: function(ev){
    //需要访问当前页面的数据对象传递到其它页面上
    var _that = this;
    common.errImgFun(ev, _that, 'avatar');
  },
    /**
   * 跳转到IM页面
   */
  goIm: function (e) {
    let to = e.currentTarget.dataset.to;
    let from = 'uu_' + app.globalData.userId;

    if (getCurrentPages().length < 5) {
      //清除红点，全局未读消息数
      var unreadMsg = wx.getStorageSync('unreadMsg');
      unreadMsg = common.removeUnreadNum('', to);
      wx.navigateTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    } else {
      //清除红点，全局未读消息数
      var unreadMsg = wx.getStorageSync('unreadMsg');
      unreadMsg = common.removeUnreadNum('', to);
      wx.redirectTo({
        url: '/pages/im/im?from=' + from + '&to=' + to,
      })
    }
  },
  /**
   * 隐私弹框消失
   */
  privacyCancelEvent:function(e){
    var _this=this;
    _this.setData({
      privacyBoxShow:false
    })
  },
  sendAppeal: function(e){
    let isAppeal = e.target.dataset.isappeal;
    if (isAppeal == 1){
      wx.showToast({ title: '您已经提交申诉，客服会尽快联系您', icon: 'none', duration: 1000 });
    }else{
      this.setData({
        appealFlag: !this.data.appealFlag
      })
    }
      
  },
  submitAppealData: function(e){
    let that = this;
    var complaintId = e.target.dataset.complaintid;

    wx.request({
      url: app.buildRequestUrl('appealUrl'),
      data: {
        complaintId: complaintId,
        appealReson: that.data.appealContent
      },
      success: function (res) {
        if(res.data.STATUS == 1){
          wx.showToast({ title: '您已经提交申诉，客服会尽快联系您', icon: 'none', duration: 1000 });
          that.setData({
            appealFlag: !that.data.appealFlag
          })
        }

      }
    })
  },
  /**
   *奖励弹框隐藏
   */
  youjiangBompEvent:function(e){
    var that=this;
    try {
      wx.setStorageSync('youjiangBomp', that.data.entrustUser.brokerArchiveId)
    }
     catch (e) {    
    }
    that.setData({
      prizeTrustBompShow:false
    })
  },
  /**
   * 投诉弹框消失 grievanceBomp=wx.getStorageSync('grievanceBomp');
   */
  grievanceBompCancel:function(e){
    var that=this;
     try {
      wx.setStorageSync('grievanceBomp', that.data.entrustUser.brokerArchiveId)
    }
     catch (e) {    
    }
    that.setData({
      grievanceBomp:false
    })
  },
  /**
   * t投诉结果
   */
  grievanceResultCancel:function(e){
     var that=this;
     try {
      wx.setStorageSync('grievanceResultShow', that.data.entrustUser.brokerArchiveId)
    }
     catch (e) {    
    }
    that.setData({
      grievanceResultShow:false
    })
  },
  /**
   * 去详情
   */
  goToDetail:function(e){
    var that=this;
    var caseType=e.currentTarget.dataset.casetype,
    caseId=e.currentTarget.dataset.caseid,
    cityId=e.currentTarget.dataset.cityid;
    wx.navigateTo({
      url:'/pages/delegateHouseDetail/delegateHouseDetail?cityId='+cityId+'&caseId='+caseId+'&caseType='+caseType
    })
  },
  /**
   * 完成
   */
  completeEvent:function(e){
    var that =this;
   wx.navigateBack({
      delta: 1
    })
  },
  initIm: function () {
    let _this = this;
    nim = imSdk.getInstance({
        debug: false,
        appKey: app.globalData.appKey,
        account: 'uu_' + app.globalData.userId,
        token: app.globalData.imUserInfo.token,
        onconnect: _this.onConnect,
        ondisconnect: _this.onDisconnect,
        onmsg: _this.onMsg,
        onerror: _this.onError,
        oncustomsysmsg: _this.onCustomSysMsg,
        onupdatesession: _this.onUpdateSession,
      })
    
  },
    //收到消息，所有推送消息在这里处理
  onMsg: function(msg){
    console.log(msg.content);
    var json = JSON.parse(msg.content);
    this.initEntrustData(that.data.entrustUser.pushLogId, that.data.userId);
    if(json.msg == 'refresh'){
      
    }
  },
  onConnect: function () {
    let _this = this;
    console.log('连接成功');
  },
  onDisconnect: function (error) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log('丢失连接');
    console.log(error);
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          break;
        default:
          break;
      }
    }
  },
  onError: function (error) {
    console.log(error);
  },
  onCustomSysMsg: function (msg) {
    var json = JSON.parse(msg.content);
    this.initEntrustData(this.data.pushLogId, app.globalData.userId);
    if (json.msg == 'refresh') {
    }
  },

  /**
 * 首页
 */
  indexBtnEvent: function () {
    wx.reLaunch({
      url: '/pages/real_index/index'
    })
  },
  onUpdateSession: function (session) {
    var _this = this;
    console.log(session)
    _this.updateSessionsUI(session);
  },
  //刷新界面
  updateSessionsUI: function (session) {
    let _this = this;
    let keyName = 'contract_list';
    let id = session.id;
    //当前聊天人的最后一条会话
    console.log(session);
    if (session.lastMsg.from.indexOf('uu_') != -1 || session.to != _this.data.entrustUser.brokerArchiveId) {
      return
    }

    var sendTime = session.updateTime;
    var unreadNum = session.unread;
    if (session.lastMsg.type == 'text') {
      var msg = session.lastMsg.text;
    } else if (session.lastMsg.type == 'image') {
      var msg = '发来一张图片';
    } else if (session.lastMsg.type == 'custom') {
      var msg = '发来一个位置';
    } else if (session.lastMsg.type == 'audio') {
      var msg = '发来一段语音';
    } else {
      var msg = '发来一段自定义信息';
    }

    var currentId = session.lastMsg.to.indexOf('uu_') != -1 ? session.lastMsg.from : session.lastMsg.to
    var unreadMsg = common.removeUnreadNum(session, currentId);
    var item = {
      id: currentId,
      photo: '',
      name: session.lastMsg.fromNick,
      msg: msg,
      time: common.formatTimeNew(session.lastMsg.time),
      sendtime: common.formatTimeNew(session.lastMsg.time),
      unread: 0
    }
    var unreadNums = common.getUnreadNum(unreadMsg, item.id);
    item.unread = unreadNums;
    app.globalData.recentChatList.unshift(item);
    _this.setData({
      lastMsg: msg,
      lastMsgTime: common.formatTime(sendTime, 'h:m'),
      brokerUnreadNum: unreadNum
    })
    _im.updateSessionsUI(session);
  },
  getChatHistory: function () {
    var _this = this;
    //查看缓存中是否有该经纪人发来的未读消息
    var unreadMsg = wx.getStorageSync('unreadMsg');
    let unreadLen = unreadMsg.length;
    let unreadNum = 0;
    //遍历消息，查看是否有该经纪人的未读消息
    if (unreadLen > 0) {
      for (var a in unreadMsg) {
        if (unreadMsg[a].id == 'p2p-' + _this.data.entrustUser.brokerArchiveId) {
          unreadNum = unreadMsg[a].unread
        }
      }
    }
    //im初始化成功，拉取聊天历史
    wx.request({
      url: app.buildRequestUrl('chatHistory'),
      // url: 'http://ygyuuweb.hftsoft.com/Mini/im/history',
      data: {
        from: 'uu_' + app.globalData.userId,
        to: _this.data.entrustUser.brokerArchiveId,
        limit: 100,
        reverse: 2,
        isDealMsg: 1
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.length > 0) {
          var msgList = res.data;
          var lastMsgMark = 0;
          var lastMsg = '';
          var todayStartTime = new Date(new Date().setHours(0, 0, 0, 0));//今天凌晨开始时间戳
          for (var i = 0; i < msgList.length; i++) {
            if (lastMsgMark == 0 && msgList[i].from == _this.data.entrustUser.brokerArchiveId) {
              var sendTime = msgList[i].sendtime;//消息更新时间戳
              if (sendTime >= todayStartTime) {
                sendTime = common.formatTime(sendTime, 'h:m');
              } else if (sendTime < todayStartTime && sendTime >= (todayStartTime - 86400000)) {
                sendTime = '昨天';
              } else if (sendTime < (todayStartTime - 86400000) && sendTime >= (todayStartTime - 86400000 * 2)) {
                sendTime = '前天';
              } else if (sendTime < (todayStartTime - 86400000 * 2) && sendTime >= (todayStartTime - 86400000 * 30)) {
                var n = Math.ceil((todayStartTime - sendTime) / 86400000);
                sendTime = n + '天前'
              } else {
                var n = Math.floor((todayStartTime - sendTime) / 86400000 / 30);
                sendTime = n + '个月前'
              }

              switch (msgList[i].type) {
                case 0:
                  lastMsg = msgList[i].body.msg
                  break;
                case 1:
                  lastMsg = '发来一张图片'
                  break;
                case 2:
                  lastMsg = '发来一段语音'
                  break;
                case 3:
                  lastMsg = '发来一段视频'
                  break;
                case 4:
                  lastMsg = '发来一个地理位置'
                  break;
                default:
                  lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧'
                  sendTime=''
              }
              lastMsgMark = 1;
              _this.setData({
                lastMsg: lastMsg,
                lastMsgTime: sendTime,
                brokerUnreadNum: unreadNum
              });
            } else if (lastMsgMark == 0) {
              lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧'
              var sendTime = (new Date()).valueOf();
              sendTime = common.formatTime(sendTime, 'h:m');
              _this.setData({
                lastMsg: lastMsg,
                lastMsgTime: '',
                brokerUnreadNum: unreadNum
              });
            } else {
              break
            }
          }
        } else {
          lastMsg = '暂无聊天消息，赶紧发起聊天，让经纪人更了解你的需求吧'
          var sendTime = (new Date()).valueOf();
          sendTime = common.formatTime(sendTime, 'h:m');
          _this.setData({
            lastMsg: lastMsg,
            lastMsgTime: '',
            brokerUnreadNum: unreadNum
          });
        }
      }
    })
  },
  //跳转经纪人个人微店页面
  goToPerStore: function (e) {
    var url = "/pages/personalStore/personalStore?scene=" + this.data.entrustUser.brokerArchiveId
    wx.navigateTo({
      url: url
    })
  }
})
