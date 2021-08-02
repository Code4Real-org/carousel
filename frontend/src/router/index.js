import Vue from "vue";
import Router from "vue-router";
import { auth } from '../firebase'

Vue.use(Router);

const routes = [
    {
      path: "/login",
      name: "login",
      component: () => import("../components/login")
    },
    {
      path: "/student",
      //alias: "/student/dashboard",
      name: "student-dashboard",
      component: () => import("../components/StudentDashboard"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/teacher",
      //alias: "/teacher/dashboard",
      name: "teacher-dashboard",
      component: () => import("../components/TeacherDashboard"),
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

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
});

export default router;