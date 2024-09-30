<template>
   <el-dialog :close-on-click-modal="false" v-model="dialogType.showDialog" class="reset-el-styte" :loading="dialogLoading" width="480" title="实名信息"
    @close="closeDialogType">
    <div v-loading="dialogLoading" class="order-con-ovderhide">
      <template v-if="!dialogLoading">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="认证信息" name="info">
            <div class="m-2">
              <div v-for="(item, index) in column" :key="index"
                class="table-list-order flex flex-nowrap justify-center">
                <span class="table-span-left">{{ item.label }}</span>
                <span class="table-span-right">
                  <span class="status-bg" v-if="item.prop == 'status'"
                    :class="detailData[item.prop]" align="center">
                    {{ transdata(detailData[item.prop]) }}
                  </span>
                  <span v-else>
                    {{ detailData[item.prop] }}
                  </span>
                </span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="照片信息" name="img">
            <div class="m-2">
              <span class="left-tit">证件正面</span>
              <div class="flex align-top">

                <div class="right-img">
                  <el-image :src="detailData.idimg_1" :initial-index="0" :preview-src-list="srcList"
                    @click="handleClickItem">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <span class="left-tit">证件反面</span>
              <div class="flex align-top  my-2">

                <span class="right-img">
                  <el-image :src="detailData.idimg_2" :initial-index="1" :preview-src-list="srcList"
                    @click="handleClickItem">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </span>
              </div>
              <span class="left-tit">手持面</span>
              <div class="flex align-top">
                <span class="right-img">
                  <el-image :src="detailData.idimg_3" :initial-index="2" :preview-src-list="srcList"
                    @click="handleClickItem">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>

    </div>
  </el-dialog>
</template>

<script setup>
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
const activeName = ref(props.info.tab)
const dialogLoading = ref(false)

const dialogType = reactive({
  showDialog: true
})

const statusOptions = [
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '通过',
  },
  {
    value: 'failure',
    label: '拒绝',
  },
]
const transdata=(d)=>{
  const obj= statusOptions.find(f => f.value ==d) || {label:'--'}
  return obj.label
}
const column = reactive([
  { prop: 'name', label: '姓名' },
  // { prop: 'status', label: '状态' },
  // { prop: 'remarks', label: '备注' },
  // { prop: 'idtype', label: '证件类型' },
  { prop: 'idnum', label: '证件号码' },
  { prop: 'birthday', label: '生日' },
  // { prop: 'created', label: '提交时间' }
])

const showDialog = () => {
  dialogType.showDialog = true;
  dialogLoading.value = true;
  getDetail({ id: props.info.id }).then(res => {
    detailData.value = Object.assign(res, props.info);
    srcList.value = [res.idimg_1, res.idimg_2, res.idimg_3];
    console.log(' detailData.value =', detailData.value)
  }).finally(() => {
    dialogLoading.value = false;
  })
}
const closeDialogType = () => {
  emit('close');
}
// 关闭el-image遮罩层
const handleClickItem = () => {
  setTimeout(() => {
        // 获取遮罩层dom
    let domImageMask = document.querySelectorAll('.el-image-viewer__mask')
    if (!domImageMask) {
      return
    }
    domImageMask.forEach((item, index) => {
      item.addEventListener('click', () => {
        // 点击遮罩层时调用关闭按钮的 click 事件
        let closeBtn = document.querySelectorAll('.el-image-viewer__close')
        closeBtn[index].click()
      })
    })
  }, 500);
}
showDialog();
</script>
<style lang="scss" scoped>
.order-con-ovderhide {
  min-height: 250px;

  #pane-img {
    max-height: 530px;
    overflow: auto;

    // .left-tit{
    //   width: 70px;
    // }
    .right-img {
      border: 1px dashed #165DFF;
      border-radius: 10px;
      width: 100%;
      height: 158px;
      overflow: hidden;

      :deep(.el-image img) {
        max-width: 99%;
        height: 156px !important;
      }
    }
  }
}
</style>