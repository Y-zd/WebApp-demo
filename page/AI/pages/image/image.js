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

  
        wx.login({
          success(res2) {
            if (res2.code) {
          
              wx.uploadFile({
                url: 'https://tool.yanzhidong.com/ai/AipOrc/Async/basicAccurateGeneral', //仅为示例，非真实的接口地址
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: {
                  'jsCode': res2.code,
                  'fileName': 'test',
                },
                success: function (res) {
                  console.log("返回成功的数据:" + res.data) //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  

                  that.setData({
                    text: res.data
                  })
                },
                fail: function (res) {
                  console.log("返回失败的数据:" + res.data) //返回的会是对象，可以用JSON转字符串打印出来方便查看数据  
                  that.setData({
                    text: res.data
                  })
                }
              })


            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })


        wx.cloud.init()
        const db = wx.cloud.database()


        db.collection('orcReturnMessage').where({
          openid:'oDnMd5PTu-57CDA1pCeeP2zFhOnA',
          fileName:'123'
        }).field({
          message: true,
        }).get().then(res => {
          console.log(res.data)
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
