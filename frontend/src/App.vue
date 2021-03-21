<template>
  <div id="app">
    <nav class="navigator">
      <div class="left-side">
        <a>
          <router-link to="/" class="navbar-brand">Code4Real</router-link>
        </a>
        <a>
          <router-link to="/teacher" class="nav-link">Teacher</router-link>
        </a>
        <a>
          <router-link to="/student" class="nav-link">Student</router-link>
        </a>
      </div>
      <div class="right-side">
        <div class="dropdown">
          <div class="drop-button">
            Your Name
            <div class="button">
              <a href="Settings.html">Settings</a>
              <a href="Help.html">Help</a>
              <a>Log Out</a>
            </div>
          </div>
        </div>
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

/*Right side of nav bar */
.navigator .right-side {
  float: right;
}

/* Links inside navbar right */
.navigator .right-side a {
  float: left;
  display: none;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* The dropdown container */
.dropdown {
  float: right;
}

/* Dropdown button */
.drop-button {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

/* Add a purple background color to navbar links on hover */
.dropdown:hover .drop-button {
  background-color: #564154ff;
  display: block;
}

/*Add a purple background color to nav bar links on hover (left) */
.navigator .left-side a:hover {
  background-color: #564154ff;
}
</style>
