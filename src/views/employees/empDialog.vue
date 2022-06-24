<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="hFocus" />
      <div v-if="showTree" class="tree-box">
        <el-tree :data="departmentList" :props="{ label: 'name' }" @node-click="hNodeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>

    <el-form-item>
      <el-button @click="hCancel">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </el-form-item>

  </el-form>

</template>

<script>
import EmployeesEnum from '@/constant/employees'
import { getDepartments } from '@/api/departments' // 导入渲染部门数据的方法
import { tranListToTreeList } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  data() {
    return {
      hireType: EmployeesEnum.hireType, // 聘用形式
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      departmentList: [], // 树形数组
      showTree: false
    }
  },

  methods: {
    // 获取部门数据
    async loadDepartments() {
      try {
        const res = await getDepartments()
        res.data.depts.shift()
        // 将平铺的数据转化为树形结构的数据
        this.departmentList = tranListToTreeList(res.data.depts)
        console.log(this.departmentList)
      } catch (error) {
        console.log(error)
      }
    },
    // 选择部门获得焦点
    hFocus() {
      this.showTree = true
      this.loadDepartments()
    },
    // 点击树形数据,赋值给输入框
    // 树形组件自带的node-click()方法: 参数1:data 属性的数组中该节点所对应的对象; 参数2:节点对应的 Node; 参数3:节点组件本身
    hNodeClick(data, node) {
      // console.log(data)
      // console.log(node)
      // 有子级的父节点不选中
      if (data.children.length) return
      // 将这个数据对象的name属性的值给到输入框
      this.formData.departmentName = data.name
      this.showTree = false
    },
    // 添加的函数
    async doAdd() {
      try {
        const res = await addEmployee(this.formData)
        this.$message.success(res.message)
        // 通知父组件添加成功
        this.$emit('addSuccess')
      } catch (error) {
        console.log(error)
        this.$message.error('添加员工失败')
      }
    },
    hCancel() {
      this.$emit('close')
    },
    hSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return this.$message.error('请检查输入内容!')
        this.doAdd()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box{
  margin-top: 5px;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
</style>
