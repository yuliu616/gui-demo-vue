<template>
  <main>

    <div class="my button-bar">
      <a-button class="my antd-btn"
        @click="(!isFetching && loadData())"
        :ghost="PreferenceStore.darkTheme"
      >
        {{ i18n.word['action.reload'] }}
      </a-button>
    </div>

    <a-spin :spinning="isFetching"
    :tip="(i18n.word['word.loading'] + '...')">
      <template #indicator>
        <font-awesome-icon icon="cog" spin />
      </template>
      <a-table class="my antd-t" rowClassName="my antd-tr"
        :columns="tableColumns"
        :scroll="{ x: 720 }"
        :dataSource="tableData" 
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'id'">
            <a-dropdown class="recordActionDropDown"
              :overlayClassName="(PreferenceStore.darkTheme ? 'my antd-dropdown-menu-dark':'')"
              trigger="click">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="viewPressed(record.id)">
                    {{ i18n.word['action.view'] }}
                  </a-menu-item>
                  <a-menu-item @click="editPressed(record.id)">
                    {{ i18n.word['action.edit'] }}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{ i18n.word['word.action'] }}
                <font-awesome-icon icon="caret-down" style="margin-left: 0.4em;" />
              </a-button>
            </a-dropdown>
            <a-tag :color="tagColorForIdField(record)">
              <span :class="{ idCrossed: !record.active }">
                {{ record.id  }}
              </span>
            </a-tag>
          </template>
          <template v-if="column.dataIndex == 'creationDate'">
            {{ formatter.formatFullDateTime(record.creationDate) }}
          </template>
        </template>
        <template #emptyText>
          {{ i18n.message['sentence.noData'] }}
        </template>
      </a-table>
    </a-spin>

  </main>
</template>

<script lang="ts">
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref, type Ref } from 'vue';
import { type TablePaginationConfig } from 'ant-design-vue';
import { ProductService } from '@/service/ProductService';
import { AntdTableUtil } from '@/util/AntdTableUtil';
import type { Product } from '@/model/product/Product';
import { DateUtil } from '@/util/DateUtil';
import dayjs from 'dayjs';
import type { ILogger } from '@/model/core/ILogger';

const logger: ILogger = console;

interface ViewModel {
  tableData: Ref<Product[]>;
  isFetching: Ref<boolean>;
  pagination: Ref<TablePaginationConfig>;
  currentPageIndex: Ref<number>;
  restCallAbortController: Ref<AbortController>;
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Product List']},
    i18nErrorPack: ()=>'product.error',
    iMessageService: ()=>MessageService(),
    iProductService: ()=>ProductService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    tableColumns: ()=>AntdTableUtil.buildTableColoumns(
      [
        'id', 'creationDate', 'name', 'brandId', 
        'releaseDate', 'weightInKg',
      ],
      usePreferenceStore().i18n, 'product.model.Product',
      col=>{ 
        if (col.dataIndex == 'id') {
          col.title = usePreferenceStore().i18n.word['field.id'];
        }
        return col;
      }
    ),
    autoLoadOnStart:()=>true,
    pageSize:()=>10,
    formatter: ()=>usePreferenceStore().formatter,
  },
  data() {
    return <ViewModel>{
      tableData: ref(<Product[]>[]),
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
    formatData(list: Product[]) {
      // nothing to adjust
    },
    tagColorForIdField(record: Product): string {
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
      let list: Product[];
      try {
        list = await this.iProductService.get_product({
          offset: offset,
          size: targetPageSize,
          isActive: -1,
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
    viewPressed(id: number){
      this.$router.push(`/product/item/${id}/view`);
    },
    editPressed(id: number){
      this.$router.push(`/product/item/${id}/edit`);
    },
  },
};
</script>

<style scoped>
.recordActionDropDown {
  margin-right: 0.8em;
  margin-bottom: 0.4em;
}

span.idCrossed {
  text-decoration: line-through;
}
</style>
