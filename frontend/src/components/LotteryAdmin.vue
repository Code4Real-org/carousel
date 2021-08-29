<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>

  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search by name"
          v-model="name"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchName"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <h5>Operations</h5>
      <form @submit.prevent>
        <button @click="doLottery(activeAssignment)" class="button">Conduct lottery</button>
      </form>
      <br><br>

    <div class="col-lg-8">
      <h4>Students lottery result</h4>
      <div>
        <b-table striped hover sticky-header="600px" :items="students" :fields="fields"></b-table>
      </div>

      <button class="m-3 btn btn-sm btn-danger" @click="removeAllStudents">
        Remove All
      </button>
    </div>
    <div class="col-lg-4">
      <div v-if="currentStudent">
        <h4>Student</h4>
        <div>
          <label><strong>Name:</strong></label> {{ currentStudent.userId }}
        </div>
        <div>
          <label><strong>POAS:</strong></label> 
          {{ currentStudent.poa? currentStudent.poa.firstName + ' ' + currentStudent.poa.lastName: '' }}
        </div>

        <router-link :to="'/students/' + currentStudent.id" class="badge badge-warning">Edit</router-link>
      </div>
      <div v-else>
        <br />
        <p>Please click on a Student...</p>
      </div>
    </div>
  </div>

  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StudentDataService from "../services/StudentDataService";
import TeacherAssignmentDataService from "../services/TeacherAssignmentDataService";

export default {
  name: "students-list",
  data() {
    return {
      fields: ['userId', 'poa.id'],
      students: [],
      currentStudent: null,
      currentIndex: -1,
      name: ""
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {
    async doLottery(assignment) {
      await TeacherAssignmentDataService.doLottery(assignment.id)
    },
    retrieveLotteryResult(assignmentId) {
      TeacherAssignmentDataService.showLottery(assignmentId)
        .then(response => {
          this.students = response.data;
          console.log(this.students);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveLotteryResult();
      this.currentStudent = null;
      this.currentIndex = -1;
    },

    setActiveStudent(student, index) {
      this.currentStudent = student;
      this.currentIndex = index;
    },

    removeAllStudents() {
      StudentDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchName() {
      StudentDataService.findByName(this.name)
        .then(response => {
          this.tutorials = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    closeLotteryResult() {
      this.students = []

      this.$emit('close')
    }
  },
  mounted() {
    this.retrieveLotteryResult(this.activeAssignment.id);
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>