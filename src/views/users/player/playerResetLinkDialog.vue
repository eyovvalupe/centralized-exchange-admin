<template>
  <div>
     <el-dialog :close-on-click-modal="false" width="500"  @close="emit('close', false)" class="reset-el-styte" v-model="show" title="生成重置链接" :append-to-body="true">
      <el-form label-position="top" class="pt-[10px]">
        <el-form-item label="重置链接" v-if="showLink">
          <el-input readonly v-model="link" :prefix-icon="Link">
            <template #suffix>
              <div class="suffix" @click="copy">
                <el-icon class="el-input__icon">
                  <CopyDocument />
                </el-icon>
              </div>
            </template>
          </el-input>
          <span class="txt-gray">30分钟内有效</span>
        </el-form-item>
        <template  v-else>
          <GoogleVerify @confirm="update" v-if="showGoogle" @close="show = false" class="linkGoole" />
        </template>
      </el-form>

      <template #footer>
        <div class="p-[10px]" v-if="!showGoogle">
          <el-button round class="w-[98px]" @click="show = false"> 取消 </el-button>
          <el-button round class="w-[98px]" type="primary" @click="handleReset" :loading="isLoading"> 重置链接 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { apiResetUrl } from '/@/api/modules/business/player.api'
import { ref, watch } from 'vue'
import { CopyDocument, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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

const link = ref('')
const googleVerifCode = ref('')

const showLink = ref(false)
const showGoogle = ref(true)
const show = ref(false)
const isLoading = ref(false)

const emit = defineEmits(['close'])

watch(
  () => props.visible,
  val => {
    show.value = val
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

const copy = () => {
  const inputEle = document.createElement('input')
  inputEle.value = link.value
  document.body.appendChild(inputEle)
  inputEle.select()
  document.execCommand('Copy')
  inputEle.remove()
  ElMessage({
    showClose: true,
    message: '复制成功',
    type: 'success'
  })
}
const update = (val) => {
  googleVerifCode.value = val;
  showLink.value = true;
}

const handleReset = () => {
  isLoading.value = true
  apiResetUrl({ partyId: props.editInfo.partyId + '', googleVerifCode: googleVerifCode.value }).then(res => {
    showLink.value = true
    link.value = res.resetUrl
    isLoading.value = false
    // show.value = false
  }).finally(() => {
    isLoading.value = false
  })
}
</script>

<style lang="scss">
.linkGoole {
   width: 100%;
   margin: 0 auto;
   .input-items{
    margin-bottom: 20px !important;
   }
   
}
</style>
