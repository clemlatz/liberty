var game = new Phaser.Game(1024, 1024, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create ,update:update, render: render});

function preload() {

	/** load startScreen **/
	game.load.image('startScreen', 'assets/images/startScreen.png');

    
 //  game.load.tilemap('level1', 'assets/tilemaps/text.txt', null, Phaser.Tilemap.TILED_JSON);
 //   game.load.image('gameTiles', 'assets/tilemaps/sprite_font.png');

    game.load.tilemap('level1', 'assets/tilemaps/final.txt', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/tilemaps/sprite_fontFINAL.png');

    game.load.spritesheet('prisoner', 'assets/images/sprite_anime-run.png', 64, 64, 6);
    game.load.spritesheet('prisonerdie', 'assets/images/sprite_anime-mort.png', 64, 64, 7);
    game.load.spritesheet('guard', 'assets/images/haloCrosshair.png', 64, 64, 1);

    //  game.load.spritesheet('prisoner', 'assets/sprites/spaceman.png', 16, 16);
	
/** load audio **/
	game.load.audio('gameplay', 'assets/sounds/Music_Gameplay_Final_.ogg');
    //game.load.audio('Music',['assets/sounds/SFX_Gun1.mp3','assets/sounds/SFX_Gun1.ogg'] );

}


var lesjoueurs = new Joueurs();

var io = io.connect('http://libertyjam.azurewebsites.net/');


var gamestart = false;

//On screen Display
var OSD = new Array(10);

var gamestatut = 0;
var map;


var blockedLayer;

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

    lesjoueurs.monjoueur().die();
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


function goFullScreen(){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.setScreenSize(true);
}

var music;
var maskGraphics;
var maskGraphicsExt; // pour les autres personnages
var wallsBitmap;
var backgroundlayer;
var paralaxLayer;

var mapgroup;
var startScreen;
function create() {
	startScreen = game.add.sprite(0, 0, 'startScreen');

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
    backgroundlayer = map.createLayer('groundLayer');
    blockedLayer = map.createLayer('blockedLayer');
    paralaxLayer = map.createLayer('paralaxLayer');

    //console.log(blockedLayer);
    backgroundlayer.resizeWorld();
    // blockedLayer.debug=true;

    map.setCollisionBetween(1,25,true,blockedLayer);

    maskGraphics = game.add.graphics(0, 0);
    maskGraphicsExt = game.add.graphics(0, 0);

    wallsBitmap = game.make.bitmapData(2300,2300);
    //wallsBitmap.draw("walls");
    wallsBitmap.update();
    game.add.sprite(0,0,wallsBitmap);

    mapgroup = game.add.group();
    mapgroup.add(backgroundlayer);
    mapgroup.add(blockedLayer);
    mapgroup.add(paralaxLayer);

    /*
    maskGroup = game.add.group();
    maskGroup.add(maskGraphics);
    maskGroup.add(maskGraphicsExt);*/

    mapgroup.mask = maskGraphics;

    goFullScreen();

	/** Audio **/
	var sound = game.add.audio('gameplay',1, true);
	sound.play();
    //var music = game.add.audio('Music');
    //music = game.sound.play('Music');
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
    //game.debug.soundInfo(music, 32, 32);
 //   game.debug.inputInfo();

    if (gamestart){
      //  game.debug.bodyInfo(lesjoueurs.monjoueur().sprite, 32, 320);
    }
}

