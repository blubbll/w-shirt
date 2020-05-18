const { ko } = window;

console.clear();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const colors = ["darkblue", "green", "red", "gray", "blue"];

//Tage zwischen
const daysBetween = (one, another) => {
  return Math.round(Math.abs(+one - +another) / 8.64e7);
};

//Kombinationen
const perm = xs => {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return ret.sort(function() {
    return 0.5 - Math.random();
  });
};

const permData = perm(colors);

const $tymes = [];
Array.from(Array(52 * 7)).forEach((x, i) => {
  $tymes.push({
    tday: i + 1,
    wday: (i % 7) + 1,
    week: Math.floor(i / 7) + 1,
    month: Math.floor(i / 28) + 1,
    mday: i % 28 === 0 ? 28 : i % 28
  });
});

const tModel = {
  tyme: ko.observable($tymes[0]),
  combos: permData.length,
  color: ko.observable("gold")
};

Date.prototype.dayOfYear = function() {
  var j1 = new Date(this);
  j1.setMonth(0, 0);
  return Math.round((this - j1) / 8.64e7);
};

const updateUI = oldVal => {
  const $day = tModel.day;
  oldVal = +oldVal;

  const clicked = $("input[type=radio]:focus") !== null;

  setTimeout(() => {
    const newWeekday = $day.getDay() === 0 ? 7 : $day.getDay();

    const chk = $$("input")[newWeekday - 1];
    console.log(chk);
    chk && [(chk.checked = true)];
  });
};

const updateByClick = newWeekday => {
  const $tyme = tModel.tyme;

  if (newWeekday > $tyme().day) {
    console.debug("up");
  }

  //update tyme based on new weekday
  $tyme($tymes.find(x => x.wday === newWeekday && x.week === $tyme().week));

  tModel.color(permData[$tyme().week-1][$tyme().wday-1]);
};

//reflect color updates
tModel.color.subscribe(newVal => {
  

  
  const $tyme = tModel.tyme;
  
 
  
  
  if ($tyme().wday > 5) [tModel.color("???"), (newVal = "gold")];

  $("#color>val").style.color = newVal;
  $("#shirt>g>path#main").style.fill = newVal;
});

for (const _input of $$("input[type=radio]")) {
  _input.addEventListener("change", event => {
    updateByClick(+event.target.value);
    //calc new day
    //tModel.Time.weekDay(+e.target.value - 1);
  });
}

//lastpass fix
for (const _input of $$("t>input")) {
  _input.addEventListener("keydown", event => {
    if (event.which == 13 || event.keyCode == 13) {
      //event.preventDefault();
      event.stopPropagation();
    }
  });
}

//bindings
ko.applyBindings(tModel);

//init
{
  const $tyme = tModel.tyme;

  {
    //fill all white
    for (const stroke of $$("svg>g>path")) {
      stroke.style.stroke = "white";
    }

    //init checkbox
    const chk = $$("input")[$tyme().wday];
    chk && [(chk.checked = true)];


    
 
    
    //init color <todo
    tModel.color(permData[$tyme().week-1][$tyme().day-1]);
  }
}
