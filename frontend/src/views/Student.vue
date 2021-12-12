<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ activeUser.email }}</h5>
          <p>{{ activeUser.firstName }} {{ activeUser.lastName }}</p>
        </div>
      </div>
      <div class="col2">
        <div v-if="assignments.length">
          <div v-for="assignment in assignments" :key="assignment.assignmentId" class="assignment">
            <h5>{{ assignment.title }}</h5>
            <span>{{ assignment.createdAt | formatDate }}</span>
            <ul>
              <li><a @click="editLottery(assignment)">Lottery</a></li>
              <li><a @click="listPoas(assignment)">POAS</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There is no assignment yet.</p>
        </div>
      </div>
    </section>

    <!-- full assignment modal -->
    <transition name="fade">
      <lottery-modal v-if="showAssignmentModal" :activeAssignment="this.activeAssignment" @close="closeAssignmentModal()">
      </lottery-modal>
    </transition>

    <transition name="fade">
      <poas-modal v-if="showPoasModal" @close="closePoasModal()">
      </poas-modal>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import AssignmentDataService from "../services/AssignmentDataService"
import LotteryModal from '../components/LotteryModal.vue'
import PoasModal from '../components/PoasList.vue'

export default {
  components: {
    LotteryModal,
    PoasModal
  },
  data() {
    return {
      assignments: [],
      showAssignmentModal: false,
      showPoasModal: false,
      activeAssignment: {},
    }
  },
  computed: {
    ...mapState(['activeUser', 'posts'])
  },
  methods: {
    getAssignments() {
      AssignmentDataService.getAll()
        .then(response => {
          this.assignments = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async editLottery(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showAssignmentModal = true
    },
    async listPoas(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showPoasModal = true
    },
    closeAssignmentModal() {
      this.showAssignmentModal = false
    },
    closePoasModal() {
      this.showPoasModal = false
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