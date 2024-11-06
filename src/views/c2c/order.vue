<template>
 <div class="px-[30px] py-[10px]">
    <div class="flex justify-between reset-el-style-v2">
      <div class="flex items-center">
        <el-radio-group v-model="tabPosition" @change="tabChange">
          <el-radio-button label="c2cOrderWs">未处理订单</el-radio-button>
          <el-radio-button label="c2cOrder">历史订单</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex items-center">
        
        <div class="w-[264px] ml-[10px]">
          <el-input v-model="searchForm.params" ref="searchInput" suffix-icon="search" placeholder="UID/用户名/备注" />
        </div>
        <el-button type="primary" class="w-[120px] ml-[10px]" @click="getDataList(1)"
          :loading="isLoading">查询</el-button>
      </div>

    </div>
    <div class="py-[10px]  reset-el-style-v2"> 
      <div class="order-list">
        <div class="w-3/12 float-left" v-for="(item,i) in tableData" :key="i">
          <div class="order-item">
            <div class="flex order-item-bt">
              <div class="order-item-left">
                UID:{{item.uid}}
              </div>
              <div class="order-item-right">
                <div class="flex justify-between">
                  <div>{{item.order_no}}</div>
                  <div>{{ statusObj[item.status] }}</div>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="order-item-left">
                <div>用户名</div>
                <div class="mt-[6px]"><span class="cursor-pointer text-[#4377FE] underline" @click="showDialog(scope.row, 'showInfoDialog')">125151@qq.com</span></div>
              </div>
              <div class="order-item-right">
                <div class="flex justify-between">
                  <div>
                    <div class="order-item-right__buy flex items-center">买入 {{item.crypto}}<img class="w-[16px] h-[16px] ml-[6px] rounded" :src="`/images/crypto/${item.crypto.toUpperCase()}.png`" :alt="item.crypto.toUpperCase()"></div>
                    <div class="mt-[3px]">价格 {{item.price}} {{item.currency}}</div>
                    <div class="mt-[3px]">数量 {{item.volume}} {{item.crypto}}</div>
                  </div>
                  <div  class="order-item-right__amount">{{item.offset == 'buy' ? '-' : '+'}}{{item.totalprice}} <span>{{item.currency}}</span></div>
                </div>
              </div>
            </div> 
            
          </div>
        </div>

      </div>
      <el-table :data="tableData" border :class="tableData.length ? '' : 'noborder'"
        v-loading="isLoading">
        <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
          :align="item.align">
          <template #default="scope">
            <template v-if="item.prop === 'uid'">
              <span class="truncate cursor-pointer" @click="copy(scope.row[item.prop])"> {{
                scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'offset'">
              <span class="status-bg" :class="scope.row[item.prop]">
                {{ offsetObj[scope.row[item.prop]] }}
              </span>
            </template>
            <template v-else-if="item.prop === 'crypto'">
              <div class="money-class">
                <img :src="`/images/crypto/${scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop].toUpperCase()">
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </template>
            <template v-else-if="item.prop === 'currency'">
              <div class="money-class">
                <img :src="`/images/crypto/FIAT_${scope.row[item.prop].toUpperCase()}.png`" :alt="scope.row[item.prop].toUpperCase()">
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </template>
            <template v-else-if="item.prop === 'totalprice'">
              <span class="text-red">
                {{ scope.row[item.prop] }}
              </span>
            </template>
            <span v-else-if="item.prop === 'username'">
              <span class="underline cursor-pointer text-[#4377FE]" @click="showDialog(scope.row, 'showInfoDialog')">{{
                scope.row[item.prop] }}
              </span>
            </span>
            <span v-else-if="item.prop === 'status'" class="status-bg"
              :class="scope.row['status'] == 'done' ? 'buy' : scope.row['status']">
              {{ statusObj[scope.row[item.prop]] }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <span class="flex justify-center align-middle">
              <!-- :disabled="scope.row['status']=='done'" -->
              <el-button link :type="scope.row['status'] !== 'done' && checkAuthCode(12101) ? 'primary' : ''"
                :disabled="!checkAuthCode(12101)" @click="showDialog(scope.row, 'showOrderInfo')">业务操作</el-button>
            </span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty class="nodata" description="暂无数据" />
        </template>
      </el-table>
     
    </div>
    <div class="pb-[10px]">
       <Pagination @changePage="getDataList" v-if="tableData.length" :currentPage="currentLastPage" />
    </div>
  </div>
  <userDetail v-if="dialogType.showInfoDialog && dialogType.info" :partyid="dialogType.info.partyid"
    @close="closeDialogType" />
  <OrderInfo v-if="dialogType.showOrderInfo" :data="dialogType.info" @close="closeDialogType" />
</template>

<script>
export default { name: 'c2cOrder' };
</script>
<script setup>
import { getList } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { copy } from '/@/utils'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import userDetail from '/@/components/userDetail/index.vue'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useAppStore } from '/@/store'
import { useRouter } from 'vue-router'
import OrderInfo from './components/OrderInfo.vue'
import { hex_md5 } from '/@/utils/md5'
const router = useRouter()

const tabPosition = ref('c2cOrder')
const tabChange = ()=>{
  router.replace({
    name:tabPosition.value
  })
}

const appStore = useAppStore()
const offsetObj = {
  buy: '买入',
  sell: '卖出'
}
const statusObj = {
  'waitpayment': '等待付款',
  'waitconfirm': '等待确认',
  'done': '已完成',
  'cancel': '已取消'
}
const tableData = ref([]);
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:c2corder', () => {
  getDataList()
})
const dialogType = reactive({
  showOrderInfo: false,
  showInfoDialog: false,
  info: null
})
const searchForm = reactive({
  params: ''
})
const currentPage = ref(1)
const currentLastPage = ref(1)

