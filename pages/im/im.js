var app = getApp();
var api = require('../../utils/common.js');

let imSdk = require('../../utils/NIM_Web_NIM_v5.0.0.js');
let common = require('../../utils/common.js');
let _im = require('../../utils/_im.js');
import { Tools } from '../../utils/tools';
const tool = new Tools();
import drawQrcode from '../../utils/weapp.qrcode.esm.js';

let nim = '';
let res = wx.getSystemInfo();
if ((!wx.canIUse("getRecorderManager")) || (!wx.canIUse("createInnerAudioContext"))) {
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，请升级到最新微信版本获得更佳体验。'
  })
}
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const options = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3'
}
Page({
  data: {
    newmapShow:false,
    imgSrc: "http://cdn.haofang.net/static/uuminiapp/loadDownImg/im.png",
    imgWidth: '350rpx',
    imgHeight: '300rpx',
    titleTxtLoad: "找房从此 远离骚扰",
    nextTxtLoad: '下载 优优好房APP，免电话注册找经纪人',
    callIconShow:true,
    inputValue: '',
    focusFlag: '',
    disabledFlag: true,
    chatLists: [],
    nim: {},
    inputFocus: false,
    userInfo: [],
    appKey: app.globalData.appKey,
    account: '618239',
    to: '',
    imService: app.globalData.imService,
    toUserInfo: [],
    caseId: 7384988,
    caseType: 1,
    cityId: 1,
    resource:1,
    downAppBoxShow: false,
    houseInfo: [],
    houseFlag: false,
    recommendFlag: false,
    recommendListFlag: false,
    _IM_log_id: '',
    poster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '',
    author: '',
    loop: false,
    currentId: 10000,
    toView: 'first',
    scrollTop: 100,
    windowH: 0,
    keyboardWindowH: 0,
    keyboardHeight: 0,
    paddingTop: 20,
    sessions: {},
    contact: [],
    recommendHouse: [],
    lastRecommendHouse: '',
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话,
    textOrVoice: 'text',//切换显示文本和语音
    textOrHi: 'text',   //切换显示常用语和文本
    hiBoxHide: true,   //常用语盒子隐藏
    voiceBoxHide:true,//录音弹框隐藏
    hiBoxList: [
      '这套房子的情况能给我详细介绍一下吗？',
      '什么时候可以看房呢？',
      '这套房子价格怎样？是必须全款吗？',
      '可以按揭吗？商贷/公积金贷都可以吗？',
      '有装修比较新的房子吗？',
      '这房子房东还有抵押吗？',
      '你们公司收佣是多少呢？',
      '你好，我想要这个区套三双卫的精装房，能帮我推荐几套合适的房子吗？',
      '我想看看附近的学区房，麻烦给我推荐一下，谢谢！',
      '你好，我想咨询几个买房问题',
      '你们会帮忙办理过户等后续手续吗？',
      '小区环境怎么样？还有周边的交通和配套如何？',
      '有啥优惠政策没？',
    ],    //常用语 数组
    isCustomerService:false,  //是否是客服
    emojiArr: [],
    cursor: '',
    photoBoxHide: true,  //发送图片盒子隐藏
    emojiList: {},    //渲染emoji标签数据
    emojiBoxHide: true,   //标签盒子隐藏
    emojiText: [],
    toUserId: '',
    toastMask: false,
    scrollTopHeight: 0,
    isAddBlacklist: false,  //是否屏蔽该用户消息
    addBlacklistToastShow: false,  //加入黑名单toast提示框
    addBlacklistToastShowText: '屏蔽成功，对方无法主动联系您！',  //加入黑名单toast提示框文字
    isFirst:false,//是否第一层级的页面
    recentChatList: app.globalData.recentChatList,
    //专属客服快捷回复数组
    aoetextList:[
    ],
    //优惠券id
    couponId: 0,
    //分享人id
    shareArchiveId: 0,
    //现不显示优惠券
    couponFlag:false,
    //显示优惠券红包
    couponRedBag:false,
    //填的手机号
    couponMobile:'',
    //优惠券状态
    couponStatus:0,
    //优惠券信息
    couponInfo:{},
    //委托推荐房源
    entrustHouseList:[],
    //是否正在发送图片
    sendFileStatus:0,
    seeEvaluateBox: false,             //带看评价弹框
    seeStarVal: 0,                 //带看评价点击服务态度五角星的值
    levStarVal: 0,                 //带看评价点击专业水平五角星的值
    //带看评价原因
    seeReasonArr: {
      1: ["讲解很不清晰", "专业知识不强", "与推荐房源不符", "服务态度不好"],
      2: ["讲解一般", "专业度不高", "与推荐房源不符", "服务态度一般"],
      3: ["讲解有待提升", "专业度有待提升", "与推荐房源不符", "服务态度一般"],
    },
    isLike: 1,//带看评价要提交的数据
    realHouse: 1,//带看评价要提交的数据
    evaContent: '',//带看评价手动填写内容
    recomInfoId: '',//当前操作的房源推荐房源ID
    pushLogId:'',//当前操作的委托ID
    //带看评价假房源原因
    serverFakeReasonArr: {
      1: ["房源不存在", "房源已出租", "图片不真实", "价格不真实"],
    },
    checkedEvaReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    },
    showCompleteEvaDialog: false,//服务评价弹框
    //选中服务评价原因
    checkedCompleteReasonArr: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    }, 
    //服务评价原因
    serverReasonArr: {
      1: ["讲解很不清晰", "专业知识不强", "反馈不及时", "服务态度不好"],
      2: ["讲解一般", "专业度不高", "反馈一般", "服务态度一般"],
      3: ["讲解有待提升", "专业度有待提升", "反馈一般", "服务态度一般"],
    },
    realPayMoney4C: '',//成交后显示的实际支付金额
    completeEvaContent: '',//成交评价手动填写内容
    serverStarVal: 5,                 //成交评价点击五角星的值
  },
  onLoad: function (options) {
    console.log(options)
    let _this = this;

    app.checkLogin();
    //获取参数
    //优惠券活动进来的参数
    _this.initCouponParams(options);
    let defaultFrom = 'uu_' + app.globalData.userId;
    //  var defaultFrom = 'uu_504067';
    let from = options.from ? options.from : defaultFrom;
    //  let to = options.to ? options.to : '136151';
    var to = options.to ? options.to : app.globalData.imService;
    let caseId = options.caseId ? options.caseId : 0;
    let caseType = options.caseType ? options.caseType : 1;
    let resource = options.reSource ? options.reSource : (options.resource ? options.resource : 1);
    let funCityId = options.cityId;
    var cityId = wx.getStorageSync('cityId');
    //咨询客服，如果是直接进入im页面添加显示返回首页按钮
   _this._isChatToService(to);
    //emoji表情初始化
    _this.initEmoji();
    //获取当前城市
    _this.setData({
      account: from,
      toUserId: to,
      caseId: caseId,
      caseType: caseType,
      resource: resource,
      cityId: funCityId?funCityId:cityId
    })

    _this.queryImEntrustHouseList();
    //获取手机高度
    _this._initsCreenHight();
    //实例化用户和房源数据
    _this._loadImUserInfo();
    //是否是在拉黑列表
    _this._isInBloackList();
    //初始化录音事件
    _this._initAudio();
    //获取当前快捷回复数组
    _this._initAoetextList(to)
  },
  onHide(){
    if(nim && !this.data.sendFileStatus){
      nim.disconnect({"code":302});
    }
  },
  onUnload(){
    if (nim && !this.data.sendFileStatus) {
      nim.disconnect({ "code": 302 });
    }
  },
  /**
   * 验证是否为emoji表情
   */
  isEmoji(item) {
    var emojiArr = this.data.emojiText;
    for (var val of emojiArr) {
      if (item === val) {
        return true;
      };
    };
    return false
  },
  initIm() {
    let _this = this;
    //实例化im
    nim = imSdk.getInstance({
      debug: false,
      db:true,
      onsessions: _this.onSessions,
      onupdatesession: _this.onUpdateSession,
      onroamingmsgs: _this.onRoamingMsgs,
      onofflinemsgs: _this.onOfflineMsgs,
      appKey: _this.data.appKey,
      account: _this.data.account,
      token: _this.data.userInfo.token,
      onconnect: _this.onConnect,
      onblacklist: _this.onBlacklist,//
      ondisconnect: _this.onDisconnect,
      onmsg: _this.onMsg,
      onerror: _this.onError,
      // 同步完成
      onsyncdone: _this.onSyncDone,
      onSysMsgUnread: _this.onSysMsgUnread,
      syncSessionUnread:true
    })
    nim.resetSessionUnread('p2p-' + _this.data.toUserId);
    _this.getChatHistory();
  },
  /**未读系统消息**/
  onSysMsgUnread:function(res){
    console.log(res);
  },
  /*收到黑名单列表*/
  onBlacklist: function (blacklist) {
    let _this = this;
    var toUserId = _this.data.toUserId;
    console.log('收到黑名单', blacklist);
    //判断当前聊天用户是否是在黑名单中,
    blacklist.forEach(function (item) {
      if (item.account == toUserId) {
        _this.setData({ isAddBlacklist: true });
        console.log('当前聊天对象已被加入黑名单');
      }
    });
  },

  onConnect: function () {
    let _this = this;
    console.log('连接成功');
  },
  getChatHistory: function () {
    let _this = this;
    //im初始化成功，拉取聊天历史
    wx.request({
      url: app.buildRequestUrl('chatHistory'),
      // url:'http://lbuuweb.hftsoft.com/Mini/im/history',
      data: {
        from: _this.data.account,
        to: _this.data.toUserId
      },
      success: function (res) {
        //整理历史消息
        if (res.statusCode == 200 && res.data.length > 0) {
          var msgs = res.data;
          for (var k = 0, length = msgs.length; k < length; k++) {
            if (msgs[k].type == 0) {//文本
              var item = {
                from: msgs[k].from,
                to: msgs[k].from,
                msgType: 'text',
                text: msgs[k].body.msg,
                emoji: common.buildEmoji(msgs[k].body.msg),
                hasEmoji: false
              };
              if (item.emoji[1].length > 0) {
                item.hasEmoji = true
              };
              if (!item.text) {
                continue;
              };
            } else if (msgs[k].type == 1) {//图片
              var item = {
                from: msgs[k].from,
                to: msgs[k].from,
                msgType: 'image',
                url: msgs[k].body.url,
              };
            } else if (msgs[k].type == 100) {//富文本
              //扩展字段
              let ext = JSON.parse(msgs[k].ext);
              var reSource = typeof (ext.reSource) != undefined ? ext.reSource : ext.RE_RESOURCE;
              let houseInfo = {
                houseSubject: msgs[k].body.data.TITLE,
                thumbUrl: msgs[k].body.data.PHOTO,
                houseArea: msgs[k].body.data.HOUSEAREA,
                buildAddr: '',
                houseTotalPrice: msgs[k].body.data.HOUSEPRICE,
                priceUnitCn: msgs[k].body.data.HOUSEPRICEUNIT,
                caseId:ext.CASE_ID,
                caseType:ext.CASE_TYPE,
                cityId:ext.cityId ? ext.cityId : app.globalData.cityId,
                reSource: ext.reSource ? ext.reSource : ext.RE_SOURCE,
                buildName: msgs[k].body.data.BUILDNAME
              }
              let roomInfo = '';
              roomInfo += msgs[k].body.data.HOUSEROOM + '室';
              roomInfo += msgs[k].body.data.HOUSETING + '厅';
              var item = {
                from: msgs[k].from,
                to: msgs[k].from,
                msgType: "richmessage",
                text: '',
                houseInfo: houseInfo,
                roomInfo: roomInfo
              };
            } else if (msgs[k].type == 2) {//语音
              if (msgs[k].body.dur == 0) {
                continue;
              }
              var item = {
                from: msgs[k].from,
                to: msgs[k].from,
                msgType: "audio",
                text: '',
                url: msgs[k].from == _this.data.toUserId ? msgs[k].body.url + '?audioTrans&type=mp3' : msgs[k].body.url,
                dur: Math.round(msgs[k].body.dur / 1000) + '″'
              };
            }else if(msgs[k].type == 8){
              continue;
            }else{

            }

            if (k % 10 == 0) {
              item.time = common.formatTimeNew(msgs[k].sendtime);
              item.hasTime = true;
            }

            //所有值都把发送时间加上
            item.sendtime = msgs[k].sendtime;

            _this.data.chatLists.push(item);

            _this.setData({
              chatLists: _this.data.chatLists
            })
           
          }
          //客服推荐委托;
          if (_this.data.imService == _this.data.toUserId) {
            var item = {
              from: _this.data.toUserId,
              to: _this.data.toUserId,
              msgType: 'text',
              text: '欢迎您使用优优好房。推荐您使用特权找好房，快速、准确、帮您找到理想的家。赢4999元大礼包！',
              emoji: '',
              hasEmoji: false,
              qunfa: true,
              hasTime: true,
              time: common.formatTimeNew(new Date())
            };
            _this.data.chatLists.push(item);
            
            _this.setData({
              chatLists: _this.data.chatLists
            });
          };
          _this.scrollToBottom();
        } else {
          //客服推荐委托
          if (_this.data.imService == _this.data.toUserId) {
            var _now = new Date().toLocaleTimeString().slice(0, -3);
            var item = {
              from: _this.data.toUserId,
              to: _this.data.toUserId,
              msgType: 'text',
              text: '欢迎您使用优优好房。推荐您使用特权找好房，快速、准确、帮您找到理想的家。赢4999元大礼包！',
              emoji: '',
              hasEmoji: false,
              qunfa: true
            };
            _this.data.chatLists.push(item);

            _this.setData({
              chatLists: _this.data.chatLists
            });
          };
          _this.scrollToBottom();
        }

        /**
         * 优惠券的提示消息
         * @param  {[type]} _this.data.couponFlag [description]
         * @return {[type]}                       [description]
         */
        //委托推荐房源
        _this.dealEntrustHouse(_this.data.chatLists);
      }
    })
  },
  onRoamingMsgs: function (obj) {
    console.log('收到漫游消息', obj);
  },
  onOfflineMsgs: function (obj) {
    console.log('收到离线消息', obj);
  },
  onError: function (error) {
    console.log(error);
  },
  onSyncDone: function () {
    console.log('onSyncDone');
  },
  onDisconnect: function (error) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log('丢失连接');
    return false;
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
  /**
   * 
   * @param  {[type]} msg [description]
   * @return {[type]}     [description]
   */
  onMsg: function (msg) {
    var _this = this;
    console.log('收到消息', msg.scene, msg.type, msg);
     var item = {
        id:msg.from,
        from: msg.from,
        to: msg.to,
        msg: api.formateMsg(msg.text),
        msgType: msg.type,
        text: api.formateMsg(msg.text),
        emoji: common.buildEmoji(msg.text),
        hasEmoji: false,
        sendtime:common.formatTimeNew(msg.time),
        time:common.formatTimeNew(msg.time)
      };
      if (item.emoji.length > 0) {
        item.hasEmoji = true
      }
      if (msg.type == 'image') {
        item.url = msg.file.url;
      } else if (msg.type == 'audio') {
        item.url = msg.file.mp3Url;
        item.dur = Math.round(msg.file.dur / 1000) + '″';
      } else if (msg.type == 'custom') {
        let msgData = (JSON.parse(msg.content)).data;
        let costomData = JSON.parse(msg.custom);

        let houseInfo = {
          houseSubject: msgData.CONTENT,
          thumbUrl: msgData.PHOTO,
          houseArea: msgData.HOUSEAREA,
          buildAddr: '',
          houseTotalPrice: msgData.HOUSEPRICE,
          priceUnitCn: msgData.HOUSEPRICEUNIT
        }
        let roomInfo = '';
        roomInfo += msgData.HOUSEROOM + '室';
        roomInfo += msgData.HOUSETING + '厅';

        var item = {
          id:msg.from.indexOf('uu_') != -1 ? msg.to : msg.from,
          from: msg.from,
          to: msg.to,
          msgType: "richmessage",
          text: '',
          houseInfo: houseInfo,
          roomInfo: roomInfo,
          costomData: costomData
        };

        this.data.recommendHouse.push(item);
        if (this.data.recommendHouse.length > 0) {
          this.setData({
            recommendFlag: true,
            houseFlag: false,
            recommendHouse: this.data.recommendHouse,
            lastRecommendHouse: item
          })
        }
      }
      if (this.data.toUserId != msg.from) {
        //获取页面栈
        console.log('收到' + msg.fromNick + '的新消息');
      } else {
        //更新当前页聊天界面
        this.data.chatLists.push(item);

        this.setData({
          chatLists: this.data.chatLists
        })
        //跳转到底部
        this.scrollToBottom();
      }

    nim.resetSessionUnread('p2p-' + _this.data.toUserId);
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.compInfo.FCompName,
      path: app.globalData.sharePublicUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  smartMsg:function(e){
	  let _this = this;
    var id = e.currentTarget.dataset.id;
    var msg = _this.data.aoetextList[id - 1].nlgSubject;
	  nim.sendText({
	      scene: 'p2p',
	      to: _this.data.toUserId,
	      text: msg,
	      done: this.sendMsgDone
	    });
	    var item = {
	      from: _this.data.account,
	      to: _this.data.toUserId,
	      msgType: "text",
	      text: msg,
	      hasEmoji: false,
	      emoji: common.buildEmoji(this.data.inputValue),
	      sendtime: (new Date()).getTime()
	    };

	    if (item.emoji[1].length > 0) {
	      item.hasEmoji = true
	    }

	    let hasTime = _this.getLastTime();
	    if (hasTime == true) {
	      item.time = common.formatTime(item.sendtime, 'h:m');
	      item.hasTime = true;
	    }

	    this.data.chatLists.push(item);
	    this.setData({
	      chatLists: this.data.chatLists,
	      inputValue: ''
	    })
	    wx.request({
	        url: app.buildRequestUrl('smartService'),
          // url:'http://ygyuuweb.hftsoft.com/Mini/Im/smartServiceNew',
	        data: {
	        	userId:_this.data.account,
            msg: _this.data.aoetextList[id - 1].nlgContent,
	        	kwd:null//预留字段
	        },
	        success: function (res) {
	        	
	        }
       });
  },
  /**
   * 发送消息
   */
  imSubmit: function (e) {
    let _this = this;
    let msg = this.data.inputValue.trim();
    //发送文本消息
    _this.sendImMsg(msg);
    
  },
  /*
  * 给对方发送 im消息
  * @param msg 发送的文本消息内容
  */
  sendImMsg:function(msg){
    let _this = this;
    if(_this.data.isAddBlacklist){
    	wx.showToast({title: '您已把对方屏蔽，解除屏蔽后才能进行联系',icon: 'none',duration: 2000})
    	return;
    }
    nim.sendText({
      scene: 'p2p',
      to: _this.data.toUserId,
      text: msg,
      done: this.sendMsgDone
    });
    var item = {
      from: _this.data.account,
      to: _this.data.toUserId,
      msgType: "text",
      text: msg,
      hasEmoji: false,
      emoji: common.buildEmoji(msg),
      sendtime: (new Date()).getTime()
    };

    if (item.emoji[1].length > 0) {
      item.hasEmoji = true
    }

    let hasTime = _this.getLastTime();
    if (hasTime == true) {
      item.time = common.formatTime(item.sendtime, 'h:m');
      item.hasTime = true;
    }

    this.data.chatLists.push(item);
    this.setData({
      chatLists: this.data.chatLists,
      inputValue: ''
    })
  },

  sendMsgDone: function (res) {
    //跳转到底部
    this.scrollToBottom();
  },
  inputContent: function (e) {
    var that = this;
    var old = this.data.inputValue;
    var inputValue = e.detail.value;
    var oldLength = old.length;
    var nowLength = inputValue.length;
    if (oldLength - nowLength === 1 && old[oldLength - 1] == ']' && old.indexOf('[') > -1) {
      var i = old.lastIndexOf('[');
      var emojiText = old.substring(i + 1, oldLength - 1);
      var textArr = that.data.emojiText;
      for (var textVal of textArr) {
        if (textVal === emojiText) {
          old = old.substring(0, i);
          this.setData({
            inputValue: old,
            disabledFlag: old.length ? false : true
          });
          return;
        };
      };
      this.setData({
        disabledFlag: old.length ? false : true
      });
    } else {
      this.setData({
        inputValue: inputValue,
        disabledFlag: inputValue.length ? false : true
      });
    };
  },
  inputFocus: function (e) {
    var _this = this;
    var keyboardH = this.data.windowH;
    this.setData({
      paddingTop: keyboardH / 2 - 20,
      inputFocus: true,
      recommendListFlag: false,
      recommendFlag: this.data.lastRecommendHouse.length > 0 ? true : false
    });
    this.sendMsgDone();
  },
  inputblur() {
    this.setData({
      inputFocus: false,
      paddingTop: 20
    });
  },
  clickImage: function (e) {
    var url = e.target.dataset.url;
    //预览图片
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },
  //发送链接
  sendHouse: function (e) {
    let _this = this;
    //发送富文本
    let roomInfo = '';
    let houseInfo = _this.data.houseInfo;
    houseInfo.caseId = _this.data.caseId;
    houseInfo.reSource = _this.data.resource;
    roomInfo += houseInfo.houseRoom ? houseInfo.houseRoom + '室' : "";
    roomInfo += houseInfo.houseHall ? houseInfo.houseHall + '厅' : "";
    roomInfo += houseInfo.houseWei ? houseInfo.houseWei + '卫' : "";

    if(houseInfo.caseType == 6){
      var sub_content = houseInfo.shareTitle;
    }else{
      var sub_content = houseInfo.houseSubject + houseInfo.houseArea + "㎡" + houseInfo.houseTotalPrice + ' ' + roomInfo;
    }
    var content = { title: houseInfo.shareTitle, content: sub_content, log_id: _this.data._IM_log_id, case_id: _this.data.caseId, type: _this.data.caseType, city_id: _this.data.cityId, photo: houseInfo.thumbUrl, detail: houseInfo.DETAIL_URL, from: 'detail' };
    //封装要发送的数据
    var content = {
      type: 14,
      data: {
        TITLE: sub_content,
        CONTENT: sub_content,
        PHOTO: houseInfo.thumbUrl,
        HOUSEROOM: houseInfo.houseRoom,
        HOUSETING: houseInfo.houseHall,
        HOUSEAREA: houseInfo.houseArea,
        HOUSEREG: houseInfo.regionName,
        HOUSEPRICE: houseInfo.houseTotalPrice,
        HOUSEPRICEUNIT: houseInfo.priceUnitCn,
        BUILDNAME: houseInfo.buildName
      }
    };
    var ext = {
      CASE_ID: _this.data.caseId,
      CASE_TYPE: _this.data.caseType,
      cityId: _this.data.cityId,
      reSource: houseInfo.resource,
      RE_SOURCE: houseInfo.resource,
      FROM_EXPERT:0
    };
    var resData = null;
    var customMsg = nim.sendCustomMsg({
      scene: 'p2p',
      to: _this.data.toUserId,
      content: JSON.stringify(content),
      custom: JSON.stringify(ext),
      done: _this.sendMsgDone
    });

    //消息存入消息列表
    var item = {
      from: _this.data.account,
      to: _this.data.toUserId,
      msgType: "richmessage",
      text: '',
      houseInfo: houseInfo,
      roomInfo: roomInfo
    };
    this.data.chatLists.push(item);
    this.setData({
      chatLists: this.data.chatLists,
      houseFlag: false
    })
  },
  cancel: function () {
    this.setData({
      houseFlag: false
    })
  },
  /**
   * 播放语音
   */
  audioPlay: function (e) {
    let _this = this;
    let dur = e.target.dataset.dur;
    let src = e.target.dataset.src;
    let idx = e.target.id;

    this.setData({
      currentId: idx
    })
    // innerAudioContext.autoplay = true;
    if (src.indexOf('mp3') == -1){
      src = src + '?audioTrans&type=mp3';
    }
    console.log(src);
    
    innerAudioContext.src = src;
    innerAudioContext.play();

  },
  lower: function (e) {
    //console.log(e)
  },
  scroll: function (e) {
    this.setData({
      scrollTopHeight: e.detail.scrollTop
    });
  },
  scrollToBottom: function () {
    this.setData({
      toView: 'red'
    })
  },
  onSessions: function (sessions) {
    console.log('收到会话列表', sessions);
  },
  onUpdateSession: function (session) {
    console.log('会话更新了', session);
 
    // this.updateSession(session);
    _im.updateSessionsUI(session);
  },
  /**
   * 更新当前用户的聊天历史
   * 
   */
  updateSession: function (session) {
    let _this = this;
    let keyName = 'contract_list';
    let id = session.id;
    //当前聊天人的最后一条会话
    // wx.setStorageSync(id, session.lastMsg);

    if (session.lastMsg.type == 'text') {
      var msg = session.lastMsg.text;
    } else if (session.lastMsg.type == 'image') {
      var msg = '收到一张图片';
    } else if (session.lastMsg.type == 'custom') {
      var msg = '推荐房源';
    } else {
      var msg = '你有新消息啦';
    }
    var item = {
      id: _this.data.toUserId,
      photo: _this.data.toUserInfo.icon,
      name: _this.data.toUserInfo.name,
      msg: msg,
      time: common.formatTimeNew(session.lastMsg.time),
      sendtime: common.formatTimeNew(session.lastMsg.time),
      unread:0
    }
    app.globalData.recentChatList.push(item);
  },
  takePhone: function (e) {
    let mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  /**
   * 推荐房源下拉
   */
  pullDown: function (e) {
    this.setData({
      recommendListFlag: true,
      recommendFlag: false
    })
  },
  pullUp: function (e) {
    this.setData({
      recommendListFlag: false,
      recommendFlag: true
    })
  },
  /**
   * 跳转详情
   */
  goDetail: function (e) {
    var that = this;
    let houseinfo = e.currentTarget.dataset.houseinfo;
    let caseId = houseinfo.caseId;//此处表示房源ID
    let caseType = houseinfo.caseType;
    let cityId = houseinfo.cityId;
    let reSource = houseinfo.reSource;
    let isShield = this.data.isAddBlacklist?1:0;
    if (getCurrentPages().length < 5) {
      if(caseType == 6){
        wx.redirectTo({
          url: '/pages/newHouseDetail/newHouseDetail?buildid=' + houseinfo.buildId,
        })
      }else{
        wx.navigateTo({
          url: '/pages/houseDetail/houseDetail?caseid=' + caseId + '&caseType=' + caseType + '&cityId=' + cityId + '&reSource=' + reSource + '&seeStatus=' + houseinfo.seeStatus + '&recomInfoId=' + houseinfo.recomInfoId + '&pushLogId=' + houseinfo.pushLogId + '&delStatus=' + houseinfo.delStatus + '&brokerMoney=' + houseinfo.brokerMoney + '&recomhousestatus=' + houseinfo.recomHouseStatus + '&isEvaluate=' + houseinfo.isEvaluate + '&isShield=' + isShield + '&brokerarchiveId=' + that.data.toUserId
        })
      }
    } else {
      if (caseType == 6) {
        wx.redirectTo({
          url: '/pages/newHouseDetail/newHouseDetail?buildid=' + houseinfo.buildId,
        })
      }else{
        wx.redirectTo({
          url: '/pages/houseDetail/houseDetail?caseid=' + caseId + '&caseType=' + caseType + '&cityId=' + cityId + '&reSource=' + reSource + '&seeStatus=' + houseinfo.seeStatus + '&recomInfoId=' + houseinfo.recomInfoId + '&pushLogId=' + houseinfo.pushLogId + '&delStatus=' + houseinfo.delStatus + '&brokerMoney=' + houseinfo.brokerMoney + '&recomhousestatus=' + houseinfo.recomHouseStatus + '&isEvaluate=' + houseinfo.isEvaluate + '&isShield=' + isShield + '&brokerarchiveId=' + that.data.toUserId
        })
      }
    }

  },
  defaultImg: function (ev) {
    console.log(ev);
    //需要访问当前页面的数据对象传递到其它页面上
    var _that = this;
    common.errImgFun(ev, _that, 'avatar');
  },
  /**
   * saveShield
   * 屏蔽对方信息
   */
  saveShield: function (e) {
    var _this = this;
    var isAddBlacklist = _this.data.isAddBlacklist;
    var isAdd = !isAddBlacklist;

    nim.markInBlacklist({
      account: _this.data.toUserId,//被屏蔽人用户id
      isAdd: isAdd, // `true`表示加入黑名单, `false`表示从黑名单移除
      done: _this.markInBlacklistDone
    });

  },
  /** 加入黑名单后提示框*/
  addBlacklistToast: function (text) {
    var _this = this;
    _this.setData({
      addBlacklistToastShow: true,
      addBlacklistToastShowText: text,
    });
    setTimeout(function(){
      _this.setData({
      addBlacklistToastShow: false,
    });
    },2000);
  },
  markInBlacklistDone: function (error, obj) {
    var _this = this;
    var isAddBlacklist = _this.data.isAddBlacklist;
    console.log(error);
    console.log(obj);
    console.log('将' + obj.account + (!isAddBlacklist ? '加入黑名单' : '从黑名单移除') + (!error ? '成功' : '失败'));
    if (!error) {
      //屏蔽成功调用接口同步屏蔽结果
      var toastText = !isAddBlacklist ? '屏蔽成功，对方无法主动联系您！' : '已解除屏蔽，去联系吧~';

      _this.addBlacklistToast(toastText);
      var status = !isAddBlacklist ? 1 : 0;
      var userId = _this.data.account.replace('uu_', '');
      var params = {
        userId: userId,        //屏蔽人用户id
        shieldUserId: _this.data.toUserId, //被屏蔽人用户id
        status: status                     //状态 1屏蔽 0取消屏蔽
      }
       //解除屏蔽成功
        _this.setData({
          isAddBlacklist: !isAddBlacklist,
        });
      var requestUrl = app.buildRequestUrl('saveShield');
      //请求接口进行 屏蔽/解锁屏蔽 B端经纪人信息
      api.getList(requestUrl, params).then(res => {
        if (res.STATUS != 1) {
          wx.showToast({
            title: res.INFO,
            duration: 2000
          });
          return;
        }
       
      });

    }
  },
  /**
   * 关闭
   */
  downCloseEvent: function () {
    this.setData({
      downAppBoxShow: false
    })
  },
  /**
   * 关闭
   */
  downCloseEvents: function () {
    var that = this;
    that.setData({
      downAppBoxShow: false
    })
  },

  fileSend: function (e) {
    var that = this;
    //发送文件不算跳出页面
    that.setData({
      sendFileStatus:1
    })
    if(that.data.isAddBlacklist){
    	wx.showToast({
		  title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
		  icon: 'none',
		  duration: 2000
		})
    	return;
    }
    var type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
      
        nim.sendFile({
          scene: 'p2p',
          to: that.data.toUserId,
          type: 'image',
          wxFilePath: tempFilePaths[0],
          done: function (error, msg) {
            var item = {
              from: that.data.account,
              to: that.data.toUserId,
              msgType: 'image',
              url: tempFilePaths[0],
            };
            let hasTime = that.getLastTime();
            if (hasTime == true) {
              item.time = common.formatTime(item.sendtime, 'h:m');
              item.hasTime = true;
            }
            that.data.chatLists.push(item);
            that.setData({
              chatLists: that.data.chatLists,
              sendFileStatus:0
            })
            that.scrollToBottom();
          }
        });
      }
    })
  },
  touchdown: function (e) {
    var that = this;
    if(that.data.isAddBlacklist){
    	wx.showToast({
		  title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
		  icon: 'none',
		  duration: 2000
		})
    	return;
    }
    console.log('touchdown');
    //如果尚未允许录音,则主动调用授权,防止小程序自己调用,无回调函数进行进一步操作
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              app.globalData.authorityToRecord = true;
              that.setData({ isSpeaking: false });
            },
            fail() {
              that.setData({ isSpeaking: false });
            }
          });
        } else {
          that.record();
        };
      }
    });
  },
  //手指抬起
  touchup: function () {
    var that = this;
    setTimeout(function () {
      that.setData({ isSpeaking: false });
      recorderManager.stop();
    }, 300) //延迟时间 
  },
  toogleChat: function () {
    var textOrVoice = this.data.textOrVoice == 'text' ? 'voice' : 'text';
    if (textOrVoice == 'text') {
      this.setData({
        focusFlag: true
      });
    };
    this.setData({
      textOrVoice: textOrVoice,
      textOrHi: 'text',
      photoBoxHide: true,
      hiBoxHide: true,
      emojiBoxHide: true
    });
  },
  record: function () {
    var that = this;
    that.setData({
      isSpeaking: true
    })
    recorderManager.start(options);
  },
  /**
   * 点击加号,显示相册拍摄弹框
   */
  showPhotoBox() {
    var boo = !this.data.photoBoxHide;
    this.setData({
      voiceBoxHide: true,
      hiBoxHide: true,
      textOrHi: 'text',
      emojiBoxHide: true,
      photoBoxHide: boo
    });
    this.scrollToBottom();
  },
  /**
   * 点击笑脸
   */
  showEmojiBox() {
    var boo = !this.data.emojiBoxHide;
    this.setData({
      photoBoxHide: true,
      hiBoxHide: true,
      emojiBoxHide: boo,
      textOrVoice: 'text',
      textOrHi: 'text',
      voiceBoxHide: true
    });
    this.scrollToBottom();
  },
  chooseEmoji: function (e) {
    var name = e.currentTarget.dataset.name;
    var data = this.data.inputValue;
    var text = data + name;
    var num = text.length;
    this.setData({
      inputValue: text,
      // cursor: num,
      // focusFlag: true
    });
  },
  /**
   * 点击消息记录,隐藏表情,照片弹框
   */
  showMessage() {
    this.setData({
      voiceBoxHide: true,
      photoBoxHide: true,
      emojiBoxHide: true,
      hiBoxHide: true,
      textOrHi: 'text',
    });
    this.scrollToBottom();
  },
  /**
   * 表情弹框的删除键功能
   */
  deleteInput() {
    var val = this.data.inputValue;
    var i = val.lastIndexOf('[');
    if (i != -1) {
      val = val.substring(0, i);
      this.setData({
        inputValue: val
      });
    };
  },
  //获取最后一条消息的时间
  getLastTime() {
    let chatLists = this.data.chatLists;
    let len = chatLists.length;
    let lastOne = chatLists[len - 1];
    let sendtime = lastOne.sendTime;
    let offset = new Date().getTime() - sendtime;

    if (offset > 1800) {
      return true;
    } else {
      return false;
    }
  },
  //跳转发布委托
  findFun(){
    wx.navigateTo({
      url: '/packageTool/pages/findHouseByMap/findHouseByMap',
    })
  },
  //联系经纪人
  callBrokerTosat(){

    this.setData({ downAppBoxShow:true});
  },
  //联系经纪人
  maskHideBtn(){
    this.setData({toastMask:false});
  },
  //打电话给经纪人
  callBroker(){
    var that = this;
    if(that.data.isAddBlacklist){
    	wx.showToast({
		  title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
		  icon: 'none',
		  duration: 2000
		})
    	return;
    }
    this.setData({toastMask:false});
    wx.makePhoneCall({
      phoneNumber: that.data.toUserInfo.brokerMobile
    });
  },
  //隐号拨打
  hideCallBroker(){
    var that = this;
    if(that.data.isAddBlacklist){
    	wx.showToast({
		  title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
		  icon: 'none',
		  duration: 2000
		})
    	return;
    }
    that.setData({
      toastMask:false,
      downAppBoxShow: true
    });
  },
  /**
   * 首页
   */
  indexBtnEvent: function () {
    wx.reLaunch({
      url: '/pages/real_index/index'
    })
  },
  /**
   * 收集FormId
   * function collectFormId(formId,formType,userId,openId)
   */
  collectFormId: function (e) {
    //
    console.log(e);
    let formId = e.detail.formId;
    let formType = e.currentTarget.dataset.formtype;
    common.collectFormId(formId,formType,app.globalData.userId,app.globalData.openId);
  },
  /**
   * 得到聊天列表页面
   * 在调用该页面方法，刷新数据
   * @return {[type]} [description]
   */
  getNewsListPage: function (){
      var pages = getCurrentPages();
      if(pages.length > 0){
          for (var i = pages.length - 1; i >= 0; i--) {
            if(typeof(pages[i].changeData) != 'undefined'){
              return pages[i];
            }
          }
        }else{
          return false;
        }
  },
  /**
   * 调起常用弹窗
   */
  toogleHiBox() {
    let _this = this;
    var boo = this.data.hiBoxHide;
    //如果当前是隐藏状态 :
    if(!!boo){
      this.setData({
        voiceBoxHide:true,
        photoBoxHide: true,
        emojiBoxHide: true,
        hiBoxHide: !boo,
        textOrVoice:'text',
        textOrHi: 'hi'
      });
      this.scrollToBottom();
      return;
    }

    //当前是展开状态: 则是键盘 和常用语切换
    var textOrHi = _this.data.textOrHi == 'text' ? 'hi' : 'text';
    if (textOrHi == 'text') { //切换为文本
      this.setData({
        focusFlag: true,
      });
    };
    this.setData({
      textOrHi: textOrHi,
      textOrVoice:'text',
      hiBoxHide: true,
      photoBoxHide: true,
      emojiBoxHide: true,
      voiceBoxHide:true
    });
  },

  /**
   * 发送 常用语
   */
  sendHiMsg:function(e){
    let msg = e.currentTarget.dataset.text;
    //发送文本消息
    this.sendImMsg(msg);
    //文本消息发送之后收起 , 常用语弹窗 关闭
    this.setData({
        voiceBoxHide:true,
        photoBoxHide: true,
        emojiBoxHide: true,
        hiBoxHide: true,
        textOrHi: 'text'
      });
  },
  /**
   * 点击语音按钮弹出录音弹框
   */
  voiceBox:function(e){
    this.setData({
      photoBoxHide: true,
      voiceBoxHide:false,
      emojiBoxHide: true,
      hiBoxHide: true,
      textOrHi: 'text',
    });
  },
  /**
   * 以下方法用于优惠券活动
   * lb 2018年8月30日17:29:14
   */
  initCouponParams:function(options){
    if(!!options.scene){
      var scene = options.scene;
      scene = decodeURIComponent(scene).split("&");
      console.log(scene);
      options.couponId = scene[0];
      options.shareArchiveId = scene[1];
    }else if(options.couponId && options.shareArchiveId){
      options.to = options.shareArchiveId;
    }else{
      console.log('没有优惠券相关参数');
    }

    if (typeof(options.couponId) !== 'undefined' && typeof (options.shareArchiveId) !== 'undefined'){
      this.setData({
        couponId: options.couponId,
        shareArchiveId: options.shareArchiveId
      })
      this.initRequestCoupon(options);
    }
  },
  /**
   * 实例化优惠券的数据
   */
  initRequestCoupon:function(params){
    var _this = this;
    var couponId = params.couponId;
    var shareArchiveId = params.shareArchiveId;

    wx.request({
      url: app.buildRequestUrl('getCouponReceiveInfo'),
      // url:'http://lbuuweb.hftsoft.com/Mini/Active/getCouponReceiveInfo',
      data:{
        couponId: couponId,
        shareArchiveId: shareArchiveId,
        youyouUserId:app.globalData.userId
        // youyouUserId: 16990
      },
      success:function(res){
        if (res.data.STATUS == 1){
          var couponInfo = res.data.DATA;
          // if(couponInfo.couponMoney.length > 3){
          //   couponInfo.couponMoney = tool.toThousands(couponInfo.couponMoney);
          // }
          if(typeof(couponInfo.validTime) !== 'undefined'){
            couponInfo.validTime = couponInfo.validTime.replace(/-/g, '.')
          }
          _this.setData({
            couponStatus: couponInfo.couponStatus,
            couponInfo:couponInfo,
            couponFlag: couponInfo.couponStatus == 2 ? false : true,
            couponRedBag:couponInfo.couponStatus == 2?true:false
          })

          //3秒用户没有任何操作默认跳转到首页
          if(couponInfo.couponStatus == 1){
            setTimeout(function(){
              if(_this.data.couponFlag){
                wx.switchTab({
                  url:'/pages/real_index/index'
                })
              }
            },3000)
          }
        }
      }
    })
  },
  /**
   * 领取优惠券手机号
   */
  couponMobileInput:function(e){
    var _this = this;
    var mobile = e.detail.value;
    
    if(mobile.length == 1 && mobile != 1){
      wx.showToast({
        title: '请先输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      _this.setData({
        couponMobile: ''
      })
      return false;
    }else if (mobile.length == 2 && !(/^1[3|5|6|7|8|9]$/.test(mobile))){
      wx.showToast({
        title: '请先输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      _this.setData({
        couponMobile: ''
      })
      return false;
    }else if (mobile.length == 11 && !(/^1[3|5|6|7|8|9]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '请先输入正确手机号',
        icon: 'none',
        duration: 1000
      })
      _this.setData({
        couponMobile:''
      })
      return false;
    }else{
      _this.setData({
        couponMobile: mobile
      });
    }
  },
  /**
   * 点击领取
   */
  receiveCouponAction:function(e){
    var _this = this;

    if(!tool.checkMobilePhone(_this.data.couponMobile)){
      wx.showToast({
        title:'输入正确手机号',
        icon:'none',
        duration:1500
      })
      return false;
    }
    wx.request({
      url: app.buildRequestUrl('receiveCouponAction'),
      // url:'http://lbuuweb.hftsoft.com/Mini/Active/receiveCouponAction',
      data:{
        couponId:_this.data.couponId,
        shareArchiveId: _this.data.shareArchiveId,
        wxMobile:_this.data.couponMobile,
        youyouUserId:app.globalData.userId
        // youyouUserId: 16990
      },
      success:function(res){
        if (res.data.errCode == 200){
          var params = {
            couponId:_this.data.couponId,
            shareArchiveId: _this.data.shareArchiveId
          };
          _this.initRequestCoupon(params);
        }else{
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 点击关闭按钮
   */
  couponClose:function(e){
    var _this = this;

    _this.setData({
      couponFlag:false,
      couponRedBag: _this.data.couponInfo.couponStatus ==1 ? false : true
    })
    console.log(e);
  },
  /**
   * 点击
   */
  couponRedBagTap:function(e){
    var _this = this;
    
    _this.setData({
      couponFlag:true,
      couponRedBag:false
    })

    _this.data.couponStatus == 2 && _this.drawQrcode(_this.data.couponInfo.voucherUrl);
  },
  /**
   * 生成优惠券兑换二维码
   */
  drawQrcode:function(url, cb){
    if(typeof url != 'undefined'){
      setTimeout(function(){
        drawQrcode({
          width: 80,
          height: 80,
          canvasId: 'myQrcode',
          text: url,
          typeNumber: 4
        })
      },200)
    }
  },
  //初始化表情列表
  initEmoji:function(){
    var _this = this;
    var emojiList = {
      "emoji": {
        "[可爱]": { file: "emoji_01.png" },
        "[色]": { file: "emoji_02.png" },
        "[嘘]": { file: "emoji_03.png" },
        "[亲]": { file: "emoji_04.png" },
        "[呆]": { file: "emoji_05.png" },
        "[呲牙]": { file: "emoji_07.png" },
        "[鬼脸]": { file: "emoji_08.png" },
        "[害羞]": { file: "emoji_09.png" },
        "[偷笑]": { file: "emoji_10.png" },
        "[调皮]": { file: "emoji_11.png" },
        "[可怜]": { file: "emoji_12.png" },
        "[敲]": { file: "emoji_13.png" },
        "[惊讶]": { file: "emoji_14.png" },
        "[流感]": { file: "emoji_15.png" },
        "[委屈]": { file: "emoji_16.png" },
        "[流泪]": { file: "emoji_17.png" },
        "[嚎哭]": { file: "emoji_18.png" },
        "[惊恐]": { file: "emoji_19.png" },
        "[怒]": { file: "emoji_20.png" },
        "[酷]": { file: "emoji_21.png" },
        "[不说]": { file: "emoji_22.png" },
        "[鄙视]": { file: "emoji_23.png" },
        "[阿弥陀佛]": { file: "emoji_24.png" },
        "[奸笑]": { file: "emoji_25.png" },
        "[睡着]": { file: "emoji_26.png" },
        "[口罩]": { file: "emoji_27.png" },
        "[努力]": { file: "emoji_28.png" },
        "[抠鼻孔]": { file: "emoji_29.png" },
        "[疑问]": { file: "emoji_30.png" },
        "[怒骂]": { file: "emoji_31.png" },
        "[晕]": { file: "emoji_32.png" },
        "[呕吐]": { file: "emoji_33.png" },
        "[强]": { file: "emoji_34.png" },
        "[弱]": { file: "emoji_35.png" },
        "[OK]": { file: "emoji_36.png" },
        "[拳头]": { file: "emoji_37.png" },
        "[胜利]": { file: "emoji_38.png" },
        "[鼓掌]": { file: "emoji_39.png" },
        "[发怒]": { file: "emoji_40.png" },
        "[骷髅]": { file: "emoji_41.png" },
        "[便便]": { file: "emoji_42.png" },
        "[火]": { file: "emoji_43.png" },
        "[溜]": { file: "emoji_44.png" },
        "[爱心]": { file: "emoji_45.png" },
        "[心碎]": { file: "emoji_46.png" },
        "[钟情]": { file: "emoji_47.png" },
        "[唇]": { file: "emoji_48.png" },
        "[戒指]": { file: "emoji_49.png" },
        "[钻石]": { file: "emoji_50.png" }
      }
    };
    emojiList["emoji"] = api.emoji;
    var emojiBaseUrl = 'https://uuweb.haofang.net/Public/wxApp/images';
    var emojiItem = emojiList['emoji'];
    var emojiObj = {};
    var emojiNum = 0;
    var emojiPage = 1;
    emojiObj[emojiPage] = {};
    var emojiTextArr = [];
    for (var key in emojiItem) {
      var keytext = key.replace(/\[|\]/g, '');
      emojiTextArr.push(keytext);
      emojiNum++;
      emojiObj[emojiPage][key] = emojiItem[key];
      emojiObj[emojiPage][key]['img'] = emojiBaseUrl + "/emoji/" + emojiItem[key]['file'];
      emojiObj[emojiPage][key]['fileName'] = key;
      if (emojiNum % 27 == 0) {
        emojiPage++;
        emojiObj[emojiPage] = {};
      };
    };

    _this.setData({
      emojiText: emojiTextArr,
      emojiList: emojiObj
    })
  },
  //初始化im用户信息和房源信息
  _loadImUserInfo:function(){
    var _this = this;
    var params = {
      accid: _this.data.account,
      toUserId: _this.data.toUserId,
      caseId: _this.data.caseId,
      caseType: _this.data.caseType,
      cityId: _this.data.cityId,
      reSource:_this.data.resource,
    };

    wx.request({
      url: app.buildRequestUrl('initIm'),
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (typeof (res.data.data.toUserInfo.icon) == 'undefined'){
            res.data.data.toUserInfo.icon = 'http://cdn.haofang.net/static/uuminiapp/im/defaultHead.png?t=20180427';
          }
          _this.setData({
            toUserInfo: res.data.data.toUserInfo,
            userInfo: res.data.data.userInfo,
            houseInfo: res.data.data.houseInfo
          });
          _this.initIm();
          //设置标题
          wx.setNavigationBarTitle({
            title: _this.data.toUserInfo.name
          })
          //如果有房源就显出出来
          if (Object.keys(_this.data.houseInfo).length > 0) {
            _this.setData({
              houseFlag: true
            })
          }
        } else {
          wx.showToast({
            title: '初始化失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    });
  },
  //是否在拉黑名单内
  _isInBloackList:function(){
    var _this = this;
    var t = new Date().getTime();
    wx.request({
      url: app.buildRequestUrl('isInBlackList')+'?accid='+_this.data.account+"&archiveId="+_this.data.toUserId,
      success: function (res) {
        if(res.data.status == 1){
          if(res.data.info.flag == 1){
            _this.setData({isAddBlacklist:true});
          }
        }
      }
    });
  },
  //初始化录音事件
  _initAudio:function(){
    var _this = this;
    recorderManager.onStart(() => {
    })
    recorderManager.onStop((res) => {//停止后直接
      _this.setData({
        isSpeaking: false
      });
      if (res.duration < 800) {
        wx.showToast({
          title: '录音时间太短',
          image: '../../images/warning.png',
          duration: 600
        });
        return;
      }
      nim.sendFile({
        scene: 'p2p',
        to: _this.data.toUserId,
        type: 'audio',
        wxFilePath: res.tempFilePath,
        done(error, msg) {
          console.log("msg");
          console.log(msg);
          console.log("error");
          // 获取文件路径
          var path = msg.file.url;//云信返回的连接不用加后缀加了会解析不成功
          //                  var path = msg.file.url;//云信返回的连接不用加后缀加了会解析不成功
          var item = {
            from: _this.data.account,
            to: _this.data.toUserId,
            dur: Math.round(res.duration / 1000) + '″',
            msgType: 'audio',
            url: path,
          };
          _this.data.chatLists.push(item);

          _this.setData({
            chatLists: _this.data.chatLists
          });

          _this.scrollToBottom();
        }
      })
    })
    //播放音频的事件
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onEnded(() => {
      _this.setData({
        currentId: 10000
      })
    })
    innerAudioContext.onError((res) => {
      _this.setData({
        currentId: 10000
      })
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    innerAudioContext.onStop((res) => {
      _this.setData({
        currentId: 10000
      })
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  //初始化屏幕高度
  _initsCreenHight:function(){
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowH: res.windowHeight
        });
      }
    })
  },
  //当前联系人是客服特殊处理,是否是直接跳入
  _isChatToService:function(to){
     var _this = this;
     if (to == 618239){
      //咨询客服
      _this.setData({
        isCustomerService:true,
        callIconShow:false
      })

      wx.setStorageSync('servicePushMsg' + app.globalData.accid, true);
    }

    app.globalData.chatTo = to;//设置全局当前聊天对象

   var getCurrentPagesLength = getCurrentPages().length;
    if (getCurrentPagesLength == 1) {
      _this.setData({
        isFirst: true
      });
    }
  },
  /**
   * 查询委托
   * @return {[type]} [description]
   */
  queryImEntrustHouseList:function(n){
    var _this = this;
    wx.request({
      url:app.buildRequestUrl('queryImEntrustHouseList'),
      // url:'http://uuweb.hftsoft.com/Mini/Im/queryImEntrustHouseList',
      data:{
        cityId: app.globalData.cityId,
        youyouUserId: app.globalData.userId,
        brokerArchiveId: _this.data.toUserId
      },
      success:function(res){
        if(res.data.STATUS == 1 && typeof(res.data.DATA) !== 'undefined'){
          var brokerInfo = res.data.DATA.brokerInfo;
          var houseList = res.data.DATA.houseList;
          var houseListEnd = [];
          var pushLogId = 0
          if(typeof(houseList) !== 'undefined' && houseList.length > 0){
            //循环遍历抽取已成交的房源重新组合
            for(var i in houseList){
              if(houseList[i].seeStatus == 4){
                houseListEnd.push(houseList[i]);
                pushLogId = houseList[i].pushLogId
              } else if (pushLogId == 0 || pushLogId != houseList[i].pushLogId){
                houseListEnd.push(houseList[i]);
              } 
            }
            _this.setData({
              entrustHouseList:houseListEnd.length==0?houseList:houseListEnd
            })
            console.log(_this.data.entrustHouseList);
            //带参数表示状态更新，需要更新聊天列表绑定的数据
            if(n!=undefined){
              var chatLists = _this.data.chatLists;//消息列表
              var entrustHouseList = _this.data.entrustHouseList;//委托列表

              //替换消息列表中的数据，先循环取回来的委托列表
              for (var a in entrustHouseList){
                  //再循环消息列表进行对比
                for (var b in chatLists){
                  if (chatLists[b].msgType == 'entrust' && chatLists[b].houseInfo.pushLogId == entrustHouseList[a].pushLogId && chatLists[b].houseInfo.caseId == entrustHouseList[a].houseId){
                    //对比通过后进行消息替换
                    var caseTypeCn = entrustHouseList[a].caseType == 1 ? "[出售]" : "[出租]";
                    var title = caseTypeCn + entrustHouseList[i].buildName + ' ' + entrustHouseList[a].houseSubject;
                    let houseInfo = {
                      houseSubject: title,
                      thumbUrl: entrustHouseList[a].thumbUrl,
                      houseArea: entrustHouseList[a].houseArea,
                      buildAddr: '',
                      houseTotalPrice: entrustHouseList[a].houseTotalPrice,
                      priceUnitCn: entrustHouseList[a].priceUnitCn,
                      caseId: entrustHouseList[a].houseId,
                      caseType: entrustHouseList[a].caseType,
                      cityId: entrustHouseList[a].cityId,
                      reSource: entrustHouseList[a].reSource,
                      buildName: entrustHouseList[a].buildName,
                      isVip: entrustHouseList[a].isVip,
                      userId: entrustHouseList[a].userId,
                      recomInfoId: entrustHouseList[a].recomInfoId,
                      seeStatus: entrustHouseList[a].seeStatus,
                      brokerMoney: entrustHouseList[a].brokerMoney,
                      tips: entrustHouseList[a].tips,
                      pushLogId: entrustHouseList[a].pushLogId,
                      isEvaluate: entrustHouseList[a].isEvaluate,
                      delStatus: entrustHouseList[a].delStatus,
                      recomHouseStatus: entrustHouseList[a].recomHouseStatus,
                      houseId: entrustHouseList[a].houseId,
                      vipCaseId: entrustHouseList[i].vipCaseId,
                    }
                    let roomInfo = '';
                    roomInfo += entrustHouseList[a].houseRoom + '室';
                    roomInfo += entrustHouseList[a].houseHall + '厅';
                    var item = {
                      from: _this.data.toUserId,
                      to: _this.data.account,
                      msgType: "entrust",
                      text: '',
                      houseInfo: houseInfo,
                      roomInfo: roomInfo
                    };

                    chatLists[b]=item; 
                  }
                }
              }
              _this.setData({
                chatLists: chatLists
              });
            }
          }else{
            console.log('12313');
          }
        }
      }
    })
  },
  /**
   * 委托推送房源加入到聊天列表
   */
  dealEntrustHouse:function(chatLists){
    var _this = this;
    var entrustHouseList = _this.data.entrustHouseList;
    if(_this.data.entrustHouseList.length > 0){
      for(var i in entrustHouseList){
          var caseTypeCn = entrustHouseList[i].caseType == 1 ? "[出售]" : "[出租]";
          var title = caseTypeCn+entrustHouseList[i].buildName+' '+entrustHouseList[i].houseSubject;
          let houseInfo = {
              houseSubject: title,
              thumbUrl: entrustHouseList[i].thumbUrl,
              houseArea: entrustHouseList[i].houseArea,
              buildAddr: '',
              houseTotalPrice: entrustHouseList[i].houseTotalPrice,
              priceUnitCn: entrustHouseList[i].priceUnitCn,
              caseId: entrustHouseList[i].houseId,
              caseType: entrustHouseList[i].caseType,
              cityId:entrustHouseList[i].cityId,
              reSource: entrustHouseList[i].reSource,
              buildName: entrustHouseList[i].buildName,
              isVip:entrustHouseList[i].isVip,
              userId: app.globalData.userId,
              recomInfoId:entrustHouseList[i].recomInfoId,
              seeStatus:entrustHouseList[i].seeStatus,
              brokerMoney:entrustHouseList[i].brokerMoney,
              tips:entrustHouseList[i].tips,
              pushLogId:entrustHouseList[i].pushLogId,
              isEvaluate:entrustHouseList[i].isEvaluate,
              delStatus: entrustHouseList[i].delStatus,
              recomHouseStatus: entrustHouseList[i].recomHouseStatus,
              houseId : entrustHouseList[i].houseId,
              vipCaseId: entrustHouseList[i].vipCaseId,

          }
          let roomInfo = '';
          roomInfo += entrustHouseList[i].houseRoom + '室';
          roomInfo += entrustHouseList[i].houseHall + '厅';
          var item = {
            from: _this.data.toUserId,
            to: _this.data.account,
            msgType: "entrust",
            text: '',
            houseInfo: houseInfo,
            roomInfo: roomInfo
          };

          chatLists.push(item);
      }

      console.log(chatLists);

       _this.setData({
              chatLists: chatLists
            });
    }else{
      return chatLists;
    }
  },
  //拒绝看房
  disagreen4Daikan:function(e){
    var that = this;
    wx.request({
      url: app.buildRequestUrl('disagreen4Daikan'),
      data:{
            recomInfoId:e.target.dataset.recominfoid,
            isVip:e.target.dataset.isvip
      },
      success: function (res) {
        var status = res.data.STATUS;
        if(status==1){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000,
            success:function(){
              //操作成功之后重新加载
              that.queryImEntrustHouseList(1);
            }
          });
        }
      }
    })
  },
  //同意看房
  agreen4Daikan:function(e){
    var that = this;
    wx.request({
          url: app.buildRequestUrl('agreen4Daikan'),
          data:{
            recomInfoId:e.target.dataset.recominfoid,
            userId: app.globalData.userId,
            isVip:e.target.dataset.isvip
          },
          success: function (res) {
            var status = res.data.STATUS;
            if(status==1){
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1500,
                success:function(){
                  //操作成功之后重新加载
                  that.queryImEntrustHouseList(1);
                }
              });
            }
          }
      })
  },
  //跳转委托页面
  goToEntrustDetail: function (e) {
    var _this = this;
    var pushLogId = e.target.dataset.pushlogid;
    var caseType = e.target.dataset.casetype;
    if (false) {
      wx.navigateTo({
        url: '/pages/prizeTrustDetail/prizeTrustDetail?pushLogId=' + pushLogId
      })
    } else {
      wx.navigateTo({
        url: '/pages/entrustDetail/entrustDetail?pushLogId=' + pushLogId
      })
    }
  },
  //带看评价，展示带看评价弹框
  daikanEva:function(e){
    //展示带看评价弹框
    if (this.data.isAddBlacklist) {
      wx.showToast({ title: '您已把对方屏蔽，解除屏蔽后才能进行联系', icon: 'none', duration: 2000 })
      return;
    }
    
    this.setData({
      seeEvaluateBox: true,
      recomInfoId: e.target.dataset.recominfoid,
      pushLogId: e.target.dataset.pushlogid
    })
  },
  //关闭带看评价弹框
  daikanEvaClose: function (e) {
    this.setData({
      seeEvaluateBox: false,
    })
  },
  chooseServeStar: function (e) {//改变带看评价服务态度星级
    this.setData({
      seeStarVal: e.target.dataset.val,
      checkedEvaReasonArr: { 0: 0, 1: 0, 2: 0, 3: 0 }
    })
  },
  chooseLevelStar: function (e) {//改变带看评价专业水平星级
    this.setData({
      levStarVal: e.target.dataset.val,
      checkedEvaReasonArr: { 0: 0, 1: 0, 2: 0, 3: 0 }
    })
  },
  toggleRealHouse: function (e) {//切换选择真房源/假房源
    this.setData({
      realHouse: e.target.dataset.val,
      evaContent: '',
      seeStarVal: 0,                 //带看评价点击服务态度五角星的值
      levStarVal: 0
    })
  },
  evaContentBlur: function (e) {//填写评价内容
    this.setData({
      evaContent: e.detail.value
    })
  },
  chooseHouseIntentDialog: function (e) {
    var that = this;
    //带看评价四星以下必选原因或者必填文字,否则按钮颜色为灰色不可点
    var evaContent = that.data.evaContent;  //带看评价
    that.setData({
      isLike: e.target.dataset.val
    })
    var indexArr = new Array();
    for (var i in that.data.checkedEvaReasonArr) {
      if (that.data.checkedEvaReasonArr[i] == 1) {
        indexArr.push(i);
      }
    }
    if (that.data.realHouse == "0") {//选择假房源
      if (evaContent.length == 0) {
        wx.showToast({
          title: '请填写评论指出经纪人的不足吧',
          icon: 'none',
          duration: 1500,
          success: function () {
          }
        });
        return false;
      }

      if (evaContent.length < 15) {
        wx.showToast({
          title: '请至少输入15个字',
          icon: 'none',
          duration: 1500,
          success: function () {
          }
        });
        return false;
      }
      that.submitEvaData();
    } else { //真房源
      if (that.data.realHouse == "1") {
        if (that.data.seeStarVal < 1) {
          wx.showToast({
            title: '请给经纪人服务态度评分',
            icon: 'none',
            duration: 1500,
            success: function () {
            }
          });
          return false;
        }
        if (that.data.levStarVal < 1) {
          wx.showToast({
            title: '请给经纪人专业水平评分',
            icon: 'none',
            duration: 1500,
            success: function () {
            }
          });
          return false;
        }
        that.submitEvaData();
      }
    }
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
  submitEvaData: function () {//提交带看评价数据
    var that = this;
    var indexArr = new Array();
    for (var i in that.data.checkedEvaReasonArr) {
      if (that.data.checkedEvaReasonArr[i] == 1) {
        indexArr.push(i);
      }
    }
    wx.request({
      url: app.buildRequestUrl('createWfRecomHouseEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        recomInfoId: that.data.recomInfoId,
        realHouse: that.data.realHouse,
        evaContent: that.data.evaContent,
        seeStar: that.data.seeStarVal,
        levStar: that.data.levStarVal,
        isLike: that.data.isLike,
        evaTagIndex:''
      },
      success: function (res) {
        console.log(res);
        var status = res.data.STATUS;
        if (status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          });
          that.setData({ seeEvaluateBox: false });
          //操作成功之后重新加载
          that.queryImEntrustHouseList(1);
        } else {
          wx.showToast({
            title: res.data.INFO,
            icon: 'none',
            duration: 2000
          });
          return false;
        }
      }
    })
  },
  //佣金支付页面
  weikuanPrePay: function (e) {
    var that = this;
    if (this.data.isAddBlacklist) {
      wx.showToast({ title: '您已把对方屏蔽，解除屏蔽后才能进行联系', icon: 'none', duration: 2000 })
      return;
    }
    var caseType = e.target.dataset.casetype + 2;
    wx.navigateTo({
      url: '/pages/commissionpay/commissionpay?pushLogId=' + e.target.dataset.pushlogid + "&recomInfoId=" + e.target.dataset.recominfoid
        + "&money=" + e.target.dataset.brokermoney + "&caseId=" + e.target.dataset.vipcaseid + "&caseType=" + caseType
        + "&cityId=" + e.target.dataset.cityid + "&userId=" + that.data.toUserId
    });
  },
  //服务评价弹窗
  showCompleteEvaDialog: function (e) {
    this.setData({
      showCompleteEvaDialog: true,
      pushLogId: e.target.dataset.pushlogid,
      cityId: e.target.dataset.cityid
    })
    this.getServiceEvaAction();
  },
  //关闭带看评价弹框
  completeEvaClose: function (e) {
    this.setData({
      showCompleteEvaDialog: false,
    })
  },  
  completeEvaContentBlur: function (e) {//成交评价内容
    this.setData({
      completeEvaContent: e.detail.value
    })
  },
  getServiceEvaAction: function () {
    var that = this;
    wx.request({
      url: app.buildRequestUrl('getServiceEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
      },
      success: function (res) {
        var status = res.data.STATUS;
        var data = res.data.DATA;
        if (status == 1) {
          that.dealData(data, 'brokerMoney');
          that.dealData(data, 'houseMoney');
          that.dealData(data, 'priceUnit');
          that.dealData(data, 'onlinePayMoney');
          that.dealData(data, 'prizeRedMoney');
          that.dealData(data, 'brokerBuTieMoneyDesc');
          that.dealData(data, 'realPayMoney4C');
          that.dealData(data, 'offlinePayMoney');
          that.dealData(data, 'shareMoney');
          that.dealData(data, 'shareId');
          //这种情况表示已经评价了
          if (data.evaStar > 0) {
            that.setData({ serverStarVal: data.evaStar });
            if (data.evaTag) {
              that.setData({ evaTag: data.evaTag.split("|") });
            }
          }
        }
      }
    })
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
  chooseCompleteEvaStar: function (e) {//改变成交评价星级
    this.setData({
      serverStarVal: e.target.dataset.val
    })
  },
  chooseCompleteReason: function (e) {//选择成交评价四星以下原因
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
    if (that.data.serverStarVal < 4 && indexArr.length == 0 && that.data.completeEvaContent.length == 0) {//四星以下必须选择标签或填写评论
      wx.showToast({
        title: '请选择标签或填写评论指出经纪人的不足吧',
        image: '../../images/warning.png',
        duration: 1500,
        success: function () {
        }
      });
      return;
    }
    wx.request({
      url: app.buildRequestUrl('createServiceEvaAction'),
      data: {
        pushLogId: that.data.pushLogId,
        userId: app.globalData.userId,
        archiveId: that.data.toUserId,
        cityId: that.data.cityId,
        evaContent: that.data.completeEvaContent,
        evaTagIndex: indexArr.join(","),
        evaStar: that.data.serverStarVal
      },
      success: function (res) {
        app.hideToast();
        var status = res.data.STATUS;
        if (status == 1) {
          wx.redirectTo({
            url: '/pages/entrustDetail/entrustDetail?pushLogId=' + that.data.pushLogId
          });
        }
      }
    })
  },
  //跳转经纪人个人微店页面
  goToPerStore:function(){
    var url = "/pages/personalStore/personalStore?scene=" + this.data.toUserId
    wx.navigateTo({
      url: url
    })
  },
  //获取专属客服快捷回复问题数组
  _initAoetextList: function (to){
    var _that = this;
    //如果咨询的是客服就加载快捷回复数组
    if (to == 618239) {
      wx.request({
        url: app.buildRequestUrl('getCustomerConsultation'),
        // url: 'http://ygyuuweb.hftsoft.com/Mini/Im/getCustomerConsultation',
        data: {
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data.STATUS == 1 && res.data.DATA.list.length>0) {
            var aoetextList = res.data.DATA.list
            for (var i in aoetextList){
              aoetextList[i]['num'] = (parseInt(i) +parseInt(1))
            }
            _that.setData({
              aoetextList: aoetextList
            })
          }else{
            var aoetextList = [
              { nlgId: 1, num: 1, nlgSubject: '如何租房/买房？', nlgContent:'客官可以点击首页--补贴直通车--发布订单--一分钟为您秒推荐；客官还可以点击首页--浏览“假一赔百”真房源直接联系房源人。'},
              { nlgId: 2, num: 2, nlgSubject: '如何才能拿4999元补贴？', nlgContent: '发布悬赏金委托，并且在优优好房平台成交，符合要求后会从100户抽取1户补贴4999元。'},
              { nlgId: 3, num: 3, nlgSubject: '支付意向金有何好处？', nlgContent: '支付悬赏金可以向经纪人表明您的找房诚意，大幅提高找房成功率；支付悬赏金委托可抵扣500元购房中介费（租房抵扣200元），成交还可抽取4999元现金大奖。'},
              { nlgId: 4, num: 4, nlgSubject: '如何查看委托进度？', nlgContent: '点击“我的”选择您的委托类型即可查看委托进度。'},
              { nlgId: 5, num: 5, nlgSubject: '平台找房收费吗？', nlgContent: '平台是免费为客官找房的，如果客官满意房子，直接把银子支付给对方就可以啦，在平台成交还可以获得住房补贴福利。'},
              { nlgId: 6, num: 6, nlgSubject: '平台的房子真实吗？', nlgContent: '真实哦，建议客官可以优先浏览带有“假一赔百”标签的真房源，我们挑选全城优质经纪人为您服务！'},
              { nlgId: 7, num: 7, nlgSubject: '这个房子还在吗？', nlgContent: '客官如看中这套房子，请直接下拉房源页面--拨打挂牌经纪人进行详细了解哦。同时您还可以点击“特权找好房”填写您对房屋的具体要求，一键为您推荐更多好房，让你更多选择哦。'},
              { nlgId: 8, num: 8, nlgSubject: '区域房价是多少？', nlgContent: '客官可以直接点击首页--房价评估--输入小区--查询房价哦；亦可点击首页--浏览您心仪的房源--咨询经纪人或小区专家了解更多。'},
              { nlgId: 9, num: 9, nlgSubject: '如何办理贷款/买房政策？', nlgContent: '客官如需了解贷款和买房政策，小优建议您可以通过我们“假一赔百”真房源咨询经纪人为您专业解答。'},
              { nlgId: 10, num: 10, nlgSubject: '如何代理和加盟？', nlgContent: '客官如需了解代理和加盟，请拨打4008908890转1哦。'},
              { nlgId: 11, num: 11, nlgSubject: '如何登记房源？', nlgContent: '客户请点击首页--更多服务--房源登记--我要出租/出售--按照提示操作即可登记成功哦'}
            ]
            _that.setData({
              aoetextList: aoetextList
            })
          }
        }
      })
    }
  }
})
