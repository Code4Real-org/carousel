<template>
  <div class="p-modal">
        <div class="p-container">
          <a @click="closeAssignmentModal()" class="close">close</a>
          <div class="post">
            <h3>{{ activeAssignment.title }}</h3>
            <span>{{ activeAssignment.createdAt | formatDate }}</span>
            <p>{{ activeAssignment.description }}</p>
          </div>
          <form @submit.prevent>
            <div v-for="(entry, index) in lotteryEntries" :key="entry.id" class="comment">
              <h4>{{index + 1}}.
                <button :disabled="delDisabled" @click="delEntry(index)">delete</button>
              </h4>
              <h5>Your choice of POAS (first, middle and last name):</h5>
              <input type="text" id="fname" v-model.lazy="entry.firstName" required>
              <input type="text" id="mname" v-model.lazy="entry.middleName">
              <input type="text" id="lname" v-model.lazy="entry.lastName" required>
              <label id="counter" v-for="(count, preference) in poasStats[index]" :key="index + preference">{{count}}</label>
              <h5>What is the title of the (auto)biography?</h5>
              <input type="text" v-model.lazy="entry.biography" required>
              <h5>Your statement of significance for your choice:</h5>
              <input type="text" v-model.lazy="entry.statement" required>
              <p>{{ entry.content }}</p>
            </div>
          </form>
          <br>
          <button :disabled="isMaxEntries" @click="addEntry">Add an entry</button>
          <button :disabled="submitDisabled" @click="submitEntries(activeAssignment)">Submit</button>
          <br>
        </div>
      </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import StudentAssignmentDataService from "../services/StudentAssignmentDataService"
import LotteryDataService from "../services/LotteryDataService"

export default {
  props: ['activeAssignment'],
  data() {
    return {
      assignments: [],
      showAssignmentModal: false,
      lotteryEntries: [],
      poasStats: []
    }
  },
  computed: {
    ...mapState(['activeUser']),
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
    }
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
    addEntry() {
      this.lotteryEntries.push({
        firstName:'',
        middleName:'',
        lastName:'',
        biography: '',
        statement:'',
        preference: this.lotteryEntries.length + 1
      })
    },
    delEntry(index) {
      this.lotteryEntries.splice(index, 1);
    },
    async submitEntries(assignment) {
      await LotteryDataService.create(assignment.id, this.lotteryEntries)
    },
    closeAssignmentModal() {
      this.lotteryEntries = []
      this.showAssignmentModal = false

      this.$emit('close')
    }
  },
  async mounted() {
    const result = await LotteryDataService.getAll(this.activeAssignment.id)
    this.lotteryEntries = result.data.lotteries
    this.poasStats = result.data.poasStats
    console.log("Stats: ", this.poasStats[0][0], this.poasStats[0][1])
    let count = this.lotteryEntries.length
    while (count < this.activeAssignment.minEntries) {
      this.addEntry()
      count++
    }

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