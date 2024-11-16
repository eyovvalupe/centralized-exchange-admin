<template>
   <el-dialog :close-on-click-modal="false" width="600" class="reset-el-styte" :title="!props.data ? '新增' : '修改'" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" class="pt-[10px]" ref="ruleForm" v-loading="loading">
      <el-form-item label="公司名称" required :label-width="formLabelWidth" prop="company_name">
        <el-input v-model="form.company_name" autocomplete="off" />
      </el-form-item>
      <div class="flex ml-[-10px]">
        <el-form-item label="市场" class="w-0 flex-1 ml-[10px]" prop="market">
          <el-select v-model="form.market">
              <el-option v-for="item in marketList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易代码" class="w-0 flex-1 ml-[10px]" prop="symbol">
          <el-input v-model="form.symbol" autocomplete="off" />
        </el-form-item>
      </div>
      <div class="flex ml-[-10px]">
        <el-form-item label="认购开始时间" required class="w-0 flex-1 ml-[10px]" prop="issue_start_date">
          <el-date-picker v-model="form.issue_start_date" value-format="YYYY-MM-DD" style="width: 100%;"
            :disabled-date="disabledStart" type="date" />
        </el-form-item>
        <el-form-item label="认购结束时间" required class="w-0 flex-1 ml-[10px]" prop="issue_end_date">
          <el-date-picker v-model="form.issue_end_date" value-format="YYYY-MM-DD" :disabled-date="disabledEnd"
            type="date" style="width: 100%;" />
        </el-form-item>
      </div>
      <el-form-item label="认购价格" required prop="issue_price_max">
        <el-input-number class="input-number" v-model="form.issue_price_max" :controls="false" @blur="form.issue_price_max <= 0 ? form.issue_price_max ='' : ''"
          autocomplete="off">
        </el-input-number>
      </el-form-item>
      <div class="flex ml-[-10px]">
        <el-form-item label="VIP" class="w-0 flex-1 ml-[10px]">
          <el-select v-model="statusVIP" class="w-full" @change="resetKey">
            <el-option label="否" :value="false" />
            <el-option label="是" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="VIP杠杆" :required="statusVIP" class="w-0 flex-1 ml-[10px]" prop="lever">
          <el-input-number class="input-number" :controls="false" :precision="0" :min="1" v-model="form.lever" :disabled="!statusVIP" />
        </el-form-item>
        <el-form-item label="VIP密钥" :required="statusVIP" class="w-0 flex-1 ml-[10px]" prop="keyword">
          <div class="flex flex-1">
            <el-input v-model="form.keyword" disabled autocomplete="off" />
            <el-button type="primary" :disabled="!statusVIP" @click="resetKey" class="ml-[5px]">
              重置
            </el-button>
          </div>
        </el-form-item>

      </div>
      <div class="flex ml-[-10px]">
        <el-form-item label="上市日期" required class="w-0 flex-1 ml-[10px]" :label-width="formLabelWidth" prop="listing_date">
          <el-date-picker v-model="form.listing_date" value-format="YYYY-MM-DD" :disabled-date="disabledStart"
            type="date" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="上市价格" class="w-0 flex-1 ml-[10px]" :label-width="formLabelWidth" prop="listed_price">
          <el-input-number class="input-number" :controls="false" @blur="form.listed_price <= 0 ? form.listed_price = '' : ''" v-model="form.listed_price" autocomplete="off" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button round class="w-[98px]" @click="emit('close', false)">取消</el-button>
        <el-button round class="w-[98px]" type="primary" @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiAdd, apiEdit } from '/@/api/modules/ipo/config.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import { generateRandomPassword } from '/@/utils'
import { getSessionToken } from '/@/api/modules/base.api'

const props = defineProps({
  title: { // 弹窗类型
    type: String,
    default: 'add'
  },
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const ruleForm = ref(null)
const formLabelWidth = ref(100)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const statusVIP = ref(false)

const marketList = ref([
  {
    label:"美国",
    value:"us"
  },
  {
    label:"日本",
    value:"japan"
  },
  {
    label:"印度",
    value:"india"
  },
  {
    label:"韩国",
    value:"korea"
  },
  {
    label:"德国",
    value:"germany"
  },
  {
    label:"英国",
    value:"uk"
  },
  {
    label:"新加坡",
    value:"singapore"
  },
  {
    label:"香港",
    value:"hongkong"
  },
  {
    label:"马来西亚",
    value:"malaysia"
  }
])
const form = reactive({
  company_name: '',
  market: '',
  symbol: '',
  lever: null,
  keyword: null,
  issue_price_min: 1,
  issue_price_max: null,
  listed_price: null,
  issue_start_date: '',
  issue_end_date: '',
  listing_date: '',
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
      if (key === 'lever') {
        statusVIP.value = props.data[key] > 1;
        form.lever = statusVIP.value ? props.data[key] : null;
      }
    }
  }
})
const trigger = ['blur', 'change']
// const intRangeValidator = (rule, value, callback) => {
//   var isInRange = (form.issue_price_min < form.issue_price_min <= form.listed_price);
//   if (isInRange){
//     return callback();
//   }else{
//     return callback(new Error());
//   }

const rules = {
  company_name: [{ required: true, message: '', trigger }],
  // market: [{ required: true, message: '', trigger }],
  // symbol: [{ required: true, message: '', trigger }],
  lever: [{ required: true, message: '', trigger }],
  keyword: [{ required: true, message: '', trigger }],
  // issue_price_min: [{ required: true, message: '', trigger }],
  issue_price_max: [{ required: true, message: '', trigger }],
  // listed_price: [{ required: true, message: '', trigger }],
  listing_date: [{ required: true, message: '', trigger }],
  issue_start_date: [{ required: true, message: '', trigger }],
  issue_end_date: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      // 发送请求
      const api = !props.data ? apiAdd : apiEdit
      isLoading.value = true
      try {
        let token = '';
        getSessionToken().then( async (res) => {
          token = res;
          const send = { ...form, token };
          if (props.data && props.data.id) {
            send.id = props.data.id;
          }
          const result = await api(send)
          ElMessage({
            type: 'tips',
            message: !props.data ? '新增成功' : '修改成功',
            offset: 200
          })
          isLoading.value = false
          emit('close', { reload: true })
        })
      } catch (error) {
        isLoading.value = false
      }
    }
  })
}
const resetKey = () => {
  if (statusVIP.value) {
    form.keyword = generateRandomPassword(6, true);
  } else {
    form.keyword = ''
    form.lever = null
  }
}
</script>
