<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>预览</span>
      </div>
      <div class="new-prew-content">
        <div class="prew-title">{{ prewData.formNameCn + ' ' + prewData.formNameEn }}</div>
        <div>
          <div v-for="item in questionList" :key="item.id" class="question-select-item">
            <span>{{ item.questionTitleCn + ' ' + item.questionTitleEn }}</span>
            <div>
              <el-input v-if="item.questionType === 3" class="item-content" />
              <el-input v-if="item.questionType === 4" class="item-content" type="textarea" :rows="4" />
              <el-radio-group v-if="item.questionType === 1" class="item-content">
                <el-radio v-for="(answer,index) in item.questionItems" :key="index" :label="index">{{ answer.itemTextCn + ' ' + answer.itemTextEn }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="item.questionType === 2" v-model="checkList" class="item-content">
                <el-checkbox v-for="(answer,index) in item.questionItems" :key="index" :label="answer.itemTextCn + ' ' + answer.itemTextEn" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

// import Survey from '@/api/survey'
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
      this.prewData.questions = [{
        questionNo: 101,
        questionType: 1,
        questionTitleCn: '你两周内有到过湖北吗',
        questionTitleEn: 'Have yuo went to Hubei between 2 weeks',
        questionItems: [{
          itemTextCn: '是',
          itemTextEn: 'Yes'
        }, {
          itemTextCn: '否',
          itemTextEn: 'No'
        }]
      }, {
        questionNo: 106,
        questionType: 4,
        questionTitleCn: '请对我们的服务提出建议',
        questionTitleEn: 'Some suggestions',
        questionItems: ''
      }]
      this.getQuestionList()
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
      this.questionList = []
    },
    getQuestionList() {
      const questions = this.prewData.questions
      const list = []
      if (questions.length) {
        questions.forEach((item) => {
          list.push(item)
        })
      }
      this.questionList = list
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

