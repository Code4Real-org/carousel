<template>
  <div class="p-modal">
    <div class="p-container">
      <a @click="$emit('close')">close</a>
      <h3>{{ assignment.title }}</h3>
      <span>{{ assignment.createdAt | formatDate }}</span>
       <br><br>
       <h5>Description</h5>
        <br>
        <textarea type="text" id="description" v-model.trim="assignment.description" required rows="5" cols="80"></textarea>
        <br><br><br>
       <h5>Configurations</h5> 
        <p>Maximum number of lottery entries each student can enter: {{ assignment.maxEntries }}</p>
        <p>Minimum number of lottery entries each student must submit: {{ assignment.minEntries }}</p>
        <br><br>
        <button @click = "updateAssignment">Update</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import AssignmentDataService from "../services/AssignmentDataService";

export default {
  data() {
    return {
      assignment: {}
    }
  },
  computed: {
    ...mapState(['activeUser', 'activeAssignment'])
  },
  methods: {
    closeAssignmentModal() {
      this.$emit('close')
    },

    updateAssignment() {
      var data = {
        title: this.assignment.title,
        description: this.assignment.description
      };

      AssignmentDataService.update(this.assignment.assignmentId, data)
        .then(response => {
          console.log(response.data);
          AssignmentDataService.getOne(this.assignment.assignmentId)
            .then(response => {
              this.assignment = response.data;
              this.$store.dispatch('updateActiveAssignment', response.data);
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });
    },
  },  
  async mounted() {
    this.assignment = this.activeAssignment
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