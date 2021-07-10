import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: () => import("./components/login")
    },
    {
      path: "/student",
      //alias: "/student/dashboard",
      name: "student-dashboard",
      component: () => import("./components/StudentDashboard")
    },
    {
      path: "/teacher",
      //alias: "/teacher/dashboard",
      name: "teacher-dashboard",
      component: () => import("./components/TeacherDashboard")
    },
    {
      path: "/student/form",
      name: "student-form",
      component: () => import("./components/StudentForm")
    },
    {
      path: "/teacher/form",
      name: "teacher-form",
      component: () => import("./components/TeacherForm")
    }
  ]
});
