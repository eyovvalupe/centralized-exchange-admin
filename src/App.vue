<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '/@/store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    const appStore = useAppStore()
    const size = computed(() => appStore.size)
  
    return {
      size,
      locale: zhCn
    }
  }
})
</script>
<style lang="scss">
@import url(./assets/style/el-theme.scss);


body,
html {
  background: #fff;
  font-family: "Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  height: 100%;
  color: #606266;
}
.border-line{
  border-bottom: 1px solid #dfe1e4;
}
#app {
  font-size: 13px;
  min-width: 1600px;
  .noborder {
    .el-table__inner-wrapper::before {
      display: none !important;
    }
  }
}


th.el-table__cell.bg-white2 {
  background: #dee8ff !important;
}

th.el-table__cell.bg-color1,
.bg-color1 {
  background: #f1f7ff !important;
}

th.el-table__cell.bg-color2,
.bg-color2 {
  background: #fff7e0 !important;
}

th.el-table__cell.bg-color3,
.bg-color3 {
  background: #ffeee1 !important;
}

.el-table tr.el-table__row.active {
  background: #4377FE !important;
  color: #fff !important;

  &:hover>td.el-table__cell {
    background: #4377FE !important;
    color: #fff !important;
  }
}

.el-table__body .bg-one-row:first-child {
  background: #fff7e0 !important;

  &:hover>td.el-table__cell {
    background: #fff7e0 !important;
  }
}

.el-transfer-panel .el-checkbox__label {
  font-size: 14px !important;
}

.hide-icon {
  display: none !important;
}

.el-checkbox.el-checkbox--small.is-checked .el-checkbox__inner {
  background: #4377FE !important;
}

.el-popper {
  animation: none !important;
  transition: none !important;
}

.clearfix {
  clear: both;
}

.menu-border {
  margin: 2px 0;
}

