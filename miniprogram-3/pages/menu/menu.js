// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  // 预约
  seatReserve: function() {
    console.log('Button 1 clicked')
    wx.navigateTo({url: '/pages/reserve/reserve'})

  },

  //扫码
  button2Click: function() {
    // http://10.176.40.153:31115
    var url = 'http://106.14.206.100:8001/qrcode/1'
    wx.request({
      url : url,
      method: 'GET',
      success: function (res) {
        
        console.log(res); 
        
      },
      fail: function (err) {
        console.error(err); // 输出错误信息
        // 在这里可以处理请求失败的情况
        wx.showToast({title: "请重试", icon: 'none'})
      }
    });

    wx.scanCode({
      onlyFromCamera: true, // 仅从相机扫码
      scanType: ['qrCode'], // 扫码类型：二维码、条形码
      success: function (res) {
        // 扫码成功的回调函数
        console.log(res)
        console.log(res.result); // 打印扫描结果
        // http://10.176.40.153:31115/signin
        var code_url = 'http://106.14.206.100:8001/signin'
        wx.request({
          url : code_url,
          method: 'POST',
          data: {
            stu_id: app.globalData.stu_id,
            signin_code: res.result,
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude,
          },
          success: function (res) {
            console.log(res); 
            wx.navigateTo({url: '/pages/sigin_done/sigin_done'})
          },
          fail: function (err) {
            console.error(err); // 输出错误信息
            // 在这里可以处理请求失败的情况
            wx.showToast({title: "请重试", icon: 'none'})
          }
        });
      }
    })



  },

  //查询预约记录
  getReserveLogs: function() {
    console.log('Button 3 clicked')
    wx.navigateTo({url: '/pages/reserve_logs/reserve_logs'})
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

  onLoad(){
    this.setLocation()
  }
})
