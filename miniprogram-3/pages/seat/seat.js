// pages/seat.js

var app = getApp()

Page({
  data: {
    seatInformation: [],
    /*
    "room": [{"room_id": "自习室主键", "room_number": "自习室编号", "overnight": "是否通宵自习室", "room_desc": "自习室描述", "is_open": "是否开放", "config_url": "自习室布局", "capacity": "自习室容量", "reserved":"已预约数量"}]
    */
    rooms: [],
    room_name: [],
    room_dict: {},
    room_value: 0,
    show: false,
    dialog: false,
    wrap1: false,
    selected_seat_msg: "",
    msg: {},
  },

  setRoomInformation() {
    console.log('获取自习室信息！')
    // http://10.176.40.153:31115
    var baseUrl = 'http://106.14.206.100:8001/stu_room/';
    var stu_id = app.globalData.stu_id;
    var building_id = app.globalData.selected_building_id;
    var latitude = app.globalData.latitude; // 动态的 latitude 值
    var longitude = app.globalData.longitude; // 固定的 longitude 值
    var url = baseUrl + stu_id + "/" + building_id +"/" + '?latitude=' + latitude + '&longitude=' + longitude;
    console.log(url)
    var that = this; // 保存页面对象的引用
    var room_name = []
    var room_dict = {}
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {

          for(var i = 0; i < res.data.data.rooms.length; ++i) {
            room_dict[res.data.data.rooms[i].room_id] = res.data.data.rooms[i] 
            room_name.push(res.data.data.rooms[i].room_desc)
          }
          that.setData({
            room_name: room_name,
            rooms: res.data.data.rooms,
            room_value: 0,
            room_dict: room_dict
          }, () => {
            resolve(); // 数据更新完成后 resolve Promise
          });
          console.log('自习室信息为：');
          console.log(that.data.rooms);
        },
        fail: (err) => {
          console.error(err);
          reject(err); // 请求失败时 reject Promise
        }
      });
    });
  },

  // 获取座位信息：每一个座位的args
  /* (seat_id, room_id_id, x_position, y_position, is_open, is_reserved, is_with_plug) */
  setSeatInformation: function() {

    /*
    {
    "student": {"id": "主键", "wx_id": "微信号", "stu_id": "学号", "stu_name": "姓名"}, 
    "room": {"room_id": "自习室主键", "room_number": "自习室编号", "building_id": "楼宇主键", "overnight": "是否通宵自习室", 
            "room_desc": "自习室描述", "is_open": "是否开放", "config_url": "自习室布局", "capacity": "自习室容量"},
    "seats": [{"seat_id": "座位主键", "seat_number": "座位编号", "x_position": "座位横坐标", "y_position": "作为纵坐标", 
              "is_open": "是否开放", "is_reserved": "是否有约", "is_with_plug": "是否有插头"}]
    }
    */
  
    console.log('获取座位信息！')
    // http://10.176.40.153:31115
    var baseUrl = 'http://106.14.206.100:8001/stu_seat/';
    var stu_id = app.globalData.stu_id;
    var room_id = this.data.rooms[this.data.room_value].room_id //this.data.room_value

    var start_time = app.globalData.start_rsv_time
    var end_time =  app.globalData.end_rsv_time
    var url = baseUrl + stu_id + "/" + room_id + "/?" + "start_time=" + start_time + "&end_time=" + end_time;
    console.log(url)
    var that = this
    var jsSeatInformation = []
    wx.request({
      url: url, // 替换为您要请求的 URL
      method: 'GET',
      success: function(res) { // 使用普通函数
        console.log('自习室座位信息为：');
        console.log(res.data)
        for (var i = 0; i < res.data.data.seats.length; ++i){
          jsSeatInformation.push({
            seat_number: res.data.data.seats[i].seat_number,
            seat_id: res.data.data.seats[i].seat_id,
            x_position: (Math.floor(i % 5)) * 140 + 25,
            y_position: Math.floor(i / 5) * 140 + 400,
            is_open: res.data.data.seats[i].is_open,
            is_reserved: res.data.data.seats[i].is_reserved,
            is_with_plug: res.data.data.seats[i].is_with_plug,
            button_class: "",
            msg:"",
          })
    
        }
  
        // show in page, get last 3 number as seat name
    
        for(var i = 0; i < 120; i++) {
          jsSeatInformation[i].msg = jsSeatInformation[i].seat_number.substring(jsSeatInformation[i].seat_number.length - 3)
          if (jsSeatInformation[i].is_with_plug) {
            jsSeatInformation[i].msg += "*"
          }
          if (jsSeatInformation[i].is_reserved) {
            jsSeatInformation[i].button_class = "weui-btn weui-btn_disabled weui-btn_primary"
          } else {
            jsSeatInformation[i].button_class = "weui-btn weui-btn_default"
          }
        }
      
        that.setData({
          seatInformation: jsSeatInformation
        })

      },
      fail: function(err) { 
        console.error(err); 
      }
    });


  },

  bindPickerChange(e) {
    console.log("change")
    // 改变时，应当根据自习室不同来改变下面的seats list
    // 进入这个页面之前，应当拿到整个building的全部信息
    this.setData({
      room_value: e.detail.value,
    });
    console.log("room value"+e.detail.value)
    this.setSeatInformation();

  },

  // 处理预约座位
  seatConfirm(e) {
    let msg = e.target.dataset.info
    // console.log(msg)
    console.log("预约座位")
    console.log(msg)
    this.setData({
      msg: msg,
    })
    // 伪·无法选中
    if (msg.is_reserved) return

    this.setData({
      selected_seat_msg: msg.seat_number.substring(msg.seat_number.length - 3)
    })

    // 参考代码：https://github.com/Tencent/weui-wxss/blob/master/dist/example/half-screen-dialog/half-screen-dialog.js
    this.setData({
      dialog: true,
      show: true,
    });

    const promise3 = new Promise((resolve, reject) => {
      wx.createSelectorQuery().select('#js_btn2_1')
        .boundingClientRect((rect) => {
          resolve(rect.height);
        })
        .exec();
    });
    const promise4 = new Promise((resolve, reject) => {
      wx.createSelectorQuery().select('#js_btn2_2')
        .boundingClientRect((rect) => {
          resolve(rect.height);
        })
        .exec();
    });
    Promise.all([promise3, promise4]).then((values) => {
      if (values[0] != values[1]) {
        this.setData({ wrap1: true });
      }
    });
  },

  close() {
    this.setData({
      dialog: false,
    });

    var that = this;
    setTimeout(function(){
      that.setData({
        show: false,
      });
    }, 400);
  },

  close_and_confirm() {
    this.close();
    /* POST something to backend */
    var cur_msg = this.data.msg
    var cur_room_value = this.data.room_value
    var cur_rooms = this.data.rooms
    console.log(cur_rooms)
    var cur_room_id  = cur_rooms[cur_room_value].room_id
    console.log(cur_room_id)
    var cur_user_id = app.globalData.stu_id
    wx.request({
      // http://10.176.40.153:31115
      url : 'http://106.14.206.100:8001/stu_seat/' + cur_user_id + "/" + cur_room_id+ "/",
  
      method: 'POST',
      data: {
        seat_id: cur_msg.seat_id,
        start_rsv_time: app.globalData.start_rsv_time,
        end_rsv_time: app.globalData.end_rsv_time,
      },
      success: function (res) {

        if (res.data.status === '201'){
          console.log(res); 
          app.globalData.room_desc = cur_rooms[cur_room_value].room_desc
          app.globalData.room_number = cur_rooms[cur_room_value].room_number
          app.globalData.seat_id = cur_msg.seat_id
          wx.navigateTo({
            url: '/pages/reserve_done/reserve_done',
          })
        }
        else{
          console.log(res)
          wx.showToast({title: res.error, icon: 'none'})
        }
      },
      fail: function (err) {
        console.error(err); // 输出错误信息
        // 在这里可以处理请求失败的情况
        wx.showToast({title: "请重试", icon: 'none'})
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setRoomInformation().then(() => {
      return this.setSeatInformation();
    }).then(() => {
      console.log(this.data.seatInformation);
    }).catch((err) => {
      console.error(err);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(this.data.seatInformation)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})