<template>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte"  @close="emit('close', false)" v-model="show" title="修改" :append-to-body="true">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-position="top">
      <el-form-item label="业务权限" prop="enabled" :label-width="formLabelWidth">
        <el-select v-model="form.enabled" class="w-full">
          <el-option label="正常" :value="true" />
          <el-option label="限制" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现权限" prop="withdauth" :label-width="formLabelWidth">
        <el-select v-model="form.withdauth" class="w-full">
          <el-option label="正常" :value="true" />
          <el-option label="限制" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="登陆权限" prop="locked" :label-width="formLabelWidth">
        <el-select v-model="form.locked" class="w-full">
          <el-option label="正常" :value="false" />
          <el-option label="限制" :value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
        <el-input v-model="form.remarks" placeholder="请输入备注"  show-word-limit type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="emit('close')">取消</el-button>
        <el-button type="primary" class="default_btn" @click="submit" :loading="isLoading"> 修改 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { apiUserEdit,apiUser } from '/@/api/modules/business/player.api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editInfo: {
    type: Object,
    default: () => {},
  },
})

const ruleForm = ref('')
const isLoading = ref(false)
const show = ref(false)
const partyid = computed(() => props.editInfo.partyid);

const trigger = ['blur', 'change']
const rules = {
  enabled: [{ required: true, message: '', trigger }],
  withdauth: [{ required: true, message: '', trigger }],
  locked: [{ required: true, message: '', trigger }]
}
const form = reactive({
  enabled: null,
  withdauth: null,
  locked: null,
  remarks:''
})
const init = () => {
  apiUser({ partyid: props.editInfo.partyid }).then(res => {
    const {enabled,withdauth,locked,remarks} = res;
    form.enabled=enabled;
    form.withdauth=withdauth;
    form.locked=locked;
    form.remarks=remarks;
  })
}
init();
const emit = defineEmits(['close', 'success'])

watch(
  () => props.visible,
  val => {
    show.value = val
  },
  { immediate: true }
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

const formLabelWidth = ref(70)

const submit = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true;
      let {enabled,withdauth,locked,remarks} = form; 
      apiUserEdit({ enabled,withdauth,locked,remarks, partyid: partyid.value }).then(() => {
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

</script>

<style lang="scss">

</style>
