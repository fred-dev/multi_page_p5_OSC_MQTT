let btnSceneOne;
let btnSceneTwo;
let btnSceneThree;

function setup() {
  createCanvas(400, 400);
  btnSceneOne = createButton ("GO TO SCENE ONE");
  btnSceneOne.position(0, 100);
  btnSceneOne.mousePressed(goToSceneOne);

  btnSceneTwo = createButton ("GO TO SCENE TWO");
  btnSceneTwo.position(0, 200);
  btnSceneTwo.mousePressed(goToSceneTwo);

  btnSceneThree = createButton ("GO TO SCENE THREE");
  btnSceneThree.position(0, 300);
  btnSceneThree.mousePressed(goToSceneThree);

}

function draw() {
  background(0);
}

function goToSceneOne(){
  window.location.href = "sceneOne.html";
}
function goToSceneTwo(){
  window.location.href = "sceneTwo.html";
}
function goToSceneThree(){
  window.location.href = "sceneThree.html" ;
}