<template>
  <div>
    <div class="p-4 pt-0 flex  justify-between">
      <div>
        <span class="text-lg">资金分类统计</span>
        <el-table :data="tableData" border :class="tableData.length?'':'noborder'" :height="height" v-loading="isLoading" class="mt-3">
          <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label"
            :width="item.width" :align="item.align">
            <template #default="scope">
              <span v-if="item.isDate">{{ formatDate(scope.row[item.prop] / 1) }}</span>
              <span v-else-if="item.prop === 'createdTime'">
                {{ transferTime(scope.row[item.prop]) }}
              </span>

              <span v-else-if="item.prop === 'profit'">
                {{ parseFloat(scope.row[item.prop]).toFixed(3) }}
              </span>
              <span v-else-if="item.prop === 'nickName'">
                <span class="underline cursor-pointer text-[#165DFF]" @click="getData(scope.row[item.prop])">{{
                  scope.row[item.prop]
                }}</span>
              </span>
              <span v-else-if="item.prop === 'enabled'" :style="{ color: scope.row[item.prop] ? 'green' : '#ff0000' }">
                {{ scope.row[item.prop] ? '正常' : '锁定' }}
              </span>
              <span v-else-if="item.prop === 'settled'" :style="{ color: scope.row[item.prop] ? 'green' : '#ff0000' }">
                {{ scope.row[item.prop] ? '已结算' : '未结算' }}
              </span>
              <span v-else-if="item.prop === 'usdt'">
                <span class="underline cursor-pointer text-[#165DFF]" @click="onDetail(scope.row)">{{
                  scope.row[item.prop]
                }}</span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
      </div>
      <div>
        <span class="text-lg">游戏分类统计</span>
        <el-table :data="tableData1" border :height="height" v-loading="isLoading" class="mt-3">
          <el-table-column v-for="item in column1" :key="item.prop" :prop="item.prop" :label="item.label"
            :width="item.width" :align="item.align" class="ml-[100px]">
            <template #default="scope">
              <span v-if="item.isDate">{{ formatDate(scope.row[item.prop] / 1) }}</span>
              <span v-else-if="item.prop === 'createdTime'">
                {{ transferTime(scope.row[item.prop]) }}
              </span>

              <span v-else-if="item.prop === 'profit'">
                {{ parseFloat(scope.row[item.prop]).toFixed(3) }}
              </span>
              <span v-else-if="item.prop === 'nickName'">
                <span class="underline cursor-pointer text-[#165DFF]">{{
                  scope.row[item.prop]
                }}</span>
              </span>
              <span v-else-if="item.prop === 'enabled'" :style="{ color: scope.row[item.prop] ? 'green' : '#ff0000' }">
                {{ scope.row[item.prop] ? '正常' : '锁定' }}
              </span>
              <span v-else-if="item.prop === 'settled'" :style="{ color: scope.row[item.prop] ? 'green' : '#ff0000' }">
                {{ scope.row[item.prop] ? '已结算' : '未结算' }}
              </span>
              <span v-else-if="item.prop === 'usdt'">
                <span class="underline cursor-pointer text-[#165DFF]">{{
                  scope.row[item.prop]
                }}</span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
      </div>
      <!-- <Pagination :total="len" :size="pageSize" @changePage="getPlayerList" /> -->
    </div>
  </div>
</template>