.header-menus {
  .el-menu {
    width: 250px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border: 1px solid #e4e7ed;
    padding: 5px 10px;
    background: #fff;

  }

  .el-menu-item {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}

.no-menu-auth {
  color: #bfbfbf !important;
  cursor: not-allowed;
  pointer-events: none;

  &:hover {
    background: none !important;
  }

  img {
    opacity: .3;
  }
}


.keyword {
  color: #ff6800;
}

.input-number.el-input-number{
  width: 100%;
  text-align: center;
  .el-input__inner{
    text-align: left;
  }
  .el-input__suffix{
    background-color: #F5F5F5;
    border-left: 1px solid #ddd;
    padding:0 15px;
    margin-right: -14px;
    border-radius: 0 4px 4px 0;
  }
}
.el-tabs__header {
  margin: 0 !important;
}




.el-table thead th {
  font-weight: normal !important;

  &.is-closable .is-icon-close {
    width: 14px;
  }
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,
.el-menu--horizontal>.el-menu-item.is-active {
  background: #fff !important;
  color: #4377FE;
  border: none !important;
}

*:focus-visible {
  outline-width: 0cap;
}

.el-table--large .cell,
.el-table--large .cell .el-button {
  font-size: 13px;
}

.app-header .el-badge__content.is-fixed {
  top: 8px;
  right: 0px;
  font-size: 11px;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background: #4377FE !important;
}

.badge {
  min-width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 100%;
  background: #FF3B30;
  line-height: 18px;
  color: #fff;
  font-size: 12px;

}

.el-card__header {
  padding: 10px 10px !important;
  border-bottom: 1px solid #fff !important;
}

.menu-two {
  color: #666;
  overflow: hidden;
  margin: 0 auto;
  flex: none;
  flex-shrink: 0;

  &.dashboard {
    width: 100%;
    max-width: 100%;
    align-content: flex-start;
    justify-content: flex-start;

    .badge-box {
      background: transparent !important;
    }

    .active {
      border-radius: 3px;
      background: #e0e9f7;
    }
  }

  .el-badge {
    right: -15px;
    top: 0px;
    z-index: 11;
    position: absolute !important;
  }
}

.pwd-last .el-input-group__append {
  cursor: pointer;
  background: #fff;
  color: #333;
}

.success,
.success,.txt-green  {
  color: #03BC59;
}

.failure,.txt-red {
  color: #F33764;
}

.el-dialog .el-dialog__body {
  padding: 10px 20px;
}

.operation_popover {
  .items-center:hover {
    background: #f5f5f5;
  }
}

.txt-blue {
  color: #4377FE;
}

.el-dialog {
  padding: 0 !important;
}

.reset-el-styte {

  .el-table--large .el-table__cell {
    padding: 5px 0 !important;
  }
  .el-table--large .el-table__cell .cell{
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#000;
    font-size: 13px;
  }

  .el-date-editor--daterange,
  .el-button--large,
  .el-input,
  .el-select--large .el-select__wrapper {
    height: 40px !important;
    min-height: 40px !important;
    line-height: 40px !important;
    border-radius: 4px;
  }
  .el-button--primary.is-plain{
    background: none;
  }

  .el-table--large .cell {
    padding: 0 5px !important;
  }

  .el-form-item--large {
    margin-bottom: 20px !important;
  }

  .el-form--large.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 10px !important;
    line-height: 20px;
  }

  .el-input--large .el-input__inner {
    height: 30px !important;
  }

  .el-button--large{
    padding: 10px 16px;
  }
  
  .el-input.is-disabled .el-input__wrapper{
    box-shadow: 0px 0px 0px rgba(0,0,0,0);
  }
  // .append-style{
  //   .el-input-group__append button.el-button{
  //      background-color: none;
  //      color: none;
  //   }
  // }

  h2,label{
    color:#000;
  }
}

.soll-list{
  &::-webkit-scrollbar {
      width:6px;
      
  }
  
  &::-webkit-scrollbar-track {
      background: #fff;
      border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
      background: rgba(144,147,153,.2);
      border-radius: 10px;

  }

  &::-webkit-scrollbar-thumb:hover {
      background: rgba(144,147,153,.4);
  }
}
.soll-list-y{
  overflow-y: auto;
}
.reset-el-style-v2 {

  .el-table--large .el-table__cell {
    padding: 5px 0 !important;
  }
  .el-table--large .el-table__cell .cell{
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#000;
    font-size: 13px;
  }

  .el-radio-group{
    background-color: #F5F5F5;
    border-radius: 8px;
    height: 40px;
    .el-radio-button__inner{
      border-radius: 0px;
      border: 0px;
      height: 40px;
      background: none;
    }
    .el-radio-button.is-active .el-radio-button__inner{
      border-radius: 8px;
    }
    .el-radio-button:first-child .el-radio-button__inner{
      border-left: 0px;
    }
  }
  

  
  .el-date-editor--daterange,
  .el-button--large,
  .el-input,
  .el-select--large .el-select__wrapper {
    height: 40px;
    min-height: 40px;
    line-height: 40px;
    border-radius: 8px;
  }
  .el-button.is-plain{
    background: none;
  }

  .el-table--large .cell {
    padding: 0 5px !important;
  }

  .el-form-item--large {
    margin-bottom: 20px !important;
  }

  .el-form--large.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 10px !important;
  }

  .el-input--large .el-input__inner {
    height: 30px !important;
  }

  .el-button--large{
    padding: 10px 16px;
  }

  .el-input .el-input__wrapper,
  .el-range-editor,
  .el-select .el-select__wrapper{
      background-color:#F5F5F5;
      box-shadow:0 0 0 0 var(--el-border-color) inset !important;
      border-radius: 8px;

   }
  // .append-style{
  //   .el-input-group__append button.el-button{
  //      background-color: none;
  //      color: none;
  //   }
  // }
}

.el-button.is-disabled {
  background: #e3e3e3 !important;
  border-color: #e3e3e3 !important;
}

.txt-tips {
  background: #f5f5f5;
  color: #666;
  border-radius: 5px;
  padding: 10px;
  font-size: 13px;
}

.avatar-txt {
  background: #ccc;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: inline-block;
  text-align: center;
  line-height: 28px;
  margin-right: 10px;
}

.el-menu--horizontal.el-menu {
  border-bottom: none !important;
  height: auto;
}

