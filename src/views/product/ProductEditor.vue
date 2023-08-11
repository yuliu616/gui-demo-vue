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
      <a-spin :tip="(busyReason+' ...')" 
        :spinning="!!busyReason">
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
            <div @click="(!postInProgress && onCreationPressed())" 
            v-if="(editMode==dict.EditMode.NEW)">
              <font-awesome-icon icon="paper-plane" style="margin-left: 0.4em;" />
              {{ i18n.word['action.create'] }}
            </div>
            <div @click="(!postInProgress && onSavePressed())" 
            v-if="(editMode==dict.EditMode.EDIT)">
              <font-awesome-icon icon="file-import" style="margin-left: 0.4em;" />
              {{ i18n.word['action.save-as-update'] }}
            </div>
            <div @click="(!postInProgress && onClosePressed())" 
            v-if="(editMode==dict.EditMode.NEW)">
              <font-awesome-icon icon="xmark" style="margin-left: 0.4em;" />
              {{ i18n.word['action.abort'] }}
            </div>
            <div @click="(!postInProgress && onClosePressed())" 
            v-if="(editMode==dict.EditMode.EDIT)">
              <font-awesome-icon icon="xmark" style="margin-left: 0.4em;" />
              {{ i18n.word['action.discard'] }}
            </div>
          </template>

          <p v-if="((viewReady || postInProgress) && editMode == dict.EditMode.NEW)">
            <a-tag color="#fb2a2a">
              {{ i18n.word['word.draft' ]}}
            </a-tag>
          </p>
          <p v-if="((viewReady || postInProgress) && editMode == dict.EditMode.EDIT)">
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
            <a-form-item :label="i18n.product.model.Product['field.name']"
              :validate-status="errorFields['name']"
              :help="errorReasons['name']"
            >
              <a-input v-model:value="record.name"
                allow-clear :readonly="!viewReady"
                :placeholder="i18n.product.model.Product['field.name']"
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.brandId']"
              :validate-status="errorFields['brandId']"
              :help="errorReasons['brandId']"
            >
              <a-input v-model:value="record.brandId"
                allow-clear :readonly="!viewReady"
                :placeholder="i18n.product.model.Product['field.brandId']"
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.releaseDate']"
              :validate-status="errorFields['releaseDate']"
              :help="errorReasons['releaseDate']"
            >
              <a-date-picker v-model:value="record.releaseDate"
                class="my antd-date-picker" picker="date" 
                :dropdownClassName="(PreferenceStore.darkTheme ? 'my antd-dropdown-menu-dark':'')"
                allow-clear :disabled="!viewReady"
                input-read-only
                :placeholder="i18n.product.message['sentence.whenCouldIBuyIt']"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                show-today
              />
            </a-form-item>
            <a-form-item :label="i18n.product.model.Product['field.weightInKg']"
              :validate-status="errorFields['weightInKg']"
              :help="errorReasons['weightInKg']"
            >
              <a-input-number v-model:value="record.weightInKg"
                class="my antd-input-number"
                allow-clear :readonly="!viewReady"
                :placeholder="i18n.product.model.Product['field.weightInKg']"
                :min="0.001" :max="300" :precision="3"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-spin>
    </div>

  </main>
</template>

<script lang="ts">
import type { KeyValueAndLabel } from '@/model/antd/KeyValueAndLabel';
import type { PropertyBag, PropertyBagWithType } from '@/model/core/CoreTypes';
import type { ILogger } from '@/model/core/ILogger';
import { ProductMeta, type Product } from '@/model/product/Product';
import type { FieldErrorState } from '@/model/validation/Validation';
import { ValidationUtil } from '@/model/validation/ValidationUtil';
import { MessageService } from '@/service/MessageService';
import { ProductService } from '@/service/ProductService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ObjectUtil } from '@/util/ObjectUtil';
import { ERROR_CANCELED, RestfulUtil } from '@/util/RestfulUtil';
import { StringUtil } from '@/util/StringUtil';
import { ProductUtil } from '@/util/product/ProductUtil';

import { ref, type Ref } from 'vue';
import type { Router } from 'vue-router';

const logger: ILogger = console;
let debug = false;

enum EditMode {
  EDIT = 'EDIT',
  NEW = 'NEW',
}

interface ViewModel {
  editMode: Ref<EditMode>;
  i18nErrorPack: string;
  viewTargetId: Ref<string|undefined>;
  viewReady: Ref<boolean>;
  viewFailed: Ref<boolean>;
  postInProgress: Ref<boolean>;
  record: Ref<Product>;
  failureMessage: Ref<string|undefined>;
  errorFields: Ref<PropertyBagWithType<FieldErrorState>>;
  errorReasons: Ref<PropertyBag>;
  restCallAbortController: Ref<AbortController>;
  hooks: Ref<Function[]>;
}

