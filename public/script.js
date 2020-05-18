const //imports
  { ko, hello } = window;

console.clear();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//https://www.jeans-fritz.de/regular-fit-hemd-mit-kleinem-karo-0110709.html?farbpalette=86&catId=64
const colors = ["RoyalBlue", "DarkSeaGreen", "tomato", "LightGrey", "DodgerBlue"];

//Tage zwischen
const daysBetween = (one, another) => {
  return Math.round(Math.abs(+one - +another) / 8.64e7);
};

//getWeek to connect real to fake
Date.prototype.getWeekNumber = function() {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
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

const permData = perm(colors);

//fake year lol
const $tymes = [];
{
  Array.from(Array(52 * 7)).forEach((x, i) => {
    $tymes.push({
      day: i + 1,
      wday: (i % 7) + 1,
      week: Math.floor(i / 7) + 1,
      month: Math.floor(i / 28) + 1,
      mday: i % 28 === 0 ? 1 : (i % 28) + 1
    });
  });
}

const tModel = {
  tyme: ko.observable($tymes[0]),
  combos: permData.length,
  shirtColor: ko.observable("gold")
};

const updateByClick = newWeekday => {
  const $tyme = tModel.tyme;

  //update tyme based on new weekday
  $tyme($tymes.find(x => x.wday === newWeekday && x.week === $tyme().week));
};

const jumpFromInput = function(obj, event) {
  const $tyme = tModel.tyme;

  $tyme($tymes.find(x => x.day === +event.srcElement.value));
};

//reflect color updates
tModel.shirtColor.subscribe(newVal => {
  const $tyme = tModel.tyme;

  if ($tyme().wday > 5) {
    tModel.shirtColor("???"), (newVal = "white");

    for (const stroke of $$("svg#shirt>g>path")) {
      //color shirt black
      stroke.style.stroke = "black";
      //update colorname
      $("#color>val").style.color = "black";
    }
  } else {
    //apply default stroke to outline (white)
    for (const stroke of $$("svg#shirt>g>path")) {
      stroke.style.stroke = "white";
    }

    //update pants
    for (const stroke of $$("svg#pants>g>path")) {
      stroke.style.fill = $tyme().day % 2 === 0 ? "navy" : "black";
    }

    //update colorname
    $("#color>val").style.color = newVal;
  }

  //color shirt
  $("#shirt>g>path#main").style.fill = newVal;
});

//reflect day updates on tyme var
tModel.tyme.subscribe(newVal => {
  const $tyme = tModel.tyme;

  tModel.shirtColor(permData[$tyme().week - 1][$tyme().wday - 1]);

  //init checkbox
  const chk = $$("input")[$tyme().wday - 1];
  chk && [(chk.checked = true)];
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

    //let's begin
    const now = new Date();
    $tyme(
      $tymes.find(
        x =>
          x.wday === (now.getDay() === 0 ? 7 : now.getDay()) &&
          x.week === now.getWeekNumber()
      )
    );
  }
}
