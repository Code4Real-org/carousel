<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>

    <div>
      <step-progress :steps="lotterySteps" :current-step="activeAssignment.state" icon-class="fa fa-check"
        active-color="green" passive-color="grey"
        :active-thickness="4" :passive-thickness="3" :line-thickness="5">
      </step-progress>
    </div>
      <br>
      <form @submit.prevent>
        <div v-if="activeAssignment.state == 0">
          <button @click="lockLottery(activeAssignment)" class="button">Lock lottery entries</button>
        </div>
        <div v-else-if="activeAssignment.state == 1">
          <button @click="runLottery(activeAssignment)" class="button">Run lottery</button> &nbsp;&nbsp;
          <button @click="unlockLottery(activeAssignment)" class="button">Reopen lottery</button>
        </div>
        <div v-else-if="activeAssignment.state == 2">
          <button @click="resumeLottery(activeAssignment)" class="button">Resume lottery</button> &nbsp;&nbsp;
          <button @click="runLottery(activeAssignment)" class="button">Rerun lottery</button> &nbsp;&nbsp;
          <button @click="unlockLottery(activeAssignment)" class="button">Reopen lottery</button>
        </div>
        <div v-else-if="activeAssignment.state == 3">
          <button @click="refreshList(activeAssignment)" class="button">Refresh results</button>
        </div>
        <div v-else>
        </div>
      </form>
      <br>

      <div b-col col lg="4">
        <h5>Lottery result</h5>
        <b-table striped hover sticky-header="600px" :items="students" :fields="fields"
          :select-mode="selectMode"
          selectable
          @row-selected="onStudentSelected">
          <!-- A virtual column -->
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <!-- A virtual composite column -->
          <template #cell(student)="data">
            {{ data.item.Student.username }}
          </template>
          <!-- Another virtual composite column -->
          <template #cell(poas)="data">
            {{ data.item.poa? data.item.poa.firstName + ' ' + data.item.poa.lastName: '' }}
          </template>
        </b-table>

        <button class="btn btn-sm btn-danger" @click="removeAllStudents">
          Remove All
        </button>
      </div>
    <div b-col col lg="4">
      <div v-if="currentStudent">
        <h4>Student</h4>
        <div>
          <label><strong>Name:</strong></label> {{ currentStudent.userId }}
        </div>
        <div>
          <label><strong>POAS:</strong></label> 
          {{ currentStudent.poa? currentStudent.poa.firstName + ' ' + currentStudent.poa.lastName: '' }}
        </div>

        <router-link :to="'/students/' + currentStudent.userId" class="badge badge-warning">Edit</router-link>
      </div>
      <div v-else>
        <br />
        <p>Please click on a Student...</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StudentDataService from "../services/StudentDataService";
import TeacherDataService from "../services/TeacherDataService";

import StepProgress from 'vue-step-progress';
// import the css (OPTIONAL - you can provide your own design)
import 'vue-step-progress/dist/main.css';

export default {
  name: "lottery-admin",
  components: {
    'step-progress': StepProgress
  },
  data() {
    return {
      fields: [
        'index',
        { key: 'student', label: 'Student Name' },
        { key: 'poas', label: 'POAS Assigned' }
      ],
      selectMode: 'single',
      students: [],
      currentStudent: null,
      lotterySteps: ['Open', 'Locked', "In progress", "Completed"]
    };
  },
  computed: {
    ...mapState(['activeAssignment'])
  },
  methods: {
    async lockLottery(assignment) {
      const response = await TeacherDataService.lockLottery(assignment.assignmentId);
      let updatedAssignment = response.data;
      this.$store.dispatch('updateActiveAssignment', updatedAssignment);
    },

    async unlockLottery(assignment) {
      const response = await TeacherDataService.unlockLottery(assignment.assignmentId);
      let updatedAssignment = response.data;
      this.$store.dispatch('updateActiveAssignment', updatedAssignment);
    },

    async runLottery(assignment) {
      const response = await TeacherDataService.runLottery(assignment.assignmentId);
      let updatedAssignment = response.data;
      this.$store.dispatch('updateActiveAssignment', updatedAssignment);
      this.refreshList();
    },

    async resumeLottery(assignment) {
      const response = await TeacherDataService.resumeLottery(assignment.assignmentId);
      let updatedAssignment = response.data;
      this.$store.dispatch('updateActiveAssignment', updatedAssignment);
      this.refreshList();
    },

    retrieveLotteryResult(assignmentId) {
      TeacherDataService.showLottery(assignmentId)
        .then(response => {
          this.students = response.data;
          console.log(this.students);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveLotteryResult(this.activeAssignment.assignmentId);
      this.currentStudent = null;
    },

    onStudentSelected(items) {
      this.currentStudent = items[0];
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

    closeLotteryResult() {
      this.students = []

      this.$emit('close')
    }
  },
  mounted() {
    this.retrieveLotteryResult(this.activeAssignment.assignmentId);
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