module.exports = {
  forumInfo: [
    { name: 'food',         label: 'ก้นครัว' },
    { name: 'chalermkrung', label: 'เฉลิมกรุง' },
    { name: 'blueplanet',   label: 'บลูแพลนเน็ต' },
    { name: 'all',          label: 'รวมมิตร' },
    { name: 'siam',         label: 'สยามสแควร์' },
    { name: 'greenzone',    label: 'กรีนโซน' },
    { name: 'chalermthai',  label: 'เฉลิมไทย' },
    { name: 'tvshow',       label: 'บางขุนพรหม' },
    { name: 'ratchada',     label: 'รัชดา' },
    { name: 'lumpini',      label: 'สวนลุมพินี' },
    { name: 'camera',       label: 'กล้อง' },
    { name: 'family',       label: 'ชานเรือน' },
    { name: 'bangrak',      label: 'บางรัก' },
    { name: 'rajdumnern',   label: 'ราชดำเนิน' },
    { name: 'sinthorn',     label: 'สินธร' },
    { name: 'cartoon',      label: 'การ์ตูน' },
    { name: 'home',         label: 'ชายคา' },
    { name: 'horoscope',    label: 'พรหมชาติ' },
    { name: 'isolate',      label: 'ไร้สังกัด' },
    { name: 'silom',        label: 'สีลม' },
    { name: 'gallery',      label: 'แกลเลอรี่' },
    { name: 'siliconvalley',label: 'ซิลิคอนวัลเลย์' },
    { name: 'pantip',       label: 'พันทิป' },
    { name: 'social',       label: 'ศาลาประชาคม' },
    { name: 'wahkor',       label: 'หว้ากอ' },
    { name: 'klaibann',     label: 'ไกลบ้าน' },
    { name: 'beauty',       label: 'โต๊ะเครื่องแป้ง' },
    { name: 'region',       label: 'ภูมิภาค' },
    { name: 'religious',    label: 'ศาสนา' },
    { name: 'library',      label: 'ห้องสมุด' },
    { name: 'jatujak',      label: 'จตุจักร' },
    { name: 'writer',       label: 'ถนนนักเขียน' },
    { name: 'mbk',          label: 'มาบุญครอง' },
    { name: 'supachalasai', label: 'ศุภชลาศัย' },
    { name: 'art',          label: 'หอศิลป์' }
  ],

  themes: [{
    name: 'default', label: 'เผือก (default)',
    primary: '#9C27B0', accent: '#FF5252', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'pantip', label: 'ต้นตำรับ',
    primary: '#38355c', accent: '#f9d135', base: 'pantip',
    textOnPrimary: '#ffffff', textOnAccent: '#222244'
  }, {
    name: 'zuck', label: 'ซักเกอร์เบิร์ก',
    primary: '#3b5998', accent: '#f7412d', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'sanook', label: 'สนุก',
    primary: '#ff1818', accent: '#f9babd', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#333333'
  }, {
    name: 'thaiair', label: 'รักคุณเท่าฟ้า',
    primary: '#3e075b', accent: '#C4007C', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'cupertino', label: 'คูเปอร์ติโน่',
    primary: '#d8d8d8', accent: '#0088cc', base: 'light',
    textOnPrimary: '#333333', textOnAccent: '#ffffff'
  }, {
    name: 'space', label: 'เดือนช่วงดวงเด่นฟ้า ดาดาว',
    primary: '#0a1128', accent: '#1282a2', base: 'dark',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'snyder', label: 'สไนเดอร์',
    primary: '#314d62', accent: '#a8d1c3', base: 'dark',
    textOnPrimary: '#ffffff', textOnAccent: '#333333'
  }, {
    name: 'squirtle', label: 'เซนิกาเมะ',
    primary: '#76bbc0', accent: '#a76a57', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'stark', label: 'สตาร์ก',
    primary: '#dc1405', accent: '#efce0b', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'andromeda', label: 'แอนโดรเมด้า',
    primary: '#e65b8b', accent: '#11984f', base: 'light',
    textOnPrimary: '#ffffff', textOnAccent: '#ffffff'
  }, {
    name: 'plain', label: 'เส้นเล็กน้ำใส',
    primary: '#ffffff', accent: '#ffffff', base: 'light',
    textOnPrimary: '#333333', textOnAccent: '#333333'
  }],

  bases: [{
    name: 'light', brightness: 'light',
    fore: '#ffffff', back: '#eaeaea', hover: '#dedede',
    text: '#212121', subtitle: '#888'
  },{
    name: 'dark', brightness: 'dark',
    fore: '#303030', back: '#212121', hover: '#212121',
    text: '#ffffff', subtitle: '#b3b3b3'
  },{
    name: 'pantip', brightness: 'dark',
    fore: '#222244', back: '#38355c', hover: '#1b1b37',
    text: '#dbdbdb', subtitle: '#a6a3c7'
  }],

  getTheme(themeName){
    return this.themes.find(theme => theme.name === themeName);
  },

  getBase(baseName){
    return this.bases.find(base => base.name === baseName);
  }
};
