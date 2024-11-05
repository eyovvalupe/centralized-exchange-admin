<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" :title="!props.data?'新增':'修改'" v-model="show" :append-to-body="true" @close="emit( 'close', false )">
    <el-form :model="form" class="pt-[10px]" :rules="rules" label-position="top" ref="ruleForm">
      <el-form-item label="用户名"  required  :label-width="formLabelWidth"  v-if="!props.data" prop="username">
        <el-input v-model="form.username" autocomplete="off" placeholder="登录用户名" />
      </el-form-item>
      <el-form-item label="密码"  :label-width="formLabelWidth"  v-if="!props.data" prop="password">
       <div class="w-full flex justify-between content-center">
        <el-input v-model="form.password" autocomplete="off" disabled class="pwd-last">
          <template #append>
            <el-icon color="#014CFA" size="18px" @click="copy(form.password)"><CopyDocument /></el-icon>
          </template>
          </el-input>
          <el-button type="primary" class="ml-[10px] btn-large" @click="setRandomPwd">重新生成</el-button>
       </div>
      </el-form-item>
      <el-form-item label="代理UID" :label-width="formLabelWidth"  prop="father_uid"  v-if="!props.data">
        <el-input v-model.number="form.father_uid" autocomplete="off" placeholder="不填写则默认为根代理商" />
      </el-form-item>
      <el-form-item label="业务权限"  :label-width="formLabelWidth" prop="enabled">
          <el-select v-model="form.enabled" class="w-full">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
       <el-form-item label="登录权限"  :label-width="formLabelWidth" prop="locked" >
          <el-select v-model="form.locked" class="w-full">
            <el-option v-for="item in statusOptions2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      <el-form-item label="备注"  :label-width="formLabelWidth" >
        <el-input
          v-model="form.remarks"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="py-[10px] pr-[10px]">
        <el-button  class="w-[98px]" round @click="emit( 'close', false )">取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleGoogle"  :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
        <GoogleVerify  class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
      </el-dialog>
</template>

<script setup>
import { apiAddAgent, apiEditAgent } from '/@/api/modules/business/agents.api'
import { generateRandomPassword,copy } from '/@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps( {
  title : { // 弹窗类型
    type : String,
    default : 'add'
  },
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
const statusOptions = [ 
  { value : true, label : '正常' },
  { value : false, label : '锁定' }
]
const statusOptions2 = [ 
  { value : true, label : '锁定' },
  { value : false, label : '正常' }
]

const form = reactive( {
  username : '',
  password : '',
  father_uid : '',
  enabled : true, 
  locked : false, 
  googlecode : '', 
  remarks : ''
} )
onMounted(()=>{
  for(const key in form){
     if(props.data && props.data[key] !== undefined){
      form[key] = props.data[key]
     }
  }
  setRandomPwd();
})
const trigger = ['blur', 'change']
const rules = {
  username : [{ required : true, message : '', trigger }]
}
const setRandomPwd=()=>{
  form.password=generateRandomPassword();
}
const emit = defineEmits( ['close', 'success'] )
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
  const api = !props.data ? apiAddAgent : apiEditAgent
  const sendData={...form};
  if(props.data){
    sendData.partyid=props.data.partyid;
  }
  isLoading.value = true
  try {
    const result = await api(sendData)
    ElMessage({
      type: 'tips',
      message: !props.data ? '新增成功' : '修改成功' ,
      offset: 200
    })
    isLoading.value = false
    emit('close', {reload:true} )
  } catch ( error ) {
    isLoading.value = false
  }
}
</script>
