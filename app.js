//app.js
App({
	onLaunch: function () {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
	},
	getUserInfo: function (cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.login({
				success: function (res) {
					if (res.code) {
						wx.request({
							url: that.url + 'addon/Cms/Cms/sendCode',
							data: {
								code: res.code,
								PHPSESSID: wx.getStorageSync('PHPSESSID')
							},
							success: function (res) {
								//缓存session_id
								wx.setStorageSync('PHPSESSID', res.data.PHPSESSID)
								wx.setStorageSync('openid', res.data.openid)

								//获取用户信息
								wx.getUserInfo({
									success: function (res) {
										that.globalData.userInfo = res.userInfo
										typeof cb == "function" && cb(that.globalData.userInfo)

										//console.log(res);
										wx.request({
											url: that.url + 'addon/Cms/Cms/saveUserInfo',
											data: {
												encryptedData: res.encryptedData,
												PHPSESSID: wx.getStorageSync('PHPSESSID'),
												iv: res.iv
											},
											success: function (res) {
												//console.log(res)
											}
										})

									}
								})
							}
						})
					}
				}
			})
		}
	},
	globalData: {
		userInfo: null
	},
	url: "http://localhost:8081/index.php?s=/"
})




/**  以下是 最新微信开发者工具创建的 快速入门项目时自动生成的  但是在其他页面 本人不会使用获取用户信息方法  所以使用上面的方法
//app.js
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if (res.code) {
					wx.request({
						url: this.url + 'addon/Cms/Cms/sendCode',
						data: {
							code: res.code,
							PHPSESSID: wx.getStorageSync('PHPSESSID')
						},
						success: function (res) {
							//缓存session_id
							wx.setStorageSync('PHPSESSID', res.data.PHPSESSID)
							wx.setStorageSync('openid', res.data.openid)
						}
					})
				}
			}
		})
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					//获取用户信息
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo
							typeof cb == "function" && cb(this.globalData.userInfo)

							//console.log(res);
							wx.request({
								url: this.url + 'addon/Cms/Cms/saveUserInfo',
								data: {
									encryptedData: res.encryptedData,
									PHPSESSID: wx.getStorageSync('PHPSESSID'),
									iv: res.iv
								},
								success: function (res) {
									console.log(res)
								}
							})

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	globalData: {
		userInfo: null
	},
	//配置全局公共的url的公共部分
	url: "http://localhost:8081/index.php?s=/"
})*/