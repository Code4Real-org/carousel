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
              <li><a @click="editAssignment(assignment)">Edit</a></li>
              <li><a @click="manageStudents(assignment)">Students</a></li>
              <li><a @click="conductLottery(assignment)">Lottery</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no assignments</p>
        </div>
      </div>
    </section>

    <!-- full assignment modal -->
    <transition name="fade">
      <assignment-modal v-if="showAssignmentModal" :activeAssignment="this.activeAssignment" @close="closeAssignmentModal()">
      </assignment-modal>
    </transition>

    <!-- students list modal -->
    <transition name="fade">
      <students-list v-if="showStudentsList" :activeAssignment="this.activeAssignment" @close="closeStudentsList()">
      </students-list>
    </transition>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import TeacherAssignmentDataService from "../services/TeacherAssignmentDataService"
import AssignmentModal from '../components/AssignmentModal.vue'
import StudentsList from '../components/StudentsList.vue'

export default {
  components: {
    AssignmentModal,
    StudentsList,
  },
  data() {
    return {
      assignments: [],
      showAssignmentModal: false,
      showStudentsList: false,
      activeAssignment: {}
    }
  },
  computed: {
    ...mapState(['activeUser', 'posts'])
  },
  methods: {
    getAssignments() {
      TeacherAssignmentDataService.getAll()
        .then(response => {
          this.assignments = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async editAssignment(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showAssignmentModal = true
    },
    closeAssignmentModal() {
      this.showAssignmentModal = false
    },
    async manageStudents(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showStudentsList = true
    },
    closeStudentsList() {
      this.showStudentsList = false
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