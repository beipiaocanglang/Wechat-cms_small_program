//获取应用实例
const app = getApp()

Page({
    data: {
        newsLists: [],
        lastid: 0,
        tishi: "点击加载更多",
        //默认隐藏加载更多，数据加载完成后才显示
        isHiddenLoad:true
    },
    //页面加载时的处理
    onLoad: function () {
        var that = this;

        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading()
        //动态设置当前页面的标题
        wx.setNavigationBarTitle({
            title: "文章列表",
            success: function () {
                console.log('setNavigationBarTitle success')
            },
            fail: function (err) {
                console.log('setNavigationBarTitle fail, err is', err)
            }
        })
        //根据网络延迟显示页面加载中
        wx.showLoading({
            title: "数据加载中..."
        })

        //获取网络状态
        wx.getNetworkType({
            success: function (res) {
                //获取成功后拍【岸段是否是wifi或4g网络的状态下，如果不是给出提示框
                if (res.networkType != "wifi" && res.networkType != "4g") {
                    //弹框
                    wx.showModal({
                        title:"提示",
                        content: "当前网络不再wifi状态下，可能会产生流量资费，是否继续",
                        confirmText: "继续",
                        //cancelText: "取消",
                        showCancel: false,
                        success:function(res){
                            if (res.confirm) {
                                console.log('用户点击确定')
                                that.loadData(0);
                            } //else if (res.cancel) {
                                //console.log('用户点击取消')
                                //实际应该返回上一级
                                //wx.navigateBack()
                            //}
                        }
                    })
                } else {
                    that.loadData(0);
                }
            }
        })
    },
    //加载更多
    loadMore: function (event) {
        var lastid = event.currentTarget.dataset.lastid
        wx.showLoading({
            title: "数据加载中..."
        })
        this.loadData(lastid);
    },
    
    //页面加载时获取初始化数据
    loadData: function (lastid) {
        var limit = 5;
        var that = this;
        wx.request({
			url: app.url +'addon/Cms/Cms/getList', //仅为示例，并非真实的接口地址
            data: {
                limit: limit,
                lastid: lastid
            },
            header: {
                // 不设置header时 默认值就是json
                'content-type': 'application/json'
            },
            success: function (res) {
                //当列表页没有数据时的友好提示
                if (res.data && res.data.length == 0) {
                    that.showWindow("没有找到您要的数据", "");
                    return false;
                }
                //当页面数据加载到最后时的友好提示
                if (!res.data) {
                    that.showWindow("已到最后", "");
                    return false;
                }
                //将获取到的数据列表的最后一个对象的id赋值给lastid
                that.setData({ lastid: res.data[res.data.length - 1].id });

                //累加赋值列表操作
                var dataArr = that.data.newsLists;
                var newData = dataArr.concat(res.data);

                //添加缓存
                wx.setStorageSync("CmsList_" + lastid, newData);

                that.setData({
                    newsLists: newData,
                    isHiddenLoad: false
                })
                //数据加载完成后关闭 加载中的loadding提示框
                wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading()

                console.log("from url");
            },
            fail:function(){
                //that.showWindow("远程调用失败", "");
                var dataList = wx.getStorageSync("CmsList_" + lastid);
                if (dataList == "") {
                    that.showWindow("网络不可用", "");
                    //数据加载完成后关闭 加载中的loadding提示框
                    wx.hideLoading();
                    //隐藏导航条加载动画
                    wx.hideNavigationBarLoading()
                    return false;
                }
                that.setData({
                    newsLists: dataList,
                    lastid: dataList[dataList.length - 1].id,
                    isHiddenLoad: false
                })

                //数据加载完成后关闭 加载中的loadding提示框
                wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading()
                console.log("from cache");
            }
        })
    },
    //弹框
    showWindow: function (param1, param2) {
        wx.showToast({
            title: param1,
            duration: 2500
        })
        this.setData({ tishi: param2 })
    }
})
