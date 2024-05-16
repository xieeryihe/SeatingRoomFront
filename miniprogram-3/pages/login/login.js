// pages/login/login.js
var app = getApp()
Page({
  data: {
    stu_id: "",
    password: ""
  },
  inputUsername: function(e) {
    this.setData({
      stu_id: e.detail.value
    });
  },
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },
  onLogin: function () {
    var stu_id = this.data.stu_id;
    var password = this.data.password;  
    console.log(stu_id)
    console.log(password)
    wx.request({
      url: 'http://106.14.206.100:8001/login',
      method: 'POST',
      data: {
        stu_id: stu_id,
        password: password,
      },
      success: function (res) {
        console.log(res.data); 
        if (res.data.status === '200'){
          app.globalData.stu_id = stu_id
          app.globalData.stu_name = res.data.data.stu_name
          wx.setStorageSync('isLoggedIn', true)
          wx.switchTab({url: '/pages/menu/menu'})
          // wx.redirectTo({url: '/pages/menu/menu'})
        }
        else{
          wx.showToast({title: res.data.error, icon: 'none'})
        }
      },
      fail: function (err) {
        console.error(err); // 输出错误信息
        // 在这里可以处理请求失败的情况
        wx.showToast({title: "请重试", icon: 'none'})
      }
    });
  }
})