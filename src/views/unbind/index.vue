<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.staffId" placeholder="Staff Id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getList">
        查询
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
      <el-table-column label="App Id" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Staff Id" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobileNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Open Id" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他" align="center">
        <template slot-scope="{row}">
          <span>{{ row.other }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, unbind } from '@/api/unbind'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Unbind',
  components: { },
  directives: { waves },
  filters: { },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        appId: this.$store.getters.appId
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.items
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久解绑该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unbind(row.appId, row.staffId).then(res => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
