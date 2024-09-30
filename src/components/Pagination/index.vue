<template>
  <div class="container">
    <el-pagination
      class="rear-page"
      :current-page="tablePage.currentPage"
      :page-sizes="pageSizeArr"
      :page-size="tablePage.pageSize"
      layout="pager, slot, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    >
    <template #default>
        <div class="pagination-gopage">
          <span @click="goPage(-1)" :class="tablePage.currentPage<=1?'disabled':''">上一页</span>
          <span @click="goPage(1)">下一页</span>
        </div>
    </template>
    </el-pagination>
  </div>
</template>

<script setup name="Pagination">
import { ref, reactive, watch, onMounted } from 'vue'

const pageSizeArr = ref( [10, 20, 30, 40] )

const tablePage = reactive( {
  currentPage : 1, //  当前页
  pageSize : 20, //  展示数量
  totalResult : 100, //  总数
  firstPageDisabled : true, //  首页
  lastPageDisabled : true //  末页
})

// onMounted( () => {
//   tablePage.pageSize = props.size
//   tablePage.totalResult = props.total
//   tablePage.currentPage = props.currentPage
// })

const props = defineProps( {
  currentPage : {
    type : Number,
    default : 1
  },
  size : {
    //  展示数量
    type : Number,
    default : 10
  },
  total : {
    //  总数
    type : Number,
    default : 1000
  }
})

const emit = defineEmits(['changePage'])
watch(
  () => props.currentPage,
  () => {
    tablePage.currentPage = props.currentPage
  },
  { immediate : true, deep : true }
)
//   改变当前页码
const handleCurrentChange = currentPage => {
  // tablePage.currentPage = currentPage
  emit( 'changePage', currentPage )
}
const goPage=(num)=>{
  if(num==-1&&tablePage.currentPage<=1){
    return
  }
  tablePage.currentPage =  tablePage.currentPage + num
  handleCurrentChange(tablePage.currentPage)
}
</script>

<style>
.container .el-pager {
    display: none!important;
  }
</style>
<style scoped lang="scss">
.container{
  display: flex;

}
::v-deep(.el-pagination) {
  // position: absolute;
  // bottom: 20px;
  // float: left;
  margin-top: 10px;
  .btn-prev,
  .btn-next,
  .el-pager > li {
    margin-right: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }
  .el-pager li.is-active {
    border: 1px solid #165DFF !important;
  }
  .pagination-gopage{
    span{
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
      &.disabled{
        color: #ccc;
      }
      &:not(.disabled):hover{
        color: #165DFF;
        background: #ecf5ff;
        border-color: #c6e2ff;
      }
    }
  }
}
.el-pagination.ahead-page {
  padding-right: 0px;
}
// .el-pagination.rear-page {
//   padding-left: 42px;
// }
.firstPage,
.lastPage {
  background-color: white;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
.firstPage {
  margin-right: 3px;
}
.lastPage {
  margin-left: 8px;
}
</style>
