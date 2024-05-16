var app = getApp()

Page({
  data: {
    stu_name: "wuwuwuw",
    start_rsv_time : "",
    end_rsv_time : "",
    room_desc: "",
    room_number: "",
    seat_id: 0,
    stu_id: 0,
  },
  tap() {
    wx.switchTab({
      url: '/pages/menu/menu',
    })
  },

  onLoad(){
    this.setData({
      stu_name: app.globalData.stu_name,
      start_rsv_time: app.globalData.start_rsv_time,
      end_rsv_time:  app.globalData.end_rsv_time,
      room_desc:  app.globalData.room_desc,
      room_number:  app.globalData.room_number,
      seat_id:  app.globalData.seat_id,
      stu_id: app.globalData.stu_id,
      building_name: app.globalData.building_name
    })
  }
})
