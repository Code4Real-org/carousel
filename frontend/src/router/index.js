import Vue from "vue";
import Router from "vue-router";
import store from "../store"
import Dashboard from '../views/Dashboard.vue'

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: true
        }
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue")
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import( /* webpackChunkName: "settings" */ '../views/Settings.vue'),
        meta: {
          requiresAuth: true
        }
    },
    {
      path: "/student",
      alias: "/student/dashboard",
      name: "student-dashboard",
      component: () => import("../views/Student.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/teacher",
      alias: "/teacher/dashboard",
      name: "teacher-dashboard",
      component: () => import("../views/Teacher"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/admin",
      alias: "/admin/dashboard",
      name: "admin-dashboard",
      component: () => import("../views/Admin"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/student/form",
      name: "student-form",
      component: () => import("../components/StudentForm"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/teacher/form",
      name: "teacher-form",
      component: () => import("../components/TeacherForm"),
      meta: {
        requiresAuth: true
      }
    }
];

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes
});

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !store.state.activeUser.email) {
    next('/login')
  } else {
    next()
  }
});

export default router;