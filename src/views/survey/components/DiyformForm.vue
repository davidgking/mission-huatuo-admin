<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>{{ title }}</span>
      </div>
      <div class="form-content">
        <el-form ref="diyformForm" :model="diyformData" status-icon :rules="rules" label-width="120px" label-position="right" class="demo-ruleForm" size="small">
          <el-form-item label="调研表名称" prop="formName">
            <el-input v-model="diyformData.formName" placeholder="请填写调研表名称" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="diyformData.remark" placeholder="请填写描述" />
          </el-form-item>
          <el-form-item label="发布状态" prop="published">
            <el-select v-model="diyformData.published" size="small" placeholder="请选择" style="width:160px;">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="添加问题" prop="questionData">
            <div class="question-select-box">
              <el-select v-model="queSelected" size="small" placeholder="问题" style="width:400px;">
                <el-option v-for="que in questionList" :key="que.id" :label="que.title" :value="que.id">
                  <span>{{ que.type | typeFilter }}</span>
                  <span> - </span>
                  <span>{{ que.title }}</span>
                </el-option>
              </el-select>
              <div class="question-select-add">
                <el-button size="mini" type="primary" @click="addQuestionItem">添加</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="" prop="questions">
            <div v-if="selectList.length">调研问题：</div>
            <div v-for="(item,index) in selectList" :key="item.value" class="question-select-item">
              <el-button icon="el-icon-delete" size="mini" type="danger" plain @click="removeQuestionItem(index)" />
              <span>{{ '问题' + (index + 1) }}</span>
              <el-tag :type="item.type | tagFilter">{{ item.type | typeFilter }}</el-tag>
              <span>{{ item.title }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="sure()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import Survey from '@/api/survey'
export default {
  name: 'DiyformForm',
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
    tagFilter(value) {
      let text
      switch (Number(value)) {
        case 1:
          text = 'primary'
          break
        case 2:
          text = 'warning'
          break
        case 3:
          text = 'success'
          break
        case 4:
          text = 'danger'
          break
      }
      return text
    }
  },
  data() {
    return {
      title: '调研表添加',
      dialogVisible: false,
      formType: 1,
      diyformData: {
        formName: '',
        published: '',
        questionData: '',
        remark: ''
      },
      queSelected: '',
      questionList: [],
      statusList: [],
      rules: {
        formName: [
          { required: true, trigger: 'blur', message: '必须调研表名称' }
        ],
        remark: [
          { required: true, trigger: 'blur', message: '必须填写描述' }
        ],
        published: [
          { required: true, trigger: 'blur', message: '必须选择发布状态' }
        ],
        questionData: [
          { required: true, trigger: 'blur', message: '至少添加1条问题' }
        ]
      },
      selectList: [],
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
  watch: {
    formType(val) {
      if (val) {
        this.title = '调研表添加'
      } else {
        this.title = '调研表修改'
      }
    }
  },
  methods: {
    open(formType, diyformData, statusList) {
      this.formType = formType
      if (diyformData) {
        this.diyformData = Object.assign({ questionData: '' }, diyformData)
      }
      this.getQuestionList()
      this.dialogVisible = true
      this.statusList = statusList
    },
    cancel() {
      this.dialogVisible = false
      this.resetForm()
    },
    getQuestionList() {
      Survey.queList(this.listQuery).then(response => {
        this.questionList = response.data.items
        // test logic
        if (!this.formType) {
          const questionList = this.questionList
          this.selectList.push(questionList[3])
          this.selectList.push(questionList[2])
        }
      })
    },
    resetForm() {
      this.$refs.diyformForm.clearValidate()
      this.diyformData = {
        formName: '',
        published: '',
        questionData: '',
        remark: ''
      }
      this.selectList = []
    },
    sure() {
      this.checkQuestionData()
      if (this.formType) {
        this.addData()
      } else {
        this.editData()
      }
    },
    addData() {
      this.$refs.diyformForm.validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.diyformData)
          Survey.createDiyform(param).then(response => {
            if (response.code === 20000) {
              this.$notify({
                title: '成功',
                message: '添加调研表成功',
                type: 'success',
                duration: 2000
              })
              this.cancel()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          this.$message.error('表单验证失败')
          return false
        }
      })
    },
    editData() {
      this.$refs.diyformForm.validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.diyformData)
          Survey.updateDiyform(param).then(response => {
            if (response.code === 20000) {
              this.$notify({
                title: '成功',
                message: '修改调研表成功',
                type: 'success',
                duration: 2000
              })
              this.cancel()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          this.$message.error('表单验证失败')
          return false
        }
      })
    },
    addQuestionItem() {
      const question = this.questionList.find(f => this.queSelected === f.id)
      if (question) {
        this.selectList.push(question)
        this.queSelected = ''
      }
    },
    removeQuestionItem(index) {
      this.selectList.splice(index, 1)
      if (!this.selectList.length) {
        this.diyformData.questionData = ''
      }
    },
    changeType(val) {
      if (val === 3 || val === 4) {
        const extendData = [
          { required: true, trigger: 'blur', message: '必须添加选择项' }
        ]
        this.$set(this.rules, 'extendData', extendData)
      } else {
        this.selectList = [{
          name: '',
          value: ''
        }]
        this.$set(this.rules, 'extendData', null)
      }
    },
    checkQuestionData() {
      if (this.selectList.length) {
        const array = []
        this.diyformData.questionData = array.concat(this.selectList)
      }
    }
  }
}
</script>

<style lang="scss">
  .question-select-box {
    display: flex;
    position: relative;
  }

  .question-select-add {
    position: absolute;
    right: 0;
    top: 0;
  }
  .question-select-item {
    .el-button--danger.is-plain {
      padding: 7px 8px;
      margin-left: -42px;
      margin-right: 10px;
    }
    .el-tag {
      margin: 0 5px;
    }
  }
</style>

