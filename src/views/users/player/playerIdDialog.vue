<template>
   <el-dialog :close-on-click-modal="false" width="500"  class="reset-el-styte"  @close="emit('close', false)" v-model="show" title="修改实名认证" :append-to-body="true" @open="open">
    <el-form :model="form" label-position="top" class="pt-[10px]" ref="ruleForm" :rules="rules">
      <el-form-item label="实名认证" prop="limit">
        <el-select v-model="form.kyc" placeholder="请选择认证方式" style="width: 100%;">
          <el-option label="未认证" :value="0" />
          <!-- <el-option label="L1认证" :value="1" /> -->
          <el-option label="L2认证" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button round class="w-[98px]" @click="show = false"> 取消 </el-button>
        <el-button type="primary" round class="w-[98px]" @click="submit" :loading="isLoading"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { apiUserKYC } from '/@/api/modules/business/player.api'
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['close', 'success'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editInfo: {
    type: Object,
    default: () => { }
  }
})
const partyid = computed(() => props.editInfo.partyid);
const show = ref(true)
const isLoading = ref(false)

const ruleForm = ref()
const trigger = ['blur', 'change']
const form = reactive({
  kyc: ''
})
const rules = {
  kyc: [{ required: true, message: '', trigger }]
}
const submit = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true;
      apiUserKYC({ kyc: form.kyc, partyid: partyid.value }).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
        })
        emit('success')
      }).finally(() => {
        isLoading.value = false;
      })
    }
  })
}


watch(
  () => props.visible,
  val => {
    show.value = val
    if (val) {
      form.kyc = props.editInfo.kyc
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => show,
  val => {
    if ( !val.value ) {
      emit( 'close', false )
    }
  },
  { deep : true }
)
const open = () => {
  ruleForm.value.clearValidate()
}

</script>

<style lang="scss"></style>
