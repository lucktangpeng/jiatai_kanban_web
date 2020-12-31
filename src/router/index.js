import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/view/part_one.vue'),
      children: [
        {
          path: 'board',
          name: 'board',
          component: () => import('@/components/board')
        }
      ]
    },
    {
      path: '/peijian',
      name: 'peijian',
      component: () => import('@/view/progress_peijian.vue')
    },
    {
      path: '/zhusu',
      name: 'zhusu',
      component: () => import('@/view/progress_zhusu.vue')
    },
    {
      path: '/wenkongqi',
      name: 'wenkongqi',
      component: () => import('@/view/progress_wenkongqi.vue')
    },
    {
      path: '/lianjieqi',
      name: 'lianjieqi',
      component: () => import('@/view/progress_lianjieqi.vue')
    },
    {
      path: '/yuanliao',
      name: 'yuanliao',
      component: () => import('@/view/part_yuanliao.vue')
    },
    {
      path: '/shunde',
      name: 'zhusu',
      component: () => import('@/view/part_shunde.vue')
    },
    // 成品原来的样式
    // {
    //   path: '/chenpin',
    //   name: 'zhusu',
    //   component: () => import('@/view/part_chenpin.vue')
    // },
    {
      path: '/chenpin',
      name: 'zhusu',
      component: () => import('@/view/part_chenpin_new.vue')
    },
    {
      path: '/wenkong_lianjie',
      name: 'wenkong_lianjie',
      component: () => import('@/view/progress_wenkong_lianjie.vue')
    },
	{
      path: '/four_wenkong',
      name: 'wenkong_lianjie',
      component: () => import('@/view/progress_four_wenkong_lianjie.vue')
    },
    {
      path: '/chenpin_new',
      name: 'chenpin_new',
      component: () => import('@/view/part_chenpin_new.vue')
    },
    {
      path: '/tuogong',
      name: 'tuogong',
      component: () => import('@/view/part_tuogong.vue')
    },
    {
      path: '/hege',
      name: 'hege',
      component: () => import('@/view/progress_hege.vue')
    },
	{
      path: '/five_shougong',
      name: 'five',
      component: () => import('@/view/progress_five_shougong.vue')
    }
  ]
})
