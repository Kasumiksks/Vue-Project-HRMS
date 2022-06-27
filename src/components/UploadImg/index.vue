<template>
  <div>
    <!--
      show-file-list: 是否显示上传的文件列表
      action: '#' 用来指定文件要上传的地址，由于我们需要定制上传动作
      :http-request：自定义上传行为（重点）
      on-success: 上传成功之后的回调
      before-upload： 上传之前的检查
    -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />

      <!-- 进度条 -->
      <el-progress v-if="showProgress" type="circle" :percentage="percent" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 固定写法
const COS = require('cos-js-sdk-v5')
// 填写自己腾讯云cos中的key和id (密钥)
const cos = new COS({
  // APPID: 1312673525
  SecretId: 'AKIDlQvEJ9mDRQCk7HE2f8QVP6at30iFdrre', // 身份识别ID
  SecretKey: 'OaYHqBIAweQ7fGk14vb8h7KMAUfkeNwU' // 身份秘钥
})
console.log(cos)
export default {
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      percent: 20,
      showProgress: false
    }
  },
  methods: {
    upload(res) {
      if (res.file) {
        // 执行上传操作
        this.showProgress = true
        cos.putObject({
          Bucket: 'kasumi-1312673525', /* 存储桶 */
          Region: 'ap-chongqing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          // 配置进度条
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            this.$emit('input', `https:${data.Location}`)
          }
          // 隐藏进度条
          this.showProgress = false
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #fff;
}
</style>
