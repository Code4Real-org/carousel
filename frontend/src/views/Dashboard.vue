<template>
  <div>
    <!-- <button v-google-signin-button="clientId" class="google-signin-button" data-onsuccess="onSignIn" data-scope="https://www.googleapis.com/auth/userinfo.profile">Register With Google</button> -->
  <button v-if="!authenticated" @click="login">Login</button>
  <div v-if="authenticated">
  <button @click="logout">Logout</button>
  <h1>Hi {{ firstName }}!</h1>
  </div>
  <div class="teacher">Teacher (Temp Pic)
    <div class="teacher_picture">
      <img src="https://i.pinimg.com/564x/9e/6f/f7/9e6ff7da87f11056c7cff3e2f525b9b9.jpg"/>
    </div>
  </div>
  <div class="student">Student (Temp Pic)
    <div class="student_picture">
        <img src="https://i.pinimg.com/originals/9b/33/42/9b3342ee4de416e533a5de91d388feb3.jpg"/>
    </div>
  </div>
  </div>
</template>


<script src="https://apis.google.com/js/platform.js" async defer></script>

<script>
</script>
<script>
import Firebase from '../firebase.js';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
      return {
        user: {
          loggedIn: false,
          data: {}
        }
      }
    },
    computed: {
        authenticated(){
          return this.user.loggedIn
        },
        firstName(){
          if (this.user.data.displayName) {
            return this.user.data.displayName.split(' ')[0]
          }
          return null
        }
    },
    methods: {
      login() {
        Firebase.login();
      },
      logout() {
        Firebase.logout()
      }
    },
    mounted() {
      Firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
        }
      })
    }
}
</script>

<style>
.google-signin-button {
  color: white;
  background-color: red;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  padding: 10px 20px 25px 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.teacher {
  width: 47%;
  height: 700px;
  background-color: #ccccccff;
  text-align: center;
  float: left;
  margin-left: 1%;
  margin-top: 2%;
  border: 1px solid black;
}

.student {
  width: 47%;
  height: 700px;
  background-color: #ccccccff;
  text-align: center;
  float: right;
  margin-right: 1%;
  margin-top: 2%;
  border: 1px solid black;
}

.teacher_picture {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: #eeeeeeff;
  margin: auto;
  margin-top: 25%;
  overflow: hidden;
  border: 1px solid black;
}

.teacher_picture img {
  width: auto;
  height: 100%;
  margin-left: -85px;
  -webkit-transition: all 1s ease;
   -moz-transition: all 1s ease;
   -o-transition: all 1s ease;
   -ms-transition: all 1s ease;
   transition: all 1s ease;
}

.teacher_picture img:hover {
  -webkit-filter: brightness(70%);
   filter: brightness(70%);
}
.student_picture {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: #eeeeeeff;
  margin: auto;
  margin-top: 25%;
  border: 1px solid black;
}

.student_picture img {
  width: auto;
  height: 100%;
  border-radius: 50%;
  -webkit-transition: all 1s ease;
   -moz-transition: all 1s ease;
   -o-transition: all 1s ease;
   -ms-transition: all 1s ease;
   transition: all 1s ease;
}

.student_picture img:hover {
  -webkit-filter: brightness(70%);
   filter: brightness(70%);
}
</style>
