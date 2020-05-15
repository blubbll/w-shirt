const { ko } = window;

console.clear();

Date.prototype.getWeek = function() {
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
  day: ko.observable($start),
  combos: permData.length,
  color: ko.observable("gold"),
  toggleFoodlist: () => {
    tModel.Food.listExpanded(!tModel.Food.listExpanded());
  }
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

    //move in week
    /*if (!clicked) {
      const newVal = +$Time.totalDay();
      oldVal - newVal > -1
        ? console.debug({
            action: "going down",
            by: oldVal - newVal,
            from: $Time.date().toLocaleDateString() + `[#t${$Time.totalDay()}`,
            to:
              addDays(
                $Time.date(),
                -($Time.weekDay() - newVal)
              ).toLocaleDateString() +
              `[#${$Time.totalDay()}]` +
              `[wd#${$Time.weekDay()}]`
          })
        : console.debug({
            action: "going up",
            by: newVal - oldVal,
            from: $Time.date().toLocaleDateString() + `[#t${$Time.totalDay()}`,
            to:
              addDays(
                $Time.date(),
                -($Time.weekDay() - newVal)
              ).toLocaleDateString() +
              `[#${daysBetween(
                $start,
                addDays($Time.date(), -($Time.totalDay() - newVal))
              )}]` +
              `[wd#${newWeekday}]`
          });

      //update date
      $Time.date($Time.totalDay() > 1 ? addDays($start, newVal) : $start);

      //update weekday
      {
        //update Weekday
        $Time.weekDay(newWeekday);
        const chk = $$("input")[newWeekday - 1];
        chk && [(chk.checked = true)];

        //update week
        $Time.week(Math.ceil($Time.totalDay() / 7));
      }
    }
    {
      //update colors
      tModel.color(permData[$Time.date().getWeek()][$Time.weekDay()]);
    }*/
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
  
  /* const $Time = tModel.Time;
  newWeekday = +newWeekday;


  
  //debug
 newWeekday < $Time.weekDay() + 1
    ? [
        console.debug({
          action: "clicking down",
          by: $Time.weekDay() - newWeekday,
          from:
            $Time.date().toLocaleDateString() +
            `[#${$Time.totalDay()}]` +
            `[w#${$Time.weekDay()}]`,
          to:
            addDays(
              $Time.date(),
              -($Time.weekDay() - newWeekday)
            ).toLocaleDateString() +
            `[#${daysBetween(
              $start,
              addDays($Time.date(), -($Time.weekDay() - newWeekday))
            )}]` +
            `[w#${newWeekday}]`
        })
      ]
    : [
        console.debug({
          action: "clicking up",
          by: -($Time.weekDay() - newWeekday),
          from:
            $Time.date().toLocaleDateString() +
            `[#${$Time.totalDay()}]` +
            `[w#${$Time.weekDay()}]`,
          to:
            addDays(
              $Time.date(),
              -($Time.weekDay() - newWeekday)
            ).toLocaleDateString() +
            `[#${daysBetween(
              $start,
              addDays($Time.date(), -($Time.weekDay() - newWeekday))
            )}]` +
            `[w#${newWeekday}]`
        })
      ];

    //update week
  //$Time.week(Math.ceil($Time.totalDay() / 7));

  //update totalDay
  //$Time.totalDay(daysBetween($start, $Time.date())>0 ? daysBetween($start, $Time.date()) : 2);



  //update Date
  //$Time.date(addDays(
  //            $Time.date(),
  //            -($Time.weekDay() - newWeekday)
  //          ));

  //TODO: Use vars from debug lol
  
    //update Weekday
  $Time.weekDay(newWeekday);
  


  //console.log($Time.date())
  
  */
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
