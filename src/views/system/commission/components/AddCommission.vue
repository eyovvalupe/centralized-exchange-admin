<template>
    <el-dialog :close-on-click-modal="false" width="600" class="reset-el-styte" :title="props.data && props.data.id ? '编辑' : '新增'" v-model="show" :append-to-body="true"
    @closed="emit('close', {reload})">
        <div class="soll-list soll-list-y max-h-[800px] py-[10px]">
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
                <el-form-item label="手续费模式" ref="valueRef" required prop="value">
                    <el-radio-group v-model="form.mode" @change="modeChange">
                        <el-radio value="percent">百分比</el-radio>
                        <el-radio value="fixed">固定手续费</el-radio>
                    </el-radio-group>

                    <div class="w-full pt-[10px]" v-if="form.mode == 'percent'">
                        <div class="flex items-center mt-[10px]" v-for="(item,i) in percentList" :key="i">
                            <el-input-number class="input-number" @blur="item.end <= 0 ? item.end = null : ''" :controls="false" @change="valueChange()" v-model="item.end" placeholder="输入金额" />
                            <div class="mx-[10px]">
                                :
                            </div>
                            <el-input-number class="input-number" :min="0" :controls="false" @change="valueChange()" v-model="item.value" placeholder="手续费">
                                <template #suffix>
                                %
                                </template>
                            </el-input-number>
                            <el-button v-if="i == percentList.length-1" @click="percentList.push({end:null,value:null})" class="w-[48px] ml-[10px] !h-[48px]" type="primary" icon="plus"></el-button>
                            <el-button v-else @click="percentList.splice(i,1)" class="w-[48px] ml-[10px] !h-[48px]" type="danger" icon="minus"></el-button>
                        </div>
                    </div>
                    <div class="w-full pt-[10px]" v-else>
                        <div class="flex items-center mt-[10px]" v-for="(item,i) in fixedList" :key="i">
                            <el-input-number class="input-number" :min="0" :controls="false" @change="valueChange()" v-model="item.start" placeholder="起始金额" />
                            <div class="mx-[10px]">
                                - 
                            </div>
                            <el-input-number class="input-number" :min="0" :controls="false" @change="valueChange()" v-model="item.end" placeholder="结束金额" />
                            <div class="mx-[10px]">
                                :
                            </div>
                            <el-input-number @change="valueChange()" class="input-number" :min="0" :controls="false" v-model="item.value" placeholder="固定手续费" />
                           
                            <el-button v-if="i == fixedList.length-1" @click="fixedList.push({start:null,end:null,value:null})" class="w-[48px] ml-[10px] !h-[48px]" type="primary" icon="plus"></el-button>
                            <el-button v-else @click="fixedList.splice(i,1)" class="w-[48px] ml-[10px] !h-[48px]" type="danger" icon="minus"></el-button>
                        </div>

                    </div>

                    <div class="pt-[10px] w-full">
                        <div class="tips" v-if="form.mode == 'percent'">金额百分比: <span class="text-[#EF8401]">100,5</span>。5%手续费，封顶100</div>
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
import { ref,onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus'
import { getGlobalWalletList } from '/@/api/modules/base.api'
import { withdrawConfigAdd,withdrawConfigUpdate } from '/@/api/modules/system/withdraw.api'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const valueRef = ref(null)
const form = reactive({
  symbol: null,
  mode:'percent',
  value: null,
  min: 1
})

const percentList = ref([
    {
        end:null,
        value:null
    }
])
const fixedList = ref([
    {
        start:null,
        end:null,
        value:null
    }
])

const valueChange = ()=>{
    let val = ''
    if(form.mode == 'percent'){
        percentList.value.map(v=>{
            if(v.end > 0 && v.value !== null && v.value !== ''){
                val += val ? ';'+v.value + ',' + v.end : v.value + ',' + v.end
            }
        })
        form.value = val
    }else{
        fixedList.value.map(v=>{
            if(v.start >= 0 && v.end > v.start && v.value !== null && v.value !== ''){
                val += val ? ';'+v.start+','+v.end + ',' + v.value : v.start+','+v.end + ',' + v.value
            }
        })
        form.value = val
    }
}

const initList = ()=>{
    let list = []
    let arr = form.value ? form.value.split(';') : []
    if(form.mode == 'percent'){
        arr.map(v=>{
            list.push({
                end:v.split(',')[1] || null,
                value:v.split(',')[0] || null
            })
        })
        if(!list.length){
            list = [
                {
                    end:null,
                    value:null
                }
            ]
        }
        percentList.value = list
    }else{
        arr.map(v=>{
            list.push({
                start:v.split(',')[0] || null,
                end:v.split(',')[1] || null,
                value:v.split(',')[2] || null
            })
        })
        if(!list.length){
            list = [
                {
                    start:null,
                    end:null,
                    value:null
                }
            ]
        }
        fixedList.value = list
    }
}

onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  
  initList()
 
})

const modeChange = ()=>{
    if(props.data && props.data.value && props.data.mode == form.mode){
        form.value = props.data.value
    }else{
        form.value = ''
    }
    initList()
    valueChange()
    nextTick(()=>{
        valueRef && valueRef.value.clearValidate()
    })
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