// pages/collect/collect.js
var app = getApp();
var api = require('../../../utils/common.js');
var util = require('../../../utils/util.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    attentionList: [], //关注的经纪人列表
    collectList:[], //收藏房源列表
    historyList:[], //浏览足迹列表
    historyListFlag:false, //浏览足迹列表
    

    ajaxListFlag:3, //请求数据 标志

    userId: null,
    cityId: null,
    caseType: 4,
    pageNum: 1,
    ajaxListTag: true,
    loadingdata: true, //正在加载数据
    noMoreData: true, //没有更多数据
    
    lazyLoad: true //懒加载
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(); //登录验证

    //只在初次 进入页面时 进行数据处理
    wx.showLoading({
      title: '加载中',
      mask: true
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    let userId = wx.getStorageSync('userId')
    let cityId = wx.getStorageSync('cityId')

    //测试
    // userId = 25052

    this.setData({
      cityId: cityId,
      userId: userId
    });

    //请求 关注的经纪人列表 
    this.getFocusList();
    this.getHistoryList(); //请求 收藏房源 列表
    this.getCollectionList(); //请求 浏览的房源 列表
  },
  /**
   * 检测请求数据完成, 隐藏数据加载框
   * 
   */
  checkAjaxLoading:function(){
    if (this.data.ajaxListFlag == 0) {
      wx.hideLoading();
    }
  },

  /**
   * 获取缓存数据, 翻译对应的 regId 等数据
   */
  getRegNameById:function(regId){
    let regName = ''
    let filterData = wx.getStorageSync('filterData'+this.data.cityId)
    if (!filterData || !regId) return regName
    filterData = JSON.parse(filterData)
    let regDataList = filterData.DATA.REG_DATA
    regDataList.map(function(item,index){
      if (item.REG_ID == regId) {
        regName = item.REG_NAME
      }
    })
    return regName
  },

  /**
   * 请求关注的经纪人 列表
   */
  getFocusList: function(){
    var that = this
    wx.request({
      url: app.buildRequestUrl('getAttentionList'),
      data: {
        wxId: this.data.userId,
        cityId: this.data.cityId
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.STATUS === 1) {
            let attentionVoList = res.data.DATA.attentionVoList
            attentionVoList.map(function(item,index){
              let serviceRegNameArr = [];
              if (!!item.serviceReg){
                let serviceRegArr = item.serviceReg.split(' ');
                serviceRegArr.map(function(regItem){
                  serviceRegNameArr.push(that.getRegNameById(regItem))
                })
              }
              attentionVoList[index]['serviceRegName'] = serviceRegNameArr.join(' ');
              attentionVoList[index]['countScore'] = parseFloat(item.countScore).toFixed(1);
            })
            this.setData({attentionList:attentionVoList})
        } 
      },
      complete: (res) => {
        this.setData({ajaxListFlag: (this.data.ajaxListFlag - 1)})
        this.checkAjaxLoading()
      }
    });
  },
  /**
   * 请求 收藏的房源 列表
   */
  getCollectionList: function () {
    var that = this
    wx.request({
      url: app.buildRequestUrl('getHouseCollectionList'),
      data: {
        wxId: this.data.userId,
        cityId: this.data.cityId
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.STATUS === 1) {
          let list = res.data.DATA.resultList
          list = this.dealCollectData(list);
          this.setData({
            collectList: list
          })
        }
      },
      complete: (res) => {
        this.setData({
          ajaxListFlag: (this.data.ajaxListFlag - 1)
        })
        this.checkAjaxLoading()
      }
    });
  },
  /**
   * 请求 用户浏览足迹 列表
   */
  getHistoryList: function () {
    var that = this
    wx.request({
      url: app.buildRequestUrl('getHouseHistoryList'),
      data: {
        wxId: this.data.userId,
        cityId: this.data.cityId
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.STATUS === 1) {
          let list = res.data.DATA.historyList
          list = this.dealHistoryData(list);
          this.setData({
            historyList: list
          })
        }
      },
      complete:(res)=>{
        this.setData({
          ajaxListFlag: (this.data.ajaxListFlag - 1)
        })
        this.checkAjaxLoading()
      }
    });
  },

  /**
   * 处理收藏的房源数据
   * 
   */
  dealCollectData: function (oldList) {
    let list = oldList
    list.map(function (item, index) {
      //1二手房 2整租 3合租 6新盘 7 公寓(caseType为7 为整租公寓 8 为合租公寓)
      if (item.caseType == 7 || item.caseType == 8) {
        // 公寓
        if (item.caseType == 7){
          list[index]['collectPageUrl'] = '/pages/apartmentDetail/apartmentDetail?apartmentUuid=' +
            item.gyUuId + '&rentType=1';
        }else{
          list[index]['collectPageUrl'] = '/pages/apartmentDetail/apartmentDetail?apartmentUuid=' +
            item.gyUuId + '&roomUuid=' + item.gyRoomUuid + '&rentType=2';
        }
        
        list[index]['collectThumbUrl'] = item.gyThumbUrl 
        list[index]['collectTitle'] = item.gyHftSectionName + ' ' + item.gyHftBuildName + ' '
        list[index]['collectTitle'] += !!item.gyBedRoomNum ? (item.gyBedRoomNum + '室') : ''
        list[index]['collectTitle'] += !!item.gyLivingRoomNum ? (item.gyLivingRoomNum + '厅') : ''
        list[index]['collectTitle'] += !!item.gyToiletNum ? (item.gyToiletNum + '卫') : ''
        if (item.caseType == 8 && !!item.gyRoomHouseNum) list[index]['collectTitle'] += item.gyRoomHouseNum + '房间'
        

        list[index]['collectPirce'] = item.gyMonthRent + '元/月'

        //处理标签
        if (item['gyRoomTags']) {
          list[index]['collectTagsArr'] = item['gyRoomTags'].split(',').slice(0, 4);
        }

      } else if (item.caseType == 6) {
        // 新房
        list[index]['collectPageUrl'] = '/pages/newHouseDetail/newHouseDetail?cityid='+item.cityId+'&buildid='+item.xfBuildId
        list[index]['collectThumbUrl'] = item.xfPhotoAddr
        list[index]['collectTitle'] = item.xfBuildName
        list[index]['collectDesc'] = item.xfBuildAddr
        list[index]['collectPirce'] = !!item.xfPriceText ? item.xfPriceText : '价格待定'

        let buildTagArr = [];
        if (item['buildTag']) buildTagArr = item['xfBuildTag'].split(',');
        if (item['xfBuildType']) buildTagArr = buildTagArr.concat((item['xfBuildType'].split(',')));
        if (item['xfBuildFitment']) buildTagArr = buildTagArr.concat((item['xfBuildFitment'].split(',')));
        list[index]['collectTagsArr'] = buildTagArr.slice(0, 4); //只取前4个标签
        
      }else{
        //二手房.整租.合租
        list[index]['collectPageUrl'] = '/pages/houseDetail/houseDetail?cityid=' + item.cityId + '&caseid=' + item.houseId +
        '&casetype=' + item.caseType + '&resource=' + item.reSource
        list[index]['collectThumbUrl'] = item.thumbUrl

        list[index]['collectTitle'] = !!item.houseSubject ? item.houseSubject : (item.regionName + ' ' + item.buildName + ' ' + (!!item.houseRoom ? (item.houseRoom + '室') : '') + (!!item.houseHall ? (item.houseHall + '厅 ') : ''))

        list[index]['collectDesc'] = !!item.houseRoom ? (item.houseRoom+'室') : ''
        list[index]['collectDesc'] += !!item.houseHall ? (item.houseHall + '厅 ') : ''
        list[index]['collectDesc'] += !!item.houseDirectCn ? (item.houseDirectCn + ' ') : ''
        list[index]['collectDesc'] += !!item.houseArea ? (item.houseArea + '㎡ ') : ''
        list[index]['collectDesc'] += !!item.buildName ? (item.buildName) : ''

        list[index]['collectPirce'] = item.houseTotalPrice + item.priceUnitCn
        if (item.caseType == 1 && !!item.houseUnitPrice) list[index]['collectUnitPrice'] = item.houseUnitPrice + '元/㎡'

        //处理标签
        if (item['houseTagDesc']) list[index]['collectTagsArr'] = item['houseTagDesc'].split('|').slice(0, 4);

      }
    })
    return list
  },

  /**
   * 处理 我的浏览房源 数据 
   */
  dealHistoryData: function (oldList) {
    let list = oldList
    if(list.length > 0){this.setData({historyListFlag:true})}
    let newOrderList = {}
    list.map(function (item, index) {
      //1二手房 2整租 3合租 6新盘 7 公寓(caseType为7 为整租公寓 8 为合租公寓)
      if (item.caseType == 7 || item.caseType == 8) {
        // 公寓
        if (item.caseType == 7) {
          list[index]['historyPageUrl'] = '/pages/apartmentDetail/apartmentDetail?apartmentUuid=' +
            item.gyUuId + '&rentType=1';
        } else {
          list[index]['historyPageUrl'] = '/pages/apartmentDetail/apartmentDetail?apartmentUuid=' +
            item.gyUuId + '&roomUuid=' + item.gyRoomUuid + '&rentType=2';
        }

        list[index]['historyThumbUrl'] = item.gyThumbUrl
        list[index]['historyTitle'] = item.gyHftSectionName + ' ' + item.gyHftBuildName + ' '
        list[index]['historyTitle'] += !!item.gyBedRoomNum ? (item.gyBedRoomNum + '室') : ''
        list[index]['historyTitle'] += !!item.gyLivingRoomNum ? (item.gyLivingRoomNum + '厅') : ''
        list[index]['historyTitle'] += !!item.gyToiletNum ? (item.gyToiletNum + '卫') : ''
        if (item.caseType == 8 && !!item.gyRoomHouseNum) list[index]['historyTitle'] += item.gyRoomHouseNum + '房间'

        list[index]['historyPirce'] = item.gyMonthRent + '元/月'

        //处理标签
        if (item['gyRoomTags']) {
          list[index]['historyTagsArr'] = item['gyRoomTags'].split(',').slice(0, 4);
        }

      } else if (item.caseType == 6) {
        // 新房
        list[index]['historyPageUrl'] = '/pages/newHouseDetail/newHouseDetail?cityid=' + item.cityId + '&buildid=' + item.xfBuildId
        list[index]['historyThumbUrl'] = item.xfPhotoAddr
        list[index]['historyTitle'] = item.xfBuildName
        list[index]['historyDesc'] = item.xfBuildAddr
        list[index]['historyPirce'] = !!item.xfPriceText ? item.xfPriceText : '价格待定'

        let buildTagArr = [];
        if (item['buildTag']) buildTagArr = item['xfBuildTag'].split(',');
        if (item['xfBuildType']) buildTagArr = buildTagArr.concat((item['xfBuildType'].split(',')));
        if (item['xfBuildFitment']) buildTagArr = buildTagArr.concat((item['xfBuildFitment'].split(',')));
        list[index]['historyTagsArr'] = buildTagArr.slice(0, 4); //只取前4个标签

        if (item['xfRoomText']){
          let xfRoomTextArr = item['xfRoomText'].split(' ')
          list[index]['xfRoomTextCn'] = xfRoomTextArr.join('室、')
        }
        

      } else {
        //二手房.整租.合租
        list[index]['historyPageUrl'] = '/pages/houseDetail/houseDetail?cityid=' + item.cityId + '&caseid=' + item.caseId +
          '&casetype=' + item.caseType + '&resource=' + item.reSource
        list[index]['hasVideo'] = item.videoNum>0?true:false
        list[index]['historyThumbUrl'] = item.thumbUrl

        list[index]['historyTitle'] = !!item.subject ? item.subject : (item.regionName + ' ' + item.buildName + ' ' + (!!item.room ? (item.room + '室') : '') + (!!item.hall ? (item.hall + '厅 ') : ''))

        list[index]['historyDesc'] = !!item.room ? (item.room + '室') : ''
        list[index]['historyDesc'] += !!item.hall ? (item.hall + '厅 ') : ''
        list[index]['historyDesc'] += !!item.houseDirectCn ? (item.houseDirectCn + ' ') : ''
        list[index]['historyDesc'] += !!item.area ? (item.area + '㎡ ') : ''
        list[index]['historyDesc'] += !!item.buildName ? (item.buildName) : ''

        list[index]['historyPirce'] = item.totalPrice + (!!item.priceUnitCn ? item.priceUnitCn:'')
        if (item.caseType == 1 && !!item.houseUnitPrice) list[index]['historyUnitPrice'] = item.houseUnitPrice + '元/㎡'

        //处理标签
        if (item['houseTagDesc']) list[index]['historyTagsArr'] = item['houseTagDesc'].split('|').slice(0, 4);

      }

      //处理时间分组
      let date = item.viewTime
      date = date.substring(0, 19);
      date = date.replace(/-/g, '/');
      let newDate = util.forDayCnTime(new Date(date))

      if (!!newOrderList[newDate]) {
        newOrderList[newDate].push(item)
      }else{
        newOrderList[newDate] = [item]
      }
    })
    

    return newOrderList
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})