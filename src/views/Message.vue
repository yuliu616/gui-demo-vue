<template>
  <div>
    <div class="ui message" v-if="selectionModeEnabled">
      <div class="header">
        Selection Mode
      </div>
      <p>
        Please select message to be deleted.
      </p>
    </div>
    <div class="ui message" v-if="pageCount==0">
      <div class="header">
        Message List
      </div>
      <p>
        There is no message at all.
      </p>
    </div>
    <table class="ui tablet striped stackable table" v-show="pageCount > 0">

      <thead class="full-width">
        <tr>
          <th style="width: 5em;" v-if="selectionModeEnabled"></th>
          <th style="min-width: 7.2em; width: 10em;">Time</th>
          <th style="min-width: 7.2em;">Message</th>
          <th style="min-width: 8em; width: 12em;">View</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="message in pagedRowList">
          <td v-if="selectionModeEnabled">
            <div class="ui fitted toggle checkbox">
              <input type="checkbox" v-model="rowChecked[message.id]">
              <label></label>
            </div>
          </td>
          <td>{{ presentDate(message.time) }}</td>
          <td>{{ message.text }}</td>
          <td class="right aligned">{{ message.viewName }}</td>
        </tr>
      </tbody>
      
      <tfoot class="full-width">
        <tr>
          <th colspan="999">
            <div class="ui compact menu" v-show="!selectionModeEnabled">
              <div class="ui dropdown item">
                More
                <i class="dropdown icon"></i>
                <div class="menu">
                  <div class="item" v-on:click="onClearAllPressed()">
                    Clear messages
                  </div>
                  <div class="item" v-on:click="onSelectMessagePressed()">
                    Select messages ...
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectionModeEnabled">
              <button class="ui red button" v-on:click="onDeleteSelectedPressed()">
                Delete those selected
              </button>
              <button class="ui button" v-on:click="onAbortCurrentModePressed()">
                Abort
              </button>
            </div>
            <div class="ui right floated pagination menu">
              <a class="icon item" 
                v-bind:class="{ 'disabled': !pagingButtonEnabled || currentPage<=0 }" 
                v-on:click="navToPage(0)">
                <i class="double left angle icon"></i>
              </a>
              <a class="icon item" 
                v-bind:class="{ 'disabled': !pagingButtonEnabled || currentPage<=0 }" 
                v-on:click="navToPage(currentPage-1)">
                <i class="left angle icon"></i>
              </a>
              <a class="item" 
                v-for="pageNum in pageNumListForSeeking" v-bind:key="pageNum"
                v-bind:class="{ 'active': pageNum-1==currentPage, 'disabled': !pagingButtonEnabled }"
                v-on:click="navToPage(pageNum-1)">
                {{ pageNum }}
              </a>
              <a class="icon item" 
                v-bind:class="{'disabled': !pagingButtonEnabled || currentPage>=lastPage}"
                v-on:click="navToPage(currentPage+1)">
                <i class="right angle icon"></i>
              </a>
            </div>
          </th>
        </tr>
      </tfoot>

    </table>
  </div>
</template>

<script>
import * as moment from 'moment';
import { takePage, calcPageCount } from '../util/TableHelper';
import { DateFormat } from '../util/DateHelper';

export default {
  name: 'Message',
  data() {
    return {
      currentPage: 0,
      pageSize: 10,
      selectionModeEnabled: false,
      rowChecked: {},
    };
  },
  computed: {
    tableRowList: self=>self.$store.state.messageStore.messageList.slice().reverse(),
    pagedRowList: self=>takePage(self.tableRowList, self.currentPage, self.pageSize),
    pageCount: self=>calcPageCount(self.tableRowList.length, self.pageSize),
    pageNumListForSeeking: self=>{
      // (return 1-based pageNum)
      // show only -2 to +2 of current page
      let out = [];
      for (let i=Math.max(self.currentPage-2, 0);i<=Math.min(self.currentPage+2,self.pageCount-1);i++) {
        out.push(i+1);
      }
      return out;
    },
    lastPage: self=>self.pageCount-1,
    pagingButtonEnabled: self=>!self.selectionModeEnabled,
  },
  methods: {
    takePage,
    calcPageCount,
    presentDate(value){
      // return moment(value).format(DateFormat.DATE_TIME_LONG);
      return moment(value).format(DateFormat.DATE_TIME_WITHOUT_SEC);
    },
    navToPage(page){
      if (!this.pagingButtonEnabled) {
        return;
      }
      if (page < 0 || page > this.lastPage) {
        // console.log('outOfRange page:', page);
        return;
      }
      // console.log('navToPage:', page);
      this.currentPage = page;
    },
    async onClearAllPressed(){
      await this.$store.dispatch('messageStore/removeAll');
    },
    async onDeleteSelectedPressed(){
      let targetMessageIdList = [];
      for (let id in this.rowChecked) {
        if (this.rowChecked[id]) {
          targetMessageIdList.push(id);
        }
      }
      // console.log('targetMessageIdList =', targetMessageIdList);
      await this.$store.dispatch('messageStore/removeList', targetMessageIdList);
      this.selectionModeEnabled = false;
      this.rowChecked = {};

      // if current page become invalid, auto go to last page.
      if (this.currentPage+1 > this.pageCount) {
        this.currentPage = this.pageCount-1;
      }
    },
    onSelectMessagePressed(){
      this.selectionModeEnabled = !this.selectionModeEnabled;
    },
    onAbortCurrentModePressed(){
      this.selectionModeEnabled = false;
      this.rowChecked = {};
    },
  },
  components: {
  },
};
</script>

<style scoped>
</style>