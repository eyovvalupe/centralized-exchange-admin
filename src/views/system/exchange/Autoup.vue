<template>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="汇率更新方式" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
      <el-form-item :label="'更新方式'" required prop="mode">
        <el-select v-model="form.mode" class="w-full" placeholder="请选择状态">
          <el-option label="自动" :value="true" />
          <el-option label="手动" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
       <div class="txt-tips w-full"> {{ form.mode ? '自动:每12小时根据最新汇率自动更新':'手动:不自动更新，管理员编辑修改汇率' }}</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn"  @click="showPwdEvent" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="交易密码" v-model="showPwd">
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm2" v-loading="loading">
      <el-form-item label="交易密码" required :label-width="formLabelWidth" prop="safeword">
        <el-input v-model="form.safeword" type="password" autocomplete="off" placeholder="请输入交易密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPwd=false">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiEdit } from '/@/api/modules/exchange'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { apiAutoUp } from '/@/api/modules/exchange'
const showPwd = ref(false)
const ruleForm2 = ref(null)
const ruleForm = ref(null)
const isLoading = ref(false)
const show = ref(true)
const form = reactive({
  safeword: '',
  mode: undefined
})

const autoUdate = () => {
  apiAutoUp({}).then(res => {
    form.mode = res.mode;
  })
}

autoUdate()
const trigger = ['blur', 'change']
const rules = {
  mode: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}
const emit = defineEmits(['close', 'success'])
const handleSubmit = async () => {
  ruleForm2.value.validate(valid => {
    if (valid) {
      submit()
    }
  })
}
const showPwdEvent=()=>{
  ruleForm.value.validate(valid => {
    if (valid) {
      showPwd.value = true;
    }
  })

}
const submit = async () => {
  showPwd.value = false
  // 发送请求
  isLoading.value = true
  try {
    const result = await apiAutoUp(form)
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
</script>
