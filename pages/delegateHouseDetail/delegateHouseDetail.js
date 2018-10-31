var app = getApp();
Page({
    data: {
        caseId: 0,
        caseType: 1,
        cityId: null,
        reSource: 1,
        fromDetail:'',
        picUrl: [],//房源图片数组
        videoUrlPath: '',//视频地址
        videoTopPicUrlPath: '',//视频预览图片地址,
        houseSubject: '',
        tagArr: [],//房源标签
        isCollected: 0,//收藏五角星的显示状态，1是收藏，0是未收藏
        agentCont: false,//控制咨询经纪人显示
        allAgentCont: false,//控制群发委托显示
        yezhuCont: false,//控制咨询业主显示
        hezu:false,
        indicatorDots: false,//swiper是否显示面板指示点
        autoplay: false,//自动切换
        loadingFlag:true,
        interval: 5000,
        duration: 500,
        currentPic: 1,
        totalPics: 0,
        houseSubject: '',
        houseTotalPrice: '',
        unitPrice: '',
        priceUnitCn: '',
        houseUseageCn: '住宅',
        totalPrice: '',
        houseArea: '',
        houseRoom: '0',
        houseHall: '0',
        houseWei: '0',
        buildType:'--',
        houseFitmentCn: '--',
        houseDirectCn: '--',
        houseYear: '--',
        houseFloor: '--',
        houseFloors: '--',
        buildName: '',
        rightYears: '--',
        costStandard: '--',
        projectGreen: '--',
        projectSpace: '--',
        submitDate: '--',
        builder: '--',
        propertyComp: '--',
        buildDescript: '--',
        busLine: '--',
        addCase: '--',
        houseList: [],
        buildPositionx: 0,
        buildPositiony: 0,
        panoramaMap:0,
        vrUrl:'',
        videoPhoto: 'btn-video',
        picFlag: false,
        trueFlag:0,
        imgLists: [],//轮播图路径
        totalImg: 0,//轮播图总张数
        sealedHouse:false,//房源下架弹框控制显示
        toastMask:false,//弹框外层
        guideToast:false,//引导弹框
        leadToast:false,//引导弹框显示控制
        footerNav:false,//底部
        lazyLoad:true,
        discountStatus:false,//折扣弹框
        userPhone:'',//用户电话
        collectToast:false,//收藏
        collectTxt:"",//收藏提示
        map: {
            lat: 0,
            lng: 0,
            markers: [],
            hasMarkers: false
        },
        mapIcon: [
          { 
            iconUrl:"http://cdn.haofang.net/static/uuminiapp/icon/transport.png",
            txt:"公交",
            typeId:"bus"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/subway.png",
            txt: "地铁",
            typeId: "subway"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/school.png",
            txt: "学校",
            typeId: "school"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/hospital.png",
            txt: "医院",
            typeId: "hospital"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/bank.png",
            txt: "银行",
            typeId: "bank"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/leisure.png",
            txt: "休闲娱乐",
            typeId: "leisure"
          },
          {
            iconUrl: "http://cdn.haofang.net/static/uuminiapp/icon/shopping.png",
            txt: "购物",
            typeId: "shopping"
          },
          ],
        closeCont: false,//小区信息展开控制
        houseShowTitle: true, //小区信息查看更多文章更换
        closepic: false,
        footerShow: false,
        videoShowLater: false,
        boxShow: true,//外层盒子
        shareUrl: '',
        showmor: true,
        showtitle: true,
        showmorZb: true,//周边信息
        showtitleZb: true,//周边信息
        zbShowTitle: true, //周边信息查看更多文章更换
        zbClosepic: false,//周边
        lookMoreHide: true,//查看更多隐藏
        lookMoreZbHide: true,//周边查看更多隐藏
        wHeight:'',//屏幕高度
        toView:'aaa',
        scrollTop:100,
        morejt: 'http://cdn.haofang.net/static/uuminiapp/detail/arrow_down.png',
        btnHiden: true,
        currUserMobile:'',
        currUserName:'',
        currUserPhotoUrlPath:'http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png',
        //小区专家相关
        buildOwnerArchiveId:'',
        buildOwnerName:'',
        buildOwnerPicUrl:'',
        buildOwnerMobile:'',
        buyMoney:"",
        rentMoney:"",
        serviceRegs:"",
        buildIntegrity:0,
        buildOwnerHouseList:[],
        gpBrokerList:[],//挂牌经纪人数组,
        gpBrokerCount:'',//挂牌经纪人数
        ownerName:'',
        setting:[],
        archiveId:'',
        buildRegionId: '',
        sectionId: '',
        regionName: '',
        sectionName: '',
        recomInfoId:'',
        userId:'',//
        isVip:'',
        showKanFang:false,
        isOwner:false,
        evaluateValue:'',//房价评估数据
        ratioByLastMonthForPrice:'',
        ratioByLastYearForPrice:'',
        AgentUserId:''//经纪人ID
    },
    videoPhotoChange: function (e) {
        var currentBtn = this.data.videoPhoto == 'btn-video' ? 'btn-photo' : 'btn-video';
        var picFlag = this.data.picFlag ? false : true;
        this.setData({
            videoPhoto: currentBtn,
            picFlag: picFlag
        });
    },
    onLoad: function (options) {
      var _this = this
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            wHeight: res.windowHeight -50
          })
        }
      })
       this.setData({ caseId: options.caseId||options.caseid, caseType: options.caseType||options.casetype, cityId: options.cityId||options.cityid, reSource: options.reSource||options.resource,fromDetail: options.fromDetail||options.fromdetail});
      //出租
        this.initData();
       
    },
    initData: function () {//初始化页面数据
        var info = this.data;
        var that = this;
        wx.request({
            url: app.buildRequestUrl('getVipCaseInfo') + "?caseId=" + info.caseId + "&caseType=" + info.caseType + "&cityId=" + info.cityId,
            success: function (res) {
                var status = res.data.STATUS;
                if(status != 1){
                	//alert('该房源已下架');
                    //wx.navigateBack();
                    //return;
                }
              
                var info = res.data.DATA;
                var picUrlArr = [], videoNum = 0;
                if (!!info.photoList) {
                    var photoList = info.photoList;
                    for (var i = 0; i < photoList.length; i++) {
                        if (!!(photoList[i].picUrl)) {
                            picUrlArr.push(photoList[i].picUrl);
                        }
                    }
                    that.setData({ picUrl: picUrlArr });
                }
                if (!!info.videoUrlPath) {
                    that.setData({ videoUrlPath: info.videoUrlPath, videoTopPicUrlPath: info.videoTopPicUrlPath });
                    videoNum = 1;
                }
                that.setData({ totalImg: picUrlArr.length + videoNum });
                that.dealData(info, 'houseSubject');
                that.dealData(info, 'isCollected');
                that.dealData(info, 'houseTotalPrice');
                that.dealData(info, 'unitPrice');
                that.dealData(info, 'priceUnitCn');
                that.dealData(info, 'houseRoom');
                that.dealData(info, 'houseHall');
                that.dealData(info, 'houseWei');
                if ((!!info.houseArea) && info.houseArea > 0) {
                    that.setData({ houseArea: info.houseArea });
                }
                if (!!info.houseTagDesc) {
                    var tagArr = info.houseTagDesc.split("|");
                    that.setData({ tagArr: tagArr });
                }
                that.dealData(info, 'houseUseageCn');
                that.dealData(info, 'houseFitmentCn');
                that.dealData(info, 'houseDirectCn');
                that.dealData(info, 'houseYear');
                that.dealData(info, 'houseFloor');
                that.dealData(info, 'houseFloors');
                that.dealData(info, 'houseDesc');
                that.dealData(info, 'buildName');
                that.dealData(info, 'buildType');
                that.dealData(info, 'rightYears');
                that.dealData(info, 'costStandard');
                that.dealData(info, 'projectGreen');
                that.dealData(info, 'projectSpace');
                that.dealData(info, 'submitDate');
                that.dealData(info, 'builder');
                that.dealData(info, 'propertyComp');
                that.dealData(info, 'buildDescript');
                that.dealData(info, 'busLine');
                that.dealData(info, 'addCase');
                that.dealData(info, 'buildPositionx');
                that.dealData(info, 'buildPositiony');
                that.dealData(info, 'houseList');
                that.dealData(info, 'panoramaMap');
                that.dealData(info, 'trueFlag');
                that.dealData(info, 'currUserMobile');
                that.dealData(info, 'currUserName');
                that.dealData(info, 'currUserPhotoUrlPath');
                that.dealData(info, 'archiveId');
                that.dealData(info, 'buildOwnerArchiveId');
                that.dealData(info, 'buyMoney');
                that.dealData(info, 'rentMoney');
                that.dealData(info, 'serviceRegs');
                that.dealData(info, 'buildOwnerName');
                that.dealData(info, 'buildOwnerPicUrl');
                that.dealData(info, 'buildOwnerMobile');
                that.dealData(info, 'buildIntegrity');
                that.dealData(info, 'buildOwnerHouseList');
                that.dealData(info, 'gpBrokerList');
                that.dealData(info, 'gpBrokerCount');
                that.dealData(info, 'ownerName');
                that.dealData(info, 'setting');
                that.dealData(info, 'buildRegionId');
                that.dealData(info, 'sectionId');
                that.dealData(info, 'regionName');
                that.dealData(info, 'sectionName');
                that.dealData(info, 'sectionName');
                if(that.data.panoramaMap>0){
                	var vrUrl = 'https://pano.haofang.net/pano/pano720.jsp?CITY_ID='+that.data.cityId+'&CASE_TYPE='+that.data.caseType+'&CASE_ID='+that.data.caseId+'&APP_SOURCE=1&SOURCE=WEB&SSL=1';
                	that.setData({vrUrl:vrUrl});
                }
                if(!!info.houseSetCn){
                	that.setData({houseSetCn:info.houseSetCn.split("||")});
                }
                if (!that.data.houseDesc || that.data.houseDesc.length < 150) {
                  that.setData({
                    lookMoreHide: false
                  })
                }
                if (!that.data.addCase || that.data.addCase.length < 100) {
                  that.setData({
                    lookMoreZbHide: false
                  })
                }
                console.log(that.data.lookMoreHide)
                var buildOwnerHouseList = that.data.buildOwnerHouseList;
                if(buildOwnerHouseList){
                	for(var i=0;i<buildOwnerHouseList.length;i++){
                		var desc = buildOwnerHouseList[i].houseTagDesc;
                		if(!!desc){
                			buildOwnerHouseList[i].houseTagDesc = desc.split("|");
                		}
                	}
                	that.setData({buildOwnerHouseList:buildOwnerHouseList});
                }
                //判断底部按钮显示情况
                if(that.data.reSource==1 && that.data.trueFlag>0){//真房源
                	that.setData({agentCont:true});
                }else if(that.data.reSource==1 && that.data.trueFlag==0){//普通ERP经纪人房源
                	that.setData({allAgentCont:true,gpBrokerCount:4});//现在先群发
                }else if(that.data.reSource==2){//搜搜中介房源,也就是挂牌房源,展示挂牌经纪人
                	that.setData({allAgentCont:true});
                }else if(that.data.reSource==3||that.data.reSource==4 && (!that.data.isOwner)){//搜搜个人和优优好房个人, 3和4一样展示房东和咨询业主按钮，点击咨询业主按钮，提示下载
                	that.setData({yezhuCont:true});
                }else if(that.data.reSource==5){//搜搜合租 显示X先生/女士 和咨询业主电话，点击咨询业主直接拨打真实电话
                	that.setData({hezu:true});
                }
                console.log(11)
                 //请求房价评估
                that.requstEvaluate();
            },
             fail: function () {
                 //该房源已下架
            	 //alert('该房源已下架');
                //  wx.navigateBack({
                //      delta: 1,
                //  })
             },complete:function(){
            	 that.setData({
                 loadingFlag:false,
                 footerNav:true
                 });
             }
        })
    },
    onShareAppMessage: function () {

    },
    onReady: function () {
        // 页面渲染完成
    },
    /*vr点击跳转*/
    vrBtnTo: function (e) {
        wx.navigateTo({
            url: '/packageWeb/pages/vr/vr?caseId='+this.data.caseId+"&caseType="+this.data.caseType+"&cityId="+this.data.cityId
        })
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    errImg: function (ev) {
        console.log(ev);
        //需要访问当前页面的数据对象传递到其它页面上
        var _that = this;
        common.errImgFun(ev, _that, 'avatar');
    },
    changePic: function (e) {
        var current = e.detail.current;
        this.setData({
            currentPic: current + 1
        });
    },
    /**
     * 播放视频
     */
    playVideo: function () {
        var that = this;
        that.setData({
            videoShow: true,
            boxShow: false
        })
        setTimeout(function () {//视频延迟加载
            that.setData({
                videoShowLater: true,
            })
        }, 500)
    },
    closeBtn: function () {//关闭视频
        this.setData({
            videoShow: false,
            boxShow: true
        })
    },
    moreBtn: function () {//点击查看更多
        var that = this,
            showss = !that.data.showmor,
            showtt = !that.data.showtitle,
            closess = !that.data.closepic;
        that.setData({
            showmor: showss,
            showtitle: showtt,
            closepic: closess
            // btnHiden:false
        })
    },

    closeBtn: function () {//关闭视频
        this.setData({
            videoShow: false,
            boxShow: true
        })
    },
    moreBtn: function () {//点击查看更多
        var that = this,
            showss = !that.data.showmor,
            showtt = !that.data.showtitle,
            closess = !that.data.closepic;
        that.setData({
            showmor: showss,
            showtitle: showtt,
            closepic: closess
            // btnHiden:false
        })
    },
    moreZbBtn: function () {//周边信息点击查看更多
        var that = this,
            zbShowss = !that.data.showmorZb,
            zbShowtt = !that.data.showtitleZb,
            zbClosess = !that.data.zbClosepic;
        that.setData({
            showmorZb: zbShowss,
            showtitleZb: zbShowtt,
            zbClosepic: zbClosess
            // btnHiden:false
        })
    },
    /*
    *小区信息查看更多
    */
    houseMoreBtn: function () {
        var that = this,
            houseshowtt = !that.data.houseShowTitle,
            closess = !that.data.closeCont;
        that.setData({
            houseShowTitle: houseshowtt,
            closeCont: closess
        })
    },
    /** 
     * 图片全屏预览
     */
    getImageInfo: function (e) {
        var that = this;
        var currentImage = e.currentTarget.dataset.image;
        var imageArr = that.data.picUrl;

        wx.previewImage({
            current: currentImage,// 当前显示图片的http链接
            urls: imageArr // 需要预览的图片http链接列表
        })
    },
    /** 
     * 房价评估跳转
     */
    calculator: function (e) {//房贷计算器跳转
        var url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    },
    /** 
     * 地图跳转
     */
    goToMap: function (e) {
      var _this = this;
      var _type = e.currentTarget.dataset.type,
        _lat = _this.data.buildPositionx,
        _long = _this.data.buildPositiony,
        _buildName = this.data.buildName;
      var _status = e.currentTarget.dataset.status;
      if (_status =="查看全部"){
        wx.navigateTo({
          url: '/packageTool/pages/map/map?lat=' + _lat + '&lng=' + _long + '&buildName=' + _buildName
        })
      }else{
        wx.navigateTo({
          url: '/packageTool/pages/map/map?type=' + _type + '&lat=' + _lat + '&lng=' + _long + '&buildName=' + _buildName
        })
      }   
    },
    dealData: function (info, item, setValue) {
        var v = info[item];
        if (setValue !== undefined) {
            var json = {};
            json[item] = setValue;
            this.setData(json);
        } else if (v !== undefined) {
            var json = {};
            json[item] = v;
            this.setData(json);
        }
    }
    ,dial:function(e){//拨打电话
//        this.setData({
//          toastMask: true,
//          sealedHouse: false,
//          guideToast: true,
//          leadToast: false,
//        })
    	this.setData({toastMask:false,
            guideToast: false,
            toastMask:false
        });
     	wx.makePhoneCall({
		   phoneNumber: e.currentTarget.dataset.mobile
		 });
    },
    houseDetail:function(e){//跳转到其他房源详情页
    	wx.redirectTo({
		  url: e.currentTarget.dataset.url
		})
    },
     /** 
     * 小区专家咨询点击
     */
    zjAgentChat:function(){
        this.setData({
          discountStatus:true
        })
    },
    /** 
     * 折扣弹框隐藏
     */
    diCloseBtn:function(){
      this.setData({
        discountStatus: false
      })
    },
    /** 
     * 我要买房点击跳转
     */
    goToBuyHouseBtn:function(e){
      var _this = this;
      var _buildOwnerArchiveId = e.currentTarget.dataset.buildownerarchiveid;
      var _buildOwnerMobile = e.currentTarget.dataset.buildownermobile;
      var _buildOwnerName = e.currentTarget.dataset.buildownername;
      var _rentMoney = e.currentTarget.dataset.rentmoney;
      var _buyMoney = e.currentTarget.dataset.buymoney;
      var _serviceRegs = e.currentTarget.dataset.serviceregs;
      var _buildOwnerPicUrl = e.currentTarget.dataset.buildownerpicurl;
      var _userPhone = _this.data.userPhone;
      var caseType = "";
      if (_this.data.caseType == 1) {
        caseType = 3;
      } else {
        caseType = 4;
      }
      wx.navigateTo({
	      url: '/pages/entrust/entrust?archiveId=' + _buildOwnerArchiveId + '&userMobile=' + _buildOwnerMobile + '&userName=' + _buildOwnerName + '&rentMoney=' + _rentMoney + '&buyMoney=' + _buyMoney + '&serviceRegs=' + _serviceRegs + '&userPhoto=' + _buildOwnerPicUrl + '&caseType=' + caseType,
	    })
    },
    /** 
     * 我要出租，出售点击跳转
     */
    goToEntrustLiBtn:function(){
      var _this = this;
      var _userPhone = _this.data.userPhone;
      var goToUrl="";
      if (_this.data.caseType == 1) {
        goToUrl = "/pages/registration/registration?caseType=1"
      } else {
        goToUrl = "/pages/registration/registration?caseType=2"
      }
      wx.navigateTo({
		  url: goToUrl,
	  })
    },
    /** 
     * 弹框蒙层点击隐藏
     */
    maskHideBtn:function(){
        this.setData({
          toastMask:false
        })
    },
    /** 
     * 房源下架弹框确定点击
     */
    outedHouseBtn:function(){
      wx.navigateTo({
        url: '',
      })
      this.setData({
        toastMask: false
      })
    },
    /** 
     * 联系方式在线聊天点击
     */
    onlineChat:function(e){
      var _this = this;
      _this.setData({
        toastMask:false
      })
    	wx.navigateTo({
            url: "/pages/im/im?to="+e.currentTarget.dataset.archive+"&caseId="+this.data.caseId+"&caseType="+this.data.caseType
        })
    },
    downBtn: function (e) {
      this.setData({
        toastMask:true,
        toView:"lead-down",
        sealedHouse: false,
        guideToast: false,
        leadToast: true,
      })
    },
    chooseContactType:function(){
    	this.setData({toastMask:true,
            guideToast: true
        });
    },
    /*引导下载板块点击*/
    goToDownLoad: function () {
      wx.navigateTo({
        url: "/packageWeb/pages/download/download",
      })
    },
    /** 
     * 拒绝看房
     */
    disagreen4Daikan:function(){
    	var that = this;
	  	  wx.request({
	  		  url: app.buildRequestUrl('disagreen4Daikan'),
	  		  data:{
	  			recomInfoId:that.data.recomInfoId,
	        	isVip:that.data.isVip,
	  		  },
	  		  success: function (res) {
	  			  var status = res.data.STATUS;
	  			  if(status==1){
	  				  that.setData({noSeeConfirmBox:false});
	  		        	wx.showToast({
	  	      			  title: '操作成功',
	  	      			  icon: 'success',
	  	      			  duration: 1500,
	  	      			  success:function(){
	  	      				  wx.redirectTo({
	  	      					  url:'/pages/entrustDetail/entrustDetail?pushLogId='+that.data.pushLogId
	  	      				  });
	  	      			  }
	  	      			});
	  	        	}else{
	  	        		wx.showToast({
	  	        			title: '未知错误',
	  	  				  image:'../../images/warning.png',
	  	  				  duration: 1500,
	  	  				  success:function(){
	  	  	  			  }
	  	  				});
	  	        	}
	  		  }
	  	  })
    },
    /** 
     * 同意看房
     */
    agreen4Daikan: function () {
    	var that = this;
	    wx.request({
	        url: app.buildRequestUrl('agreen4Daikan'),
	        data:{
	        	recomInfoId:that.data.recomInfoId,
	        	userId:that.data.userId,
	        	isVip:that.data.isVip,
	        },
	        success: function (res) {
	        	var status = res.data.STATUS;
	        	if(status==1){
	        		wx.showToast({
        			  title: '操作成功',
        			  icon: 'success',
        			  duration: 1500,
        			  success:function(){
  	      				  wx.redirectTo({
  	      					  url:'/pages/entrustDetail/entrustDetail?pushLogId='+that.data.pushLogId
  	      				  });
  	      			  }
        			});
	        	}else{
	        		wx.showToast({
  	  				  title: '未知错误',
  	  				  image:'../../images/warning.png',
  	  				  duration: 1500,
  	  				  success:function(){
  	  	  			  }
  	  				});
	        	}
	        }
	    })
    },
    /** 
     * 同意看房
     */
    serviceBtn: function () {

    },
    /**
     * 群发委托
     */
    goToEntrust: function () {
      var that = this,
          caseType,
          wfRelateId,
          resource,
          houseRegion,
          houseSection,
          regionName,
          sectionName;
      
      if (that.data.caseType == 1) {
        caseType = 3;
      } else {
        caseType = 4;
      }

      wfRelateId = that.data.caseId;
      resource = that.data.reSource;
      houseRegion = that.data.buildRegionId;
      houseSection = that.data.sectionId;
      regionName = that.data.regionName;
      sectionName = that.data.sectionName;

      wx.redirectTo({
        url: '/pages/entrust/entrust?caseType=' + caseType + '&specialOper=1&wfRelateId=' + wfRelateId + '&resource=' + resource + '&houseRegion=' + houseRegion + '&houseSection=' + houseSection + '&regionName=' + regionName + '&sectionName=' + sectionName
      })
    },
    /**
     * 新房详情跳转
     */
    goToNewHouseDetail:function(e){
      var that = this;
      var _uid = e.currentTarget.dataset.uid;
      wx.navigateTo({
        url: '/pages/newHouseDetail/newHouseDetail?buildid=' + _uid,
      })
    },
    /**
     * 房价评估接口
     */
    requstEvaluate:function(e){
      var _this=this;
      var data={
        cityId:app.globalData.cityId,
        buildId:_this.data.caseId,
      };
      wx.request({
        url:app.buildRequestUrl('getPriceTrendNew'),
        data:data,
        success:function(res){
          console.log(res)
          if(res.data.STATUS==1){
              var data=res.data.DATA;
              if(data){
                var ratioByLastYearForPrice=parseFloat(Math.abs(data.ratioByLastYearForPrice*100)).toFixed(2);
                var ratioByLastMonthForPrice=parseFloat(Math.abs(data.ratioByLastMonthForPrice*100)).toFixed(2);
                _this.setData({
                  evaluateValue:data,
                  ratioByLastYearForPrice:ratioByLastYearForPrice,
                  ratioByLastMonthForPrice:ratioByLastMonthForPrice
                })
              }
          }
        }
      })
    },
    /**
     * 去评估页面
     */
    goEvaluateEvent:function(e){
      var _this=this;
      wx.navigateTo({
        url:'/pages/priceTrend/priceTrend?cityId='+_this.data.cityId+'&buildId='+_this.data.caseId,
      })
    }
})