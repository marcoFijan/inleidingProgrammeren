//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\-VARIABLES-/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\

// ------------------------------------------------------------------------PLAYERSTATS-----------------------------------------------------------------------------------------
var player = {
  health: 100,
  magicka: 100,

  magicCost: 30,
  potionAmount: 5,

  swordDamage: 40,
  magicDamage: 45,

  potionHealAmount: 70,
  magicHealAmount: 100
};

//--------------------------------------------------------------------------ENEMYSTATS-----------------------------------------------------------------------------------------
var goblin = {
  health: 70,
  maxAttackPower: 30,
  name: "goblin"
};

var skeleton = {
  health: 30,
  maxAttackPower: 40,
  name: "skeleton"
};

var ghost = {
  health: 110,
  maxAttackPower: 20,
  name: "ghost"
};

var giant = {
  health: 200,
  maxAttackPower: 50,
  name: "giant"
};

//----------------------------------------------------------------------REGULATE USER INPUT-----------------------------------------------------------------------------------
var lockedInput = true;
var gamePlaying = false;

//------------------------------------------------------------------------ENEMIES ARRAY----------------------------------------------------------------------------------------
var enemies = [goblin, skeleton, ghost, giant];
var enemy; //current enemy
var addEnemy = true;

//-----------------------------------------------------------------ARRAY WITH ALL SLAIN ENEMIES--------------------------------------------------------------------------------
var slainEnemies = new Array();
var slainEnemyCounter = 0;

//----------------------------------------------------------------------------AUDIO--------------------------------------------------------------------------------------------
//Source bgMusic: https://soundcloud.com/evan-king/guardians?in=evan-king
var bgMusic = new Audio();
bgMusic.src = "resources/audio/bgMusic.mp3";

//Source soundeffects: https://www.zapsplat.com/page/2/?s=gulp&post_type=music&sound-effect-category-id
var healMagicAudio = new Audio();
healMagicAudio.src = "resources/audio/healMagic.mp3";

var healPotionAudio = new Audio();
healPotionAudio.src = "resources/audio/healPotion.mp3";

var attackSwordAudio = new Audio();
attackSwordAudio.src = "resources/audio/attackSword.mp3";

var attackMagicAudio = new Audio();
attackMagicAudio.src = "resources/audio/attackMagic.mp3";

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\-FUNCTIONS-/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\

//---------------------------------------------------------------Function to update the screen---------------------------------------------------------------------------------
function updateScreen() {
  document.getElementById("playerHealth").innerText = "Your health is: " + player.health;
  document.getElementById("playerStats").innerText = "Magicka: " + player.magicka + "\nPotions: " + player.potionAmount;
  document.getElementById("enemyHealth").innerText = "The enemies health is: " + enemy.health;
}

//---------------------------------------------------FUNCTION FOR WHEN THE USER USES HIS SWORD TO INFLICT DAMAGE----------------------------------------------------------------
function attackSword() {
  setLockedInput(true);
  var playerSwordAttack = Math.floor(Math.random() * player.swordDamage);
  document.getElementById("update").innerText = "You swing your sword at your enemy which results in " + playerSwordAttack + " damage";
  enemy.health -= playerSwordAttack;
  updateScreen();
  if (enemy.health <= 0) {
      document.getElementById("enemyHealth").innerText = "You have defeated your enemy";
      victory();
  }
  else{
    setTimeout(function() {
      enemyAttack();
    }, 3000);
  }
}

//-----------------------------------------------------------FUNCTION FOR WHEN THE USER USES ATTACK MAGIC--------------------------------------------------------------------------
function attackMagic() {
  setLockedInput(true);
  var playerMagicAttack = Math.floor(Math.random() * player.magicDamage);
  document.getElementById("update").innerText = "You cast a fireball at the enemy what results in " + playerMagicAttack + "  damage";
  player.magicka -= player.magicCost;
  enemy.health -= playerMagicAttack;
  updateScreen();
  if (enemy.health <= 0) {
      document.getElementById("enemyHealth").innerText = "You have defeated your enemy";
      victory();
  }
  else{
    setTimeout(function() {
      enemyAttack();
    }, 3000);
  }
}

