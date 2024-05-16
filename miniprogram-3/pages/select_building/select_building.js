var app = getApp();

Page({
  data: {
    /*
    {
    "student": {"id": "主键", "wx_id": "微信号", "stu_id": "学号", "stu_name": "姓名"}, 
    "buildings": [{"building_id": "楼宇主键", "building_abbr": "楼宇编号", "building_name": "楼宇名称", 
      "building_desc": "楼宇描述", "is_open": "是否开放", "config_url": "楼宇外景图",
      "distance": "楼宇距离", "capacity": "楼宇总容量", "reserved": "楼宇总预约量"}]
    }
    */
    latitude: 0,
    longitude: 0,
    buildings: [],
    // selected_index: null
  },

  setBuilding() {
    // get information from backend
    // http://10.176.40.153:31115
    var baseUrl = 'http://106.14.206.100:8001/stu_index/';
    
    var stu_id = app.globalData.stu_id;
    var latitude = this.data.latitude; 
    var longitude = this.data.longitude; 
    var url = baseUrl + stu_id + '?latitude=' + latitude + '&longitude=' + longitude;
    
    console.log(url)

    wx.request({
      url: url, // 替换为您要请求的 URL
      method: 'GET',
      success: (res) => {
        console.log(res.data); // 输出响应数据
        // 在这里可以对响应数据进行处理
        console.log(res.data.data.buildings)
        var jsBuildings = [];
        for (var i = 0; i < res.data.data.buildings.length; i++) {
          var item = res.data.data.buildings[i];
          console.log(item);
          jsBuildings.push({
            building_id: item.building_id,
            building_name: item.building_name,
            distance: item.distance.toFixed(3),
            building_desc: item.building_desc,
            seat: "" + (item.capacity - item.reserved).toString() + "/" + item.capacity.toString(),
          })
        }

        this.setData({
          buildings: jsBuildings
        })
      },
      fail: (err) => {
        console.error(err); // 输出错误信息
        wx.showToast({title: "请重试", icon: 'none'})
      }
    });
    
  },

  reserveConfirm(e) {
    // 获取信息，进入座位预订页面
    let msg = e.target.dataset.info
    let selected_building_id = msg.building_id
    app.globalData.selected_building_id = msg.building_id
    console.log("selected building_id = " + selected_building_id.toString())
    // 应该有一个加载过程，等待拿到后端数据后跳转
    app.globalData.building_name = msg.building_name
    wx.navigateTo({
      url: '/pages/seat/seat'
    })
  },

  setLocation() {
   
    wx.getLocation({
      type: 'wgs84',
      success: (res) => { // 使用箭头函数确保上下文不丢失
        var latitude = res.latitude; // 获取纬度
        var longitude = res.longitude; // 获取经度
        console.log(latitude, longitude);
        // 第一次获得经纬度
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        console.log("结束")
      },
      fail: (err) => { // 使用箭头函数确保上下文不丢失
        console.error(err); // 输出错误信息
        // 在这里可以处理定位失败的情况
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setLocation()
    setTimeout(this.setBuilding, 1000)
  },
})