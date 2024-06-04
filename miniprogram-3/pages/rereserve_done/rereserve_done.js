var app = getApp()

Page({
  data: {
    stu_name: "wyc",
    start_rsv_time : "",
    end_rsv_time : "",
    // room_desc: "", // room_desc好像在预约记录那没有？
    room_number: "",
    seat_id: 0,
    stu_id: 0,
  },
  tap() {
    wx.switchTab({
      url: '/pages/menu/menu',
    })
  },
/*
building_name: 11
end_rsv_time: 17
make_rsv_time: 15
room_number: 12
rsv_state: "待签到"
seat_id: 13
start_rsv_time: 16
*/
  onLoad(){
    this.setData({
      stu_name: app.globalData.stu_name,
      start_rsv_time: app.globalData.selected_reserve_msg.start_rsv_time,
      end_rsv_time:  app.globalData.selected_reserve_msg.end_rsv_time,
      // room_desc:  app.globalData.room_desc,
      room_number:  app.globalData.selected_reserve_msg.room_number,
      seat_id:  app.globalData.selected_reserve_msg.seat_id,
      stu_id: app.globalData.stu_id,
      building_name: app.globalData.selected_reserve_msg.building_name
    })
  }
})
