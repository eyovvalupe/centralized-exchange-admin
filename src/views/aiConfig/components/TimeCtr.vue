<template>
   <el-dialog :close-on-click-modal="false" width="700" title="时间区间配置" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <ctrTime />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ctrTime from '../time.vue'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const show = ref(true)
const emit = defineEmits(['close', 'success'])
</script>
<style lang="scss" scoped></style>
