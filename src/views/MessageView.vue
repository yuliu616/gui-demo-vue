<template>
  <main>

    <a-alert class="my antd-alert" show-icon type="info"
      v-if="selectionModeEnabled"
      :message="i18n.message['sentence.selectionMode']"
      :description="i18n.message['sentence.pleaseSelectMessageToBeDeleted']"
    />

    <div class="my button-bar">
      <a-button class="my antd-btn" :ghost="PreferenceStore.darkTheme"
        @click="onClearAllPressed()"
        v-if="!selectionModeEnabled"
      >
        {{ i18n.message['sentence.clearMessage'] }}
      </a-button>
      <a-button class="my antd-btn" :ghost="PreferenceStore.darkTheme"
        @click="onSelectMessagePressed()"
        v-if="!selectionModeEnabled"
      >
        {{ i18n.message['sentence.selectMessage'] }} ...
      </a-button>
      <a-button class="my antd-btn" :ghost="PreferenceStore.darkTheme"
        @click="onDeleteSelectedPressed()"
        v-if="selectionModeEnabled"
      >
        {{ i18n.message['sentence.deleteThoseSelected'] }}
      </a-button>
      <a-button class="my antd-btn" :ghost="PreferenceStore.darkTheme"
        @click="onAbortCurrentModePressed()"
        v-if="selectionModeEnabled"
      >
        {{ i18n.word['action.abort'] }}
      </a-button>
    </div>

    <a-table class="my antd-t" rowClassName="my antd-tr"
      :columns="tableColumns"
      :scroll="{ x: 720 }"
      :dataSource="tableData" 
      :loading="isFetching" :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'id'">
          <span>
            <a-switch v-model:checked="selectedIdMap[record.id]"
              v-show="selectionModeEnabled"
              class="row-selection-switch"
             />
             {{ record.id  }}
          </span>
        </template>
        <template v-if="column.dataIndex == 'message'">
          <a-tag :color="(
            record.type=='INFO' ? '#00a2a2' : 
            record.type=='ERROR' ? '#fb2a2a' :
            record.type=='WARN' ? '#e9a900' :
            record.type=='GOOD' ? '#34b234' :
            'purple'
            )">
             {{ record.message  }}
          </a-tag>
        </template>
      </template>
      <template #emptyText>
        {{ i18n.message['sentence.noData'] }}
      </template>
    </a-table>

  </main>
</template>

<script lang="ts">
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref } from 'vue';
import { type TablePaginationConfig } from 'ant-design-vue';
import type { Message } from '@/model/core/Message';
import type { AntdTableColumn } from '@/model/antd/AntdTableColumn';
import { useMessageStore } from '@/stores/MessageStore';
import type { PropertyBagWithType } from '@/model/core/CoreTypes';
import { ObjectUtil } from '@/util/ObjectUtil';
import type { ILogger } from '@/model/core/ILogger';

const logger: ILogger = console;

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.People List']},
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    MessageStore: ()=>useMessageStore(),
    i18n: ()=>usePreferenceStore().i18n,
    tableColumns: function(): AntdTableColumn[] {
      return <AntdTableColumn[]>[
        {
          dataIndex: 'id',
          title: this.i18n.word['field.id'],
        },
        {
          dataIndex: 'time',
          title: this.i18n.model.Message['field.time'],
        },
        {
          dataIndex: 'message',
          title: this.i18n.model.Message['field.message'],
        },
        {
          dataIndex: 'viewName',
          title: this.i18n.model.Message['field.viewName'],
        },
      ];
    },
    pageSize: ()=>10,
    formatter: ()=>usePreferenceStore().formatter,
  },
  data() {
    return {
      tableData: ref(<Message[]>[]),
      isFetching: ref(false),
      pagination: ref(<TablePaginationConfig>{}),
      currentPageIndex: ref(0),
      selectionModeEnabled: ref(false),
      selectedIdMap: ref(<PropertyBagWithType<boolean>>{}),
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    formatData(list: Message[]) {
      for (let item of list) {
        if (item.time) {
          item.time = this.formatter.formatFullDateTime(item.time);
        }
      }
    },
    async loadData(targetPage?: number): Promise<number> {
      // logger?.log('reloadData targetPage=', targetPage);
      this.isFetching = true;
      if (targetPage === undefined) {
        targetPage = this.currentPageIndex;
      }
      let offset = targetPage * this.pageSize;
      let targetPageSize = this.pageSize;
      let list = await this.iMessageService.getMessage(
        offset, targetPageSize,
      );
      this.formatData(list);
      // logger?.log('list=', JSON.stringify(list.map(it=>it.id),null,2));
      // logger?.log('list=', JSON.stringify(list,null,2));
      this.selectedIdMap = ObjectUtil.reduceAsPropertyBag(list, 'id', false);
      
      let switchPage = this.switchPage;
      let fakeTotal: number;
      if (list.length == 0 && offset > 0) {
        // next page is empty means last page reached,
        // update pagination to reflect this.
        this.pagination = <TablePaginationConfig>{
          total: (this.currentPageIndex+1) * targetPageSize,
          current: this.currentPageIndex+1,
          pageSize: targetPageSize,
          showSizeChanger: false,
          onChange(page, pageSize) {
            switchPage(page);
          },
        };
        this.isFetching = false;
        // logger?.log('pagination =', this.pagination);
        // logger?.log('currentPageIndex =', this.currentPageIndex);
        // logger?.log('tableData.length =', this.tableData.length);  
        return 0;
      } else if (list.length >= targetPageSize) {
        // if the data is all full page, 
        // just let the table think there is more page after it.
        fakeTotal =  (targetPage+2)*targetPageSize;
      } else {
        // if the data is a partial page,
        // tell the table the true data size.
        fakeTotal = (targetPage*targetPageSize)
          +list.length;
      }

      this.tableData = list;
      this.pagination = <TablePaginationConfig>{
        total: fakeTotal,
        current: targetPage +1,
        pageSize: targetPageSize,
        showSizeChanger: false,
        onChange(page, pageSize) {
          switchPage(page);
        },
      };
      this.currentPageIndex = targetPage;
      this.isFetching = false;
      // logger?.log('pagination =', this.pagination);
      // logger?.log('currentPageIndex =', this.currentPageIndex);
      // logger?.log('tableData.length =', this.tableData.length);
      
      return list.length;
    },
    async switchPage(pageNum: number){
      // logger?.log('switchPage pageNum=', pageNum);
      let count = await this.loadData(pageNum - 1);
      if (count == 0) {
        this.iMessageService.info(
          this,
          this.i18n.message['sentence.noMoreData'],
        );
      }
    },
    async onClearAllPressed(){
      await this.MessageStore.removeAll();
      this.onSelectionModeEnd();
      await this.loadData();
    },
    onSelectMessagePressed(){
      this.selectionModeEnabled = true;
    },
    onAbortCurrentModePressed(){
      this.onSelectionModeEnd();
    },
    async onDeleteSelectedPressed(){
      let toBeDeleted = ObjectUtil.getKeyListOfPropertyBag(this.selectedIdMap, it=>it)
        .map(it=>+it);
      // logger?.log('toBeDeleted =', JSON.stringify(toBeDeleted, null, 2));
      await this.MessageStore.removeList(toBeDeleted);
      this.onSelectionModeEnd();
      await this.loadData();
    },
    onSelectionModeEnd(){
      this.selectionModeEnabled = false;
      this.selectedIdMap = {};
    },
  },
};
</script>

<style scoped>
main > .my.antd-alert {
  margin-bottom: 1em;
}

.row-selection-switch {
  margin-right: 0.6em;
}
</style>
