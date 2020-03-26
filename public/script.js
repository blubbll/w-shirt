const { ko } = window;

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

const colors = ["darkblue", "red", "orange", "green", "blue", "brown"];

const start = new Date("2020-01-01");

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

//Nächstes Datum
function nextDate(dayIndex) {
  var today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1
  );
  return today;
}

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

//custom periodic, emulated calendar.
const d = new Date();

const _totalDay = daysBetween(start, new Date());

const tModel = {
  Time: {
    weekDay: ko.observable(d.getDay()),
    totalDay: ko.observable(_totalDay),
    week: ko.observable(d.getWeekNumber()),
    date: ko.observable(d)
  },
  combos: permData.length,
  color: ko.observable("gold"),

  toggleFoodlist: () => {
    tModel.Food.listExpanded(!tModel.Food.listExpanded());
  }
};

tModel.Time.week.subscribe(newVal => {
  console.log(newVal);
});

const updateUI = oldVal => {
  oldVal = +oldVal;

  //const date = new Date()
  //date.setDate(date.getDate() + 1)
  //dModel.Time.totalDay(new Date())
  //dtModel.Time.week(new.getWeekNumber())

  setTimeout(() => {
    const newVal = tModel.Time.totalDay();

    const clicked = +document.activeElement.value === tModel.Time.weekDay();
    /* console.log({
      clicked: +document.activeElement.value,
      shouldbe: tModel.Time.weekDay(),
      or: oldVal
    });*/

    //move in week
    if (!clicked) {
      oldVal > newVal
        ? [tModel.Time.weekDay(tModel.Time.weekDay() - 1)]
        : [tModel.Time.weekDay(tModel.Time.weekDay() + 1)];

      if (newVal !== 0) {
        //we hit sunday from mon, go a week back
        if (oldVal > newVal && tModel.Time.weekDay() === 0) {
          tModel.Time.week(tModel.Time.week() - 1);
          const chk = $$("input")[7 - 1];
          chk && [(chk.checked = true)];
          tModel.Time.weekDay(7);
        }
        //we hit monday from sun, go a week forth
        else if (oldVal < newVal && tModel.Time.weekDay() === 8) {
          tModel.Time.week(tModel.Time.week() + 1);
          const chk = $$("input")[1 - 1];
          chk && [(chk.checked = true)];
          tModel.Time.weekDay(1);
        } else {
          const _wDay = tModel.Time.weekDay();
          const chk = $$("input")[_wDay - 1];
          chk && [(chk.checked = true)];
        }
      }
    }
    {
      //update colors
      tModel.color(permData[tModel.Time.week()][tModel.Time.weekDay() - 1]);
      //update actual date
      tModel.Time.date(addDays(tModel.Time.date(), tModel.Time.totalDay()));
    }
  });
};

const updateWeekday = newWeekday => {
  newWeekday = +newWeekday;

  const newDay =
    +tModel.Time.totalDay() + -(tModel.Time.weekDay() - newWeekday);
  tModel.Time.totalDay(newDay);

  newWeekday < tModel.Time.weekDay()
    ? [
        console.log("went " + (tModel.Time.weekDay() - newWeekday) + " down"),
        tModel.Time.weekDay(newWeekday)
      ]
    : [
        console.log("went " + -(tModel.Time.weekDay() - newWeekday) + " up"),
        tModel.Time.weekDay(newWeekday)
      ];
};

tModel.Time.totalDay.subscribe(updateUI, null, "beforeChange");

//reflect color updates
tModel.color.subscribe(newVal => {
  if (tModel.Time.weekDay() > 5) [tModel.color("???"), (newVal = "gray")];

  $("#color>val").style.color = newVal;
  $("svg>g>path#main").style.fill = newVal;
});

//format date
/*tModel.Time.date.subscribe(newVal => {
  let d = tModel.Time.date();
  if(d.includes("."))

  tModel.Time.date(`${d.getDate()}.${d.getMonth()}${d.getYear()}`);
});*/

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
  const _wDay = tModel.Time.weekDay();
  const chk = $$("input")[_wDay - 1];
  chk && [($$("input")[_wDay - 1].checked = true)];

  //init color
  tModel.color(permData[tModel.Time.week()][tModel.Time.weekDay() - 1]);
  //init date
  tModel.Time.date(addDays(tModel.Time.date(), tModel.Time.totalDay()));
}
