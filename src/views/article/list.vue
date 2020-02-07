<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="关注度">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" min-width="120">
        <template slot-scope="scope">
          <router-link v-if="scope.row.status === 'draft'" :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button v-if="scope.row.status === 'draft'" type="danger" size="small" @click="deleteRow(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status !== 'draft'" type="info" size="small" @click="updateState(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Articles from '@/api/articles'
import Pagination from '@/components/Pagination'

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      let res = '已发布'
      if (status === 'draft') {
        res = '草稿'
      }
      return res
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Articles.getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    deleteRow(row) {
      Articles.deleteArticle({ id: row.id }).then(response => {
        let index
        this.list.forEach((item, ind) => {
          if (item.id === row.id) {
            index = ind
          }
        })
        this.list.splice(index, 1)
        this.$notify({
          title: '成功',
          message: '删除文章成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateState(row) {
      Articles.updateState({ id: row.id }).then(response => {
        row.status = 'draft'
        this.$notify({
          title: '成功',
          message: '文章已成功下架',
          type: 'success',
          duration: 2000
        })
      })
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
