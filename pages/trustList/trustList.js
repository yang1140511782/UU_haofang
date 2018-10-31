
//index.js
//获取应用实例
const app = getApp();
//im相关
let imSdk = require('../../utils/NIM_Web_NIM_v5.0.0.js');
let common = require('../../utils/common.js');
import { Tools } from '../../utils/tools';
let _im = require('../../utils/_im.js');
const tool = new Tools();
let nim = '';
/**
 * 滑动事件所需参数
 */
var touchDot = 0;    //触摸时的原点 
var time = 0;        // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";   // 记录/清理时间记录

Page({
  data: {
   toastHide: true,  //弹框隐藏
   publishEntrustShow:false,//发布委托的弹框
   prizeTrustBompShow:false,//有奖委托收到奖励金
   cityId:'',//城市id
   youyouUserId:'',//优优id
   pageNum:1,//页数
   listValue:'',//列表数据
   requestForRentShow:false,//出租出售取消委托弹框
   rentOutShow:false,//求租求购消委托弹框

   cancelCityId:'',//取消委托的房源 的 cityId
   cancelCaseId:'',//取消委托的房源id
   cancelCaseType:'',//取消委托房源类型
   ourDelete: 0,
   deleteBtnShow: '',   //当前处于删除状态的房源ID
   winHeight:'',
   nodataShow:false,//没有数据显示
   nextPage:true,//下一页
   flowVipCaseId:'',//跳转跟进用的
   redirectVipCaseId: '',
   refuseBrokerReason:{
    1:["暂不出售/租","房源信息登记错误",	"无合适经纪人","长未出售/租"],
    2:["暂不出售/租","房源信息登记错误",	"无合适经纪人","长未出售/租"],
     3:["暂无购/租房需求","需求信息登记错误","无合适经纪人","长期未找到合适房源"],
     4:["暂无购/租房需求","需求信息登记错误","无合适经纪人","长期未找到合适房源"],
   },//取消委托的原因
   ifChoosed: [],//取消委托原因传值用的
   reason:'',//取消原因
   reasonTextLength:0,//评价字数长度
   cancleIsVip:'',//取消委托用的是否是专属委托
   cancleIsHezu:'',//取消委托是不是整租合租
   isHezu:'',
   refuseBrokerBox:false,//取消委托原因弹框
   prizeTrustShow:false,//有奖委托提示
   grievanceBomp:false,//投诉弹框
   cancelPushLogId:'',//用于点击委托详情用的,
   brokerArchiveId:'',//经纪人id
   userInfo: [],
   appKey: 'bbfa3e3f827bfb19d81b0197adb91758',
   account: '912533',
   toUserId: '11',
   toUserInfo: [],
   wxId:'',
   caseTypeMap:{
     1: { text: '我要卖房', titleText: '卖房委托',url:'/pages/registration/registration?caseType=1'},
     2: { text: '我要出租', titleText: '出租委托',url:'/pages/registration/registration?caseType=2'},
     3: { text: '我要买房', titleText: '买房委托',url:'/pages/entrust/entrust?caseType=3'},
     4: { text: '我要租房', titleText: '租房委托',url:'/pages/entrust/entrust?caseType=4'},
   },
   locateCityId: '',   
   locateCityName:''
  },
  onLoad: function (options) {
    app.checkLogin();//登录验证
   var _this =this;
   var userId = wx.getStorageSync("userId");
   //获取城市ID
    var value = wx.getStorageSync('cityId');
    var caseType = options.caseType;
    if(!caseType){caseType=3};// 默认 "我要买房"
    //修改页面标题
    wx.setNavigationBarTitle({ title: _this.data.caseTypeMap[caseType]['titleText']});

      _this.setData({
        cityId:value,
        wxId: userId,
        locateCityName:wx.getStorageSync('locateCityName'),
        locateCityId:wx.getStorageSync('locateCityId'),
        caseType:caseType
      }); 
   try {
      var res = wx.getSystemInfoSync()
      _this.setData({
        winHeight:res.windowHeight
      })
    } catch (e) {
      // Do something when catch error
    }
   //确保用户信息已经实例化
   if (app.globalData.imUserInfo.token) {
     _this.initIm();
   }else{
     app.initImUser(function(){
       _this.initIm();
     })
   }
  },
  onShow:function(){
    var _this=this;
     _this.requestList(1);
     _this.setData({
       publishEntrustShow:false,
       rentOutShow:false,
       refuseBrokerBox:false
     })
  },
  /**
   * 请求列表数据
   */
  requestList:function(pageNum){
    var _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.buildRequestUrl('entrustList'),
     // url: 'http://lwjuuweb.hftsoft.com/Mini/my/entrustList',
      data:{
        cityId:_this.data.cityId,
        youyouUserId:wx.getStorageSync("userId"),
        pageNum:pageNum,
        pageSize:10,
        caseType:_this.data.caseType
      },
      success:function(res){
        if(!res.data){
          wx.hideLoading();
         wx.showToast({
          title: '请求错误',
          icon: 'success',
          duration: 2000
        })
          return;
        }
        if(res.data.STATUS==1){
        	if(res.data.DATA.list&&res.data.DATA.list.length>0){
        		for(var i=0;i<res.data.DATA.list.length;i++){
        			res.data.DATA.list[i]['thumbUrl'] = tool.addImgParam(res.data.DATA.list[i]['thumbUrl'],180,120);
        		}
        	}
          wx.hideLoading();
          //从缓存中取出未读消息
          var unreadMsg = wx.getStorageSync('unreadMsg');
          var unreadLen = unreadMsg.length;
          var todayStartTime = new Date(new Date().setHours(0, 0, 0, 0));//今天凌晨开始时间戳
          if(pageNum==1){
              if(!res.data.DATA){return}
              if(res.data.DATA.list&&res.data.DATA.list.length>0){
            	  for(var i=0;i<res.data.DATA.list.length;i++){
                  //处理佣金(仅求购求租委托才有)
                  for (var a in res.data.DATA.list[i].entrustUsers){
                    if (!!res.data.DATA.list[i].entrustUsers[a].broberComitionRage) {
                      switch (res.data.DATA.list[i].entrustUsers[a].caseType) {
                        case '4':
                          //求租委托
                          res.data.DATA.list[i].entrustUsers[a]['broberComitionRageNum'] = res.data.DATA.list[i].entrustUsers[a].broberComitionRage.substr(0, 2);//佣金数量
                          res.data.DATA.list[i].entrustUsers[a]['broberComitionRageUnit'] = res.data.DATA.list[i].entrustUsers[a].broberComitionRage.substr(-3, 3);//佣金单位
                          break;
                        case '3':
                          //求购委托
                          var broberComitionRageList = res.data.DATA.list[i].entrustUsers[a].broberComitionRage.split("%")
                          res.data.DATA.list[i].entrustUsers[a]['broberComitionRageNum'] = broberComitionRageList[0]
                          res.data.DATA.list[i].entrustUsers[a]['broberComitionRageUnit'] = res.data.DATA.list[i].entrustUsers[a].broberComitionRage.substr(-1, 1);//佣金单位
                          break;
                      }
                    }
                  }
            		  if(!!res.data.DATA.list[i]['houseTotalPrice']){
            		  	res.data.DATA.list[i]['houseTotalPrice'] = parseFloat(res.data.DATA.list[i]['houseTotalPrice']);
						      }
						      if(!!res.data.DATA.list[i]['houseArea']){
							      res.data.DATA.list[i]['houseArea'] = parseFloat(res.data.DATA.list[i]['houseArea']);
						      }
                  if(!!res.data.DATA.list[i]['entrustUsers']){
                    let entrustUsersArr = res.data.DATA.list[i]['entrustUsers'];
                    entrustUsersArr.map(function(item,index){
                      entrustUsersArr[index]['starLevelClass'] = item.starLevel.replace('.','-');
                    });
                    res.data.DATA.list[i]['entrustUsers'] = entrustUsersArr;
                    //添加未读消息信息
                    for (var a in res.data.DATA.list[i]['entrustUsers']) {
                      //遍历消息，查看是否有该经纪人的未读消息
                      if (unreadLen > 0) {
                        for (var b in unreadMsg) {
                          if ('p2p-' + res.data.DATA.list[i]['entrustUsers'][a].brokerArchiveId == unreadMsg[b].id) {
                            //在缓存中找到了该经纪人的未读消息并格式化消息
                            var sendTime = unreadMsg[b].updateTime;
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

                            //判断消息类型
                            switch(unreadMsg[b].lastMsg.type){
                              case 'text': 
                                var lastMsg = unreadMsg[b].lastMsg.text;
                                break;
                              case 'audio':
                                var lastMsg = '发来一段语音';
                                break;
                              case 'image':
                                var lastMsg = '发来一张图片';
                                break;
                              case 'custom':
                                var lastMsg = '发来一个位置';
                                break;
                              default:
                                var lastMsg = '发来一个自定义消息'
                            }
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsgNum'] = unreadMsg[b].unread;
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsg'] = lastMsg;
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsgTime'] = sendTime;
                          }
                        }
                      }  
                    }        
                  }
            	  }
                _this.setData({
                  listValue:res.data.DATA.list
                })
              }else{
                _this.setData({
                  listValue:[],
                  nodataShow:true
                })
              }
          }else{
            if(!!res.data.DATA.list&&res.data.DATA.list.length>0){
              for(var i=0;i<res.data.DATA.list.length;i++){
            		  if(!!res.data.DATA.list[i]['houseTotalPrice']){
            		  	res.data.DATA.list[i]['houseTotalPrice'] = parseFloat(res.data.DATA.list[i]['houseTotalPrice']);
						      }
						      if(!!res.data.DATA.list[i]['houseArea']){
							      res.data.DATA.list[i]['houseArea'] = parseFloat(res.data.DATA.list[i]['houseArea']);
						      }
                  if(!!res.data.DATA.list[i]['entrustUsers']){
                    let entrustUsersArr = res.data.DATA.list[i]['entrustUsers'];
                    entrustUsersArr.map(function(item,index){
                      entrustUsersArr[index]['starLevelClass'] = item.starLevel.replace('.','-');
                    });
                    res.data.DATA.list[i]['entrustUsers'] = entrustUsersArr;
                    //添加未读消息信息
                    for (var a in res.data.DATA.list[i]['entrustUsers']) {
                      //遍历消息，查看是否有该经纪人的未读消息
                      if (unreadLen > 0) {
                        for (var b in unreadMsg) {
                          if ('p2p-' + res.data.DATA.list[i]['entrustUsers'][a].brokerArchiveId == unreadMsg[b].id) {
                            //在缓存中找到了该经纪人的未读消息并格式化消息
                            var sendTime = unreadMsg[b].updateTime;
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

                            //判断消息类型
                            switch (unreadMsg[b].lastMsg.type) {
                              case 'text':
                                var lastMsg = unreadMsg[b].lastMsg.text;
                                break;
                              case 'audio':
                                var lastMsg = '发来一段语音';
                                break;
                              case 'image':
                                var lastMsg = '发来一张图片';
                                break;
                              case 'custom':
                                var lastMsg = '发来一个位置';
                                break;
                              default:
                                var lastMsg = '发来一个自定义消息'
                            }
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsgNum'] = unreadMsg[b].unread;
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsg'] = lastMsg;
                            res.data.DATA.list[i]['entrustUsers'][a]['unreadMsgTime'] = sendTime;
                          }
                        }
                      }
                    }        
                  }
            	  }
              _this.setData({
                  listValue:_this.data.listValue.concat(res.data.DATA.list),
                  nextPage:true,
              })
            }else{
               wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            }
          }
        }else{
           wx.hideLoading();
          _this.setData({
              nodataShow:true
          })
        }
      }
    })
  },
  /**
   * 触摸开始事件
   */
  touchStart(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  /**
   * 触摸移动事件
   */
  touchMove(e) {
    var status=e.currentTarget.dataset.status;
    if(status==1||status==2){
      return;
    }
    var id = e.currentTarget.dataset.id;
    var that = this;
    var touchMove = e.touches[0].pageX;
    // 向左滑动 
    if (touchMove - touchDot <= -40 && time < 10) {
      that.setData({
        deleteBtnShow: id
      })
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      that.setData({
        deleteBtnShow: ''
      })
    }
  },

  /**
  * 触摸结束事件
  */
  touchEnd(e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  /**
   * 点击发布按钮
   */
  fabuTrustEvent:function(e){
	  this.setData({
      publishEntrustShow:true,
      locateCityName: wx.getStorageSync('locateCityName'),
      locateCityId: wx.getStorageSync('locateCityId')
    })
  },
  publishCancleEvent:function(e){
     var _this=this;
    _this.setData({
      publishEntrustShow:false,
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
   * 发布委托
   */
  publishBtn:function(e){
    var url = e.currentTarget.dataset.url;
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityName')) {
        //显示切换城市弹框
        this.setData({ toastHide: false });
      } else {
        app.getLocationAgain();
      }
      return;
    }
    if(!!url){
      wx.navigateTo({url: url});
    }
  },

  /**
   * 同意切换到定位城市
   */
  changeCity: function () {
    this.setData({ toastHide: true });
    if(wx.getStorageSync('locateCityId')>0){
    	wx.setStorageSync('cityId', wx.getStorageSync('locateCityId'));
        wx.setStorageSync('cityName', wx.getStorageSync('locateCityName'));
        wx.reLaunch({
            url: "/pages/real_index/index"
          });
    }else{
        wx.reLaunch({
	        url: "/pages/chooseCity/chooseCity"
	    });
    }
  },
  /**
   * 取消弹框出现
   */
  trustBompEvent:function(e){
    var _this=this;
    var caseType=e.target.dataset.casetype,
    cancelCityId=e.target.dataset.cityid,
    cancelCaseId=e.target.dataset.caseid,
    cancelCaseType=e.target.dataset.casetype,
    flowVipCaseId=e.target.dataset.vipqueueid,
    redirectVipCaseId=e.target.dataset.caseid,
    isHezu = e.target.dataset.ishezu,
    isVip=e.target.dataset.isvip
    _this.setData({
      cancelCityId:cancelCityId,
      cancelCaseId:cancelCaseId,
      cancelCaseType:cancelCaseType,
      flowVipCaseId:flowVipCaseId,
      isHezu:isHezu,
      isVip:isVip,
      redirectVipCaseId:redirectVipCaseId
    })
    if(caseType==3||caseType==4){
      _this.setData({
        requestForRentShow:true 
      })
    }else{
       _this.setData({
        rentOutShow:true,
      })
    }

  },
  /**
   * 出租出售求租求购弹框消失
   */
  requestForRentEvent:function(e){
    var _this=this;
    if(_this.data.cancelCaseType==1||_this.data.cancelCaseType==2){
      _this.setData({
          rentOutShow:false,
      })
    }else{
       _this.setData({
          requestForRentShow:false,
      })
    }
    this.hideSelectItems();
  },
  /**
   * 取消委托事件
   */
  cancelTrustEvent:function(e){
    var _this=this;
    _this.setData({
      rentOutShow:false,
      refuseBrokerBox:true,
    })
    this.hideSelectItems();
  },
  /**
   * 删除委托
   */
  deletaNewHouse:function(e){
    var _this = this;
    var vipqueueId=e.currentTarget.dataset.vipqueueid;
     wx.showLoading({
      title: '删除中',
    })
    wx.request({
      url:app.buildRequestUrl('deleteQueue'),
      data:{
        vipQueueId:vipqueueId
      },
      success:function(res){
      if(res.data.STATUS==1){
          wx.hideLoading();
          wx.showToast({
            title:res.data.INFO,
            icon: 'success',
            duration: 2000
          });
           _this.requestList(_this.data.pageNum);
        }else{
        	wx.showToast({
                title:res.data.INFO,
                image:'../../images/warning.png',
                duration: 1500
              })
        }
      }
    })
  },
  /**
   * 滚动事件
   */
  scrollBottomEvent:function(e){
    var _this=this;
     if(_this.data.nextPage){
        _this.setData({
          pageNum:_this.data.pageNum+1,
          nextPage:false,
        })
         _this.requestList(_this.data.pageNum);
     }
  },
  /**
   * 房源跟进
   */
  houseFlowEvent:function(e){
    var _this=this;
    this.hideSelectItems();
    var vipCaseId=_this.data.redirectVipCaseId,
      caseType=_this.data.cancelCaseType,
      cityId=_this.data.cityId,
      youyouUserId=wx.getStorageSync("userId"),
      isBroker=1;
    wx.navigateTo({
      url:'/pages/track/track?cityId='+cityId+'&caseType='+caseType+'&vipCaseId='+vipCaseId+'&youyouUserId='+youyouUserId+'&isBroker='+isBroker
    })
  },
  /**
   * 选择取消委托原因
   */
  chooseReason:function(e){
    var _this=this;
    var chooseArr = this.data.ifChoosed;
    var index = e.currentTarget.dataset.index;
    var n = chooseArr.indexOf(index);
    if (n != -1) {
          chooseArr.splice(n, 1);
      } else {
          chooseArr.push(index);
      };
    _this.setData({
        ifChoosed: chooseArr
    });
  },
  /**
   * 原因赋值
   */
  cancleTextAreaEvent:function(e){
    var _this=this;
    var reason=e.detail.value,
        cursor=e.detail.cursor;
    _this.setData({
      reason:reason,
      reasonTextLength:cursor
    })
  },
  /**
   * 确认取消委托
   */
  confirmCancleEvent:function(e){
    var _this=this;
    wx.showLoading({
      title: '提交中',
      mask:true
    });
    
    if((!_this.data.reason) && (_this.data.ifChoosed.length==0)){
    	wx.showToast({
        title:"请选填原因!",
        image:'../../images/warning.png',
        duration: 2000
      })
    	return;
    }
    wx.request({
      url: app.buildRequestUrl('cancelVipQueue'),
      data:{
        cityId:_this.data.cancelCityId,
        caseId:_this.data.cancelCaseId,
        caseType:_this.data.cancelCaseType,
        wxId: _this.data.wxId,
        reasonTag:_this.data.ifChoosed.join(","),
        reason:_this.data.reason,
        isVip:_this.data.isVip,
        isHezu:_this.data.isHezu?_this.data.isHezu:0
      },
      success:function(res){
    	  wx.hideLoading();
        if(res.data.STATUS==1){
          wx.hideLoading();
          wx.showToast({
            title:res.data.INFO,
            icon: 'success',
            duration: 2000
          })
          //关闭弹窗
          _this.cancelBrokerEvent();
          //重新请求数据
          _this.requestList(_this.data.pageNum);
        }else{
        	wx.showToast({
	            title:res.data.INFO,
	            image:'../../images/warning.png',
	            duration: 2000
	          })
        }
      }
    })
  },
  /**
   * 原因弹框隐藏
   */
  cancelBrokerEvent:function(e){
    var _this=this;
    _this.setData({
      refuseBrokerBox:false,
      reason:'',
      ifChoosed:[],
      cancelCityId:'',
      cancelCaseId:'',
      cancelCaseType:'',
      flowVipCaseId:"",
      isHezu:'',
      isVip:''
    })
  },
  /**
   * 再次推送
   */
  againPushEvent:function(e){
    var _this=this;
    var data={
      caseId:_this.data.cancelCaseId,
      caseType:_this.data.cancelCaseType,
      wxId: _this.data.wxId,
      cityId:_this.data.cancelCityId
    };
    this.hideSelectItems();
    wx.request({
      url:app.buildRequestUrl('sendMore'),
      data:data,
      success:function(res){
        if(res.data.STATUS==1){
          wx.showToast({
            title: '推送成功',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            requestForRentShow:false,
            rentOutShow:false
          })
        }else{
            wx.showToast({
            title: '推送成功',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            requestForRentShow:false,
            rentOutShow:false
          })
        }
      }
    })
  },
  /**
   * 委托编辑
   */
  entrustEdit:function(e){
    var _this=this;
    
    if(_this.data.cancelCaseType==1){
      var vipCaseId=_this.data.redirectVipCaseId,
          cityId = _this.data.cityId,
          pushLogId='',
          caseType=_this.data.cancelCaseType,
          brokerArchiveId='';
          wx.navigateTo({
            url: '/pages/registration/registration?isEdit=1&caseType=' + caseType + '&vipCaseId=' + vipCaseId + '&brokerArchiveId=' + brokerArchiveId + '&pushLogId=' + pushLogId + '&cityId=' + cityId,
          })
    }else if(_this.data.cancelCaseType==2){
    var vipCaseId = _this.data.redirectVipCaseId,
      pushLogId = '',
      cityId = _this.data.cityId,
      isHezu = _this.data.isHezu,
      caseType = _this.data.cancelCaseType,
      brokerArchiveId = '';
       wx.navigateTo({
         url: '/pages/registration/registration?isEdit=1&isHezu='+isHezu+'&caseType=' + caseType + '&vipCaseId=' + vipCaseId + '&brokerArchiveId=' + brokerArchiveId + '&pushLogId=' + pushLogId + '&cityId=' + cityId,
      })
    }
    this.hideSelectItems();
  },
  /**
   * 投诉弹框消失
   */
  grievanceBompCancel:function(e){
    var _this=this;
    _this.setData({
      prizeTrustShow:false,
      grievanceBomp:false
    })
  },
  /**
   * 去详情页面
   */
  goHouseDetail:function(e){
    var _this=this;
    //  <!--caseId: 7382681, caseType: 1, cityId: 1, reSource: 1 -->
    var caseId=e.currentTarget.dataset.caseid,
        caseType=e.currentTarget.dataset.casetype,
        reSource=e.currentTarget.dataset.resource,
        status=e.currentTarget.dataset.status,
        cityId = e.currentTarget.dataset.cityid;
        if(status==0){
          return;
        }else{
          wx.navigateTo({
            url: '/pages/delegateHouseDetail/delegateHouseDetail?cityId=' + cityId+'&caseType='+caseType+'&reSource=4'+'&caseId='+caseId,
        })
        }
  },
  /**
   * 抢单页面
   */
  goGrabDetail:function(e){
    var _this=this;
    var caseId=e.currentTarget.dataset.caseid,
        caseType=e.currentTarget.dataset.casetype,
        heZuNum = e.currentTarget.dataset.hezunum;
    if (caseType == 2){
      if (!!heZuNum && heZuNum != 1) {
        wx.navigateTo({
          url: '/pages/entrustAgent/entrustAgent?times=1' + '&caseId=' + caseId + '&caseType=' + caseType
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/entrustAgent/entrustAgent?times=1' + '&caseId=' + caseId + '&caseType=' + caseType
      })
    }
    
    
  },
  /**
   * 去委托详情
   */
  goEntustDetail:function(e){
      var _this=this;
      var pushLogId=e.currentTarget.dataset.pushlogid;
      var rewardType=e.currentTarget.dataset.rewardtype;
      var caseType=e.currentTarget.dataset.casetype;
      var pushStatus = e.currentTarget.dataset.pushstatus;
      if (pushStatus == 0) return //经纪人已拒绝不能进入详情页
       wx.request({
         url:app.buildRequestUrl('updateHouseRedFlag'),
         data:{pushLogId:pushLogId},
         success:function(e){
           
         }
       })
      if(caseType==1 || caseType==2){
        wx.navigateTo({
          url:'/pages/prizeTrustDetail/prizeTrustDetail?pushLogId='+pushLogId
        })
      }else{
        wx.navigateTo({
          url:'/pages/entrustDetail/entrustDetail?pushLogId='+pushLogId
        })
      }
  },
  /**
   * 首页
   */
  indexBtnEvent:function(){
    wx.reLaunch({
      url:'/pages/real_index/index'
    })
  },
  initIm: function(){
    let _this = this;
    nim = imSdk.getInstance({
      debug: false,
      appKey: app.globalData.appKey,
      account: 'uu_'+wx.getStorageSync("userId"),
      token: app.globalData.imUserInfo.token,
      onconnect: _this.onConnect,
      ondisconnect: _this.onDisconnect,
      onmsg: _this.onMsg,
      onerror: _this.onError,
      onsysmsg: _this.onSysmsg,
      oncustomsysmsg: _this.onCustomSysMsg,
      onupdatesession: _this.onUpdateSession,
    })
  },
  onUpdateSession: function (session) {
    var _this = this;
    _this.updateSessionsUI(session);
  },
  //刷新界面
  updateSessionsUI: function (session) {
    let _this = this;
    let keyName = 'contract_list';
    let id = session.id;
    //当前聊天人的最后一条会话
    var listValue = _this.data.listValue;
    var todayStartTime = new Date(new Date().setHours(0, 0, 0, 0));//今天凌晨开始时间戳
    //循环查询委托信息，修改未读消息数
    for (var i in listValue){
      for (var a in listValue[i]['entrustUsers']) {
        if (session.lastMsg.from.indexOf('uu_') != -1){
          return
        }  

        if ('p2p-' + listValue[i]['entrustUsers'][a].brokerArchiveId == session.id) {
          var sendTime = session.updateTime;
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

          //判断消息类型
          switch (session.lastMsg.type) {
            case 'text':
              var lastMsg = session.lastMsg.text;
              break;
            case 'audio':
              var lastMsg = '发来一段语音';
              break;
            case 'image':
              var lastMsg = '发来一张图片';
              break;
            case 'custom':
              var lastMsg = '发来一个位置';
              break;
            default:
              var lastMsg = '发来一个自定义消息'
          }
          listValue[i]['entrustUsers'][a]['unreadMsgNum'] = session.unread;
          listValue[i]['entrustUsers'][a]['unreadMsg'] = lastMsg;
          listValue[i]['entrustUsers'][a]['unreadMsgTime'] = sendTime;
        }
      }
    }

    _this.setData({
      listValue: listValue
    })

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
    _im.updateSessionsUI(session);
  },
  defaultImg: function (ev) {
    //需要访问当前页面的数据对象传递到其它页面上
    var _that = this;
    common.errImgFun(ev, _that, 'avatar');
  },
  //收到消息，所有推送消息在这里处理
  onMsg: function(msg){
    var json = JSON.parse(msg.content);
    if(json.msg == 'refresh'){
        var _this=this;
        _this.setData({pageNum:1});
        _this.requestList(_this.data.pageNum);
        _this.setData({
          publishEntrustShow:false,
          rentOutShow:false,
          refuseBrokerBox:false
        })
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
  onSysmsg: function (sysMsg) {
    console.log('收到系统通知', sysMsg)
  },
  onCustomSysMsg: function (sysMsg) {
    console.log('收到系统通知', sysMsg)
    var json = JSON.parse(sysMsg.content);
    if (json.msg == 'refresh') {
      var _this = this;
      _this.setData({ pageNum: 1 });
      _this.requestList(_this.data.pageNum);
      _this.setData({
        publishEntrustShow: false,
        rentOutShow: false,
        refuseBrokerBox: false
      })
    }
  },
  //切换展示超过5个的 抢单委托
  showAllEntrustUsers:function(e){
    let index = e.currentTarget.dataset.index;
    console.log(e);
    console.log(index);
    let listValue = this.data.listValue;
    listValue[index]['showAllEntrustUsers'] = !listValue[index]['showAllEntrustUsers'];
    this.setData({listValue:listValue});
  },
  hideSelectItems:function(){
	  this.setData({rentOutShow:false,requestForRentShow:false});
  },
  // 进入最近委托列表
  goToNewsRecentList:function(e){
    let cityId = e.currentTarget.dataset.cityid;
    let caseType = e.currentTarget.dataset.casetype;
    let caseId = e.currentTarget.dataset.caseid;
    wx.navigateTo({
      url:'/pages/newsRecent/newsRecent?caseId='+caseId+'&caseType='+caseType+'&dataCityId='+cityId
    })
  },
  //提示切换城市
  changeCityTip:function(){
	  console.log('changeCityTip');
    var that = this;
    if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
      if (!!wx.getStorageSync('locateCityName')) {
        //显示切换城市弹框
        this.setData({ toastHide: false });
      } else {
        app.getLocationAgain();
      }
      return;
    }
  },
  //跳转到经纪人聊天页面
  imContact: function (e) {
    var that = this;
    var archiveId = e.currentTarget.dataset.archive;
    if (!!archiveId) {
      var url = "/pages/im/im?to=" + archiveId;
      //清除红点，全局未读消息数
      var unreadMsg = wx.getStorageSync('unreadMsg');
      unreadMsg = common.removeUnreadNum('', archiveId);
      wx.navigateTo({
        url: url
      })
    }
  }
})
