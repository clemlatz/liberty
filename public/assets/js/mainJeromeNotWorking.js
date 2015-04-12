var game = new Phaser.Game(1024, 1024, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create ,update:update, render: render});

function preload() {



 //  game.load.tilemap('level1', 'assets/tilemaps/text.txt', null, Phaser.Tilemap.TILED_JSON);
 //   game.load.image('gameTiles', 'assets/tilemaps/sprite_font.png');

    game.load.tilemap('level1', 'assets/tilemaps/final.txt', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/tilemaps/sprite_fontFINAL.png');

    game.load.spritesheet('prisoner', 'assets/images/sprite_anime-run.png', 64, 64, 6);
    game.load.spritesheet('guard', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

	game.load.image('piege', 'assets/images/piege.png');
	game.load.image('barbele', 'assets/images/barbele.png');

    //  game.load.spritesheet('prisoner', 'assets/sprites/spaceman.png', 16, 16);

    game.load.audio('Music',['assets/sounds/SFX_Gun1.mp3','assets/sounds/SFX_Gun1.ogg'] );

}


var lesjoueurs = new Joueurs();

var io = io.connect();


var gamestart = false;

//On screen Display
var OSD = new Array(10);

var gamestatut = 0;
var map;

io.on('join', function(player){
    var isowner=false;

    var j  = new Joueur(player.id,player.role,isowner);
    j.x=player.x;
    j.y=player.y;

    lesjoueurs.add(j);
});

io.on('leave', function(player){
    console.log('LEAVE');
    lesjoueurs.delete(player.id);
//    lesjoueurs.add(j);
});

/**
 * Debut de la partie
 */
io.on('start', function(config){

    console.log('START');
    lesjoueurs.clear();
    gamestart=true;

// config{?,players}

    var players = config.players;

    lesjoueurs.import(players);

    launchworld();

    /*
     if (self.role=='guard')
     game.add.text(window.innerWidth-300, 10,'Vous êtes un garde',{ font: "24px Arial",fill: '#FAAF00'});

     if (self.role=='prisoner')
     game.add.text(window.innerWidth-300, 10,'Vous êtes un prisonnier',{ font: "24px Arial",fill: '#FAAF00'});
     */

//    maskGraphics = this.game.add.graphics(0, 0);

    //  floor.mask=maskGraphics;

});

var blockedLayer;
var trapsLayer;

launchworld = function(){


    var splayer = lesjoueurs.monjoueur().sprite;

   // game.physics.arcade.enable(splayer);
    game.physics.enable(splayer, Phaser.Physics.ARCADE);

    game.world.bringToTop(splayer);
//    game.world.addAt(backgroundlayer, 0);

    splayer.body.collideWorldBounds = true;

//    splayer.body.setSize(10, 14, 2, 1);

    game.camera.follow(splayer);
}

io.on('stop', function(self){
    console.log('STOP');


});

var labeltime;

io.on('time', function(time){

    if (labeltime!=null){
        labeltime.destroy();
    }

    if (gamestart)
    {
        OSD[2] = labeltime = game.add.text(200, 40,'Il reste: '+time,{ font: "24px Arial",fill: '#FAAF00'});
    }else{
        OSD[2] = labeltime = game.add.text(200, 40,'Temps d\'attente estime: '+time,{ font: "24px Arial",fill: '#FAAF00'});
    }


});

io.on('player', function(player){

    if (gamestart){
       // console.log('PLAYER');
        lesjoueurs.updatepos(player);
    }

});



/**
 * initialisation, attribution de l'id (le meme pendants toutes les games)
 */
io.on('initia', function(obj){
    console.log('INITIA');

    var players = obj.players;
    var me = obj.player;
    var gamestatut = obj.gamestatut;

    lesjoueurs.myid = me.id;
    lesjoueurs.import(players);
    gamestart=true;

    launchworld();
});

function goFullScreen(){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.setScreenSize(true);
}

var music;
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    var resp="";

    while (resp=="" || resp==null){
        resp = prompt("Entrez un pseudo","");
    }

    io.emit('name',resp);

    map = game.add.tilemap('level1',64,64);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    map.addTilesetImage('sprite_fontFINAL', 'gameTiles');

    //create layer
    var backgroundlayer = map.createLayer('groundLayer');
    //blockedLayer = map.createLayer('blockedLayer');
    var paralaxLayer = map.createLayer('paralaxLayer');
    trapsLayer = map.createLayer('trapsLayer');

    //console.log(blockedLayer);
    backgroundlayer.resizeWorld();
    // blockedLayer.debug=true;
	this.createTraps();
    //collision on blockedLayer
  //  map.setCollision(23);
   // map.setCollision(25);
    //map.setCollisionBetween(1,25,true,blockedLayer);



    //resizes the game world to match the layer dimensions


    goFullScreen();


    //var music = game.add.audio('Music');
    music = game.sound.play('Music');
    /*
     game.scale.pageAlignHorizontally = true;
     game.scale.pageAlignVertically = true;
     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     */


    //  io.emit('move','up');

    //  bmpText = game.add.bitmapText(100, 100, 'carrier_command','coucou',34);

    //  bmpText.inputEnabled = true;

    //  bmpText.input.enableDrag();
    //  bmpText.events.onDragStart.add(onDragStart, this);

}

function collideevt(var1,var2){
//console.log(var1);
  //  console.log(var2);

console.log('collide');
}

function createTraps() {
    //create traps
    game.traps = game.add.group();
    game.traps.enableBody = true;
    result = this.findObjectsByType('trap', game.map, 'trapsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, game.traps);
    }, this);
  }

 //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  function findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  }
  
  //create a sprite from an object
 function createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
 }
 
function action() {
	console.log("it's a trap dude !");
}
function update() {
	
	game.physics.arcade.overlap(lesjoueurs.monjoueur(), this.traps, this.action, null, this);

    var vx = 0;
    var vy = 0;
	
    if(cursors.right.isDown){
        vx=150;
    }
    if(cursors.left.isDown){
        vx=-150;
    }
    if(cursors.up.isDown){
       vy=-150;
    }
    if(cursors.down.isDown){
        vy=150;
    }

    if (gamestart){
//        console.log(blockedLayer);
        // game.physics.arcade.overlap(lesjoueurs.monjoueur(),blockedLayer,function(a,b){console.log(a);},null,this);
        game.physics.arcade.overlap(lesjoueurs.monjoueur().sprite,blockedLayer,collideevt,null,this)

        var j = lesjoueurs.monjoueur()
        j.velocity(vx,vy);


    }
}

function updateplayer(player){
    // console.log(player);

    io.emit('player',{'x':player.sprite.x,'y':player.sprite.y});
}

function onDragStart(sprite, pointer) {

    result = "Dragging " + sprite.key;
    console.log(result);
}

function render() {
    // game.debug.inputInfo(32, 32);
    game.debug.soundInfo(music, 32, 32);

    if (music.isDecoding)
    {
        game.debug.text("Decoding MP3 ...", 32, 200);
    }

    if (gamestart){
      //  game.debug.bodyInfo(lesjoueurs.monjoueur().sprite, 32, 320);
    }
}

