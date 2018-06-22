var app = getApp()
Page({
    data: {
        array: ['美国', '中国', '巴西', '日本'],
        area: 0,
        score: 0,
        is_dev: 0,
        username: ''
    },
    /**选择地区 */
    bindPickerChange: function(e) {
        console.log('form发生了Picker事件，携带数据为：', e.detail.value)
        /**给上面的data中的 area 赋值 */
        this.setData({
            area: e.detail.value
        });
    },
    /**分数 */
    bindSliderChange: function(e) {
        console.log('form发生了Slider事件，携带数据为：', e.detail.value)
        /**给上面的data中的 score 赋值 */
        this.setData({
            score: e.detail.value
        });
    },
    /**提交表单 */
    formSubmit: function(e) {
        //console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var formData = e.detail.value
        formData.area = this.data.area /**设置个国家 */
        formData.score = this.data.score /**设置分数 */
        formData.username = this.data.username /**设置用户名 */
        console.log('form发生了事件，携带数据为：', formData)

        var that = this

        wx.request({
            url: app.url + 'addon/Feedback/Feedback/addFeedback',
            data: formData,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res)
            },
        })
    },
    onLoad: function() {
        var that = this
        /**方法一 直接接口获取用户信息 不合理 需要获取app.js中的用户信息 所以要用下面的方法 
        wx.getUserInfo({
            success: function(res) {
                var nickName = res.userInfo.nickName;
                console.log(nickName);
                that.setData({
                    username: nickName
                });
            }
        })*/

        /** 方法二 通过app.js中获取的用户信息来全局的控制用户信息*/
		app.getUserInfo(function (userInfo) {
			var nickName = userInfo.nickName
			that.setData({ username: nickName })
		})
    }
})