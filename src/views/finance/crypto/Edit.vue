<template>
  <el-dialog :close-on-click-modal="false" class="reset-el-styte" width="480" title="增加地址" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm" class="pt-[10px]">
      <el-form-item label="币种" required prop="currency">
        <!-- <el-input v-model="form.currency" disabled /> -->
        <el-select v-model="form.currency" class="w-full" @change="currencyChange">
          <el-option v-for="(item, index) in options" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="网络" required prop="network">
        <el-select v-model="form.network" class="w-full">
          <el-option v-for="(item, index) in optionsAll[form.currency]" :key="item + '-' + index" :label="item"
            :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" required prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button @click="emit('close', false)" class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiAdd } from '/@/api/modules/crypto'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apicoinList } from '/@/api/modules/crypto'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const loading = ref(true)
const isLoading = ref(false)
const show = ref(true) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref(false)
const form = reactive({
  currency: '',
  network: '',
  address: '',
  googlecode: '',
})
const trigger = ['blur', 'change']
const rules = {
  currency: [{ required: true, message: '', trigger }],
  network: [{ required: true, message: '', trigger }],
  address: [{ required: true, message: '', trigger }]
}
const currencyChange = () => {
  form.network = "";
}
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
})
const emit = defineEmits(['close', 'success'])
const optionsAll = ref([])
const options = ref([])

const getConfig = () => {
  loading.value = true;
  apicoinList({
    type: 'crypto',
    dedup: false
  }).then((res) => {
    const data = res.map(item => item.name)
    const allData = res.reduce((accumulator, item) => {
      accumulator[item.name] = item.network;
      return accumulator;
    }, {});
    options.value = data;
    optionsAll.value = allData;
    loading.value = false;
  })
}
getConfig();
const addForm = (item) => {
  const { currency, network } = item;
  form.currency = currency
  form.network = network
}
const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true;
    }
  })
}
// 新增
const handleSubmit = async (googlecode) => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = false;
      form.googlecode = googlecode;
      submit()
    }
  })
}

const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const send = { ...form };
    const result = await apiAdd(send)
    ElMessage({
      type: 'tips',
      message: '新增成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
</script>
