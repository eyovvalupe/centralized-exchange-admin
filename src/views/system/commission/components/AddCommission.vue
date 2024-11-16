<template>
    <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" :title="props.data && props.data.id ? '编辑' : '新增'" v-model="show" :append-to-body="true"
    @closed="emit('close', {reload})">
        <div class="py-[10px]">
            <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm" v-loading="loading">
                <el-form-item label="货币" required prop="symbol">
                    <el-select v-model="form.symbol">
                        <el-option v-for="(item,i) in currencyList" :key="item.currency" :label="item.name" :value="item.currency">
                            <div class="flex items-center">
                                <img class="w-[24px] h-[24px] mr-[10px] rounded-full" :src="`/images/crypto/${item.currency.toLocaleUpperCase()}.png`" :alt="item.currency.toLocaleUpperCase()" />{{ item.name }}
                            </div>
                        </el-option>
                        <template #label="{ label, value }">
                            <div class="flex items-center">
                                <img class="w-[24px] h-[24px] mr-[10px] rounded-full" :src="`/images/crypto/${value.toLocaleUpperCase()}.png`" :alt="value.toLocaleUpperCase()" />
                                <span>{{ label }}</span>
                            </div>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="手续费模式" required prop="symbol">
                    <el-radio-group v-model="form.mode" @change="modeChange">
                        <el-radio value="percent">百分比</el-radio>
                        <el-radio value="fixed">固定手续费</el-radio>
                    </el-radio-group>
                    <div class="pt-[10px] w-full">
                        <el-input v-model="form.value" v-if="form.mode == 'percent'" placeholder="请输入金额百分比" />
                        <el-input v-model="form.value" v-else placeholder="请输入固定手续费" />
                        <div class="tips" v-if="form.mode == 'percent'">金额百分比: <span class="text-[#EF8401]">0.005,100</span>。5%手续费，封顶100</div>
                        <div class="tips" v-else>固定手续费：<span class="text-[#EF8401]">0,100,10;100,100000000,30</span> 。0-100 手续费10 ，100-100000000手续费 30 </div>
                    </div>
                </el-form-item>
                <el-form-item label="提现最小金额" required prop="min">
                    <el-input-number class="input-number" :controls="false" @blur="form.min <= 0 ? form.min = '' : ''" placeholder="请输入提现最小金额" v-model="form.min" />
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <div class="pb-[10px] pr-[10px]">
                <el-button size="large" class="w-[98px]" @click="show=false;" round>取消</el-button>
                <el-button size="large" type="primary" class="w-[98px]" round @click="handleGoogle" :loading="isLoading">确定 </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320" v-if="showGoogle">
        <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="showGoogle=false;" />
    </el-dialog>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import { getGlobalWalletList } from '/@/api/modules/base.api'
import { withdrawConfigAdd,withdrawConfigUpdate } from '/@/api/modules/system/withdraw.api'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  symbol: null,
  mode:'percent',
  value: null,
  min: 1
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
 
})

const modeChange = ()=>{
    if(props.data && props.data.value && props.data.mode == form.mode){
        form.value = props.data.value
    }else{
        form.value = ''
    }
}
const emit = defineEmits(['close'])
const showGoogle = ref(false)

const trigger = ['blur', 'change']
const rules = {
    symbol: [{ required: true, message: '', trigger }],
    mode: [{ required: true, message: '', trigger }],
    value: [{ required: true, message: '', trigger }],
    min: [{ required: true, message: '', trigger }]
}
const loading = ref(false)
const isLoading = ref(false)

const currencyList = ref([])

const show = ref(true)
const reload = ref(false)

const ruleForm = ref(null)
// 新增
const handleSubmit = async (googlecode) => {
  // 发送请求
  const api = (!props.data || !props.data.id) ? withdrawConfigAdd : withdrawConfigUpdate
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form, googlecode };
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
    reload.value = true
    show.value = false
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

const walletList = ()=>{
    getGlobalWalletList({
        type:null,
        dedup:true
    }).then(res=>{
        currencyList.value = res || []

    })
}
walletList()

</script>

<style lang="scss" scoped>
.el-radio-group{
    width: calc(100% + 10px);
    margin-left: -10px;
    .el-radio{
        background-color: #F5F5F5;
        border-radius: 8px;
        height: 48px;
        flex:1;
        margin-right: 0px;
        margin-left: 10px;
        padding: 0 20px;
        :deep(.el-radio__label){
            padding-left: 0px;
        }
        :deep(.el-radio__input){
            position: absolute;
            right:20px;
            top:50%;
            width: 20px;
            height: 20px;
            margin-top: -10px;
        }
        :deep(.el-radio__inner){
            width: 20px;
            height: 20px;
            background: none;
            border-color: #999;
        }
        :deep(.el-radio__inner:after){
            width: 8px;
            height: 8px;
            background-color: var(--el-color-primary);
        }
        :deep(.is-checked .el-radio__inner){
            border-color: var(--el-color-primary);
        }
    }
}
.tips{
    line-height: 20px;
    color:#999;
    margin-top:10px;
    font-size: 12px;
    position: relative;
    padding-left: 20px;
}
.tips::before{
    content: '';
    width: 4px;
    height: 4px;
    background-color: #999;
    border-radius: 50%;
    position: absolute;
    left:4px;
    top:8px;
}

</style>