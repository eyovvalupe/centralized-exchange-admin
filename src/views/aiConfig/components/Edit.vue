<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
   <div class="soll-list soll-list-y max-h-[520px]">
      <el-form :model="form" :rules="rules" label-position="top" class="pt-[10px]" ref="ruleForm" v-loading="loading">
        <el-form-item label="名称" required prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="代码" prop="symbol">
          <el-input v-model="form.symbol" disabled autocomplete="off" />
        </el-form-item>
        <div class="flex ml-[-10px]">
          <el-form-item label="最小投资额" required class="flex-1 w-0 ml-[10px]" prop="minamount">
            <el-input-number :min="0" class="input-number" :controls="false" @blur="form.minamount <= 0 ? form.minamount = '' : ''" v-model="form.minamount" autocomplete="off" />
          </el-form-item>
          <el-form-item label="最大网格" required class="flex-1 w-0 ml-[10px]" prop="maxgrid">
            <el-input-number class="input-number" :controls="false" :precision="0" :min="1" v-model="form.maxgrid" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="flex ml-[-10px]">
          <el-form-item label="投资人数" required class="flex-1 ml-[10px] w-0" prop="numpeople">
            <el-input-number v-model="form.numpeople" :precision="0" :min="0" class="input-number" :controls="false" @blur="form.numpeople <= 0 ? form.numpeople = '' : ''" autocomplete="off" />
          </el-form-item>
          <el-form-item label="收益金额" required class="flex-1 ml-[10px] w-0" prop="income">
            <el-input-number v-model="form.income" class="input-number" :controls="false" @blur="form.income <= 0 ? form.income = '' : ''" autocomplete="off" />
          </el-form-item>
        </div>
        <el-form-item label="开始运行日期" required prop="starttime">
          <el-date-picker class="!w-full" v-model="form.starttime" type="date" placeholder="请选择日期" />
        </el-form-item>
        <p class="text-base pb-[20px] text-[#000]">波动机器人</p>
        <div class="flex ml-[-10px]">
          <el-form-item label="投资人数增加" required class="ml-[10px] flex-1 w-0" prop="pernumpeople">
            <el-input-number :precision="0" v-model="form.pernumpeople" :min="0" class="input-number" :controls="false" @blur="form.pernumpeople <= 0 ? form.pernumpeople = '' : ''" autocomplete="off" />
          </el-form-item>
          <el-form-item label="收益金额增加" required class="ml-[10px] flex-1 w-0" prop="perincome">
            <el-input-number class="input-number" v-model="form.perincome" :controls="false" @blur="form.perincome <= 0 ? form.perincome = '' : ''" autocomplete="off" />
          </el-form-item>
          <el-form-item label="小时/次" required class="ml-[10px] flex-1 w-0" prop="perhour">
            <el-input-number class="input-number" :precision="0" v-model="form.perhour" :controls="false" @blur="form.perhour <= 0 ? form.perhour = '' : ''"  autocomplete="off" />
          </el-form-item>
        </div>
        <div class="flex ml-[-10px]">
          <el-form-item label="历史收益率波动" required class="flex-1 w-0 ml-[10px]" prop="ratereturn">
            <el-row>
              <el-col :span="11">
                <el-input-number class="input-number" :max="100" :controls="false" v-model="form2.ratereturn_start" @blur="form2.ratereturn_start < 0 ? form2.ratereturn_start = null : ''"  @change="rangeChange('ratereturn')" autocomplete="off">
                  <template #suffix>
                    %
                  </template>
                </el-input-number>
              </el-col>
              <el-col :span="2">
                <div class="text-center text-[16px] leading-[48px]"> ~ </div>
              </el-col>
              <el-col :span="11">
                <el-input-number :max="100" @change="rangeChange('ratereturn')" class="input-number" :controls="false" @blur="form2.ratereturn_end <= 0 ? form2.ratereturn_end = null : ''"  v-model="form2.ratereturn_end" autocomplete="off">
                  <template #suffix>
                    %
                  </template>
                </el-input-number>
              </el-col>
            </el-row>
            
          </el-form-item>
          <el-form-item label="24小时收益率波动" required class="flex-1 w-0 ml-[10px]" prop="ratereturn24h">
            <el-row>
              <el-col :span="11">
                <el-input-number :max="100" class="input-number" :controls="false" v-model="form2.ratereturn24h_start" @blur="form2.ratereturn24h_start < 0 ? form2.ratereturn24h_start = null : ''" @change="rangeChange('ratereturn24h')" autocomplete="off">
                  <template #suffix>
                    %
                  </template>
                </el-input-number>
              </el-col>
              <el-col :span="2">
                <div class="text-center text-[16px] leading-[48px]"> ~ </div>
              </el-col>
              <el-col :span="11">
                <el-input-number :max="100" class="input-number" :controls="false" v-model="form2.ratereturn24h_end" @blur="form2.ratereturn24h_end <= 0 ? form2.ratereturn24h_end = null : ''" @change="rangeChange('ratereturn24h')" autocomplete="off">
                  <template #suffix>
                    %
                  </template>
                </el-input-number>
              </el-col>
            </el-row>
            
          </el-form-item>
        </div>
        <small class="text-gray-400">* 逗号隔开，波动区间在值1和值2之间</small>
      </el-form>
    </div>
    <template #footer>
      <div class="p-[10px] pt-[30px]">
        <el-button class="w-[98px]" round @click="emit('close', false)">取消</el-button>
        <el-button class="w-[98px]" round type="primary" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
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
  maxgrid: null,
  numpeople: null,
  income: null,
  starttime: '',
  pernumpeople: null,
  perincome: null,
  perhour: null,
  ratereturn: '',
  ratereturn24h: '',
  
})

const form2 = reactive({
  ratereturn_start:null,
  ratereturn_end:null,
  ratereturn24h_start:null,
  ratereturn24h_end:null
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
      if(form.ratereturn){
        form2.ratereturn_start = form.ratereturn.split(',')[0] || null
        form2.ratereturn_end = form.ratereturn.split(',')[1] || null
      }
      if(form.ratereturn24h){
        form2.ratereturn24h_start = form.ratereturn24h.split(',')[0] || null
        form2.ratereturn24h_end = form.ratereturn24h.split(',')[1] || null
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

const rangeChange = (key)=>{
  if(key == 'ratereturn'){
    if(form2.ratereturn_start >= 0 && form2.ratereturn_end > form2.ratereturn_start){
      form.ratereturn = form2.ratereturn_start + ',' + form2.ratereturn_end
    }else{
      form.ratereturn = ''
    }
  }else if(key == 'ratereturn24h'){
    if(form2.ratereturn24h_start >= 0 && form2.ratereturn24h_end > form2.ratereturn24h_start){
      form.ratereturn24h = form2.ratereturn24h_start + ',' + form2.ratereturn24h_end
    }else{
      form.ratereturn24h = ''
    }
  }
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
