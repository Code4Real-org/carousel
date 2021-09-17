<template>
  <div class="p-modal">
        <div class="p-container">
          <a @click="closeAssignmentModal()" class="close">close</a>
          <div class="post">
            <h3>{{ activeAssignment.title }}</h3>
            <span>{{ activeAssignment.createdAt | formatDate }}</span>
            <p>{{ activeAssignment.description }}</p>
          </div>
          <b-form @submit.prevent>
            <div v-for="(entry, index) in lotteryEntries" :key="entry.id" class="comment">
              <h4>{{index + 1}}.
                <div v-if="!isLocked">
                  <button :disabled="delDisabled" @click="delEntry(index)">delete</button>
                </div>
                <div v-else-if="(index + 1 == poasAssigned)">
                  <p id="assigned">assigned</p>
                </div>
              </h4>
              <h5>Your choice of POAS (first, middle and last name):</h5>
              <input type="text" id="fname" v-model.trim.lazy="entry.firstName" required :disabled="isLocked">
              <input type="text" id="mname" v-model.trim.lazy="entry.middleName" :disabled="isLocked">
              <input type="text" id="lname" v-model.trim.lazy="entry.lastName" required :disabled="isLocked">
              <label id="counter" v-for="(count, preference) in poasStats[index]" :key="index + preference" width:100px> Choice {{preference+1}}: {{count}}</label>
              <h5>What is the title of the (auto)biography?</h5>
              <input type="text" v-model.lazy="entry.biography" required :disabled="isLocked">
              <h5>Your statement of significance for your choice:</h5>
              <input type="text" v-model.lazy="entry.statement" required :disabled="isLocked">
              <p>{{ entry.content }}</p>
            </div>
          </b-form>
          <br>
          <div v-if="!isLocked">
          <b-row>
          <b-col>
            <button :disabled="isMaxEntries" @click="addEntry">Add an entry</button>
          </b-col>
          &nbsp;&nbsp;
          <b-col>
            <button :disabled="submitDisabled" @click="submitEntries(activeAssignment)">Save</button>
          </b-col>
          </b-row>
          </div>
          <br>
        </div>
      </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import AssignmentDataService from "../services/AssignmentDataService"
import LotteryDataService from "../services/LotteryDataService"

export default {
  props: ['student'],
  data() {
    return {
      showAssignmentModal: false,
      lotteryEntries: [],
      poasStats: [],
      poasAssigned: 0
    }
  },
  computed: {
    ...mapState(['activeUser', 'activeAssignment']),
    isMaxEntries: function() {
      return this.lotteryEntries.length >= this.activeAssignment.maxEntries
    },
    delDisabled: function() {
      return this.lotteryEntries.length <= this.activeAssignment.minEntries
    },
    submitDisabled: function() {
      for (let entry of this.lotteryEntries) {
        if (!entry.firstName || !entry.lastName) return true;
        if (entry.biography.length <= 1) return true;
        if (entry.statement.length <= 1) return true;
      }
      return false;
    },
    isLocked: function() {
      if (this.activeUser.id != this.student) {
        // should be a teacher, so do not lock it
        return false;
      }

      let state = this.activeAssignment.state;
      let poasAssigned = this.poasAssigned;
      return (state > 0 && !(state == 2 && poasAssigned == 0));
    }
  },
  methods: {
    addEntry() {
      this.lotteryEntries.push({
        firstName:'',
        middleName:'',
        lastName:'',
        biography: '',
        statement:'',
        preference: this.lotteryEntries.length + 1
      });
    },
    delEntry(index) {
      this.lotteryEntries.splice(index, 1);
      this.poasStats.splice(index, 1);
    },
    refresh(result) {
      this.poasAssigned = result.data.poasAssigned;
      this.lotteryEntries = result.data.lotteries;
      this.poasStats = result.data.poasStats;
      let count = this.lotteryEntries.length;
      while (count < this.activeAssignment.minEntries) {
        this.addEntry();
        count++;
      }
    },
    async submitEntries(assignment) {
      await LotteryDataService.create(assignment.assignmentId, this.lotteryEntries, this.student);
      const result = await LotteryDataService.getAll(this.activeAssignment.assignmentId, this.student);
      this.refresh(result);
    },
    closeAssignmentModal() {
      this.lotteryEntries = []
      this.showAssignmentModal = false

      this.$emit('close')
    }
  },
  async mounted() {
    const response = await AssignmentDataService.get(this.activeAssignment.assignmentId);
    this.$store.dispatch('updateActiveAssignment', response.data);

    let result = [];
    if (this.student) {
      result = await LotteryDataService.getAll(this.activeAssignment.assignmentId, this.student);
    } else {
      result = await LotteryDataService.getAll(this.activeAssignment.assignmentId);
    }
    this.refresh(result);
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

<style scoped>

/* Navbar container */
#assigned {
  overflow: hidden;
  background-color: #417a63;
  color: white;
  text-align: center;
  border-radius: 5px;
  
  font-family: 'Montserrat', sans-serif;  
}


</style>
