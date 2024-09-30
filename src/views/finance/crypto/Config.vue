<template>
   <el-dialog :close-on-click-modal="false" class="reset-el-styte" width="480" title="加密货币配置" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="pb-5" style="min-height: 150px;" v-loading="loading">
      <div v-show="!loading">
        <el-table border :data="tableDataTmp">
          <el-table-column label="到账确认" align="center">
            <el-switch v-model="isConfirm" size="small" inline-prompt inactive-text="手动" active-text="自动" @change="changeEnabled()" />
          </el-table-column>
          <el-table-column label="说明"  align="center">
            自动确认需要配置VPay
          </el-table-column>
        </el-table>
        <el-table :data="tableData" :border="tableData.length" :class="tableData.length ? '' : 'noborder'"
          v-loading="isLoading">
          <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
            :align="item.align">
            <template #default="scope">
              <span v-if="item.prop == 'enabled'">
                <el-switch v-model="scope.row['enabled']" size="small" inline-prompt inactive-text="禁用" active-text="启用"
                  @change="changeEnabled(scope.row)" />
              </span>
              <!-- <span v-if="item.prop == 'enabled'">
              <el-switch v-model="scope.row['enabled']" size="small" inline-prompt inactive-text="禁用" active-text="启用"  @change="changeEnabled(scope.row)" />
            </span> -->
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <el-empty class="nodata" description="暂无数据" />
          </template>
        </el-table>
      </div>
    </div>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320" @close="getConfig">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { setConfirm, setEnabled, getConfigList } from '/@/api/modules/crypto'
const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const columnBase = reactive([
  { prop: 'currency', label: '币种', align: 'center', },
  { prop: 'network', label: '网络', align: 'center' },
  { prop: 'enabled', label: '状态', width: 90, align: 'center' },
])
const tableDataTmp = ref([1])
const loading = ref(true)
const isLoading = ref(false)
const show = ref(true) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref(false)
const form = ref({
  confirm: '',
  googlecode: '',
})

const emit = defineEmits(['close', 'success'])
const tableData = ref([])
const isConfirm = ref(false)
const getConfig = () => {
  loading.value = true;
  getConfigList().then((res) => {
    const { confirm , list } = res
    isConfirm.value = confirm=='auto';
    tableData.value = list;
    loading.value = false;
  })
}
getConfig();
let apiFuncName;
// 新增
const handleSubmit = async (googlecode) => {
  showGoogle.value = false;
  form.value.googlecode = googlecode;
  submit()
}

const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const send = { ...form.value };
    const result = await apiFuncName(send)
    console.log(result)
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  } finally {
    getConfig();
  }
}

const changeEnabled = (data) => {
  showGoogle.value = true
  if (data) {
    form.value = Object.assign({}, data);
    apiFuncName = setEnabled;
  } else {
    form.value = { confirm: isConfirm.value ? 'auto' : 'manual' };
    apiFuncName = setConfirm;
  }

}
</script>
