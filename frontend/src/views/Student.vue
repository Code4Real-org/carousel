<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ activeUser.email }}</h5>
          <p>{{ activeUser.username }}</p>
        </div>
      </div>
      <div class="col2">
        <div v-if="assignments.length">
          <div v-for="assignment in assignments" :key="assignment.id" class="assignment">
            <h5>{{ assignment.title }}</h5>
            <span>{{ assignment.createdAt | formatDate }}</span>
            <ul>
              <li><a @click="editAssignment(assignment)">Edit full assignment</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- full assignment modal -->
    <transition name="fade">
      <div v-if="showAssignmentModal" class="p-modal">
        <div class="p-container">
          <a @click="closeAssignmentModal()" class="close">close</a>
          <div class="post">
            <h5>{{ activeAssignment.title }}</h5>
            <span>{{ activeAssignment.createdOn | formatDate }}</span>
            <p>{{ activeAssignment.description }}</p>
            <ul>
              <li><a>lotteries {{ activeAssignment.lotteries }}</a></li>
            </ul>
          </div>
          <div v-show="lotteryEntries.length" class="comments">
            <div v-for="entry in lotteryEntries" :key="entry.id" class="comment">
              <p>{{ entry.prompt}}</p>
              <span>{{ entry.createdOn | formatDate }}</span>
              <p>{{ entry.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import StudentAssignmentDataService from "../services/StudentAssignmentDataService"
import LotteryDataService from "../services/LotteryDataService"

export default {
  data() {
    return {
      assignments: [],
      showAssignmentModal: false,
      activeAssignment: {},
      lotteryEntries: []
    }
  },
  computed: {
    ...mapState(['activeUser', 'posts'])
  },
  methods: {
    getAssignments() {
      StudentAssignmentDataService.getAll()
        .then(response => {
          this.assignments = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    likePost(id, likesCount) {
      this.$store.dispatch('likePost', { id, likesCount })
    },
    async editAssignment(assignment) {
      this.lotteryEntries = await LotteryDataService.getAll(assignment.id)

      this.activeAssignment = assignment
      this.showAssignmentModal = true
    },
    closeAssignmentModal() {
      this.lotteryEntries = []
      this.showAssignmentModal = false
    }
  },
  mounted() {
    this.getAssignments();
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }

      //let date = val.toDate()
      let date = new Date(val)
      return moment(date).fromNow()
    },
    trimLength(val) {
      if (val.length < 200) { return val }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>