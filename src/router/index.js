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
        component: () => import('@/components/GrafanaPage/index'),
        name: 'Grafana',
        hidden: true,
        meta: { title: 'Grafana', icon: 'yicongrafana', noCache: false },
        props: true
      }
    ]
  },
  {
    path: '/manager',
    component: Layout,
    meta: { title: 'Monitor', icon: 'yicongrafana' },
    children: [
      {
        path: '/monitor',
        component: () => import('@/views/monitor/NodeList'),
        name: 'NodeList',
        meta: { title: 'NodeList', icon: 'yiconprometheusprometheusjiankongfuwu', noCache: false },
        props: true
      },
      {
        path: '/serviceMonitor',
        component: () => import('@/views/monitor/ServiceList'),
        name: 'ServiceList',
        meta: { title: 'ServiceList', icon: 'yiconprocess', noCache: false },
        props: true
      }
    ]
  },
  {
    path: '/bcControl',
    component: Layout,
    meta: { title: 'bcControl', icon: 'el-icon-set-up' },
    children: [
      {
        path: '/BCNewVerFileUpload',
        component: () => import('@/views/bc-control/BCNewVerFileUpload'),
        name: 'BCNewVerFileUpload',
        meta: { title: 'BCNewVerFileUpload', icon: 'el-icon-upload', noCache: false, roles: ['admin'] },
        props: true
      },
      {
        path: '/BCVersionManagement',
        component: () => import('@/views/bc-control/BCVersionManagement'),
        name: 'BCVersionManagement',
        meta: { title: 'BCVersionManagement', icon: 'yiconversions', noCache: false, roles: ['admin'] },
        props: true
      },
      {
        path: '/BCLogDownload',
        component: () => import('@/views/bc-control/BCLogDownload'),
        name: 'BCLogDownload',
        meta: { title: 'BCLogDownload', icon: 'el-icon-download', noCache: false },
        props: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: 'systemManage', icon: 'yiconsetting', roles: ['admin'] },
    children: [
      {
        path: '/userManagement',
        component: () => import('@/views/system/permission/UserManagement'),
        name: 'userManagement',
        meta: { title: 'userManagement', icon: 'el-icon-user', noCache: false },
        props: true
      },
      {
        path: '/roleManagement',
        component: () => import('@/views/system/permission/RoleManagement'),
        name: 'roleManagement',
        meta: { title: 'roleManagement', icon: 'yiconrole_icon', noCache: false },
        props: true
      },
      {
        path: '/configManagement',
        component: () => import('@/views/system/sys-config/ConfigManagement'),
        name: 'configManagement',
        meta: { title: 'configManagement', icon: 'yiconset_configure_hov', noCache: false },
        props: true
      },
      {
        path: '/systemLog',
        component: () => import('@/views/system/sys-log/LogViewer'),
        name: 'systemLog',
        meta: { title: 'systemLog', icon: 'yiconwulianwang-', noCache: false },
        props: true
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
