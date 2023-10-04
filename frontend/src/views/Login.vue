<template>
  <div id="login">
    <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>
    <section>
      <div class="col1">
        <h1>Carousel</h1>
        <p>Welcome to the web-based lottery system for school assignments.</p>
        <br>
        <p>This application facilitates assigning class project topics by conducting a fair lottery.</p>
        <br>
        <p>Made in open source by <a href="https://code4real.org/" target="_blank">Code4Real</a>.</p>
      </div>

      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <h1>Welcome</h1>
          <p>Please sign in with your Google account.</p>
          <br>
          <p>For teachers: please use your Google account added to the system by the administrator.</p>
          <br>
          <p>For students: please use your school Google account.</p>
          <br>
          <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure">Login</GoogleLogin>
          <br>
      </div>
    </section>
  </div>
</template>

<script>
import GoogleLogin from 'vue-google-login'
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
    GoogleLogin,
    PasswordReset
  },
  data() {
    return {
      params: {
        client_id: "921798240468-7ef6ep21omf9pv15m4ilpa07patqjeio.apps.googleusercontent.com"
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 250,
        eight: 50,
        longtitle: true
      },
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: ''
      },
      showLoginForm: true,
      showPasswordReset: false
    }
  },
  methods: {
    onSuccess(googleUser) {
      console.log(googleUser);
      this.$store.dispatch('glogin', googleUser);
    },
    onFailure(error) {
      console.log("Google sign in failed: " + error)
      this.$alert("Google sign in failed.");
      
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        title: this.signupForm.title
      })
    }
  }
}
</script>