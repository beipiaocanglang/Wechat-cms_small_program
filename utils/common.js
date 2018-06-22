//获取应用实例
const app = getApp()
function loadServerData(id, obj) {
	var detailKey = "detail_" + id;

    var detailData = wx.getStorageSync(detailKey);
    if (detailData) {
        obj.setData({
            info: detailData
        })
        obj.setData({
            isHidden: false
        })
		wx.hideNavigationBarLoading()
		wx.hideLoading();

        console.log("datial data from cache");
        return;
    }
    wx.request({
        url: app.url+'addon/Cms/Cms/getDetail',
        data: {
            id: id
        },
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: function(res) {
            //隐藏导航条加载动画
            wx.hideNavigationBarLoading()
            wx.hideLoading();

            obj.setData({
                info: res.data
            })
            obj.setData({
                isHidden: false
            })
            wx.setStorageSync(detailKey, res.data);

            console.log("datial data from url");
        },
        fail: function(res) {
            obj.backInfo();
			console.log("datial data 执行失败");
        },
		complete:function(){
			wx.hideNavigationBarLoading()
			wx.hideLoading();
			console.log("关闭操作");
		}
    })
};

/**模块需要暴露才能使用 */
module.exports={
	loadServerData: loadServerData
}