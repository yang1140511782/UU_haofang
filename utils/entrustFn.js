/**
 * 委托列表公共方法提取
 */
var entrustFn = {
    // 面积滑块拖拽
    dragAreaMoveBtn:function(_this,e){
        var scollWidth = _this.data.slidWidth,//外层盒子宽度
        areaP = _this.data.areaRange;
        //设置偏移量
        var areaMoveViewXNew = e.changedTouches[0].clientX - 35;
        _this.setData({ areaMoveViewXNew: areaMoveViewXNew });
        var _clientX = e.changedTouches[0].clientX - 8;
        if (_clientX >= 280) {
            _this.setData({ marginLeft: 20 })
        }
        if (_clientX < 280) {
            _this.setData({ marginLeft: 0 })
        }
        _this.calculateCurrentArea(_clientX, scollWidth, areaP)
    },
    // 价格滑块拖拽
    dragPrinceMoveBtn:function(_this,e){
        var scollWidth = _this.data.slidWidth,
        princeP = _this.data.priceRange;
        //设置偏移量
        var priceMoveViewXNew = e.changedTouches[0].clientX - 35;
        _this.setData({ priceMoveViewXNew: priceMoveViewXNew });
        var _clientX = e.changedTouches[0].clientX - 8;
        if (_clientX >= 280) {
            _this.setData({ pMarginLeft: 20})
        }
        if (_clientX < 280) {
            _this.setData({pMarginLeft: 0})
        }
        _this.calculateCurrentPrince(_clientX, scollWidth, princeP)
    },
    /* 面积滑块当前的面积
    *  oLeft 距离左边的值
    *  scrollLength 滑槽总长度
    *  priceRange 价格范围
    *  _this 传递的this
    *  type 是否为修改状态
    * */
    calculateCurrentArea:function(oLeft, scrollLength, priceRange,_this,type){
        var priceStart, priceEnd, priceStr;//定义起始值
        var percent = oLeft * 6 / scrollLength;
        var index = parseInt(percent);//当前索引值
        percent = percent - index;//所在区间占比
        if (index == 0) {
            priceStart = 0, priceEnd = priceRange[1];
            priceStr = priceEnd + '㎡以下';
            if(type == 'areaEdit'){
                _this.setData({areaMoveChoose: priceStr})
            }
        } else if (index >= 5) {
            priceStart = priceEnd = priceRange[5], priceEnd = priceRange[6];
            priceStr = priceStart + '㎡以上';
            if(type == 'areaEdit'){
                _this.setData({areaMoveChoose: priceStr})
            }
        } else {
            var divide = priceRange[index + 1] - priceRange[index];//区间价格跨度
            priceStart = priceRange[index] + parseInt(divide * percent);
            //起始值向下取整
            priceStart = parseInt(priceStart / 10) * 10;
            //结束值 = 起始值 + 区间值 * 0.3
            priceEnd = parseInt(priceStart + divide * 0.3);
            //结束值向上取整
            priceEnd = parseInt((priceEnd + 10) / 10) * 10;
            //显示值
            priceStr = priceStart + '-' + priceEnd + '㎡';
            if(type == 'areaEdit'){
                _this.setData({areaL: priceStart,areaH: priceEnd,areaMoveChoose: priceStr})
            }
        }
        if(type == 'areaInfo'){
            _this.setData({areaL: priceStart,areaH: priceEnd,areaMoveChoose: priceStr})
        }
    },
    /**
    * 价格滑块当前的价格
    *  oLeft 距离左边的值
    *  scrollLength 滑槽总长度
    *  priceRange 价格范围
    *  _this 传递的this
    *  type 是否为修改状态
    * */
   calculateCurrentPrince:function(oLeft, scrollLength, priceRange,_this,type){
        var priceStart, priceEnd, priceStr;//定义起始值
        var percent = oLeft * 6 / scrollLength;
        var index = parseInt(percent);//当前索引值
        percent = percent - index;//所在区间占比
        var priceUnitCn = _this.data.caseType == 3 ? '万' : '元';
        if (index == 0) {
            priceStart = 0, priceEnd = priceRange[1];
            priceStr = priceEnd + priceUnitCn + '以下';
            if(type == 'princeEdit'){
                _this.setData({princeMoveChoose: priceStr})
            }
        } else if (index >= 5) {
            priceStart = priceEnd = priceRange[5], priceEnd = priceRange[6];
            priceStr = priceStart + priceUnitCn + '以上';
            if(type == 'princeEdit'){
                _this.setData({princeMoveChoose: priceStr})
            }
        } else {
        var divide = priceRange[index + 1] - priceRange[index];//区间价格跨度
        if (_this.data.caseType == 3) {
            priceStart = priceRange[index] + parseInt(divide * percent);
            //起始值向下取整
            priceStart = parseInt(priceStart / 10) * 10;
            //结束值 = 起始值 + 区间值 * 0.3
            priceEnd = parseInt(priceStart + divide * 0.3);
            //结束值向上取整
            priceEnd = parseInt((priceEnd + 10) / 10) * 10;
        } else {
            priceStart = priceRange[index] + parseInt(divide * percent);
            //起始值向下取整
            priceStart = parseInt(priceStart / 100) * 100;
            //结束值 = 起始值 + 区间值 * 0.3
            priceEnd = parseInt(priceStart + divide * 0.3);
            //结束值向上取整
            priceEnd = parseInt((priceEnd + 100) / 100) * 100;
        }
            //显示值
            priceStr = priceStart + '-' + priceEnd + priceUnitCn;
            if(type == 'princeEdit'){
                _this.setData({priceL: priceStart,priceH: priceEnd, princeMoveChoose: priceStr})
            }
        } 
        if(type == 'princeInfo'){
            _this.setData({priceL: priceStart,priceH: priceEnd, princeMoveChoose: priceStr})
        }
   },
    //点击行政区
    regTap:function(_this,e){
        var index = e.currentTarget.dataset.index;
        var regId = e.currentTarget.dataset.id;
        var regName = e.currentTarget.dataset.name;
        var indexSectionData = _this.data.businessList[regId];//获取当前行政区商圈列表
        if (!indexSectionData) {
          indexSectionData = [["不限", ""]]
        }
        if (regId == _this.data.houseRegion) {
          //如果点击的是当前选中的行政区
          var sectionBoxShow = _this.data.sectionBoxShow;
          _this.setData({ sectionBoxShow: !sectionBoxShow });
          return;
        } else {
            _this.setData({
            sectionBoxShow: true,
            houseRegion: regId,
            regionName: regName,
            houseSection: '',
            sectionName: '不限',
            sectionSelectArr: [''],//当前选中商圈数组清空
            sectionSelectNameArr: ['不限'],//当前选中商圈数组清空
            indexSectionList: indexSectionData,
            regIndexId: index,//切换当前显示第几行的商圈块
          });
        }
    },
    // 点击选中商圈
    sectionTap:function(_this,e){
        var selectArr = _this.data.sectionSelectArr;
        var selectNameArr = _this.data.sectionSelectNameArr;
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        if (id == '') {
        selectArr = [''];//选中的是不限
        selectNameArr = ['不限'];//选中的是不限
        } else {
        if (selectArr.indexOf(id) > -1) {
            //当前选中,则移除当前选中中状态
            selectArr.splice(selectArr.indexOf(id), 1);
            selectNameArr.splice(selectNameArr.indexOf(name), 1);
        } else {
            if (selectArr.indexOf('') > -1) {
            selectArr.splice(selectArr.indexOf(''), 1);//如果当前选中项里有不限,移除他
            selectNameArr.splice(selectNameArr.indexOf('不限'), 1);//如果当前选中项里有不限,移除他
            }
            if (selectArr.length >= 3) { selectArr.shift(); }
            if (selectNameArr.length >= 3) { selectNameArr.shift(); }
            selectArr.push(id);
            selectNameArr.push(name);
        }
        }
        var selectArrStr = selectArr.join(',');
        var selectNameArrStr = selectNameArr.join(',');
        _this.setData({
        houseSection: selectArrStr,
        sectionSelectArr: selectArr,
        sectionSelectNameArr: selectNameArr,
        sectionName: selectNameArrStr,
        });
    },
    // 删除搜索关键字
    searchBuildData:function(that,e){
        var kwd = e.detail.value;
        if (!!kwd) {
        wx.request({
            url: app.buildRequestUrl('getBuildByKeyWord'),
            data: {
            cityId: this.data.cityId,
            caseType: this.data.caseType==3?1:2,
            keyWord: kwd
            },
            success: function (res) {
            var dataArr = res.data.DATA.list;
            if (res.statusCode == 200 && dataArr.length > 0) {
                if (dataArr.length > 0) {
                var buildArr = [];
                for (var i = 0; i < dataArr.length; i++) {
                    var data = dataArr[i];
                    buildArr.push(data);
                }
                that.setData({ buildArr: buildArr });
                }
            }
            }
        })
        }
    },
    // 选择某个小区
    listTap:function(e){
        var buildName = e.currentTarget.dataset.text;
        var buildId = e.currentTarget.dataset.id;
        var buildRegion = e.currentTarget.dataset.buildregion;
        var buildRegName = e.currentTarget.dataset.regname;
        this.setData({
          buildName: buildName,
          buildId: buildId,
          buildRegion: buildRegion,
          buildRegName: buildRegName,
          searchLoupanBox: false,
          searchInputValue: ''
        })
    }
}
export {entrustFn};