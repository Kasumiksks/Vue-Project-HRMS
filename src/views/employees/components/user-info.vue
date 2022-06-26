<template>
  <div class="app-container">
    <div class="user-info">
      <!-- 个人信息 -->
      <el-form ref="userForm" label-width="220px" :model="userInfo">
        <!--手机 -->

        <el-form-item label="手机">
          <el-input v-model="userInfo.mobile" style="width:220px" disabled />
        </el-form-item>

        <!-- 工号 入职时间 -->

        <el-form-item label="入职时间">
          <el-date-picker
            v-model="userInfo.timeOfEntry"
            type="date"
            class="inputW"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>

        <!-- 员工照片 -->

        <el-form-item label="员工头像">
          <!-- 放置上传图片 -->
          <img>
        </el-form-item>

        <!-- 保存个人信息 -->
        <el-form-item>
          <el-button type="primary" @click="hSubmit">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getStaffInfo } from '@/api/user.js'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {
        mobile: '',
        timeOfEntry: ''
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
  // 获取信息
    async loadUserInfo() {
      try {
        const res = await getStaffInfo(this.userId)
        this.userInfo = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 更新的函数
    async doUpdate() {
      try {
        const res = await saveUserDetailById(this.userInfo)
        this.$message.success(res.message)
        this.$router.back()
      } catch (error) {
        console.log(error)
        this.$message.error('修改失败')
      }
    },
    // 点击更新
    hSubmit() {
      this.$refs.userForm.validate(valid => {
        if (!valid) return this.$message.error('请检查输入')
        this.doUpdate()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
