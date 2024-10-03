<template>
  <div class="reset-el-styte h-full">
    <el-table :data="tableData" border :class="tableData.length?'':'noborder'" v-loading="isLoading">
            <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
              :align="item.align">
              <template #default="scope">
                <span v-if="item.prop === 'enabled'" :class="scope.row[item.prop] ? '' : 'status-yellow'"
                  class="status-bg cursor-pointer">
                  {{ scope.row[item.prop] ? '正常' : '锁定' }}
                </span>
                <span v-else-if="item.prop === 'uid'" @click="copy(scope.row.uid)"
                  class="cursor-pointer">
                  {{ scope.row[item.prop] }}
                </span>
                <span v-else-if="item.prop == 'sub_net_users'">
                  {{ scope.row['sub_users'] }} / {{ scope.row['net_users'] }}
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
import { getList } from '/@/api/modules/business/agents.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { copy } from '/@/utils'
import { useUserStore } from '/@/store'
const tableData = ref([]);
const userStore = useUserStore()
const username = computed(() => userStore.userInfo.username)
const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center', width: 100 },
  { prop: 'username', label: '用户名', align: 'center', width: 120 },
  { prop: 'sub_net_users', label: '直推/网络', align: 'center', width: 120 },
  { prop: 'deposit', label: '充值', align: 'center', width: 120 },
  { prop: 'withdraw', label: '提现', align: 'center', width: 120 },
  { prop: 'remarks', label: '备注', align: 'center' }])
const isLoading = ref(false)

const getDataList = () => {
  isLoading.value = true
  const send = { page: 1,father: -1};
  getList(send)
    .then(res => {
      isLoading.value = false
      if(!res || !res.length){
        tableData.value = res
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList(); 
</script>