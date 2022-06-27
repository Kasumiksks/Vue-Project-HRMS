<template>
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox label="110">管理员</el-checkbox>
      <el-checkbox label="113">开发者</el-checkbox>
      <el-checkbox label="115">人事</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleIds: []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
