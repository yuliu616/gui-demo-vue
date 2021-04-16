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
        <tr v-for="message in pagedRowList" :key="message.id">
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
              <a-button-group>
                <a-button type="danger" v-on:click="onDeleteSelectedPressed()">
                  Delete those selected
                </a-button>
                <a-button v-on:click="onAbortCurrentModePressed()">
                  Abort
                </a-button>
              </a-button-group>
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

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { TableHelper } from '../util/TableHelper';
import { DateFormat } from '../util/DateHelper';
import { Message, MessageStoreState } from '../stores/messageStore';

export default Vue.extend({
  name: 'Message',
  data(): ViewStateModel {
    return {
      currentPage: 0,
      pageSize: 10,
      selectionModeEnabled: false,
      rowChecked: {},
    };
  },
  computed: {
    iMessageStoreState(): MessageStoreState {
      return this.$store.state.messageStore;
    },
    tableRowList(): Message[]{
      return this.iMessageStoreState.messageList.slice().reverse();
    },
    pagedRowList(): Message[]{
      return TableHelper.takePage(this.tableRowList, this.currentPage, this.pageSize);
    },
    pageCount(): number{
      return TableHelper.calcPageCount(this.tableRowList.length, this.pageSize);
    },
    /**
     * (return 1-based pageNum)
     * show only -2 to +2 of current page
     */
    pageNumListForSeeking(): number[]{
      let out: number[] = [];
      for (let i=Math.max(this.currentPage-2, 0);i<=Math.min(this.currentPage+2,this.pageCount-1);i++) {
        out.push(i+1);
      }
      return out;
    },
    lastPage(): number {
      return this.pageCount-1;
    },
    pagingButtonEnabled(): boolean {
      return !this.selectionModeEnabled;
    },
  },
  methods: {
    presentDate(value: Date): string {
      // return moment(value).format(DateFormat.DATE_TIME_LONG);
      return moment(value).format(DateFormat.DATE_TIME_WITHOUT_SEC);
    },
    navToPage(page: number){
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
      let targetMessageIdList: number[] = [];
      for (let id in this.rowChecked) {
        if (this.rowChecked[id]) {
          targetMessageIdList.push(+id);
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
});

interface ViewStateModel {
  
  currentPage: number;
  pageSize: number;
  
  selectionModeEnabled: boolean;

  /**
   * key: message.id, value: is checked.
   */
  rowChecked: {[_:number]: boolean};
}
</script>

<style scoped>
</style>