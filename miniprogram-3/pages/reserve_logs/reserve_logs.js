var app = getApp()

Page({
  data: {
    list: [], // 用户预约信息的列表
    iosDialog1: false,
    iosDialog2: false
  },

  getRecords(){
    // http://10.176.40.153:31115
    var url = 'http://106.14.206.100:8001/stu_record/'
    url = url + app.globalData.stu_id
    console.log(url)
    var that = this
    wx.request({
      url: url, // 替换为您要请求的 URL
      method: 'GET',
      success: function(res) { // 使用普通函数
        console.log('座位预定信息：');
        console.log(res.data.data)

        var cur_record = []
        var reservations = res.data.data.reservations
        
        for(var i = 0; i < reservations.length; ++i){
          cur_record.push({
            'rsv_id': reservations[i].rsv_id,
            'building_name': reservations[i].building_name,
            'room_number': reservations[i].room_number,
            'seat_id': reservations[i].seat_id,
            'rsv_state': reservations[i].rsv_state,
            'make_rsv_time': reservations[i].make_rsv_time,
            'start_rsv_time': reservations[i].start_rsv_time,
            'end_rsv_time': reservations[i].end_rsv_time,
          });
          that.setData({
            list: cur_record,
          })
        }
      },
    fail: function (err) {
        console.error(err); // 输出错误信息
        // 在这里可以处理请求失败的情况
        console.log('请求记录失败');
        wx.showToast({title: "请重试", icon: 'none'})
    }
  })
  },

  onLoad() {
    // // 查询数据库，获取数据列表
    // // ...
  
    // // 更新数据
    // // 模拟数据 ----------------------
    // var that = this
    // that.setData({
    //   list: [
    //     {
    //       'building_name': 11,
    //       'room_number': 12,
    //       'seat_id': 13,
    //       'rsv_state': "待签到",
    //       'make_rsv_time': 15,
    //       'start_rsv_time': 16,
    //       'end_rsv_time': 17,
    //     },
    //     {
    //       'building_name': 21,
    //       'room_number': 22,
    //       'seat_id': 23,
    //       'rsv_state': "预约成功",
    //       'make_rsv_time': 25,
    //       'start_rsv_time': 26,
    //       'end_rsv_time': 27,
    //     }
    //   ]
    // })
    // return 
    // // ---------------------------
    this.getRecords()
  },
  operate(e) {
    let idx = parseInt(e.currentTarget.dataset.bindex)
    console.log(idx)
    // 存全局变量
    var app = getApp()
    app.globalData.selected_reserve_msg = this.data.list[idx]
    if (this.data.list[idx].rsv_state == "已预约") {
      console.log("取消预约")
      // 设置弹窗
      this.setData({
        iosDialog1: true
      })

    } else {
      console.log("重新预约")
      // 设置弹窗
      this.setData({
        iosDialog2: true
      })
    }
  },
  close() {
    this.setData({
      iosDialog1: false,
      iosDialog2: false
    })
  },
  cancelConfirm() {
    // 存信息，跳转
    var app = getApp()
    console.log(app.globalData.selected_reserve_msg)
    this.close()
    /* 
      这里设置了：设置->项目设置->过滤无依赖文件->勾选去掉，
      因为（猜测）在wx:if判断中这个页面不会被调用，因此会被当作
      无依赖文件而忽略，无法跳转到这一页。
    */
   // http://10.176.40.153:31115
    var url = 'http://106.14.206.100:8001/stu_record/'
    url = url + app.globalData.stu_id + "/"
    console.log(url)
    console.log(app.globalData.selected_reserve_msg.rsv_id)
    wx.request({
      url: url, // 替换为您要请求的 URL
      method: 'POST',
      data: {
        rsv_id: app.globalData.selected_reserve_msg.rsv_id
      },
      success: function(res) { // 使用普通函数
        if (res.data.status === '204')
          wx.navigateTo({url: '/pages/cancel_done/cancel_done'})
        // else
          // wx.navigateTo({url: '/pages/rereserve/rereserve'})
      },
    fail: function (err) {
        console.error(err); // 输出错误信息
        // 在这里可以处理请求失败的情况
        console.log('请求记录失败');
        wx.showToast({title: "请重试", icon: 'none'})
    }
  })
  },
  rereserveConfirm() {
    // 存信息，跳转
    var app = getApp()
    console.log(app.globalData.selected_reserve_msg)
    this.close()
    /* 
      这里设置了：设置->项目设置->过滤无依赖文件->勾选去掉，
      因为（猜测）在wx:if判断中这个页面不会被调用，因此会被当作
      无依赖文件而忽略，无法跳转到这一页。
    */
   wx.navigateTo({url: '/pages/rereserve/rereserve'})
  }
  // handleIconType(e) {
  //   let idx = parseInt(e.currentTarget.dataset.bindex)
  //   if (this.data.list[idx].rsv_state == "待签到") return true
  //   else return false
  // }

})