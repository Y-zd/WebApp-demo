var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
  data: {
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
  },
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      success: function (res) {
        wx.showLoading({
          title: '识别中,请稍后查看',
        })
        that.setData({
          imageList: res.tempFilePaths
        })
         wx.login({
          success(res2) {
            if (res2.code) {
              var time = new Date().getTime()
              wx.uploadFile({
                url: 'https://tool.yanzhidong.com/ai/AipOrc/Async/basicAccurateGeneral', //仅为示例，非真实的接口地址
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: {
                  'jsCode': res2.code,
                  'fileName': time,
                },
                success: function (res3) {
                  var openId = res3.data;
                  that.setData({
                    time: time
                  })
                  that.setData({
                    openid: openId
                  })
                  wx.cloud.init()
                  const db = wx.cloud.database()
                 
                    db.collection('orcReturnMessage').where({
                      openid: openId,
                      fileName: time+""
                    }).field({
                      message: true,
                    }).get().then(res => {
                      wx.hideLoading()
                      if(res.data.length>0){
                    that.setData({
                        text: res.data[0].message
                      })
                      }                      
                    })
                  
                },
                fail: function (res3) {
                  console.log("返回失败的数据:",res3) //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  
                  that.setData({
                    text: res3
                  })
                }
              })


            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })


  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  clickMe: function (e) {
    var time = e.currentTarget.dataset.time
    var openid = e.currentTarget.dataset.openid 
 
    var that = this
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection('orcReturnMessage').where({
      openid: openid,
      fileName: time + ""
    }).field({
      message: true,
    }).get().then(res => {

      if (res.data.length > 0) {
          that.setData({
          text: res.data[0].message
        })
      }else{
        wx.showLoading({
          title: '翻译中,请稍后查看',
          duration: 2000, 	 //设置显示时间
        })
      }
    })




  }
})
