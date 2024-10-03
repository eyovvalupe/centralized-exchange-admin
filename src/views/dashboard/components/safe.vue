<template>
  <div class="flex justify-end reset-el-styte">
    <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
      v-loading="isLoading">
      <el-table-column v-for="(item, index) in columnBase" :key="index" :label="item.label" :width="item.width"
        :align="item.align">
        <template #default="scope">
          <span v-if="['uid', 'username'].includes(item.prop)">
            {{ scope.row[item.prop] }}
          </span>
          <span v-else-if="item.prop == 'created'">
            {{ dayjs(scope.row[item.prop]).format('MM-DD hh:mm:ss') }}
          </span>
          <span v-else-if="item.prop == 'role'">
            {{ roleOptions[scope.row[item.prop]] || '' }}
          </span>
          <span v-else-if="item.prop === 'category'">
            {{ scope.row[item.prop] == 'operate' ? '操作' : '安全' }}
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
</template>

<script setup>
import { getList } from '/@/api/modules/system/log.api'
import { ref, defineProps,toRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { copy } from '/@/utils'
const prop = defineProps(['times'])
const tableData = ref([]);
const searchForm = reactive({
  start_time: '',
  end_time: ''
})
const roleOptions = { user: '真实用户', guest: '模拟用户' };
const columnBase = ref([
  { prop: 'uid', label: 'UID', width: 100, align: 'center' },
  { prop: 'username', label: '用户名', width: 120, align: 'center' },
  { prop: 'category', label: '状态', width: 100, align: 'center' },
  { prop: 'role', label: '用户', align: 'center', width: 100, },
  { prop: 'log', label: '日志', align: 'left' },
  { prop: 'operator', label: '操作者', width: 120, align: 'center' },
  { prop: 'created', label: '时间', width: 130, align: 'center' }
])

const isLoading = ref(false)
const getDataList = () => {
  isLoading.value = true
  const send = {...toRaw(searchForm),page:1};
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
watch(() => prop.times, (val) => {
  if (val && val.length) {
    searchForm.start_time = val[0];
    searchForm.end_time = val[1];
    getDataList();
  }
}, { immediate: true })
</script>