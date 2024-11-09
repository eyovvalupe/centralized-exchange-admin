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
import { defineComponent, computed, watch } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { useAppStore, useServiceStore, useCommonStore } from '/@/store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  setup() {
    const appStore = useAppStore()
    const useService = useServiceStore()
    const useCommon = useCommonStore()

    const size = computed(() => appStore.size)
    const openReceiveMsgNotifi1 = computed(() => useCommon.openReceiveMsgNotifi1)
    const openReceiveMsgNotifi2 = computed(() => useCommon.openReceiveMsgNotifi2)
    const openReceiveMsgNotifi3 = computed(() => useCommon.openReceiveMsgNotifi3)
    const openReceiveMsgNotifi4 = computed(() => useCommon.openReceiveMsgNotifi4)
    const depositMsgPosition = computed(() => useCommon.depositMsgPosition)
    const verifyMsgPosition = computed(() => useCommon.verifyMsgPosition)
    const serviceMsgPosition = computed(() => useCommon.serviceMsgPosition)
    const withdrawMsgPosition = computed(() => useCommon.withdrawMsgPosition)
    const receivedDepositMsg = computed(() => useService.receivedDepositMsg)
    const receivedVerifyMsg = computed(() => useService.receivedVerifyMsg)
    const receivedServiceMsg = computed(() => useService.receivedServiceMsg)
    const receivedWithdrawMsg = computed(() => useService.receivedWithdrawMsg)

    const messageNumObj = computed(() => useService.messageNumObj)

    const click1 = () => {
      if (!openReceiveMsgNotifi1.value) {
        useCommon.toggleNotification1(true)
        useCommon.setAlreadyRender1()
        useCommon.setDepositMsgPosition(numOfOpen())
      } else {
        if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > depositMsgPosition.value)
          useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
        if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > depositMsgPosition.value)
          useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
        if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > depositMsgPosition.value)
          useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
        useCommon.setDepositMsgPosition(numOfOpen())
        useCommon.setLatestMsg(1)
      }
      useCommon.setDepositMsgLasttime(Date.now())
    }
    const click2 = () => {
      if (!openReceiveMsgNotifi2.value) {
        useCommon.toggleNotification2(true)
        useCommon.setAlreadyRender2()
        useCommon.setVerifyMsgPosition(numOfOpen())
      } else {
        if (openReceiveMsgNotifi1.value && depositMsgPosition.value > verifyMsgPosition.value)
          useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
        if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > verifyMsgPosition.value)
          useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
        if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > verifyMsgPosition.value)
          useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
        useCommon.setVerifyMsgPosition(numOfOpen())
        useCommon.setLatestMsg(2)
      }
      useCommon.setVerifyMsgLasttime(Date.now())
    }
    const click3 = () => {
      if (!openReceiveMsgNotifi3.value) {
        useCommon.toggleNotification3(true)
        useCommon.setAlreadyRender3()
        useCommon.setServiceMsgPosition(numOfOpen())
      } else {
        if (openReceiveMsgNotifi1.value && depositMsgPosition.value > serviceMsgPosition.value)
          useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
        if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > serviceMsgPosition.value)
          useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
        if (openReceiveMsgNotifi4.value && withdrawMsgPosition.value > serviceMsgPosition.value)
          useCommon.setWithdrawMsgPosition(withdrawMsgPosition.value - 1)
        useCommon.setServiceMsgPosition(numOfOpen())
        useCommon.setLatestMsg(3)
      }
      useCommon.setServiceMsgLasttime(Date.now())
    }
    const click4 = () => {
      if (!openReceiveMsgNotifi4.value) {
        useCommon.toggleNotification4(true)
        useCommon.setAlreadyRender4()
        useCommon.setWithdrawMsgPosition(numOfOpen())
      } else {
        if (openReceiveMsgNotifi1.value && depositMsgPosition.value > withdrawMsgPosition.value)
          useCommon.setDepositMsgPosition(depositMsgPosition.value - 1)
        if (openReceiveMsgNotifi2.value && verifyMsgPosition.value > withdrawMsgPosition.value)
          useCommon.setVerifyMsgPosition(verifyMsgPosition.value - 1)
        if (openReceiveMsgNotifi3.value && serviceMsgPosition.value > withdrawMsgPosition.value)
          useCommon.setServiceMsgPosition(serviceMsgPosition.value - 1)
        useCommon.setWithdrawMsgPosition(numOfOpen())
        useCommon.setLatestMsg(4)
      }
      useCommon.setWithdrawMsgLasttime(Date.now())
    }

    const numOfOpen = () => {
      let i = -1
      if (openReceiveMsgNotifi1.value) i++
      if (openReceiveMsgNotifi2.value) i++
      if (openReceiveMsgNotifi3.value) i++
      if (openReceiveMsgNotifi4.value) i++
      return i
    }
    watch(
      () => receivedDepositMsg.value,
      val => {
        click1()
      }
    )
    watch(
      () => receivedVerifyMsg.value,
      val => {
        click2()
      }
    )
    watch(
      () => receivedServiceMsg.value,
      val => {
        click3()
      }
    )
    watch(
      () => receivedWithdrawMsg.value,
      val => {
        click4()
      }
    )

    watch(() => messageNumObj.value['deposit'], (val) => {
      if (val == 0) useCommon.toggleNotification1(false)
    })
    watch(() => messageNumObj.value['kyc'], (val) => {
      if (val == 0) useCommon.toggleNotification2(false)
    })
    watch(() => messageNumObj.value['support'], (val) => {
      if (val == 0) useCommon.toggleNotification3(false)
    })
    watch(() => messageNumObj.value['withdraw'], (val) => {
      if (val == 0) useCommon.toggleNotification4(false)
    })

    return {
      size,
      locale: zhCn,
    }
  },
})
</script>
<style lang="scss">
@import url(./assets/style/el-theme.scss);

