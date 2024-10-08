<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
      <el-form-item label="商户" required prop="merchant_id">
        <el-select v-model="form.merchant_id">
          <el-option v-for="item in merList" :label="item.name" :key="item.id" :value="item.id" />
        </el-select>
      </el-form-item>
      <div class="flex w-full">
        <el-form-item label="方向" required class="w-4/12" prop="offset">
          <el-select v-model="form.offset">
            <el-option label="买入" value="buy" />
            <el-option label="卖出" value="sell" />
          </el-select>
        </el-form-item>
        <el-form-item label="加密货币" required class="mx-2 w-4/12" prop="crypto">
          <el-select v-model="form.crypto">
            <el-option v-for="item in cryptoList" :label="item.name" :key="item.currency" :value="item.currency" />
          </el-select>
        </el-form-item>
        <el-form-item label="计价法币" required class="w-4/12" prop="currency">
          <el-select v-model="form.currency">
            <el-option v-for="item in currencyList" :label="item.name" :key="item.currency" :value="item.currency" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="价格" required prop="price">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="限额" required prop="limitmin">
        <div class="flex justify-between w-full">
          <span class="w-6/12">
            <el-input v-model="form.limitmin" placeholder="最小限制" />
          </span>
          <span class="w-1/12 text-center">至</span>
          <span class="w-6/12">
            <el-input v-model="form.limitmax" placeholder="最大限制" class="w-full" />
          </span>
        </div>
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
import { apiAdd, apiEdit, apiDetial } from '/@/api/modules/c2cAd'
import { getList } from '/@/api/modules/c2cMer'
import { getList as getcryptoList } from '/@/api/modules/crypto'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGlobalWalletList } from '/@/api/modules/base.api'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const loading = ref(true)
const isLoading = ref(false)
const show = ref(true)
const showGoogle = ref(false)

const form = reactive({
  merchant_id: '',
  offset: 'buy',
  crypto: '',
  currency: '',
  price: '',
  limitmin: '',
  limitmax: ''
})
const merList = ref([])
const cryptoList = ref([{
  currency: 'usdt',
  name: 'USDT'
}])
const currencyList = ref([])

const getData = () => {
  loading.value = true;
  getList({ page: 1 }).then(res => {
    merList.value = res;
  })
  getGlobalWalletList({}).then((res) => {
    const currency_arr = [];
    const mer_arr = [];
    res.forEach(item => {
      if (item.type === 'crypto') {
        mer_arr.push(item)
      } else {
        currency_arr.push(item)
      }
    });
    currencyList.value = currency_arr
    cryptoList.value = mer_arr
    loading.value = false;
  })
}
getData();
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  if (props.data && props.data.id) {
    apiDetial({ id: props.data.id }).then(res => {
      for (const key in res) {
        if (res[key] !== null) {
          form[key] = res[key]
        }
      }
    })
  }
})
const trigger = ['blur', 'change']

const rules = {
  name: [{ required: true, message: '', trigger }],
  merchant_id: [{ required: true, message: '', trigger }],
  offset: [{ required: true, message: '', trigger }],
  crypto: [{ required: true, message: '', trigger }],
  currency: [{ required: true, message: '', trigger }],
  price: [{ required: true, message: '', trigger }],
  limitmin: [{ required: true, message: '', trigger }],
  limitmax: [{ required: true, message: '', trigger }],
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  // 发送请求
  const api = (props.data && props.data.id) ? apiEdit : apiAdd;
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form };
    await api(send)
    ElMessage({
      type: 'tips',
      message: !props.data || !props.data.id ? '新增成功' : '修改成功',
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
      handleSubmit()
    }
  })
}
</script>