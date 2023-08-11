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
          :title="i18n.people.model.People['model.name']"
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
            <a-form-item :label="i18n.people.model.People['field.nickname']">
              <a-input v-model:value="record.nickname"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.nickname']"
              />
            </a-form-item>
            <a-form-item :label="i18n.people.model.People['field.gender']">
              <a-input v-model:value="genderLabel"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.gender']"
              />
            </a-form-item>
            <a-form-item :label="i18n.people.model.People['field.dateOfBirth']">
              <a-input v-model:value="record.dateOfBirth"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.dateOfBirth']"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-spin>
    </div>

    <div class="my small card" v-if="!viewFailed">
      <a-spin :spinning="!viewReady"
      :tip="(i18n.word['word.loading']+' ...')">
        <template #indicator>
          <font-awesome-icon icon="cog" spin />
        </template>
        <a-card>
          <a-form
            layout="horizontal"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-form-item :label="i18n.people.model.People['field.firstName']">
              <a-input v-model:value="record.firstName"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.firstName']"
              />
            </a-form-item>
            <a-form-item :label="i18n.people.model.People['field.lastName']">
              <a-input v-model:value="record.lastName"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.lastName']"
              />
            </a-form-item>
            <a-form-item :label="i18n.people.model.People['field.heightInCm']">
              <a-input v-model:value="record.heightInCm"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.heightInCm']"
              />
            </a-form-item>
            <a-form-item :label="i18n.people.model.People['field.weightInKg']">
              <a-input v-model:value="record.weightInKg"
                allow-clear readonly
                :placeholder="i18n.people.model.People['field.weightInKg']"
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
import type { People } from '@/model/people/People';
import { MessageService } from '@/service/MessageService';
import { PeopleService } from '@/service/PeopleService';
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
  record: Ref<People>;
  failureMessage: Ref<string|undefined>;
  restCallAbortController: Ref<AbortController>;
  hooks: Ref<Function[]>;
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.People View']},
    i18nErrorPack: ()=>'people.error',
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    iPeopleService: ()=>PeopleService(),
    genderLabel: function(): string {
      if (this.record.gender) {
        return this.i18n.t('people.word', 
          'word.enum.Gender.'+this.record.gender);
      } else {
        return this.i18n.people.word['word.enum.empty.Gender'];
      }
    },
  },
  data(){
    return <ViewModel>{
      viewTargetId: ref(undefined),
      viewReady: ref(false),
      viewFailed: ref(false),
      record: ref(<People>{}),
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
        new RegExp('people/item/[0-9]*/view').test(to.fullPath)
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
        let loaded = await this.iPeopleService.get_people_x(targetId, { consumer: this });
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
      this.$router.push('/people');
    },
    onEditPressed(){
      if (!this.record.active) {
        this.iMessageService.warn(this, 
          this.i18n.message['sentence.recordIsNotActive'],
        );
      } else {
        this.$router.push(`/people/item/${this.record.id}/edit`);
      }
    },
  },
};
</script>