const columnBase = ref([
  { prop: 'uid', label: 'UID', align: 'center' },
  { prop: 'order_no', label: '订单号', align: 'center', width: 180 },
  { prop: 'username', label: '用户名', align: 'center', width: 130 },
  { prop: 'offset', label: '方向', align: 'center' },
  { prop: 'crypto', label: '加密货币', align: 'center' },
  { prop: 'currency', label: '计价法币', align: 'center' },
  { prop: 'price', label: '价格', align: 'center' },
  { prop: 'volume', label: '数量', align: 'center' },
  { prop: 'totalprice', label: '总价', align: 'center' },
  { prop: 'status', label: '状态', align: 'center' },
  { prop: 'date', label: '时间', align: 'center' },
])
const isLoading = ref(false)
const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({ id: 1 }, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
const getDataList = (page) => {
  if (page) {
    currentLastPage.value = page
  }
  isLoading.value = true
  const send = { page: currentLastPage.value };
  if (searchForm.params) {
    send.params = searchForm.params;
  }
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
      tableData.value = res;
    })
    .finally(() => {
      isLoading.value = false
    })
}
getDataList()
</script>

<style lang="scss" scoped>
.order-list{
  margin-left: -20px;
}
.order-item{
  background-color: #F5F7FC;
  border-radius: 16px;
  margin:10px 0 10px 20px;
}
.order-item-left,
.order-item-right{
  color:#666D80;
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.order-item-left{
  width: 30%;
  border-right: 1px solid #ECECEC;
  box-sizing: border-box;
}
.order-item-right{
  flex: 1;
  &__buy{
    font-size: 16px;
    font-weight: 600;
    color:#061023;
  }
  &__amount{
    font-size: 18px;
    color:#061023;
    font-weight: 600;
    display: flex;
    align-items: center;
    span{
      font-size: 12px;
      margin-left: 5px;
      font-weight: normal;
      position: relative;
      top:2px;
    }
  }
}
.order-item-bt{
  border-bottom: 1px solid #ECECEC;
}
</style>