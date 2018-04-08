
Page({

  /**
   * 页面的初始数据
   */
  data: {

    card1aUrl: "https://www.webjoker.top/collection/false/team/b.png",
    card1bUrl: "https://www.webjoker.top/collection/true/team/b.png",
    card2aUrl: "https://www.webjoker.top/collection/false/team/a.png",
    card2bUrl: "https://www.webjoker.top/collection/true/team/a.png",
    card1Url: "https://www.webjoker.top/collection/false/team/b.png",
    card2Url: "https://www.webjoker.top/collection/false/team/a.png",
    
    titletext:"请选择集卡",
    ownertext:"西电科协",
    
    chosenpuzzle:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  
  /**
   * 点击图片选择集卡
   */
  tapCard1: function(){
    this.setData({
      card1Url: this.data.card1bUrl,
      card2Url: this.data.card2aUrl,
      chosenpuzzle: 2
    })
  },
  tapCard2: function(){
    this.setData({
      card1Url: this.data.card1aUrl,
      card2Url: this.data.card2bUrl,
      chosenpuzzle: 1
    })
  },
  
  /**
   *点击确认选择 
   */
  tapConfirmButton: function(){
    if(this.data.chosenpuzzle == 0){
      wx.showToast({
        title: '请选择卡片',
        icon: 'none',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    }else{
      /**
        * 传递参数到服务器
      */
      var usertoken = wx.getStorageSync("usertoken");
      var rUrl = 'https://www.webjoker.top/api/info/';

      wx.request({
        url: rUrl,
        header: {
          Authorization: "Bearer " + usertoken
        },
        method: "POST",
        data:{
          photo_id: this.data.chosenpuzzle
        },
        success:function(res){
          console.log(res.data);
          /**
            * 跳转到集卡页面
           */
          wx.redirectTo({
            url: '../main/main'
          });
        },
        fail:function(res){
          console.log(res);
        }
      })
    }
  }
})