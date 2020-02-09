<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>{{ title }}</span>
      </div>
      <div class="form-content">
        <el-form ref="queForm" :model="queData" status-icon :rules="rules" label-width="120px" label-position="right" class="demo-ruleForm" size="small">
          <el-form-item label="问题" prop="title">
            <el-input v-model="queData.title" placeholder="请填写问题" />
          </el-form-item>
          <el-form-item label="是否必答" prop="require">
            <el-select v-model="queData.require" size="small" placeholder="请选择" style="width:200px;">
              <el-option v-for="item in requireList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="问题类型" prop="type">
            <el-select v-model="queData.type" size="small" placeholder="问题类型" style="width:200px;" @change="changeType">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="queData.type === 3 || queData.type === 4" label="添加选项" prop="extendData">
            <div v-for="(item,index) in selectList" :key="item.value" class="extend-select-box">
              <el-input v-model="item.name" placeholder="选项名称(name)" style="width:200px;" />
              <span style="margin: 0 10px;">-</span>
              <el-input v-model="item.value" placeholder="选项取值(value)" style="width:200px;" />
              <div class="extend-select-delete">
                <el-button size="mini" type="danger" @click="removeExtendItem(index)">移除</el-button>
              </div>
            </div>
            <div class="extend-select-btn">
              <el-button size="mini" type="primary" @click="addExtendItem">新增</el-button>
            </div>
          </el-form-item>
          <el-form-item label="答案" prop="answer">
            <el-input v-model="queData.answer" placeholder="请填写答案" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="queData.remark" placeholder="请填写备注" />
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
  name: 'QuestionForm',
  data() {
    return {
      title: '问题添加',
      dialogVisible: false,
      formType: 1,
      queData: {
        type: '',
        title: '',
        require: '',
        answer: '',
        remark: '',
        extendData: ''
      },
      typeList: [],
      requireList: [],
      rules: {
        title: [
          { required: true, trigger: 'blur', message: '必须填写问题' }
        ],
        require: [
          { required: true, trigger: 'blur', message: '必须选择是否必答' }
        ],
        type: [
          { required: true, trigger: 'blur', message: '必须选择问题类型' }
        ]
      },
      selectList: [{
        name: '',
        value: ''
      }]
    }
  },
  watch: {
    formType(val) {
      if (val) {
        this.title = '问题添加'
      } else {
        this.title = '问题修改'
      }
    }
  },
  methods: {
    open(formType, queData, typeList, requireList) {
      this.formType = formType
      if (queData) {
        this.queData = Object.assign({}, queData)
        if (queData.answer && (queData.answer instanceof Array)) {
          const array = []
          this.selectList = array.concat(queData.answer)
        }
      }
      this.dialogVisible = true
      this.typeList = typeList
      this.requireList = requireList
    },
    cancel() {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm() {
      this.$refs.queForm.clearValidate()
      this.queData = {
        type: '',
        title: '',
        require: '',
        answer: '',
        remark: '',
        extendData: ''
      }
      this.selectList = [{
        name: '',
        value: ''
      }]
    },
    sure() {
      this.checkExtendData()
      if (this.formType) {
        this.addData()
      } else {
        this.editData()
      }
    },
    addData() {
      this.$refs.queForm.validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.queData)
          Survey.createQue(param).then(response => {
            if (response.code === 20000) {
              this.$notify({
                title: '成功',
                message: '添加问题成功',
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
      this.$refs.queForm.validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.queData)
          Survey.updateQue(param).then(response => {
            if (response.code === 20000) {
              this.$notify({
                title: '成功',
                message: '修改问题成功',
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
    addExtendItem() {
      this.selectList.push({
        name: '',
        value: ''
      })
    },
    removeExtendItem(index) {
      this.selectList.splice(index, 1)
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
    checkExtendData() {
      const type = this.queData.type
      if (type === 3 || type === 4) {
        if (this.selectList.length && this.selectList[0].value && this.selectList[0].name) {
          this.queData.extendData = this.selectList
        }
      }
    }
  }
}
</script>

<style lang="scss">
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

