import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router'
import UserDataService from "../services/UserDataService";
import LotteryDataService from "../services/LotteryDataService";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeUser: {},
    userProfile: {},
    posts: []
  },
  mutations: {
    setActiveUser(state, val) {
      state.activeUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
    setLotteries(state, val) {
      state.posts = val
    }
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async glogin({ commit }, gUser) {
      // This only gets the user information: id, name, imageUrl and email
      console.log(gUser.getBasicProfile());
      // sign user in
      const token = gUser.getAuthResponse().id_token;
      const gmail = gUser.getBasicProfile().getEmail();
      const response = await UserDataService.signin({email: gmail, credential: token});
      commit('setActiveUser', response.data);

      router.push('/')
    },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      })

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      commit('setUserProfile', {})

      // redirect to login view
      router.push('/login')
    },
    async fetchLotteryList({ commit }, user) {
      LotteryDataService.getAll()
        .then(response => {
          store.commit('setLotteries', response.data);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });

      // fetch lottery list
      //const lotteryList = await fb.usersCollection.doc(user.uid).get()

      // realtime firebase
      /*
      fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        let lotteriesArray = []

        snapshot.forEach(doc => {
          let lottery = doc.data()
          lottery.id = doc.id

          lotteriesArray.push(lottery)
        })

        store.commit('setLotteries', lotteriesArray)
      })
      */

      // set user profile in state
      //commit('setLotteryList', lotteryList.data())
    },
    async createPost({ state, commit }, lottery) {
      var data = {
        title: "title",
        description: "description",
        content: lottery.content
      };

      LotteryDataService.create(data)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    /*
    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      })
    },
    */
    async likePost ({ commit }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get()
      if (doc.exists) { return }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      })
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid
      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title
      })

      dispatch('fetchUserProfile', { uid: userId })

      // update all posts by user
      const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        })
      })

      // update all comments by user
      const commentDocs = await fb.commentsCollection.where('userId', '==', userId).get()
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    }
  }
})

export default store
