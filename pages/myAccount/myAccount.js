var app = getApp();
var api = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    online: 'https://uuweb.haofang.net/Mini/App/',
    currentTab:0,        //swiper当前显示页
    pTitle:"委托意向金",
    noDataPrice:false,
    earnestMoney:[],     //意向金
    pTitleTypeInfo:'',   //意向金描述
    payPaidTotal:0,//意向金总额
    taxiMoney:[],//打车押金
    taxiTitleTypeInfo:'',   //打车押金描述
    taxiPaidTotal:0,//打车押金总额
    RedPacket:[],//优惠券
    noDataCou:false,//优惠券无数据
    noDataCar:false,
    noDataPrice:false,
    RedPacketTotal:0,//优惠券总张数
    tickPageNums:1,//优惠券页数
    tickPageTotal: "",//优惠券z总页数
    ajaxListTag:true,//
    collectTxt:'',//提示弹框内容
    collectToast:false,//提示弹框
    //有奖委托奖励金
    rewardMoney:[],     //委托奖励金
    rewardMoneyTotal:0,     //委托奖励金总额
    rewardMoneyInfo:'',   //委托奖励金描述
    noDataReward:false,   //委托奖励金 无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('userId','25052') //测试用
    app.checkLogin();//登录验证

    var that = this;
    that.getEarnestMoneyInit();
    that.RedPacketInit();  
    that.getPayPaidInit();//打车押金初始化
    that.getRewardMoneyInit();//委托奖励金初始化
  },
   /**
   * 退押金
   */
  returnDeposit:function(){
    wx.showToast({
      title: '请下载优优好房App进行押金退还',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 优惠券初始化
   */
  RedPacketInit: function (blooean){
    var that = this;
    var curPage = that.data.tickPageNums;
    if (blooean) {
      that.setData({
        ajaxListTag: false
      });

    }
    wx.request({
       url: app.buildRequestUrl('getRedPacketList'),
      // url: 'http://uuweb.hftsoft.com/Mini/App/getRedPacketList',
      data:{
        youyouUserId: wx.getStorageSync('userId'),
        pageNum: curPage
      },
      success: function (res) {
        var _arr = that.data.RedPacket;
        if (!!res.data) {
          var _data = res.data;
          if (_data.STATUS == 1) {
            that.setData({
              RedPacketTotal: _data.DATA.redNum ? _data.DATA.redNum:0
            });
            _arr = _arr.concat(_data.DATA.list);
            _arr = that.formateData(_arr);
            //当无优惠券数据的时候
            if (!_arr || _arr.length ==0){
                that.setData({
                  noDataCou:true
                })
            }else{
              //有优惠券数据的时候
              that.setData({
                RedPacket: _arr,
                ajaxListTag:true
              })
            }
            
          }
        }else{
          that.setData({
            noDataCou: true
          })
        }
      },
      fail: function () {
          console.log("请求失败！")
      },
    })
  },
  /**
   * 打车押金初始化
   */
  getPayPaidInit:function(){
    var that = this;
    wx.request({
      // url:  + "?customerId=" + app.globalData.userId + "&pageNum=1&callSource=0&cityId=" + app.globalData.cityId,
     url: app.buildRequestUrl('getAcountList') + "?youyouUserId=" + wx.getStorageSync('userId') + "&pageNum=1&type=1",
      // url: "http://lbuuweb.hftsoft.com/Mini/App/getAcountList?youyouUserId=" + wx.getStorageSync('userId') + "&pageNum=1&type=1",
      success: function (res) {
        console.log(res)
        if (!!res.data) {
          var _data = res.data;
          if (_data.STATUS==1){
            //设置打车押金总额
            that.setData({
              taxiPaidTotal: _data.DATA.totalMoney
            })
            if(!_data.DATA.typeInfo){
              that.setData({
                 taxiTitleTypeInfo:'充值押金可享受免费专车看房服务，可原路退回',
              })
            }else{
              that.setData({
                 taxiTitleTypeInfo: _data.DATA.typeInfo
              })
            }
            var _listP = _data.DATA.list;
            //当无打车押金数据的时候
            if (!_listP || _listP.length == 0) {
              that.setData({
                noDataCar: true
              })
            } else {
              //有打车押金数据的时候
              that.setData({
                taxiMoney: _listP
              })
            }
          }
          else{
            that.setData({
              noDataCar: true
            })
          }
          console.log(res.data)
        }
      },
      fail: function () {
        
        console.log("请求失败！")
      },
    })
  },
  /**
 * 意向金初始化
 */
  getEarnestMoneyInit: function () {
    var that = this;
    wx.request({
      // url: app.buildRequestUrl('getAcountList') + "?youyouUserId=16918&pageNum=1&type=0",
      url: app.buildRequestUrl('getAcountList') + "?youyouUserId=" + wx.getStorageSync('userId') + "&pageNum=1&type=0",
      success: function (res) {
        console.log(res)
        if (!!res.data) {
          var _data = res.data;
          if (_data.STATUS == 1) {
            //设置意向金总额
            that.setData({
              payPaidTotal: _data.DATA.totalMoney,
             
            })
            if(!_data.DATA.typeInfo){
              that.setData({
                 pTitleTypeInfo:'取消委托后,意向金会自动原路返还到您的充值账户',
              })
            }else{
              that.setData({
                 pTitleTypeInfo: _data.DATA.typeInfo
              })
            }
            var _listP = _data.DATA.list;
            //当无意向金数据的时候
            if (!_listP || _listP.length == 0) {
              that.setData({
                noDataPrice: true
              })
            } else {
              //有意向金数据的时候
              that.setData({
                earnestMoney: _listP
              })
            }
          }
          else {
            that.setData({
              noDataPrice: true
            })
          }
          console.log(res.data)
        }
      },
      fail: function () {

        console.log("请求失败！")
      },
    })
  },
  /**
   * 委托奖励金初始化
   */
  getRewardMoneyInit:function(){
    var that = this;
    wx.request({
      url: app.buildRequestUrl('getAcountList') + "?youyouUserId=" + wx.getStorageSync('userId') + "&pageNum=1&type=2",
      success: function (res) {
        console.log(res)
        if (!!res.data) {
          var _data = res.data;
          if (_data.STATUS==1){
            //设置委托奖励金总额 及 委托奖励金描述
            that.setData({
              rewardMoneyTotal: _data.DATA.totalMoney,
              rewardMoneyInfo: _data.DATA.typeInfo|| '',
            })
            
            var _listP = _data.DATA.list;
            //当 委托奖励金 数据的时候
            if (!_listP || _listP.length == 0) {
              that.setData({
                noDataReward: true
              })
            } else {
              //有打车押金数据的时候
              that.setData({
                rewardMoney: _listP
              })
            }
          }
          else{
            that.setData({
              noDataReward: true
            })
          }
        }
      },
      fail: function () {
        console.log("请求失败！")
      },
    })
  },

  /**
   * 委托奖励金 提现
   */
  rewardBtn: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;

    wx.request({
      url: app.buildRequestUrl('getReWardMoney'),
      data:{
        youyouUserId: wx.getStorageSync('userId'),
        getMoney:money,
        cityId: wx.getStorageSync('cityId'),
        vipqueueId: id,
      },
      success: function (res) {
        console.log(res)
        if (!!res.data) {
          var _data = res.data;
          if (_data.STATUS==1){
            //修改当前 的 奖励金状态为审核中
            wx.showToast({ title: _data.INFO, icon: 'none' });
            that.getRewardMoneyInit();//委托奖励金初始化
          }else{
            wx.showToast({ title: _data.INFO, icon: 'none' });
          }
        }
      },complete:function(){

      }
    })
  },

  onReady: function() {

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
  
  },
  /**
   * tab切换
   */
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  /**
   * swiper切换变换nav
   */
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  /*
  *优惠券加载更多
  */
  loadMore:function(){
    console.log('in');
    if (this.data.ajaxListTag){
      var _page = this.data.tickPageNums
      _page += 1;
      this.setData({
        tickPageNums: _page
      })
    }
    this.RedPacketInit(true);
  },
  /*
  * 使用优惠券(目前只有专属委托优惠券能跳转使用)
  */
  useCoupan:function(e){
    let shareId = e.currentTarget.dataset.shareid;
    let status = e.currentTarget.dataset.status;
    let quanType = e.currentTarget.dataset.type;
    if(quanType == 5 && status == 1 && !!shareId){
      //只有专属委托优惠券能跳转使用 , 并且要有效
      wx.navigateTo({
        url:'/pages/entrustBrokerCoupon/entrustBrokerCoupon?shareId='+shareId +'&showCoupon=0'
      })
    }
  },
  /**
   * 格式化数据
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  formateData:function(data){
    if(!!data && data.length){
      for(var i in data){
        data[i].quanMoney = data[i].quanMoney.replace(",", '');
      }
    }
    return data;
  },
  /**
   * 跳转到优惠券展示
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  couponDisplay:function(e){
    var couponId = e.currentTarget.dataset.couponid;
    var quanType = e.currentTarget.dataset.type;
    var caseType = e.currentTarget.dataset.casetype;
    var shareArchiveId = e.currentTarget.dataset.shareid;
    var receiveId = e.currentTarget.dataset.receiveid;

    //如果是 专属委托优惠券
    if (quanType == 5) {
      wx.navigateTo({
        url: '/pages/couponDisplay/couponDisplay?couponId=' + couponId + '&shareArchiveId=' + shareArchiveId+'&receiveId='+receiveId
      })
    } else if (quanType == 6) {
      //如果是 购房补贴 则跳转进入发布委托
      wx.navigateTo({
        url: '/pages/entrust/entrust?caseType=' + caseType
      })
    }
    
  }

  
})