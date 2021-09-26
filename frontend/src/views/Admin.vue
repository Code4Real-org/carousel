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
        <h5>American High School</h5>
        <ul>
            <li><a @click="manageTeachers()">Teachers</a></li>
        </ul> 
      </div>
    </section>

    <!-- teachers list modal -->
    <transition name="fade">
      <teachers-list v-if="showTeachersList" @close="closeTeachersList()">
      </teachers-list>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import TeacherDataService from "../services/TeacherDataService"
import AssignmentModal from '../components/AssignmentModal.vue'
import TeachersList from '../components/TeachersList.vue'
import LotteryAdmin from '../components/LotteryAdmin.vue'

export default {
  components: {
    TeachersList,
  },
  data() {
    return {
      schools: [],
      showTeachersList: false,
      activeSchool: {}
    }
  },
  computed: {
    ...mapState(['activeUser', 'posts'])
  },
  methods: {
    getAssignments() {
      TeacherDataService.getAll()
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
    async manageTeachers(assignment) {
      // ToDo: change to school
      //this.activeAssignment = assignment
      //this.$store.dispatch('updateActiveAssignment', assignment)
      this.showTeachersList = true
    },
    closeTeachersList() {
      this.showTeachersList = false
    }
  },
  mounted() {
    // ToDo: load schools
    //this.getAssignments();
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