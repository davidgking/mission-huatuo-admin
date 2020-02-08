<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.staffId" placeholder="Staff Id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" type="success" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加
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
      @sort-change="sortChange"
    >
      <el-table-column label="Staff Id" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.notify.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.staffList.mobileNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="{row}">
          <span>{{ row.staffList.emailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启通知" align="center" width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.notify.enable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="短信通知" align="center" width="120px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.notify.smsEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="邮件通知" align="center" width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.notify.mailEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="微信推送" align="center" width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.notify.wechatPushEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Staff Id" prop="staffId">
          <el-input v-model="temp.staffId" @blur="getStaffInfo()" />
        </el-form-item>
        <el-form-item label="开启通知" prop="enable">
          <el-switch
            v-model="temp.enable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobileNum">
          <el-input v-model="temp.mobileNum" />
        </el-form-item>
        <el-form-item label="短信通知" prop="smsEnable">
          <el-switch
            v-model="temp.smsEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddress">
          <el-input v-model="temp.emailAddress" />
        </el-form-item>
        <el-form-item label="邮箱通知" prop="mailEnable">
          <el-switch
            v-model="temp.mailEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
        <el-form-item label="微信推送通知" prop="wechatPushEnable">
          <el-switch
            v-model="temp.wechatPushEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, saveNotify, deleteNotify, getStaffInfo } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
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
        staffId: undefined,
        name: undefined,
        team: undefined,
        appId: 'wx9812117be87d24d2',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        staffId: undefined,
        name: '',
        team: '',
        mobileNum: '',
        emailAddress: '',
        status: '1',
        appId: this.$store.getters.appId,
        enable: 'Y',
        smsEnable: 'Y',
        mailEnable: 'Y',
        wechatPushEnable: 'Y'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        staffId: [{ required: true, message: '请输入Staff Id', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入APP Id', trigger: 'blur' }],
        mobileNum: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        emailAddress: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
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
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getStaffInfo() {
      const staffId = this.temp.staffId
      if (staffId !== '') {
        getStaffInfo(staffId).then(res => {
          if (res.message) {
            this.$message({
              message: res.message,
              type: 'warning'
            })
            this.temp.mobileNum = ''
            this.temp.emailAddress = ''
          } else {
            this.temp.mobileNum = res.mobileNum
            this.temp.emailAddress = res.emailAddress
          }
        })
      }
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        staffId: '',
        status: '1',
        enable: 'N',
        smsEnable: 'N',
        mailEnable: 'N',
        wechatPushEnable: 'N',
        appId: this.$store.getters.appId,
        emailAddress: '',
        mobileNum: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveNotify(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = {
        staffId: row.notify.staffId,
        status: row.notify.status,
        enable: row.notify.enable,
        smsEnable: row.notify.smsEnable,
        mailEnable: row.notify.mailEnable,
        wechatPushEnable: row.notify.wechatPushEnable,
        appId: row.notify.appId,
        emailAddress: row.staffList.emailAddress,
        mobileNum: row.staffList.mobileNum
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    switchStatus(row) {
      this.temp = {
        staffId: row.notify.staffId,
        status: row.notify.status,
        enable: row.notify.enable,
        smsEnable: row.notify.smsEnable,
        mailEnable: row.notify.mailEnable,
        wechatPushEnable: row.notify.wechatPushEnable,
        appId: row.notify.appId,
        emailAddress: row.staffList.emailAddress,
        mobileNum: row.staffList.mobileNum
      }
      saveNotify(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          saveNotify(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteNotify(row.notify.staffId).then(res => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['staff Id', '手机号码', '邮箱']
        const filterVal = ['staffId', 'mobileNum', 'emailAddress']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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
