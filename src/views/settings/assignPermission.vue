<template>
  <div>
    <!--
      1. show-checkbox 显示选择框
      2. default-expand-all 默认展开
      3. check-strictly  设置true，可以关闭父子关联 -->
    <el-tree
      ref="refTree"
      :data="permissionList"
      :props="{label:'name'}"
      default-expand-all
      :show-checkbox="true"
      node-key="id"
      :check-strictly="true"
    />
    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="hCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeList } from '@/utils'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  props: {
    curId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      permissionList: []
    }
  },
  created() {
    this.loadPermissionList()
    this.loadRoleDetails()
  },
  methods: {
    hSubmit() {
      this.doAssign()
      // 通过父组件去关闭弹层
      this.$emit('close')
    },
    hCancel() {
      this.$emit('close')
      // 清空当前的选择
      this.$refs.refTree.setCheckedKeys([])
    },
    // 加载所有的权限列表
    async loadPermissionList() {
      try {
        const res = await getPermissionList()
        this.permissionList = tranListToTreeList(res.data)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取当前角色所拥有的的权限列表
    async loadRoleDetails() {
      try {
        const res = await getRoleDetail(this.curId)
        // 回填
        this.$refs.refTree.setCheckedKeys(res.data.permIds)
      } catch (error) {
        console.log(error)
      }
    },
    // 分配权限的函数
    async doAssign() {
      try {
        // 获取选中的权限点
        const permIds = this.$refs.refTree.getCheckedKeys()
        const res = await assignPerm({ id: this.curId, permIds })
        this.$message.success(res.message)
        this.hCancel()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
