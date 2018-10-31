import { Tools } from './tools';
const tool = new Tools();
/* 房源列表公共方法提取 */
var homeListFnObj = {
    // 初始化商圈列表
    businessDataFn:function(businessData){
        for (var i in businessData) {
            businessData[i].unshift(['不限', '']);
        };
        businessData['0'] = [['不限', '']];
        return businessData;
    },
    // 初始化价格列表
    priceWanFn:function(priceData,priceType){
        var arr = [];
        priceData.map(function (ele, i) {
            if (i == priceData.length - 1) {
                arr.push({ text: ele + priceType+'以上', value: ele + ':9999' });
            } else {
                if (i == 0) {
                arr.push({ text: '不限', value: '' });
                arr.push({ text: ele + priceType+'以下', value: '0:' + ele });
                };
                var obj = {};
                obj['text'] = ele + '-' + priceData[i + 1] + priceType;
                obj['value'] = ele + ':' + priceData[i + 1];
                arr.push(obj);
            };
        });
        return arr;
    },
    // 初始化区域列表数据
    regionListFn:function(res,_this){
        //初始化区域列表
        var regionData = res.DATA.REG_DATA;
        regionData.unshift({ REG_ID: '', REG_NAME: '不限' });
        //如果有定位城市行政区 , 则默认选中该行政区
        let locateRegId = wx.getStorageSync('locateRegId');
        let locateRegName = wx.getStorageSync('locateRegName');
        if(locateRegId > 0 && wx.getStorageSync('locateCityId') == wx.getStorageSync('cityId')){
        //筛选栏数据更新
        let locateRegIdIndex = 1;
        regionData.map(function(ele, i){
            if(ele.REG_ID == locateRegId){locateRegIdIndex = i}
        });
        var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,locateRegName,true);
        _this.setData({
            regionText: locateRegName,
            regionListIndex: locateRegIdIndex,
            RegionId: locateRegId,
            conditionScreening: conditionScreening
        });
        }
        return regionData;
    },
    // 获取区域,商圈,价格筛选数据
    getRegData:function(_this,surroundRegionId){
        var cityId = _this.data.cityId;
        //是否有缓存
        var savedData = wx.getStorageSync('filterData' + cityId);
        if (!!savedData) {
            _this.initFilterData(savedData,surroundRegionId);
        } else {
            var url = _this.data.initLocalStorageUrl;
            var params = { cityId: _this.data.cityId };
            api.getList(url, params).then(res => {
                if (res.STATUS != 1) return;
                var data_str = JSON.stringify(res);
                wx.setStorageSync('filterData' + cityId, data_str);
                _this.initFilterData(data_str,surroundRegionId);
            });
        };
    },
    // 输入价格值后点击筛选
    minAndMaxPriceEvent:function(_this,min, max, listIndexKey, txt, unit, key, minKey, maxKey,pritype){
        if (!max && !min) {
            var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,txt,false);
            var data = {};
            data['conditionModel'] = false;
            data['conditionScreening'] = conditionScreening;
            data[listIndexKey] = 0;
            _this.setData(data);
            if(pritype == 'newHouse'){
                _this.rejectAjaxData(key, '');
                _this.getListValue();
            }
          } else {
            var text = '';
            var data;
            min = min || 0;
            max = max || 0;
            if (min == 0) {
              text = max + unit + "以下";
              data = '0:' + max;
            } else if (max == 0) {
              text = min + unit + '以上';
              data = min + ':' + 99999;
            } else {
              var temp = min;
              min = max > min ? min : max;
              max = max > temp ? max : temp;
              text = min + '-' + max + unit;
              data = min + ':' + max;
            }
            var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,text,true);
            var obj = {};
            obj['conditionModel'] = false;
            obj['conditionScreening'] = conditionScreening;
            obj[listIndexKey] = 999;
            obj[maxKey] = max;
            obj[minKey] = min;
            _this.setData(obj);
            _this.rejectAjaxData(key, data);
            _this.getListValue();
          }
    },
    // 对所有输入事件的处理
    inputEvent:function(_this,value,data){
        var reg = /^[0-9]{1,100}$/;
        var setInputData = {};
        if (!reg.test(value)) {
            setInputData[data] = '';
            _this.setData(setInputData);
        } else {
            setInputData[data] = value;
            _this.setData(setInputData);
        }
    },
    // 点击顶部筛选按钮的模态框事件
    conditionScreeningEvent:function(_this,event){
        _this.setData({
            listHiden: true ? false : true
          });
        if (_this.data.conditionModel && _this.data.conditionModelIndex == event.currentTarget.dataset.index) {
        //模态框存在时
        _this.setData({
            listHiden: true,
            conditionModel: false,
            conditionModelIndex: 0,
        });
        } else {
        //未出现模态框
        _this.setData({
            conditionModel: true,
            conditionModelIndex: event.currentTarget.dataset.index,
        });
        };
    },
    // 筛选更多-点击事件(面积, 类型)
    moreClickEvent:function(_this,e,moreType){
        var edataset = e.currentTarget.dataset;
        var item = edataset.item,
        index = edataset.index,
        type = edataset.type;
        var typeName = 'more_' + type + 'Index';
        if (_this.data[typeName] === index) {
        if(moreType=='newHouse' && type == 'caseType'){return};
        var obj = {};
        _this.rejectAjaxData(type, '');
        obj[typeName] = '';
        } else {
        var obj = {};
        _this.rejectAjaxData(type, item.value);
        obj[typeName] = index;
        if(moreType=='newHouse' && type == 'caseType'){
            var sObj = _this.data.pressShareBtnObj;
            _this.setData(sObj);
            _this.rejectAjaxData('tagId', '');
            _this.rejectAjaxData('houseUseage', '', 'area', '');
        }
        }
        _this.setData(obj);
    },
    // 筛选更多(特色)-点击事件（maxNum：最大多选值）
    moreSpecialClickEvent:function(_this,e,maxNum){
        var edataset = e.currentTarget.dataset;
        var item = edataset.item,
        index = edataset.index,
        arr = _this.data.more_specialIndex,
        tagArr = _this.data.more_specialTag;
        var n = arr.indexOf(index);
        if (n != -1) {
            arr.splice(n, 1);
            tagArr.splice(n, 1);
        } else {
            arr.push(index);
            tagArr.push(item.value);
            if (arr.length > maxNum) {
                arr.shift();
                tagArr.shift();
            };
        }
        _this.setData({
            more_specialIndex: arr,
            more_specialTag: tagArr
        });
        var tagStr = tagArr.join('|');
        _this.rejectAjaxData('tagId', tagStr);
    },
    // 筛选更多-确定
    moreconfirm:function(_this,type){
        var data = _this.data;
        var ceshi = null;
        if(type=='oldHouse'){
            ceshi = data.ajaxListData.area || data.ajaxListData.houseUseage || data.ajaxListData.tagId || data.ajaxListData.reSource;
        }else if(type=='newHouse'){
            ceshi = data.ajaxListData.caseType != '2' || data.ajaxListData.area || data.ajaxListData.houseUseage || data.ajaxListData.tagId;
        }else if(type=='apartment'){
            ceshi = data.ajaxListData.checkInTime || data.ajaxListData.room || data.ajaxListData.area || data.ajaxListData.sexNow || data.ajaxListData.tags;
        }
        if (ceshi) {
            var ifModify = true;
          } else {
            var ifModify = false;
          }
          var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,3,'更多',ifModify);
          _this.setData({
            conditionModel: false,
            listHiden: true,
            conditionScreening: conditionScreening
          })
          _this.getListValue();
    },
    // 点击<区域>列表事件
    regionListEvent:function(_this,event,type){
        var item = event.currentTarget.dataset.item,
        index = event.currentTarget.dataset.index;
        if (index > 0) {
            _this.setData({
            regionText: item.REG_NAME,
            regionListIndex: index,
            businessListIndex: 0,
            RegionId: item.REG_ID,
            ifClickBuxian: true
            });
        } else {
            var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,'区域',false);
            _this.setData({
            listHiden: true,
            conditionModel: false,
            conditionScreening: conditionScreening,
            businessListIndex: 0,
            regionListIndex: 0,
            ifClickBuxian: false,
            regionText: '不限',
            RegionId: 0,
            expertBox: false,
            inputText: ''
            });
            _this.rejectAjaxData('buildName', '', 'buildId', '');
            if(type=='newHouse'){
                this.rejectAjaxData('buildRegion', '', 'sectionId', '');
            }else{
                _this.rejectAjaxData('regionId', '', 'sectionId', '');
            }
            _this.getListValue();
        }
    },
    // 点击商圈中的每个Li（选择具体地点）
    businessListListEvent:function(_this,event,id,type){
        var item = event.currentTarget.dataset.item,
        index = event.currentTarget.dataset.index;
        if (index > 0) {
        var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,item[0],true);
        _this.setData({
            listHiden: true,
            conditionModel: false,
            conditionScreening: conditionScreening,
            businessListIndex: index,
            expertBox:false,
            inputText: ''
        });
        _this.rejectAjaxData('buildName', '', 'buildId', '');
        if(type=='apartment'){
            this.rejectAjaxData('buildName', '', 'pageNum', 1);
        }
        _this.rejectAjaxData(id, _this.data.RegionId, 'sectionId', item[1]);
        _this.getListValue();
        } else {
        if (!_this.data.ifClickBuxian) {  //如果当前区域名为[不限]
            var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,'区域',false);
        } else {
            var conditionScreening = _this.rejectConditionScreening(
                _this.data.conditionScreening,
                _this.data.conditionModelIndex,
                _this.data.regionText,
                true
            );
        };
        _this.setData({
            listHiden: true,
            conditionModel: false,
            conditionScreening: conditionScreening,
            businessListIndex: 0,
            inputText: ''
        });
        if(id=='regionId'){
            _this.setData({expertBox: false});
        }
        _this.rejectAjaxData('buildName', '', 'buildId', '');
        if(type=='apartment'){
            this.rejectAjaxData('buildName', '', 'pageNum', 1);
        }
        _this.rejectAjaxData(id, _this.data.RegionId, 'sectionId', '');
        _this.getListValue();
        }
    },
    // 点击排序
    orderClickEvent:function(_this,e){
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        if (_this.data.orderListIndex == index) {
        return;
        };
        _this.setData({
        orderListIndex: index,
        orderBox: false
        });
        _this.rejectAjaxData('sort', item.value);
        _this.getListValue();
    },
    // 点击模态框筛选条件事件（筛选价格，户型）
    clickLiEvent:function(index, listIndexKey, txt, key, item, minKey, maxKey,_this){
    //index 点击的li的索引值,listIndexKey,确定是哪个列表的索引，txt  默认文字
    //key,改变ajax中的KEY，minKey，maxKey最小和最大值
    //item 传过来的参数
    if (index > 0) {     //除去不限,因为不限不需出现在按钮上
        var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,item.text,true);
        var data = {};
        data['conditionModel'] = false;
        data['conditionScreening'] = conditionScreening;
        data[listIndexKey] = index;
        _this.setData(data);
      } else {
        var conditionScreening = _this.rejectConditionScreening(_this.data.conditionScreening,_this.data.conditionModelIndex,txt,false);
        var data = {};
        data['conditionModel'] = false;
        data['conditionScreening'] = conditionScreening;
        data[listIndexKey] = 0;
        _this.setData(data);
      }
      if (!!minKey || !!maxKey) {
        var data = {};
        data[minKey] = '';
        data[maxKey] = '';
        _this.setData(data);
      }
      _this.rejectAjaxData(key, item.value);
      _this.getListValue();
    },
    // 先将ajax默认参数全部导入，然后修改自己要请求的的参数(对参数的处理)
    rejectAjaxData:function(key1, value1, key2, value2,_this){
        var data = _this.data.ajaxListData;
        if (!!key1) {
            data[key1] = value1;
        };
        if (!!key2) {
            data[key2] = value2;
        };
        _this.setData(data);
        _this.setData({
            buildName: '输入小区名称'
        })
    },
    // 列表滑动到底部加载更多
    lower:function(_this){
        if (_this.data.ajaxListTag) {
            var data = _this.data.ajaxListData;
            data.pageNum++;
            _this.setData({
              ajaxListData: data
            })
            _this.getListValue(true);
        };
    },
    // 滚动到底部
    scrollToL:function(_this,e){
        var scrollFlag = _this.data.scrollFlag;
        if (!scrollFlag) {
        return false;
        };
        var topNum = e.detail.scrollTop;
        if (topNum >= 100) {
            _this.setData({
            scrollSearch: false,
            scrollFlag: false
        });
        };
    },
    // 我要买房点击跳转(caseType:=3:出售=4:出租)
    goToBuyHouseBtn:function(_this,e,caseType){
        if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
            if (!!wx.getStorageSync('locateCityId')) {
                //显示切换城市弹框
                _this.setData({ toastHide: false });
            } else {
                app.getLocationAgain();
            }
            return;
        }
        var edataset = e.currentTarget.dataset;
        var _buildOwnerArchiveId = edataset.buildownerarchiveid;
        var _buildOwnerMobile = edataset.buildownermobile;
        var _buildOwnerName = edataset.buildownername;
        var _rentMoney = edataset.rentmoney;
        var _buyMoney = edataset.buymoney;
        var _serviceRegs = edataset.serviceregs;
        var _buildOwnerPicUrl = edataset.buildownerpicurl;
        var _userPhone = _this.data.userPhone;
        var urls = tool.buildUrl('/pages/entrust/entrust',{
            'archiveId':_buildOwnerArchiveId,
            'isVip':1,
            'userMobile':_buildOwnerMobile,
            'userName':_buildOwnerName,
            'rentMoney':_rentMoney,
            'buyMoney':_buyMoney,
            'serviceRegs':_serviceRegs,
            'userPhoto':_buildOwnerPicUrl,
            'caseType':caseType
        });
        wx.navigateTo({
            url: urls,
        })
    },
    // 我是房东，我要卖房
    goToEntrustLiBtn:function(_this,goToUrl){
        if (wx.getStorageSync('locateCityId') != wx.getStorageSync('cityId')) {
            if (!!wx.getStorageSync('locateCityId')) {
                //显示切换城市弹框
                _this.setData({ toastHide: false });
            } else {
                app.getLocationAgain();
            }
            return;
        }
      wx.navigateTo({
          url: goToUrl,
      });
    }
}
export {homeListFnObj};