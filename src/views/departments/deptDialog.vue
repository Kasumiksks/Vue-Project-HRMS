<template>
  <div>
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in employeesList" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
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
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 验证部门编码
    const checkCode = (rule, value, callback) => {
      let newArr = this.originList.map(item => item.code)
      if (this.isEdit) { // 当是编辑时, 把自己的code筛选出去
        newArr = this.originList.filter(item => item.id !== this.id).map(item => item.code)
      }
      newArr.includes(value) ? callback(new Error('部门编码已存在!')) : callback()
    }
    // 验证部门名称
    const checkName = (rule, value, callback) => {
      let newArr = this.originList.filter(item => item.pid === this.id).map(item => item.name)

      // 通过当前的id去找父级, 找到父级之后, 再找所有的子级,和他的兄弟 , 并减去自己
      if (this.isEdit) {
        const pid = this.originList.find(item => item.id === this.id).pid // 获取当前的pid(即父级的id)
        newArr = this.originList
          .filter(item => item.pid === pid) // 通过父级的id找到所有的兄弟 , 返回一个包含所有兄弟的数组
          .filter(item => item.id !== this.id) // 在包含所有兄弟的数组中, 筛选出除自己外的所有项目
          .map(item => item.name) // 获取只有包含name的数组
      }
      newArr.includes(value) ? callback(new Error('此部门已存在!')) : callback()
    }

    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]

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
      // 添加完成, 清空表单
      this.$refs.deptForm.resetFields()
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
      // 表单校验
      this.$refs.deptForm.validate((valid) => {
        if (!valid) return this.$message.info('请检查必填项!')
        this.isEdit ? this.doEdit() : this.doAdd()
      })
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