//---------------------------------------------------------FUNCTION FOR WHEN THE PLAYER USES HEALING POTION------------------------------------------------------------------------
function healPotion() {
setLockedInput(true);
  var playerPotionHeal = Math.floor(Math.random() * player.potionHealAmount);
  if (playerPotionHeal <= 30) {
      document.getElementById("update").innerText = "In haste you spilled most of your potion on the ground. You're barely healed by " + playerPotionHeal + " healthpoints";
  } else {
      playerPotionHeal = player.potionHealAmount;
      document.getElementById("update").innerText = "You drink the whole potion and are healed by " + playerPotionHeal + " healthpoints";
  }
  player.potionAmount--;
  if (player.health + playerPotionHeal > 100) {
      player.health = 100;
  } else {
      player.health += playerPotionHeal;
  }
  updateScreen();
  setTimeout(function() {
      enemyAttack();
  }, 6000);
}

//---------------------------------------------------------FUNCTION FOR WHEN THE PLAYER USES HEALING MAGIC--------------------------------------------------------------------------
function healMagic() {
setLockedInput(true);
  var playerMagicHeal = Math.floor(Math.random() * player.magicHealAmount);
  if (playerMagicHeal <= 30) {
      document.getElementById("update").innerText = "You fail to concentrate your magicka. You're barely healed by " + playerMagicHeal + " healthpoints";
  } else {
      playerMagicHeal = player.magicHealAmount;
      document.getElementById("update").innerText = "You cast your magic succesfully and are healed for " + playerMagicHeal + " healthpoints";
  }
  player.magicka -= player.magicCost;
  if (player.health + playerMagicHeal > 100) {
      player.health = 100;
  } else {
      player.health += playerMagicHeal;
  }
  updateScreen();
  setTimeout(function() {
      enemyAttack();
  }, 6000);
}

//---------------------------------------------------------------FUNCTION FOR WHEN THE ENEMY ATTACKS----------------------------------------------------------------------------------
function enemyAttack() {
  document.getElementById("update").innerText = "Your opponent is about to strike";

  setTimeout(function() {
      var enemyAttackDamage = Math.floor(Math.random() * enemy.maxAttackPower);
      player.health -= enemyAttackDamage;
      document.getElementById("update").innerText = "You took " + enemyAttackDamage + " damage";
      updateScreen();
  }, 2000);
  updateScreen();

  setTimeout(function() {
    if (player.health <= 0) {
      defeat();
    } else {
        setTimeout(function() {
            lockedInput = false;
            document.getElementById("update").innerText = "Your turn";
            player.magicka += 10;
            updateScreen();
            document.getElementById("attackSword").disabled = false;
            if (player.magicka >= player.magicCost) {
                document.getElementById("attackMagic").disabled = false;
                document.getElementById("healMagic").disabled = false;
              }
              if (player.potionAmount >= 1) {
                document.getElementById("healPotion").disabled = false;
              }
        }, 3000);
      }
  }, 2000);
}

//------------------------------------------------------------FUNCTION CALLED WHEN PLAYER IS DEFEATED-------------------------------------------------------------------------------------
function defeat() {
  console.log("defeat triggered");
  var attackButton = document.getElementById("attackSword");
  attackButton.disabled = true;
  document.getElementById("enemyHealth").innerText = "You're defeated by your enemy";
  document.getElementById("update").innerText = "Do you want to try again?";
  document.getElementById("defeatedButton").className = "";
  document.getElementById("defeatedButton").addEventListener("click", function(e) {
    var target = e.target;
    if(target.id == "defeatedButton"){
      document.getElementById("defeatedButton").className = "hide";
      window.location.reload();
    }
  });

  window.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    if(keyCode == 84){
      document.getElementById("defeatedButton").className = "hide";
      window.location.reload();
    }
  });
}

//Source to hide buttons: https://www.youtube.com/watch?v=e57ReoUn6kM&list=PL965lVhM97M20nhE0gfLrYjzjRrrfRWzS&index=3&t=730s
//--------------------------------------------------------------FUNCTION CALLED WHEN ENEMY DEFEATED----------------------------------------------------------------------------------------
function victory() {
  if (slainEnemies[0] == null) {
      slainEnemies[0] = enemy.name;
  } else {
      slainEnemies[slainEnemies.length] = enemy.name;
      console.log(enemy.name);
      console.log("position " + slainEnemies.length);
  }
  lockedInput = true;
  setTimeout(function() {
    document.getElementById("update").innerText = "Do you want to continue your journey?";
    document.getElementById("continueButton").className = "";
    document.getElementById("slainEnemiesButton").className = "";
    document.getElementById("buttons").className = "hide";
  }, 3000);

  // Using mouse
  document.getElementById("victoryButtons").addEventListener("click", function(e) {
      var target = e.target;
      if (target.id == "continueButton") {
          document.getElementById("continueButton").className = "hide";
          document.getElementById("slainEnemiesButton").className = "hide";
          document.getElementById("buttons").className = "buttons";
          play();
      }
      if (target.id == "slainEnemiesButton"){
        showSlainEnemies();
      }
  });

  // Using keyboard
  window.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    if(keyCode == 67){
      document.getElementById("continueButton").className = "hide";
      document.getElementById("slainEnemiesButton").className = "hide";
      document.getElementById("buttons").className = "buttons";
      play();
    }
    else if (keyCode == 75){
      showSlainEnemies();
    }
  });
}

