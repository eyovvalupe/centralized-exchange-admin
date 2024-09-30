<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="代码" prop="symbol">
        <el-input v-model="form.symbol" disabled autocomplete="off" />
      </el-form-item>
      <div class="flex">
        <el-form-item label="最小投资额" required class="mr-2 w-1/2" prop="minamount">
          <el-input v-model="form.minamount" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最大网格" required class="w-1/2" prop="maxgrid">
          <el-input v-model="form.maxgrid" autocomplete="off" />
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="投资人数" required class="mr-2 w-1/2" prop="numpeople">
          <el-input v-model="form.numpeople" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收益金额" required class="w-1/2" prop="income">
          <el-input v-model="form.income" autocomplete="off" />
        </el-form-item>
      </div>
      <el-form-item label="开始运行日期" required prop="starttime">
        <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期" />
      </el-form-item>
      <p class="text-base mt-5 mb-1">波动机器人</p>
      <div class="flex">
        <el-form-item label="投资人数增加" required class="mr-2 w-1/2" prop="pernumpeople">
          <el-input v-model="form.pernumpeople" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收益金额增加" required class="w-1/2" prop="perincome">
          <el-input v-model="form.perincome" autocomplete="off" />
        </el-form-item>
        <el-form-item label="小时/次" required class="w-1/2 ml-2" prop="perhour">
          <el-input v-model="form.perhour" autocomplete="off" />
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="历史收益率波动(%)" required class="mr-2 w-1/2" prop="ratereturn">
          <el-input v-model="form.ratereturn" autocomplete="off" />
        </el-form-item>
        <el-form-item label="24小时收益率波动(%)" required class="w-1/2" prop="ratereturn24h">
          <el-input v-model="form.ratereturn24h" autocomplete="off" />
        </el-form-item>
      </div>
      <small class="text-gray-400">* 逗号隔开，波动区间在值1和值2之间</small>
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
import { apiAdd, apiEdit, apiDetial } from '/@/api/modules/ai'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
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

const form = reactive({
  name: '',
  symbol: '',
  minamount: null,
  maxgrid: '',
  numpeople: '',
  income: '',
  starttime: '',
  pernumpeople: '',
  perincome: '',
  perhour: '',
  ratereturn: '',
  ratereturn24h: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  if (props.data && props.data.id) {
    apiDetial({ symbol: props.data.symbol }).then(res => {
      for (const key in res) {
        form[key] = res[key]
      }
    })
  }
})
const trigger = ['blur', 'change']
const rules = {
  name: [{ required: true, message: '', trigger }],
  symbol: [{ required: true, message: '', trigger }],
  minamount: [{ required: true, message: '', trigger }],
  maxgrid: [{ required: true, message: '', trigger }],
  numpeople: [{ required: true, message: '', trigger }],
  income: [{ required: true, message: '', trigger }],
  starttime: [{ required: true, message: '', trigger }],
  pernumpeople: [{ required: true, message: '', trigger }],
  perincome: [{ required: true, message: '', trigger }],
  perhour: [{ required: true, message: '', trigger }],
  ratereturn: [{ required: true, message: '', trigger }],
  ratereturn24h: [{ required: true, message: '', trigger }],
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async (googlecode) => {
  // 发送请求
  const api = (props.data && props.data.id) ? apiEdit : apiAdd;
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form, googlecode };
    if (form.starttime) {
      send.starttime = dayjs(form.starttime).format('YYYY-MM-DD')
    }
    const result = await api(send)
    ElMessage({
      type: 'tips',
      message: !props.data.id ? '新增成功' : '修改成功',
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
      let haserr = '';
      if (form.ratereturn24h.indexOf(',') === -1) {
        haserr = '24小时收益率波动多个“,”隔开';
      }
      if (form.ratereturn.indexOf(',') === -1) {
        haserr = '历史收益率波动多个“,”隔开';
      }
      if (haserr) {
        ElMessage({
          message: haserr,
          offset: 500,
          type: 'tips'
        })
        return
      }
      showGoogle.value = true;
    }
  })
}
</script>
<style scoped>
.fouseName {
  animation: bgcolor .3s linear forwards;
}

@keyframes bgcolor {
  0% {
    background: rgb(255, 174, 174);
  }

  30% {
    background: #e5f2ff;
  }

  50% {
    background: rgb(255, 174, 174);
  }

  100% {
    background: #e5f2ff;
  }
}
</style>
