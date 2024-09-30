import Layout from '/@/views/layout/index.vue'

export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Layout,
    icon: 'Console',
    hiddenChild: true,
    meta: { title: '首页' },
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("/@/views/dashboard/index.vue"),
        name: "Dashboard",
        icon: 'Console',
        meta: { title: '首页统计', auth: 0, noCache: true, }
      },
    ],
  },
  {
    path: '/users',
    component: Layout,
    name: 'users',
    icon: 'yewu',
    meta: { title: '用户', icon: 'devices' },
    children: [
      {
        path: '/AgentList',
        component: () => import('/@/views/users/agent/index.vue'),
        icon: 'Agent',
        name: 'AgentList',

        meta: { title: '代理商', auth: '101', noCache: true, }
      },
      {
        path: '/Player',
        component: () => import('/@/views/users/player/player.vue'),
        name: 'Player',
        icon: 'user',
        meta: { title: '用户', auth: '102', noCache: true, keepAlive: true}
      },
      {
        path: '/kycList',
        component: () => import('/@/views/users/kyc/index.vue'),
        name: 'kycList',
        icon: 'smrz',
        meta: { title: '实名认证审核', auth: '103',border:true  }
      },
    ]
  },
  {
    path: '/business',
    component: Layout,
    name: 'business',
    icon: 'yewu',
    meta: { title: '财务', icon: 'devices' },
    children: [
      {
        path: '/RechargeOrder',
        component: () => import('/@/views/finance/deposit/index.vue'),
        name: 'RechargeOrder',
        icon: 'RechargeOrder',
        meta: { title: '充值订单管理', auth: '111', noCache: true }
      },
      {
        path: '/cryptoList',
        component: () => import('/@/views/finance/crypto/index.vue'),
        name: 'cryptoList',
        icon: 'BetRecord',
        meta: { title: '平台加密货币充值地址', auth: '111' }
      },
      {
        path: '/withdrawlOrder',
        component: () => import('/@/views/finance/withdrawl/index.vue'),
        name: 'withdrawlOrder',
        icon: 'tx',
        meta: { title: '提现审核', auth: '112', noCache: true,border:true  }
      },
      {
        path: '/DepositOrder1',
        // component: () => import('/@/views/finance/withdrawl/index.vue'),
        name: 'DepositOrder2',
        icon: 'tx',
        meta: { title: '提现手续费配置', notopen: true , noCache: true }
      },
      {
        path: '/amount',
        component: () => import('/@/views/system/amount/index.vue'),
        name: 'Amount',
        icon: 'zhangbian',
        meta: { title: '账变记录', auth: '311',border:true  }
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    icon: 'FundsFlow',
    meta: { title: '交易', icon: 'devices' },
    children: [
      {
        path: '/orderPositions',
        component: () => import('/@/views/order/pos.vue'),
        name: 'orderPositions',
        icon: 'OperatorData',
        meta: { title: '股票持仓单', auth: '201', noCache: true }
      },
      {
        path: '/orderIndex',
        component: () => import('/@/views/order/index.vue'),
        name: 'orderIndex',
        icon: 'FundsFlow',
        meta: { title: '订单查询', auth: '201', noCache: true }
      },
      {
        path: '/test1',
        component: Layout,
        name: 'order',
        icon: 'FundsFlow',
        meta: { title: '量化交易订单',auth: '211', icon: 'devices',notopen:true,border:true },
      },
      {
        path: '/test2',
        component: Layout,
        name: 'order',
        icon: 'FundsFlow',
        meta: { title: '量化场控',auth: '212', icon: 'devices',notopen:true },
      },
      {
        path: '/test3',
        component: Layout,
        name: 'order',
        icon: 'FundsFlow',
        meta: { title: '合约订单', icon: 'devices',notopen:true ,border:true},
      },
      {
        path: '/test4',
        component: Layout,
        name: 'order',
        icon: 'FundsFlow',
        meta: { title: '合约场控',icon: 'devices',notopen:true },
      },
      {
        path: '/ipoIndex',
        component: () => import('/@/views/ipo/index.vue'),
        name: 'ipoIndex',
        icon: 'ipo',
        meta: { title: 'IPO中签管理', auth: '221',border:true }
      },
      {
        path: '/ipoCfg',
        component: () => import('/@/views/ipo/config.vue'),
        name: 'ipoCfg',
        icon: 'ipo2',

        meta: { title: 'IPO发行配置', auth: '222', noCache: true, }
      }
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'langhua1',
      //   meta: { title: '量化交易订单', noCache: true, }
      // },
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'langhua2',
      //   meta: { title: '量化场控', noCache: true, }
      // },
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'heyue1',
      //   meta: { title: '合约订单', noCache: true, }
      // },
      // {
      //   path: '/Agent',
      //   
      //   name: 'heyue2',
      //   icon:'Console',
      //   meta: { title: '合约场控', noCache: true, }
      // },
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'statistics',
    icon: 'sjdata',
    meta: { title: '数据', icon: 'devices' },
    children: [
      {
        path: '/whithdrawDeposit',
        component: () => import('/@/views/statistics/index.vue'),
        name: 'whithdrawDeposit',
        icon: 'cttj',
        meta: { title: '平台充提统计', auth: '301', noCache: true, }
      },
      {
        path: '/statisticsAgent',
        component: () => import('/@/views/statistics/agent.vue'),
        name: 'statisticsAgent',
        icon: 'AgentData',
        meta: { title: '代理商充提统计', auth: '302', noCache: true, }
      },
    ]
  },
  {
    component: Layout,
    icon: 'ParamsSet',
    meta: { title: '配置', icon: 'devices' },
    children: [
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'Agent',
      //   meta: { title: '系统配置', noCache: true, }
      // },
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'skzh',
      //   meta: { title: '平台收款账号', noCache: true, }
      // },
      {
        path: '/Stock',
        component: () => import('/@/views/stock/index.vue'),
        name: 'Stock',
        icon: 'gpk',
        meta: { title: '股票库', auth: '401' }
      },
      {
        path: '/exchange',
        component: () => import('/@/views/system/exchange/index.vue'),
        name: 'exchange',
        icon:'lianghua',
        meta: { title: '货币兑换汇率',auth: '402' }
      },
      // {
      //   path: '/Agent',
      //   
      //   name: 'Agent',
      //   icon:'heyue2',
      //   meta: { title: '合约股票池', noCache: true, }
      // },
    ]
  },
  {
    path: '/System',
    component: Layout,
    name: 'System',
    icon: 'sys',
    meta: { title: '系统', icon: 'devices' },
    children: [
      {
        path: '/ParamsSet',
        component: () => import('/@/views/system/params-set/index.vue'),
        name: 'ParamsSet',
        icon: 'ParamsSet',

        meta: { title: '参数设置', auth: '501', noCache: true }
      },
      // {
      //   path: '/SysParams',
      //   // component: () => import('/@/views/system/sys-params/index.vue'),
      //   name: 'SysParams',
      //   icon: 'SysParams',
      //   meta: { title: '系统参数(root)', noCache: true }
      // },
      {
        path: '/SysUsers',
        component: () => import('/@/views/system/users/index.vue'),
        name: 'SysUsers',
        icon: 'Player',

        meta: { title: '系统用户', auth: '511', noCache: true, subTitle: '系统用户' }
      },
      {
        path: '/Roles',
        component: () => import('/@/views/system/users/Roles.vue'),
        name: 'Roles',
        icon: 'Roles',

        meta: { title: '角色管理', auth: '512', noCache: true }
      },
      // {
      //   path: '/Service',
      //   component: () => import('/@/views/layout/components/service/index.vue'),
      //   name: 'Service',
      //   icon: 'Service',
      //   meta: { title: '客服管理', auth: '601', noCache: true }
      // },
      {
        path: '/OperationLog',
        component: () => import('/@/views/system/logs/index.vue'),
        name: 'OperationLog',
        icon: 'HistoryData',
        meta: { title: '操作日志', auth: '521', noCache: true, subTitle: '日志' }

      }
    ]
  }

]
