//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   publishEntrustShow:false,//发布委托的弹框
   prizeTrustBompShow:false,//有奖委托收到奖励金
  },
  onLoad: function () {
   
  },
  /**
   * 点击发布按钮
   */
  fabuTrustEvent:function(e){
    var _this=this;
    _this.setData({
      publishEntrustShow:true,
    })
  },
  publishCancleEvent:function(e){
     var _this=this;
    _this.setData({
      publishEntrustShow:false,
    })
  }
})
