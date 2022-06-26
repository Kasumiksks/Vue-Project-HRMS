<template>
  <div class="app-container">
    <el-form
      ref="userForm"
      :rules="rules"
      :model="userInfo"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="hSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getStaffInfo } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.loadUserInfo()
    console.log(this.$route.query.id)
  },
  methods: {
    // 回填员工账号密码
    async loadUserInfo() {
      try {
        const res = await getStaffInfo(this.$route.query.id)
        this.userInfo = res.data
      } catch (error) {
        console.log(error)
      }
    },

    // 更新函数
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
    // 提交更新员工账号密码
    hSubmit() {
      this.$refs.userForm.validate(valid => {
        if (!valid) return this.$message.error('请检查输入')
        this.doUpdate()
      })
    }
  }
}
</script>

<style>

</style>
