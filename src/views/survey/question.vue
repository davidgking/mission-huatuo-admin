<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" placeholder="类型" size="small" style="width:160px;" class="filter-item">
        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.require" placeholder="是否必答" size="small" style="width:160px;" class="filter-item">
        <el-option v-for="item in requireList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" size="small" style="margin-left: 10px;" type="success" icon="el-icon-circle-plus-outline" @click="handleAdd">
        添加
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="{row}">
          <span>{{ row.type | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="问题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="必答">
        <template slot-scope="{row}">
          <span>{{ row.require | requireFilter }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column min-width="100px" align="center" label="答案">
        <template slot-scope="{row}">
          <span>{{ row.answer }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <question-form ref="questionForm" @saveForm="handleSave" />
  </div>
</template>

<script>
import Survey from '@/api/survey'
import Pagination from '@/components/Pagination'
import QuestionForm from '@/views/survey/components/QuestionForm'

export default {
  name: 'Question',
  components: { Pagination, QuestionForm },
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
    requireFilter(value) {
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
      typeList: [{
        label: '单行输入',
        value: 1
      }, {
        label: '多行输入',
        value: 2
      }, {
        label: '单项选择',
        value: 3
      }, {
        label: '多项选择',
        value: 4
      }],
      requireList: [{
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
      Survey.queList(this.listQuery).then(response => {
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
    handleSave() {
      console.log(1)
    },
    handleAdd() {
      this.$refs.questionForm.open(1, '', this.typeList, this.requireList)
    },
    handleEdit(row) {
      this.$refs.questionForm.open(0, row, this.typeList, this.requireList)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
