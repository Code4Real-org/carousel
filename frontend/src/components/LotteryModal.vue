<template>
  <div class="p-modal">
        <div class="p-container">
          <a @click="closeAssignmentModal()" class="close">close</a>
          <div class="post">
            <h3>{{ activeAssignment.title }}</h3>
            <span>{{ activeAssignment.createdAt | formatDate }}</span>
            <p>{{ activeAssignment.description }}</p>
            <br/>
            <a href="https://www.code4real.org/projects/student-instructions/" target="_blank">Instructions on how to enter POAS choices</a>
          </div>
          <b-form @submit.prevent>
            <div v-for="(entry, index) in lotteryEntries" :key="entry.id" class="comment">
              <h5>{{index + 1}}. Your choice of POAS (commonly known name):
                <button v-if="!isLocked" :disabled="delDisabled" @click="delEntry(index)">delete</button>
                <label v-if="(index + 1 == poasAssigned)" id="assigned">assigned</label>
              </h5>
              <input v-bind:class="{invalidPoas: entry.name == '*** POAS NOT FOUND ***' || entry.name == '*** AMBIGUOUS ENTRY ***'}" type="text" placeholder="name" id="name" v-model.trim.lazy="entry.name" required maxlength="100" :disabled="isLocked">
              <!--<input type="text" placeholder="Middle name" id="mname" v-model.trim.lazy="entry.middleName" required maxlength="32" :disabled="isLocked">
              <input type="text" placeholder="Last name" id="lname" v-model.trim.lazy="entry.lastName" required maxlength="64" :disabled="isLocked">-->
              <label v-if="poasStats[index] && poasStats[index][0] == -1" id="counter" width:50px><b><i>taken</i></b></label>
              <label v-else id="counter" v-for="(count, preference) in poasStats[index]" :key="index + preference" width:150px> Opt. {{preference+1}}: {{count}}</label>
              <p v-if="entry.wikiLink"> Wikipedia Page: <a :href = "entry.wikiLink" target="_blank"> {{entry.wikiLink}} </a></p>
              <p v-if="entry.wikiDescription"> {{entry.wikiDescription}}... </p>
              <br><br>
              <h5>What is the title of the (auto)biography? (limit of 100 characters)</h5>
              <input type="textarea" v-model.lazy="entry.biography" required maxlength="100" :disabled="isLocked">
              <h5>Your statement of significance for your choice: (limit of 250 characters)</h5>
              <b-textarea rows="1" max-rows="2" v-model.lazy="entry.statement" required maxlength="250" :disabled="isLocked">
              </b-textarea>
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
      saving: false,
      lotteryEntries: [],
      poasStats: [],
      poasAssigned: 0,
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
      if (this.saving) {
        return true;
      }
      for (let entry of this.lotteryEntries) {
        if (!entry.name) return true;
        if (entry.biography.length <= 1) return true;
        if (entry.statement.length <= 1) return true;
      }
      return false;
    },
    isLocked: function() {
      if ( (this.student != null) && (this.activeUser.id != this.student) ) {
        // should be a teacher, so do not lock it
        return false;
      }

      let state = this.activeAssignment.state;
      let poasAssigned = this.poasAssigned;
      return (state > 0 && !(state == 2 && poasAssigned == 0));
    },
  },
  methods: {
    addEntry() {
      this.lotteryEntries.push({
        name:'',
        //middleName:'',
        //lastName:'',
        wikiLink:'',
        wikiDescription:'',
        biography:'',
        statement:'',
        preference: this.lotteryEntries.length + 1
      });
    },
    delEntry(index) {
      this.lotteryEntries.splice(index, 1);
      this.poasStats.splice(index, 1);
      const len = this.lotteryEntries.length;
      for (let  i = index; i < len; i++) {
        this.lotteryEntries[i].preference = this.lotteryEntries[i].preference - 1;
      }
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
      this.saving = true;
      await LotteryDataService.create(assignment.assignmentId, this.lotteryEntries, this.student);
      const result = await LotteryDataService.getAll(this.activeAssignment.assignmentId, this.student);
      this.refresh(result);
      this.saving = false;
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

#id{
   font-size: 1.9em;
   background-color: #417a63;
}

.invalidPoas {
  color: red;
}
</style>
