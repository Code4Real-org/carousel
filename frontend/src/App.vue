<template>
  <div id="app">
    <nav class="navigator">
      <div class="left-side">
        <a>
          <router-link to="/" class="navbar-brand">Code4Real</router-link>
          <router-link to="/teacher" class="nav-link">Teacher</router-link>
          <router-link to="/student" class="nav-link">Student</router-link>
        </a>
      </div>    
    </nav>
    
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
/* Navbar container */
.navigator {
  overflow: hidden;
  background-color: #779fa1ff;
  font-family: Varela Round, sans-serif;
}

/* Links inside the navbar left */
.navigator .left-side a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
</style>
