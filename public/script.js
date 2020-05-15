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

const $start = new Date(`${new Date().getFullYear()}-01-01`);
const tModel = {
  tyme:{ //virtual time haha, cuz screw reality
    day: ko.observable(0), // 1-364
    week: ko.observable, //1-52
    month: ko.observable(0), //do we even need this
    year: ko.observable(0) //...maybe later hm↵
  },
  combos: permData.length,
  color: ko.observable("gold"),

};

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
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
  
  const $day = tModel.day;
  
  console.log($day().getDay())
  
  console.log(newWeekday)
  
  tModel.color(permData[$day().getWeek()][newWeekday]);
  
  if(newWeekday > $day().getDay()){
 
    console.debug("up");
    
    console.log(newWeekday-$day().getDay())
    
    $day($day().addDays($day().getDay() - newWeekday))
  }

};

//reflect color updates
tModel.color.subscribe(newVal => {
  if (tModel.day().getDay() > 5) [tModel.color("???"), (newVal = "gray")];

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
  const $day = tModel.day;
  //fill all white
  for (const stroke of $$("svg>g>path")) {
    stroke.style.stroke = "white";
  }
  {
    //init totalday
    // $Time.totalDay(daysBetween($start, new Date())+2);
  }

  const _wDay = $day().getDay();
  const chk = $$("input")[_wDay - 1];
  chk && [(chk.checked = true)];

  var start = { id: 3, date: $day().getDay() };
  for (const dayCheck of $$("input[type=radio]")) {
    dayCheck.setAttribute("date", $start.addDays(1));
    //dayCheck.setAttribute()
  }
  
  tModel.color(permData[$day().getWeek()][$day().getDay()]);

  //init color
  //tModel.color(permData[$Time.weekDay()][$Time.weekDay() - 1]);
}
