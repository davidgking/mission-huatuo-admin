<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>预览</span>
      </div>
      <div class="new-prew-content">
        <div class="prew-title">{{ prewData.formName }}</div>
        <div>
          <div v-for="item in selectList" :key="item.value" class="question-select-item">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import Survey from '@/api/survey'
export default {
  name: 'DiyformPrew',
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      questionList: [],
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
      }]
    }
  },
  methods: {
    open(diyformData, statusList) {
      this.getQuestionList()
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.resetForm()
    },
    getQuestionList() {
      Survey.queList(this.listQuery).then(response => {
        this.questionList = response.data.items
      })
    }
  }
}
</script>

<style lang="scss">

</style>

