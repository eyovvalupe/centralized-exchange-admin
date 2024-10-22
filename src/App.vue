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
:root {
  --el-color-primary-light-5: #165DFF !important;
  --el-color-primary: #165DFF !important;
  --el-font-weight-primary: 400 !important;
  --el-dialog-padding-primary: 10px !important;
}

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
  background: #165DFF !important;
  color: #fff !important;

  &:hover>td.el-table__cell {
    background: #165DFF !important;
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
  background: #165DFF !important;
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

.el-tabs__header {
  margin: 0 !important;
}

.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable {
  padding: 0 13px;
  color: #999;
  background: #fff;
  border: 1px solid #dfdfdf;
  box-shadow: 1px 1px 5px #f5f5f5;
  border-bottom: none;
  margin: 5px 2px 0 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 33px;
  border-right: 1px solid #ccc;

  &:hover {
    padding: 0 13px;
  }

  &.is-active {
    background: #f5f5f5 !important;
    padding: 0 13px;
    color: #165DFF;
  }
}

.keyword {
  color: #ff6800;
}

th.el-table__cell {
  background: #f5f5f5 !important;
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
  background: #fff;
  border: none !important;
  border-bottom: 1px solid #f5f5f5;
}

.el-tabs--card>.el-tabs__header .el-tabs__item,
.el-table thead th {
  font-weight: normal !important;

  &.is-closable .is-icon-close {
    width: 14px;
  }
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,
.el-menu--horizontal>.el-menu-item.is-active {
  background: #fff !important;
  color: #165DFF;
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
  background: #165DFF !important;
}

.el-table--large .el-table__cell {
  padding: 5px 0 !important;
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
  width: 50%;
  max-width: 420px;
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
  color: green;
}

.failure,.txt-red {
  color: red;
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
  color: #165DFF;
}

.el-dialog {
  padding: 0 !important;
}

.reset-el-styte {

  .el-date-editor--daterange,
  .el-button--large,
  .el-input,
  .el-select--large .el-select__wrapper {
    height: 32px !important;
    min-height: 32px !important;
    line-height: 32px !important;
  }

  .el-table--large .cell {
    padding: 0 5px !important;
  }

  .el-form-item--large {
    margin-bottom: 10px !important;
  }

  .el-form--large.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 5px !important;
  }

  .el-input--large .el-input__inner {
    height: 30px !important;
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
  border-radius: 10px !important;

  .el-dialog__header {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 10px !important;
    margin: 0 !important;

    .el-dialog__title {
      color: #272727;
      font-size: 16px;
      font-weight: 400;
    }

    .el-dialog__headerbtn {
      top: -5px;

      .el-dialog__close {
        font-size: 16px;
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
  width: 2px;
  height: 10px;
  background: #165DFF;
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
    color: yellow;
  }

  &.open,
  &.none {
    color: green;
  }

  &.close,
  &.cancel {
    color: #666;
  }

  &.fail {
    color: red;
  }

  &.blue {
    color: #165DFF;
  }
}
.disabled{
  color: #999;
}
.status-bg {
  padding: 2px 5px;
  border-radius: 5px;
}

.status-red,
.status-failure,
.status-bg.short,
.status-bg.fail,
.status-bg.failure,
.status-bg.failure {
  background: #f56c6c;
  color: #fff;
}

.status-green,
.status-success,
.status-bg.open,
.status-bg.success {
  background: #34c759;
  color: #fff;
}

.status-bg.lock,.status-bg.waitconfirm {
  background: #165DFF;
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

.el-button--success,
.status-bg.issuing,
.status-bg.success,
.status-bg.long,
.status-bg.buy {
  background: #34c759 !important;
  color: #fff !important;
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

  span:not(.status-bg) {
    padding: 5px 6px;

    &:first-child {
      text-align: center;
      width: 40%;
      border-right: 1px solid #e6e6e6;
      font-weight: 500;
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
    padding: 5px 6px;
  }

  .table-span-right {
    text-align: left;
    width: 60%;

    span {
      padding: 2px 5px;
      border-radius: 5px;
    }
  }

  .table-span-left {
    text-align: center;
    width: 40%;
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
  color: #165DFF !important;
}

.el-dialog__footer {
  .el-button {
    padding-left: 30px;
    padding-right: 30px;

    &:first-child {
      background: #b8dcff45;
      border-color: #165DFF;
      color: #165DFF;
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
    color: #165DFF;

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

.el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable,
.el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:hover,
.el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child,
.el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
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
</style>
