//获取应用实例
var app = getApp();
var api = require('../../utils/common.js');

Page({
  data: {
    getBrokerActionUrl:app.buildRequestUrl('getBrokerAction'),//请求推送经纪人
    lotteryActionUrl:app.buildRequestUrl('lotteryAction'),// 砸蛋
    cityId:"",
    caseId:'',
    wxId:"",
    caseType:'',
    remainTimes:'',//砸蛋剩余次数
    remainShow:true,//砸蛋部分显示隐藏
    list:"",//
    loadTimes:0,//判断是否是第一次进页面，大于0就是再次进入
    agentNums:0,
    dotAnData: {},
    headImga:[],
    headImgb: [],
    headImgc: [],
    headImgd: [],
    headImge: [],
    // bgHidden:true,//外层盒子显示隐藏
    toastMask:false,//弹框遮罩层
    acti:0,//砸蛋初始
    cursor:3,//锤子初始
    chanceNum:1,//抽奖次数
    winnStatus:false,//没次数
    gameRules:false,//游戏规则
    winningTips:'',//中奖提示
    cashStatus:true,//现金卷中奖
    noWinStatus:false,//未中奖
    cashStatusd:"sale",//买房现金卷
    noNums: false,//没次数,
    amBox:false,//转圈动画

    indicatorDots: false,
    circular:true,
    vertical:true,
    autoplayArr:{
      1: { autoplay: true, url: '', agentPicStatus: false},
    2: { autoplay: true, url: '',agentPicStatus:false},
    3: { autoplay: true, url: '',agentPicStatus:false},
    4: { autoplay: true, url: '',agentPicStatus:false},
    5: { autoplay: true, url: '',agentPicStatus:false},
    },//经纪人推送接单情况

    interval: 500,
    duration: 100,
    animation: '',//动画定义
  },
  onReady: function () {
    // 页面渲染完成
    //实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 1000,
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 30,
      transformOrigin: 'right bottom 0',
      success: function (res) {
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    var _this = this;
    var caseType = options.caseType ? options.caseType : ''; 
    var caseId = options.caseType?options.caseId:'';
    var _times = options.times;
    this.setData({
      cityId: app.globalData.cityId,
      wxId: wx.getStorageSync('userId'),
      caseType:caseType,
      caseId:caseId,
      loadTimes: _times
    });
    //请求获取获取 页面情况
    var sendData = {
      cityId:this.data.cityId,
      caseId:this.data.caseId,
      wxId:this.data.wxId,//24828
      caseType:this.data.caseType,
    };
    api.getList(this.data.getBrokerActionUrl, sendData).then(res => {
       if(res.STATUS != 1)return;
        var data = res.DATA;//页面数据
        var list = data.list;
        var _times = _this.data.loadTimes;
        console.log(_times)
        _this.setData({
          remainTimes: data.remainTimes //剩余砸蛋数
        })
        if (!_times || _times==0){
          this.numsAdd(true);//经济人推送数量增加
          if (!list || list.length == 0) {
            _this.setData({
              list: 0,
            })
            return
          } else {
            list.forEach(function (item, index) {
              _this.stopAgentPic(index + 1, item.userPhoto)
            });
          } 
        }else{
          _this.setData({
            amBox:true
          })
          if (!list || list.length == 0) {
            for (var i = 0; i < 5; i++) {
              _this.stopAgentPic(i + 1,"http://cdn.haofang.net/static/uuminiapp/mine/fang_default.png")
            }
            return
          } else {
            list.forEach(function (item, index) {
              _this.stopAgentPic(index + 1, item.userPhoto)
            });
          }
        }
         
      //隐藏砸蛋部分 
      if (data.remainTimes == 0 && _times>0){
          _this.setData({
            remainShow:false
          })
      }
    });


    
    // this.drawCircle();
    var that = this;
    var i = 0
    //设置动画
    var dotAnData = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear', 
      delay: 0,
      transformOrigin: '50% 50% 0',
    })
    //创建转圈动画
    var dotAnFun = setInterval(function () {
      dotAnData.rotate(20 * (++i)).step()
      that.setData({
        dotAnData: dotAnData.export()
      })
    }.bind(that), 1000)

    this.agentImgUrl(); 
  },
  /*
  *接单经纪人显示
  */
  stopAgentPic:function(index,url){
    var _this = this;
    var autoplayArr = _this.data.autoplayArr;
    autoplayArr[index]['autoplay'] = false;
    autoplayArr[index]['agentPicStatus'] = true;
    autoplayArr[index]['url'] = url;
    
    _this.setData({autoplayArr: autoplayArr})
  },
  /*
  *再次推送经纪人转动
  */
  startAgentPic: function (index) {
    var _this = this;
    var autoplayArr = _this.data.autoplayArr;
    autoplayArr[index]['autoplay'] = true;
    autoplayArr[index]['agentPicStatus'] = false;
    _this.setData({ autoplayArr: autoplayArr })
  },
  /*经纪人头像随机产生*/
  agentImgUrl:function(){
    var arr = [];
    for (var i = 1; i <= 50; i++) {
      arr.push(i);
    }
    var _arr = [];
    while (_arr.length < 50) {
      var n = Math.floor(Math.random() * arr.length);
      _arr.push(arr.splice(n, 1)[0]);
    }
    /*定义五列经纪人头像数组*/
    var picTxa = _arr.slice(0, 10).concat(_arr.slice(0, 1)),
      picTxb = _arr.slice(10, 20).concat(_arr.slice(10, 11)),
      picTxc = _arr.slice(20, 30).concat(_arr.slice(20, 21)),
      picTxd = _arr.slice(30, 40).concat(_arr.slice(30, 31)),
      picTxe = _arr.slice(40, 50).concat(_arr.slice(40, 41));
    this.setData({
      headImga: picTxa,
      headImgb: picTxb,
      headImgc: picTxc,
      headImgd: picTxd,
      headImge: picTxe,
    })
  },
  /*
  *经纪人推送数量
  */
  numsAdd:function(status){
    if (status){
      var _this = this
      var agentNums = 0;
      var interNum = setInterval(function () {
        agentNums++;
        _this.setData({
          agentNums: agentNums,
        })
      }, 500)
    }else{
      return
    }
    
  },
  /*
  *点击关闭弹框
  */
  closeToastBtn:function(){
      this.setData({
        toastMask:false,
        bgHidden: true
      })
  },
  /*
  *砸蛋
  */
  smashEggs:function(e){
    var _this = this;
    var _chanceNum = _this.data.chanceNum;
    
    var remainTimes = _this.data.remainTimes;

    _this.animation.rotate(-20).step()
    _this.setData({
      //输出动画
      animation: _this.animation.export()
    })

    if (remainTimes==0){
      setTimeout(function () {
        _this.setData({
          winningTips: "您的抽奖次数已用完！",
          toastMask: true,
          noNums: true,
          winnStatus: true,
          gameRules: false,
          cashStatus: false,
          noWinStatus:false
        });
      }, 1000);

      return
    }else{
      var _currt = e.currentTarget.dataset.idx;
      //砸蛋请求
      //请求获取获取 页面情况
      var sendData = {
        cityId:_this.data.cityId,
        caseId:_this.data.caseId,
         wxId:_this.data.wxId,
        caseType:_this.data.caseType,
      };
      api.getList(_this.data.lotteryActionUrl, sendData).then(res => {
        if(res.STATUS != 1)return;
         var data = res.DATA;//页面数据

         _this.setData({
          remainTimes:data.remainTimes //剩余砸蛋数
        })

         if (data.type == 4) {
           //未中奖
           setTimeout(function () {
             _this.setData({
               winningTips: "很遗憾，您未砸中奖品！",
               noWinStatus: true,
               toastMask: true,
               noNums: false,
               winnStatus: true,
               gameRules: false,
               cashStatus: false
             });
           }, 1000);
         } else if (data.type == 3){
           //中奖了
           var _status = this.data.caseType;
           if (_status == 3){
             this.setData({
               cashStatusd:"sale"
             }) 
           }else{
             this.setData({
               cashStatusd: "lease"
             })
           }
           setTimeout(function () {
             _this.setData({
               winningTips: "哇，恭喜您获得",
               toastMask: true,
               winnStatus: true,
               gameRules: false 
             });
           }, 1000);
         }
         console.log(res);
      });
      _this.setData({
        acti: _currt,
        cursor: _currt
      })
      //中奖
      
    }
  },
  /*
  *查看游戏规则
  */
  seeRuleBtn:function(){
    this.setData({
      toastMask: true,
      gameRules:true,
      noChance: false
    })
  },
  /*
  *点击完成
  */
  completeBtn:function(){
    wx.reLaunch({
      url: '/pages/trustList/trustList?caseType='+this.data.caseType,
    })
  },
  /*
  *再次推送
  */
  pushAgainBtn:function(){
    var _this = this;
    for(var i=0;i<5;i++){
      _this.startAgentPic(i + 1)
    }
    _this.setData({
      amBox:false
    })
    this.numsAdd(true);//经济人推送数量增加
  }
})