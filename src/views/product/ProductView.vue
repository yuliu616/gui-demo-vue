<template>
  <main class="my antd-cards holder">

    <transition name="slide-fade">
      <div class="my huge card" v-if="viewFailed">
        <a-alert class="my antd-alert" show-icon type="error"
          :message="viewName" 
          :description="failureMessage" 
        />
      </div>
    </transition>

    <div class="my small card" v-if="!viewFailed">
      <a-spin :spinning="!viewReady"
      :tip="(i18n.word['word.loading']+' ...')">
        <template #indicator>
          <font-awesome-icon icon="cog" spin />
        </template>
        <a-card
          :title="i18n.product.model.Product['model.name']"
          :head-style="{ 
            backgroundColor: 'royalblue',
            color: 'white',
          }"
        >
          <template #actions>
            <div @click="onEditPressed()">
              <font-awesome-icon icon="pen-to-square" style="margin-left: 0.4em;" />
              {{ i18n.word['action.edit'] }}
            </div>
            <div @click="onClosePressed()">
              <font-awesome-icon icon="xmark" style="margin-left: 0.4em;" />
              {{ i18n.word['action.close'] }}
            </div>
          </template>

          <p v-if="viewReady">
            <a-tag color="teal">
              {{ viewTargetId }}
            </a-tag>
            <a-tag color="grey">
              v{{ record.version }}
            </a-tag>
            <a-tag v-if="!record.active" color="grey">
              <font-awesome-icon icon="box-archive" style="margin-right: 0.2em;" />
              {{ i18n.word['word.inactive'] }}
            </a-tag>
          </p>

          <a-form
            layout="horizontal"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-form-item :label="i18n.product.model.Product['field.name']">
              <a-input v-model:value="record.name"
                allow-clear readonly
                :placeholder="i18n.product.model.Product['field.name']"
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.brandId']">
              <a-input v-model:value="record.brandId"
                allow-clear readonly
                :placeholder="i18n.product.model.Product['field.brandId']"
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.releaseDate']">
              <a-input v-model:value="record.releaseDate"
                allow-clear readonly
                :placeholder="i18n.product.model.Product['field.releaseDate']"
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.weightInKg']">
              <a-input v-model:value="record.weightInKg"
                allow-clear readonly
                :placeholder="i18n.product.model.Product['field.weightInKg']"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-spin>
    </div>

  </main>
</template>


<script lang="ts">
import type { ILogger } from '@/model/core/ILogger';
import type { Product } from '@/model/product/Product';
import { MessageService } from '@/service/MessageService';
import { ProductService } from '@/service/ProductService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { RestfulUtil, ERROR_CANCELED } from '@/util/RestfulUtil';
import dayjs from 'dayjs';
import { ref, type Ref } from 'vue';

const logger: ILogger = console;
let debug = false;

interface ViewModel {
  viewTargetId: Ref<string|undefined>;
  viewReady: Ref<boolean>;
  viewFailed: Ref<boolean>;
  record: Ref<Product>;
  failureMessage: Ref<string|undefined>;
  restCallAbortController: Ref<AbortController>;
  hooks: Ref<Function[]>;
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Product View']},
    i18nErrorPack: ()=>'product.error',
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    iProductService: ()=>ProductService(),
    // genderLabel: function(): string {
    //   if (this.record.gender) {
    //     return this.i18n.t('product.word', 
    //       'word.enum.Gender.'+this.record.gender);
    //   } else {
    //     return this.i18n.product.word['word.enum.empty.Gender'];
    //   }
    // },
  },
  data(){
    return <ViewModel>{
      viewTargetId: ref(undefined),
      viewReady: ref(false),
      viewFailed: ref(false),
      record: ref(<Product>{}),
      failureMessage: ref(undefined),
      restCallAbortController: ref(new AbortController()),
      hooks: ref(<Function[]>[]),
    };
  },
  async mounted() {
    this.viewTargetId = <string>this.$route.params.id;
    this.hooks = [];

    let afterEachHook = this.$router.afterEach((to, from, failure)=>{
      if (from.fullPath != to.fullPath &&
        new RegExp('product/item/[0-9]*/view').test(to.fullPath)
      ) {
        let targetId = <string>to.params.id;
        logger?.log(`change to VIEW ${targetId}.`);
        this.onRouteChanged(targetId);
      }
    });
    this.hooks.push(afterEachHook);

    await this.onViewInit(this.viewTargetId);
  },
  unmounted() {
    this.hooks.forEach(h=>h());
    this.hooks = [];
  },
  methods: {
    async onViewInit(targetId: string){
      await this.loadRecord(targetId);
    },
    async onRouteChanged(targetId: string){
      // reset all state
      this.viewTargetId = undefined;
      this.viewReady = false;
      this.viewFailed = false;
      this.record = {};
      this.failureMessage = undefined;
      this.restCallAbortController.abort();
      this.restCallAbortController = new AbortController();
      // except hooks
      await this.onViewInit(targetId);
    },
    async loadRecord(targetId: string){
      this.viewReady = false;
      this.viewFailed = false;
      this.viewTargetId = targetId;
      try {
        let loaded = await this.iProductService.get_product_x(targetId, { consumer: this });
        if (loaded.id != this.viewTargetId) {
          if (debug) logger?.log(`view stall ${loaded.id} != ${this.viewTargetId}.`);
          return;
        }
        this.record = loaded;
        this.viewReady = true;
        
      } catch (err) {
        if (RestfulUtil.asError(err).code == ERROR_CANCELED) {
          if (debug) logger?.log('query canceled.');
          return;
        }
        this.viewFailed = true;
        this.failureMessage = this.i18n.message['sentence.dataLoadingError'];
      }
    },
    onClosePressed(){
      this.$router.push('/product');
    },
    onEditPressed(){
      if (!this.record.active) {
        this.iMessageService.warn(this, 
          this.i18n.message['sentence.recordIsNotActive'],
        );
      } else {
        this.$router.push(`/product/item/${this.record.id}/edit`);
      }
    },
  },
};
</script>
