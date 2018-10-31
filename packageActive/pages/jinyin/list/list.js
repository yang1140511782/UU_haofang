var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '', // 用户id
    cityId: '', // 城市Id
    // 奖品列表
    tabList: [
      {totalNum: 0,list: []}, // 现金红包
      {totalNum: 0,list: []}, // 购房补贴
      {totalNum: 0,list: []}, // 租房补贴
      {totalNum: 0,list: []} // 实物奖品
    ],
    currentTab: 0,
    currentTabPrizeType: [1, 3, 4, 2], // PRIZE_TYPE  1 现金 2物品 3求购券 4求租券

    //
    shareBoxFlag: false,
    // 绑定手机弹出表单
    forData: {
      userPhone: '',
      phoneCode: ''
    },
    testCodeTime: 0, // 发送短信倒计时
    phoneModalFlag: false
  },
  // 输入框的双向绑定
  bindKeyInput(e) {
    let obj = {}
    obj[e.target.dataset.key] = e.detail.value
    this.setData(obj)
  },
  // 验证手机号
  testPhoneNum() {
    let reg = /^((1[3-8][0-9])+\d{8})$/
    if (!(reg.test(this.data.forData.userPhone)) && this.data.forData.userPhone != '') {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return false
    }else {
      return true
    }
  },
  // 获取验证码
  getTestCode() {
    if (this.data.forData.userPhone == '') {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    // 验证手机号
    if (!this.testPhoneNum()) {return }

    let reduceTime = 60
    wx.request({
      url: app.buildRequestUrl('sendMobileCaptchaUrl'),
      data: {
        mobile: this.data.forData.userPhone
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.STATUS === 1) {
          wx.showToast({ title: res.data.INFO, icon: 'none' })
          let codeTime = setInterval(() => {
            reduceTime -= 1
            this.setData({ testCodeTime: reduceTime })
            if (this.data.testCodeTime < 1) {
              clearInterval(codeTime)
            }
          }, 1000)
        } else {
          wx.showToast({ title: res.data.INFO, icon: 'none' })
          this.setData({ testCodeTime: 0 })
        }
      }
    })
  },


  // 关闭绑定手机弹出
  closePhoneModalFn() {
    this.setData({ phoneModalFlag: false})
  },
  // 弹出 绑定手机弹出
  showPhoneModalFn() {
    this.setData({ phoneModalFlag: true})
  },
  /**
   * 绑定手机号码
   */
  submitBindPhone: function () {
    let that = this
    if (this.data.forData.userPhone == '') {wx.showToast({ title: '请输入手机号', icon: 'none' });return;}
    if (this.data.forData.phoneCode == '') {wx.showToast({ title: '请输验证码', icon: 'none' });return;}
    wx.request({
      url: app.buildRequestUrl('checkMobileCaptcha'),
      data: {
        userId: that.data.userId,
        mobile: that.data.forData.userPhone,
        captcha: that.data.forData.phoneCode
      },
      success: function (res) {
        var json = res.data
        if (json.STATUS == 1) {
          // 设置微信绑定号码 进入缓存
          wx.showToast({ title: json.INFO, icon: 'none' })
          wx.setStorageSync('userMobile', that.data.forData.userPhone)
          that.closePhoneModalFn(); // 关闭绑定弹窗
        }else {
          // 验证完毕, 重置验证码发送机制 
          that.setData({testCodeTime: 0})
          wx.showToast({ title: json.INFO, icon: 'none' })
        }
      }
    })
  },
  /**
   * tab切换
   */
  swichNav: function (e) {
    var cur = e.target.dataset.current
    if (this.data.currentTab == cur) { return false; }else {
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
    })
    this.initPrizeList()
  },
  // 立即领取
  goMyaddr: function (e) {
    // 未绑定号码
    if (!wx.getStorageSync('userMobile')) {
      this.showPhoneModalFn()
      return
    }
    let prizeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageActive/pages/jinyin/addr/addr?id=' + prizeId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 初始化中奖列表
   */
  initPrizeList: function () {
    let that = this
    let currentTab = that.data.currentTab
    wx.request({
      url: app.buildRequestUrl('getWinningPrize'),
      data: {
        youyouUserId: that.data.userId,
        prizeType: that.data.currentTabPrizeType[currentTab]
      },
      success: function (res) {
        var json = res.data
        if (json.code == 200) {
          that.updateTabList(currentTab, json.data, json.totalNum)
        }
      }
    })
  },
  /**
   * 更新对应的奖品列表 
   */
  updateTabList: function (currentTab, list, totalNum) {
    let tabList = this.data.tabList
    list.map(function (item, index) {
      if (!!item.prizeMoney) list[index]['prizeMoney'] = parseFloat(item.prizeMoney)
      if (!!item.createTime) list[index]['createTime'] = item.createTime.substring(0, 10)
      if (!!item.expiryTime) list[index]['expiryTime'] = item.expiryTime.substring(0, 10)
      if (!!item.sendEndTime) list[index]['sendEndTime'] = item.sendEndTime.substring(0, 10)
    })
    tabList[currentTab]['totalNum'] = !!totalNum ? parseFloat(totalNum) : 0
    tabList[currentTab]['list'] = list
    this.setData({tabList: tabList})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 初始化获取用户信息
    let userId = wx.getStorageSync('userId')
    let cityId = wx.getStorageSync('cityId')

    //  userId = 25136

    if (!!userId) this.setData({
        userId: userId
      })
    if (!!cityId) this.setData({
        cityId: cityId
      })

    // 初始化分享信息
    this.initShareInfo()

    // 初始化中奖列表(当前展示的项目)
    this.initPrizeList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 初始化分享信息
   */
  initShareInfo: function () {
    let that = this
    wx.request({
      url: app.buildRequestUrl('getShareMinProgram'),
      data: {
        cityId: that.data.cityId,
        youyouUserId: that.data.userId
      },
      success: function (res) {
        var json = res.data
        if (json.STATUS == 1) {
          that.setData({
            shareInfo: json.DATA
          })
        } else {
          console.log(json)
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let shareInfo = that.data.shareInfo

    // 如果接口没有返回对应的分享数据没有初始化成功, 则用默认的分享内容
    if (!shareInfo.shareAPPPath) shareInfo.shareAPPPath = 'packageActive/pages/jinyin/index/index'
    if (!shareInfo.shareAPPImgUrl) shareInfo.shareAPPImgUrl = 'http://uuhf.myfun7.com/uuhfWeb/images/activity/indexDialog.png'
    if (!shareInfo.shareAPPTitle) shareInfo.shareAPPTitle = '推荐一个找房神器，送现金，送iPhone Xs 还送买房补贴'

    return {
      title: shareInfo.shareAPPTitle,
      path: '/' + shareInfo.shareAPPPath,
      imageUrl: shareInfo.shareAPPImgUrl, // 分享图片路径
      success: function () {
        // 分享成功需要埋统计码
        app.aldstat.sendEvent('金九银十页面分享', {
          'page': '列表页面'
        })
      },
      complete: function () {
        console.log(url)
      }

    }
  },
  /** 跳转新页面 */
  skipNewPage: function (e) {
    let url = e.currentTarget.dataset.href
    if (!!url) {
      wx.navigateTo({url: url})
    }
  },
  /**
   * 提现
   */
  applyGeActivityMoney: function () {
    let that = this
    // 未绑定号码
    if (!wx.getStorageSync('userMobile')) {
      this.showPhoneModalFn()
      return
    }
    wx.request({
      url: app.buildRequestUrl('applyGeActivityMoney'),
      data: {
        cityId: that.data.cityId,
        youyouUserId: that.data.userId
      },
      success: function (res) {
        var json = res.data
        console.log(json)
        if (json.STATUS == 1) {
          // 判断是否第一次提现
          let firstFlag = wx.getStorageSync('jinyinFirstTixian')
          if (!!firstFlag) {
            wx.setStorageSync('jinyinFirstTixian', '1')
            wx.showModal({
              title: '温馨提示',
              content: json.INFO,
              showCancel: false,
              confirmColor: '#ff5400',
              confirmText: '我知道了'
            })
          }else {
            wx.showToast({
              icon: 'none',
              title: json.INFO
            })
          }
          // 提现申请成功 , 刷新列表
          that.initPrizeList()
        } else {
          wx.showToast({
            icon: 'none',
            title: json.INFO
          })
        }
      }
    })
  }
})
