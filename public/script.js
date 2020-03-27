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
    totalDay: ko.observable(daysBetween($start, new Date())),
    date: ko.observable($start),
    week: ko.observable($start.getWeek())
  },
  combos: permData.length,
  color: ko.observable("gold"),

  toggleFoodlist: () => {
    tModel.Food.listExpanded(!tModel.Food.listExpanded());
  }
};

const updateUI = oldVal => {
  oldVal = +oldVal;

  //const date = new Date()
  //date.setDate(date.getDate() + 1)
  //dModel.Time.totalDay(new Date())
  //dtModel.Time.week(new.getWeekNumber())

  const clicked = $("input[type=radio]:focus") !== null;

  setTimeout(() => {
    const newVal = tModel.Time.totalDay();

    /* console.log({
      clicked: +document.activeElement.value,
      shouldbe: tModel.Time.weekDay(),
      or: oldVal
    });*/

    //move in week
    if (!clicked) {
      if (newVal !== 0) {
        //we hit sunday from mon, go a week back
        if (oldVal > newVal && tModel.Time.date().getDay() === 5) {
          tModel.Time.week(tModel.Time.date().getWeek() - 1);
          const chk = $$("input")[7 - 1];
          chk && [(chk.checked = true)];
          tModel.Time.date(addDays(tModel.Time.date(), -1));
        }
        //we hit monday from sun, go a week forth
        else if (oldVal < newVal && tModel.Time.date().getDay() === 0) {
          tModel.Time.week(tModel.Time.date().getWeek() + 1);
          const chk = $$("input")[1 - 1];
          chk && [(chk.checked = true)];

          tModel.Time.date(addDays(tModel.Time.date(), 1));
        } else {
          const chk = $$("input")[tModel.Time.date().getDay() - 1];
          chk && [(chk.checked = true)];
        }
      }
    }
    {
      //update colors
      tModel.color(
        permData[tModel.Time.date().getWeek()][tModel.Time.date().getDay() - 1]
      );
    }
  });
};

const updateWeekday = newWeekday => {
  newWeekday = +newWeekday;

  newWeekday < tModel.Time.date().getDay() + 1
    ? [
        console.debug({
          action: "going down",
          by: (tModel.Time.date().getDay() - newWeekday),
          from: tModel.Time.date(),
          
          to: addDays(tModel.Time.date(), -(tModel.Time.date().getDay() - newWeekday))
        }),
        tModel.Time.date(addDays(tModel.Time.date(), -(tModel.Time.date().getDay() - newWeekday)))
      ]
    : [
        console.debug({
          action: "going up",
          by: -(tModel.Time.date().getDay() - newWeekday),
          from: tModel.Time.date(),
          
          to: addDays(tModel.Time.date(), -(tModel.Time.date().getDay() - newWeekday))
        }),
       tModel.Time.date(addDays(tModel.Time.date(), -(tModel.Time.date().getDay() - newWeekday)))
      ];
  tModel.Time.totalDay(daysBetween($start, tModel.Time.date()));
  //console.log(tModel.Time.date())
};

tModel.Time.totalDay.subscribe(updateUI, null, "beforeChange");

//reflect color updates
tModel.color.subscribe(newVal => {
  if (tModel.Time.date().getDay() > 5) [tModel.color("???"), (newVal = "gray")];

  $("#color>val").style.color = newVal;
  $("svg>g>path#main").style.fill = newVal;
});

for (const _input of $$("input[type=radio]")) {
  _input.addEventListener("change", e => {
    updateWeekday(+e.target.value);
    //calc new day
    //tModel.Time.weekDay(+e.target.value - 1);
  });
}

//bindings
ko.applyBindings(tModel);

//init
{
  //fill all white
  for (const stroke of $$("svg>g>path")) {
    stroke.style.stroke = "white";
  }
  //init date
  tModel.Time.date(new Date());
  //tModel.Time.date(addDays(tModel.Time.date(), tModel.Time.totalDay()));

  tModel.Time.week(tModel.Time.date().getWeek());

  const _wDay = tModel.Time.date().getDay();
  const chk = $$("input")[_wDay - 1];
  chk && [(chk.checked = true)];

  //init color
  tModel.color(
    permData[tModel.Time.date().getDay()][tModel.Time.date().getDay() - 1]
  );
}
