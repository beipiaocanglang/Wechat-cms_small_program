//获取应用实例
const app = getApp()

Page({
    data: {
        backInfo:"返回上一级",
		isHidden:true
    },
    onLoad: function(options) {

		wx.showLoading({
			title: '加载中...',
		})

        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading()
        //动态设置当前页面的标题
        wx.setNavigationBarTitle({
            title: "文章详情",
            success: function () {
                console.log('setNavigationBarTitle success')
            },
            fail: function (err) {
                console.log('setNavigationBarTitle fail, err is', err)
            }
        });
        
		/**代码模块化 */
		var common = require('../../utils/common.js')
		common.loadServerData(options.id, this);
    },
    //返回按钮
    backInfo:function(){
        wx.navigateBack()
    }
})