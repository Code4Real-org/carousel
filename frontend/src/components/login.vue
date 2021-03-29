<template>
  <div>
    <!-- <button v-google-signin-button="clientId" class="google-signin-button" data-onsuccess="onSignIn" data-scope="https://www.googleapis.com/auth/userinfo.profile">Register With Google</button> -->
  <button v-if="!authenticated" @click="login">Login</button>
  <div v-if="authenticated">
  <button @click="logout">Logout</button>
  <h1>Hi {{ firstName }}!</h1>
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
</style>
