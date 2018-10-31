
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var wxMarkerData = [];
Page({
  data: {
    height: 'auto',
    markers: [],
    latitude: '',
    longitude: '',
    mapObj: null,
    type: '公交',
    buildName: '',
    myLat: '',
    myLong: '',
    typeList: {
      '公交': { typeId: 'bus', typeName: '公交' },
      '地铁': { typeId: 'subway', typeName: '地铁' },
      '学校': { typeId: 'school', typeName: '学校' },
      '医院': { typeId: 'hospital', typeName: '医院' },
      '银行': { typeId: 'bank', typeName: '银行' },
      '休闲娱乐': { typeId: 'leisure', typeName: '休闲娱乐' },
      '购物': { typeId: 'shopping', typeName: '购物' },
      '餐饮': { typeId: 'food', typeName: '餐饮' },
      '运动健身': { typeId: 'sports', typeName: '运动健身' },
    }
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      buildName: !!options.buildname ? options.buildname : '',
      lat: !!options.lat ? options.lat : '30.638550',
      long: !!options.long ? options.long : '104.005240',
    });
    //实例化腾讯地图
    qqmapsdk = new QQMapWX({
      key: 'QFXBZ-XEB3U-KP4VK-45SRK-5IJXV-HUFML'
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 20,
          mapObj: qqmapsdk,
          buildName: that.data.buildName
        });
      }
    });


    //楼盘位置
    that.setData({
      markers: [{
        iconPath: "../../images/map/icon_mylocation.png",
        latitude: that.data.lat,
        longitude: that.data.long,
        width: 20,
        height: 25,
        callout: {
          content: that.data.buildName,
          color: "#ffffff",
          fontSize: 13,
          borderRadius: 5,
          bgColor: "#ff5400",
          padding: 10,
          display: "BYCLICK"
        }
      }],
      latitude: that.data.lat,
      longitude: that.data.long,
      buildName: that.data.buildName,
      myLat: that.data.lat,
      myLong: that.data.long,
    })
    //加载当前选中周边
    if (options.type) {
      this.search('', options.type);
    } else {
      this.search('', '公交');
    }
  },
  //查询当前位置的poi信息
  //官方文档上说可以查询指定位置的周边信息
  //然而当前源码中却存在一个bug导致不能查询指定位置的周边信息
  search: function (e, currentType) {
    var that = this
    //查询失败，直接打印log
    var fail = function (data) {
      console.log(data)
    }
    if (currentType) {
      var type = currentType
    } else {
      var type = e.target.dataset.type ? e.target.dataset.type : e.currentTarget.dataset.type;
    }

    that.setData({
      type: type
    })
    var iconName = 'icon_mylocation';
    var buildName = this.data.buildName;
    var title = '';
    if (type) {
      title = buildName + '周边' + that.data.typeList[type]['typeName'];
      iconName = that.data.typeList[type]['typeId'] + '-icon';

      wx.setNavigationBarTitle({
        title: title
      })
    }

    //查询成功后将结果数据动态绑定到页面上
    var success = function (data) {
      wxMarkerData = data.data;
      var markers = [];
      var resMarker = [];
      for (var i = wxMarkerData.length - 1; i >= 0; i--) {
        var item = {
          iconPath: "../../images/map/" + iconName + ".png",
          latitude: wxMarkerData[i].location.lat,
          longitude: wxMarkerData[i].location.lng,
          width: 22,
          height: 31,
          callout: {
            content: wxMarkerData[i].title,
            color: "#ffffff",
            fontSize: 12,
            borderRadius: 5,
            bgColor: "#4daaf0",
            padding: 5,
            display: "BYCLICK"
          }
        }
        var address = {
          title: wxMarkerData[i].title,
          address: wxMarkerData[i].address
        };
        resMarker.push(address);
        markers.push(item);
      }
      markers.push({
        iconPath: "../../images/map/redmarker_new.png",
        latitude: that.data.myLat,
        longitude: that.data.myLong,
        width: 22,
        height: 31,
        callout: {
          content: that.data.buildName,
          color: "#ffffff",
          fontSize: 13,
          borderRadius: 5,
          bgColor: "#ff5400",
          padding: 10,
          display: "BYCLICK"
        }
      });
      that.setData({
        markers: markers,
        latitude: that.data.myLat,
        longitude: that.data.myLong,
        resMarkerData: resMarker
      })
    }

    //使用百度api查询周边信息
    //其中使用到了dataset属性
    this.data.mapObj.search({
      keyword: type,
      success: success,
      fail: fail,
      location: that.data.latitude + "," + that.data.longitude,
    })

  }

})