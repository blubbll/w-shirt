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
Date.prototype.addDays = days => {
  return new Date(this.valueOf() + days * 864e5);
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

const tModel = {
  Time: {
    weekday: ko.observable(0),
    totalDay2: ko.observable(0),
    totalDay: { value: ko.observable(0) },
    week: ko.observable(0)
  },
  color: ko.observable("gold"),

  toggleFoodlist: () => {
    tModel.Food.listExpanded(!tModel.Food.listExpanded());
  }
};

{
  tModel.Time.totalDay.computer = ko.computed({
    //return a formatted price
    read: () => {
      return tModel.Time.totalDay.value();
    },
    //if the value changes, make sure that we store a number back to price
    write: newValue => {
      tModel.Time.totalDay.value(newValue);
    },
    owner: this
  });
}

tModel.Time.week.subscribe(function(newText) {
  console.log(newText);
});

//bindings
ko.applyBindings(tModel);