//---------------------------------------------------FUNCTION TO SHOW WHICH ENEMIES YOU HAVE SLAIN INPUTS--------------------------------------------------------------------------
function showSlainEnemies() {
  var slainEnemiesString = "You have slain: ";
  for(var i = 0; i < slainEnemies.length; i++) {
      slainEnemiesString += slainEnemies[i] + ", ";
  }
  document.getElementById("update").innerText = slainEnemiesString;
}

//-------------------------------------------------------------FUNCTION TO ENABLE/DISABLE INPUTS--------------------------------------------------------------------------
function setLockedInput(input) {
  document.getElementById("attackSword").disabled = input;
  document.getElementById("attackMagic").disabled = input;
  document.getElementById("healPotion").disabled = input;
  document.getElementById("healMagic").disabled = input;
  lockedInput = input;
}

//Source for the if else call for the buttons: https://stackoverflow.com/questions/27731812/simple-if-else-onclick-then-do
//---------------------------------------------------------------PLAY FUNCTION TO PLAY THE GAME--------------------------------------------------------------------------
function play() {
  setLockedInput(true);
  if(slainEnemies[0] == null) {
      document.getElementById("update").innerText = "You start your adventure!";
  } else {
      document.getElementById("update").innerText = "You continue your adventure!";
  }

  enemy = null;
  var currentEnemy = Math.floor(Math.random() * (enemies.length));
  enemy = { ...enemies[currentEnemy]};
  // Source for copying var: https://www.codementor.io/junedlanja/copy-javascript-object-right-way-ohppc777d

  setTimeout(function() {
      document.getElementById("update").innerText = "A " + enemy.name + " appears!";
  }, 3000);

  setTimeout(function() {
      document.getElementById("update").innerText = "What do you want to do?";
      setLockedInput(false);
      updateScreen();
  }, 6000);

  document.getElementById("buttons").addEventListener("click", function(e) {
      var target = e.target;
      if(target.id == "attackSword" && !lockedInput) {
          attackSwordAudio.play();
          attackSword();
      } else if(target.id == "attackMagic" && !lockedInput) {
          attackMagicAudio.play();
          attackMagic();
      } else if(target.id == "healPotion" && !lockedInput) {
          healPotionAudio.play();
          healPotion();
      } else if(target.id == "healMagic" && !lockedInput) {
          healMagicAudio.play();
          healMagic();
      }
  }, false);

  window.addEventListener("keydown", function(e) {
      var keyCode = e.keyCode;
      if(keyCode == 65 && !lockedInput) {
          attackSwordAudio.play();
          attackSword();
      } else if(keyCode == 83 && !lockedInput) {
          attackMagicAudio.play();
          attackMagic();
      } else if(keyCode == 68 && !lockedInput) {
          healPotionAudio.play();
          healPotion();
      } else if(keyCode == 70 && !lockedInput) {
          healMagicAudio.play();
          healMagic();
      }
      //Source for discovering paused propety: https://stackoverflow.com/questions/9437228/html5-check-if-audio-is-playing
      if(keyCode == 77){
        if(bgMusic.paused){
          bgMusic.loop = true;
          bgMusic.play();
        }
        else{
          bgMusic.pause();
        }
      };


  });
}

//------------------------------------------------------------------FUNCTION TO START THE GAME--------------------------------------------------------------------------
function game(){
  window.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    if(keyCode != null && !gamePlaying){
      gamePlaying = true;
      document.getElementById("playButton").className = "hide";
      document.getElementById("playText").className = "hide";
      document.getElementById("playDiv").className = "hide";
      play();
    }
  });

  window.addEventListener("click", function(e){
    var target = e.target;
    if(target.id == "playButton"){
      gamePlaying = true;
      document.getElementById("playButton").className = "hide";
      document.getElementById("playText").className = "hide";
      document.getElementById("playDiv").className = "hide";
      play();
    }
  });
}

//Start the game
game();
