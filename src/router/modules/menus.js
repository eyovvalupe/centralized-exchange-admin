import Layout from '/@/views/layout/index.vue'

export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Layout,
    icon: 'home',
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
    icon: 'business',
    meta: { title: '业务' },
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
        meta: { title: '用户', auth: '102', noCache: true, keepAlive: true }
      },
      {
        path: '/kycList',
        component: () => import('/@/views/users/kyc/index.vue'),
        name: 'kycList',
        icon: 'smrz',
        meta: { title: '实名审核', auth: '103'}
      },
      {
        path: '/RechargeOrder',
        component: () => import('/@/views/finance/deposit/index.vue'),
        name: 'RechargeOrder',
        icon: 'RechargeOrder',
        meta: { title: '充值订单', auth: '111', noCache: true , border: true }
      },
      {
        path: '/withdrawlOrder',
        component: () => import('/@/views/finance/withdrawl/index.vue'),
        name: 'withdrawlOrder',
        icon: 'withdrawl',
        meta: { title: '提现订单', auth: '112', noCache: true }
      },
      // {
      //   path: '/xxx',
      //   name: 'withdrawlOrder',
      //   icon: 'tx',
      //   meta: { title: '市场活动配置', notopen: true, border: true, auth: '' }
      // },
      {
        path: '/c2cOrder',
        component: () => import('/@/views/c2c/order.vue'),
        name: 'c2cOrder',
        icon: 'c2cOrder',
        meta: { title: '买币历史订单', auth: '121',hidden:true}
      },
      {
        path: '/c2cOrderWs',
        component: () => import('/@/views/c2c/orderWs.vue'),
        name: 'c2cOrderWs',
        icon: 'c2cOrder',
        meta: { title: '买币订单', auth: '121',border: true}
      },
      {
        path: '/marketActivity',
        component: () => import('/@/views/c2c/orderWs.vue'),
        name: 'marketActivity',
        icon: 'marketActivity',
        meta: { title: '市场活动配置',notopen:true, border: true}
      },
      
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    icon: 'trade',
    meta: { title: '交易' },
    children: [
      {
        path: '/orderPositions',
        component: () => import('/@/views/order/pos.vue'),
        name: 'orderPositions',
        icon: 'OperatorData',
        meta: { title: '股票订单管理', auth: '201', noCache: true }
      },
      {
        path: '/orderIndex',
        component: () => import('/@/views/order/index.vue'),
        name: 'orderIndex',
        icon: 'OperatorData',
        meta: { title: '股票历史订单', auth: '201', noCache: true,hidden:true }
      },
      {
        path: '/contractPos',
        component: () => import('/@/views/contract/pos.vue'),
        name: 'contractPos',
        icon: 'heyue1',
        meta: { title: '合约订单管理', auth: '231', noCache: true, border: true }
      }, 
      {
        path: '/contractSearch',
        component: () => import('/@/views/contract/search.vue'),
        name: 'contractSearch',
        icon: 'heyue1',
        meta: { title: '合约历史订单', auth: '231', noCache: true, hidden: true }
      }, 
      
      {
        path: '/contractIndex',
        component: () => import('/@/views/contract/index.vue'),
        name: 'contractIndex',
        icon: 'Console',
        meta: { title: '合约场控', auth: '232', noCache: true, }
      },
      {
        path: '/aiPos',
        component: () => import('/@/views/ai/pos.vue'),
        name: 'aiPos',
        icon: 'Robots',
        meta: { title: '交易机器人持仓单', auth: '231', noCache: true, border: true }
      },
      {
        path: '/aiSearch',
        component: () => import('/@/views/ai/search.vue'),
        name: 'aiSearch',
        icon: 'oder2',
        meta: { title: '交易机器人订单查询', auth: '231', noCache: true,hidden:true }
      },
      {
        path: '/aiIndex',
        component: () => import('/@/views/ai/index.vue'),
        name: 'aiIndex',
        icon: 'Console',
        meta: { title: '交易机器人场控', auth: '231', noCache: true, }
      },
      {
        path: '/foreignOrder',
        component: () => import('/@/views/ai/pos.vue'),
        name: 'foreignOrder',
        icon: 'foreignOrder',
        meta: { title: '外贸订单管理', notopen:true,  noCache: true, border: true }
      },
      {
        path: '/foreignControl',
        component: () => import('/@/views/ai/search.vue'),
        name: 'foreignControl',
        icon: 'Console',
        meta: { title: '外贸场控', notopen:true, noCache: true }
      },
    ]
  },
  {
    path: '/ipo',
    component: Layout,
    name: 'ipo',
    icon: 'financial',
    meta: { title: '理财'},
    children: [
      {
        path: '/ipoIndex',
        component: () => import('/@/views/ipo/index.vue'),
        name: 'ipoIndex',
        icon: 'ipo',
        meta: { title: 'IPO订单管理', auth: '221' }
      },
      {
        path: '/ipoCfg',
        component: () => import('/@/views/ipo/config.vue'),
        name: 'ipoCfg',
        icon: 'ipo2',

        meta: { title: 'IPO发行配置', auth: '222', noCache: true, }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'statistics',
    icon: 'data',
    meta: { title: '数据' },
    children: [
      {
        path: '/whithdrawDeposit',
        component: () => import('/@/views/statistics/index.vue'),
        name: 'whithdrawDeposit',
        icon: 'cttj',
        meta: { title: '平台充提报表', auth: '301', noCache: true, }
      },
      {
        path: '/statisticsAgent',
        component: () => import('/@/views/statistics/agent.vue'),
        name: 'statisticsAgent',
        icon: 'AgentData',
        meta: { title: '代理商充提报表', auth: '302', noCache: true, }
      },

      {
        path: '/statisticsAgentMy',
        component: () => import('/@/views/statistics/agentMy.vue'),
        name: 'statisticsAgentMy',
        icon: 'AgentData2',
        meta: { title: '代理商(我的)业绩', auth: '304', noCache: true, }
      },
      {
        path: '/statisticsAgentUser',
        component: () => import('/@/views/statistics/agentUser.vue'),
        name: 'statisticsAgentUser',
        icon: 'AgentUserData',
        meta: { title: '用户数据报表', auth: '303', noCache: true, }
      },
      {
        path: '/amount',
        component: () => import('/@/views/system/amount/index.vue'),
        name: 'Amount',
        icon: 'zhangbian',
        meta: { title: '账变记录', auth: '311',border: true }
      },
    ]
  },

  {
    component: Layout,
    icon: 'setting',
    meta: { title: '配置' },
    children: [

      {
        path: '/Agent4',
        name: 'Agent4',
        icon: 'skzh',
        meta: { title: '提现手续费', noCache: true, notopen: true }
      },
      {
        path: '/cryptoList',
        component: () => import('/@/views/finance/crypto/index.vue'),
        name: 'cryptoList',
        icon: 'BetRecord',
        meta: { title: '平台充值地址', auth: '402' }
      },
      {
        path: '/cryptocurrency',
        component: () => import('/@/views/finance/crypto/index.vue'),
        name: 'cryptocurrency',
        icon: 'zhichi',
        meta: { title: '支持的加密货币', noCache: true, notopen: true }
      },
      {
        path: '/exchange',
        component: () => import('/@/views/system/exchange/index.vue'),
        name: 'exchange',
        icon: 'lianghua',
        meta: { title: '法币汇率', auth: '403' }
      },
      // {
      //   path: '/Stock',
      //   component: () => import('/@/views/stock/index.vue'),
      //   name: 'Stock',
      //   icon: 'gpk',
      //   meta: { title: '交易品种库', auth: '401' }
      // },
      {
        path: '/stockManage',
        name: 'stockManage',
        icon: 'gpk',
        component: () => import('/@/views/stock/manage.vue'),
        meta: { title: '股票', auth: '401', border: true }
      },
      {
        path: '/contract',
        component: Layout,
        component: () => import('/@/views/contract/manage.vue'),
        name: 'contract',
        icon: 'heyue2',
        meta: { title: '合约', auth: '403' },
      },
      {
        path: '/aiConfig',
        component: Layout,
        component: () => import('/@/views/aiConfig/manage.vue'),
        name: 'aiConfig',
        icon: 'Robots',
        meta: { title: '交易机器人', auth: '404' },
      },
      {
        path: '/foreignExchange',
        component: Layout,
        component: () => import('/@/views/aiConfig/manage.vue'),
        name: 'foreignExchange',
        icon: 'foreignOrder',
        meta: { title: '外汇', noCache: true, notopen: true  },
      },
      // {
      //   path: '/aiTimeConfig',
      //   component: Layout,
      //   component: () => import('/@/views/aiConfig/time.vue'),
      //   name: 'aiTimeConfig',
      //   icon: 'ParamsSet',
      //   meta: { title: '时间区间配置',auth: '402' },
      // },
      {
        path: '/c2cMerchant',
        component: () => import('/@/views/c2c/merchant.vue'),
        name: 'c2cMerchant',
        icon: 'c2cMerchant',
        meta: { title: '买币商户', auth: '121',border: true  }
      },
      {
        path: '/c2cAd',
        component: () => import('/@/views/c2c/ad.vue'),
        name: 'c2cAd',
        icon: 'c2cAd',
        meta: { title: '买币广告', auth: '121'}
      },
    ]
  },
  {
    path: '/System',
    component: Layout,
    name: 'System',
    icon: 'system',
    meta: { title: '系统' },
    children: [
      {
        path: '/ParamsSet',
        component: () => import('/@/views/system/params-set/index.vue'),
        name: 'ParamsSet',
        icon: 'ParamsSet',

        meta: { title: '系统参数(root)', auth: '501', noCache: true }
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
        meta: { title: '系统用户', auth: '511', noCache: true, border: true, subTitle: '系统用户' }
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
        meta: { title: '操作日志', auth: '521', border: true, noCache: true, subTitle: '日志' }

      }
    ]
  }

]
