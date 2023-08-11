<template>
  <div>

    <a-spin :spinning="isFetching"
    :tip="(i18n.word['word.loading'] + '...')">
      <template #indicator>
        <font-awesome-icon icon="cog" spin />
      </template>

      <main class="my antd-cards holder">
        
        <div class="my small card" v-for="record of tableData">
          <a-card :title="record.name"
            :head-style="{ 
              backgroundColor: PreferenceStore.darkTheme ? 'black':'white',
              color: PreferenceStore.colorPalette.fgColor,
            }"
            :body-style="{
              padding: '0.4em',
            }"
            hoverable
          >
            <template #extra>
              <a-tag class="country-tag" color="#202020">
                {{ record.primaryCountry }}
              </a-tag>
            </template>

            <a-tag class="brand-id-tag" color="royalblue">
              {{ record.id }}
            </a-tag>

            <div style="display: flex; flex-direction: column; align-items: end;">
              <span class="date-tag">
                {{ formatter.formatGeneralDateTime(record.creationDate) }}
              </span>
            </div>
          </a-card>
        </div>

        <div class="my huge card">
          <a-card>
            <a-pagination 
              :current="pagination.current"
              :total="pagination.total"
              :pageSize="pagination.pageSize"
              :showSizeChanger="pagination.showSizeChanger"
              @change="pagination.onChange"
            ></a-pagination>
          </a-card>
        </div>

      </main>
    </a-spin>

  </div>
</template>

<script lang="ts">
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref, type Ref } from 'vue';
import { type TablePaginationConfig } from 'ant-design-vue';
import { ProductService } from '@/service/ProductService';
import type { Brand } from '@/model/product/Brand';
import { DateUtil } from '@/util/DateUtil';
import dayjs from 'dayjs';
import type { ILogger } from '@/model/core/ILogger';

const logger: ILogger = console;

interface ViewModel {
  tableData: Ref<Brand[]>;
  isFetching: Ref<boolean>;
  pagination: Ref<TablePaginationConfig>;
  currentPageIndex: Ref<number>;
  restCallAbortController: Ref<AbortController>;
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Brand List']},
    i18nErrorPack: ()=>'product.error',
    iMessageService: ()=>MessageService(),
    iProductService: ()=>ProductService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    autoLoadOnStart:()=>true,
    pageSize:()=>6,
    formatter: ()=>usePreferenceStore().formatter,
  },
  data() {
    return <ViewModel>{
      tableData: ref(<Brand[]>[]),
      isFetching: ref(false),
      pagination: ref(<TablePaginationConfig>{}),
      currentPageIndex: ref(0),
      restCallAbortController: ref(new AbortController()),
    };
  },
  async mounted() {
    if (this.autoLoadOnStart) {
      await this.loadData();
    }
  },
  methods: {
    formatData(list: Brand[]) {
      // ...
    },
    tagColorForIdField(record: Brand): string {
      if (record?.active) {
        return this.PreferenceStore.darkTheme ? 'teal':'';
      } else {
        return 'black';
      }
    },
    /**
     * return record count of requested page.
     */
    async loadData(targetPage?: number): Promise<number> {
      // logger?.log('reloadData targetPage=', targetPage);
      this.isFetching = true;
      let isReloading: boolean = (targetPage === undefined);
      if (targetPage === undefined) {
        targetPage = this.currentPageIndex;
      }
      let offset = targetPage * this.pageSize;
      let targetPageSize = this.pageSize;
      let list: Brand[];
      try {
        list = await this.iProductService.get_brand({
          offset: offset,
          size: targetPageSize,
          consumer: this,
        });
        this.formatData(list);
        // logger?.log('list=', JSON.stringify(list.map(it=>it.id),null,2));
      } catch (err) {
        this.iMessageService.errorMsg(this, err, 
          this.i18n.message['sentence.dataLoadingError'],
        );
        return 0;
      }
      
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
      
      if (isReloading) {
        this.iMessageService.info(
          this,
          this.i18n.message['sentence.dataReloaded'],
        );
      }
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
  },
};
</script>

<style scoped>
.brand-id-tag {
  scale: 160%;
  margin: 1.4em 10% 1em 12%;
}

.country-tag {
  
}

.date-tag {
  color: #606060;
}
</style>
