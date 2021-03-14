<template>
  <div>
    <button v-google-signin-button="clientId" class="google-signin-button" data-onsuccess="onSignIn" data-scope="https://www.googleapis.com/auth/userinfo.profile">Register With Google</button>
  </div>
</template>

<script src="https://apis.google.com/js/platform.js" async defer></script>

<script>

</script>
<script>
import UserDataService from "../services/UserDataService";
import GoogleSignInButton from 'vue-google-signin-button-directive'
export default {
  directives: {
    GoogleSignInButton
  },
  data() {
    return {
      clientId: '266665755285-1ko4rd39v8ke1criuutid8s65cgnlvve.apps.googleusercontent.com',
      clientSecret: 'BytajOPLflugjn2UcAiR2feR',
      user: {
        gid: "",
        fname: "bob",
        lname: "asdas",
      },
    };
  },
  methods: {
    
    OnGoogleAuthSuccess (idToken) {
      this.user.gid = idToken;
      var data = {
        gid: this.user.gid,
        fname: this.user.fname,
        lname: this.user.lname,
      };
      console.log(data);
      UserDataService.create(data)
          .then(response => {
            this.user.gid = response.data.gid;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
    },
    OnGoogleAuthFail (error) {
      console.log(error)
    },
    
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