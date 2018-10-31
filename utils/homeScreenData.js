// 房源赛选条件数据
const homeData = {
    //户型数据
    layoutList:[
        { text: '不限', value: '' },
        { text: '1室', value: '1:1' },
        { text: '2室', value: '2:2' },
        { text: '3室', value: '3:3' },
        { text: '4室', value: '4:4' },
        { text: '5室', value: '5:5' },
        { text: '5室以上', value: '5:100' }
    ],
    // 用途户型
    purposeList:[
        { text: '不限', value: '' },
        { text: '住宅', value: '1' },
        { text: '别墅', value: '2' },
        { text: '商铺', value: '3' },
        { text: '写字楼', value: '4' },
        { text: '旅游地产', value: '5' }
    ],
    //排序数据
    orderList:[
        { text: '默认排序', value: '' },
        { text: '价格从低到高', value: '1' },
        { text: '价格从高到低', value: '2' },
        { text: '面积从小到大', value: '3' },
        { text: '面积从大到小', value: '4' },
    ],
    //更多筛选数据
    more:{
        reSourceList: [
          { text: '业主房源', value: '0' },
          { text: '经纪人', value: '1' }
        ],
        areaList: [
          { text: '50以下', value: '0:50' },
          { text: '50-70', value: '50:70' },
          { text: '70-90', value: '70:90' },
          { text: '90-110', value: '90:110' },
          { text: '110以上', value: '110:999' }
        ],
        usageList: [
          { text: '住宅', value: 1 },
          { text: '别墅', value: 2 },
          { text: '商铺', value: 3 },
          { text: '写字楼', value: 4 },
          { text: '其他', value: 8 },
        ],
        specialList: [
          { text: '两证齐全', value: 1 },
          { text: '满两年', value: 2 },
          { text: '免税', value: 3 },
          { text: '急售', value: 4 },
          { text: '学区房', value: 5 },
          { text: '低于市价', value: 6 },
          { text: '顶楼花园', value: 7 },
          { text: '底楼花园', value: 8 },
          { text: '带车位', value: 64 },
          { text: '地下室', value: 96 }
        ]
      },
    //   房源列表详情页娱乐信息
    typeList:{
    '公交': { typeId: 'bus', typeName: '公交' },
    '地铁': { typeId: 'subway', typeName: '地铁' },
    '学校': { typeId: 'school', typeName: '学校' },
    '医院': { typeId: 'hospital', typeName: '医院' },
    '银行': { typeId: 'bank', typeName: '银行' },
    '休闲娱乐': { typeId: 'leisure', typeName: '休闲娱乐' },
    '购物': { typeId: 'shopping', typeName: '购物' },
    '餐饮': { typeId: 'food', typeName: '餐饮' },
    '运动健身': { typeId: 'sports', typeName: '运动健身' }
    },
    /* 
        委托详情静态json
    */
    // 我的购房需求
    needsList:{
        'needsSection': { needsFlow: 1, needsName3: '期望区域', needsName4: '期望区域', needsValue: '', defaultTips: '请选择区域' },
        'needsType': { needsFlow: 2, needsName3: '房屋类型', needsName4: '房屋类型', needsValue: '', defaultTips: '请选择类型' },
        'needsArea': { needsFlow: 5, needsName3: '理想面积', needsName4: '理想面积', needsValue: '', defaultTips: '请选择面积' },
        'needsPrice': { needsFlow: 6, needsName3: '购房预算', needsName4: '租房预算', needsValue: '', defaultTips: '请选择价格' },
        'needsFee': { needsFlow: 7, needsName3: '支付中介费', needsName4: '支付中介费', needsValue: '', defaultTips: '请选择中介费' },
        'needsBroker': { needsFlow: 7, needsName3: '服务经纪人', needsName4: '服务经纪人', needsValue: '', defaultTips: '男女均可' },
      },
    //主要流程值 publishFlow
    publishFlowMap: {
        '1': 'region-box',//期望区域筛选
        '2': 'useage-box',//房屋类型筛选
        '3': 'fitment-box',//房屋装修筛选
        '4': 'room-box',//房屋户型筛选
        '5': 'area-box',//理想面积筛选
        '6': 'price-box',//购房预算筛选
        '7': 'broker-sex-box',//挑选经纪人性别
        '8': 'fee-box',//购房佣金筛选
    },
    //房屋用途数组:
    useageMap: [
        { id: 1, name: "住宅", default: 1 },
        { id: 2, name: "别墅" },
        { id: 3, name: "商铺" },
        { id: 4, name: "写字楼" }
    ],
    //房屋装修数组:
    fitmentMap: [
        { id: '2', name: '简装' },
        { id: '3', name: '精装', default: 1 },
        { id: '6', name: '豪装' },
        { id: '1', name: '毛坯' },
        { id: '7', name: '不限' },
    ],
    //房屋户型数组:
    roomMap: [
        { roomL: '1', roomH: '1', name: '一室' },
        { roomL: '2', roomH: '2', name: '二室' },
        { roomL: '3', roomH: '3', name: '三室', default: 1 },
        { roomL: '4', roomH: '4', name: '四室' },
        { roomL: '5', roomH: '5', name: '五室' },
        { roomL: '5', roomH: '20', name: '五室以上' },
    ],
    //佣金比例数组:
    feeMap: {
        3: [{ fee: '0.01|0.015', name: '1-1.5', unit: '%' }, { fee: '0.015|0.02', name: '1.5-2', unit: '%' }],//求购
        4: [{ fee: '0|0.5', name: '10-15', unit: '天' }, { fee: '0.5|1', name: '15-20', unit: '天' }],//求租
    },
    //性别数组 0:随机分配、1:男、2:女
    sexMap: [
        { id: 1, name: "帅哥", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-man.png" },
        { id: 2, name: "美女", image: "https://uuweb.haofang.net/PublicC/images/publish/index/sex-woman.png" },
    ],

}
export {homeData};