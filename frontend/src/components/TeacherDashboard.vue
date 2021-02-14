<template>
  <!--nav bar-->
  <div>
  <div class="navigator">
    <div class="left-side">
      <a href="/teacher">Return to Dashboard</a>
    </div>
    <div class="right-side">
      <div class="dropdown">
        <button class="drop-button">Your Name
        </button>
        <div class="button">
          <a href="Setting.html">Settings</a>
          <a href="Help.html">Help</a>
          <a>Log Out</a>
        </div>
      </div>
    </div>
  </div>
  <!--dashboard-->
  <div class="tip-dropdown">
      <span>
        <p class="tip-dropdown">+</p>
        </span>
    <div class="tip-dropdown-content">
        <router-link to="/teacher/form" class="nav-link">Create New Form</router-link>
    </div>
  </div>
  <div class="header">
    <h2>Your Created Forms</h2>
  </div>
  <h2 class="quick-access-header">Quick Access: </h2>
  <div class="quick-access">
    <div class="recent-forms">
      <p>Most Recent 1</p>
    </div>
    <div class="recent-forms">
      <p>Most Recent 2</p>
    </div>
  </div>
  <h2 class="folders-header">Folders: </h2>
  <div class="folders">
    <div class="folder-item">
      <p>Folder 1</p>
    </div>
    <div class="folder-item">
      <p>Folder 2</p>
    </div>
    <div class="folder-item">
      <p>Folder 3</p>
    </div>
    <div class="folder-item">
      <p>Folder 4</p>
    </div>
  </div>
  <h2 class="forms-header">Forms: </h2>
  <div class="forms">
    <div class="form-item">
      form
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "TeacherDashboard.vue"
}
</script>

<style scoped>

/* background color */
body {
  background-color: #f5f7e9ff;
  font-family: 'Varela Round', sans-serif;
}

/* Navbar container */
.navigator {
  overflow: hidden;
  background-color: #779fa1ff;
  font-family: Varela Round;
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
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* The dropdown container */
.dropdown {
  float: left;
  overflow: auto;
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
  background-color: #564154ff;
}

/*Add a purple background color to nav bar links on hover (left) */
.navigator .left-side a:hover {
  background-color: #564154ff;
}

/* Dropdown content (hidden by default) */
.button {
  display: none;
  position: absolute;
  background-color: #779fa1ff;
  min-width: 121px;
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

/* box for form */
#form {
  width: 850px;
  height: 850px;
  background-color: #e1caabff;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
  margin-bottom: 1%;
}

/* box for title */
#title {
  width: 600px;
  height: 40px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
}

/* box for description */
#description {
  width: 600px;
  height: 40px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

/* box for x-button */
.x-button {
  width: 20px;
  height: 20px;
  background-color: #c95237ff;
  float: right;
}

/* letter in the x-button */
.x-button a {
  float: none;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center;
}
/*.create-form{
  float: right;
  text-align: center;
  width: 60px;
  height: 60px;
  background-color: #d0c4b4ff;
  border-radius: 25px;
  color: white;
  margin-top: 1.5%;
  margin-right: 1%;
  text-decoration: none;
  font-size: 38pt;
}
.create-form:hover{
  background-color: #654321;
}
*/
/* box for question */
#questions {
  width: 600px;
  height: 100px;
  background-color: #eeeeeeff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%
}

.header {
  background-color: #deb887ff;
  margin: 1% 7% 1% 7%;
  text-align: center;
  color: ivory;
  border-color: black;
  border-style: solid;
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
  text-align: center;
  background-color: #ede1d1ff;
  width: 45%;
  display: inline-block;
  margin: 1%;
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
  text-align: center;
  background-color: #eeeeeeff;
  width: 21%;
  display: inline-block;
  margin: 1%;
  border-radius: 15px;

}

.forms-header {
  margin: 1% 10% 1% 10%;
}

.forms{
  margin: 1% 10% 1% 10%;
  text-align: center;
}

.form-item{
  background-color: #e1caabff;
  width: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
}

.tip-dropdown {
  float: right;
  text-align: center;
  width: 60px;
  height: 60px;
  background-color: #d0c4b4ff;
  border-radius: 25px;
  color: white;
  margin-top: 1.5%;
  margin-right: 1%;
  text-decoration: none;
  font-size: 38pt;
}

.tip-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 30px;
  font-size: 10pt;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
  color: white;
}

.tip-dropdown:hover .tip-dropdown-content {
  display: inline;
  background-color: gray;
  color: white;

}
a:link {
  text-decoration: none;
  color: white;
}

</style>