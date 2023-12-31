let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name:"stick",
    power:5
  },
  {
    name:"dagger",
    power:30
  },
  {
    name:"claw hammer",
    power:50
  },
  {
    name:"sword",
    power:100
  },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]

const locations = [
  {
    name: "town square",
    "button text": ["Go to Store","Go to Cave","Fight dragon"],
    "button functions": [goStore,goCave,fightDragon],
    text: "You are are in the Town Square and you see a sign that says \"Store.\""
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 Gold)","Buy weapon (30 Gold)","Return to town Square"],
    "button functions": [buyHealth,buyWeapon,goTown],
    text: "You've entered the Store."
  },
  {
    name: "cave",
    "button text": ["Fight slime","Fight beast","Return to town Square"],
    "button functions": [fightSlime,fightBeast,goTown],
    text: "You've entered the Cave and you see monsters"
  },
  {
    name: "fight",
    "button text": ["Attack","Dodge","Return to town Square"],
    "button functions": [attack,dodge,goTown],
    text: "You're fighting a monster."
  },
  {
    name: "killMonster",
    "button text": ["Return to town Square","Return to town Square","Return to town Square"],
    "button functions": [goTown,goTown,easterEgg],
    text: "You've killed a Monster and earned XP."
  },
  {
    name: "lose",
    "button text": ["Replay?","Replay?","Replay?"],
    "button functions": [restart,restart,restart],
    text: "You died. "
  },
  {
    name: "win",
    "button text": ["Replay?","Replay?","Replay?"],
    "button functions": [restart,restart,restart],
    text: "You win. "
  },
  {
    name: "easterEgg",
    "button text": ["2","8","Return to Town Square"],
    "button functions": [pickTwo,pickEight,goTown],
    text: "You a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of these numbers you win. "
  }
]

// Initialise buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown(){
  update(locations[0]);
}


function goStore(){
  update(locations[1]);
}

function buyHealth(){
  if (gold >= 10){
    gold = gold - 10;
    health = health + 10;
    goldText.innerText = gold;
    healthText.innerText = health; 
  }
  else{
    text.innerText = "You have insufficient gold for this transaction.";
  }
  
}

function buyWeapon(){
  if (currentWeapon < weapons.length - 1){
    if (gold >= 30){
      gold = gold - 30;
      goldText.innerText = gold;
      currentWeapon++;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have: "+inventory;
    }
    else{
      text.innerText = "You have insufficient gold for this transaction.";
    }
  }
  else{
    text.innerText = "Your set of weapons is complete.";
    button2.innerText = "Sell a weapon for 15 gold";
    button2.onclick = sellWeapon;
}
}

function sellWeapon(){
  if (inventory.length > 1){
    gold = gold + 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText = "In your inventory you have: " + inventory;
  }
  else{
    text.innerText = "This is your only weapon."
  }
}

function goCave(){
  update(locations[2]);
}

function fightDragon(){
  fighting = 2;
  goFight();
}

function fightSlime(){
  fighting = 0;
  goFight();
}

function fightBeast(){
  fighting = 1;
  goFight();
}

function goFight(){
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack(){
  text.innerText = "The" + monsters[fighting].name + " attacks. ";
  text.innerText = "You attack it with your " + weapons[currentWeapon].name + ".";
  
  if (isMonsterHit()){
    health -= getMonsterAttackValue(monsters[fighting].level);
  }
  else{
    text.innerText = "You miss.";
  }
  
  healthText.innerText = health;
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random()*xp) + 1;
  monsterHealth.innerText = monsterHealth;
  if(health <= 0){
    lose();
  }
  else if(monsterHealth <= 0){
    if(fighting === 2){
      winGame();
    }
    else{
    defeatMonster();
  }
  }

  if(Math.random() <= 0.1 && inventory.length > 1){
    text.innerText = "Your " + inventory.pop() + " breaks.";
    currentWeapon = currentWeapon - 1;
  }
}

function getMonsterAttackValue(level){
  let hit = (level*5) - (Math.floor(Math.random()*xp));
  console.log(hit);
  return hit;
}

function isMonsterHit(){
  return Math.random() > 0.2 || health < 20;
}

function dodge(){
  text.innerText = "You dodge an attack from the " + monsters[fighting].name + ".";
  
}

function lose(){
  update(locations[5]);
}

function winGame(){
  update(locations[6]);
}

function defeatMonster(){
  gold = gold + Math.floor(monsters[fighting].level*6.7);
  xp = xp + monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  text.innerText = "You have defeated the "+monsters[fighting].name + ".";
}

function restart(){
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  goTown();
}

function easterEgg(){
  update(locations[7]);
}

function pickTwo(){
  pick(2);
}

function pickEight(){
  pick(8);
}

function pick(guess){
  let numbers = [];
  while(numbers.length < 10){
    numbers.push(Math.floor(Math.random()*11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers: \n";

  for(let i = 0; i<10; i++){
    text.innerText += numbers[i] + "\n";
  }

  if (numbers.indexOf(guess) !== -1){
    text.innerText += "You win 20 Gold!!";
    gold = gold + 20;
    goldText.innerText = gold;
  }
  else{
    text.innerText = "Wrong you lose 10 health."
    health -= 10;
    healthText.innerText = health;
    if(health <= 0){
      lose();
    }
  }
}