interface DictModel {
  EditMode: PropertyBag,
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Product Editor']},
    i18nErrorPack: ()=>'product.error',
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    iProductService: ()=>ProductService(),
    dict: function(): DictModel {
      return <DictModel>{
        EditMode: EditMode,
      };
    },
    busyReason: function(): string|null{
      if (!this.viewReady) {
        if (this.postInProgress) {
          return this.i18n.word['word.processing'];
        } else {
          return this.i18n.word['word.loading'];
        }
      }
      return null;
    },
  },
  data(){
    return <ViewModel>{
      editMode: ref(EditMode.NEW),
      viewTargetId: ref(<string|undefined>undefined),
      viewReady: ref(false),
      viewFailed: ref(false),
      postInProgress: ref(false),
      record: ref(<Product>{}),
      failureMessage: ref(<string|undefined>undefined),
      errorFields: ref(<PropertyBagWithType<FieldErrorState>>{}),
      errorReasons: ref(<PropertyBag>{}),
      restCallAbortController: ref(new AbortController()),
      hooks: ref(<Function[]>[]),
    };
  },
  async mounted() {
    this.viewTargetId = <string|undefined>this.$route.params.id;
      this.hooks = [];
    
    
    let afterEachHook = this.$router.afterEach((to, from, failure)=>{
      if (from.fullPath == to.fullPath) {
        // do nothing
      } else if (to.fullPath == '/product/creation') {
        if (debug) logger?.log('change to NEW mode.');
        this.onRouteChanged(EditMode.NEW);
      } else if (new RegExp('product/item/[0-9]*/edit').test(to.fullPath)) {
        let targetId = <string>to.params.id;
          if (debug) logger?.log(`change to EDIT mode for ${targetId}.`);
        this.onRouteChanged(EditMode.EDIT, targetId);
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
    async onViewInit(targetId?: string){
      if (targetId === undefined) {
        this.editMode = EditMode.NEW;
        await this.blankRecord();
      } else {
        this.editMode = EditMode.EDIT;
        await this.loadRecord(targetId);
      }
    },
    async onRouteChanged(mode: EditMode, targetId?: string){
      // reset all state
      this.editMode = mode;
      this.viewTargetId = undefined;
      this.viewReady = false;
      this.viewFailed = false;
      this.postInProgress = false;
      this.record = {};
      this.failureMessage = undefined;
      this.errorFields = {};
      this.errorReasons = {};
      this.restCallAbortController.abort();
      this.restCallAbortController = new AbortController();
      // except hooks
      await this.onViewInit(targetId);
    },
    async blankRecord(){
      delete this.viewTargetId;
      this.record = {};
      delete this.failureMessage;
      this.errorFields = {};
      this.errorReasons = {};
      this.viewReady = true;
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
      } catch (err) {
        if (RestfulUtil.asError(err).code == ERROR_CANCELED) {
          if (debug) logger?.log('query canceled.');
          return;
        }
        this.viewFailed = true;
        this.failureMessage = this.i18n.message['sentence.dataLoadingError'];
        return;
      }
      delete this.failureMessage;
      this.errorFields = {};
      this.errorReasons = {};
      this.viewReady = true;
    },
    validateInput(action: 'update' | 'create'): boolean {
      let result = ValidationUtil.validateModel(ProductMeta, 
        this.record, { action: action, autoCorrect: true });
      if (debug) logger?.log('validation result(failure) =', result);
      if (result) {
        this.errorFields = ObjectUtil.cloneWithValueReset(result, 'error');
        this.errorReasons = ObjectUtil.map(result, it=>this.i18n.t(this.i18nErrorPack, it.reason));
      } else {
        this.errorFields = {};
        this.errorReasons = {};
      }
      return (result == null);
    },
    onClosePressed(){
      if (this.viewTargetId === undefined) {
        this.$router.push(`/product`);
      } else {
        this.$router.push(`/product/item/${this.viewTargetId}/view`);
      }
    },
    async onSavePressed(){
      if (!this.validateInput('update')) {
        return;
      }

      this.postInProgress = true;
      this.viewReady = false;
      let reloaded;
      try {
        reloaded = await this.iProductService.put_product_x(this.viewTargetId!, {
          body: this.record,
          consumer: this,
        });
      } catch (err) {
        if (RestfulUtil.asError(err).code == ERROR_CANCELED) {
          if (debug) logger?.log('update canceled.');
          return;
        }
        this.iMessageService.errorMsg(this, err,
          this.i18n.message['sentence.updateError'],
        );
        return;
      } finally {
        this.postInProgress = false;
        this.viewReady = true;
      }

      // update success
      this.record = reloaded;
      await this.iMessageService.good(this, StringUtil.formatString(
        this.i18n.message['sentence.updateSuccess'], 
        reloaded.version,
        ProductUtil.stringPresentationFor(reloaded, this.i18n) ||
        this.i18n.word['word.record'],
      ));
    },
    async onCreationPressed(){
      if (!this.validateInput('create')) {
        return;
      }

      this.postInProgress = true;
      this.viewReady = false;
      let reloaded;
      try {
        reloaded = await this.iProductService.post_product({
          body: this.record,
          consumer: this,
        });
      } catch (err){
        if (RestfulUtil.asError(err).code == ERROR_CANCELED) {
          if (debug) logger?.log('creation canceled.');
          return;
        }
        this.iMessageService.errorMsg(this, err,
          this.i18n.message['sentence.creationError'],
        );
        return;
      } finally {
        this.postInProgress = false;
        this.viewReady = true;
      }

      // update success
      this.record = reloaded;
      await this.iMessageService.good(this, StringUtil.formatString(
        this.i18n.message['sentence.creationSuccess'], 
        reloaded.id, 
        ProductUtil.stringPresentationFor(reloaded, this.i18n) ||
        this.i18n.word['word.record'],
      ));
      this.$router.push(`/product/item/${reloaded.id}/view`);
    },
  },
};
</script>
