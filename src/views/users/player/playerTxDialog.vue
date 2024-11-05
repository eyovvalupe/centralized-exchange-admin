<template>
   <el-dialog :close-on-click-modal="false" width="500"  @close="emit('close', false)" class="reset-el-styte" v-model="show" title="提现限制" :append-to-body="true" @open="open">
    <el-form :model="form" label-position="top" class="pt-[10px]" ref="ruleForm" :rules="rules">
      <el-form-item label="流水限制" prop="limit">
        <el-input v-model.number="form.limit" placeholder="请输入限制金额">
          <template #append>
            USD
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="text-xs text-[#999]">
      <span class="block mb-2">* 流水限制大于0时，用户无法提现 </span>
      <span>* 用户通过业务下单，增加流水金额，限制扣减为0时，恢复提现权限</span>
    </div>
    <template #footer>
      <div class="p-[10px] pt-[30px]">
        <el-button round class="w-[98px]" @click="show = false"> 取消 </el-button>
        <el-button type="primary" round class="w-[98px]" @click="submit" :loading="isLoading"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { apiSetlimit } from '/@/api/modules/business/player.api'
import { getGlobalWallet } from '/@/api/modules/base.api'
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
  limit: ''
})
const rules = {
  limit: [{ required: true, message: '', trigger }]
}
const submit = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true;
      apiSetlimit({ limit: form.limit, partyid: partyid.value }).then(() => {
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
      form.limit = props.editInfo.limit
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => show,
  val => {
    if (!val.value) {
      emit('close', false)
    }
  },
  { deep: true }
)
const open = () => {
  ruleForm.value.clearValidate()
}

</script>

<style lang="scss"></style>
