<template>
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in rolesList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles } from '@/api/setting'
import { getStaffInfo } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      rolesList: []
    }
  },
  // created() {
  //   this.loadRolesList()
  // },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    // 获取角色列表
    async loadRolesList() {
      try {
        const res = await getRoles()
        this.rolesList = res.data.rows

        const info = await getStaffInfo(this.id)
        this.roleIds = info.data.roleIds
      } catch (error) {
        console.log(error)
      }
    },
    // 分配角色函数
    async doAssignRoles() {
      try {
        const res = await assignRoles({ id: this.id, roleIds: this.roleIds })
        this.$message.success(res.message)
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击确认分配角色
    hSubmit() {
      this.doAssignRoles()
    }
  }
}
</script>
