<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" title="交易时间配置" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
      <el-form-item label="时区" required  prop="timezone">
          <el-input v-model="form.timezone"  autocomplete="off" />
        </el-form-item>
        <el-form-item label="交易时间" required  prop="tradinghours">
          <el-input v-model="form.tradinghours"  autocomplete="off" placeholder="" />
          <small class="txt-gray2">周一至周五</small> 
        </el-form-item>
        <el-form-item label="休市日期" required prop="closeddates">
          <el-input v-model="form.closeddates" type="textarea" autocomplete="off" :rows="2" />
          <small class="txt-gray2">逗号隔开，示例：2023-01-12,2023-01-13</small> 
        </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiTimeConfig,apiUpdateTimeConfig } from  '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const showGoogle = ref(false)

const form = ref({
  timezone: '',
  closeddates: '',
  tradinghours: ''
})
 

const trigger = ['blur', 'change']
const rules = {
  timezone: [{ required: true, message: '', trigger }],
  closeddates: [{ required: true, message: '', trigger }],
  tradinghours: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
const getData=()=>{
  loading.value = true;
  apiTimeConfig().then(res=>{
    form.value = res;
    loading.value = false;
  })
}
getData();
// 新增
const handleSubmit = async (googlecode) => {
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form.value,googlecode };
    if (props.data && props.data.id) {
      send.id = props.data.id;
    }
    const result = await apiUpdateTimeConfig(send)
    ElMessage({
      type: 'tips',
      message:'修改成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true;
    }
  })
}
</script>
