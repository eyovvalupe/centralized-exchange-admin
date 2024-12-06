<template>
   <div class="mt-[-6px] flex flex-wrap">
        <el-tag type="primary" class="mr-[6px] mt-[6px]" size="default" @close="levers.splice(i,1);addLevel=false;levelVal='';" v-for="(level,i) in levers" closable :key="level">{{ level }}X</el-tag>
        <div>
             <el-input-number class="mr-[6px]" style="width:50px;" @blur="levelVal <= 0 ? levelVal='' : ''" v-model="levelVal" size="small" :controls="false" v-if="addLevel" />
            <el-button type="primary" size="small" v-if="addLevel" @click="saveLevel">保存</el-button>
            <el-button type="primary" size="small" icon="plus" @click="addLevel = true;" v-else>添加</el-button>
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
</script>