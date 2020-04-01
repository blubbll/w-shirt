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

const colors = ["darkblue", "red", "orange", "green", "blue", "brown"];

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
  return ret;
};

//Tag hinzufügen
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/*{
  const d = new Date();
  const _wDay = d.getDay() + 1;
  const _wNum = d.getWeekNumber();
  const _totalDay = daysBetween(start, new Date());
  const chk = $$("input")[_wDay];
  chk && [($$("input")[_wDay - 2].checked = true)];

  const permData = perm(colors);

  //calc initial color
  const col = permData[_totalDay][0];

  //fill week nr
  $("#week>val").innerText = _wNum;
  $("#day>input").value = _totalDay;
  $("#color>val").innerText = col;
  $("#color>val").style.background = "rgba(255,255,255,.4)";
  $("#color>val").style.color = col;

  //fill all white
  for (const stroke of $$("svg>g>path")) {
    stroke.style.stroke = "white";
  }

  $("svg>g>path#main").style.fill = permData[_totalDay][0];

  $("#day>input").addEventListener("change", e => {
    console.log(e.target.value)
  })
  
  
  for (const _input of $$("input[type=radio]")) {
    _input.addEventListener("change", e => {
      const realDay = _wDay;

      //calc new day
      const newDay = daysBetween(start, +nextDate(e.target.value));
      //fill new day
      $("#day>input").value = newDay;

      //fill color
      $("svg>g>path#main").style.fill = permData[newDay];
    });
  }
}
*/

const permData = perm(colors);

const $start = new Date("2020-01-01");
const tModel = {
  Time: {
    totalDay: ko.observable(1),
    week: ko.observable(1),
    weekDay: ko.observable($start.getDay() === 0 ? 7 : $start.getDay()),
    date: ko.observable($start)
  },
  combos: permData.length,
  color: ko.observable("gold"),

  toggleFoodlist: () => {
    tModel.Food.listExpanded(!tModel.Food.listExpanded());
  }
};

const updateUI = oldVal => {
  const $Time = tModel.Time;
  oldVal = +oldVal;

  const clicked = $("input[type=radio]:focus") !== null;

  setTimeout(() => {
    const newWeekday = $Time.date().getDay() === 0 ? 7 : $Time.date().getDay();

    //move in week
    if (!clicked) {
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
      $Time.date(addDays($start, newVal));

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
    }
  });
};

const updateWeekday = newWeekday => {
  const $Time = tModel.Time;
  newWeekday = +newWeekday;

  //debug
  newWeekday < tModel.Time.weekDay() + 1
    ? [
        console.debug({
          action: "clicking down",
          by: tModel.Time.weekDay() - newWeekday,
          from:
            tModel.Time.date().toLocaleDateString() +
            `[#${tModel.Time.totalDay()}]` +
            `[w#${tModel.Time.weekDay()}]`,
          to:
            addDays(
              tModel.Time.date(),
              -(tModel.Time.weekDay() - newWeekday)
            ).toLocaleDateString() +
            `[#${daysBetween(
              $start,
              addDays(tModel.Time.date(), -(tModel.Time.weekDay() - newWeekday))
            )}]` +
            `[w#${newWeekday}]`
        })
      ]
    : [
        console.debug({
          action: "clicking up",
          by: -(tModel.Time.weekDay() - newWeekday),
          from:
            tModel.Time.date().toLocaleDateString() +
            `[#${tModel.Time.totalDay()}]` +
            `[w#${tModel.Time.weekDay()}]`,
          to:
            addDays(
              tModel.Time.date(),
              -(tModel.Time.weekDay() - newWeekday)
            ).toLocaleDateString() +
            `[#${daysBetween(
              $start,
              addDays(tModel.Time.date(), -(tModel.Time.weekDay() - newWeekday))
            )}]` +
            `[w#${newWeekday}]`
        })
      ];

  //update Date
  tModel.Time.date(
    addDays(tModel.Time.date(), -(tModel.Time.weekDay() - newWeekday))
  );
  //update Weekday
  tModel.Time.weekDay(newWeekday);

  //update week
  $Time.week(Math.ceil($Time.totalDay() / 7));

  //update totalDay
  tModel.Time.totalDay(daysBetween($start, tModel.Time.date()));
  //console.log(tModel.Time.date())
};

tModel.Time.totalDay.subscribe(updateUI, null, "beforeChange");

//reflect color updates
tModel.color.subscribe(newVal => {
  if (tModel.Time.weekDay() > 5) [tModel.color("???"), (newVal = "gray")];

  $("#color>val").style.color = newVal;
  $("svg>g>path#main").style.fill = newVal;
});

for (const _input of $$("input[type=radio]")) {
  _input.addEventListener("change", event => {
    updateWeekday(+event.target.value);
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
  const $Time = tModel.Time;
  //fill all white
  for (const stroke of $$("svg>g>path")) {
    stroke.style.stroke = "white";
  }
  {
    //init date
    $Time.date(new Date());

    //init totalday
    $Time.totalDay(daysBetween($start, new Date()) - 1);

    //init weekday
    $Time.weekDay($Time.date().getDay() === 0 ? 7 : $Time.date().getDay());
  }

  const _wDay = $Time.weekDay();
  const chk = $$("input")[_wDay - 1];
  chk && [(chk.checked = true)];

  //init color
  tModel.color(permData[$Time.weekDay()][$Time.weekDay() - 1]);
}
