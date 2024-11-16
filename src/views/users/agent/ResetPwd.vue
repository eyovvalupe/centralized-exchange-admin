<template>
   <el-dialog :close-on-click-modal="false" width="480"  class="reset-el-styte" title="重置密码" v-model="show" :append-to-body="true" @close="emit( 'close', false )">
    <el-form :model="form" class="pt-[10px]" label-position="top"  :rules="rules" ref="ruleForm">
      <el-form-item label="密码"  :label-width="formLabelWidth" prop="password">
        <div class="w-full flex justify-between content-center">
          <el-input v-model="form.password" disabled  autocomplete="off" class="pwd-last w-10/12" placeholder="重置初始登录密码">
          <template #append>
            <div class="absolute left-0 top-0 w-full h-full z-10" @click="copy(form.password)"></div>
            <el-icon color="#014CFA" size="18px"><CopyDocument /></el-icon>
          </template>
          </el-input>
          <el-button type="primary" class="ml-[10px] btn-large" @click="setRandomPwd">重新生成</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="py-[10px] pr-[10px]">
        <el-button round class="w-[98px]"  @click="emit( 'close', false )">取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleGoogle"  :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
        <GoogleVerify  class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
      </el-dialog>
</template>

<script setup>
import { apiResetPwd } from '/@/api/modules/business/agents.api'
import { generateRandomPassword ,copy} from '/@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps( {
  data : { // 行数据
    type : Object,
    default : () => ( {} )
  }
} )

const ruleForm = ref( null )

const formLabelWidth = ref( 100 )
const isLoading = ref( false )

const show = ref( true ) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref( false )

const form = reactive( {
  password :  generateRandomPassword(),
  googlecode : '', 
  partyid: ''
})
onMounted(()=>{
  for(const key in form){
     if(props.data[key] !== undefined){
      form[key] = props.data[key]
     }
  }
})
const trigger = ['blur', 'change']

const rules = {
  // password : [{ required : true, message : '', trigger }]
  // remarks : [{ required : true, message : '请输入备注', trigger }]
}

const emit = defineEmits( ['close', 'success'] )
const setRandomPwd=()=>{
  form.password = generateRandomPassword();
}
const handleGoogle=()=>{
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      showGoogle.value =true;
     }
  } )
}
// 新增
const handleSubmit = async (googlecode) => {
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      showGoogle.value =false;
      form.googlecode = googlecode;
      submit()
     }
  } )
}

const submit = async () => {
// 发送请求
  isLoading.value = true
  try {
    const send = {partyid : props.data.partyid ,...form}
    const result = await apiResetPwd(send)
    ElMessage({
      type: 'tips',
      message: '重置成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', {reload:true} )
  } catch ( error ) {
    isLoading.value = false
  }
}
</script>
