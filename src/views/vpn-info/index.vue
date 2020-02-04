<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.staffId" placeholder="Staff Id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.location" placeholder="Location" clearable style="width: 130px" class="filter-item">
        <el-option label="广州" value="1" />
        <el-option label="西安" value="2" />
      </el-select>
      <el-select v-model="listQuery.internetISP" placeholder="InternetISP" clearable style="width: 210px" class="filter-item">
        <el-option label="中国电信 China Telecom" value="1" />
        <el-option label="中国移动 China Mobile" value="2" />
        <el-option label="中国联通 China Unicom" value="3" />
        <el-option label="不知道 Don't Know" value="4" />
        <el-option label="其它 Others" value="5" />
      </el-select>
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
      <el-table-column label="OpenId" width="120px" prop="openId" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Staff Id" width="120px" align="center" fixed>
        <template slot-scope="{row}">
          <span>{{ row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Location" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="InternetISP" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.internetISP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="LinkType" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.linkType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BandWidth" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bandWidth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VpnType" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vpnType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HadRebootAdsl" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hadRebootAdsl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Symptom" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.symptom }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OutlookSlow" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.outlookSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="JabberSlow" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jabberSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SametimeSlow" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sametimeSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VCSlow" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vcSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HasOthAppSlow" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hasOthAppSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OthSlowApp" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.othSlowApp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SomeAppCantAccess" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hasSomeAppCantAccess }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CantAccessApp" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cantAccessApp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ReporterStaffId" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reporterStaffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SharedFolderSlow" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sharepointSharedFolderSlow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HavePc" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.havePc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HaveToken" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.haveToken }}</span>
        </template>
      </el-table-column>
      <el-table-column label="other" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.other }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VpnLocal" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vpnLocal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VpnState" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vpnState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="LstUpatetime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastUpatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/vpnInfo'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'VpnInfo',
  components: { Pagination },
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
        location: undefined,
        internetISP: undefined
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
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>
