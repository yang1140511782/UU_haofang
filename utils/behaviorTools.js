  class BehaviorTools {
    getCurrPages(that){
      var pages = getCurrentPages();
       if(that && that.route == 'pages/personalStore/personalStore'){
        return 'personalStore';
      }else if(that && that.route == 'pages/houseDetail/houseDetail'){
        return 'houseDetail';
      }else if(that && that.route == 'pages/newHouseDetail/newHouseDetail'){
        return 'newHouseDetail';
      }else{}

      if(pages[pages.length-1].route == 'pages/personalStore/personalStore'){
        return 'personalStore';
      }else if(pages[pages.length-1].route == 'pages/houseDetail/houseDetail'){
        return 'houseDetail';
      }else if(pages[pages.length-1].route == 'pages/newHouseDetail/newHouseDetail'){
        return 'newHouseDetail';
      }else{}
    }
  /**
   * 用户进去微店或者详情的次数
   * @return {[type]} [description]
   */
  getInStoreCount(archiveId, userId, caseId='', caseType='', fn){
    var app = getApp();
    var page = this.getCurrPages();
    if(archiveId && userId){
      wx.request({
          url:app.buildRequestUrl('getInStoreCount'),
          data:{
              archiveId:archiveId,
              caseId:caseId,
              caseType:caseType,
              userId:userId
          },
          success:function(res){
             if(res.data.errCode == 200){
                  if(page == 'personalStore'){
                      var cacheKey = caseId+archiveId+userId+'_inStoreCount';
                  }else if(page == 'houseDetail'){
                      var cacheKey = caseId+archiveId+userId+'_inDetailCount';
                  }else if(page == 'newHouseDetail'){
                      var cacheKey = caseId+archiveId+userId+'_inNewDetailCount';
                  }else{}
      
                  var inStoreCountData = wx.getStorageSync(cacheKey);
                  var data = res.data.data;

                  if(inStoreCountData.inStoreCount > data.inStoreCount){
                      data.inStoreCount = inStoreCountData.inStoreCount;
                  }
                      wx.setStorageSync(cacheKey, data);

                  typeof fn == 'function' && fn(data);
                  
                  return data;
             }
          }
      })
    }else{
      return false
    }
  }
  /**
   * 获取用户行为配置
   * @param  {[type]} behaviorType [description]
   * @return {[type]}              [description]
   */
  getBehaviorConfig(behaviorType='', that=''){
    var app = getApp();
    var _this = this;

    if(!wx.getStorageSync('behaviorConfig')){
        wx.request({
            url:app.buildRequestUrl('getBehaviorConfig'),
            data:{
                behaviorType:behaviorType,
            },
            success:function(res){
                if(res.data.errCode == 200){
                    app.globalData.behaviorConfig = res.data.data.resultList;
                    wx.setStorageSync('behaviorConfig', res.data.data.resultList);

                    return res.data.data.resultList;
                }
            }
        })
    }else{
        return wx.getStorageSync('behaviorConfig');
    }
  }

/**
 * 得到某类行为的配置
 * @param  {[type]} behaviorType [description]
 * @return {[type]}              [description]
 */
getCurrBehaviorConfig(behaviorType){
  var behaviorConfig = wx.getStorageSync('behaviorConfig');
  if(behaviorConfig){
    for(var i in behaviorConfig){
      if(behaviorConfig[i].behaviorType == behaviorType){
        return behaviorConfig[i];
      }
    }
  }
}
  /**
   * 保存客户行为
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  saveCustBehavior(params, that){
    var _this = this;
    var app = getApp();
    for(var item in params){
        if(typeof(params[item]) == "undefined" || params[item].length ==0 || !params[item]){
            if(item == 'cUserId' || item=='cityId' || item == 'behaviorContent' || params[item]=='-'){
                return false;
            }
            delete params[item];
        }
    }
    //验证一下参数
    if(Object.keys(params).length == 0){
        console.log('参数错误');
        return false;
    }else{
        for(var i in params){
            if(typeof(params[i]) == 'string' && params[i].indexOf('NaN') == false){
                console.log('参数错误-'+params[i]);
                return false;
            }
        }
        wx.request({
            url:app.buildRequestUrl('saveCustBehavior'),
            data: params,
            success:function(res){
                if(res.errCode == 200){
                    // _this.globalData.behaviorConfig = res.data.resultList;
                }
            }
        })
    }
  }
  /**
   * 退出小程序时记录用户的行为
   * @return {[type]} [description]
   */
  logoutWxAppRecord(){
    var _this = this;//当前工具类
    var storageLists = wx.getStorageInfoSync();

    if(storageLists.currentSize > 0){
        var storageKeys = storageLists.keys;
        for(var i in storageKeys){
            var key = storageKeys[i];
            var val = wx.getStorageSync(key);

            if(key.indexOf('inStoreTime') !== -1 && !!val){
               _this.getSaveCustBehaviorPage('store');
            }else if(key.indexOf('inDetailTime') !== -1 && !!val){
               _this.getSaveCustBehaviorPage('detail');
            }else if(key.indexOf('inNewDetailTime') !== -1 && !!val){
               _this.getSaveCustBehaviorPage('newbuild');
            }else{

            }
        }
    }
    console.log(storageLists);
  }
  getBasicParams(behaviorType, that){
      var _this = this;
      var pages = _this.getCurrPages(that);
      if(pages == 'personalStore'){
        var behaviorConfig = _this.getBehaviorConfigSto(behaviorType);
        if(!behaviorConfig){return false;}
        var behaviorContent = behaviorConfig.behaviorContent;//文案模板
        var cacheKey = that.data.archiveId+wx.getStorageSync('userId')+'_inStoreCount';
        var cacheKeyTime = that.data.archiveId+wx.getStorageSync('userId')+'_inStoreTime';
        var inStoreCountData = wx.getStorageSync(cacheKey);
        var userInfo = wx.getStorageSync('userInfo');
        var userName = userInfo.nickName;
        if(!userName){return false;}
        behaviorContent = behaviorContent.replace('【】', userName);
        behaviorContent = behaviorContent.replace(" ", "");

        if(!wx.getStorageSync('userId')){
          return false;
        }else if(!that.data.archiveId){
          return false;
        }else if(!behaviorContent){
          return false;
        }else if(!that.data.archiveInfo.CITY_ID){
          that.getArchiveInfo(function(){
            _this.saveCustBehaviorForStore(behaviorType)
          });
          return false;
        }else{}

        var params = {
          behaviorType: behaviorType,//行为类型
          intentionalityScore: behaviorConfig.intentionalityScore,//意向行为分数
          cUserId: wx.getStorageSync('userId'),//c端用户id
          shareArchiveId: that.data.archiveId,//分享经济人id
          cityId: that.data.archiveInfo.CITY_ID,//城市ID
          behaviorContent: behaviorContent,//行为内容
          sourceType: 1, //1 : 优优个人微店  2： 优优详情
          caseType:that.data.caseType,
          cacheKeyTime:cacheKeyTime,
          cacheKey:cacheKey
        };
      }else if(pages == 'houseDetail'){
          var shareArchiveId = that.data.shareArchiveId?that.data.shareArchiveId:that.data.archiveId;
          var behaviorConfig = _this.getBehaviorConfigSto(behaviorType);
          if(!behaviorConfig){return false;}
          var behaviorContent = behaviorConfig.behaviorContent;//文案模板
          var cacheKey = that.data.caseId+that.data.archiveId+wx.getStorageSync('userId')+'_inDetailCount';
          var cacheKeyTime = shareArchiveId+wx.getStorageSync('userId')+'_inDetailTime';
          var inStoreCountData = wx.getStorageSync(cacheKey);
          var userInfo = wx.getStorageSync('userInfo');
          var userName = userInfo.nickName;
          if(typeof(userName)!='undefined'){
            behaviorContent = behaviorContent.replace('【】', userName);
          }else{
            return false;
          }
          // 浏览的房源信息
          var roomInfo = '';
          if (that.data.buildName) {
            roomInfo += that.data.buildName + ' '
          }
          if (that.data.houseRoom) {
            roomInfo += that.data.houseRoom + '室 '
          }
          if (that.data.houseArea) {
            roomInfo += that.data.houseArea + '㎡ '
          }
          if (that.data.houseTotalPrice && that.data.priceUnitCn) {
            roomInfo += that.data.houseTotalPrice + that.data.priceUnitCn
          }

          behaviorContent = behaviorContent.replace('【】', roomInfo)
          behaviorContent = behaviorContent.replace('【】', that.data.caseType == 1 ? '出售' : '出租')

          if (!behaviorConfig) {
            return false
          }
          if(!wx.getStorageSync('userId')){
            return false;
          }else if(!that.data.archiveId){
            return false;
          }else if(!behaviorContent){
            return false;
          }else if(!that.data.cityId){
            return false;
          }else if(!inStoreCountData){
            return false;
          }else{}

          var params = {
            behaviorType: behaviorType, // 行为类型
            intentionalityScore: behaviorConfig.intentionalityScore, // 意向行为分数
            cUserId: wx.getStorageSync('userId'), // c端用户id
            shareArchiveId: that.data.shareArchiveId, // 分享经济人id
            ownerArchiveId: that.data.archiveId, //所属人
            cityId: that.data.cityId, // 城市ID
            behaviorContent: behaviorContent, // 行为内容
            sourceType: 2, // 1 : 个人微店  2： 小程序
            caseId: that.data.caseId,
            caseType: that.data.caseType,
            intentionalityRegionName: that.data.regionName,
            intentionalityRoom: that.data.houseRoom,
            intentionalityHousePrice: that.data.houseTotalPrice,
            pirceUnit: that.data.priceUnit,
            cacheKeyTime:cacheKeyTime,
            cacheKey:cacheKey
          }
      }else if(pages == 'newHouseDetail'){
        var shareArchiveId = that.data.shareArchiveId ? that.data.shareArchiveId : that.data.archiveId;
        var behaviorConfig = _this.getBehaviorConfigSto(behaviorType);
        if (!behaviorConfig) {
            return false;
        }
        var behaviorContent = behaviorConfig.behaviorContent; //文案模板
        var cacheKey = that.data.buildId + shareArchiveId + wx.getStorageSync('userId') + '_inNewDetailCount';
        var cacheKeyTime = shareArchiveId + wx.getStorageSync('userId') + '_inNewDetailTime';
        var inStoreCountData = wx.getStorageSync(cacheKey);
        var userInfo = wx.getStorageSync('userInfo');
        var userName = userInfo.nickName;
        if (typeof(userName) != 'undefined') {
            behaviorContent = behaviorContent.replace('【】', userName);
        } else {
            return false;
        }
        // 浏览的房源信息
        if (!behaviorConfig) {
            console.log('123123');
            return false
        }
        if (!wx.getStorageSync('userId')) {
            console.log(1111)
            return false;
        } else if (!shareArchiveId) {
            console.log(2222)
            return false;
        } else if (!behaviorContent) {
            console.log(33333)
            return false;
        } else if (!that.data.cityId) {
            console.log(44444)
            return false;
        } else if (!that.data.buildName) {
            setTimeout(function() {
                _this.saveCustBehaviorForStore(behaviorType, that);
            }, 1000)
            return false;
        } else {}
        behaviorContent = behaviorContent.replace('【】', that.data.buildName)
        var params = {
            behaviorType: behaviorType, // 行为类型
            intentionalityScore: behaviorConfig.intentionalityScore, // 意向行为分数
            cUserId: wx.getStorageSync('userId'), // c端用户id
            shareArchiveId: that.data.shareArchiveId ? that.data.shareArchiveId : that.data.archiveId, // 分享经济人id
            cityId: that.data.archiveInfo.CITY_ID, // 城市ID
            behaviorContent: behaviorContent, // 行为内容
            sourceType: 2, // 1 : 个人微店  2： 小程序
            caseId: that.data.buildId,
            caseType: that.data.caseType,
            intentionalityRegionName: that.data.regionName,
            intentionalityHousePrice: that.data.houseTotalPrice,
            pirceUnit: that.data.priceUnit,
            cacheKeyTime:cacheKeyTime,
            cacheKey:cacheKey
        }

      }else{

      }
   
   console.log(params);
    return params
  }

  //提交C端操作微店的行为
  saveCustBehaviorForStore(behaviorType, that){
    console.log(behaviorType);
    var _this = this;//当前工具类
    
    var params = _this.getBasicParams(behaviorType, that);
    var cacheKeyTime = params.cacheKeyTime;
    var cacheKey = params.cacheKey;
    var behaviorContent = params.behaviorContent;
    var inStoreCountData = wx.getStorageSync(cacheKey);

    console.log(params);
    switch(behaviorType)
     {
      case '0':// 【】正在浏览您的专属微店
        var timer = wx.getStorageSync(cacheKeyTime);
        console.log(timer);
        if(!!timer){return false;}
        if(inStoreCountData && inStoreCountData.inStoreCount > 0){
          _this.saveCustBehaviorForStore('1', that);
          return false;
        }
        params.behaviorContent = behaviorContent;
        _this.setTimeAction(cacheKeyTime);
        that.pushMsg();
        break;
      case '1'://【】正在浏览您的专属微店，这已经是第N次来了，快去了解客户的需求吧
        var timer = wx.getStorageSync(cacheKeyTime);
        if(!!timer){return false;}
        behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount+1);
        params.behaviorContent = behaviorContent;
        _this.setTimeAction(cacheKeyTime);
        that.pushMsg();
        break;
      case '2'://点击IM:【】想在线咨询你关于买房/租房的事情，赶紧把握住机会吧！
        params.behaviorContent = behaviorContent;
        break;
      case '3'://点击电话: 【】想给你电话咨询买房/租房的事情，机不可失时不再来！
        params.behaviorContent = behaviorContent;
        break;
      case '4'://分享: 【】第N次给朋友推荐了你的专属微店，TA有朋友可能需要买房/租房哦，找他打听一下
        var inStoreShareCount = inStoreCountData.inStoreShareCount ? parseInt(inStoreCountData.inStoreShareCount) : 0;
        behaviorContent = behaviorContent.replace('N', inStoreShareCount+1);
        params.behaviorContent = behaviorContent;
        break;
      case '5'://第一次退出: 【】第1次浏览了你的微店，停留了【】秒
        if(inStoreCountData.inStoreCount > 0){
          _this.saveCustBehaviorForStore('6', that);
          return false;
        }
        var timer = _this.getTimeAction(cacheKeyTime);
        if(!timer){return false;}
        behaviorContent = behaviorContent.replace('【】', timer);
        params.behaviorContent = behaviorContent;
        params.residenceTime = timer;

        inStoreCountData.inStoreCount = inStoreCountData.inStoreCount+1;
        wx.setStorageSync(cacheKey, inStoreCountData);
        break;
      case '6'://第N次退出: 【】第【】次浏览了你的微店，本次停留了【】秒，TA在你的微店中总共停留了【】秒
        behaviorContent = behaviorContent.replace('【】', inStoreCountData.inStoreCount+1);

        inStoreCountData.inStoreCount = inStoreCountData.inStoreCount+1;
        wx.setStorageSync(cacheKey, inStoreCountData);
        console.log(cacheKeyTime);
        var timer = _this.getTimeAction(cacheKeyTime);
        console.log(timer);
        if(!timer){return false;}
        behaviorContent = behaviorContent.replace('【】', timer);
        var timerTotal = parseInt(inStoreCountData.inStoreResidenceTime) + parseInt(timer);
        timerTotal = _this.formatTimeData(timerTotal);
        behaviorContent = behaviorContent.replace('【】', timerTotal);
        params.behaviorContent = behaviorContent;
        params.residenceTime = timer;
        break;
      case '7'://筛选区域: sunshine 在微店中筛选了【】的【】房源，请及时跟进了解TA的【】意向
        behaviorContent = behaviorContent.replace('【】', that.data.regionText);
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'出售':'出租');
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'购房':'租房');
        params.behaviorContent = behaviorContent;
        params.intentionalityRegionId = that.data.ajaxListData.regionId;
        params.intentionalityRegionName = that.data.regionText;
        params.intentionalityHousePrice = that.data.price.replace(':', '-');
        params.intentionalityRoom = that.data.roomText ? parseInt(that.data.roomText) : '';
        break;
      case '8'://筛选价格: 【】在微店中筛选了价格为【】的【】房源，请及时跟进了解TA的【】意向
        behaviorContent = behaviorContent.replace('【】', that.data.housePriceText);
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'出售':'出租');
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'购房':'租房');
        params.behaviorContent = behaviorContent;
        params.intentionalityRegionId = that.data.ajaxListData.regionId;
        params.intentionalityRegionName = that.data.regionText;
        params.intentionalityHousePrice = that.data.price.replace(':', '-');
        params.intentionalityRoom = that.data.roomText ? parseInt(that.data.roomText) : '';
        break;
      case '9'://筛选户型: 【】在微店中筛选了户型为【】的【】房源，请及时跟进了解TA的【】意向
        behaviorContent = behaviorContent.replace('【】', that.data.roomText);
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'出售':'出租');
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'购房':'租房');
        params.behaviorContent = behaviorContent;
        params.intentionalityRegionId = that.data.ajaxListData.regionId;
        params.intentionalityRegionName = that.data.regionText;
        params.intentionalityHousePrice = that.data.price.replace(':', '-');
        params.intentionalityRoom = that.data.roomText ? parseInt(that.data.roomText) : '';
        break;
      case '10'://筛选面积: 【】在微店中筛选了面积为【】的【】房源，请及时跟进了解TA的【】意向
        behaviorContent = behaviorContent.replace('【】', that.data.ajaxListData.area.replace(':','-')+"平米");
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'出售':'出租');
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'购房':'租房');
        params.behaviorContent = behaviorContent;
        break;
      case '11'://筛选用途: 【】在微店中筛选了用途为【】的【】房源，请及时跟进了解TA的【】意向
        if(that.data.ajaxListData.houseUseage==1){
          var houseUseageCn = '住宅';
        }else if(that.data.ajaxListData.houseUseage==2){
          var houseUseageCn = '别墅';
        }else if(that.data.ajaxListData.houseUseage==3){
          var houseUseageCn = '商铺';
        }else if(that.data.ajaxListData.houseUseage==4){
          var houseUseageCn = '写字楼';
        }else{
          var houseUseageCn = '其他';
        }
        behaviorContent = behaviorContent.replace('【】', houseUseageCn);
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'出售':'出租');
        behaviorContent = behaviorContent.replace('【】', that.data.tabFlag==1?'购房':'租房');
        params.behaviorContent = behaviorContent;
        break;
      case '48'://筛选区域:【】在微店新盘中筛选了【】的楼盘，请及时跟进了解TA的购房意向
        if(that.data.regionText.indexOf('不限') !== -1){
          return false;
        }
        params.caseType = 6;
        behaviorContent = behaviorContent.replace('【】', that.data.regionText);
        params.behaviorContent = behaviorContent;
        params.intentionalityRegionId = that.data.ajaxNewhouseListData.regionId;
        params.intentionalityRegionName = that.data.regionText;
        if(that.data.ajaxNewhouseListData.priceMin && that.data.ajaxNewhouseListData.priceMax){
            params.intentionalityHousePrice = that.data.ajaxNewhouseListData.priceMin+'-'+that.data.ajaxNewhouseListData.priceMax;
        }
        break;
      case '49'://筛选价格:【】在微店新盘中筛选了价格为【】的楼盘，请及时跟进了解TA的购房意向
        if(that.data.housePriceText.indexOf('不限') !== -1){
          return false;
        }
        params.caseType = 6;
        behaviorContent = behaviorContent.replace('【】', that.data.housePriceText);
        params.behaviorContent = behaviorContent;
        params.intentionalityRegionId = that.data.ajaxNewhouseListData.regionId;
        params.intentionalityRegionName = that.data.regionText;
        if(that.data.ajaxNewhouseListData.priceMin && that.data.ajaxNewhouseListData.priceMax){
          params.intentionalityHousePrice = that.data.ajaxNewhouseListData.priceMin+'-'+that.data.ajaxNewhouseListData.priceMax;
        }
        break;
      case '50'://筛选用途:【】在微店新盘中筛选了用途为【】的楼盘，请及时跟进了解TA的购房意向
        params.caseType = 6;
        if(that.data.ajaxNewhouseListData.houseUsage=='1'){
          var houseUseageCn = '住宅';
        }else if(that.data.ajaxNewhouseListData.houseUsage=='2'){
          var houseUseageCn = '别墅';
        }else if(that.data.ajaxNewhouseListData.houseUsage=='3'){
          var houseUseageCn = '商铺';
        }else if(that.data.ajaxNewhouseListData.houseUsage=='4'){
          var houseUseageCn = '写字楼';
        }else{
          return false;
        }
        behaviorContent = behaviorContent.replace('【】', houseUseageCn);
        if(that.data.ajaxNewhouseListData.priceMin && that.data.ajaxNewhouseListData.priceMax){
            params.intentionalityHousePrice = that.data.ajaxNewhouseListData.priceMin+'-'+that.data.ajaxNewhouseListData.priceMax;
        }
        params.behaviorContent = behaviorContent;
        break;
      case '12': // 进入房源:【】正在浏览您【】的【】房源，请及时跟进了解TA的【】意向
       var timer = wx.getStorageSync(cacheKeyTime);
       if(!!timer){return false;}
       if(inStoreCountData.inStoreCount > 0){
          this.saveCustBehaviorForStore('13', that);
          return false;
        }
        behaviorContent = behaviorContent.replace('【】', that.data.caseType == 1 ? '购房' : '租房')
        params.behaviorContent = behaviorContent;
        _this.setTimeAction(cacheKeyTime);
        break
      case '13': // 第N次进入房源:【】正在浏览您的 英郡 3室 88㎡ 189万的出售房源，这已经是第N次来了，快去了解客户的需求吧
        var timer = wx.getStorageSync(cacheKeyTime);
        if(!!timer){return false;}
        behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
        params.behaviorContent = behaviorContent;
        _this.setTimeAction(cacheKeyTime);
        break
      case '14': // 查看照片: 【】正在查看您 【】出售房源的照片，请及时跟进了解TA的【】意向
        behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
        params.behaviorContent = behaviorContent
        break
      case '15': // 评估房价: 【】正在您 【】房源详情中评估房价，看来最近买房的意向很高，赶紧跟进吧
        params.behaviorContent = behaviorContent
        break
      case '16': // 房贷计算器:  【】正在您 【】房源详情中使用房贷计算器，看来最近买房的意向很高，赶紧跟进吧
        params.behaviorContent = behaviorContent
      case '17': // 更多小区介绍: 【】 想要进一步了解【】，有眼光的你，怎么能轻易放过他呢
        params.behaviorContent = behaviorContent
      case '18': // 点击关注: 【】已经关注了你，你的所有房源TA都会知道啦
        params.behaviorContent = behaviorContent
        break
      case '19': // 点击微信咨询: 【】想在线咨询你 【】【】房源的事情，赶紧把握住机会吧！
        params.behaviorContent = behaviorContent
        break
      case '20': // 点击电话:  【】 想给你电话咨询【】【】房源的事情，机不可失时不再来！
        params.behaviorContent = behaviorContent
        break
      case '21': // 查看全部周边: 【】 正在浏览您【】【】房源的周边配套设置，可能想进一步了解更多盘源信息
        params.behaviorContent = behaviorContent
        break
      case '22': // 公交、地铁、学校: [】 正在浏览您【】【】房源的周边的地铁信息，可能想进一步了解更多盘源信息
        var mapType = wx.getStorageSync('mapType')
        behaviorContent = behaviorContent.replace('【】', mapType)
        params.behaviorContent = behaviorContent
        break
      case '23': // 收藏: 【】 收藏你【】的【】房源，尽快跟TA确认是否到现场看房
        params.behaviorContent = behaviorContent
        break
      case '24': // 取消收藏:  【】 不喜欢【】的【】房源，记住尽量少推荐这个楼盘哦
        params.behaviorContent = behaviorContent
        break
      case '25': // 分享:  【】 第N次给朋友推荐了你【】的出售【】房源，TA有朋友可能需要买房哦，找他打听一下
        behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreShareCount + 1)
        params.behaviorContent = behaviorContent
        break
      case '26': // 地图导航: 【】 正在使用您【】 房源中的地图导航了，看来对房源还是很满意了，赶快跟进吧
        behaviorContent = behaviorContent.replace('【】', this.data.ajaxListData.area.replace(':', '-') + '平米')
        behaviorContent = behaviorContent.replace('【】', this.data.tabFlag == 1 ? '出售' : '出租')
        behaviorContent = behaviorContent.replace('【】', this.data.tabFlag == 1 ? '购房' : '租房')
        params.behaviorContent = behaviorContent
        break
      case '27': // 预约看房: 【】想要向你预约看【】 的【】 房源，赶紧跟进吧
        params.behaviorContent = behaviorContent
        break
      case '28': // 特权找好房: 【】 想要发布委托买房，赶紧跟进了解TA的【】意向吧
        params.behaviorContent = behaviorContent
        break
      case '29': // 第一次退出:【】第1次查看【】的【】出售房源详情，停留了【】秒
       if(inStoreCountData && inStoreCountData.inStoreCount > 0){
          this.saveCustBehaviorForStore('30', that);
          return false;
        }
        var timer = _this.getTimeAction(cacheKeyTime)
        if (!timer) {return false;}
        behaviorContent = behaviorContent.replace('【】', timer)
        params.residenceTime = timer
        params.behaviorContent = behaviorContent
        break
      case '30': // 第N次退出: 【】第N次查看【】的【】房源详情，本次停留了【】秒，TA在此房源总共停留了【】秒
        behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
        var timer = _this.getTimeAction(cacheKeyTime)
        behaviorContent = behaviorContent.replace('【】', timer)
        var timerTotal = parseInt(inStoreCountData.inStoreResidenceTime) + parseInt(timer)
        timerTotal = _this.formatTimeData(timerTotal)
        behaviorContent = behaviorContent.replace('【】', timerTotal)
        params.behaviorContent = behaviorContent
        params.residenceTime = timer

        inStoreCountData.inStoreCount = inStoreCountData.inStoreCount+1;
        wx.setStorageSync(cacheKey, inStoreCountData);
        break;
      case '36': // 进入房源: 【】正在浏览你代理的【】项目详情，请及时跟进了解TA的购房意向
          if (inStoreCountData.inStoreCount > 0) {
              _this.saveCustBehaviorForStore('37', that);
              return false;
          }
          // behaviorContent = behaviorContent.replace('【】', that.data.caseType == 1 ? '购房' : '租房')
          params.behaviorContent = behaviorContent;
          _this.setTimeAction(cacheKeyTime);
          break
      case '37': // 第N次进入房源:【】正在浏览你代理的【】项目详情，这已经是第N次来了，快去了解客户的需求吧
          behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
          params.behaviorContent = behaviorContent;
          _this.setTimeAction(cacheKeyTime);
          break
      case '38': // 查看照片: 【】正在浏览你代理的【】项目的照片，请及时跟进了解TA的购房意向
          console.log(behaviorContent)
          behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
          params.behaviorContent = behaviorContent
          break
      case '39': // 地图导航:【】正在使用你代理的【】项目中的地图导航了，看来对房源还是很满意了，赶快跟进吧
          params.behaviorContent = behaviorContent
          break
      case '40': // 全部户型:  【】正在浏览你代理的【】项目中的全部户型，请及时跟进了解TA的购房意向
          params.behaviorContent = behaviorContent
          break
      case '41': // 分享: 【】 第N次给朋友推荐了你代理的【】项目，TA有朋友可能需要买房哦，找他打听一下
          console.log(inStoreCountData.inStoreShareCount);
          behaviorContent = behaviorContent.replace('N', parseInt(inStoreCountData.inStoreShareCount) + 1)
          params.behaviorContent = behaviorContent
          break;
      case '42': // 公交、地铁、学校、: 【】 正在浏览你代理的【】项目位置周边的【】信息，可能想进一步了解更多楼盘信息
          var mapType = wx.getStorageSync('mapType')
          behaviorContent = behaviorContent.replace('【】', mapType)
          params.behaviorContent = behaviorContent
          break
      case '43': // 查看全部周边: 【】正在浏览你代理的【】项目中的周边配套设置，可能想进一步了解更多楼盘信息
          params.behaviorContent = behaviorContent
          break
      case '44': // 点击咨询置业顾问: 【】想在线咨询你 你代理的【】项目的事情，赶紧把握住机会吧！
          params.behaviorContent = behaviorContent
          break
      case '45': // 预约看房: 【】想要向你预约看【】项目，赶紧跟进吧
          params.behaviorContent = behaviorContent
          break
      case '46': // 第一次退出: 【】第1次查看你代理的【】项目详情，停留了【】秒
         if(inStoreCountData.inStoreCount > 0){
            this.saveCustBehaviorForStore('47');
            return false;
          }
          var timer = _this.getTimeAction(cacheKeyTime)
          if (!timer) {return false;}
          behaviorContent = behaviorContent.replace('【】', timer)
          console.log(behaviorContent)
          params.residenceTime = timer
          params.behaviorContent = behaviorContent
          break
      case '47': // 第N次退出:【】第N次查看你代理的【】项目详情，本次停留了【】秒，TA在此房源总共停留了【】秒
          behaviorContent = behaviorContent.replace('N', inStoreCountData.inStoreCount + 1)
          var timer = _this.getTimeAction(cacheKeyTime)
          behaviorContent = behaviorContent.replace('【】', timer)
          var timerTotal = parseInt(inStoreCountData.inStoreResidenceTime) + parseInt(timer)
          timerTotal = _this.formatTimeData(timerTotal)
          behaviorContent = behaviorContent.replace('【】', timerTotal)
          params.behaviorContent = behaviorContent
          params.residenceTime = timer

          inStoreCountData.inStoreCount = inStoreCountData.inStoreCount+1;
          wx.setStorageSync(cacheKey, inStoreCountData);
          break
       case '51': // 收藏: 【】 收藏你【】的【】房源，尽快跟TA确认是否到现场看房
        params.behaviorContent = behaviorContent
        break
      case '52': // 取消收藏:  【】 不喜欢【】的【】房源，记住尽量少推荐这个楼盘哦
        params.behaviorContent = behaviorContent
        break
      default:
        break;
     }
     _this.saveCustBehavior(params);
  }

  /**
   * 获取页面退出小程序
   * @return {[type]} [description]
   */
  getSaveCustBehaviorPage(type){
    var pages = getCurrentPages();
    if(pages.length > 0){
        for (var i = pages.length - 1; i >= 0; i--) {
          if(type == 'store'){
            var behaviorType = '5';
            var page = 'pages/personalStore/personalStore';
          }else if(type == 'detail'){
            var behaviorType = '29';
            var page =  'pages/houseDetail/houseDetail';
          }else if(type == 'newbuild'){
            var behaviorType = '46';
            var page =  'pages/newHouseDetail/newHouseDetail';
          }else{}

          if(pages[i].route==page){
            console.log(behaviorType);
            this.saveCustBehaviorForStore(behaviorType, pages[i]);
            break;
          }
        }
    }else{
      return false;
    }
  }

  //计时器,记录用户某个行为的停留时间
  setTimeAction(type) {
    var currentTime = Date.parse(new Date());
    wx.setStorageSync(type, currentTime)
  }
  //用户退出某个行为的
  getTimeAction(type) {
    var currentTime = Date.parse(new Date());
    console.log(currentTime);
    var inputTime = wx.getStorageSync(type);
    console.log(inputTime);
    var offset = parseInt(currentTime) - parseInt(inputTime);
    if(offset > 3600000){
      wx.setStorageSync(type, 0);
      return false;
    }
    offset = offset > 3600000 ? 3600000 : offset;//设定一个最大值10分钟
    wx.setStorageSync(type, 0);
    return offset/1000;
  }

  /**
 * 将秒格式化成时分秒
 * @param  {[type]} timer [description]
 * @return {[type]}       [description]
 */
