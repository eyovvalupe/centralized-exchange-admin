<template>
   <el-dialog :close-on-click-modal="false" width="540" class="" v-model="show" title="强行平仓" :append-to-body="true">
    <el-form ref="ruleForm" label-position="top" :model="form" :rules="rules">
      <el-form-item label="平仓数量" prop="volume" label-width="0" required>
        <el-input v-model="form.volume" placeholder="请输入平仓数量" style="width: 100%;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleInnerDialog" :loading="isLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch, computed, defineEmits, defineProps, h } from 'vue'
import { stocksSell } from '/@/api/modules/market/index.api'
import { getSessionToken } from '/@/api/modules/base.api'

const props = defineProps({
  orderNo: {
    type: String,
    default: ''
  }
})
const emit = defineEmits('close')
const ruleForm = ref('')
const isLoading = ref(false)
const show = ref(true)
const trigger = ['blur', 'change']
const rules = {
  volume: [{ required: true, message: '', trigger }]
}
const form = reactive({
  volume: '',
})
const comfirmSubmit = () => {
  ElMessageBox.confirm(h('span', null, [`强平数量:`, h('b', { style: 'color: red' }, form.volume)]), '确定要强平吗？', {
    customClass: 'transTop320',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      isLoading.value = true
      const token = await getSessionToken()
      stocksSell({
        order_no: props.orderNo,
        ...form,
        token
      }).then(res => {
        ElMessage({
          type: 'tips',
          message: '操作成功',
          offset: 200
        })
        emit('close', { reload: true })
      }).finally(() => {
        isLoading.value = false
      })
    })
    .catch(() => { })
}
// 显示弹框
const handleInnerDialog = () => {
  ruleForm.value.validate(valid => {
    if (valid) {
      comfirmSubmit();
    }
  })
}
</script>