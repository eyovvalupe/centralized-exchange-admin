<template>
     <div class="realname-status">
        <div class="realname-status__icon">
            <img src="/@/assets/images/success.svg" v-if="detailData.status == 'success'" />
            <img src="/@/assets/images/fail.svg" v-else-if="detailData.status == 'failure'" />
            <img src="/@/assets/images/reviewing.svg" v-else />
        </div>
        <div class="realname-status__title"> {{ transdata(detailData.status) }}</div>
        <div class="realname-status__desc" v-if="detailData.status == 'success'">我们将严格保密您的身份信息</div>
        <div class="realname-status__desc" v-else-if="detailData.status == 'failure'">{{detailData.remarks}}</div>
        <div class="realname-status__desc" v-else>请等待审核，我们将严格保密您的身份信息</div>
        </div>
        <div class="realname-info">
        <div class="realname-info__name">{{detailData.name}}</div>
        <div class="realname-info__text"><span>证件号码</span>{{detailData.idnum}}</div>
        <div class="realname-info__text"><span>出生日期</span>{{detailData.birthday}}</div>
        </div>

        <div class="photo-list pb-[10px]">
        <div class="photo-item">
            
            <el-image class="right-img" ref="idimg_1" fit="cover" :src="detailData.idimg_1" :initial-index="0" :preview-src-list="srcList"
                @click="handleClickItem">
                <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
                </template>
            </el-image>
            <div class="magnifier" @click="openImg(idimg_1)">
                <img src="/@/assets/images/magnifier.svg" />
            </div>
        </div>
        <div class="photo-item">
            <el-image class="right-img" ref="idimg_2" fit="cover" :src="detailData.idimg_2" :initial-index="1" :preview-src-list="srcList"
                @click="handleClickItem">
                <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
                </template>
            </el-image>
            <div class="magnifier" @click="openImg(idimg_2)">
                <img src="/@/assets/images/magnifier.svg" />
            </div>
        </div>
        <div class="photo-item">
            
            <el-image class="right-img" ref="idimg_3" fit="cover" :src="detailData.idimg_3" :initial-index="2" :preview-src-list="srcList"
                @click="handleClickItem">
                <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
                </template>
            </el-image>
            <div class="magnifier" @click="openImg(idimg_3)">
                <img src="/@/assets/images/magnifier.svg" />
            </div>
        </div>
        </div>
</template>

<script setup>
const props = defineProps({
    detailData:{
        type:Object,
        default(){
            return {}
        }
    },
    srcList:{
        type:Array,
        default(){
            return []
        }
    }
})
const statusOptions = [
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '认证通过',
  },
  {
    value: 'failure',
    label: '认证失败',
  },
]
const transdata = (d)=>{
  const obj= statusOptions.find(f => f.value ==d) || {label:'--'}
  return obj.label
}

// 关闭el-image遮罩层
const handleClickItem = () => {
//   setTimeout(() => {
//         // 获取遮罩层dom
//     let domImageMask = document.querySelectorAll('.el-image-viewer__mask')
//     if (!domImageMask) {
//       return
//     }
//     domImageMask.forEach((item, index) => {
//       item.addEventListener('click', () => {
//         // 点击遮罩层时调用关闭按钮的 click 事件
//         let closeBtn = document.querySelectorAll('.el-image-viewer__close')
//         closeBtn[index].click()
//       })
//     })
//   }, 500);
}

const idimg_1 = ref(null)
const idimg_2 = ref(null)
const idimg_3 = ref(null)

const openImg = (component)=>{
  component.$el.querySelector('img').click()
}
</script>


<style lang="scss" scoped>
.right-img {
    border-radius: 15px;
    width: 100%;
    height: 134px;
    overflow: hidden;
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
    color:#000;
    font-size: 14px;
    margin-top: 8px;
    line-height: 20px;
    span{
        color:#999;
        margin-right: 20px;
    }
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