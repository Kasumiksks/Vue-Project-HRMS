<template>
  <div class="employees-container">
    <div class="app-container">
      <Page-tools>
        <template #left>
          <span>总记录数: 16 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </Page-tools>

      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop:'timeOfEntry',order:'ascending'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column sortable label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column sortable label="入职时间" prop="timeOfEntry" />
          <!-- <el-table-column label="账户状态" /> -->
          <el-table-column label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeesList } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      pageParams: {
        page: 1, // 页面
        size: 5 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0
    }
  },
  created() {
    this.loadEmployeesList()
  },
  methods: {
    // 获取员工列表
    async loadEmployeesList() {
      try {
        const res = await getEmployeesList(this.pageParams)
        this.employeesList = res.data.rows
        this.total = res.data.total
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>
