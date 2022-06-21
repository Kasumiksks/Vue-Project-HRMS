<template>
  <div>
    <el-form ref="deptForm" label-width="120px">
      <el-form-item label="部门名称">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in employeesList" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
        <el-button size="small" @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmployeeSList } from '@/api/employees' // 导入获取简单员工列表的函数
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments' // 导入: 添加的函数, 获取详细信息的函数
export default {
  props: { // props是异步的
    id: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      employeesList: [] // 员工列表
    }
  },
  created() {
    this.getEmployeeSInfo()
    this.loadDetails()
  },
  methods: {
    // 获取员工列表的函数
    async getEmployeeSInfo() {
      const res = await getEmployeeSList()
      // console.log(res)
      this.employeesList = res.data
    },

    // 添加的函数
    async doAdd() {
      const res = await addDepartments({ ...this.form, pid: this.id }) // 组装参数, 把获取到的id加到form表单中
      console.log(res)
      // 通知父组件：关闭弹层，再次更新数据
      if (res.code !== 10000) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$emit('success')
    },
    // 获取当前部门的详情
    async loadDetails() {
      if (this.isEdit) { // true, 编辑
        const res = await getDepartDetail(this.id)
        console.log(res)
        this.form = res.data // form是双向绑定, 所以直接赋值进行回填
      }
    },
    // 编辑的函数
    async doEdit() {
      try {
        const res = await updateDepartments({ id: this.id, ...this.form })
        console.log(res)
        this.$message.success('修改成功')
        this.$emit('success')
      } catch (error) {
        this.$message.error('修改失败')
        console.log(error)
      }
    },
    // 确定
    hSubmit() {
      // 待完成: 表单校验
      this.isEdit ? this.doEdit() : this.doAdd()
    },
    // 取消
    hCancel() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style>

</style>
