var app = getApp()


Page({
  data: {
    // 日期应当根据当前时间获取
    // begin_days: ['5月12日', '5月13日', '5月31日', '12月31日'],
    begin_days: [],
    // begin_times: ['18:00', '19:00', '20:00', '21:00'],
    begin_times: [],
    periods: ['1小时', '2小时', '3小时', '4小时'],
    month_max: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    begin_day_value: 0,
    begin_time_value: 0,
    period_value: 0
  },
  
  bindPickerBegin1Change(e) {
    this.setData({
      begin_day_value: e.detail.value,
    });
  },

  bindPickerBegin2Change(e) {
    this.setData({
      begin_time_value: e.detail.value,
    });
  },

  bindPickerPeriodChange(e) {
    this.setData({
      period_value: e.detail.value,
    });
  },
  // 

  query(e) {
    let start_rsv_time = this.dateFormatConvert(this.data.begin_days[this.data.begin_day_value], this.data.begin_times[this.data.begin_time_value])
    console.log("开始时间")
    console.log(start_rsv_time) // 2023-05-12 19:00
    
    console.log("结束时间")
    let end_rsv_time = this.getEndRsvTime(start_rsv_time, this.data.periods[this.data.period_value])
    console.log(end_rsv_time)
    app.globalData.start_rsv_time = start_rsv_time
    app.globalData.end_rsv_time = end_rsv_time
    // 条件跳转
    wx.navigateTo({url: '/pages/select_building/select_building'})
  },

  dateFormatConvert(date, time) {
    // (5月12日, 18:00) -> 2023-05-12 18:00
    let yy = "2023" // fixed
    let m = date.split("月")[0]
    let d = date.split("月")[1].slice(0, -1)
    let mm = this.pad(parseInt(m), 2).toString()
    let dd = this.pad(parseInt(d), 2).toString()
    let date_formated = yy + '-' + mm + '-' + dd + ' ' + time
    console.log(date_formated)
    return date_formated
  },

  getEndRsvTime(date_formated, period_chinese) {
    // (2023-05-12 18:00, 1小时) -> 2023-05-12 19:00
    let date = date_formated.split(" ")[0]  // 2023-05-12
    let time = date_formated.split(" ")[1]  // 18:00
    let date_arr = date.split("-")  // [2023, 05, 12]
    let time_arr = time.split(":")  // [18, 00]
    console.log(time_arr)
    let period = period_chinese[0]  // 1
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 闰年就不处理了
    if (parseInt(time_arr[0]) + parseInt(period) < 24) {
      // 不跨天
      return date + " " + (parseInt(time_arr[0]) + parseInt(period)).toString() + ":" + time_arr[1]
    } else if (parseInt(date_arr[2]) + 1 <= months[parseInt(date_arr[1])-1]) {
      // 不跨月
      let date0 = date.slice(0, date.length - 2) + (parseInt(date_arr[2]) + 1).toString()
      return date0 + " 0" + (parseInt(time_arr[0]) + parseInt(period) - 24).toString() + ":" + time_arr[1]
    } else if (date_arr[1] != "12") {
      // 不跨年
      let date0 = date_arr[0] + "-" + (this.pad(parseInt(date_arr[1]) + 1, 2)).toString() + "-01"
      return date0 + " 0" + (parseInt(time_arr[0]) + parseInt(period) - 24).toString() + ":" + time_arr[1]
    } else {
      return (parseInt(date_arr[0]) + 1).toString() + "-01-01 0" + (parseInt(time_arr[0]) + parseInt(period) - 24).toString()  + ":" + time_arr[1]
    }
  },

  pad(num, n) {  
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
  },

  setTime() {
    // 创建 Date 对象
    const currentDate = new Date();

    // 获取年份
    const year = currentDate.getFullYear();

    // 获取月份（注意月份是从 0 开始计数的，所以要加 1）
    const month = currentDate.getMonth() + 1;

    // 获取日期
    const day = currentDate.getDate();

    // 获取小时
    const hours = currentDate.getHours();

    // 获取分钟
    const minutes = currentDate.getMinutes();

    // 获取秒钟
    const seconds = currentDate.getSeconds();

    // 打印当前时间
    console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    var d = 0
    var cnt_month = month-1
    var begin_days = []
    var begin_times = []
    for(var i = day; i <= this.data.month_max[cnt_month] && d < 3; ++i, ++d){
      begin_days.push(`${month}月${i}日`)
      if(i == this.data.month_max[cnt_month]){
        if(cnt_month == 11)
          cnt_month = 0
        else
          cnt_month += 1
        i = 0
      }
    }
    d = 0
    for(var i = hours; i <= 24 && d < 3; ++i, ++d){
      if(i == 24 && minutes != '00'){
        i = 0;
        d -= 1;
        continue;
      }
      begin_times.push(`${i}:${minutes}`)
      if(i == 23){
        i = -1;
      }
    }
    this.setData({
      begin_days: begin_days,
      begin_times: begin_times,
    })
  },

  onLoad(){
    this.setTime()
  }
})