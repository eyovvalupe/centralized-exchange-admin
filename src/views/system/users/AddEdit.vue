<template>
  <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" :title="!props.data ? '新增' : '修改'"
    v-model="show" :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" class="pt-[10px]" ref="ruleForm" v-loading="loading">
      <el-form-item label="角色名" required prop="rolename">
        <el-input v-model="form.rolename" autocomplete="off" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="权限" required prop="authtree_ids">
        <div class="w-full">
          <el-transfer v-model="form.authtree_ids" :data="allAuthList" :titles="['可分配', '已分配']" :format="{
            noChecked: ' ',
            hasChecked: ' ',
          }" :props="{
              key: 'id',
              label: 'label',
            }">
            <template #left-footer>
              <el-button class="w-[48px] mb-1" size="small" @click="transData('left')">
                <el-icon color="#000" size="16px">
                  <DArrowLeft />
                </el-icon>
              </el-button>
            </template>
            <template #right-footer>
              <el-button class="w-[48px] mb-1" size="small" @click="transData('right')">
                <el-icon color="#000" size="16px">
                  <DArrowRight />
                </el-icon>
              </el-button>
            </template>
          </el-transfer>
          <div class="clearfix"></div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" placeholder="备注信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button class="w-[98px]" round  @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="w-[98px]" round  @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiAdd, apiEdit, apiAuthTree } from '/@/api/modules/system/index.api'
import { generateRandomPassword } from '/@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'

const props = defineProps({
  title: { // 弹窗类型
    type: String,
    default: 'add'
  },
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const formLabelWidth = ref(100)
const loading = ref(true)
const isLoading = ref(false)
const show = ref(true) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref(false)

const form = reactive({
  rolename: '',
  authtree_ids: [],
  googlecode: '',
  remarks: ''
})
const allAuthList = ref([]);
apiAuthTree({ roleid: props.data?.roleid }).then(res => {
  res.forEach(item => {
    if (item.auth) {
      form.authtree_ids.push(item.id);
    }
  });
  allAuthList.value = res;
  loading.value = false;
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
})
const trigger = ['blur', 'change']

const rules = {
  rolename: [{ required: true, message: '', trigger }],
  authtree_ids: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
const handleGoogle = () => {
  if (!form.authtree_ids.length) {
    ElMessage.error('请设置拥有权限')
    return
  }
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true;
    }
  })
}
// 新增
const handleSubmit = async (googlecode) => {

  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = false;
      form.googlecode = googlecode;
      submit()
    }
  })
}

const submit = async () => {
  // 发送请求
  const api = !props.data ? apiAdd : apiEdit
  isLoading.value = true
  try {
    const send = { ...form };
    if (props.data && props.data.roleid) {
      send.roleid = props.data.roleid;
    }
    send.authtree_ids = form.authtree_ids.join(',');
    const result = await api(send)
    ElMessage({
      type: 'tips',
      message: !props.data ? '新增成功' : '修改成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
const transData = (type) => {
  if (type == 'left') {
    allAuthList.value.forEach(item => {
      form.authtree_ids.push(item.id)
    })

  } else {
    form.authtree_ids = []
    form.authtree_ids.forEach(item => {
      allAuthList.value.push(item.id)
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
