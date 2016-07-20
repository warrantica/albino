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
