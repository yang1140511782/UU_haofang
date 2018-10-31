var app = getApp();
let mgListPush = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '', //用户id
        cityId: '', //城市Id
        userInfo: {}, //用户信息
        shareInfo: '', //活动页的分享信息
        shareFrom: '', //分享来源
        shareId: '', //
        mgList: [],
        mgListCopy: [],
        prizeUserList: [],
        imgboxNum: 0,
        imgboxNumTwo: 240,
        imgboxNumThree: 480,
        prizeState: true, //抽奖进行状态
        lampJumpVal: true, //跑马灯闪烁
        bottomImg: 0,
        cashMoney: '', //现金红包金额
        prizeType: 0, //中奖类型
        remainder: 0, //剩余中奖次数
        prizeImg: '', //中奖图片
        paizeUserLoop: 0,
        prizeImgH:240, //单个奖品图滚动高度
        allLoopNum:3, //奖品渲染圈数
        awardReObj: {
          money:'20',
          prizeId:15,
          prizeType:1
        }, //中奖后数据
        prizeMoneyText: '',
        prizeBtnStart: true //按钮点击状态
    },
    //关闭弹出层
    closeModal() {
        this.setData({ prizeType: 0 });
    },
    // 根据圈数，生成奖品滚动集合
    prizeFinal(){
      for (let i = 0; i < this.data.allLoopNum; i++) {
          this.data.mgListCopy.forEach((item) => {
              mgListPush.push(item);
          })
      }
      this.setData({ mgList: mgListPush });
    },
    actionStart(){
      if (!this.data.prizeState) {return;}
      this.setData({ prizeState: false });
      mgListPush = [];
      this.setData({ imgboxNum: 0 }); 
      this.setData({ imgboxNumTwo: 240 }); 
      this.setData({ imgboxNumThree: 480 }); 
      let getStopY = this.getStopY();
      let getAllY = this.data.mgList.length * this.data.prizeImgH;
      // 中奖用户信息，回调滚动
      this.clickLotteryAction(() => {
          // 抽奖次数递减
          if (this.data.remainder > 0) {
              this.setData({ remainder: this.data.remainder -= 1 });
          }
          // 调用滚动动画
          this.prizeTwoY(getStopY, getAllY, this.data.imgboxNum);
          setTimeout(() => {
            this.prizeTwoY(getStopY, getAllY, this.data.imgboxNumTwo);
          }, 500)
          setTimeout(() => {
            this.prizeTwoY(getStopY, getAllY, this.data.imgboxNumThree);
          }, 1000)
      })
      // 设置按钮点击状态
      this.setData({ prizeBtnStart: false });
      setTimeout(() => {
          this.setData({ prizeBtnStart: true });
      }, 500);
      
    },
    // 获取停止滚动位置
    getStopY(){
      let awardReObj = this.data.awardReObj;
      let stopNum = 0;
      this.data.mgListCopy.forEach((item, index) => {
        // 中奖是否为购房补贴券
        if (awardReObj.prizeType == 1) {
          this.setData({ prizeMoneyText: '购房补贴' });
          if (item.prizeType == '2') {
            stopNum = (this.data.mgList.length - this.data.mgListCopy.length) + index;
          }
        }
        // 中奖是否为租房补贴券
        if (awardReObj.prizeType == 2) {
          this.setData({ prizeMoneyText: '租房补贴' });
          if (item.prizeType == '3') {
            stopNum = (this.data.mgList.length - this.data.mgListCopy.length) + index;
          }
        }
        // 中奖是否为实物奖品
        if (awardReObj.prizeType == 3) {
          if (item.id == awardReObj.prizeConFigId) {
            stopNum = (this.data.mgList.length - this.data.mgListCopy.length) + index;
            this.setData({ prizeImg: item.prizePhoto })
          }
        }
      })
      return stopNum * this.data.prizeImgH;
    },
    // 控制滚动轴
    /**
     * getStopY（停止位置），getAllY（总长度），imgboxNumval（滚动轴）
     */
  prizeTwoY(getStopY, getAllY, imgboxNumval){
      clearInterval(timer);
      let speed = 1;
      let speedMax = 30;
      let timer = setInterval(() => {
        if (imgboxNumval < getStopY - this.data.prizeImgH*2) {
          if (speed < speedMax){speed++;}
        }else{
          if (speed > 4) {speed--;}
        }
        if (imgboxNumval == this.data.imgboxNum){
          this.setData({ imgboxNum: (imgboxNumval += speed) });
        } else if (imgboxNumval == this.data.imgboxNumTwo){
          this.setData({ imgboxNumTwo: (imgboxNumval += speed) });
        } else if (imgboxNumval == this.data.imgboxNumThree){
          this.setData({ imgboxNumThree: (imgboxNumval += speed) });
        }
        if (imgboxNumval > getStopY) {
          clearInterval(timer);
          if (imgboxNumval == this.data.imgboxNumThree) {
              setTimeout(() => {
                  this.setData({ prizeState: true });
                  this.setData({ prizeType: this.data.awardReObj.prizeType });
              }, 1000)
          }
        }
      }, 10)
    },
    // 跑马灯闪烁
    lampJump() {
        let lampTime = setInterval(() => {
            this.setData({ lampJumpVal: !this.data.lampJumpVal });
        }, 500)
    },
    // 跳转到我的奖品
    goMyPrize() {
        wx.navigateTo({
            url: '/packageActive/pages/jinyin/list/list'
        })
    },
    // 设置用户获取现金红包
    initLoadPage() {
        let cityId = this.data.cityId || wx.getStorageSync('cityId');
        if (this.data.userId == '') { return }
        wx.request({
            url: app.buildRequestUrl('initLoadPage'),
            data: {
                youyouUserId: this.data.userId,
                cityId: cityId
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.STATUS === 1) {
                    let cashmoney = res.data.DATA.cashMoney || '';
                    this.setData({ cashMoney: cashmoney });
                    // 是否显示现金红包弹层
                    if (this.data.cashMoney > 0) {
                        this.setData({ prizeType: 5 });
                      this.setData({ prizeMoneyText: '十元可提现红包' });
                    }
                } else {
                    wx.showToast({ title: res.data.INFO, icon: 'none' });
                }
            },
        });
    },
    // 获取初始信息
    getUserActInfo() {
        let userId = this.data.userId || wx.getStorageSync('userInfo');
        wx.request({
            url: app.buildRequestUrl('getUserActInfo'),
            data: {
                wxId: this.data.userId
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === 200) {
                    let $r = res.data.data;
                  this.setData({ mgListCopy: $r.prizeConfig });
                    // 初始化奖品滚动列表
                    this.prizeFinal();
                    if ($r.customShare) {
                        this.setData({ remainder: $r.customShare.rewardCount });
                        if ($r.customShare.rewardCount == null || $r.customShare.rewardCount == '') {
                            this.setData({ remainder: 0 });
                        }
                    }
                    // 设置横排奖品列表长度
                    let bottomImgWith = 174 * $r.prizeConfig.length;
                    this.setData({ bottomImg: bottomImgWith })
                }
            },
        });
    },
    // 获取中奖数据
    clickLotteryAction(callBack) {
        let cityId = this.data.cityId || wx.getStorageSync('cityId');
        // 如果抽奖总次数低于零，提示ui弹出层
        if (this.data.remainder <= 0) {
            this.setData({ prizeType: 4 });
        }
        wx.request({
            url: app.buildRequestUrl('clickLotteryAction'),
            data: {
                youyouUserId: this.data.userId,
                cityId: cityId,
                shareId: this.data.shareId
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.STATUS === 1) {
                    this.setData({ awardReObj: res.data.DATA })
                    callBack();
                } else {
                    this.setData({ prizeState: true });
                    // 如果抽奖总次数大于零，提示showToast
                    if (this.data.remainder > 0) {
                        wx.showToast({ title: res.data.INFO, icon: 'none' });
                    }
                }
            },
        });
    },
    // 获取中奖用户列表
    getWinningPrizeList() {
        wx.request({
            url: app.buildRequestUrl('getWinningPrizeList'),
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === 200) {
                    this.setData({ prizeUserList: res.data.data });
                }
            },
        });
    },
    // 中奖用户列表滚动动画
    prizeUserListFn() {
        setInterval(() => {
            let time = setInterval(() => {
                this.setData({ paizeUserLoop: this.data.paizeUserLoop += 1 });
                if (this.data.paizeUserLoop > (this.data.prizeUserList.length - 1) * 64) {
                    this.setData({ paizeUserLoop: 0 });
                }
                if (this.data.paizeUserLoop % 64 == 0) {
                    clearInterval(time);
                }
            }, 1);
        }, 4000)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //初始化获取用户信息
        let userId = wx.getStorageSync('userId');
        let cityId = wx.getStorageSync('cityId');

        //测试 : 
        // userId = 16873, cityId=1

        if (!!userId) this.setData({ userId: userId })
        if (!!cityId) this.setData({ cityId: cityId })

        //获取分享信息
        let shareId = !!options.shareId ? options.shareId : '';
        let shareFrom = !!options.shareFrom ? options.shareFrom : '';
        if (!!shareId) {
            shareFrom = '用户分享'
        } else {
            shareFrom = '优优首页'
        }
        this.setData({
            shareId: shareId,
            shareFrom: shareFrom
        })

        //页面访问 时 设置页面访问统计 
        app.aldstat.sendEvent('金九银十页面访问', {
            '来源': shareFrom
        })

        //初始化分享信息
        this.initShareInfo()
            // 调用初始化信息函数
        this.getUserActInfo();
        // 调用获奖用户列表函数
        this.getWinningPrizeList();
        // 调用获奖用户滚动动画
        this.prizeUserListFn();
        // 调用跑马灯
        this.lampJump();
        // 调用设置现金红包
        this.initLoadPage();
    },

    /**
     * 初始化分享信息
     */
    initShareInfo: function() {
        let that = this
        let cityId = that.data.cityId || wx.getStorageSync('cityId');
        if (!that.data.userId) return;
        wx.request({
            url: app.buildRequestUrl('getShareMinProgram'),
            data: {
                cityId: cityId,
                youyouUserId: that.data.userId
            },
            success: function(res) {
                var json = res.data;
                if (json.STATUS == 1) {
                    that.setData({
                        shareInfo: json.DATA,
                        shareId: json.DATA.shareId
                    })
                } else {}
            }
        })

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //如果当前未授权 ,则 展示 添加授权蒙层
        if (!!wx.getStorageSync('userInfo')) {
            this.setData({
                userInfo: wx.getStorageSync('userInfo')
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let that = this
        let shareInfo = that.data.shareInfo

        //如果接口没有返回对应的分享数据没有初始化成功, 则用默认的分享内容
        if (!shareInfo.shareAPPPath) shareInfo.shareAPPPath = 'packageActive/pages/jinyin/index/index'
        if (!shareInfo.shareAPPImgUrl) shareInfo.shareAPPImgUrl = 'http://uuhf.myfun7.com/uuhfWeb/images/activity/indexDialog.png'
        if (!shareInfo.shareAPPTitle) shareInfo.shareAPPTitle = '推荐一个找房神器，送现金，送iPhone Xs 还送买房补贴'
        
        return {
            title: shareInfo.shareAPPTitle,
            path: '/' + shareInfo.shareAPPPath,
            imageUrl: shareInfo.shareAPPImgUrl, //分享图片路径
            success: function() {
                //分享成功需要埋统计码
                app.aldstat.sendEvent('金九银十页面分享', {
                    'page': '活动首页'
                })
            },
            complete: function() {}
        }

    },
    /**
     * 授权弹层回调( 内含 新用户点击分享逻辑)
     */
    getUser: function(e) {
        let that = this;
        let userInfo = e.detail.rawData;
        //更新当前 用户信息缓存
        if (!!userInfo) {
            that.setData({
                userInfo: JSON.parse(userInfo)
            });
            //设置缓存
            wx.setStorageSync('userInfo', JSON.parse(userInfo));
        }

        wx.login({
            success: function(loginRes) {
                if (loginRes.code) {
                    wx.request({
                        url: app.buildRequestUrl('dealUserInfo'),
                        data: {
                            code: loginRes.code,
                            userInfo: e.detail
                        },
                        success: function(res) {
                            var json = res.data;
                            if (json.STATUS == 1) {
                                try {
                                    wx.setStorageSync('userId', json.DATA.userId);
                                    wx.setStorageSync('openId', json.DATA.openId);
                                    app.globalData.userId = json.DATA.userId;
                                    app.globalData.openId = json.DATA.openId;
                                    if (!!json.DATA.userInfo && !!json.DATA.userInfo.wxMobile) {
                                        wx.setStorageSync('userMobile', json.DATA.userInfo.wxMobile);
                                    }
                                    that.setData({
                                        userId: json.DATA.userId
                                    });

                                    that.getUserActInfo();
                                    that.initLoadPage();
                                    that.initShareInfo()

                                    if (!that.data.shareId) return;
                                    //新授权 用户 点击分享 出来的活动页统计 , 则请求新用户授权访问接口
                                    let cityId = that.data.cityId || wx.getStorageSync('cityId');
                                    wx.request({
                                        url: app.buildRequestUrl('clickShareActivity'),
                                        data: {
                                            cityId: cityId,
                                            youyouUserId: that.data.userId,
                                            shareId: that.data.shareId
                                        },
                                        success: function(res) {
                                            var json = res.data;
                                            if (json.STATUS == 1) {
                                                //
                                            } else {}
                                        }
                                    })

                                } catch (e) {}
                            }
                        },
                        fail: function(res) {},
                        complete: function() {
                            let userId = wx.getStorageSync('userId');
                            let cityId = wx.getStorageSync('locateCityId');
                            app.bindCity(userId, cityId);
                        }
                    });
                } else {}
            }
        })

    },
})