<script setup>
import { apiSymbolCategory, apiGameCategory } from '/@/api/modules/userData/index.api'
import { onMounted, watch, ref, nextTick, onBeforeUnmount } from 'vue';
import { useCommonStore } from '/@/store';
import { PAGE_SIZE } from '/@/const/config'
const props = defineProps({

  parameters: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    default: ''
  },
  gameCode: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  }

})
const useCommon = useCommonStore()
// table list
const tableData = ref([])
const tableData1 = ref([])
const isLoading = ref(false)
// table title
const column = reactive([
  { prop: 'symbol', label: '币种', width: 173, align: 'center' },
  { prop: 'deposit', label: '充值', width: 173, align: 'center' },
  { prop: 'gift', label: '彩金', width: 173, align: 'center' },
  { prop: 'withdraw', label: '提现', width: 173, align: 'center' },
  { prop: 'rebate', label: '返水', width: 182, align: 'center' },
])
const column1 = reactive([
  { prop: 'gameCode', label: '游戏', width: 173, align: 'center' },
  { prop: 'symbol', label: '币种', width: 173, align: 'center' },
  { prop: 'betAmount', label: '下注金额', width: 173, align: 'center' },
  { prop: 'betCount', label: '下注次数', width: 173, align: 'center' },
  { prop: 'betProfit', label: '下注收益', width: 182, align: 'center' },
])
// 翻页
const currentPage = ref(1)
onMounted(() => {
  tableData.value = []
  tableData1.value = []
  isLoading.value = true
  nextTick(() => {
    if (props.parameters !== '') {
      apiSymbolCategory({
        pageIndex: currentPage.value,
        parameters: props.parameters,
        symbol: props.symblo,
        // startTime: '',
        // endTime: ''
      }).then(res => {
        const { info } = res
        tableData.value = info || []
      }).finally(() => {
      })
      apiGameCategory({
        pageIndex: currentPage.value,
        parameters: props.parameters,
        gameCode: props.gameCode,
        provider: props.provider,
        // startTime: '',
        // endTime: ''
      }).then(res => {
        const { info } = res

        tableData1.value = info || []
      }).finally(() => {
      })

    }

  })
  isLoading.value = false
})
watch(() => props.parameters, newValue => {
  if (newValue !== '') {
    tableData.value = []
    tableData1.value = []
    isLoading.value = true
    nextTick(() => {
      if (props.parameters !== '') {
        apiSymbolCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          symbol: props.symblo
        }).then(res => {
          const { info } = res
          tableData.value = info || []
        }).finally(() => {
        })
        apiGameCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          gameCode: props.gameCode,
          provider: props.provider,
        }).then(res => {
          const { info } = res

          tableData1.value = info || []
        }).finally(() => {
        })

      }

    })
    isLoading.value = false
  }
})
watch(() => props.provider, newValue => {
  if (newValue) {
    tableData.value = []
    tableData1.value = []
    isLoading.value = true
    nextTick(() => {
      if (props.parameters !== '') {
        apiSymbolCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          symbol: props.symblo
        }).then(res => {
          const { info } = res
          tableData.value = info || []
        }).finally(() => {
        })
        apiGameCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          gameCode: '',
          provider: props.provider,
        }).then(res => {
          const { info } = res

          tableData1.value = info || []
        }).finally(() => {
        })

      }

    })
    isLoading.value = false
  }
})
watch(() => props.gameCode, newValue => {
  if (newValue) {
    tableData.value = []
    tableData1.value = []
    isLoading.value = true
    nextTick(() => {
      if (props.parameters !== '') {
        apiSymbolCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          symbol: props.symblo
        }).then(res => {
          const { info } = res
          tableData.value = info || []
        }).finally(() => {
        })
        apiGameCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          gameCode: props.gameCode,
          provider: '',
        }).then(res => {
          const { info } = res

          tableData1.value = info || []
        }).finally(() => {
        })

      }

    })
    isLoading.value = false
  }
})
watch([() => props.startTime, () => props.endTime], ([newStartTime, newEndTime]) => {
  if (newStartTime || newEndTime) {
    tableData.value = []
    tableData1.value = []
    isLoading.value = true
    nextTick(() => {
      if (props.parameters !== '') {
        apiSymbolCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          symbol: props.symblo,
          startTime: newStartTime,
          endTime: newEndTime
        }).then(res => {
          const { info } = res
          tableData.value = info || []
        }).finally(() => {
        })
        apiGameCategory({
          pageIndex: currentPage.value,
          parameters: props.parameters,
          gameCode: props.gameCode,
          provider: props.provider,
          startTime: newStartTime,
          endTime: newEndTime
        }).then(res => {
          const { info } = res

          tableData1.value = info || []
        }).finally(() => {
        })

      }

    })
    isLoading.value = false
  }

})
// 时间转换
const transferTime = (time) => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`

}

</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.betRecord {
  .el-pager {
    display: none;
  }
}

:deep(.el-input__wrapper) {
  width: 240px !important;
}
</style>
