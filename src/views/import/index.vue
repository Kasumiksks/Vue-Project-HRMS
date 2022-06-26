<template>
  <div class="app-container">
    <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils' // 导入格式化时间的函数
import { importEmployee } from '@/api/employees'
export default {

  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      console.log(results, header)
      // 1. 读取Excel表格转化为行和列的数据
      // 2. 将数据安装接口文件进行格式转化, 将中文的键转化英文
      const data = this.transExcel(results)
      // 3/ 发送请求,实现数据的批量导入
      this.doAdd(data)
    },

    // 批量导入员工
    async doAdd(data) {
      try {
        const res = await importEmployee(data)
        this.$message.success(res.message)
        // 退回到原先的页面
        this.$router.back()
      } catch (error) {
        console.log(error)
        this.$message.error('批量导入员工失败')
      }
    },
    // 格式转换
    transExcel(data) {
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      // 1.使用map遍历数组,取出对象进行操作, 键是中文
      return data.map(zhObj => {
        const zhKeys = Object.keys(zhObj)
        const enObj = {}

        zhKeys.forEach(zhKey => {
          if (mapInfo[zhKey] === 'timeOfEntry' || mapInfo[zhKey] === 'correctionTime') {
            enObj[mapInfo[zhKey]] = formatExcelDate(zhObj[zhKey])
          } else {
            enObj[mapInfo[zhKey]] = zhObj[zhKey]
          }
        })
        return enObj
      })
    }
  }
}
</script>
