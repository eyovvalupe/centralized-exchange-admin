<template>
   <div class="mt-[-6px] flex flex-wrap lever-set">
        <el-tag type="primary" class="mr-[6px] mt-[6px]" size="large" @close="onclose(i)" v-for="(level,i) in levers" closable :key="level">{{ level }}X</el-tag>
        <div>
             <el-input-number class="mr-[6px]" @blur="levelVal <= 0 ? levelVal='' : ''" v-model="levelVal" size="default" :controls="false" v-if="addLevel" />
            <el-button type="primary" class="w-[60px]" size="default" v-if="addLevel" @click="saveLevel">保存</el-button>
            <el-button type="primary" class="w-[74px]" size="default" icon="plus" @click="addLevel = true;" v-else>添加</el-button>
        </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    lever:""
})
const emits = defineEmits(['update:lever'])
const addLevel = ref(false)
const levelVal = ref(null)
const levers = ref(props.lever ? props.lever.split(',') : [])
watch(()=>props.lever,()=>{
    levers.value = props.lever ? props.lever.split(',') : []
})
const saveLevel = ()=>{
  if(levelVal.value == null || levelVal.value <= 0){
    return
  }
  if(levers.value.indexOf(levelVal.value) > -1){
    return ElMessage({
          offset: 200,
          message: '杠杆已存在',
          type: 'tips'
      })
  }
  levers.value.push(levelVal.value)
  addLevel.value = false
  levelVal.value = null
  emits('update:lever',levers.value.join(','))
}
const onclose = (i)=>{
  levers.value.splice(i,1);
  addLevel.value = false;
  levelVal.value = '';
  emits('update:lever',levers.value.join(','))
}
</script>

<style lang="scss" scoped>
.lever-set .el-input-number {
  width: 50px;
}
.lever-set .el-input-number :deep(.el-input){
  height: 32px;
  min-height: 32px;
  line-height: 32px;
}
</style>