<template>
  <div>
    <div class="flex">
      <el-button type="primary" size="default" class="w-[80px]" @click="showDialog(null, 'showDialog')">新增</el-button>
    </div>
    <div class="py-[10px] reset-el-style-v2">
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <span v-if="item.prop === 'unit'">
              {{ options[scope.row[item.prop]] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="gw(165)" align="center">
          <template #default="scope">
            <div class="flex justify-between items-center w-full relative">
              <div class="flex items-center justify-center flex-1 px-[21px]">
                <el-button class="underline" size="default" link type="primary" @click="showDialog(scope.row, 'showDialog')">修改</el-button>
              </div>
              <el-dropdown class="!absolute right-[5px] top-[1px] w-[16px] h-[16px]">
                <img class="w-[16px] h-[16px]" src="/src/assets/images/more.svg" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(scope.row)">
                      <el-icon :size="18">
                        <Delete />
                      </el-icon> <span class="ml-1">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
     
    </div>
    
  </div>
  <TimeEdit v-if="dialogType.showDialog" :data="dialogType.info" @close="closeDialogType" />
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="dialogType.showGoogle" width="320" @close="closeDialogType">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="closeDialogType" v-if="dialogType.showGoogle" />
  </el-dialog>
</template>

<script setup>
import { getList, apiDel } from '/@/api/modules/time'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import TimeEdit from './components/TimeEdit.vue'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:contract', () => {
  getDataList()
})
const dialogType = reactive({
  showDialog: false,
  showGoogle: false,
  info: null
})
const currentPage = ref(1)
const currentLastPage = ref(1)
const options = { s: '秒', m: '分钟', h: '小时', d: '天' }

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
  { prop: 'time', label: '时间', align: 'center',minWidth:gw(165) },
  { prop: 'unit', label: '时间单位', align: 'center',minWidth:gw(165) },
  { prop: 'rangereturn', label: '盈亏范围(%)', align: 'center',minWidth:gw(165) },
])
const isLoading = ref(false)
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  getList(send)
    .then(res => {
      isLoading.value = false
      if (!res || !res.length && currentLastPage.value > 1) {
        currentLastPage.value = currentPage.value;
        ElMessage({
          offset: 200,
          message: '已是最后一页',
          type: 'tips'
        })
        return;
      }
      currentPage.value = currentLastPage.value;
      tableData.value = res || []
    })
    .finally(() => {
      isLoading.value = false
    })
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
const handleSubmit = async (googlecode) => {
  ElMessageBox.confirm(`确定删除`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    isLoading.value = true
    dialogType.showGoogle = false
    apiDel({ id: dialogType.info.id, googlecode }).then(() => {
      closeDialogType({ reload: true })
      ElMessage({
        type: 'tips',
        message: '删除成功',
        offset: 200
      })
    }).finally(() => {
      isLoading.value = false
    })
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`删除会清空所有行情数据，且无法恢复`, `确定删除吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    dialogType.info = row;
    dialogType.showGoogle = true;
  })
}
getDataList();
</script>