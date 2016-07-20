(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let Vars = require('./vars.js');

function saveOptions(){
  let theme = document.getElementById('theme').value;

  chrome.storage.sync.set({
    theme,
    defaultForum
  }, function(){
    //Notify user
    console.log("Options saved");
  });
}

function restoreOptions(){
  chrome.storage.sync.get({
    theme: 'default',
    defaultForum: 'all'
  }, function(item){
    document.getElementById('theme').value = item.theme;
    document.getElementById('defaultForum').value = item.defaultForum;
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);

},{"./vars.js":2}],2:[function(require,module,exports){
module.exports = {
  forumInfo: [
    { name: 'food', label: 'ก้นครัว' },
    { name: 'chalermkrung', label: 'เฉลิมกรุง' },
    { name: 'blueplanet', label: 'บลูแพลนเน็ต' },
    { name: 'all', label: 'รวมมิตร' },
    { name: 'siam', label: 'สยามสแควร์' },
    { name: 'greenzone', label: 'กรีนโซน' },
    { name: 'chalermthai', label: 'เฉลิมไทย' },
    { name: 'tvshow', label: 'บางขุนพรหม' },
    { name: 'ratchada', label: 'รัชดา' },
    { name: 'lumpini', label: 'สวนลุมพินี' },
    { name: 'camera', label: 'กล้อง' },
    { name: 'family', label: 'ชานเรือน' },
    { name: 'bangrak', label: 'บางรัก' },
    { name: 'rajdumnern', label: 'ราชดำเนิน' },
    { name: 'sinthorn', label: 'สินธร' },
    { name: 'cartoon', label: 'การ์ตูน' },
    { name: 'home', label: 'ชายคา' },
    { name: 'horoscope', label: 'พรหมชาติ' },
    { name: 'isolate', label: 'ไร้สังกัด' },
    { name: 'silom', label: 'สีลม' },
    { name: 'gallery', label: 'แกลเลอรี่' },
    { name: 'siliconvalley', label: 'ซิลิคอนวัลเลย์' },
    { name: 'pantip', label: 'พันทิป' },
    { name: 'social', label: 'ศาลาประชาคม' },
    { name: 'wahkor', label: 'หว้ากอ' },
    { name: 'klaibann', label: 'ไกลบ้าน' },
    { name: 'beauty', label: 'โต๊ะเครื่องแป้ง' },
    { name: 'region', label: 'ภูมิภาค' },
    { name: 'religious', label: 'ศาสนา' },
    { name: 'library', label: 'ห้องสมุด' },
    { name: 'jatujak', label: 'จตุจักร' },
    { name: 'writer', label: 'ถนนนักเขียน' },
    { name: 'mbk', label: 'มาบุญครอง' },
    { name: 'supachalasai', label: 'ศุภชลาศัย' },
    { name: 'art', label: 'หอศิลป์' }
  ]
};

},{}]},{},[1]);
