<template>
   <el-dialog :close-on-click-modal="false" width="520" class="" v-model="show" title="强行平仓" :append-to-body="true">
    <el-form ref="ruleForm" label-position="top" class="pt-[10px]" :model="form" :rules="rules">
      <el-form-item label="平仓数量" prop="volume" label-width="0" required>
        <el-input-number class="input-number" :precision="0" :max="dataInfo.unsold_volume" :controls="false" :min="1" v-model="form.volume" placeholder="请输入平仓数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button round class="w-[98px]" @click="emit('close', false)">取消</el-button>
        <el-button type="primary" round class="w-[98px]" @click="handleInnerDialog" :loading="isLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch, computed, defineEmits, h } from 'vue'
import { blocktradeSell } from '/@/api/modules/blocktrade'
import { getSessionToken } from '/@/api/modules/base.api'

const props = defineProps({
  dataInfo: {
    type: Object,
    default: ()=>({})
  },
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
  volume: props.dataInfo.unsold_volume
})

const comfirmSubmit = () => {
  ElMessageBox.confirm(h('span', null, `当前操作确定？`), '提示', {
    customClass: 'transTop320',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      isLoading.value = true
      let token = '';
      getSessionToken().then((res) => {
        token = res;
        blocktradeSell({
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