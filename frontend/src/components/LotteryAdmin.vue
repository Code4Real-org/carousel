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
        <b-row>
          <b-col lg="8">
        <div v-if="activeAssignment.state == 0">
          <button @click="lockLottery(activeAssignment)" class="button">Lock lottery entries</button>
        </div>
        <div v-else-if="activeAssignment.state == 1">
          <button @click="runLottery(activeAssignment)" class="button">Run lottery</button> &nbsp;&nbsp;
          <button @click="unlockLottery(activeAssignment)" class="button">Reopen lottery</button>
        </div>
        <div v-else-if="activeAssignment.state == 2">
          <button @click="resumeLottery(activeAssignment)" class="button">Resume lottery</button> &nbsp;&nbsp;
          <button @click="unlockLottery(activeAssignment)" class="button">Reopen lottery</button>
        </div>
        <div v-else-if="activeAssignment.state == 3">
          <button @click="unlockLottery(activeAssignment)" class="button">Reopen lottery</button>
        </div>
        <div v-else>
        </div>
        </b-col>
        <b-col lg="4">
        <button @click="refreshList(activeAssignment)" class="button">Refresh</button>
        </b-col>
        </b-row>
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
            {{ data.item.poa? data.item.poa.firstName + ' ' + data.item.poa.lastName :
              data.item.lotteries.length + ' entries' }}
          </template>
        </b-table>
      </div>
    <div b-col col lg="4">
      <div v-if="currentStudent">
        <transition name="fade">
          <lottery-modal :student="currentStudent.studentId" @close="closeStudentLotteryModal()">
          </lottery-modal>
        </transition>
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
import AssignmentDataService from "../services/AssignmentDataService"
import TeacherDataService from "../services/TeacherDataService"
import LotteryModal from '../components/LotteryModal.vue'

import StepProgress from 'vue-step-progress';
// import the css (OPTIONAL - you can provide your own design)
import 'vue-step-progress/dist/main.css';

export default {
  name: "lottery-admin",
  components: {
    'lottery-modal': LotteryModal,
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

    closeStudentLotteryModal() {
      this.currentStudent = null;
    },

    closeLotteryResult() {
      this.students = []

      this.$emit('close')
    }
  },
  async mounted() {
    const response = await AssignmentDataService.get(this.activeAssignment.assignmentId);
    this.$store.dispatch('updateActiveAssignment', response.data);

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