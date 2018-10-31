var app = getApp();
var api = require('../../utils/common.js');

let imSdk = require('../../utils/NIM_Web_NIM_v5.0.0.js');
let common = require('../../utils/common.js');
let nim = ''; 
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
   duration:600000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac'
}

Page({
    data:{
        inputValue:'',
        focusFlag:'',
        disabledFlag:true,
        chatLists: [],
        nim: {},
        inputFocus: false,
        userInfo:[],
        appKey: 'bbfa3e3f827bfb19d81b0197adb91758',
        account: '',
        to: '',
        toUserInfo: [],
        caseId: 7384988,
        caseType: 1,
        cityId: 1,
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
        toView: '2',
        scrollTop: 100,
        windowH: 0,
        keyboardWindowH:0,
        keyboardHeight: 0,
        paddingTop:20,
        sessions: {},
        contact:[],
        recommendHouse: [],
        lastRecommendHouse: '',
        j: 1,//帧动画初始图片
        isSpeaking: false,//是否正在说话,
        textOrVoice:'text',//切换显示文本和语音
        emojiArr:[],
        cursor: '',
        photoBoxHide: true,  //发送图片盒子隐藏
        emojiList: {},    //渲染emoji标签数据
        emojiBoxHide: true,   //标签盒子隐藏
        emojiText:[],
        toUserId:'',
        scrollTopHeight: 0,
        isAddBlacklist: false,  //是否屏蔽该用户消息
        addBlacklistToastShow: false,  //加入黑名单toast提示框
        addBlacklistToastShowText: '屏蔽成功，对方无法主动联系您！',  //加入黑名单toast提示框文字
    },
    onLoad: function(options) {
      //获取参数
      let from = 'uu_'+options.from;
      let to = 'uu_'+options.to;
      let caseId = options.caseId ? options.caseId : 0;
      let caseType = options.caseType ? options.caseType: 1;

      let _this = this;

      //emoji表情初始化
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
      var emojiBaseUrl = 'https://uuweb.haofang.net/Public/wxApp/images';
      var emojiItem = emojiList['emoji'];
      var emojiObj = {};
      var emojiNum = 0;
      var emojiPage = 1;
      emojiObj[emojiPage] = {};
      var emojiTextArr = [];
      for (var key in emojiItem) {
        var keytext = key.replace(/\[|\]/g,'');
        emojiTextArr.push(keytext);
        emojiNum++;
        emojiObj[emojiPage][key] = emojiItem[key];
        emojiObj[emojiPage][key]['img'] = emojiBaseUrl + "/emoji/" + emojiItem[key]['file'];
        emojiObj[emojiPage][key]['fileName'] = key;
        if (emojiNum%20 == 0){
          emojiPage++;
          emojiObj[emojiPage] = {};
        };
      };

      _this.setData({
        emojiText: emojiTextArr,
        emojiList: emojiObj,
        account: from,
        toUserId: to,
        caseId: caseId,
        caseType: caseType,
        cityId: _this.data.cityId
      })
      //获取手机高度
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            windowH: res.windowHeight
          });
        }
      })
      //实例化用户和房源数据
      wx.request({
        url: app.buildRequestUrl('initImc'), 
        data: {
          accid: _this.data.account,
          toUserId: _this.data.toUserId,
          caseId: _this.data.caseId,
          caseType: _this.data.caseType,
          cityId: _this.data.cityId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200){
            _this.setData({
              toUserInfo: res.data.data.toUserInfo,
              userInfo: res.data.data.userInfo,
              houseInfo: res.data.data.houseInfo
            })

            _this.initIm();
            //设置标题
            wx.setNavigationBarTitle({
              title: _this.data.toUserInfo.name
            })
            //如果有房源就显出出来
            if(_this.data.houseInfo.length > 0){
              _this.setData({
                houseFlag: true
              })
            }
          }else{
            wx.showToast({
              title: '初始化失败',
              icon: 'success',
              duration: 2000
            })
          }
        }
      });
      //保存nim
      

       	recorderManager.onStart(() => {
   		})
        recorderManager.onStop((res) => {//停止后直接
        	console.log('wexiin');
        	console.log(res);
       	 _this.setData({
       		 isSpeaking: false
       	 });
    	 if(res.duration<800){
        	  wx.showToast({
      			title: '录音时间太短',
      			  image:'../../images/warning.png',
      			  duration: 600
      			});
        	  return;
          }
          nim.sendFile({
              scene: 'p2p',
              to: _this.data.toUserId,
              type: 'audio',
              wxFilePath: res.tempFilePath,
              done (error, msg){
            	  console.log("msg");
                  console.log(msg);
                  console.log("error");
                  // 获取文件路径
                  var path = msg.file.url;//云信返回的连接不用加后缀加了会解析不成功
//                  var path = msg.file.url;//云信返回的连接不用加后缀加了会解析不成功
                  var item = {
                    from: _this.data.account,
                    to: _this.data.toUserId,
                    dur:Math.round(res.duration/1000)+'″',
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
    },
    /**
     * 验证是否为emoji表情
     */
    isEmoji(item){
      var emojiArr = this.data.emojiText;
      for (var val of emojiArr){
        if(item === val){
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
          onsyncdone: _this.onSyncDone
        })

      _this.getChatHistory();
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

    onConnect: function() {
      let _this = this;
      console.log('连接成功');
    },
    getChatHistory: function() {
      let _this = this;
      //im初始化成功，拉取聊天历史
      wx.request({
        url: app.buildRequestUrl('chatHistoryC'),
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
                }

                if (!item.text) {
                  continue;
                }
              } else if (msgs[k].type == 1) {//图片
                var item = {
                  from: msgs[k].from,
                  to: msgs[k].from,
                  msgType: 'image',
                  url: msgs[k].body.url,
                };
              } else if (msgs[k].type == 100) {//富文本
                let houseInfo = {
                  houseSubject: msgs[k].body.data.CONTENT,
                  thumbUrl: msgs[k].body.data.PHOTO,
                  houseArea: msgs[k].body.data.HOUSEAREA,
                  buildAddr: '',
                  houseTotalPrice: msgs[k].body.data.HOUSEPRICE,
                  priceUnitCn: msgs[k].body.data.HOUSEPRICEUNIT
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
                  dur: Math.round(msgs[k].body.dur/1000) + '″'
                };
              } 

              if(k % 10 == 0){
                item.time = common.formatTimeNew(msgs[k].sendtime);
                item.hasTime = true;
              }

              //所有值都把发送时间加上
              item.sendtime = msgs[k].sendtime;

              _this.data.chatLists.push(item);
              _this.setData({
                chatLists: _this.data.chatLists
              })
              _this.scrollToBottom();
            }
          }
        }
      })
    },
    onRoamingMsgs: function(obj) {
      console.log('收到漫游消息', obj);
   },
    onOfflineMsgs: function (obj) {
      console.log('收到离线消息', obj);
    },
    onError: function (error){
      console.log(error);
    },
    onSyncDone: function(){
      console.log('onSyncDone');
    },
    onDisconnect: function(error) {
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
    onMsg: function(msg){
      console.log('收到消息', msg.scene, msg.type, msg);
      if (this.data.toUserId != msg.from && this.data.toUserId != 'uu_'+ msg.from){
        console.log('收到'+msg.fromNick + '的新消息');
      }else{
        var item = {
          from: msg.from,
          to: msg.to,
          msgType: msg.type,
          text: msg.text,
          emoji: common.buildEmoji(msg.text),
          hasEmoji: false
        };
        if (item.emoji.length > 0) {
          item.hasEmoji = true
        }
        if (msg.type == 'image') {
          item.url = msg.file.url;
        } else if (msg.type == 'audio') {
          item.url = msg.file.mp3Url;
          item.dur = Math.round(msg.file.dur / 1000) + '″';
        } else if (msg.type == 'custom'){
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

        this.data.chatLists.push(item);

        this.setData({
          chatLists: this.data.chatLists
        })

        console.log(this.data.recommendHouse);
        //跳转到底部
        this.scrollToBottom();
      }
     
    },
    onShareAppMessage: function () {
        return {
            title: app.globalData.compInfo.FCompName,
            path: app.globalData.sharePublicUrl,
            success: function(res) {
              // 转发成功
            },
            fail: function(res) {
              // 转发失败
            }
          }
  },
  /**
   * 发送消息
   */
    imSubmit: function(e) {
      let _this = this;
      let msg = this.data.inputValue.trim();

      nim.sendText({
        scene: 'p2p',
        to: _this.data.toUserId,
        text: msg,
        done: this.sendMsgDone
      });
      var item = {
                from: _this.data.account,
                to: _this.data.toUserId,
                msgType:"text",
                text:this.data.inputValue,
                hasEmoji: false,
                emoji: common.buildEmoji(this.data.inputValue),
                sendtime: (new Date()).getTime()
        };

        if (item.emoji[1].length > 0) {
          item.hasEmoji = true
        }

        let hasTime = _this.getLastTime();
        if(hasTime == true){
          item.time = common.formatTime(item.sendtime, 'h:m');
          item.hasTime = true;
        }

        this.data.chatLists.push(item);
        this.setData({
            chatLists:this.data.chatLists,
            inputValue:''
        })
    },
    sendMsgDone: function(res) {
      //跳转到底部
      this.scrollToBottom();
    },
    inputContent: function(e) {
        var that = this;
        var old = this.data.inputValue;
        var inputValue = e.detail.value;
        var oldLength = old.length;
        var nowLength = inputValue.length;
        if (oldLength-nowLength === 1 && old[oldLength-1] == ']' && old.indexOf('[')>-1){
          var i = old.lastIndexOf('[');
          var emojiText = old.substring(i + 1, oldLength - 1);
          var textArr = that.data.emojiText;
          for (var textVal of textArr){
            if (textVal === emojiText){
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
        }else{
          this.setData({
            inputValue: inputValue,
            disabledFlag: inputValue.length ? false : true
          });
        };
    },
    inputFocus: function(e){
      var _this = this;
      var keyboardH = this.data.windowH;
      this.setData({
        paddingTop: keyboardH/2-20,
        inputFocus: true,
        recommendListFlag: false,
        recommendFlag: this.data.lastRecommendHouse.length > 0 ? true : false
      });
      this.sendMsgDone();
    },
    inputblur(){
      this.setData({
        inputFocus: false,
        paddingTop:20
      });
    },
    clickImage: function(e){
        var url = e.target.dataset.url;
        //预览图片
        wx.previewImage({
            current: url,
            urls: [url]
        });
    },
    //发送链接
    sendHouse: function(e){
      let _this = this;
      //发送富文本
      let roomInfo = '';
      let houseInfo = _this.data.houseInfo;
      roomInfo += houseInfo.houseRoom ? houseInfo.houseRoom + '室' : "";
      roomInfo += houseInfo.houseHall ? houseInfo.houseHall + '厅' : "";
      roomInfo += houseInfo.houseWei ? houseInfo.houseWei + '卫' : "";
      var sub_content = houseInfo.houseSubject + houseInfo.houseArea + "㎡" + houseInfo.houseTotalPrice + ' ' + roomInfo;
      var content = { title: houseInfo.shareTitle, content: sub_content, log_id: _this.data._IM_log_id, case_id: _this.data.caseId, type: _this.data.caseType, city_id: _this.data.cityId, photo: houseInfo.thumbUrl, detail: houseInfo.DETAIL_URL, from: 'detail' };
      //封装要发送的数据
      var content = {
        type: 14,
        data: {
          TITLE: "推荐房源",
          CONTENT: sub_content,
          PHOTO: houseInfo.thumbUrl,
          HOUSEROOM: houseInfo.houseRoom,
          HOUSETING: houseInfo.houseHall,
          HOUSEAREA: houseInfo.houseArea,
          HOUSEREG: houseInfo.regionName,
          HOUSEPRICE: houseInfo.unitPrice,
          HOUSEPRICEUNIT: houseInfo.priceUnitCn,
          BUILDNAME: houseInfo.buildName
        }
      };
      var ext = {
        CASE_ID: _this.data.caseId,
        CASE_TYPE: _this.data.caseType
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
    cancel: function(){
       this.setData({
        houseFlag: false
      })
    },
    /**
     * 播放语音
     */
    audioPlay: function(e) {
	    let _this = this;
	    console.log(e);
	    let dur = e.target.dataset.dur;
	    let src = e.target.dataset.src;
	    let idx = e.target.id;
	    
	    this.setData({
	      currentId: idx
	    })
	    innerAudioContext.autoplay = true
	    // innerAudioContext.src = src +'?audioTrans&type=mp3';
      innerAudioContext.src = src;
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
    lower: function (e) {
      //console.log(e)
    }, 
    scroll: function (e) {
      this.setData({
        scrollTopHeight: e.detail.scrollTop
      });
    },
    scrollToBottom: function() {
      this.setData({
        toView: 'red'
      })
    },
    onSessions: function (sessions){
      console.log('收到会话列表', sessions);
    },
    onUpdateSession: function (session) {
      console.log('会话更新了', session);
      this.updateSession(session);
    },
    /**
     * 更新当前用户的聊天历史
     * 
     */
    updateSession: function(session){
      let _this = this;
      let keyName = 'contract_list';
      let id = session.id;
        //当前聊天人的最后一条会话
        // wx.setStorageSync(id, session.lastMsg);

      console.log(session);
      if(session.lastMsg.type == 'text'){
        var msg = session.lastMsg.text;
      } else if (session.lastMsg.type == 'image'){
        var msg = '收到一张图片';
      } else if (session.lastMsg.type == 'custom'){
        var msg = '推荐房源';
      }else{
        var msg = '你有新消息啦';
      }
       var item = {
         id: _this.data.toUserId,
         photo: _this.data.toUserInfo.icon,
         name: _this.data.toUserInfo.name,
         msg: msg,
         time: session.lastMsg.time,
         sendtime: session.lastMsg.time
       }
        wx.setStorage({
          key: id,
          data: item
        })

        wx.getStorage({
          key: keyName,
          success: function (res) {
            console.log(res.data);
            _this.setData({
              contact: res.data
            })
          }
        })

        //添加一个聊天人
        // let value = wx.getStorageSync(key);//当前的联系人列表
        console.log(_this.data.contact);
        if (_this.data.contact) {
          _this.data.contact.unshift(id);

          _this.setData({
            contact: common.unique1(_this.data.contact)
          })

          console.log(_this.data.contact);
          wx.setStorage({
            key: keyName,
            data: _this.data.contact
          })

        }else{
          wx.setStorage({
            key: keyName,
            data: JSON.stringify([id])
          })

          wx.getStorage({
            key: keyName,
            success: function (res) {
              console.log(res.data)
            }
          })
        }
 
    },
    takePhone: function(e) {
      let mobile = e.currentTarget.dataset.mobile;
      wx.makePhoneCall({
        phoneNumber: mobile 
      })
    },
    /**
     * 推荐房源下拉
     */
    pullDown: function(e){
        this.setData({
          recommendListFlag: true,
          recommendFlag: false
        })
    },
    pullUp: function(e){
      this.setData({
        recommendListFlag: false,
        recommendFlag: true
      })
    },
    /**
     * 跳转详情
     */
    goDetail: function(e){
      let caseId = e.currentTarget.dataset.caseid;
      let caseType = e.currentTarget.dataset.casetype;
      let cityId = e.currentTarget.dataset.cityid;
      let reSource = e.currentTarget.dataset.resource;
      if (getCurrentPages().length < 5){
        wx.navigateTo({
          url: '/pages/houseDetail/houseDetail?caseId=' + caseId + '&caseType=' + caseType + '&cityId=' + cityId + '&reSource=' + reSource,
        })
      }else{
        wx.redirectTo({
          url: '/pages/houseDetail/houseDetail?caseId=' + caseId + '&caseType=' + caseType + '&cityId=' + cityId + '&reSource=' + reSource,
        })
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
      var shieldUserId = _this.data.toUserId.replace('uu_', '');
      var params = {
        userId: userId,        //屏蔽人用户id
        shieldUserId: shieldUserId, //被屏蔽人用户id
        status: status                     //状态 1屏蔽 0取消屏蔽
      }
      //解除屏蔽成功
        _this.setData({
          isAddBlacklist: !isAddBlacklist,
        });
      var requestUrl = app.buildRequestUrl('saveShield');
      /*C端用户数据接口为*/
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

    fileSend:function(e){
    	var that = this;
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
		        done: function(error,msg){
		            var item = {
	                    from: that.data.account,
	                    to: that.data.toUserId,
	                    msgType: 'image',
	                    url: tempFilePaths,
	                  };


                let hasTime = that.getLastTime();
                if (hasTime == true) {
                  item.time = common.formatTime(item.sendtime, 'h:m');
                  item.hasTime = true;
                }
		            that.data.chatLists.push(item);
		            that.setData({
		            	chatLists: that.data.chatLists
		            })
		        }
		    });
		  }
		})
    },
    touchdown: function (e) {
    	var that = this;
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
                fail(){
                  that.setData({ isSpeaking: false });
                }
              });
            }else{
            	that.record();
            };
          }
        });
      },
      //手指抬起
      touchup: function () {
    	  var isSpeaking = this.data.isSpeaking;
        if (isSpeaking){
          this.setData({ isSpeaking: false });
          recorderManager.stop();
        };
      },
      toogleChat:function(){
    	var textOrVoice = this.data.textOrVoice == 'text'?'voice':'text';
    	if(textOrVoice == 'text'){
    		this.setData({
          focusFlag:true
        });
    	};
    	this.setData({
        textOrVoice:textOrVoice,
        photoBoxHide:true,
        emojiBoxHide: true
      });
    },
    record:function(){
    	var that = this;
    	that.setData({
         	isSpeaking: true
         })
         recorderManager.start(options);
    },
    /**
     * 点击加号,显示相册拍摄弹框
     */
    showPhotoBox(){
      var boo = !this.data.photoBoxHide;
      this.setData({
        emojiBoxHide: true,
        photoBoxHide: boo
      });
      this.scrollToBottom();
    },
    /**
     * 点击笑脸
     */
    showEmojiBox(){
      var boo = !this.data.emojiBoxHide;
      this.setData({
        photoBoxHide: true,
        emojiBoxHide: boo,
        textOrVoice: 'text'
      });
      this.scrollToBottom();
    },
    chooseEmoji:function(e){
    	var name = e.currentTarget.dataset.name;
    	var data = this.data.inputValue;
      var text = data + name;
      var num = text.length;
    	this.setData({
        inputValue:text,
        // cursor: num,
        // focusFlag: true
      });
    },
    /**
     * 点击消息记录,隐藏表情,照片弹框
     */
    showMessage(){
      this.setData({
        photoBoxHide: true,
        emojiBoxHide: true
      });
      this.scrollToBottom();
    },
    /**
     * 表情弹框的删除键功能
     */
    deleteInput(){
      var val = this.data.inputValue;
      var i = val.lastIndexOf('[');
      if(i != -1){
        val = val.substring(0,i);
        this.setData({
          inputValue: val
        });
      };
    },
    //获取最后一条消息的时间
    getLastTime(){
      let chatLists = this.data.chatLists;
      let len = chatLists.length;
      let lastOne = chatLists[len - 1];
      let sendtime = lastOne.sendTime;
      let offset = new Date().getTime() - sendtime;

      if(offset > 1800){
        return true;
      }else{
        return false;
      }
    },
    shield:function(){
    	
    }
})
