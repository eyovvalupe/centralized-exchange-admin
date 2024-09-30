<template>
   <el-dialog :close-on-click-modal="false" width="380" class="reset-el-styte" title="银行卡设置" v-model="show" :append-to-body="true"
    @close="emit('close')">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
      <el-form-item label="银行" required prop="bank_name">
        <el-input v-model="form.bank_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="卡号" prop="bank_card_number">
        <el-input v-model="form.bank_card_number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="账号" prop="account_name">
        <el-input v-model="form.account_name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close')">取消</el-button>
        <el-button type="primary" class="default_btn" :loading="isLoading" @click="handleSubmit">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiSetBank } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const isLoading = ref(false)
const show = ref(true)

const form = reactive({
  bank_name: '',
  bank_card_number: '',
  account_name: ''
})
const trigger = ['blur', 'change']
const rules = {
  bank_name: [{ required: true, message: '', trigger }],
  bank_card_number: [{ required: true, message: '', trigger }],
  account_name: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true
      try {
        const send = { ...form, order_no: props.data.order_no };
        await apiSetBank(send)
        isLoading.value = false
        emit('close', { reload: true })
      } catch (error) {
        isLoading.value = false
      }
    }
  })
}

</script>