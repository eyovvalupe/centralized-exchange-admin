<template>
  <div>
     <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" v-model="show" title="修改代理" :append-to-body="true">
      <el-form :model="form" ref="ruleForm" label-position="top" :rules="rules">
        <el-form-item label="代理UID" prop="father_uid" :label-width="formLabelWidth">
          <el-input v-model="form.father_uid" placeholder="请输入代理商UID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="show = false"> 取消 </el-button>
          <el-button type="primary" @click="showInnerDialog" :loading="isLoading"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
     <el-dialog :close-on-click-modal="false" title="操作者验证" class="reset-el-styte" v-model="showGoogle" width="320">
        <GoogleVerify @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
      </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { apiUpfather } from '/@/api/modules/business/player.api'
import { apiUpfatherAgent } from  '/@/api/modules/business/agents.api'

const props = defineProps( {
  visible : {
    type : Boolean,
    default : false
  },
  type : {
    type : String,
    default :'agent'
  },
  editInfo : {
    type : Object,
    default : () => {}
  }
} )
const partyid = computed(() => props.editInfo.partyid);
const formLabelWidth = ref( 120 )
const showGoogle = ref( false )
const show = ref( false )
const isLoading = ref( false )

const ruleForm = ref()
const trigger = ['blur', 'change']
const form = reactive( {
  father_uid : ''
} )
const rules = {
  // father_uid : [{ required : true, message : '请输入上级用户的UID号码', trigger }]
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
      emit( 'close', false )
    }
  },
  { deep : true }
)

watch(
  () => props.editInfo,
  val => {
    form.uid = val.fatherUid
  },
  { deep : true }
)
const showInnerDialog = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true
    }
  })
}
const handleSubmit = (googlecode) => {
  isLoading.value = true
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      try {
        const func= props.type==='agent'?apiUpfatherAgent:apiUpfather;
        await func({
          partyid : partyid.value,
          ...form,
          googlecode
        } )
        isLoading.value = false
        show.value = false
          ElMessage({
            type: 'tips',
            message: '操作成功',
            offset: 200
          })
        emit( 'success' )
      } catch ( err ) {
        isLoading.value = false
      }
    } else {
      isLoading.value = false
    }
  } )
}
</script>
