<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>

    <div>
      <step-progress :steps="lotterySteps" :current-step="0" icon-class="fa fa-check"
        active-color="green" passive-color="grey"
        :active-thickness="4" :passive-thickness="3" :line-thickness="5">
      </step-progress>
    </div>

      <form @submit.prevent>
        <button @click="doLottery(activeAssignment)" class="button">Conduct lottery</button>
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
            {{ data.item.user.username }}
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
import TeacherAssignmentDataService from "../services/TeacherAssignmentDataService";

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
    async doLottery(assignment) {
      await TeacherAssignmentDataService.doLottery(assignment.assignmentId)
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