body,
html {
  background: #fff;
  font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  height: 100%;
  color: #606266;
}
.border-line {
  border-bottom: 1px solid #dfe1e4;
}
#app {
  font-size: 13px !important;
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
  background: #4377fe !important;
  color: #fff !important;

  &:hover > td.el-table__cell {
    background: #4377fe !important;
    color: #fff !important;
  }
}

.el-table__body .bg-one-row:first-child {
  background: #fff7e0 !important;

  &:hover > td.el-table__cell {
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
  background: #4377fe !important;
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

.no-menu-auth {
  color: #bfbfbf !important;
  cursor: not-allowed;
  pointer-events: none;

  &:hover {
    background: none !important;
  }

  img {
    opacity: 0.3;
  }
}

.keyword {
  color: #ff6800;
}

.input-number.el-input-number {
  width: 100%;
  text-align: center;
  .el-input__inner {
    text-align: left;
  }
  .el-input__suffix {
    background-color: #f5f5f5;
    border-left: 1px solid #ddd;
    padding: 0 15px;
    margin-right: -14px;
    border-radius: 0 8px 8px 0;
    min-width: 48px;
    box-sizing: border-box;
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
  background: #4377fe !important;
}

.badge {
  min-width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 100%;
  background: #ff3b30;
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
}

.pwd-last .el-input-group__append {
  cursor: pointer;
  background: #fff;
  color: #333;
}

.success,
.success,
.txt-green {
  color: #03bc59;
}

.failure,
.txt-red {
  color: #f33764;
}

.el-dialog .el-dialog__body {
  padding: 10px 20px;
}

.operation_popover {
  padding: 10px 0 !important;
  .items-center {
    padding: 10px 0 10px 20px;
  }
  .items-center:hover {
    background-color: #f5f5f5;
    color: var(--el-color-primary);
    svg path {
      fill: var(--el-color-primary);
    }
  }
}

.txt-blue {
  color: #4377fe;
}

.el-dialog {
  padding: 0 !important;
}

.reset-el-styte {
  .el-table--large .el-table__cell {
    padding: 5px 0 !important;
  }
  .el-table--large .el-table__cell .cell {
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 13px;
  }

  .el-date-editor--daterange,
  .el-button--large,
  .el-input,
  .el-select .el-select__wrapper {
    height: 40px;
    min-height: 40px;
    line-height: 40px;
  }

  .btn-large,
  .el-input--large + .el-button--large,
  .el-input--large:not(.el-textarea),
  .el-select--large .el-select__wrapper {
    height: 48px !important;
    min-height: 48px !important;
    line-height: 48px !important;
  }
  .el-select__placeholder {
    color: #000;
  }

  .el-button--primary.is-plain {
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

  .el-button--large {
    padding: 10px 16px;
  }

  .el-input.is-disabled .el-input__wrapper {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  }
  // .append-style{
  //   .el-input-group__append button.el-button{
  //      background-color: none;
  //      color: none;
  //   }
  // }

  h2,
  label {
    color: #000;
  }
}

.soll-list {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(144, 147, 153, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(144, 147, 153, 0.4);
  }
}
.soll-list-y {
  overflow-y: auto;
}
.reset-el-style-v2 {
  .el-table--large .el-table__cell {
    padding: 5px 0 !important;
  }
  .el-table--large .el-table__cell .cell {
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 13px;
  }

  .el-radio-group {
    background-color: #f5f5f5;
    border-radius: 8px;
    height: 40px;
    .el-radio-button__inner {
      border-radius: 0px;
      border: 0px;
      height: 40px;
      background: none;
    }
    .el-radio-button.is-active .el-radio-button__inner {
      border-radius: 8px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
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
  .el-button.is-plain {
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

  .el-button--large {
    padding: 10px 16px;
  }

  .el-input .el-input__wrapper,
  .el-range-editor,
  .el-select .el-select__wrapper {
    background-color: #f5f5f5;
    box-shadow: 0 0 0 0 var(--el-border-color) inset !important;
    border-radius: 8px;
  }
}

.el-button.is-disabled {
  opacity: 0.7;
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

body{
  .el-menu--horizontal.el-menu {
    border-bottom: none !important;
    height: auto;
  }

  .el-dialog {
    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e0e0e0;
      padding: 0 20px !important;
      margin: 0 !important;

      .el-dialog__title {
        color: #000;
        font-size: 16px;
        font-weight: 400;
      }

      .el-dialog__headerbtn {
        top: 4px;
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
  .el-button+.el-button {
    margin-left: 10px;
  }

  .el-transfer__buttons{
    .el-transfer__button + .el-transfer__button{
      margin-left: 0px;
    }
    .el-transfer__button{
      .el-icon{
        font-size: 18px;
      }
    }
    .el-transfer__button.is-disabled{
      background-color: #E3E3E3;
      border-color: #E3E3E3;
    }
  }

  .el-button--small + .el-button--small {
    margin-left: 5px;
  }

}

.split-line {
  display: inline-block;
  width: 1px;
  height: 18px;
  background: #e6e6e6;
  margin: 0 10px;
}

.agentGoogle .input-items {
  margin: 10px 10px 20px 10px !important;
}

.el-overlay.is-message-box .el-overlay-message-box {
  top: 18vh !important;
  bottom: auto !important;
}
.txt-yellow {
  color: #f56c6c;
}
.status {
  &.lock,
  &.review {
    color: #ef8401;
  }

  &.open,
  &.none {
    color: #000;
  }

  &.close,
  &.cancel {
    color: #999;
  }

  &.fail {
    color: #f33764;
  }

  &.error {
    color: #ff0004;
  }

  &.blue {
    color: #4377fe;
  }
}
.disabled {
  color: #999;
}

.status-tag {
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  display: inline-block;
  margin: 0 5px;
}
.status-tag.primary {
  color: #4377fe;
  background: rgba(67, 119, 254, 0.1);
}

.status-bg {
  border-radius: 14px;
  line-height: 24px;
  padding: 0 10px;
}

.status-red,
.status-failure,
.status-bg.short,
.status-bg.fail,
.status-bg.failure,
.status-bg.failure {
  background: rgba(243, 55, 100, 0.24);
  color: #f33764;
}

.status-green,
.status-success,
.status-bg.open,
.status-bg.success {
  background: #34c759;
  color: #fff;
}

.status-bg.lock,
.status-bg.waitconfirm {
  background: #4377fe;
  color: #fff;
}

.status-bg.all{
  background: #E1EAFF;
  color: #4377FE;
}

.status-yellow,
.status-bg.none,
.status-bg.waitpayment,
.status-bg.sell {
  background: #ef8401;
  color: #fff;
}
.status-bg.review {
  background: #4377fe;
  color: #fff;
}


.status-bg.issuing,
.status-bg.success,
.status-bg.long,
.status-bg.buy {
  background: rgba(3, 188, 89, 0.24) !important;
  color: #03bc59 !important;
}

.status-gray,
.status-bg.done,
.status-bg.cancel,
.status-bg.close {
  background: #ccc;
  color: #fff;
}

.txt-gray {
  color: #bfbfbf;
}

.txt-gray2 {
  color: #666;
}

.table-list {
  border: 1px solid #ececec;
  border-bottom: none;

  span.bor-r {
    border-right: 1px solid #ececec;
  }
  span:not(.status-bg) {
    padding: 8px 20px;
    line-height: 20px;
    &:first-child {
      text-align: left;
      width: 40%;
      border-right: 1px solid #ececec;
      font-weight: 400;
      color: #000;
    }
    &.text-center:first-child {
      text-align: center;
    }
  }

  &:last-child {
    border-bottom: 1px solid #ececec;
  }
}

.table-list--large {
  span:not(.status-bg) {
    padding: 13px 20px;
  }
}

.table-list-order {
  border: 1px solid #ececec;
  border-bottom: none;

  .table-span-left,
  .table-span-right {
    padding: 10px 20px;
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  .table-span-right {
    text-align: left;
    width: 64%;
    color: #000;
  }

  .table-span-left {
    text-align: left;
    width: 36%;
    border-right: 1px solid #ececec;
    color: #666;
    background: #fafafa;
  }

  &:last-child {
    border-bottom: 1px solid #ececec;
  }
}

.btn-last-txt {
  padding: 0 10px !important;
  color: #4377fe !important;
}

.el-dialog__footer {
  .el-button {
    padding-left: 30px;
    padding-right: 30px;

    &:first-child {
      background: #b8dcff45;
      border-color: #4377fe;
      color: #4377fe;
    }
  }
}

.el-image-viewer__mask {
  background: #fff !important;
  opacity: 0.9 !important;
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
    .is-top {
      position: relative;
    }
    .is-active {
      background: #f5f5f5;
      border-radius: 5px;
    }
    .unread {
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

.status-info {
  padding-top: 10px;
  &__icon {
    width: 60px;
    height: 60px;
    display: block;
    margin: 0 auto;
  }
  &__title {
    color: #061023;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 10px;
    text-align: center;
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
    color: #4377fe;

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
    float: right;
  }

  .el-transfer-panel:last-child {
    float: left;
  }
}
.el-message-box {
  padding: 0px !important;
  .el-message-box__title {
    color: #000;
    font-size: 18px;
  }
  .el-message-box__header {
    height: 50px;
    border-bottom: 1px solid #ececec;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .el-message-box__headerbtn {
      top: 5px;
      right: 10px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-message-box__close {
      font-size: 22px;
      color: #000;
    }
  }
  .el-message-box__message {
    color: #000;
  }
  .el-message-box__content {
    padding: 20px;
  }
  .el-message-box__btns {
    padding: 20px;
    .el-button {
      border-radius: 50px;
      width: 98px;
    }
    .el-button:not(.el-button--primary) {
      border: 1px solid #4377fe;
      background: #e1eaff;
      color: #4377fe;
    }
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

.el-tabs .el-tabs__item {
  font-weight: 400;
}

.el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:last-child,
.el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
  padding: 0 13px !important;
}

.el-form-item__error {
  display: none;
}
.text-red {
  color: #ff0004;
}
.address-code {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.nav-user-icon {
  width: 20px;
  height: 20px;
}
.address-qrcode-flex1 {
  flex: 1;
}
.text-blue {
  color: #049eff;
}
.money-class {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
.select-money {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
  }
}

.search-box .el-input,
.search-box .el-input__wrapper,
.search-box .search-date-picker {
  height: 32px !important;
  min-height: 32px !important;
  border-radius: 8px;
}
.search-box .search-date-picker {
  width: 100% !important;
}

.search-box .el-input__wrapper {
  background-color: #f5f5f5;
  box-shadow: 0px 0px 0px rgba(255, 255, 255, 0);
}
.search-box .el-button {
  border-radius: 8px;
  height: 32px !important;
  padding: 0px;
  min-height: 32px !important;
}
</style>
