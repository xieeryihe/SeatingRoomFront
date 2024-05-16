// pages/login/login.js

Page({
  data: {
    user_fdu_id: "",
    password: "",
    user_email:"",
    Vcode:-2,
    serverVCode:-1,
    stu_name: "",
  },

  inputUserFduID: function(e) {
    this.setData({
      user_fdu_id: e.detail.value
    });
  },

  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  inputVCode: function(e) {
    this.setData({
      Vcode: e.detail.value
    });
  },

  inputEmail: function(e) {
    this.setData({
      user_email: e.detail.value
    });
  },

  inputName: function(e) {
    this.setData({
      stu_name: e.detail.value
    });
  },

  getServerVCode: function(e) {
    this.setData({
      serverVCode: 123456
    });
  },

  onRegister: function () {
    
    var stu_id = this.data.user_fdu_id;
    var password = this.data.password;    
    var stu_name = this.data.stu_name;   
    var email = this.data.user_email;
    // "http://10.176.40.153:31115
    var url = "http://106.14.206.100:8001/register"
    console.log(wx.getAccountInfoSync().miniProgram.appId)
    console.log(stu_name)
    console.log(stu_id)
    console.log(password)
    console.log(email)
    if (2 > 1) {
      wx.request({
        url : url,
        method: 'POST',
        data: {
          // wx_id: wx.getAccountInfoSync().miniProgram.appId,
          wx_id: 114514,
          stu_id: stu_id,
          email: email,
          stu_name: stu_name,
          password: password,
        },
        success: function (res) {
          console.log(res); 
          wx.setStorageSync('isLoggedIn', true)
          wx.redirectTo({url: '/pages/index/index'})
        },
        fail: function (err) {
          console.error("注册出错"); // 输出错误信息
          console.error(err); // 输出错误信息
          // 在这里可以处理请求失败的情况
          wx.showToast({title: "请重试", icon: 'none'})
        }
      });
    } else {
      wx.showToast({title: '请重试', icon: 'none'})
      // wx.showToast({title: '验证码错误', icon: 'none'})
    }
  },
})