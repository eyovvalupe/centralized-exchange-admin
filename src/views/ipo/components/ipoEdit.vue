<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="IPO参数" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form v-loading="loading">
      <div class="from-info">
        <p><label>隔夜利息</label><span>{{ form.interest  }}</span></p>
        <p><label>下单数量限制</label><span>{{  form.volume  }}</span></p> </div>
    </el-form>
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
