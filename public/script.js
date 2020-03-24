Date.prototype.getWeekNumber = function() {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const colorz = [
  "black",
  "white",
  "darkblue",
  "red",
  "orange",
  "green",
  "blue",
  "brown"
];

const shuffle = (array, seed) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  seed = seed || 1;
  let random = function() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

{
  const d = new Date();
  const _wDay = d.getDay() - 1;
  const _wNum = d.getWeekNumber();
  const chk = $$("input")[_wDay];
  chk && [($$("input")[_wDay].checked = true)];

  $("week>val").innerText = _wNum;
  
  const col = shuffle(colorz, _wNum)[0];
  
  for (const stroke of $$("svg>g>path")){
    stroke.style.stroke = "white";
  }
    $("svg>g>path#main").style.fill = col;

}
