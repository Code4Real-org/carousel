<template>
  <div class="p-modal">
        <div class="p-container">
          <a @click="closeAssignmentModal()" class="close">close</a>
          <div class="post">
            <h3>{{ activeAssignment.title }}</h3>
            <span>{{ activeAssignment.createdAt | formatDate }}</span>
            <p>{{ activeAssignment.description }}</p>
          </div>
            <div v-for="(entry, counter) in lotteryEntries" :key="entry.id" class="comment">
              <h4>{{counter + 1}}. Your choice of POAS (first, middle and last name):</h4>
              <input type="text" v-model.lazy="entry.firstName" required>
              <input type="text" v-model.lazy="entry.middleName">
              <input type="text" v-model.lazy="entry.lastName" required>
              <h5>What is the title of the (auto)biography?</h5>
              <input type="text" v-model.lazy="entry.biography" required>
              <h5>Your statement of significance for your choice:</h5>
              <input type="text" v-model.lazy="entry.statement" required>
              <p>{{ entry.content }}</p>
            </div>
          <br>
          <button :disabled="isMaxEntries" @click="addEntry">Add an entry</button>
          <button @click="submitEntries(activeAssignment)">Submit</button>
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
      lotteryEntries: []
    }
  },
  computed: {
    ...mapState(['activeUser']),
    isMaxEntries: function() {
      return this.lotteryEntries.length >= this.activeAssignment.maxEntries
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
        statement:''
      })
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
    this.lotteryEntries = result.data
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