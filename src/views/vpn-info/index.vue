<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.staffId" placeholder="Staff Id" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.location" placeholder="所在城市" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.internetISP" placeholder="宽带服务" clearable style="width: 210px" class="filter-item">
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
      <el-table-column label="Staff Id" width="120px" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在城市" width="110px" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽带服务" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上网线路" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.linkType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="带宽" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bandWidth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VPN类型" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vpnType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否重启ADSL" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hadRebootADSL }}</span>
        </template>
      </el-table-column>
      <el-table-column label="症状" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.symptom }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Outlook是否反应慢" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.outlookSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Jabber是否反应慢" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jabberSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sametime是否反应慢" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sametimeSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VC是否反应慢" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.videoConferenceSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公盘是否反应慢" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sharepointSharedFolderSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其它程序是否反应慢" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hasOtherApplicationsSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反应慢的程序" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.otherSlowApplications }}</span>
        </template>
      </el-table-column>
      <el-table-column label="某些程序能否访问" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hasSomeApplicationsCannotAccess }}</span>
        </template>
      </el-table-column>
      <el-table-column label="不能访问的程序" width="150px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.cannotAccessApplications }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ReporterStaffId" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reporterStaffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他问题" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.other }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次更新时间" width="220px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.lastUpdateDatetime }}</span>
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
        appId: this.$store.getters.appId,
        staffId: undefined,
        location: undefined,
        internetISP: undefined,
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
        const tHeader = ['Staff Id', '所在城市', '宽带服务', '上网线路', '带宽', 'VPN类型', '是否重启ADSL',
          '症状', 'Outlook是否反应慢', 'Jabber是否反应慢', 'Sametime是否反应慢', 'VC是否反应慢',
          '某些程序是否反应慢', '反应慢的程序', '某些程序能否访问',
          '不能访问的程序', 'RepoterStaffId', '公盘是否反应慢', '其他问题', '上次更新时间']
        const filterVal = ['staffId', 'location', 'isp', 'linkType', 'bandWidth', 'vpnType', 'hadRebootADSL',
          'symptom', 'outlookSlow', 'jabberSlow', 'sametimeSlow', 'videoConferenceSlow', 'hasOtherApplicationsSlow', 'otherSlowApplications', 'hasSomeApplicationsCannotAccess',
          'cannotAccessApplications', 'reporterStaffId', 'sharepointSharedFolderSlow', 'other', 'lastUpdateDatetime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'VPN-Info'
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