.el-dialog {

  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 20px !important;
    margin: 0 !important;

    .el-dialog__title {
      color: #000;
      font-size: 14px;
      font-weight: 400;
    }

    .el-dialog__headerbtn {
      top: -1px;
      .el-dialog__close {
        font-size: 18px;
        font-weight: bolder;
        color: #000;
      }
    }
  }

  .el-dialog__footer {
    padding: 0 10px 10px 10px !important;
  }
}

.el-message--tips {
  background: #000000db !important;
  color: #fff !important;
}

.split-line {
  display: inline-block;
  width: 1px;
  height: 18px;
  background: #E6E6E6;
  margin:0 10px;
}

.agentGoogle .input-items {
  margin: 10px 10px 20px 10px !important;
}

.el-overlay.is-message-box .el-overlay-message-box {
  top: 18vh !important;
  bottom: auto !important;
}
.txt-yellow{
  color: #f56c6c;
}
.status {
  &.lock {
    color: #EF8401;
  }

  &.open,
  &.none {
    color: #34c759;
  }

  &.close,
  &.cancel {
    color: #666;
  }

  &.fail {
    color: #F33764;
  }

  &.error{
    color:#FF0004;
  }

  &.blue {
    color: #4377FE;
  }
}
.disabled{
  color: #999;
}

.status-tag{
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  display: inline-block;
  margin:0 5px;
}
.status-tag.primary{
  color:#4377FE;
  background: rgba(67, 119, 254, 0.10);
}

.status-bg {
  border-radius: 10px;
  line-height: 20px;
  padding: 0 10px;
}

.status-red,
.status-failure,
.status-bg.short,
.status-bg.fail,
.status-bg.failure,
.status-bg.failure {
  background: rgba(243, 55, 100, 0.24);
  color: #F33764;
}

.status-green,
.status-success,
.status-bg.open,
.status-bg.success {
  background: #34c759;
  color: #fff;
}

.status-bg.lock,.status-bg.waitconfirm {
  background: #4377FE;
  color: #fff;
}

.status-yellow,
.status-bg.none,
.status-bg.review,
.status-bg.waitpayment,
.status-bg.sell {
  background: #FFCC00;
  color: #fff;
}

.el-button--success{
  background: #03BC59 !important;

}

.status-bg.issuing,
.status-bg.success,
.status-bg.long,
.status-bg.buy {
  background: rgba(3, 188, 89, 0.24) !important;
  color: #03BC59 !important;
}

.status-gray,
.status-bg.done,
.status-bg.cancel,
.status-bg.close {
  background: #ccc;
  color: #fff;
}

.txt-gray {
  color: #BFBFBF;
}

.txt-gray2 {
  color: #666;
}

.table-list {
  border: 1px solid #e6e6e6;
  border-bottom: none;

  span.bor-r{
    border-right: 1px solid #e6e6e6;
  }
  span:not(.status-bg) {
    padding: 8px 20px;
    line-height: 20px;
    &:first-child {
      text-align: left;
      width: 40%;
      border-right: 1px solid #e6e6e6;
      font-weight: 400;
      color:#000;
    }
    &.text-center:first-child{
      text-align: center;
    }
  }
  
  &:last-child {
    border-bottom: 1px solid #e6e6e6;
  }

}

.el-button+.el-button {
  margin-left: 6px !important;
}

.table-list-order {
  border: 1px solid #e6e6e6;
  border-bottom: none;

  .table-span-left,
  .table-span-right {
    padding: 7px 20px;
  }

  .table-span-right {
    text-align: left;
    width: 64%;
  }

  .table-span-left {
    text-align: left;
    width: 36%;
    border-right: 1px solid #e6e6e6;
    color: #999;
    background: #fafafa;
  }

  &:last-child {
    border-bottom: 1px solid #e6e6e6;
  }

}

.btn-last-txt {
  padding: 0 10px !important;
  color: #4377FE !important;
}

.el-dialog__footer {
  .el-button {
    padding-left: 30px;
    padding-right: 30px;

    &:first-child {
      background: #b8dcff45;
      border-color: #4377FE;
      color: #4377FE;
    }
  }
}

