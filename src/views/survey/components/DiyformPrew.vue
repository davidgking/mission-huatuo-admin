<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>预览</span>
      </div>
      <div class="new-prew-content">
        <div class="prew-title">{{ prewData.formName }}</div>
        <div>
          <div v-for="item in questionList" :key="item.id" class="question-select-item">
            <span>{{ item.title }}</span>
            <div>
              <el-input v-if="item.type === 1" class="item-content" />
              <el-input v-if="item.type === 2" class="item-content" type="textarea" :rows="4" />
              <el-radio-group v-if="item.type === 3" class="item-content">
                <el-radio v-for="answer in item.answer" :key="answer.value" :label="answer.value">{{ answer.name }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="item.type === 4" v-model="checkList" class="item-content">
                <el-checkbox v-for="answer in item.answer" :key="answer.value" :label="answer.name" />
              </el-checkbox-group>
            </div>
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
      prewData: {},
      questionList: [],
      checkList: []
    }
  },
  methods: {
    open(diyformData) {
      // test logic
      this.prewData = Object.assign({}, diyformData)
      this.getQuestionList()
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.questionList = []
    },
    getQuestionList() {
      Survey.queList(this.listQuery).then(response => {
        const questionList = response.data.items
        const questions = this.prewData.questionData
        const list = []
        if (questions.length) {
          questions.forEach((item) => {
            const f = questionList.find(f => f.id === Number(item))
            list.push(f)
          })
        }
        this.questionList = list
      })
    }
  }
}
</script>

<style lang="scss">
  .question-select-item {
    line-height: 1.2;
    margin: 20px 0 0;
  }
  .item-content {
    margin-top: 5px;
  }
</style>

