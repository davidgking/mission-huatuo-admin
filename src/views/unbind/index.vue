<template>
  <div class="app-container">
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
      <el-table-column label="开启通知" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="短信通知" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.smsEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="邮件通知" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.mailEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="微信推送" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.wechatPushEnable"
            active-color="#13ce66"
            active-value="Y"
            inactive-value="N"
            @change="switchStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, deleteNotify, saveNotify } from '@/api/notifySwitch'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'NotifySwitch',
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
        limit: 20
      },
      temp: {
        appId: 'wx9812117be87d24d2',
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
      rules: {
        appId: [{ required: true, message: '请输入Staff Id', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.items
        this.listLoading = false
      })
    },
    switchStatus(row) {
      saveNotify(row).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNotify(row.appId).then(res => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    resetTemp() {
      this.temp = {
        staffId: '',
        status: '1',
        enable: 'N',
        smsEnable: 'N',
        mailEnable: 'N',
        wechatPushEnable: 'N',
        appId: 'wx9812117be87d24d2',
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
    }
  }
}
</script>
