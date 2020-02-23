<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.published" placeholder="是否已发布" size="small" style="width:160px;" class="filter-item">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="调研表名称">
        <template slot-scope="{row}">
          <span>{{ row.formNameCn }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="English Name">
        <template slot-scope="{row}">
          <span>{{ row.formNameEn }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="描述">
        <template slot-scope="{row}">
          <span>{{ row.formDescriptionCn }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发布时间">
        <template slot-scope="{row}">
          <span>{{ row.datetime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button type="warning" size="small" style="margin-left:0;" @click="handlePrew(row)">预览</el-button>
          <router-link :to="'/survey/edit/'+row.id">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button type="danger" size="small" style="margin-left:0;" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <diyform-prew ref="diyformPrew" />
  </div>
</template>

<script>
import Survey from '@/api/survey'
import Pagination from '@/components/Pagination'
import DiyformPrew from '@/views/survey/components/DiyformPrew'

export default {
  name: 'Diyform',
  components: { Pagination, DiyformPrew },
  filters: {
    typeFilter(value) {
      let text
      switch (Number(value)) {
        case 1:
          text = '单行输入'
          break
        case 2:
          text = '多行输入'
          break
        case 3:
          text = '单项选择'
          break
        case 4:
          text = '多项选择'
          break
      }
      return text
    },
    statusFilter(value) {
      let text
      switch (Number(value)) {
        case 1:
          text = '是'
          break
        case 0:
          text = '否'
          break
      }
      return text
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: '',
        require: ''
      },
      statusList: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Survey.diyList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    deleteRow(row) {
      Survey.deleteQue({ id: row.id }).then(response => {
        let index
        this.list.forEach((item, ind) => {
          if (item.id === row.id) {
            index = ind
          }
        })
        this.list.splice(index, 1)
        this.$notify({
          title: '成功',
          message: '删除问题成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePrew(row) {
      this.$refs.diyformPrew.open(row)
    }
  }
}
</script>

<style lang="scss">

.new-prew-content {
  font-size: 16px;
  line-height: 1.2;
  margin: 0 20px;
  .prew-title {
    text-align: center;
    font-size: 20px;
    font-weight: 900;
    margin: 10px;
  }
  .half-box {
    display: inline-block;
    width: 48%;
    padding: 10px 30px;
  }
}
</style>
