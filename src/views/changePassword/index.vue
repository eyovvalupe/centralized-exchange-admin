<template>
  <div class="section-container login-container un-select">
    <div class="body fix-width">
      <div class="top">
        <span class="top-title">修改密码</span>
      </div>
      <div class="main">
        <change-pwd />
        <div class="foot-link clearFix" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-unified'

import changePwd from './changePwd.vue'

const resizeCb = debounce( () => {}, 50 )

onMounted( () => {
  window.addEventListener( 'resize', resizeCb )
} )

onUnmounted( () => {
  window.removeEventListener( 'resize', resizeCb )
} )

defineOptions( {
  name : 'Login'
} )
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: #F0F2F5;
}
.body {
  vertical-align: middle;
  min-width: 360px;
  width: 360px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.top{
  height: 38px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .top-title {
    color: #165DFF;
    font-size: 20px;
    border-bottom: 2px solid #165DFF;
    height: 37px;
    display: inline-block;
  }
}
.main {
  margin-top: 20px;
  .foot-link {
    text-align: center;
    margin-top: 1px;
    .link-item {
      margin: 0;
      font-size: 12px;
      line-height: 18px;
      color: #165DFF;
    }
  }
}

.foot-link {
  .el-button {
    font-size: 12px;
  }
}

// 适配移动端
@media screen and (max-width: 768px) {
  .body {
    padding: 0 30px;
    box-shadow: none;
    border: 0;
    background: transparent;
    border-radius: 0;
  }
  .w380 {
    margin: 0 auto;
    width: 100vw;
    min-width: 100vw;
  }
}
</style>
