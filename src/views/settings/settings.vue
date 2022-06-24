<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="hAdd"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roleList">
              <!-- 特殊的序号列 type="index" -->
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="hEdit(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="pageParams.page"
                :page-sizes="[2, 3, 5, 10]"
                :page-size="pageParams.pagesize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total"
                @current-change="hCurrentChange"
                @size-change="handleSizeChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增弹框 -->
      <el-dialog
        title="编辑弹层"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @closed="hClose"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="showDialog=false">取消</el-button>
            <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getRoles, deleteRole, addRole, updateRole } from '@/api/setting'
export default {
  data() {
    return {
      isEdit: false, // false:新增, true:编辑
      pageParams: {
        page: 1, // 页码值
        pagesize: 2 // 每页条数
      },
      roleList: [], // 角色列表
      total: 0, // 总的条数
      showDialog: false, // 对话框是否关闭
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 表格中最大的页码
    maxNum() {
      return Math.ceil(this.total / this.pageParams.pagesize)
    },
    // 最后一页是不是满的
    isLastPageFulled: function() {
      return this.total % this.pageParams.pagesize === 0
    }
  },
  created() {
    this.loadRoleList() // 调用请求方法的函数
  },
  methods: {
    // 调用方法, 发送请求,获取角色列表
    async loadRoleList() {
      try {
        const res = await getRoles(this.pageParams)
        this.roleList = res.data.rows
        this.total = res.data.total
      } catch (error) {
        console.log(error)
      }
    },
    hCurrentChange(val) {
      // 控制页码数值的变化
      this.pageParams.page = val
      this.loadRoleList()
    },
    handleSizeChange(val) {
      // 控制每页的条数
      this.pageParams.page = 1
      this.pageParams.pagesize = val
      this.loadRoleList()
    },
    // 删除功能
    del(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteRole(id)
        if (this.roleList.length === 1) {
          this.pageParams.page--
          if (this.roleList.length <= 0) { this.pageParams.page = 1 }
        }
        this.loadRoleList()
        this.$message.success(res.message)
      }).catch((error) => {
        console.log(error)
        this.$message.error('删除失败')
      })
    },

    // 点击添加
    hAdd() {
      this.showDialog = true
      this.isEdit = false
    },
    // 添加的请求
    async doAdd() {
      try {
        const res = await addRole(this.roleForm)
        console.log(res)
        this.$message.success(res.message)

        // // 将当前页码的值, 改为最后一页的值
        // this.pageParams.page = this.maxNum
        // if (this.isLastPageFulled) {
        //   this.pageParams.page++
        //   this.total++
        // }
        this.total++
        this.pageParams.page = Math.ceil(this.total / this.pageParams.pagesize)

        this.loadRoleList()
      } catch (error) {
        console.log(error)
        this.$message.error('添加失败')
      }
    },
    // 点击确定添加
    hSubmit() {
      // 兜底校验
      this.$refs.roleForm.validate(valid => {
        if (!valid) return this.$message.info('请检查输入')
        this.isEdit ? this.doEdit() : this.doAdd()
        this.showDialog = false
      })
    },
    // 点击编辑
    hEdit(row) {
      this.showDialog = true
      this.isEdit = true
      this.roleForm = { ...row }
    },
    // 实现编辑
    async doEdit() {
      try {
        const res = await updateRole(this.roleForm)
        console.log(res)
        this.$message.success(res.message)
        this.loadRoleList()
      } catch (error) {
        console.log(error)
        this.$message.error('编辑失败')
      }
    },
    // 关闭清空表单
    hClose() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    }
  }
}
</script>

<style>

</style>
