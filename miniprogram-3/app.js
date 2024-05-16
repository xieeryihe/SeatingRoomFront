// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    latitude: 0,
    longitude: 0,
    selected_building_id: 0,
    stu_id: 0,
    stu_name: "未登录，无姓名",
    start_rsv_time: 0,
    end_rsv_time: 0, 
    room_desc: "",
    room_number: "",
    seat_id: 0,
    building_name: "",
    selected_reserve_msg: {}
  }
})


