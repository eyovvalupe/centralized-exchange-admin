<template>
  <div>
     <el-dialog :close-on-click-modal="false" width="640"  @close="emit('close', false)" class="player_add" v-model="show" title="新增演示账号" :append-to-body="true" @open="open">
      <el-form :model="form" class="pt-[10px]" ref="ruleForm" :rules="rules">
        <el-form-item label="玩家名称" prop="nickname" :label-width="formLabelWidth" required>
          <el-input v-model="form.nickname" autocomplete="off" placeholder="玩家名称" />
        </el-form-item>
        <el-form-item label="登录用户名" prop="username" :label-width="formLabelWidth" required>
          <el-input v-model="form.username" autocomplete="off" placeholder="登录用户名" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth" required >
          <el-input v-model="form.password"  autocomplete="off" placeholder="登录密码" disabled/>
        </el-form-item>
        <el-form-item label="代理商UID" prop="uid" :label-width="formLabelWidth">
          <el-input v-model="form.uid" autocomplete="off" placeholder="代理商UID" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
          <el-input
            v-model="form.remarks"
            :autosize="{ minRows: 4, maxRows: 5 }"
            type="textarea"
            placeholder="备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="p-[10px]">
          <el-button  round class="w-[98px]" @click="show = false">取消</el-button>
          <el-button type="primary"  round class="w-[98px]" @click="handleAdd" :loading="isLoading"> 新增 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { apiAddGuestUser } from '/@/api/modules/business/player.api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps( {
  visible : {
    type : Boolean,
    default : false
  }
} )

const show = ref( false )
const isLoading = ref( false )

const formLabelWidth = ref( 110 )

const ruleForm = ref()
const trigger = ['blur', 'change']
const form = reactive( {
  uid : '',
  nickname : '',
  username : '',
  password : Math.random().toString( 36 ).slice( -6 ),
  remarks : ''
} )
const rules = {
  // uid : [{ required : true, message : '请输入上级用户UID', trigger }],
  nickname : [{ required : true, message : '请输入玩家名称', trigger }],
  username : [{ required : true, message : '请输入登录用户名', trigger }],
  password : [{ required : true, message : '请输入登录密码', trigger }]
  // remarks : [{ required : true, message : '请输入备注信息', trigger }]
}

const emit = defineEmits( ['close', 'success'] )

watch(
  () => props.visible,
  val => {
    show.value = val
  },
  { immediate : true, deep : true }
)

watch(
  () => show,
  val => {
    if ( !val.value ) {
      form.uid = ''
      form.nickname = ''
      form.username = ''
      form.password = Math.random().toString( 36 ).slice( -6 )
      form.remarks = ''
      emit( 'close', false )
    }
  },
  { deep : true }
)

const open = () => {
  ruleForm.value.clearValidate()
}

const handleAdd = async () => {
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      ElMessageBox.confirm(
        `确定新增${form.nickname}为演示账号吗`,
        '提示',
        {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'warning'
        }
      )
        .then( () => {
          submit()
        } )
        .catch( () => {
          ElMessage( {
            type : 'info',
            message : '你已取消'
          } )
        } )
    }
  } )
}

const submit = async () => {
  try {
    isLoading.value = true
    await apiAddGuestUser( {
      nickName : form.nickname,
      userName : form.username,
      password : form.password,
      fatherPartyCode : form.uid,
      remarks : form.remarks
    } )
    ElMessage({
      type: 'tips',
      message: '新增成功',
      offset: 200
    })
    isLoading.value = false
    emit( 'success', false )
  } catch ( err ) {
    isLoading.value = false
  }
}
</script>
