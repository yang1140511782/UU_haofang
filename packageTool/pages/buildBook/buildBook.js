// packageTool/pages/buildBook/buildBook.js
var app = getApp()
var api = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    archiveId: '',
    userId: '',
    openId: '',
    userInfo: '',
    shareArchiveId: '',
    buildData: '', // 新盘信息
    lazyLoad: true,
    bookToLookBox: false,
    // 绑定手机弹出表单
    forData: {
        userName: '',
        userPhone: '',
        phoneCode: ''
      },
    testCodeTime: 0, // 发送短信倒计时
    phoneModalFlag: false
  },
  /**
   * 返回首页
   */
  indexBtnEvent:function(){
    wx.switchTab({
      url: '/pages/real_index/index'
    })
  },
  /** 点击预约看房 */
  goToEntrust: function () {

    this.showPhoneModalFn()
  },
  /**
   * 咨询置业顾问
   */
  chooseContactType: function (e) {
    wx.navigateTo({
      url: '/pages/im/im?to=' + this.data.archiveId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // archiveId=11&caseType=6&cityId=1&caseId=2037657&reSource=1
    let archiveId = options.archiveId || options.archive_id
    let caseType = options.caseType || options.casetype
    let cityId = options.cityId || options.cityid
    let caseId = options.caseId || options.caseid
    let reSource = options.reSource || options.resource

    //
    if (options.source == 'uuapp' || options.source == 'zshft' || options.source == 'personalStore') {
      if (options.activity == 1) {
        wx.setStorageSync('shareArchiveId', archiveId)
        wx.setStorageSync('shareCaseType', caseType)
        wx.setStorageSync('shareCityId', cityId)
        wx.setStorageSync('shareCaseId', caseId)
      }

      this.setData({
        shareArchiveId: archiveId
      })
    }

    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    });

    // 分享用户访问统计
    if (wx.getStorageSync('userId') && wx.getStorageSync('openId')) {
      if (wx.getStorageSync('shareArchiveId')) {
        wx.request({
          url: app.buildRequestUrl('stimulerBroker'),
          data: {
            openId: wx.getStorageSync('openId'),
            caseType: wx.getStorageSync('shareCaseType'),
            cityId: wx.getStorageSync('shareCityId'),
            caseId: wx.getStorageSync('shareCaseId'),
            shareArchiveId: wx.getStorageSync('shareArchiveId'),
            youyouUserId: wx.getStorageSync('userId')
          }
        })
      }
    }

    this.setData({
      userId: wx.getStorageSync('userId'),
      openId: wx.getStorageSync('openId'),
      buildCityId: cityId,
      buildCaseId: caseId,
      archiveId: archiveId,
    })
    // 获取新盘楼书信息
    wx.request({
      url: app.buildRequestUrl('miniBuildingBookForNewHouse'),
      data: {
        archiveId: archiveId,
        caseType: caseType,
        cityId: cityId,
        caseId: caseId,
        reSource: reSource
      },
      success: (res) => {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            let resData = res.data.data
            this.setData({buildData: resData})
            // 动态设置页面标题
            wx.setNavigationBarTitle({
              title: resData.buildName,
              success: function (res) {
                // success
              }
            })
          }else {
            console.log(res.data.msg)
          }
        }
      }
    })
  },
  getUser: function (e) {
    var that = this
    wx.login({
      success: function (loginRes) {
        if (loginRes.code) {
          wx.request({
            url: app.buildRequestUrl('dealUserInfo'),
            data: {
              code: loginRes.code,
              userInfo: e.detail
            },
            success: function (res) {
              var json = res.data
              console.log(json)
              if (json.STATUS == 1) {
                try {
                  wx.setStorageSync('userId', json.DATA.userId)
                  wx.setStorageSync('openId', json.DATA.openId)
                  app.globalData.userId = json.DATA.userId
                  app.globalData.openId = json.DATA.openId
                  that.setData({ 
                    userId: json.DATA.userId,
                    openId: json.DATA.openId,
                   })

                  var shareArchive = wx.getStorageSync('shareArchiveId')
                  var shareUserId = wx.getStorageSync('shareUserId')
                  var shareCaseType = wx.getStorageSync('shareCaseType')
                  var shareCityId = wx.getStorageSync('shareCityId')
                  var shareCaseId = wx.getStorageSync('shareCaseId')
                  var youyouUserId = json.DATA.userId
                  if (!!shareArchive) {
                    wx.request({
                      url: app.buildRequestUrl('stimulerBroker'), // 2018.08.24  lwj
                      data: {
                        openId: json.DATA.openId,
                        caseType: shareCaseType,
                        cityId: shareCityId,
                        caseId: shareCaseId,
                        shareArchiveId: shareArchive,
                        youyouUserId: youyouUserId,
                        come: wx.getStorageSync('come')
                      }
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
                // 调用一下是否显示蒙层
                that.showMaskBox()
              }
            },
            fail: function (res) {
              console.log('刷新session失败！')
              console.log(res)
            },
            complete: function () {
              let userId = wx.getStorageSync('userId')
              let cityId = wx.getStorageSync('locateCityId')
              app.bindCity(userId, cityId)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  // 展示蒙层
  showMaskBox: function () {
    var _this = this
    // 获取当前页面层级
    var getCurrentPagesLength = getCurrentPages().length
    if (getCurrentPagesLength == 1) {
      // 分享出来页面右下角都要显示
      _this.setData({ backToIndexBtn: true })
      // 如果分享出来的详情页为首页,则展示首页按钮
      var userId = wx.getStorageSync('userId')
      wx.request({
        url: app.buildRequestUrl('hasFormIdUrl'),
        data: {
          youyouUserId: userId
        },
        success: function (res) {
          if (res.data.hasForm == 0) {
            _this.setData({ guideBackIndex: true })
          }
        }
      })
    }
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
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none'
          })
          return false
        } else {
          return true
        }
      },
      // 获取验证码
      getTestCode() {
        let that = this
        if (this.data.forData.userPhone == '') {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          })
          return
        }
        // 验证手机号
        if (!this.testPhoneNum()) {
          return
        }

        let reduceTime = 60
        wx.request({
          url: app.buildRequestUrl('sendMsg'),
          data: {
            mobile: this.data.forData.userPhone
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.status === 1) {
              wx.showToast({
                title: res.data.info,
                icon: 'none'
              })
              that.setData({
                testCodeTime: reduceTime
              })
              let codeTime = setInterval(() => {
                reduceTime -= 1
                if (that.data.testCodeTime < 1) {
                  clearInterval(codeTime);
                  return;
                }
                that.setData({
                  testCodeTime: reduceTime
                })
                
              }, 1000)
            } else {
              wx.showToast({
                title: res.data.info,
                icon: 'none'
              })
              that.setData({
                testCodeTime: 0
              })
            }
          }
        })
      },


      // 关闭 预约看房 弹出
      closePhoneModalFn() {
        this.setData({
          phoneModalFlag: false
        })
      },
      // 弹出 预约看房 弹出
      showPhoneModalFn() {
        this.setData({
          phoneModalFlag: true
        })
      },
      /**
       * 提交预约看房信息
       */
      submitBindPhone: function () {
        let that = this
        if (this.data.forData.userName == '') {
          wx.showToast({
            title: '请输入姓名',
            icon: 'none'
          });
          return;
        }
        if (this.data.forData.userPhone == '') {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          });
          return;
        }
        if (this.data.forData.phoneCode == '') {
          wx.showToast({
            title: '请输验证码',
            icon: 'none'
          });
          return;
        }
        wx.showLoading({
          title:'提交中',
          mask:true
        })
        wx.request({
          url: app.buildRequestUrl('saveIntentionCustomerInfo'),
          data: {
            cityId: wx.getStorageSync('cityId'),
            bCityId: that.data.buildCityId,
            buildId: that.data.buildCaseId,
            custName: that.data.forData.userName,
            custMobile: that.data.forData.userPhone,
            code: that.data.forData.phoneCode,
            archiveId: that.data.archiveId

          },
          success: function (res) {
            var json = res.data
            console.log(json)
            wx.hideLoading()
            if (json.code == 1) {
              // 提交成功
              wx.showToast({
                title: json.msg,
                icon: 'none'
              })
              that.closePhoneModalFn(); // 关闭绑定弹窗
            } else {
              
              wx.showToast({
                title: json.msg,
                icon: 'none'
              })
            }
            // 验证完毕, 重置验证码发送机制 
            that.setData({
              testCodeTime: 0
            })
          }
        })
      },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
