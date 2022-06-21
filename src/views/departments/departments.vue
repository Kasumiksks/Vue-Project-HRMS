<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="bumen" /><span>莱莎的炼金工坊</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="hAdd('')">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 放置一个el-tree组件 -->
        <!-- 设置default-expand-all属性为true, 默认展开所有子节点 -->
        <el-tree
          :data="list"
          :default-expand-all="true"
        >
          <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
          <!--
      #default === slot-scope
      什么时候用到作用域插槽？父组件中如果想使用子组件中的数据进行自定义内容的渲染 (类似于table 单元格数据渲染)
    -->
          <template #default="{ data }">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; width: 100%;"
            >
              <el-col :span="20">
                <svg-icon icon-class="fenzhi" />&nbsp;
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hAdd(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hEdit(data.id)">编辑部门</el-dropdown-item>
                        <el-dropdown-item v-if="data.children.length===0" @click.native="hDel(data.id)">删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>

      <!-- 实现新增子部门或编辑部门 -->
      <!-- 关闭点击遮罩和按esc关闭对话框的功能 -->
      <el-dialog
        :title=" isEdit ? '编辑部门信息' : '添加部门信息'"
        :visible.sync="bool"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <addor-edit :id="currentID" ref="deptDialog" :is-edit="isEdit" :origin-list="originList" @success="hSuccess" @closeDialog="hClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDepartments, delDepartment } from '@/api/departments'
import { tranListToTreeList } from '@/utils'
import AddorEdit from './deptDialog.vue'
export default {
  components: {
    AddorEdit
  },
  data() {
    return {
      // 依赖一份树形数据
      // 依赖一份树形数据
      list: [],
      bool: false,
      currentID: null,
      isEdit: false, // false表示添加部门, true表示编辑部门
      originList: []
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    // / 获取部门架构的函数
    async loadDepartments() {
      try {
        const res = await getDepartments()
        // shift() 删除数组中的第一个数据, 返回值是删除的数据 , 取出数组中的第一个数据
        // const company = res.data.depts.shift()
        // console.log(company, 'company')
        res.data.depts.shift()

        // this.originList = res.data.depts.map(item => {
        //   const { id, pid, name, code } = item
        //   return { id: id, pid: pid, name: name, code: code }
        // })  结构简写:
        this.originList = res.data.depts.map(({ id, pid, name, code }) => ({ id, pid, name, code }))

        // 将平铺的数据转化为树形结构的数据
        this.list = tranListToTreeList(res.data.depts)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击添加
    hAdd(id) {
      this.bool = true
      this.currentID = id
      this.isEdit = false
    },
    // 接受子组件发送过来的添加成功信息
    hSuccess() {
      // 关闭弹窗
      this.bool = false
      // 重新请求数据
      this.loadDepartments()
    },
    // 点击编辑
    hEdit(id) {
      this.bool = true
      this.currentID = id
      this.isEdit = true

      // 每次打开弹层时，找到子组件，要求它去发请求获取详情
      // 获取子组件的引用
      this.$nextTick(() => {
        // console.log('获取子组件的引用', this.$refs.deptDialog)
        // console.log('当前的curId', id)
        // console.log('获取到子组件中的id--从父传入的', this.$refs.deptDialog.id)
        // 调用子组件的方法
        this.$refs.deptDialog.loadDetails()
      })
    },
    // 点击删除
    hDel(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delDepartment(id)
        this.$message.success(res.message)
        // 重新渲染页面
        this.loadDepartments()
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    // 点击关闭对话框
    hClose() {
      this.bool = false
    }
  }
}
</script>