.el-image-viewer__mask {
  background: #fff !important;
  opacity: .9 !important;
}

.imgMessage img {
  max-height: 100px;
}

.order-info {
  .el-tabs__content {
    width: 100%;
    display: block;
  }

  .el-tabs__nav-scroll {
    display: none;
  }

  .tab {
    width: 100%;
    line-height: 30px;
    border-bottom: 1px solid #f5f5f5;
    .is-top{
      position: relative;
    }
    .is-active {
      background: #f5f5f5;
      border-radius: 5px;
    }
    .unread{
      top: 0;
      right: 0;
      z-index: 1;
      min-width: 20px;
      font-weight: normal;
      height: 20px;
      line-height: 20px;
      border-radius: 100%;
      text-align: center;
      background: #f56c6c;
      color: #fff;
      position: absolute;
    }
  }
}

small {
  line-height: 20px;
  font-size: 13px;
}

.from-info {
  small {
    display: inline-block;
    width: 80px;
    color: #666;
  }

  span {
    position: relative;
  }

  .h1 {
    font-size: 24px;
    color: #4377FE;

    small {
      font-size: 12px;
    }
  }

  p {
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #e7e7e7;

    &:last-child {
      border: none;
    }

    .tag {
      font-size: 14px;
      border-radius: 20px;
      text-align: center;
      padding: 2px 5px;
    }

    label {
      display: inline-block;
      min-width: 90px;
      color: #9e9e9e;
    }
  }

  .f-info-head {
    padding-left: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e7e7e7;

    label {
      display: inline-block;
      color: #9e9e9e;
      margin-right: 10px;
    }

    .h1 {
      margin: 0;
      padding: 0;
      font-size: 32px;
    }

    .gg {
      font-size: 13px;
    }
  }
}

.el-button:focus-visible {
  outline: none !important;
}

.el-transfer {
  height: 100%;

  .el-checkbox.el-checkbox--large {
    height: 28px !important;
  }

  .el-transfer-panel .el-transfer-panel__footer {
    text-align: center;
    background: #f5f7fa;
  }

  .el-transfer-panel__header .el-checkbox__input {
    display: none;
  }

  .el-transfer-panel {
    display: inline-block;
    width: calc(50% - 30px);
  }

  .el-transfer-panel:first-child {
    float: right
  }

  .el-transfer-panel:last-child {
    float: left
  }
}

.el-transfer__buttons {
  width: 60px;
  padding: 0 10px !important;
  margin: 0;
  justify-content: center;
  transform: rotate(180deg) translateY(-140%);

  .el-transfer__button:nth-child(2) {
    margin-left: 0px;
  }

  button {
    width: 40px;
    margin: 10px 0;
    line-height: 40px;
    display: flex !important;
  }
}

.order-con-ovderhide {
  .el-tabs__content {
    padding: 10px 0 0 0 !important;
    min-height: 90px;
    text-align: center;

    img {
      cursor: pointer;
    }
  }
}

.el-tabs .el-tabs__item{
  font-weight: 400;
}

.el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),

.el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
  padding: 0 13px !important;
}

.el-form-item__error {
  display: none;
}
.text-red{
  color: #f56c6c;
}
.address-code{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.nav-user-icon{
  width: 20px;
  height: 20px;
}
.address-qrcode-flex1{
  flex: 1;
}
.text-blue{
  color: #049eff;
}
.money-class{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
.select-money{
  display: flex;
  justify-content:space-between;
  align-items: center;
  img{
    width: 20px;
    height: 20px;
  }
}


.search-box .el-input,
.search-box .el-input__wrapper,
.search-box .search-date-picker{
  height: 32px !important;
  min-height: 32px !important;
  border-radius: 8px;
}
.search-box .el-input__wrapper{
  background-color: #F5F5F5;
  box-shadow:0px 0px 0px rgba(255,255,255,0);
}
.search-box .el-button{
  border-radius: 8px;
  height: 32px !important;
  padding: 0px;
  min-height: 32px  !important;
}
</style>
