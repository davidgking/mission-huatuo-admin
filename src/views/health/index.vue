<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.staffId" placeholder="Staff Id" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cityName" placeholder="所在城市" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.healthStatus" placeholder="健康状态" clearable style="width: 210px" class="filter-item">
        <el-option label="中国电信 China Telecom" value="1" />
        <el-option label="中国移动 China Mobile" value="2" />
        <el-option label="中国联通 China Unicom" value="3" />
        <el-option label="不知道 Don't Know" value="4" />
        <el-option label="其它 Others" value="5" />
      </el-select>
      <el-date-picker v-model="listQuery.lastUpatetime" type="date" value-format="yyyy-MM-dd" placeholder="上次更新时间" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" size="small" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="员工编号" width="120px" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文姓名" width="120px" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="紧急联系电话" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobileNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为其他同事报告" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.isReportOther }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事办公城市" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事部门" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事14天内去过的办公行所" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workPlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事目前健康状态" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.healthStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事是否已经隔离" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isIsolation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被报告同事隔离情况" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isoType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隔离起始日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隔离结束日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报告时间" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.reportDate }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import { fetchList } from '@/api/vpnInfo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'VpnInfo',
  components: { },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        staffId: undefined,
        cityName: undefined,
        healthStatus: undefined,
        lastUpatetime: undefined
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.items
        this.total = response.total
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['员工编号', '中文姓名', '紧急联系电话', '是否为其他同事报告', '被报告同事办公城市', '被报告同事部门', '被报告同事14天内去过的办公行所',
          '被报告同事目前健康状态', '被报告同事是否已经隔离', '被报告同事隔离情况', '隔离起始日期', '隔离结束日期',
          '报告时间']
        const filterVal = ['staffId', 'staffName', 'mobileNum', 'isReportOther', 'cityName', 'department', 'workPlace',
          'healthStatus', 'isIsolation', 'isoType', 'startDate', 'endDate', 'reportDate']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Health-Report'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
