<template>
  <!--nav bar-->
  <div>
  <div class="navigator">
    <div class="left-side">
        <router-link to="/student">Dashboard</router-link>
    </div>
    <div class="right-side">
      <div class="dropdown">
        <button class="drop-button">Your Name</button>
        <div class="button">
          <a href="Settings.html">Settings</a>
          <a href="Help.html">Help</a>
          <a>Log Out</a>
        </div>
      </div>
    </div>
  </div>
  <!--dashboard-->
  <div class="tip">
  </div>
  <div class="header">
    <h2>Your Assigned Forms</h2>
  </div>
  <h2 class="quick-access-header">Quick Access:</h2>
  <div class="quick-access">
      <router-link class="recent-forms" to="/student/form">Your Recent Form</router-link>
  </div>
  <h2 class="forms-header">Forms:</h2>
  <div class="forms">
    <div class="active-form">active</div>
    <div class="active-form">active</div>
    <div class="inactive-form">inactive</div>
  </div>
  </div>
</template>

<script>
export default {
  name: "StudentDashboard"
}
</script>

<style scoped>

/* Navbar container */
.navigator {
  overflow: hidden;
  background-color: #000634ff;
  font-family: 'Montserrat', sans-serif;  
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

/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Dropdown button */
.dropdown .drop-button {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  /* Important for vertical align on mobile phones */
  margin: 0;
  /* Important for vertical align on mobile phones */
}

/* Add a purple background color to navbar links on hover */
.navigator .right-side a:hover,
.dropdown:hover .drop-button {
  background-color: #666666ff;
}

/*Add a purple background color to nav bar links on hover (left) */
.navigator .left-side a:hover {
  background-color: #666666ff;
}

/* Dropdown content (hidden by default) */
.button {
  display: none;
  position: absolute;
  min-width: 116px;
  background-color: #00235bff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.button a {
  float: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Show the dropdown menu on hover */
.dropdown:hover .button {
  display: block;
}


.header {
  background-color: #76a5afff;
  margin: 1% 7% 1% 7%;
  text-align: center;
  color: white;
  border-color: black;
  border-style: solid;
  border-width: 1px;
}

.quick-access-header {
  margin: 1% 10% 1% 10%;
}

.quick-access {
  margin: 1% 10% 1% 10%;
  text-align: center;
}

.recent-forms {
  padding: 5px;
  border-color: black;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  background-color: #b0cdd3ff;
  width: 100%;
  display: inline-block;
  margin: 1%;
  color: black;
  text-decoration: none;
  border-radius: 10px;

}

.recent-forms:hover {
  background-color: #76a5afff;
}
.folders-header {
  margin: 1% 10% 1% 10%;
}

.folders {
  margin: 1% 10% 1% 10%;
  text-align: center;
}

.folder-item {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  background-color: #b0cdd3ff;
  width: 21%;
  display: inline-block;
  margin: 1%;
  border-radius: 15px;
}

.forms-header {
  margin: 1% 10% 1% 10%;
}

.forms {
  margin: 1% 10% 1% 10%;
  text-align: center;
}

.active-form {
  background-color: #b0cdd3ff;
  width: 100%;
  padding: 10px;
  margin: 1%;
  border-radius: 10px;

}

.inactive-form {
  background-color: lightgray;
  width: 100%;
  padding: 10px;
  margin: 1%;
  border-radius: 10px;

}

</style>
