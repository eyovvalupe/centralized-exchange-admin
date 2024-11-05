<template>
   <el-dialog :close-on-click-modal="false" v-model="dialogType.showDialog" class="reset-el-styte" :loading="dialogLoading" width="700" title="实名认证"
    @close="closeDialogType">
    <div v-loading="dialogLoading" style="max-height:600px;" class="soll-list soll-list-y order-con-ovderhide">
      <template v-if="!dialogLoading">
         <RealnameInfo :src-list="srcList" :detail-data="detailData" />
      </template>
      
    </div>
    
  </el-dialog>
</template>

<script setup>
import RealnameInfo from './components/RealnameInfo'
import { apiEdit, getDetail } from '/@/api/modules/business/kyc.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
const props = defineProps({
  info: {
    type: Object,
    default: () => { id: 0 }
  }
})
const emit = defineEmits('close')
const detailData = ref({})
const srcList = ref([])
const dialogLoading = ref(false)

const dialogType = reactive({
  showDialog: true
})

const showDialog = () => {
  dialogType.showDialog = true;
  dialogLoading.value = true;
  getDetail({ id: props.info.id }).then(res => {
    detailData.value = Object.assign(res, props.info);
    srcList.value = [res.idimg_1, res.idimg_2, res.idimg_3];
  }).finally(() => {
    dialogLoading.value = false;
  })
}
const closeDialogType = () => {
  emit('close');
}

showDialog();

</script>
<style lang="scss" scoped>
.order-con-ovderhide {
  min-height: 300px;
  .title{
    font-size: 16px;
    color:#000;
    line-height: 22px;
  }
  .left-tit{
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    color:#000;
    font-weight: 600;
  }
  .right-img {
    border-radius: 15px;
    width: 100%;
    height: 134px;
    overflow: hidden;
  } 
}
.realname-info{
  background-color: #F5F7FC;
  padding: 11px 20px;
  border-radius: 16px;
  margin-top: 20px;
  &__name{
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  &__text{
    color:#999;
    font-size: 14px;
    margin-top: 8px;
    line-height: 20px;
  }
}

.realname-status{
  padding-top:20px;
  &__icon{
    width: 60px;
    height: 60px;
    display: block;
    margin: 0 auto;
  }
  &__title{
    color: #061023;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 10px;
    text-align: center;
  }
  &__desc{
    color: #999;
    text-align: center;
    margin-top:10px;
    font-size: 14px;
  }
}
.photo-list{
  display: flex;
  margin-left: -15px;
  margin-top:10px;
}
.photo-item{
  flex: 1;
  margin-left: 15px;
  position: relative;
}
.magnifier{
  width: 28px;
  height: 28px;
  position: absolute;
  left:50%;
  top:50%;
  margin-left: -14px;
  margin-top: -14px;
  z-index: 1;
  cursor: pointer;
}
</style>