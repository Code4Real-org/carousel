<template>
  <div class="p-modal">
    <div class="p-container">
      <a id="closebutton" @click="$emit('close')">close</a>
      <h3>{{ assignment.title }}</h3>
      <span>{{ assignment.createdAt | formatDate }}</span>
       <br><br>
       <h5>Description</h5>
        <br>
        <textarea type="text" id="description" v-model.trim="assignment.description" required rows="5" cols="80"></textarea>
        <br><br><br>
       <h5>Configurations</h5>
       <label>Minimum number of lottery entries each student must submit: 
       <vue-numeric-input  v-model="assignment.minEntries" :min="1" :max="3" :step="1"></vue-numeric-input>
       </label>
       <br>
       <label>Maximum number of lottery entries each student can enter: 
       <vue-numeric-input  v-model="assignment.maxEntries" :min="3" :max="5" :step="1"></vue-numeric-input>
       </label>
       <br>
       <br>
      <button @click = "updateAssignment">Update</button>
    </div>
  </div>
</template>

<script>
import VueNumericInput from 'vue-numeric-input';
import { mapState } from 'vuex'
import moment from 'moment'
import AssignmentDataService from "../services/AssignmentDataService";

export default {
  components: {
    VueNumericInput
  },
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
      AssignmentDataService.update(this.assignment.assignmentId, this.assignment)
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



#closebutton{
  font-size: 1.5em;
  display: block;
  vertical-align: right;
  text-align: right;
}

</style>