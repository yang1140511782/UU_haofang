import { Tools } from './tools';
const tool = new Tools();
// 房源列表详情页公共方法提取
var houseDetailFn = {
    // 关闭视频
    closeBtn:function(_this){
        _this.setData({
            videoShow: false,
            boxShow: true
        })
    },
    // 查看展开更多文字信息
    moreBtn:function(that){
        var showss = !that.data.showmor,
        showtt = !that.data.showtitle,
        closess = !that.data.closepic;
        that.setData({
            showmor: showss,
            showtitle: showtt,
            closepic: closess
        })
    },
    //周边信息点击查看更多
    moreZbBtn:function(that){
        var zbShowss = !that.data.showmorZb,
        zbShowtt = !that.data.showtitleZb,
        zbClosess = !that.data.zbClosepic;
        that.setData({
            showmorZb: zbShowss,
            showtitleZb: zbShowtt,
            zbClosepic: zbClosess
        })
    },
    //小区信息查看更多
    houseMoreBtn:function(that){
        houseshowtt = !that.data.houseShowTitle,
        closess = !that.data.closeCont
        that.setData({
            houseShowTitle: houseshowtt,
            closeCont: closess
        })
    },
    // 调整地图页(跳转地图)
    goToMap:function(_this,e,callback){
        var lat = e.currentTarget.dataset.lat;
        var lng = e.currentTarget.dataset.lng;
        var type = e.currentTarget.dataset.type;
        var buildname = e.currentTarget.dataset.buildname;
        var urlOne = tool.buildUrl('/packageTool/pages/map/map',{'lat':lat,'long':lng,'type':type,'buildname':buildname});
        var urlTwo = tool.buildUrl('/packageTool/pages/map/map',{'lat':lat,'long':lng,'buildname':buildname});
        if(callback){callback();}
        if (!!type) {
            wx.navigateTo({
                url: urlOne
            });
        } else {
            wx.navigateTo({
                url: urlTwo
            });
        }
    }
}
export {houseDetailFn};