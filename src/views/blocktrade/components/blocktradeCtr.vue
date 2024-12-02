<template>
   <el-dialog :close-on-click-modal="false" width="980" class="reset-el-styte" title="大宗商品场控" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <ctrIndex />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ctrIndex from '../index.vue'
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
