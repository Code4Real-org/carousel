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
            <!--<ul> -->
            <v-card class = "f">
              <a @click="editAssignment(assignment)"><div class = "ic"> Edit <div width = "70px" height = "70px" class = "rounded-circle bg-white"><img thumbnail fluid src="./../assets/edit.png" height="40px" alt="Edit"></div> </div></a>
              <a @click="manageStudents(assignment)"><div class = "ic"> Students <img thumbnail fluid src="./../assets/student.png" height="40px" class = "rounded-circle bg-white" alt="Student"></div></a>
              <a @click="adminLottery(assignment)"><div class = "ic">Lottery <img thumbnail fluid src="./../assets/lottery.png" height="40px" class = "rounded-circle bg-white" alt="Lottery"></div></a>
            </v-card>
            <!--</ul>-->
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no assignments</p>
        </div>
      </div>
    </section>

    <!-- full assignment modal -->
    <transition name="fade">
      <assignment-modal v-if="showAssignmentModal" @close="closeAssignmentModal()">
      </assignment-modal>
    </transition>

    <!-- students list modal -->
    <transition name="fade">
      <students-list v-if="showStudentsList" :activeAssignment="this.activeAssignment" @close="closeStudentsList()">
      </students-list>
    </transition>

    <!-- lottery admin modal -->
    <transition name="fade">
      <lottery-admin v-if="showLotteryAdmin" :activeAssignment="this.activeAssignment" @close="closeLotteryAdmin()">
      </lottery-admin>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import TeacherDataService from "../services/TeacherDataService"
import AssignmentModal from '../components/AssignmentModal.vue'
import StudentsList from '../components/StudentsList.vue'
import LotteryAdmin from '../components/LotteryAdmin.vue'

export default {
  components: {
    AssignmentModal,
    StudentsList,
    LotteryAdmin
  },
  data() {
    return {
      assignments: [],
      showAssignmentModal: false,
      showStudentsList: false,
      showLotteryAdmin: false,
      activeAssignment: {}
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
    async manageStudents(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showStudentsList = true
    },
    closeStudentsList() {
      this.showStudentsList = false
    },
    async adminLottery(assignment) {
      this.activeAssignment = assignment
      this.$store.dispatch('updateActiveAssignment', assignment)
      this.showLotteryAdmin = true
    },
    closeLotteryAdmin() {
      this.showLotteryAdmin = false
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
