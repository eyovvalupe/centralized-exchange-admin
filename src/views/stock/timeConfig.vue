<template>
    <div class="px-[20px] py-[10px]">
     <div class="flex reset-el-style-v2 justify-between">
 
       <div class="flex items-center">
         <el-radio-group v-model="tabPosition" @change="tabChange">
           <el-radio-button label="stockManage">股票管理</el-radio-button>
           <el-radio-button label="stockTimeConfig">市场休市配置</el-radio-button>
         </el-radio-group>
         <el-button type="primary" class="ml-[10px]" plain @click="showDialog(null, 'showCfgDialog')">交易参数配置</el-button>
       </div>
 
       <div>
       </div>
       
     </div>
     <div class="py-[10px]">
       <el-table :data="tableData" border class="mb-[10px]" :class="tableData.length ? '' : 'noborder'"
         v-loading="isLoading">
         <el-table-column v-for="(item, index) in columnBase" :min-width="item.minWidth" :key="index" :width="item.width" :label="item.label"
           :align="item.align">
           <template #default="scope">
             <span>
               {{ scope.row[item.prop] }}
             </span>
           </template>
         </el-table-column>
         <el-table-column label="操作" :min-width="gw(140)" align="center">
           <template #default="scope">
             <span class="flex justify-center align-middle">
               <el-button link class="underline"  size="default" type="primary" @click="openTimeDialog(scope.row.market)">修改</el-button>
             </span>
           </template>
         </el-table-column>
         <template v-slot:empty>
           <el-empty class="nodata" description="暂无数据" />
         </template>
       </el-table>
     </div>
   </div>
   <Config v-if="dialogType.showCfgDialog" :data="dialogType.info" @close="closeDialogType" />
   <ConfigTime :market="market" :title="countryTitleMap[market]" v-if="dialogType.showTimeDialog" :data="dialogType.info" @close="closeDialogType" />
 </template>
 
 <script>
 export default { name: 'stockTimeConfig' };
 </script>
 <script setup>
 import { ref, reactive, onMounted, computed, nextTick } from 'vue'
 import Config from './components/Config.vue'
 import ConfigTime from './components/ConfigTime.vue'
 import { useRouter } from 'vue-router'
 import { apiTimeConfig } from  '/@/api/modules/stock/index.api'
 const router = useRouter()
 
 const tabPosition = ref('stockTimeConfig')
 const tabChange = ()=>{
   router.replace({
     name:tabPosition.value
   })
 }
 
 const market = ref("us")
 
 const tableData = ref([]);

 const dialogType = reactive({
   showCfgDialog: false,
   showTimeDialog: false,
   info: null
 })

 const countryTitleMap = ref({
   us:"美国",
   japan:"日本",
   india:"印度",
   korea:"韩国",
   germany:"德国",
   uk:"英国",
   singapore:"新加坡",
   hongkong:"香港",
   malaysia:'马来西亚'
 })
 
const getDataList = ()=>{
    apiTimeConfig({
        market:''
    }).then(res=>{
        const data = []
        Object.keys(countryTitleMap.value).map(k=>{
            let curritem = {}
            if(res && res.length){
                res.map(item=>{
                    
                    if(item.market == k){
                        curritem = item
                    }
                })
            }
          
            data.push({
                market:k,
                name:countryTitleMap.value[k],
                ...curritem
            })
            tableData.value = data
        })
       
    })
   
}
getDataList()

 const gw = (w)=>{
   return Math.round(1400/1920 * w)
 }
 const columnBase = ref([
   { prop: 'name', label: '市场', align: 'center',minWidth:gw(200) },
   { prop: 'closeddates', label: '休市日期', align: 'center',minWidth:gw(400) }
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
 
 const openTimeDialog = (_market)=>{
   market.value = _market
   showDialog(null,'showTimeDialog')
 }
 
 const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}

 </script>