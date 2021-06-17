import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '/grafana',
    component: Layout,
    children: [
      {
        path: 'index/:url',
        component: () => import('@/modules/monitor/GrafanaPage/index'),
        name: 'Grafana',
        meta: { title: 'Grafana', icon: 'yicongrafana', noCache: false },
        hidden: true,
        props: true
      }
    ]
  },
  {
    path: '/monitorManager',
    component: Layout,
    meta: { title: 'Monitor', icon: 'yicongrafana', roles: ['admin'] },
    children: [
      {
        path: '/monitor',
        component: () => import('@/modules/monitor/NodeList'),
        name: 'NodeList',
        meta: { title: 'NodeList', icon: 'yiconprometheusprometheusjiankongfuwu', noCache: false }
      },
      {
        path: '/serviceMonitor',
        component: () => import('@/modules/monitor/ServiceList'),
        name: 'ServiceList',
        meta: { title: 'ServiceList', icon: 'yiconprocess', noCache: false }
      }
    ]
  },
  {
    path: '/bcControl',
    component: Layout,
    meta: { title: 'bcControl', icon: 'el-icon-set-up', roles: ['admin'] },
    children: [
      {
        path: '/BCNewVerFileUpload',
        component: () => import('@/modules/service-control/BCNewVerFileUpload'),
        name: 'BCNewVerFileUpload',
        meta: { title: 'BCNewVerFileUpload', icon: 'el-icon-upload', noCache: false, roles: ['admin'] }
      },
      {
        path: '/BCVersionManagement',
        component: () => import('@/modules/service-control/BCVersionManagement'),
        name: 'BCVersionManagement',
        meta: { title: 'BCVersionManagement', icon: 'yiconversions', noCache: false, roles: ['admin'] }
      },
      {
        path: '/BCLogDownload',
        component: () => import('@/modules/service-control/BCLogDownload'),
        name: 'BCLogDownload',
        meta: { title: 'BCLogDownload', icon: 'el-icon-download', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: 'systemManage', icon: 'el-icon-setting', roles: ['admin'] },
    children: [
      {
        path: '/userManagement',
        component: () => import('@/views/system/permission/UserManagement'),
        name: 'userManagement',
        meta: { title: 'userManagement', icon: 'el-icon-user', noCache: false }
      },
      {
        path: '/roleManagement',
        component: () => import('@/views/system/permission/RoleManagement'),
        name: 'roleManagement',
        meta: { title: 'roleManagement', icon: 'yiconrole_icon', noCache: false }
      },
      {
        path: '/configManagement',
        component: () => import('@/views/system/sys-config/ConfigManagement'),
        name: 'configManagement',
        meta: { title: 'configManagement', icon: 'yiconset_configure_hov', noCache: false }
      },
      {
        path: '/systemLog',
        component: () => import('@/views/system/sys-log/LogViewer'),
        name: 'systemLog',
        meta: { title: 'systemLog', icon: 'yiconwulianwang-', noCache: false }
      }
    ]
  },
  {
    path: '/maintenancePlan',
    component: Layout,
    meta: { title: 'maintenancePlan', icon: 'yiconjihua', roles: ['pm'] },
    children: [
      {
        path: '/mainPlanEdit',
        component: () => import('@/modules/maintenance/plan/mainPlanEdit'),
        name: 'mainPlanEdit',
        meta: { title: 'mainPlanEdit', icon: 'el-icon-document', noCache: false }
      },
      {
        path: '/achievementRate',
        component: () => import('@/modules/maintenance/plan/achievementRate'),
        name: 'achievementRate',
        meta: { title: 'achievementRate', icon: 'el-icon-document', noCache: false }
      }
    ]
  },
  {
    path: '/notification',
    component: Layout,
    meta: { title: 'notification', icon: 'el-icon-chat-line-round' },
    children: [
      {
        path: '/alarmList',
        component: () => import('@/views/notification/alarm/AlarmList'),
        name: 'alarmList',
        meta: { title: 'AlarmList', icon: 'el-icon-bell', noCache: false }
      },
      {
        path: '/AlarmSetting',
        component: () => import('@/views/notification/alarm/AlarmSetting'),
        name: 'AlarmSetting',
        meta: { title: 'AlarmSetting', icon: 'el-icon-notebook-1', noCache: false }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
