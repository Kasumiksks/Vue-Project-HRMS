<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd('0',1)">添加权限</el-button>
        </div>
        <!-- 树形数据加 row-key就具备折叠的效果了 -->
        <el-table border :data="permissionList" row-key="id" default-expand-all="">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button v-if="row.id" type="text" @click="hAdd(row.id,2)">添加</el-button>
              <el-button type="text" @click="hEdit(row)">编辑</el-button>
              <el-button type="text" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 弹层 -->
      <el-dialog :visible.sync="showDialog" :title="isEdit?'编辑权限':'添加权限'" @closed="hClose">
        <!-- 表单内容 -->
        <el-form ref="dialogForm" label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-text="启用"
              active-value="1"
              inactive-text="不启用"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="hSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, updatePermission } from '@/api/permission'
import { tranListToTreeList } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      isEdit: false,
      permissionList: [],
      list: [],
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    // 获取权限列表
    async loadPermissionList() {
      try {
        const res = await getPermissionList()
        this.permissionList = tranListToTreeList(res.data)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击添加打开弹窗
    hAdd(pid, type) {
      this.showDialog = true
      this.isEdit = false
      this.formData.pid = pid
      this.formData.type = type
    },
    // 添加的函数
    async doAdd() {
      try {
        const res = await addPermission(this.formData)
        this.$message.success(res.message)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击删除
    hDel(id) {
      this.$confirm('删除操作不可逆,确认删除吗?', '提示', {
        confirmButtonText: '我确定',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(() => {
        this.doDel(id)
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 删除的函数
    async doDel(id) {
      try {
        const res = await delPermission(id)
        this.$message.success(res.message)
        this.showDialog = false
        this.loadPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 点击编辑
    hEdit(row) {
      this.isEdit = true
      this.showDialog = true
      this.formData = { ...row } // 数据回填
    },
    // 编辑的函数
    async doEdit() {
      try {
        const res = await updatePermission(this.formData)
        this.$message.success(res.message)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击确认添加/编辑权限
    hSubmit() {
      // // 表单验证
      // this.$refs.dialogForm.validate(valid => {
      //   if (!valid) return this.$message.error('请检查输入')
      // })
      this.isEdit ? this.doEdit() : this.doAdd()
      this.showDialog = false
      this.loadPermissionList()
    },

    // 关闭弹层时重置表单
    hClose() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        pid: '',
        type: ''
      }
      this.$refs.dialogForm.resetFields()
    }
  }
}
</script>

