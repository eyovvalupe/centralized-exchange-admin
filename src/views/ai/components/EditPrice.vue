<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" :title="!isAddType ? '编辑' : '新建'" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" v-loading="loading" label-position="top" class="pt-[10px]" ref="ruleForm">
      <el-form-item label="用户UID" required prop="uid">
        <el-input-number class="input-number" :precision="0" :controls="false" v-model="form.uid" placeholder="请输入用户UID" :disabled="!isAddType" autocomplete="off" />
      </el-form-item>
      <div class="flex justify-between">
        <el-form-item label="方向" required prop="offset" class="w-4/12 mr-[20px]">
          <el-select v-model="form.offset" style="width: 100%;">
            <el-option label="全部" value="all" />
            <el-option label="买涨" value="long" />
            <el-option label="买跌" value="short" />
          </el-select>
        </el-form-item>
        <el-form-item label="合约" required prop="symbol" class="w-8/12">
          <el-select v-model="form.symbol" :loading="loadingSelect">
            <el-option v-for="item in options" :key="item.symbol" :label="item.name" :value="item.symbol">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="flex justify-between align-middle w-full">
        <el-form-item label="赢亏比率" required prop="winrate" class="w-4/12 mr-[20px]">
          <el-select v-model="form.compare">
            <el-option label="大于或等于" value="ge" />
            <el-option label="小于" value="lt" />
          </el-select>
        </el-form-item>
        <el-form-item class="w-8/12">
           <div class="flex w-full mt-7">
            <div  class="w-7/12">
              <el-input-number class="input-number" :max="100" :precision="0" :min="0" :controls="false" v-model="form.winrate" autocomplete="off">
                <template #suffix>%</template>
              </el-input-number>
            </div>
          <!-- <div class="text-right w-5/12">赢率：{{ form.compare == 'ge' ? '大于或等于' : '小于' }}<b class="txt-blue">{{
            form.winrate
          }}%</b></div> -->
           </div>
        </el-form-item>
      </div>
        <div class="flex">
          <div class="text-left">
            <el-button v-for="(s, i) in 5" :key="i" type="danger" size="small" @click="mathBtnPrice(i)">{{ i * 10
              }}%</el-button>
          </div>
          <div class="text-center mx-[5px]">
            <el-button type="info" size="small" @click="mathBtnPrice(5)">50%</el-button>
          </div>
          <div class="text-right">
            <el-button v-for="(s, i) in 5" :key="i" type="success" size="small" @click="mathBtnPrice(i + 6)">{{ (i +
              6) * 10 }}%</el-button>
          </div>
        </div>
    </el-form>
    <template #footer>
      <div class="p-[10px] pt-[30px]">
        <el-button @click="emit('close', false)" round class="w-[98px]">取消</el-button>
        <el-button type="primary" round class="w-[98px]" @click="handleSubmit" :loading="isLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiCtrAdd, apiCtrEdit, apiCtrDetial, getList } from '/@/api/modules/ai'
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

const options = ref([{
  name: '全部',
  symbol: 'all'
}])
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const loadingSelect = ref(false)
const show = ref(true)

const form = ref({
  uid: null,
  symbol: 'all',
  offset: 'all',
  compare: 'ge',
  winrate: '0',
})

const trigger = ['blur', 'change']
const rules = {
  uid: [{ required: true, message: '', trigger }],
  symbol: [{ required: true, message: '', trigger }],
  offset: [{ required: true, message: '', trigger }],
  compare: [{ required: true, message: '', trigger }],
  winrate: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
const isAddType = computed(() => {
  return !(props.data && props.data.partyid)
});

const getData = () => {
  loading.value = true;
  apiCtrDetial({ partyid: props.data.partyid }).then(res => {
    const obj = Object.assign(form.value, res);
    obj.symbol = obj.symbol || 'all'
    obj.offset = obj.offset || 'all'
    form.value = obj;
  }).finally(() => {
    loading.value = false
  })
}
onMounted(() => {
  for (const key in form.value) {
    if (props.data && props.data[key] !== undefined) {
      form.value[key] = props.data[key]
    }
  }
  if (!isAddType.value) {
    getData();
  }
  getList({ page: 1 }).then(res => {
    loadingSelect.value = false
    options.value = options.value.concat(res);

  })
})
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true
      try {
        const send = { ...form.value };
        if (send.symbol == 'all') {
          send.symbol = ''
        }
        if (send.offset == 'all') {
          send.offset = ''
        }
        const func = !isAddType.value ? apiCtrEdit : apiCtrAdd;
        if (props.data && props.data.partyid) {
          send.partyid = props.data.partyid
        }
        await func(send)
        ElMessage({
          type: 'tips',
          message: isAddType.value ? '添加成功' : '修改成功',
          offset: 200
        })
        isLoading.value = false
        emit('close', { reload: true })
      } catch (error) {
        isLoading.value = false
      }
    }
  })
}
const mathBtnPrice = (num) => {
  form.value.winrate = num * 10;
}
</script>

