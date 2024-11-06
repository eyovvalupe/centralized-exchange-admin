<template>
    <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="交易密码" :model-value="modelValue" @close="onClose">
        <el-form :model="form" label-position="top" :rules="rules" class="pt-[10px]" ref="ruleForm2">
            <el-form-item label="交易密码" required prop="safeword">
                <el-input ref="input" v-model="form.safeword" type="password" autocomplete="off" placeholder="请输入交易密码" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="p-[10px]">
                <el-button @click="onClose();emit('cancel')" round class="w-[98px]">取消</el-button>
                <el-button type="primary" round class="w-[98px]" @click="handleSubmit">确定 </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps({
    modelValue:Boolean
})
const form = reactive({
  safeword: ''
})
const emit = defineEmits(['submit','cancel','update:modelValue'])
const trigger = ['blur', 'change']
const rules = {
  safeword: [{ required: true, message: '', trigger }]
}
const ruleForm2 = ref(null)
const handleSubmit = async () => {
  ruleForm2.value.validate(valid => {
    if (valid) {
      emit('submit',form.safeword)
      form.safeword = ''
    }
  })
}
const input = ref(null)
onMounted(()=>{
   input.value && input.value.focus()
})
const onClose = ()=>{
    emit('update:modelValue',false)
}
</script>