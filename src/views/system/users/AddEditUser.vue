<template>
   <el-dialog :close-on-click-modal="false" class="reset-el-styte" width="520" :title="!props.data?'新增':'修改'" v-model="show" :append-to-body="true" @close="emit( 'close', false )">
    <el-form :model="form" :rules="rules" ref="ruleForm" v-loading="loading">
      <el-form-item label="用户名"  required  :label-width="formLabelWidth"  prop="username"  v-if="!props.data">
        <el-input v-model="form.username" autocomplete="off" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="密码"  :label-width="formLabelWidth" v-if="!props.data">
        <!-- <el-input v-model="form.password" disabled autocomplete="off" placeholder="生成密码">
          <template #append>
            <el-button link class="btn-last-txt" @click="randomPwd">重新生成</el-button>
          </template>
        </el-input> -->
        <div class="w-full flex justify-between content-center">
        <el-input v-model="form.password" autocomplete="off" disabled class="pwd-last">
          <template #append>
            <el-icon  @click="copy(form.password)"><CopyDocument /></el-icon>
          </template>
          </el-input>
        <el-button type="primary" class="ml-2" @click="randomPwd">重新生成</el-button>
       </div>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth" required prop="roleid">
          <el-select v-model="form.roleid" class="w-full"  placeholder="请选择角色" >
            <el-option v-for="item in allRoleList" :key="item.roleid" :label="item.rolename" :value="item.roleid" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" required prop="locked">
          <el-select v-model="form.locked" class="w-full"  placeholder="请选择状态" >
            <el-option v-for="(item,index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      <el-form-item label="备注"  :label-width="formLabelWidth" >
        <el-input
          v-model="form.remarks"
          :autosize="{ minRows: 2, maxRows: 3 }"
          type="textarea"
          placeholder="备注信息"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit( 'close', false )">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleGoogle"  :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
        <GoogleVerify  class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
      </el-dialog>
</template>

<script setup>
import { apiAdd, apiEdit, apiAllrole,apiUserByid } from '/@/api/modules/system/user.api'
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
const formLabelWidth = ref(70)
const loading = ref( true )
const isLoading = ref( false )
const show = ref( true ) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref( false )
const statusOptions = [
  { value : true, label : '限制' },
  { value : false, label : '正常' }
]
const form = reactive({
  username : '',
  password : generateRandomPassword(),
  roleid : '',
  locked : false,
  googlecode : '', 
  remarks : ''
})
const trigger = ['blur', 'change']
const rules = {
  username : [{ required : true, message : '', trigger }],
  roleid : [{ required : true, message : '', trigger }]
}
const allRoleList=ref([]);
apiAllrole({roleid:props.data?.roleid}).then(res=>{
  allRoleList.value = res;
  loading.value = false;
})
const randomPwd = () => {
  form.password = generateRandomPassword();
}
onMounted(()=>{
  for(const key in form){
     if(props.data && props.data[key] !== undefined){
      form[key] = props.data[key]
     }
  }
})

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
  const api = !props.data ? apiAdd : apiEdit
  isLoading.value = true
  try {
    const send={...form};
    if(props.data&&props.data.partyid){
      send.partyid=props.data.partyid;
    }
    const result = await api(send)
    ElMessage({
      type: 'tips',
      message:  !props.data ? '新增成功' : '修改成功' ,
      offset: 200
    })
    isLoading.value = false
    emit('close', {reload:true} )
  } catch ( error ) {
    isLoading.value = false
  }
}
</script>
