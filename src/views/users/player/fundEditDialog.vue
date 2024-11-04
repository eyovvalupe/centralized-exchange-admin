<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte"  @close="emit('close', false)" v-model="show" title="修改余额" :append-to-body="true">
    <div class="flex justify-between pt-[10px]">
      <div class="w-7/12 mr-[20px]">
        <el-form ref="ruleForm" label-position="top" :model="form" :rules="rules">
          <el-form-item label="账户" prop="currency" :label-width="formLabelWidth" required>
            <el-select v-model="form.currency" placeholder="请选择账户" @change="currencyChange" style="width: 100%;">
              <el-option v-for="item in options" :key="item.currency" :label="item.name" :value="item.currency" />
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amount" label-width="0" required>
            <div class="flex w-full">
              <el-select v-model="form.action" class="mr-2" style="width: 120px;">
                <el-option label="充值" value="deposit" />
                <el-option label="提现" value="withdraw" />
              </el-select>
              <el-input v-model="form.amount" placeholder="请输入金额" style="width: 100%;" />
            </div>
          </el-form-item>
          <!-- <el-form-item label="交易密码" prop="safeword" :label-width="formLabelWidth" required>
        <el-input type="password" show-password v-model="form.safeword" placeholder="请输入交易密码" />
      </el-form-item> -->
        </el-form>
        <div class="txt-tips my-2" v-if="form.action == 'withdraw'">提现金额不计入充值报表</div>
      </div>
      <div class="w-5/12" v-loading="loading">
        <div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="font-weight: normal;" class="text-right">账户余额</span>
            <span class="w-7/12 text-left status blue">{{ userDetail.amount }}</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="font-weight: normal;" class="text-right">变更金额</span>
            <!-- {{ form.action =='deposit'?'+':'-' }} -->
            <span class="w-7/12 text-left status blue">{{ form.amount || 0 }}</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="font-weight: normal;" class="text-right">变更后金额</span>
            <span class="w-7/12 text-left status blue">{{ currMoney }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="p-[10px]">
        <el-button  round class="w-[98px]" @click="emit('close')">取消</el-button>
        <el-button type="primary" round class="w-[98px]" @click="showPwdDialog" :disabled="currMoney < 0"
          :loading="isLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" v-model="showPwd" class="reset-el-styte" width="350" title="交易密码验证" :append-to-body="true">
      <el-form class="pt-[10px]">
        <el-input type="password" autocomplete="off" show-password v-model="form.safeword" placeholder="请输入交易密码" />
      </el-form>
      <template #footer>
        <div class="p-10">
          <el-button  round class="w-[98px]" @click="emit('close')">取消</el-button>
          <el-button type="primary" round class="w-[98px]" @click="handleInnerDialog">确定</el-button>
        </div>
      </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, watch, computed } from 'vue'
import { apiCurrency, apiWalletBalance, apiUserWallet } from '/@/api/modules/business/player.api'


const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editInfo: {
    type: Object,
    default: () => { }
  }
})

const ruleForm = ref('')
const isLoading = ref(false)
const showPwd = ref(false)
const loading = ref(true)
const show = ref(true)
const form = reactive({
  action: 'deposit',
  currency: '',
  amount: '',
  safeword: ''
})
const currMoney = computed(() => {
  let num = userDetail.value.amount || 0;
  if (form.action == 'deposit') {
    num += Number(form.amount)
  } else {
    num -= Number(form.amount)
  }
  return isNaN(num) ? 0 : num;
})
const userDetail = ref({})
const trigger = ['blur', 'change']
const rules = {
  currency: [{ required: true, message: '', trigger }],
  amount: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}
const options = ref([])

const currencyChange = (currency) => {
  loading.value = true;
  apiWalletBalance({ partyid: props.editInfo.partyid, currency }).then(res => {
    userDetail.value = res ? res[0] : {};
    form.amount = ''
    ruleForm.value.clearValidate()
  }).finally(() => {
    loading.value = false;
  })
}

const init = () => {
  apiCurrency({ partyid: props.editInfo.partyid }).then(res => {
    options.value = res;
    if (res[0] && res[0].currency) {
      form.currency = res[0].currency;
      currencyChange(res[0].currency)
    }
  })
}
init()
const emit = defineEmits(['close', 'success'])

const showPwdDialog = () => {
  ruleForm.value.validate(valid => {
    if (valid) {
      showPwd.value = true;
    }
  })
}
// 显示弹框
const handleInnerDialog = () => {
  showPwd.value = false;
  isLoading.value = true
  apiUserWallet({
    partyid: props.editInfo.partyid,
    ...form
  }).then(res => {
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    emit('success', false)
  })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<style lang="scss">
.fund_edit {
  background: #ffffff;
  border-radius: 8px;

  .el-dialog__body {
    // height: 426px;
    padding: 54px 40px 0;

    .table_box {
      height: 100%;
    }

    .el-form {
      width: 100%;

      .el-form-item {
        .el-input {
          width: 360px;
          height: 40px;
        }
      }
    }
  }
}

.edit {
  .el-dialog__body {
    padding: 20px 20px 10px 20px;
  }
}
</style>
