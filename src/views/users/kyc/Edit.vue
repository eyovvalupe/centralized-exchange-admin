<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="认证审核" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div v-loading="dialogLoading" style="max-height:700px;min-height:500px;" class="soll-list soll-list-y">
      <template v-if="!dialogLoading">
          <RealnameInfo :detail-data="detailData" :src-list="srcList" />
          <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" class="pt-[10px]">
            <el-form-item  label="审核" required :label-width="formLabelWidth" prop="status">
              <el-select v-model="form.status" class="w-full">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="拒绝原因" v-if="form.status == 'failure'" :label-width="formLabelWidth" prop="remarks">
              <el-input v-model="form.remarks" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
            </el-form-item>
          </el-form>
          
      </template>
    </div>

    <template v-if="!dialogLoading" #footer> 
      <div class="pb-[10px] pr-[10px]">
        <el-button @click="emit('close', false)" class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import RealnameInfo from './components/RealnameInfo'
import { apiEdit,getDetail } from '/@/api/modules/business/kyc.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  info: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const detailData = ref({})
const srcList = ref([])
const dialogLoading = ref(false)

const ruleForm = ref(null)

const formLabelWidth = ref(100)
const isLoading = ref(false)
// 审核中  [ none ]
// 成功  [ success ]
// 失败  [ failure ]
const show = ref(true)
const statusOptions = [
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '通过',
  },
  {
    value: 'failure',
    label: '拒绝',
  },
]

const form = reactive({
  id: '',
  remarks: '',
  status: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.info && props.info[key] !== undefined) {
      form[key] = props.info[key]
    }
  }
})
const trigger = ['blur', 'change']
const rules = {
  status: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      submit()
    }
  })
}



const showDialog = () => {
  dialogLoading.value = true;
  getDetail({ id: props.info.id }).then(res => {
    detailData.value = Object.assign(res, props.info);
    srcList.value = [res.idimg_1, res.idimg_2, res.idimg_3];
  }).finally(() => {
    dialogLoading.value = false;
  })
}

showDialog();


const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const result = await apiEdit(form)
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
