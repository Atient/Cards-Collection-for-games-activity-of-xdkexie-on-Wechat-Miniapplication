var UTIL = require('../../utils/util.js')

var userdata;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titletext: "科技游园会",
    ownertext: "西电科协",
    buttontext: "扫码集卡",
    gifttext: "申请兑奖",
    giftbuttoncolor: "grey",
    showtext: "查看规则",
    remindtext: "轻触关闭",

    ruletitle: "活动规则",
    rule: "*本次活动仅可选择集两张卡中的一张，碎片只可通过参与游戏后扫取二维码获取，扫取属于另一张卡的二维码是无效的。\n*此次活动兑奖规则为：1、3块碎片不可兑奖；2块碎片可兑四等奖；4块碎片可兑三等奖；5块碎片可兑二等奖；6块可兑一等奖。奖品兑完为止。\n*兑奖时通过到兑奖处扫取兑奖码核实信息，若兑奖成功，请将兑奖页面留与工作人员查验后再关闭，否则无法兑奖。活动期间只可进行一次兑奖，兑奖后再收集新的碎片无法提升奖品等级。\n*最终解释权归西电校科协所有。",

    successtitle:"兑奖成功",
    totaltext: "集卡总数",
    confirmbutton: "请确认兑奖后点击关闭",

    falseUrl: "https://www.webjoker.top/collection/false/main",
    trueUrl: "https://www.webjoker.top/collection/true/main",

    imgs:[
      {},
      { iscollected: false, Url: "" },
      { iscollected: false, Url: "" },
      { iscollected: false, Url: "" },
      { iscollected: false, Url: "" },
      { iscollected: false, Url: "" },
      { iscollected: false, Url: "" }],

    puzzle:0,
    imgtotal:0,
    allcollected: false,
    giftallow: false,

    isFirstOpen: false,//true为第一次打开
    ruleshow: false,
    successshow:false,

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /**
     * 获取用户集卡信息
     */
    var usertoken = wx.getStorageSync("usertoken");
    var that = this;

    var rUrl = 'https://www.webjoker.top/api/collection/';
    wx.request({
      url: rUrl,
      header: {
        Authorization: "Bearer " + usertoken
      },
      method: "GET",
      success: function (res) {

        console.log(res);

        userdata = res.data.data;

        console.log(userdata);

        that.setData({
          puzzle: userdata.photo_id
        })
        if (userdata.is_all == 0) {
          that.setData({
            allcollected: false
          })
        } else {
          that.setData({
            allcollected: true
          })
        }

        if (userdata.QR_id[0] != "") {
          for (var j = 0; j < userdata.QR_id.length; j++) {
            var datastr = "imgs[" + userdata.QR_id[j] + "].iscollected";
            that.setData({
              [datastr]: true
            });
          }
        }

        that.totalImage();

        //判断
        if (that.data.imgtotal >= 2 && that.data.imgtotal != 3) {
          that.setData({
            giftallow: true,
            giftbuttoncolor: "burlywood"
          });
        } else {
          that.setData({
            giftallow: false,
            giftbuttoncolor: "grey"
          });
        }

        /**
         * 集卡初始化,处理前端显示
         */
        for (var i = 1; i <= 6; i++) {
          var puzzlepart = "/puzzle" + that.data.puzzle + "/" + i + ".png";
          var setstr = "imgs[" + i + "].Url";


          if (!that.data.imgs[i].iscollected) {
            that.setData({
              [setstr]: that.data.falseUrl + puzzlepart
            });
          } else {
            that.setData({
              [setstr]: that.data.trueUrl + puzzlepart
            });
          }
        }

        if (!that.data.allcollected) {
          that.setData({ buttontext: "扫码集卡" });
        } else {
          that.setData({ buttontext: "已集齐" });
        }

      },
      fail: function (res) {
        console.log(res.data);
      }
    });

    //判断是否是第一次打开页面  !有误
    wx.getStorage({
      key: 'isFirstOpen',
      success: function(res) {

        console.log(res);

        that.setData({
          isFirstOpen: res.data
        });
        wx.setStorage({
          key: 'isFirstOpen',
          data: 'false',
        })
      },
      fail:function(res){
        console.log(res);

        that.setData({
          isFirstOpen: true,
          ruleshow: true
        });

        wx.setStorage({
          key: 'isFirstOpen',
          data: 'false',
        })
      }
    })  

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
   * 
   */
  tapSwitchButton:function(){
    if(!this.data.allcollected){
      this.tapScanButton();
    }else{
      wx.showToast({
        title: '已集齐，请前往兑奖处兑奖',
        icon: 'none',
        image: '',
        duration: 2000,
        mask: false,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { }
      })
    }
  },

  tapScanButton:function(){
    var rUrl = "https://www.webjoker.top/api/collection";
    var usertoken = wx.getStorageSync("usertoken");
    var that = this;

//扫码集卡
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ["QR"],
      success: function(res) {
        /**
         * 二维码解密
         */
        var QRcode = UTIL.qrDecrypt(res.result);
        
        /**
         * 合成JSON对象并检查
         */

        var QRres = JSON.parse(QRcode);

        if(QRres.app!="collection"){
          wx.showToast({
            title: '这不是活动二维码哟！',
            icon: 'none',
            image: '',
            duration: 2000,
            mask: true,
            })
        }else{
        
        /**
         * 请求后台集卡
         */
        wx.request({
          url: rUrl,
          header:{
            Authorization: "Bearer " + usertoken
          },
          method:"POST",
          data:{
            photo_id: QRres.photo_id,
            QR_id: QRres.QR_id
          },
          success:function(res){
              console.log(res.data);
              
              if (res.data.code == 404) {
                wx.showToast({
                  title: '这块碎片已经收集了哦!',
                  icon: 'none',
                  image: '',
                  duration: 2000,
                  mask: true,
                })
              } else if(res.data.code == "403"){
                wx.showToast({
                  title: '这块碎片是另一张卡的！',
                  icon: 'none',
                  image: '',
                  duration: 2000,
                  mask: true,
                });
              }else{
                  var datastr = "imgs[" + QRres.QR_id + "].iscollected";
                  var isalltrue = true;

                  that.setData({
                    [datastr]: true
                  });

                  for(var k=1;k<=6;k++){
                    if(that.data.imgs[k].iscollected == false){
                      isalltrue = false;
                    } 
                  }

                  that.setData({
                      allcollected: isalltrue
                  });

                  that.onLoad();
              }
            },
            fail:function(res){
              console.log(res);
            }
          })
        }
      },
      fail: function(res) { 
        console.log(res);
      },
      complete: function(res) {},
    })
  },

  /**
   * 申请兑奖
   */
  tapGiftButton:function(){
    var that = this;

    if(!this.data.giftallow){
      wx.showToast({
        title: '还未达到兑奖要求，请继续努力！',
        icon: 'none',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ["QR"],
        success: function (res) {
          /**
           * 二维码解密
           */
          var QRcode = UTIL.qrDecrypt(res.result);

          /**
           * 合成JSON对象并检查
           */

          var QRres = JSON.parse(QRcode);

          if (QRres.app != "collection") {
            wx.showToast({
              title: '这不是活动二维码哟！',
              icon: 'none',
              image: '',
              duration: 2000,
              mask: true,
            });
          } else if (QRres.QR_id != 7) {
            wx.showToast({
              title: '这不是兑奖二维码哟！',
              icon: 'none',
              image: '',
              duration: 2000,
              mask: true,
            })
          } else {
            var rUrl = "https://www.webjoker.top/api/cash";
            var usertoken = wx.getStorageSync('usertoken');

            wx.request({
              url: rUrl,
              header:{
                Authorization: "Bearer " + usertoken
              },
              method:"GET",

              //查询成功
              success:function(res){
                
                console.log(res.data.is_cashed);

                //-1为已经兑奖，其余为集卡数量
                if(res.data.is_cashed == -1){
                  wx.showToast({
                    title: '已经兑过奖啦，不要太贪心哦！',
                    icon: 'none',
                    image: '',
                    duration: 2000,
                    mask: true,
                  })
                }else{
                  that.setData({
                    imgtotal: res.data.is_cashed
                  });
                  
                  if(that.data.imgtotal >= 2){
                    wx.request({
                      url: rUrl,
                      header:{
                        Authorization: "Bearer " + usertoken
                      },
                      method:"POST",
                      success:function(res){
                        
                        //兑奖成功
                        that.setData({
                          successshow: true
                        });
                        console.log("兑奖成功");

                      },
                      fail:function(){
                        console.log(res);
                        wx.showToast({
                          title: '兑奖失败，请重试',
                          icon: 'none',
                          image: '',
                          duration: 2000,
                          mask: true,
                        })
                      }
                    })
                  }

                }
              },
              //查询失败
              fail:function(res){
                console.log(res);
              }
            })
          }
        }
      })
    }
  },

  totalImage:function(){
    var total=0;
    for(var m=1;m<=6;m++){
      if(this.data.imgs[m].iscollected == true){
        total++;
      }
    }

    this.setData({
      imgtotal: total
    });
  },

  tapShowButton:function(){
    this.setData({
      ruleshow: true
    });
  },

  tapHide:function(){
    this.setData({
      ruleshow: false
    });
  },

  tapClose: function () {
    this.setData({
      successshow: false
    });
  }

})