formatTimeData(timer){
  if(!timer){
    return false;
  }

  var secondTime = parseInt(timer);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if(minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
      }
  }
  var result = "" + parseInt(secondTime);

  if(minuteTime > 0) {
      result = "" + parseInt(minuteTime) + "分" + result;
  }
  if(hourTime > 0) {
      result = "" + parseInt(hourTime) + "小时" + result;
  }
  return result;
}

/**
 * 获取行为配置
 */
getBehaviorConfigSto(type){
  var behaviorConfig = wx.getStorageSync('behaviorConfig');
  for(var i in behaviorConfig){
    if(behaviorConfig[i].behaviorType == type){
      return behaviorConfig[i];
    }
  }
}

  /**
   * 用户进入微店
   * @return {[type]} [description]
   */
  inStoreAction(that){
    var _this = this;
    var page = _this.getCurrPages();
    console.log(page);
    console.log(that.data);
    if(that.data.userInfo){
      if(_this.getInstoreCountData(that)){
        if(that.data.archiveInfo){
          if(page == 'personalStore'){
            console.log(11111);
            _this.saveCustBehaviorForStore('0', that);
          }else if(page == 'houseDetail'){
            console.log(2222);
            _this.saveCustBehaviorForStore('12', that);
          }else if(page == 'newHouseDetail'){
            console.log(33333);
            _this.saveCustBehaviorForStore('36', that);
          }else{
            console.log(44444);
          }
        }else{
          that.getArchiveInfo(function(){
             if(page == 'personalStore'){
               console.log(5555);
                _this.saveCustBehaviorForStore('0', that);
              }else if(page == 'houseDetail'){
               console.log(66666);
                _this.saveCustBehaviorForStore('12', that);
              }else if(page == 'newHouseDetail'){
               console.log(7777);
                _this.saveCustBehaviorForStore('36', that);
              }else{
               console.log(88888);
              }
          })
        }
      }else{
        console.log(999);
        _this._getInStoreCount(function(){
          _this.inStoreAction(that);
        }, that);
      }
    }else{
      // setTimeout(function(){
      //   _this.inStoreAction(that);
      // },2000)
      console.log('参数不够');
    }
  }
    /**
   * 获取当前用户的行为统计数据
   * @return {[type]} [description]
   */
  getInstoreCountData(that){
    var _this = this;
    var page = this.getCurrPages();

    if (page == 'personalStore') {
      var cacheKey = that.data.archiveId + wx.getStorageSync('userId')+ '_inStoreCount';
    } else if (page == 'houseDetail') {
      var cacheKey = that.data.caseId + that.data.archiveId + wx.getStorageSync('userId')+ '_inDetailCount';
      console.log(cacheKey);
    } else if (page == 'newHouseDetail') {
      var cacheKey = that.data.buildId + that.data.archiveId + wx.getStorageSync('userId') + '_inNewDetailCount';
    } else { }
    console.log(cacheKey);
    var inStoreCountData = wx.getStorageSync(cacheKey);
    if(inStoreCountData){
      that.data.inStoreCountData = inStoreCountData;
      return inStoreCountData;
    }else{
      return false;
    }
  }
    /**
   * 进入微店就初始化是第几次访问微店
   * @return {[type]} [description]
   */
  _getInStoreCount(fn, that){
    var _this = this;

    if(that.data.archiveId && wx.getStorageSync('userId')){
      var caseId = that.data.caseId ? that.data.caseId : (that.data.buildId ? that.data.buildId : '');
      var caseType = that.data.caseType ? that.data.caseType : '';
      var storeCount = _this.getInStoreCount(that.data.archiveId, wx.getStorageSync('userId'), caseId, caseType,fn);
    }
  }

  getUserInfoAfter(that){
     var _this = this;
     var cacheKey = that.data.archiveId+wx.getStorageSync('userId')+'_inStoreCount';
     var inStoreCountData = wx.getStorageSync(cacheKey);
    if(!!inStoreCountData){
      if(inStoreCountData.inStoreCount > 0){
        _this.saveCustBehaviorForStore('1', that);
      }else{
        _this.saveCustBehaviorForStore('0', that);
      }
    }else{
      _this._getInStoreCount(function(inStoreCountData){
        if(inStoreCountData.inStoreCount > 0){
          _this.saveCustBehaviorForStore('1', that);
        }else{
          _this.saveCustBehaviorForStore('0', that);
        }
      });
    }
  }

  }
  export { BehaviorTools };