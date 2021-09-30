class Enemy {
		  constructor(health, name) {
		    this.health = health;
		    this.initHealth = health;
		    this.name = name;
		  }
		}
		
		const development = true;
		
		class AudioController {
		  constructor(audioArray, helpers) {
		    this.sampleCount = 0;
		    this.loadedIndex = 0;
		    this.sfxOn = true;
		
		    if (helpers == undefined) {
		      this.helpers = true;
		    }
		
		    // Affirm in console that module has been included
		    console.log(
		      "%c 🔊 Audio module active ",
		      "padding: 10px; background: #cbfd9f; color: #3b4e2a"
		    );
		
		    // Helpers
		    if (this.helpers) {
		      if (audioArray.length == 0) {
		        console.warn("No audio array or audio array empty");
		      }
		    }
		
		    audioArray.forEach(
		      function (aud, index) {
		        if (aud.stackSize != undefined) {
		          this.sampleCount += aud.stackSize;
		        } else {
		          this.sampleCount += 1;
		        }
		      }.bind(this)
		    );
		
		    // Create a global audio array
		    this._globalAudio = [];
		
		    // Iterate through all our samples
		    audioArray.forEach(
		      function (aud, index) {
		        if (aud.stackSize != undefined) {
		          this.stackSize = aud.stackSize;
		        } else {
		          this.stackSize = 1;
		        }
		
		        // If the type of audio is not background music, stack it and play based on an index,
		        // This means you can play small samples very quickly. You cannot play the same audio
		        // Object until the current object has finished
		
		        var audioObject = [];
		
		        let a = new Audio();
		        let b;
		        a.preload = true;
		        a.src = aud.source;
		
		        for (var i = 0; i < this.stackSize; i++) {
		          b = new Audio();
		          b.src = a.src;
		
		          b.onloadeddata = function () {
		            this.loadedIndex++;
		            this.progress = Math.ceil(
		              (this.loadedIndex / this.sampleCount) * 100
		            );
		
		            if (this.helpers) {
		              console.clear();
		              console.log(
		                "%c 🔊 Audio module active ",
		                "padding: 10px; background: #cbfd9f; color: #3b4e2a"
		              );
		              console.log(`Loading ${audioArray.length} audio sample(s)`);
		              console.log(`Loading ${aud.name}`);
		              console.log(`${this.progress}%`);
		            }
		
		            if (this.progress == 100) {
		              this.onLoaded();
		            }
		          }.bind(this);
		
		          audioObject.push(b);
		        }
		
		        audioObject.index = 0;
		        audioObject.maxIndex = this.stackSize;
		
		        this._globalAudio[aud.name] = audioObject;
		      }.bind(this)
		    );
		  }
		
		  play(audio) {
		    let sample = this._globalAudio[audio];
		
		    if (sample != undefined) {
		      // Get the current audio object in the stack
		      let index = sample.index;
		      let aud = sample[index];
		
		      // Play the audio object
		      if (this.sfxOn) {
		        aud.play();
		      }
		
		      // Increase the stack index or reset if it exceeds the max stack size
		      if (sample.index > sample.maxIndex - 2) {
		        sample.index = 0;
		      } else {
		        sample.index++;
		      }
		    } else {
		      console.warn(`${audio} does not exist.`);
		    }
		  }
		
		  stop(audio) {
		    let sample = this._globalAudio[audio];
		
		    if (sample != undefined) {
		      // Get the current audio object in the stack
		      let index = sample.index;
		      let aud = sample[index];
		
		      // Stop the audio object
		      aud.pause();
		      aud.currentTime = 0;
		    }
		  }
		
		  restart(audio) {
		    let sample = this._globalAudio[audio];
		
		    if (sample != undefined) {
		      // Get the current audio object in the stack
		      let index = sample.index;
		      let aud = sample[index];
		
		      // Stop the audio object
		      aud.pause();
		      aud.currentTime = 0;
		      aud.play();
		    }
		  }
		
		  pause(audio) {
		    let sample = this._globalAudio[audio];
		
		    if (sample != undefined) {
		      // Get the current audio object in the stack
		      let index = sample.index;
		      let aud = sample[index];
		
		      // Stop the audio object
		      aud.pause();
		    }
		  }
		
		  mute(audio) {
		    let sample = this._globalAudio[audio];
		
		    sample.forEach(function (s) {
		      s.volume = 0;
		    });
		  }
		
		  setVolume(audio, volume) {
		    let sample = this._globalAudio[audio];
		    let vol = volume / 100;
		
		    sample.forEach(function (s) {
		      s.volume = vol;
		    });
		  }
		
		  // Destroy an audio sample to save memory
		
		  destroy(audio) {
		    this._globalAudio[audio] = undefined;
		  }
		
		  stopAll() {
		    Object.keys(this._globalAudio).forEach(
		      function (key) {
		        this._globalAudio[key].forEach(function (aud) {
		          aud.pause();
		          aud.currentTime = 0;
		        });
		      }.bind(this)
		    );
		  }
		
		  muteAll() {
		    Object.keys(this._globalAudio).forEach(
		      function (key) {
		        this._globalAudio[key].forEach(function (aud) {
		          aud.volume = 0;
		        });
		      }.bind(this)
		    );
		  }
		
		  list() {
		    Object.keys(this._globalAudio).forEach(
		      function (key) {
		        console.log("%c" + key, "font-weight: bold; color: green");
		      }.bind(this)
		    );
		  }
		
		  onLoaded() {
		    if (this.helpers) {
		      console.log("All audio loaded");
		      this.list();
		    }
		  }
		}
		
		new Vue({
		  el: "#app",
		
		  data() {
		    return {
		      keyCode: 32,
		      minutes: 4,
		      seconds: 0,
		      ms: 1,
		      pressed: false,
		      strength: 1,
		      intelligence: 1,
		      luck: 1,
		      speed: 1,
		      gameStarted: false,
		      muteBg: false,
		      boss: false,
		      damage: 1,
		      weapon: "Blunt sword",
		      weaponDamage: 1,
		      enemiesPerStage: 2,
		      canAttack: false,
		      stage: 1,
		      goldGained: 0,
		      sfx: true,
		      xpGained: 0,
		      introClicked: false,
		      bgMusicStarted: false,
		      stageComplete: false,
		      xp: 0,
		      damageAnim: 1,
		      shoppingPhase: false,
		      gold: 0,
		      gameover: false,
		      gamewin: false,
		      audioController: "",
		      enemy: new Enemy(5, "HAREK SEDGWICK"),
		      enemiesDefeated: 0,
		      enemyKilled: false,
		      tooltipTimer: 0,
		      tooltip: true,
		      enemyNames: [
		        "JACOB DANGERS",
		        "MILEON MASON",
		        "MACE CAVELIER",
		        "OSRIC GRAGOLOON",
		        "MOSES STONEWELL",
		        "TRISTAN GOSBECK",
		        "REDWALD CROMWELL",
		        "JEREMIAS PICARD",
		        "EGRIC MAIDSTONE",
		        "ROBIN CURTEYS",
		        "DINUS DE REUE",
		        "HAREK SEDGWICK",
		        "FLORA DAUBERVILLE",
		        "RAMETTA THE SLENDER",
		        "ISEMAY VERNOLD",
		        "AVINA CECIL",
		        "FANUS THE GREAT",
		        "GASPAR SHADOWSEEKER",
		        "GOUBERT THE RED",
		        "ALDOUS DARCY",
		        "RYN THE RED",
		        "FULLER CARDON",
		        "ANSELM THE OLD",
		        "ALVINA BLUETOOTH",
		        "MICKNEY  CORVISER",
		        "RYKOR RAVENSGATE",
		        "REYNARD LONGBOW",
		        "ALEX TROST",
		        "ADAM KUHN",
		        "STEVE GARDNER",
		        "CHASSIE EVANS",
		        "STEVEN SHAW",
		        "CHRIS COYIER",
		        "JHEY",
		        "PETE BARR",
		        "ZACH SAUCIER"
		      ],
		
		      audioArray: [
		        {
		          name: "swordHit1",
		          source: "https://assets.codepen.io/217233/ktkSwordHit1.mp3",
		          stackSize: 10
		        },
		        {
		          name: "swordHit2",
		          source: "https://assets.codepen.io/217233/ktkSwordHit2.mp3",
		          stackSize: 10
		        },
		        {
		          name: "swordHit3",
		          source: "https://assets.codepen.io/217233/ktkSwordHit3.mp3",
		          stackSize: 10
		        },
		        {
		          name: "death1",
		          source:
		            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath1.mp3",
		          stackSize: 10
		        },
		        {
		          name: "death2",
		          source:
		            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath2.mp3",
		          stackSize: 10
		        },
		        {
		          name: "death3",
		          source:
		            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath3.mp3",
		          stackSize: 10
		        },
		        {
		          name: "death4",
		          source:
		            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/ktkDeath4.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt1",
		          source: "https://assets.codepen.io/217233/ktkGrunt1.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt2",
		          source: "https://assets.codepen.io/217233/ktkGrunt2.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt3",
		          source: "https://assets.codepen.io/217233/ktkGrunt3.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt4",
		          source: "https://assets.codepen.io/217233/ktkGrunt4.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt5",
		          source: "https://assets.codepen.io/217233/ktkGrunt5.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt6",
		          source: "https://assets.codepen.io/217233/ktkGrunt6.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt7",
		          source: "https://assets.codepen.io/217233/ktkGrunt7.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt8",
		          source: "https://assets.codepen.io/217233/ktkGrunt8.mp3",
		          stackSize: 10
		        },
		        {
		          name: "grunt9",
		          source: "https://assets.codepen.io/217233/ktkGrunt9.mp3",
		          stackSize: 10
		        },
		        {
		          name: "bgmusic",
		          source: "https://assets.codepen.io/217233/ktkBgAudio.mp3"
		        },
		        {
		          name: "shopBell",
		          source: "https://assets.codepen.io/217233/ktkBell.wav"
		        },
		        {
		          name: "shopWoosh",
		          source: "https://assets.codepen.io/217233/ktkWoosh.wav"
		        },
		        {
		          name: "upgrade",
		          source: "https://assets.codepen.io/217233/ktkUpgrade.mp3",
		          stackSize: 10
		        },
		        {
		          name: "hover",
		          source: "https://assets.codepen.io/217233/ktkHover.mp3",
		          stackSize: 10
		        },
		        {
		          name: "crushyou",
		          source: "https://assets.codepen.io/217233/crush+you.wav",
		          stackSize: 1
		        },
		        {
		          name: "neverstop",
		          source: "https://assets.codepen.io/217233/neverstop.wav",
		          stackSize: 1
		        },
		        {
		          name: "persistance",
		          source: "https://assets.codepen.io/217233/persistance.wav",
		          stackSize: 1
		        },
		        {
		          name: "mercy",
		          source: "https://assets.codepen.io/217233/mercy.wav",
		          stackSize: 1
		        },
		        {
		          name: "purchases",
		          source: "https://assets.codepen.io/217233/pointlesspurchases.wav",
		          stackSize: 1
		        },
		        {
		          name: "fool",
		          source: "https://assets.codepen.io/217233/fool.wav",
		          stackSize: 1
		        },
		        {
		          name: "notpossible",
		          source: "https://assets.codepen.io/217233/not+possible.wav",
		          stackSize: 1
		        }
		      ],
		
		      // Hmm. Upgrades
		      upgrades: {
		        0: {
		          type: "stat",
		          names: "力量增强",
		          descriptions: "增加你的基础力量。 造成更大的伤害。",
		          cost: 25,
		          level: 1,
		          increment: 1,
		          costIncreasePerLevel: 20,
		          metric: "Strength",
		          stat: "strength",
		          maxLevel: 100
		        },
		        1: {
		          type: "stat",
		          names: "智力增强",
		          descriptions: "提高你的智力并获得更多的每次击杀经验。",
		          cost: 25,
		          level: 1,
		          increment: 1,
		          costIncreasePerLevel: 20,
		          metric: "Intelligence",
		          stat: "intelligence",
		          maxLevel: 100
		        },
		        2: {
		          type: "stat",
		          names: "速度增强",
		          descriptions: "提高你的速度。 出击更快！",
		          cost: 25,
		          level: 1,
		          increment: 1,
		          costIncreasePerLevel: 20,
		          metric: "Speed",
		          stat: "speed",
		          maxLevel: 7
		        }
		      }
		    };
		  },
		
		  methods: {
		    punch() {
		      if (_this.canAttack && !_this.gamewin && !_this.gameover) {
		        _this.tooltip = false;
		        _this.tooltipTimer = 0;
		
		        _this.canAttack = !_this.canAttack;
		        _this.pressed = !_this.pressed;
		        _this.damageAnim = Math.floor(Math.random() * 10) + 1;
		
		        let hitSound = Math.floor(Math.random() * 3) + 1;
		        let gruntSound = Math.floor(Math.random() * 9) + 1;
		        _this.audioController.play(`swordHit${hitSound}`);
		        _this.audioController.play(`grunt${gruntSound}`);
		
		        setTimeout(function () {
		          _this.pressed = !_this.pressed;
		        }, 150);
		
		        setTimeout(function () {
		          if (_this.enemyKilled == false) {
		            _this.canAttack = !_this.canAttack;
		          }
		        }, 500 - 50 * _this.speed);
		
		        if (_this.enemy.health > _this.damage) {
		          _this.enemy.health -= _this.damage;
		        } else {
		          _this.canAttack = false;
		
		          let deathSound = Math.floor(Math.random() * 4) + 1;
		          _this.audioController.play(`death${deathSound}`);
		
		          _this.enemy.health = 0;
		          _this.enemiesDefeated++;
		          _this.enemyKilled = true;
		
		          let baseXpPerKill = 10 + Math.floor(Math.random() * 3) + 1;
		          let xpPerKillWithBonus = Math.ceil(
		            baseXpPerKill * _this.stage +
		              ((baseXpPerKill * _this.stage) / 100) * (_this.intelligence * 10)
		          );
		
		          _this.xp += xpPerKillWithBonus;
		          _this.xpGained = xpPerKillWithBonus;
		
		          let baseGoldPerKill = 10 + Math.floor(Math.random() * 3) + 1;
		          let goldPerKillWithBonus = Math.ceil(
		            baseGoldPerKill * _this.stage +
		              ((baseGoldPerKill * _this.stage) / 100) * (_this.luck * 10)
		          );
		
		          _this.goldGained = goldPerKillWithBonus;
		          _this.gold += goldPerKillWithBonus;
		
		          if (_this.boss) {
		            _this.audioController.play("notpossible");
		            window.clearInterval(timer);
		            _this.gamewin = true;
		          } else {
		            if (_this.enemiesDefeated > _this.enemiesPerStage - 1) {
		              _this.stageComplete = true;
		
		              setTimeout(function () {
		                _this.shoppingPhase = true;
		
		                _this.audioController.play("shopWoosh");
		                _this.audioController.play("shopBell");
		
		                if (_this.stage == 1) {
		                  _this.audioController.play("fool");
		                }
		
		                if (_this.stage == 3) {
		                  _this.audioController.play("neverstop");
		                }
		
		                if (_this.stage == 5) {
		                  _this.audioController.play("purchases");
		                }
		
		                if (_this.stage == 7) {
		                  _this.audioController.play("persistance");
		                }
		
		                if (_this.stage == 9) {
		                  _this.audioController.play("mercy");
		                }
		
		                console.log("lowpass");
		                lowpassNode.frequency.value = 250;
		              }, 1000);
		
		              // Use Web Audio to create an audio graph that uses the stream from the audio element
		            } else {
		              setTimeout(function () {
		                console.log(_this.enemiesDefeated, _this.stage);
		                if (_this.enemiesDefeated == 10 && _this.stage == 10) {
		                  _this.enemy = new Enemy(3000, "King Trost");
		                  _this.boss = true;
		                } else {
		                  _this.enemy = new Enemy(
		                    7 * (_this.enemiesDefeated + 1 * _this.stage),
		                    _this.enemyNames[
		                      Math.floor(Math.random() * _this.enemyNames.length)
		                    ]
		                  );
		                }
		              }, 800);
		            }
		          }
		
		          setTimeout(function () {
		            _this.canAttack = true;
		            _this.enemyKilled = false;
		          }, 800);
		        }
		      }
		    },
		
		    toggleBg() {
		      if (this.muteBg == false) {
		        audioNode.volume = 0;
		        this.muteBg = true;
		      } else {
		        audioNode.volume = 1;
		        this.muteBg = false;
		      }
		    },
		    toggleSFX() {
		      this.sfx = !this.sfx;
		    },
		
		    buy(upgrade, type, stat) {
		      if (type == "stat") {
		        let u = this.upgrades[upgrade];
		        u.level++;
		
		        this.xp -= u.cost;
		
		        if (stat == "strength") {
		          this.strength += u.increment;
		          this.damage = this.strength * 1 + this.weaponDamage;
		        }
		
		        if (stat == "speed") {
		          this.speed += u.increment;
		        }
		
		        if (stat == "intelligence") {
		          this.intelligence += u.increment;
		        }
		
		        if (stat == "luck") {
		          this.luck += u.increment;
		        }
		
		        let newCost = u.costIncreasePerLevel * u.level;
		        u.cost = newCost;
		      }
		
		      if (type == "weapons") {
		        let w = this.upgrades[upgrade];
		        this.gold -= w.cost;
		        this.weaponDamage = w.damage;
		        this.damage = this.strength * 1 + this.weaponDamage;
		        this.weapon = w.names;
		        w.bought = true;
		
		        let newCost = u.costIncreasePerLevel * u.level;
		        u.cost = newCost;
		      }
		    },
		
		    exitShoppingPhase() {
		      _this.stageComplete = false;
		      this.shoppingPhase = !this.shoppingPhase;
		      this.stage++;
		      this.enemiesPerStage++;
		      this.enemiesDefeated = 0;
		      this.enemy = new Enemy(
		        5 * (_this.enemiesDefeated + 1 * _this.stage),
		        _this.enemyNames[Math.floor(Math.random() * _this.enemyNames.length)]
		      );
		      lowpassNode.frequency.value = 15000;
		    },
		
		    startGame() {
		      this.gameStarted = true;
		      lowpassNode.frequency.value = 15000;
		      this.canAttack = true;
		
		      timer = setInterval(function () {
		        _this.tooltipTimer++;
		
		        if (_this.minutes == 0 && _this.seconds == 0 && _this.ms == 0) {
		          // Show game over!
		          window.clearInterval(timer);
		          _this.gameover = true;
		          _this.canAttack = false;
		        }
		
		        if (_this.tooltipTimer > 100) {
		          _this.tooltip = true;
		        }
		        if (_this.ms > 0) {
		          _this.ms--;
		          if (_this.ms < 10) {
		            _this.ms = "0" + _this.ms;
		          }
		        } else {
		          _this.ms = 99;
		          if (_this.seconds < 1) {
		            _this.seconds = 59;
		            _this.minutes--;
		            _this.minutes = "0" + _this.minutes;
		          } else {
		            _this.seconds--;
		            if (_this.seconds < 10) {
		              _this.seconds = "0" + _this.seconds;
		            }
		          }
		        }
		      }, 10);
		    }
		  },
		
		  mounted() {
		    _this = this;
		
		    this.audioController = new AudioController(this.audioArray);
		
		    // JCanvas Audio Module
		    audioNode = document.querySelector("audio");
		
		    document.onclick = function () {
		      audioNode.loop = true;
		      audioNode.play();
		
		      if (!_this.bgMusicStarted) {
		        _this.bgMusicStarted = true;
		        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		        sourceNode = audioCtx.createMediaElementSource(audioNode);
		
		        // Create the lowpass filter
		        lowpassNode = audioCtx.createBiquadFilter();
		
		        // Connect the source to the lowpass filter
		        sourceNode.connect(lowpassNode);
		
		        // Connect the lowpass filter to the output (speaker)
		        lowpassNode.connect(audioCtx.destination);
		
		        console.log("lowpass");
		        lowpassNode.frequency.value = 250;
		      }
		    };
		
		    document.body.onkeyup = function (e) {
		      if (e.keyCode == _this.keyCode) {
		        if (!_this.shoppingPhase) _this.punch();
		      }
		    };
		  }
		});