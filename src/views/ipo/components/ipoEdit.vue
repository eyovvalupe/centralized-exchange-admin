<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="IPO参数" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="py-[10px]" v-loading="loading">
      <div class="table-list-order flex">
        <span class="table-span-left">隔夜利息</span><span class="table-span-right">{{ form.interest || '--'  }}</span>
      </div>
      <div class="table-list-order flex">
        <span class="table-span-left">下单数量限制</span><span class="table-span-right">{{  form.volume  }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { getIpoPara } from '/@/api/modules/ipo/config.api'
import { ref } from 'vue'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const loading = ref(true)
const show = ref(true)
const form = ref({
  interest: '',
  volume: '',
})

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  emit('close')
}
getIpoPara().then(res=>{
    form.value = res;
    loading.value = false
  })
</script>
