//生产环境的配置
exports.app_key = "e11019d790190c1fb31bf2e8c53a673d"; //请在此行填写从阿拉丁后台获取的appkey
exports.appid = "wx6b5fd6b9a5bc3044"; //统计分享到群、二维码扫码数据时需填写，不填写无法统计
exports.appsecret = "318177131db19d9664b55d6ec7010d7e"; //统计分享到群、二维码扫码数据时需填写，不填写无法统计

//灰度环境的配置
// exports.app_key = "49ab89a75967f2169dffcca733661e90"; //请在此行填写从阿拉丁后台获取的appkey
// exports.appid = "wx7afa0ae2cc5fbc74"; //统计分享到群、二维码扫码数据时需填写，不填写无法统计
// exports.appsecret = "318177131db19d9664b55d6ec7010d7e"; //统计分享到群、二维码扫码数据时需填写，不填写无法统计

exports.getLocation = true; //默认不获取用户坐标位置
exports.plugin = false;  //您的小程序中是否使用了插件。根据是否启用插件会有不同的接入方式，请参考文档文档。