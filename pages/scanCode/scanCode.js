// pages/scanCode/scanCode.js
var app = getApp();
var api = require('../../utils/common.js');
import { Tools } from '../../utils/tools';
const tool = new Tools();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',     //场景页面的值
    pageType:'',  //
    pageUrl:'',   //
    loginCode:'',   //
    openId:'',    //用户的 openId
    userId:'',    //用户的 userId
    cityId:'',    //城市Id
    archiveId:'',    //扫码的经纪人id
  },
  initCityInfo: function (lat,lng){
    let that = this;
    let scene = that.data.scene;
        wx.request({
            url: app.buildRequestUrl('getCityIdByLocation'),
            data: {
                lat: lat,
                lng: lng
            },
            success: function (res) {
              console.log(res);
                wx.setStorageSync('cityId', res.data.DATA.cityId);
                wx.setStorageSync('cityName', res.data.DATA.cityName);
                wx.setStorageSync('locateCityId', res.data.DATA.cityId);
                wx.setStorageSync('locateCityName', res.data.DATA.cityName);
                wx.setStorageSync('locateRegId', res.data.DATA.regId);
                wx.setStorageSync('locateRegName', res.data.DATA.regName);
                app.globalData.cityId = res.data.DATA.cityId;
                app.globalData.cityName = res.data.DATA.cityName;
                app.globalData.locateCityId = res.data.DATA.cityId;
                app.globalData.locateCityName = res.data.DATA.cityName;
                let cityId = res.data.DATA.cityId;
                let cityName = res.data.DATA.cityName;

                that.setData({cityId:cityId});
                //定位成功,则重新获取
                that.wxReportScan(scene,cityId,cityName,lat,lng);
            },
            fail: function () {
                that.wxReportScan(scene)
                console.log('获取城市信息失败');
            }
        });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var scene = options.scene;
    if(!scene){
       //如果没有获取到场景值, 跳转到首页去
      that.backToIndex();return;
    }

    let sceneArr = decodeURIComponent(scene).split("_");

    scene = sceneArr[0];
    let  archiveId = sceneArr.length > 1?sceneArr[1]:'';

    that.setData({
      scene:scene,
      archiveId:archiveId
    });

      //用户登录获取userId和openId
            wx.login({
                    success:function(loginRes){
                      console.log(loginRes)
                      if(loginRes.code){
                        wx.request(
                          {
                            url: app.buildRequestUrl('getSecretInfo')+"?code="+loginRes.code,
                          success: function(res){
                            var json = res.data;
                            if(json.STATUS==1){
                              let openId = json.DATA.openId;
                              let userId = json.DATA.userId;
                              that.setData({openId:openId,userId:userId});
                            }
                          }
                          }
                        );
                      }
                    },
                })

    
    //获取定位
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            that.initCityInfo(latitude, longitude);
        },fail:function(){
          //小程序收集数据 自定义 api接口调用
          that.wxReportScan(scene)

        }
    })

    //根据 场景值 请求 接口返回 对应调整的页面
      wx.request({
		    	data:{scene:scene},
		      url: app.buildRequestUrl("getPageUrl"),
		      success:function(res){
            //根据返回的数据 , 判断是 进入原生 页面 , 还是 内嵌的web-view 网页
            if(res.statusCode == 200){
              var resData = res.data;
              if(resData.status == 1){
                var pageType = resData.data.pageType;
                var pageUrl = resData.data.pageUrl;
                that.setData({
                  pageType:pageType,
                  pageUrl:pageUrl
                });
                //如果是跳转的小程序页面,则直接调整小程序页面
                if(pageType == 'minipage'){
                  if(pageUrl == '/pages/real_index/index' || pageUrl == '/pages/news/news' || pageUrl == '/pages/mine/mine'){
                    wx.switchTab({url:pageUrl});
                  }else{
                    wx.navigateTo({url:pageUrl});
                  }
                }
              }else{
                that.backToIndex();
              }
            }else{
              that.backToIndex();
            }
		      }
		  })

  },
  /**
   * 向小程序记录 扫码授权返回的地址
   */
  wxReportScan:function(scene,cityId,cityName,latitude,longitude){
    cityId = !!cityId?cityId:'';
    cityName = !!cityName?cityName:'';
    latitude = !!latitude?latitude:'';
    longitude = !!longitude?longitude:'';

    let date = new Date();
    let time = date.toLocaleString();

    //记录用户的首次授权的地址
    //判断是否为首次
    var firstScanFlag = wx.getStorageSync('firstScanFlag');
    if(firstScanFlag != 1){
      wx.reportAnalytics('scan_code', {
        scene: scene,
        city_name: cityName,
        city_id: cityId,
        latitude: latitude,
        longitude: longitude,
        create_time: time,
      });
       wx.setStorageSync('firstScanFlag', 1);
    }else{
      console.log('不是第一次扫码授权进入');
    }

    

  },

  /**
   * 返回小程序首页
   */
  backToIndex:function(){
    wx.switchTab({url:'/pages/real_index/index'});
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
  
  }
})