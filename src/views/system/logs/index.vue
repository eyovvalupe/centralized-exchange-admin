<template>
  <div>
    <div class="flex justify-end p-2 reset-el-styte">
       <div></div>
       <div class="flex">
        <!-- <el-input v-model="searchForm.log" class="mr-2" clearable placeholder="日志内容"  style="width: 200px;"/> -->
            <el-input v-model="searchForm.operator" class="mr-2" clearable placeholder="操作者"  style="width: 150px;"/>
              <el-date-picker v-model="searchForm.start_time" :disabled-date="disabledStart" type="date" style="width: 160px;"
                placeholder="开始时间" />
              <el-date-picker v-model="searchForm.end_time" :disabled-date="disabledEnd" type="date" class="ml-2"  style="width: 160px;"
                placeholder="结束时间" />
        <el-button type="primary" class="ml-2" :icon="Search" @click="getDataList(1)"
          :loading="isLoading">搜索</el-button>
       </div>
    </div>
    <div>
      <el-table :data="tableData" :border="tableData.length" :class="tableData.length?'':'noborder'" v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :label="item.label"  :width="item.width"
          :align="item.align">
          <template #default="scope">
            <span v-if="['uid','username'].includes(item.prop)">
                 {{ scope.row[item.prop] }}
                </span>
            <span v-else-if="item.prop == 'created'">
              {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
            </span>
            <span v-else-if="item.prop == 'role'">
              {{ roleOptions[scope.row[item.prop]] || '' }}
            </span>
            <span v-else-if="item.prop==='category'" >
              {{ scope.row[item.prop]=='operate'?'操作':'安全' }}
            </span>
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
</template>

<script setup>
import { getList } from '/@/api/modules/system/log.api'
import { ref, toRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { copy } from '/@/utils'

const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:OperationLog', () => {
  getDataList()
})
const searchForm = reactive({
  query: '',
  start_time: '',
  end_time: ''
})
const roleOptions = {user:'真实用户',guest:'模拟用户'};
const columnBase = ref([
  { prop: 'uid', label: 'UID', width:100, align: 'center' },
  { prop: 'username', label: '用户名', width:130,  align: 'center' },
  { prop: 'category', label: '状态', width:100,  align: 'center' },
  { prop: 'role', label: '用户', align: 'center' ,width:100,},
  { prop: 'log', label: '日志', align: 'left' },
  { prop: 'operator', label: '操作者',width:120, align: 'center' },
  { prop: 'created', label: '时间', width:130, align: 'center' }
])

const isLoading = ref(false)
const disabledStart = (time) => {
  return time.getTime() >= Date.now()
}
const disabledEnd = (time) => {
  return time.getTime() < Date.now()
}
const getDataList = (page) => {
  isLoading.value = true
  const send = toRaw(searchForm);
  if (searchForm.end_time) {
    send.start_time = dayjs(searchForm.start_time).format('YYYY-MM-DD')
  }
  if (searchForm.end_time) {
    send.end_time = dayjs(searchForm.end_time).format('YYYY-MM-DD')
  }
  getList(send)
    .then(res => {
      isLoading.value = false
      tableData.value = res || []
    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList();
</script>