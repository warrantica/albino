<template>
<div id="app">
  <header>
    <img src="asset/img/logoHover.png" alt="Albino for Pantip" />
    <h1>ตั้งค่า</h1>
  </header>

  <form name="optionsForm" method="GET">
    <div class="formGroup">
      <h2>ทั่วไป</h2>
      <label for="defaultForum">ห้องหลัก:</label>
      <select id="defaultForum" name="defaultForum" v-model="options.defaultForum">
        <option v-for="forum in forums" :value="forum.name">{{ forum.label }}</option>
      </select>
    </div>

    <h2>หน้าตา</h2>

    <h3>ธีม</h3>
    <div class="formGroup col2">
      <div class="colItem">
        <theme-item v-for="theme in themes"
                    :name="theme.name"
                    :label="theme.label"
                    :primary="theme.primary"
                    :accent="theme.accent"
                    :base="theme.base">
        </theme-item>
      </div>
      <div class="colItem">
        <theme-preview :theme-name="options.theme"></theme-preview>
      </div>
    </div>

    <h3>ตัวหนังสือ</h3>
    <div class="formGroup col2">
      <div class="colItem">
        <label for="fontSize">ขนาด</label>
        <select id="fontSize" class="" name="fontSize" v-model="options.fontSize">
          <option v-for="size in fontSizes" :value="size.value">{{ size.label }}</option>
        </select>
        <label for="fontFace">ฟอนต์</label>
        <select id="fontFace" class="" name="fontFace" v-model="options.fontFace">
          <option v-for="font in fontFaces" :value="font.value">{{ font.label }}</option>
        </select>
      </div>
      <div class="colItem">
        <span class="fontPreview"
              :style="{ fontSize: options.fontSize + 'px', fontFamily: options.fontFace }">
          ตัวอย่าง
        </span>
      </div>
    </div>

    <h3>การจัดวาง</h3>
    <div class="formGroup">
      <label for="commentsPerPage">จำนวนความเห็นต่อหน้า</label>
      <select id="commentsPerPage" class="" name="commentsPerPage" v-model="options.commentsPerPage">
        <!-- Factors of 100 only -->
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>

    <div class="buttonContainer">
      <button class="saveButton"
              :class="{'saveButton--success': this.saveButtonState == 'success'}"
              @click.prevent="saveOptions">
        <transition name="rotate">
          <div class="saveButton-success" v-show="saveButtonState == 'success'">
            <i class="ic">done</i>
          </div>
        </transition>
        <span class="saveButton-text">เซฟ</span>
      </button>
    </div>
  </form>
</div>
</template>

<script>
import Vars from './vars';
import Pantip from './pantipInterface';
import Helper from './helpers';

export default {
  data(){ return {
    forums: Vars.forumInfo,
    themes: Vars.themes,
    fontSizes: Vars.fontSizes,
    fontFaces: Vars.fontFaces,
    options: {
      defaultForum: 'all',
      theme: 'default',
      fontSize: '26',
      fontFace: 'TH Sarabun New',
      commentsPerPage: '10'
    },
    saveButtonState: 'default'
  }},

  methods: {
    saveOptions(){
      let saveButton = document.querySelector('.saveButton');
      saveButton.disabled = true;
      chrome.storage.sync.set(this.options, () => {
        //Notify user
        this.saveButtonState = 'success';
        window.setTimeout(() => {
          this.saveButtonState = 'default';
          saveButton.disabled = false;
        }, 3000);
        console.log("Options saved");
      });
    }
  },

  mounted(){
    //restore options
    chrome.storage.sync.get(this.options, item => this.options = item);
  }
}
</script>
