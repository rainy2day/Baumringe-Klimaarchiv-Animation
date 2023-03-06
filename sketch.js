let tableData
let cleanData
let table

//Variablen für Vertex Kreis
let scale = 50;
let resolution = 0.0035;
let numPoints = 1080;
let numRings = 159;

//Variablen für Animation
let rad = []
let ringIndex = 0

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  tableData = loadTable('data/climate-dta-temp-average.csv', 'csv', 'header');
  }


function setup() {
createCanvas(1200, 1280);
noiseSeed(25);
colorMode(HSB)
// Set text characteristics

// background(20,50,20)
strokeWeight(1.35)
// frameRate(1)


cleanData = tableData.rows.map( function(eintrag, index) {
  const obj = eintrag.obj // falsch beschriftet
  // const temp = obj.year // Achtung! Es ist ein String
  const temp = parseFloat(obj.year) // macht Zahl aus String
  const hueVal = map(temp, 6, 10.2, 200, 359)
  const rad = temp + (index + 1) * 3.5
  const prec = parseFloat(obj.prec) //Jahresniederschlag

  const newObj = { 
    year: parseFloat(obj.time),
    temperature: temp,
    precipitation: prec, 
    hue: hueVal,
    radius: rad
  } // neues Objekt richtig benannt

  return newObj // neues Objekt in neuen Array geschrieben
}) // generiert neuen Array, ursprüngliche Daten werden nicht verändert
console.log(cleanData)
}

function draw() {
  background(220)
  translate(width/2, height/2 + 80)
  noFill();

  cleanData.forEach(function(eintrag, index) {
    // Loop durch die «sauberen» Daten
    const year = eintrag.year
    const temperature = eintrag.temperature
    const hue = eintrag.hue
    const radius = eintrag.radius
    const precipitation = eintrag.precipitation;

    // push()
    // Hier beginnt die Zeichnung der Kreise
    stroke(hue, 100, 100)

    if (index <= ringIndex) {
      beginShape();
      for (let a = 0; a < TAU; a += TAU/numPoints) {
        let x = cos(a) * radius
        let y = sin(a) * radius
    
        var n = map(noise(x * resolution, y * resolution), 0, 1, -scale, scale)
    
        curveVertex(x+n, y+n);
    
        if(random()>0.85-0.2*sin(radius)){
          endShape();
          beginShape();
        }
      }
      endShape();
    }

    if (index <= ringIndex+5) { // Baumrinde wird erst beim letzten Ring gezeichnet
      push() // hier beginnt die Zeichnung der Baumrinde
      //randomSeed(random(37, 99)); // hier wird die Bewegung gestoppt
      strokeWeight(5);
      stroke(10, 100, 100, 1);
  
       for (let r = 550; r < radius; r += radius / numRings){
          beginShape();
        for (let a = 0; a < TAU; a += TAU/numPoints) {
          let x = cos(a) * r;
          let y = sin(a) * r;
  
          let n = map(noise(x * resolution, y * resolution), 0, 1, -scale, scale);
  
          curveVertex(x + n, y + n);
  
          if (random(0, 1.1) > 0.85 - 0.2 * sin(radius)) {
            endShape();
            beginShape();
          }
        }
        endShape();
      }
      pop();
    }

        // Hier beginnt der Text zu den Ringen
        push();
        if (index <= ringIndex) {   // Mit <= bleibt der Text stehen
          fill(100, 100, 100);  
          stroke(hue, 100, 100);
          strokeWeight(14);
          strokeJoin(ROUND);
          textSize(22);
          textStyle(BOLD);
          text(`${year}`, radius * 0.71 - 40, -radius * 0.71 - 50);
          text(`${temperature}°C`, radius * 0.71 - 40, -radius * 0.71 - 25);
          text(`${precipitation}mm`, radius * 0.71 - 40, -radius * 0.71 );
        }
        pop();
    
  // Headline 1
  push();
  if (ringIndex > 145) {   // Mit <= bleibt der Text stehen
    fill(85, 100, 100);
    stroke(hue, 100, 100);
    strokeWeight(30);
    strokeJoin(ROUND);
    textSize(112);
    textStyle(BOLD);
    text("some like it hot", -500, -540)
  }
  pop();

  // Headline 2
  push();
  if (ringIndex > 157) {   // Mit <= bleibt der Text stehen
    fill(100, 0, 0);
    stroke(hue, 100, 100);
    strokeWeight(64);
    strokeJoin(ROUND);
    textSize(112);
    textStyle(BOLD);
    text("conifers don't !", -500, -540)
  }
  pop();

  });

  // noLoop();
  // pop()

  ringIndex = (ringIndex + 1)

  if (ringIndex >= 159) {//Fehler stoppt die Bewegung am Schluss
    ringIndex = (index)
  } 
}
