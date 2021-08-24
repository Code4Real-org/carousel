<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>
      <h3>{{ activeAssignment.title }}</h3>
      <span>{{ activeAssignment.createdAt | formatDate }}</span>
       <br><br>
       <h5>Description</h5>
        <textarea v-model.trim="description" rows="3" cols="80"></textarea>
        <br><br>
       <h5>Configurations</h5> 
        <p>Maximum number of lottery entries each student can enter: {{ activeAssignment.maxEntries }}</p>
        <br>
      <h5>Operations</h5>
      <form @submit.prevent>
        <button @click="doLottery(activeAssignment)" class="button">Conduct lottery</button>
      </form>

      <br>
      <upload-file></upload-file>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import TeacherAssignmentDataService from "../services/TeacherAssignmentDataService"
import UploadFile from "../components/UploadFile"

export default {
  props: ['activeAssignment'],
  components: {
    UploadFile
  },
  data() {
    return {
      description: '',
      lotteryEntries: []
    }
  },
  computed: {
    ...mapState(['activeUser'])
  },
  methods: {
    async doLottery(assignment) {
      await TeacherAssignmentDataService.doLottery(assignment.id)
    },
    closeAssignmentModal() {
      this.lotteryEntries = []

      this.$emit('close')
    }
  },
  async mounted() {
    this.description = this.activeAssignment.description
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