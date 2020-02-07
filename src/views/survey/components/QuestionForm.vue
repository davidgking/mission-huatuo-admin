<template>
  <div class="dialog-content">
    <el-dialog ref="timeDlg" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <div slot="title">
        <span>{{ title }}</span>
      </div>
      <div class="form-content">
        <el-form ref="queData" :model="queData" status-icon :rules="rules" label-width="120px" label-position="right" class="demo-ruleForm" size="small">
          <el-form-item label="问题类型" prop="type">
            <el-select v-model="queData.type" size="small" placeholder="问题类型" style="width:160px;">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="问题" prop="title">
            <el-input v-model="queData.title" placeholder="请填写问题" />
          </el-form-item>
          <el-form-item label="是否必答" prop="require">
            <el-select v-model="queData.require" size="small" placeholder="请选择" style="width:160px;">
              <el-option v-for="item in requireList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="queData.type === 2 || queData.type === 3" label="扩展值" prop="extendData">
            <div v-for="(item,index) in selectList" :key="item.value" class="extend-select-box">
              <el-input v-model="item.name" placeholder="扩展项名称(name)" />
              <span style="margin: 0 10px;">-</span>
              <el-input v-model="item.value" placeholder="扩展项取值(value)" />
              <div class="extend-select-delete">
                <el-button icon="el-icon-delete" size="small" type="danger" plain round @click="removeExtendItem(index)">删除</el-button>
              </div>
            </div>
            <div class="extend-select-btn">
              <el-button size="small" type="primary" plain round @click="addExtendItem">新增</el-button>
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
        remark: ''
      },
      typeList: [],
      requireList: [],
      produceStatusList: [],
      rules: {
        type: [
          { required: true, trigger: 'blur', message: '必须选择问题类型' }
        ],
        title: [
          { required: true, trigger: 'blur', message: '必须填写问题' }
        ],
        require: [
          { required: true, trigger: 'blur', message: '必须填写是否必答' }
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
        this.queData = queData
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
      this.queData = {
        type: '',
        title: '',
        require: '',
        answer: '',
        remark: ''
      }
    }
  }
}
</script>

