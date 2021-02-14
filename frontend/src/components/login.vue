<template>
  <div>
    <button v-google-signin-button="clientId" class="google-signin-button">Register With Google</button>
    <button @click="login">Auth</button>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
import GoogleSignInButton from 'vue-google-signin-button-directive'
export default {
  directives: {
    GoogleSignInButton
  },
  data() {
    return {
      clientId: '266665755285-1ko4rd39v8ke1criuutid8s65cgnlvve.apps.googleusercontent.com',
      tutorial: {
        id: null,
        googleid: ""
      },
      submitted: false
    };
  },
  methods: {
    OnGoogleAuthSuccess (idToken) {
      console.log(idToken);
      this.tutorial.googleid = idToken;
    },
    OnGoogleAuthFail (error) {
      console.log(error)
    },
    saveTutorial() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        googleid: this.tutorial.googleid,
      };

      TutorialDataService.create(data)
        .then(response => {
          this.tutorial.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    login() {
      TutorialDataService.login(this.tutorial.googleid)
        .then(response => {
          this.tutorials = response.data;
          console.log(response.data);
          console.log("googleid: " + this.tutorial.googleid);
        })
        .catch(e => {
          console.log(e);
        });
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