<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" :title="`修改${text}`" v-model="dialogShow" :append-to-body="true" @close="emit('close')">
    <el-form ref="ruleForm" label-position="top" class="pt-[10px]" :model="form" :size="size" :rules="rules">
      <!-- <el-form-item :label="`原${text}`" :label-width="formLabelWidth" required prop="oldPwd">
        <el-input v-model="form.oldPwd" type="password" autocomplete="off" show-password :placeholder="`原${text}`" />
      </el-form-item> -->
      <el-form-item label="新密码" :label-width="formLabelWidth" required prop="newPwd">
        <el-input v-model="form.newPwd" type="password" autocomplete="off" show-password :placeholder="`请输入新的${text}`" />
      </el-form-item>
      <el-form-item :label="`确认密码`" :label-width="formLabelWidth" required prop="confirmPwd">
        <el-input
          v-model="form.confirmPwd"
          type="password"
          autocomplete="off"
          show-password
          :placeholder="`确认${text}`"
        />
      </el-form-item>
       <el-dialog :close-on-click-modal="false" title="操作者验证" v-if="show" v-model="show" width="350">
        <!-- <el-form ref="verifyForm" :model="form" :rules="verifyRules">
          <el-form-item :label="`Google验证码`" :label-width="formLabelWidth" required prop="googleVerify">
            <el-input
              v-model="form.googleVerify"
              type="password"
              autocomplete="off"
              show-password
              :placeholder="`Google验证码`"
            />
          </el-form-item>
        </el-form> -->
        <GoogleVerify @confirm="update" @close="show=false;" />
        <!-- <template #footer>
          <p>
            <el-button @click="$emit('close')">取消</el-button>
            <el-button type="primary" @click="update" :loading="isLoading">确定修改</el-button>
          </p>
        </template> -->
      </el-dialog>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button @click="$emit('close')" class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="showInnerDialog" :loading="isLoading">确定修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup async>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import GoogleVerify from '/@/components/googleVerify/index.vue'
import { useTableList } from '/@/hooks/store.hook'
import { updatePwd,updateSw } from '/@/api/modules/login.api'

const { size } = await useTableList()
const ruleForm = ref('')

const text = computed(() => (props.action === 'loginPassword' ? '登陆密码' : '交易密码'))

const props = defineProps({
  action: {
    // 弹窗类型
    type: String,
    default: 'loginPassword',
  },
  dialogShow: {
    type: Boolean,
    default: false,
  },
})

const showInnerDialog = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      if(form.confirmPwd !== form.newPwd){
        ElMessage.warning('两次密码不一致')
        return
      }
      show.value = true
    }
  })
}

const dialogShow = computed({
  get: () => props.dialogShow,
  set: val => emit('close', val),
})

const trigger = ['blur', 'change']
const rules = {
  newPwd: [{ required: true, message: `请输入${text.value}`, trigger }],
  confirmPwd: [{ required: true, message: `请再次输入${text.value}`, trigger }],
  googleVerify: [{ required: true, message: '请输入Google验证码', trigger }],
}

const verifyRules = {
  googleVerify: [{ required: true, message: '请输入Google验证码', trigger }],
}

const show = ref(false)

const isLoading = ref(false)

const formLabelWidth = ref(85) // 表单label宽度

const form = reactive({
  newPwd: '',
  confirmPwd: '',
  googleVerify: '',
})

const emit = defineEmits(['close', 'success'])
// 更新页面
const update = googlecode => {
  show.value = false
  ruleForm.value.validate(async valid => {
    if (valid) {
      // 发送请求
      const api = props.action === 'loginPassword' ? updatePwd : updateSw
      isLoading.value = true
      try {
        const send={googlecode}
        if(props.action === 'loginPassword'){
          send.password = form.newPwd;
        }else{
          send.safeword = form.newPwd;
        }
        const result = await api(send);
        ElMessage({
          type: 'tips',
          message: props.action === 'add' ? '新增成功' : '修改成功',
          offset: 200
        })
        isLoading.value = false
        emit('close')
      } catch (error) {
        isLoading.value = false
      }
    }
  })
}

// // 新增
// const handleAdd = async() => {
//   if ( props.action === 'add' ) { // 新增
//     if ( !form.name ) {
//       ElMessage.warning( '请输入代理名称' )
//       return
//     }
//     if ( !form.loginName ) {
//       ElMessage.warning( '请输入登录用户名' )
//       return
//     }
//   }
//   if ( !form.remarks ) {
//     ElMessage.warning( '请输入备注' )
//     return
//   }
//   // 发送请求
//   const api = props.action === 'add' ? apiAddAgent : apiEditAgent
//   isLoading.value = true
//   try {
//     const result = await api( form )
//     ElMessage.success( props.action === 'add' ? '新增成功' : '修改成功' )
//     isLoading.value = false
//     emit( 'success', false )
//   } catch ( error ) {
//     isLoading.value = false
//   }
// }
</script>
