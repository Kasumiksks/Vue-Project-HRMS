<template>
  <div class="employees-container">
    <div class="app-container">
      <Page-tools>
        <template #left>
          <span>总记录数: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small" @click="$router.push('import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="hExcelExport">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </Page-tools>

      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop:'timeOfEntry',order:'ascending'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column sortable label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template #default="{row}">
              {{ formOfEmploymentFormat(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column sortable label="入职时间" prop="timeOfEntry" />
          <el-table-column label="账户状态" />
          <el-table-column label="操作" width="280">
            <template #default="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail?id=${row.id}`)">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="pageParams.page"
            :page-sizes="[2, 3, 5, 10]"
            :page-size="pageParams.size"
            layout="total,sizes,prev,pager,next,jumper"
            :total="total"
            @current-change="hCurrentChange"
            @size-change="handleSizeChange"
          />
        </el-row>
      </el-card>

      <el-dialog title="新增员工" :visible.sync="showDialog">
        <AddorEdit v-if="showDialog" @close="showDialog=false" @addSuccess="hAddSuccess" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AddorEdit from './empDialog' // 导入对话框子组件
import { getEmployeesList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/constant/employees'
// const hireType = {}
// EmployeesEnum.hireType.forEach(item => hireType[item.id] === item.value)
const hireType = EmployeesEnum.hireType.reduce((acc, item) => {
  acc[item.id] = item.value
  return acc
}, {})
export default {
  name: 'Employees',
  components: {
    AddorEdit
  },
  data() {
    return {
      pageParams: {
        page: 1, // 页面
        size: 5 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0,
      showDialog: false // 对话框显示/隐藏
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
    },
    // 格式化聘用形式
    formOfEmploymentFormat(id) {
      // id:1,正式; 2:不正式
      // const item = EmployeesEnum.hireType.find(item => item.id === id)
      // if (item) {
      //   return item.value
      // } else {
      //   return '未知'
      // }
      return hireType[id]
    },
    // 点击删除
    hDel(id) {
      this.$confirm('删除操作不可逆,是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(() => {
        this.doDel(id)
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除员工
    async doDel(id) {
      try {
        const res = await delEmployee(id)
        // 如果删除第最后一页（例如4）的最一条数据之后，页面会显示不正常
        if (this.employeesList.length === 1) {
          this.pageParams.page--
          if (this.pageParams.page <= 0) {
            this.pageParams.page = 1
          }
        }
        this.$message.success(res.message)
        this.loadEmployeesList()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加成功刷新页面
    hAddSuccess() {
      // 添加成功，进入最后一页看数据
      this.total++
      // 最后一页
      this.pageParams.page = Math.ceil(this.total / this.pageParams.size)
      this.showDialog = false
      this.loadEmployeesList()
    },
    hCurrentChange(val) {
      // 控制页码数值的变化
      this.pageParams.page = val
      this.loadEmployeesList()
    },
    handleSizeChange(val) {
      // 控制每页的条数
      this.pageParams.page = 1
      this.pageParams.size = val
      this.loadEmployeesList()
    },
    // 导出Excel文件
    async hExcelExport() {
      // 1. 发送请求, 拿到真实的数据
      try {
        const res = await getEmployeesList(this.pageParams)
        const list = res.data.rows
        // 2. 调用函数格式化拿到的数据
        const { header, data } = this.formatData(list)
        // console.log(header, 'header')
        // console.log(data, 'data')

        // 3. 将格式化之后的数据转化为Excel表格
        import('@/vendor/Export2Excel').then(async excel => {
          excel.export_json_to_excel({
            header: header, // 表头 必填
            data: data, // 具体数据 必填
            filename: '员工管理表', // 文件名称
            autoWidth: true, // 宽度是否自适应
            bookType: 'xlsx' // 生成的文件类型
          })
        })
      } catch (error) {
        console.log(error)
      }
    },

    // 导出数据的格式化函数
    formatData(list) {
      const mapInfo = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      // 首先成header
      // 存储表头
      let header = []
      // 存储表的数据
      let data = []
      // 找到一个元素
      const one = list[0]
      if (!one) {
        return { header, data }
      }
      console.log(Object.keys(one))
      // 转换表头格式
      header = Object.keys(one).map(enKey => {
        return mapInfo[enKey]
      })
      // 转换表单内容格式
      data = list.map(obj => {
        obj['formOfEmployment'] = hireType[obj['formOfEmployment']] || '未知'
        return Object.values(obj)
      })
      return { header, data }
    }
  }

}
</script>
