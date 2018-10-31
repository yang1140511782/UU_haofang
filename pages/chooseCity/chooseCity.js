// pages/chooseCity/chooseCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    varterList: [],    //字母列表
    dataList: [],      //城市数据 
    winHeight: '',      //窗口高度
    toView: '',
    locatCityAnimateFlag: false,  //旋转 动画标志
    url: 'https://uuweb.haofang.net/Mini/App/cityList',
    locateCityName:'定位中...',
    hotList: [
      { CITY_ID: "7", C_CITY_NAME: "北京" },
      { CITY_ID: "8", C_CITY_NAME: "上海" },
      { CITY_ID: "12", C_CITY_NAME: "广州" },
      { CITY_ID: "11", C_CITY_NAME: "深圳" },
      { CITY_ID: "1", C_CITY_NAME: "成都" },
      { CITY_ID: "10", C_CITY_NAME: "杭州" },
      { CITY_ID: "83", C_CITY_NAME: "南京" },
      { CITY_ID: "369", C_CITY_NAME: "天津" },
      { CITY_ID: "176", C_CITY_NAME: "武汉" },
      { CITY_ID: "307", C_CITY_NAME: "西安" },
      { CITY_ID: "9", C_CITY_NAME: "重庆" },
      { CITY_ID: "48", C_CITY_NAME: "大连" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
//    that.setData({locateCityName:c,locateCityId:d});
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var latitude = res.latitude
            var longitude = res.longitude
            that.initCityInfo(latitude, longitude);
        },fail:function(){
        	that.setData({locatCityAnimateFlag:false,locateCityName:''});
        }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    //请求城市列表数据
    that.getCityList();
  },

  /**
   * 请求城市列表数据
   */
  getCityList(){
    var that = this;
    var citySto = wx.getStorageSync('cityList');
    if (!!citySto) {
      var data = JSON.parse(citySto);
      var letterArr = [];
      for (var i in data) {
        letterArr.push(i);
      };
      that.setData({
        dataList: data,
        varterList: letterArr
      });
    } else {
      wx.request({
        url: that.data.url,
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.STATUS == 1) {
            var data = res.data.DATA;
            var data_str = JSON.stringify(data);
            wx.setStorageSync("cityList", data_str);
            var letterArr = [];
            for (var i in data) {
              letterArr.push(i);
            };
            that.setData({
              dataList: data,
              varterList: letterArr
            });
          };
        }
      });
    };
  },

  /**
   *  跳到当前字母
   */
  jumpToView(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      toView: id
    });
  },

  /**
   * 选择城市 
   */
  changeCity(e){
    var item = e.currentTarget.dataset.item;
    if(item==undefined){
    	wx.setStorageSync("cityId", this.data.locateCityId);
    	wx.setStorageSync("cityName", this.data.locateCityName);
    }else{
    	wx.setStorageSync("cityId", item.CITY_ID);
    	wx.setStorageSync("cityName", item.C_CITY_NAME);
    }
    wx.removeStorage({
      key: 'searchHistory1',
      success: function (res) {
      }
    })
    wx.removeStorage({
      key: 'searchHistory2',
      success: function (res) {
      }
    })
    wx.removeStorage({
      key: 'searchHistory4',
      success: function (res) {
      }
    })
    wx.removeStorage({
      key: 'searchHistory5',
      success: function (res) {
      }
    })
    wx.reLaunch({
      url: '/pages/real_index/index'
    });
  },
  /**
   * 定位旋转动画
   */
  locatCityAnimate:function(){
    var that = this;
    that.setData({locatCityAnimateFlag:false});
    setTimeout(function(){
      that.setData({locatCityAnimateFlag:true});
    },200)
  },
  initCityInfo: function (lat,lng){
      var that = this;
      wx.request({
          url: 'https://uuweb.haofang.net/Mini/App/getCityIdByLocation',
          data: {
              lat: lat,
              lng: lng
          },
          success: function (res) {
              wx.setStorageSync('cityId', res.data.DATA.cityId);
              wx.setStorageSync('cityName', res.data.DATA.cityName);
              wx.setStorageSync('locateCityId', res.data.DATA.cityId);
              wx.setStorageSync('locateCityName', res.data.DATA.cityName);
              wx.setStorageSync('locateRegId', res.data.DATA.regId);
              wx.setStorageSync('locateRegName', res.data.DATA.regName);
              that.setData({locateCityName:res.data.DATA.cityName,locateCityId:res.data.DATA.cityId});
          },
          fail: function () {
              console.log('获取城市信息失败');
          }
      });
  },
  locate:function(){
	  //定位
	  var that = this;
    that.locatCityAnimate();
	  wx.showModal({
		  title: '',
		  content: '检测到您没打开小程序的定位权限，是否去设置打开',
		  success: function(res) {
		    if (res.confirm) {
		    	 wx.getSetting({
		             success: (res) => {
		                 if (!res.authSetting['scope.userLocation']) {//如果没有定位权限或已拒绝
		                     wx.openSetting({
		                         success: (res) => {
		                       	  
		                         }, complete: function (res) {
		                       	  console.log(res);
		                       	  wx.getLocation({
		                                 type: 'wgs84',
		                                 success: function (res) {
		                                     var lat = res.latitude;
		                                     var lng = res.longitude;
		                                     wx.request({
		                                         url: 'https://uuweb.haofang.net/Mini/App/getCityIdByLocation',
		                                         data: {
		                                             lat: lat,
		                                             lng: lng
		                                         },
		                                         success: function (res) {
		                                             wx.setStorageSync('cityId', res.data.DATA.cityId);
		                                             wx.setStorageSync('cityName', res.data.DATA.cityName);
		                                             wx.setStorageSync('locateCityId', res.data.DATA.cityId);
		                                             wx.setStorageSync('locateCityName', res.data.DATA.cityName);
                                                     wx.setStorageSync('locateRegId', res.data.DATA.regId);
                                                     wx.setStorageSync('locateRegName', res.data.DATA.regName);
		                                             that.setData({locateCityName:res.data.DATA.cityName,locateCityId:res.data.DATA.cityId});
		                                         },
		                                         fail: function () {
		                                             console.log('获取城市信息失败');
		                                         }
		                                     });
		                                 },complete:function(e){
		                               	   console.log(e);
		                                 }
		                             })
		                         }
		                     })
		                 }
		             }
		         })
		    }else if(res.cancel){
		    	wx.setStorageSync('cityId', 1);
                wx.setStorageSync('cityName', '成都');
                wx.reLaunch({
                    url: '/pages/real_index/index'
                  });
		    }
		  }
		})
  }
})