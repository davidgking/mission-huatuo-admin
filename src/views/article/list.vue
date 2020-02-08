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
          <span v-if="!scope.row.date">暂无</span>
          <span v-else>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="关注度">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.priority" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.enable | statusFilter">
            {{ row.enable | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.enable === 'N'" type="success" size="mini" style="margin-left:0;" @click="updateState(scope.row, 'Y')">发布</el-button>
          <router-link v-if="scope.row.enable === 'N'" :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button v-if="scope.row.enable === 'N'" type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
          <el-button v-if="scope.row.enable !== 'N'" type="warning" size="mini" @click="openPrew(scope.row)">预览</el-button>
          <el-button v-if="scope.row.enable !== 'N'" type="info" size="mini" style="margin-left:0;" @click="updateState(scope.row, 'N')">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog ref="timeDlg" :visible.sync="PrewVisible" :close-on-click-modal="false" @close="closePrew">
      <div slot="title">
        <span>预览</span>
      </div>
      <div class="new-prew-content">
        <div class="prew-title">{{ prewData.title }}</div>
        <div>
          <div class="half-box">来源: {{ prewData.source }}</div>
          <div class="half-box">发布时间：{{ prewData.date }}</div>
        </div>
        <div id="prewContent" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import News from '@/api/news'
import Pagination from '@/components/Pagination'

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Y: 'success',
        N: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      let res = '已发布'
      if (status === 'N') {
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
      },
      prewData: {},
      PrewVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      News.fecthList(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total
        this.listLoading = false
      })
    },
    deleteRow(row) {
      News.deleteNews(row.id).then(response => {
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
    updateState(row, val) {
      const data = Object.assign({}, row)
      data.enable = val
      News.updateNews(data).then(response => {
        row.enable = val
        const msg = val === 'N' ? '文章已成功下架' : '文章已成功发布'
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
      })
    },
    openPrew(data) {
      this.prewData = data
      this.PrewVisible = true
      this.$nextTick(() => {
        const prewContent = document.querySelector('#prewContent')
        prewContent.innerHTML = data.content
      })
    },
    closePrew() {
      this.PrewVisible = false
    }
  }
}
</script>

<style lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
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
