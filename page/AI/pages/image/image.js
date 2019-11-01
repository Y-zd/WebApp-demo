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
        that.setData({
          imageList: res.tempFilePaths
        })

        wx.showLoading({
          title: '加载中',
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
                  var i=0
                  wx.cloud.init()
                  const db = wx.cloud.database()
                  do {
                    db.collection('orcReturnMessage').where({
                      openid: openId,
                      fileName: time+""
                    }).field({
                      message: true,
                    }).get().then(res => {
        
                      if(res.data.length>0){
                        console.log("$$")
                        console.log(res) 

                    that.setData({
                        text: res.data[0].message
                      })
                        wx.hideLoading()
                      i++;
                      }                      
                    })
                  }
                  while (i<0);                 
                },
                fail: function (res3) {
                  console.log("返回失败的数据:" + res3.data) //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  
                  that.setData({
                    text: res3.data
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
  }
})
