<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" v-model="show" title="中签管理" :append-to-body="true">
    <div class="from-info">

      <p><label>认购数量</label><span><b class="h1" style="line-height: 12px;">{{ props.data.volume }}</b></span></p>
      <p><label>杠杆</label>
        <span class="flex">
          <span class="status-bg open plain" v-if="props.data.lever || props.data.lever > 0">x{{ props.data.lever }}</span>
          <span v-else>无</span>
        </span>
      </p>
      <p><label>用户</label><span>{{ props.data.username }}</span></p>
      <p><label>订单号</label><span>{{ props.data.order_no }}</span></p>
      <!-- <p><label>杠杆</label><span class="tag status-yellow" v-if="props.data.lever">x{{  props.data.lever }}</span></p> -->
    </div>
    <el-form ref="ruleForm" label-position="top" :model="form" :rules="rules">
      <el-form-item label="中签数量" prop="winning" label-width="80" required>
        <el-input-number class="input-number" :controls="false" :max="props.data.volume" v-model="form.winning" @input="changeNumber" style="width: 100%;"></el-input-number>
      </el-form-item>
    </el-form>
    <div class="px-2 mb-10">
      <el-slider v-model="winningRatio" @change="changeRatio" :marks="marks" />
    </div>
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
import { getIpoWin } from '/@/api/modules/ipo/index.api'
import { getSessionToken } from '/@/api/modules/base.api'
const props = defineProps({
  data: {
    type: String,
    default: ''
  }
})
const emit = defineEmits('close')
const ruleForm = ref('')
const isLoading = ref(false)
const show = ref(true)
const winningRatio = ref(0)
const trigger = ['blur', 'change']
const rules = {
  winning: [{ required: true, message: '', trigger }]
}
const form = reactive({
  winning: '',
})
const changeRatio = (val) => {
  form.winning = parseInt(props.data.volume * (winningRatio.value / 100))
}
const changeNumber = (val) => {
  winningRatio.value = form.winning / props.data.volume * 100
}
const marks = reactive({
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
})
// 显示弹框
const handleInnerDialog = () => {
  ruleForm.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      const token = await getSessionToken()
      getIpoWin({
        order_no: props.data.order_no,
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
    }
  })
}
</script>
<style lang="scss" scoped></style>