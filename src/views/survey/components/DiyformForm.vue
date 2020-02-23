<template>
  <div class="createSurvey-container">
    <sticky :z-index="10" :class-name="'sub-navbar'">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        提交
      </el-button>
    </sticky>

    <div class="createSurvey-main-container">
      <el-form ref="diyformForm" :model="diyformData" status-icon :rules="rules" label-width="120px" label-position="right" class="demo-ruleForm" size="small">
        <el-form-item label="调研表名称" prop="formNameCn">
          <el-input v-model="diyformData.formNameCn" placeholder="请填写调研表名称" />
        </el-form-item>
        <el-form-item label="English Name" prop="formNameEn">
          <el-input v-model="diyformData.formNameEn" placeholder="请填写English Name" />
        </el-form-item>
        <el-form-item label="描述" prop="formDescriptionCn">
          <el-input v-model="diyformData.formDescriptionCn" placeholder="请填写描述" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="Description" prop="formDescriptionEn">
          <el-input v-model="diyformData.formDescriptionEn" placeholder="请填写Description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="问题" prop="questions">
          <el-table :data="diyformData.questions" border fit highlight-current-row style="width: 100%">

            <el-table-column width="120px" align="center" label="类型">
              <template slot-scope="{row}">
                <span>{{ row.questionType | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column width="300px" align="center" label="标题">
              <template slot-scope="{row}">
                <span>{{ row.questionTitleCn + ' ' + row.questionTitleEn }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="选项">
              <template slot-scope="{row}">
                <div v-if="row.questionItems">
                  <div v-for="item in row.questionItems" :key="item.questionNo">{{ item.itemTextCn + ' ' + item.itemTextEn }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="操作" width="100">
              <template slot-scope="{row}">
                <el-button type="danger" size="small" @click="removeQuestionItem(row.questionNo)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;margin-top:10px;">
            <el-button type="primary" @click="showItemForm">添加问题</el-button>
            <div class="que-form-line" />
          </div>
          <div v-if="dialogVisible" class="que-form-container">
            <el-form ref="queForm" :model="queData" status-icon :rules="queRules" label-width="120px" label-position="right" class="demo-ruleForm" size="small">
              <el-form-item label="中文标题" prop="questionTitleCn">
                <el-input v-model="queData.questionTitleCn" placeholder="请填写中文标题" />
              </el-form-item>
              <el-form-item label="English Title" prop="questionTitleEn">
                <el-input v-model="queData.questionTitleEn" placeholder="请填写English Title" />
              </el-form-item>
              <el-form-item label="问题类型" prop="questionType">
                <el-select v-model="queData.questionType" size="small" placeholder="问题类型" style="width:280px;" @change="changeType">
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="queData.questionType === 1 || queData.questionType === 2" label="添加选项" prop="questionItems">
                <div v-for="(item,index) in selectList" :key="item.index" class="extend-select-box">
                  <el-input v-model="item.itemTextCn" placeholder="中文" style="width:280px;" />
                  <span style="margin: 0 10px;">-</span>
                  <el-input v-model="item.itemTextEn" placeholder="English" style="width:280px;" />
                  <div class="extend-select-delete">
                    <el-button size="mini" type="danger" @click="removeExtendItem(index)">移除</el-button>
                  </div>
                </div>
                <div class="extend-select-btn">
                  <el-button size="mini" type="primary" @click="addExtendItem">新增</el-button>
                </div>
              </el-form-item>
            </el-form>
            <div id="belowDom" style="text-align:center;">
              <el-button size="middle" type="primary" @click="addQuestionItem">确认</el-button>
              <el-button size="middle" @click="hideItemForm">取消</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

import Survey from '@/api/survey'
import Sticky from '@/components/Sticky'
export default {
  name: 'DiyformForm',
  components: { Sticky },
  filters: {
    typeFilter(value) {
      let text
      switch (Number(value)) {
        case 1:
          text = '单选'
          break
        case 2:
          text = '多选'
          break
        case 3:
          text = '文本'
          break
        case 4:
          text = '多行文本'
          break
      }
      return text
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateQues = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('至少添加1条问题'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tempRoute: {},
      diyformData: {
        id: '',
        formNameCn: '',
        formNameEn: '',
        questions: [],
        formDescriptionCn: '',
        formDescriptionEn: ''
      },
      selectList: [{
        itemTextCn: '',
        itemTextEn: ''
      }],
      rules: {
        formNameCn: [
          { required: true, trigger: 'blur', message: '必须填写调研表名称' }
        ],
        formNameEn: [
          { required: true, trigger: 'blur', message: '必须填写English Name' }
        ],
        questions: [
          { required: true, validator: validateQues, trigger: 'blur' }
        ]
      },
      queData: {
        questionType: '',
        questionTitleCn: '',
        questionTitleEn: '',
        questionItems: ''
      },
      queRules: {
        questionTitleCn: [
          { required: true, trigger: 'blur', message: '必须填写问题' }
        ],
        questionTitleEn: [
          { required: true, trigger: 'blur', message: '必须填写English Title' }
        ],
        questionType: [
          { required: true, trigger: 'blur', message: '必须选择问题类型' }
        ]
      },
      typeList: [{
        label: '单选 Single topic selection',
        value: 1
      }, {
        label: '多选 Multiple choice',
        value: 2
      }, {
        label: '文本 Textbox',
        value: 3
      }, {
        label: '多行文本 Text area',
        value: 4
      }],
      dialogVisible: false
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getDetail(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    getDetail(id) {
      Survey.queryDiyform({ id: id }).then(response => {
        const diyformData = {
          id: id,
          formNameCn: '测试数据',
          formNameEn: 'Hbmzsu Bjzvheg Ttlbmvkqo',
          datetime: '1972-04-28 18:11:18',
          questions: [{
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
          }],
          formDescriptionCn: 'test',
          formDescriptionEn: 'english'
        }
        this.diyformData = Object.assign({}, diyformData)

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑调研表'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.diyformData.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑调研表'
      document.title = `${title} - ${this.diyformData.id}`
    },
    resetForm() {
      this.$refs.diyformForm.clearValidate()
      this.diyformData = {
        formNameCn: '',
        formNameEn: '',
        questions: [],
        formDescriptionCn: '',
        formDescriptionEn: ''
      }
      this.selectList = [{
        itemTextCn: '',
        itemTextEn: ''
      }]
    },
    submitForm() {
      if (this.isEdit) {
        this.editData()
      } else {
        this.addData()
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
              this.resetForm()
              this.hideItemForm()
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
              this.hideItemForm()
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
      this.checkAnswerData()
      this.$refs.queForm.validate((valid) => {
        if (valid) {
          const queData = Object.assign({}, this.queData)
          queData.questionNo = this.diyformData.questions.length + 1
          this.diyformData.questions.push(queData)
          this.resetItemForm()
          this.$refs.diyformForm.clearValidate(['questions'])
        } else {
          this.$message.error('问题表单填写有误')
          return false
        }
      })
    },
    removeQuestionItem(questionNo) {
      let int
      this.diyformData.questions.forEach((item, index) => {
        if (item.questionNo === questionNo) {
          int = index
        }
      })
      this.diyformData.questions.splice(int, 1)
    },
    addExtendItem() {
      this.selectList.push({
        itemTextCn: '',
        itemTextEn: ''
      })
    },
    removeExtendItem(index) {
      this.selectList.splice(index, 1)
    },
    changeType(val) {
      if (val === 1 || val === 2) {
        const extendData = [
          { required: true, trigger: 'blur', message: '必须添加选择项' }
        ]
        this.$set(this.queRules, 'questionItems', extendData)
      } else {
        this.selectList = [{
          itemTextCn: '',
          itemTextEn: ''
        }]
        this.$set(this.queRules, 'questionItems', null)
      }
    },
    checkAnswerData() {
      const type = this.queData.questionType
      if (type === 1 || type === 2) {
        if (this.selectList.length && this.selectList[0].itemTextCn && this.selectList[0].itemTextEn) {
          const array = []
          this.queData.questionItems = array.concat(this.selectList)
        }
      }
    },
    showItemForm() {
      this.dialogVisible = true
      this.$nextTick(() => {
        document.querySelector('#belowDom').scrollIntoView()
      })
    },
    hideItemForm() {
      this.dialogVisible = false
      this.resetItemForm()
    },
    resetItemForm() {
      this.$refs.queForm.clearValidate()
      this.queData = {
        questionType: '',
        questionTitleCn: '',
        questionTitleEn: '',
        questionItems: ''
      }
      this.selectList = [{
        itemTextCn: '',
        itemTextEn: ''
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createSurvey-container {
    position: relative;

    .createSurvey-main-container {
      padding: 40px 55px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .que-form-container {
    margin-top: 15px;
    width: 90%;
  }

  .que-form-line {
    margin: 15px 0 0 20px;
    flex-grow: 1;
    height: 1px;
    background-color: #ddd;
  }

  .extend-select-box {
    display: flex;
    margin-bottom: 20px;
    position: relative;
  }

  .extend-select-delete {
    position: absolute;
    right: 0;
    top: 0;
  }

  .extend-select-btn {
    text-align: right;
    margin-top: 10px;
    position: relative;
    .el-button {
      position: relative;
    }
  }
</style>

