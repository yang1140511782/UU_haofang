var app = getApp();
let imSdk = require('./NIM_Web_NIM_v5.0.0.js');


let nim = '';
function initIm() {
  let _this = this;
  if (app.globalData.accid && app.globalData.accidToken){
    //实例化im
    nim = imSdk.getInstance({
      debug: false,
      db: true,
      syncSessionUnread: true,
      appKey: app.globalData.appKey,
      account: app.globalData.accid,
      token: app.globalData.accidToken,
      onconnect: onConnect,
      // 会话
      onsessions: onSessions,
      onupdatesession: onUpdateSession,
      onerror: onError,
      ondisconnect: onDisconnect,
      // 消息
      onofflinemsgs: onOfflineMsgs,
      onmsg: onMsg,
      // 系统通知
      onsysmsgunread: onSysMsgUnread,
      oncustomsysmsg: onCustomSysMsg,

      // // 同步完成
      onsyncdone: onSyncDone
    })
  }else{
    return false;
  }

  initUnreadMsg();
}
function initUnreadMsg(cb){
  var unreadMsg = wx.getStorageSync('unreadMsg') ? wx.getStorageSync('unreadMsg') : [];
  var unreadNum = 0;
  if(unreadMsg.length > 0){
    for(var i in unreadMsg){
      unreadNum += unreadMsg[i].unread;
    }
  }
  
  wx.setStorageSync('unreadNum', unreadNum);

  //推送到每一个页面
  var pages = getCurrentPages();
  if(pages.length > 0){
      for (var i = pages.length - 1; i >= 0; i--) {
        if(typeof(pages[i].data.unreadNum) != 'undefined'){
          pages[i].setData({
            unreadNum:unreadNum
          })
        }
      }
  }else{
    return false;
  }
  
  setTabBarBadge(unreadNum.toString());
  typeof cb == "function" && cb( unreadNum );
}
function onConnect() {
  console.log('连接成功');
}
function onSessions(sessions) {
  console.log('收到会话列表', sessions);
  // data.sessions = nim.mergeSessions(data.sessions, sessions);
  updateSessionsUI(sessions);
}
function onUpdateSession(session) {
  console.log('会话更新了', session);
  updateSessionsUI(session);
}
function onError(error) {
  console.log(error);
}
function onDisconnect(error) {
  // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
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
}
function onOfflineMsgs(obj) {
  console.log('离线消息', obj);
  // pushMsg(obj.msgs);
}
function onMsg(msg) {
  console.log('收到消息', msg.scene, msg.type, msg);
  // pushMsg(msg);
}
function onSysMsgUnread(obj) {
  console.log('收到系统通知未读数', obj);
  // data.sysMsgUnread = obj;
  // refreshSysMsgsUI();
}
function onCustomSysMsg(sysMsg) {
  console.log('收到自定义系统通知', sysMsg);
}
function onSyncDone() {
  console.log('同步完成');
}
//移出一个未读消息数据            
function removeUnreadNum(arr, accid) {
  var unreadNum = wx.getStorageSync('unreadNum') ? parseInt(wx.getStorageSync('unreadNum')) : 0;

  if (arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      console.log(typeof arr[i].unread);

      if (arr[i].to == accid) {
        unreadNum -= arr[i].unread;
        arr.splice(i, 1);
      }
    }
  }

  wx.getStorageSync('unreadNum', unreadNum);

  setTabBarBadge(unreadNum);
  return arr;
}
//更新数据及样式
function updateSessionsUI(session){
  var unreadMsg = wx.getStorageSync('unreadMsg') ? wx.getStorageSync('unreadMsg') : [];
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1].route;

  /**
   * 当前页面在im页面
   * 如果当前聊天对象发送的消息不进入未读消息
   */
  if(app.globalData.chatTo == session.to && currentPage == 'pages/im/im'){
    return false;
  }
  console.log(session);
  if (isArray(session)){
    for(var i=0; i<session.length; i++){
      removeUnreadNum(unreadMsg, session[i].to);
      //如果这个人已经有未读数了，先清除再添加
      unreadMsg.push(session[i]);
    }
  }else{
    //如果这个人已经有未读数了，先清除再添加
    removeUnreadNum(unreadMsg, session.to);
    unreadMsg.push(session);
  }

  var unreadNum = 0;
  for(var p in unreadMsg){
    unreadNum += unreadMsg[p].unread;
  }


  if(unreadNum > 0){
    wx.setStorageSync('unreadMsg', unreadMsg);
    wx.setStorageSync('unreadNum', unreadNum);
    setTabBarBadge(unreadNum.toString());
  }

  //给个页面推送同步消息
  pushMsgToPage();

  updateNewsUI(session);
}

function updateNewsUI(session){
    var unreadMsg = wx.getStorageSync('unreadMsg');
    var recentChatList = unique1(app.globalData.recentChatList);
  console.log(session);
    for(var i in recentChatList){
      if (recentChatList[i] != 'undefined' && typeof (recentChatList[i]) != 'undefined' && recentChatList[i].id == session.to){
        recentChatList[i].unread = session.unread;
      }
    }

  console.log(recentChatList);
    app.globalData.recentChatList = recentChatList;
    //获取页面栈
    var newsListPage = getNewsListPage();
    if(!!newsListPage){
      //更新最近聊天人列表
      newsListPage.changeData(app.globalData.recentChatList);
    }
}

  /**
   * 得到聊天列表页面
   * 在调用该页面方法，刷新数据
   * @return {[type]} [description]
   */
  function getNewsListPage(){
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
  }

function pushMsgToPage(){
   var pages = getCurrentPages();
  if(pages.length > 0){
      for (var i = pages.length - 1; i >= 0; i--) {
        if(typeof(pages[i].hintUnread) != 'undefined'){
          pages[i].hintUnread();
        }
      }
    }else{
      return false;
    }
}

//消息气泡上面未读数显示
function setTabBarBadge(num) {
  if (num <= 0) {
    removeTabBarBadge();
    return true;
  }
  if (num > 99) {
    num = '99+';
  }

  num = num.toString();
  wx.setTabBarBadge({
    index: 1,
    text: num
  })
}
//移出红点提示
function removeTabBarBadge(){
  wx.removeTabBarBadge({
    index: 1
  })
}
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
function unique1(arr) {
  var tmpArr = [];
  for (var i = 0; i < arr.length; i++) {
    //如果当前数组的第i已经保存进了临时数组，那么跳过，
    //否则把当前项push到临时数组里面
    if (arr[i] != 'undefined' && tmpArr.indexOf(arr[i]) == -1) {
      tmpArr.push(arr[i]);
    }
  }
  return tmpArr;
}
module.exports = {
  initIm: initIm,
  updateSessionsUI: updateSessionsUI,
  setTabBarBadge: setTabBarBadge,
  removeTabBarBadge: removeTabBarBadge
}

