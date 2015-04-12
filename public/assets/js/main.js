var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create ,update:update, render: render});

function preload() {



 //  game.load.tilemap('level1', 'assets/tilemaps/text.txt', null, Phaser.Tilemap.TILED_JSON);
 //   game.load.image('gameTiles', 'assets/tilemaps/sprite_font.png');

    game.load.tilemap('level1', 'assets/tilemaps/final.txt', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/tilemaps/sprite_fontFINAL.png');

    game.load.spritesheet('prisoner', 'assets/images/sprite_anime-run.png', 64, 64, 6);
    game.load.spritesheet('guard', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

    //  game.load.spritesheet('prisoner', 'assets/sprites/spaceman.png', 16, 16);

//    game.load.audio('Music', 'assets/sounds/Music_Gameplay.wav');

}

var bpmText;

var myid;

var lesjoueurs = new Joueurs();

var io = io.connect('http://libertyjam.azurewebsites.net/');


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
    blockedLayer = map.createLayer('blockedLayer');
    var paralaxLayer = map.createLayer('paralaxLayer');

    console.log(blockedLayer);
    backgroundlayer.resizeWorld();
    // blockedLayer.debug=true;

    //collision on blockedLayer
   // map.setCollision(23,true,blockedLayer);
    map.setCollisionBetween(1,25);

    //resizes the game world to match the layer dimensions


    goFullScreen();
    /*  var music = game.add.audio('Music');
     music.volume = 1;
     music.play();*/
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
console.log(var1);
  //  console.log(var2);
}

function update() {

    if (gamestart){
//        console.log(blockedLayer);
       // game.physics.arcade.overlap(lesjoueurs.monjoueur(),blockedLayer,function(a,b){console.log(a);},null,this);
        game.physics.arcade.collide(lesjoueurs.monjoueur(),'blockedLayer');
    }

    if(cursors.right.isDown){
        var j = lesjoueurs.monjoueur();
        j.moveoffset(5,0);
        j.animstart();
    }
    if(cursors.left.isDown){
        var j = lesjoueurs.monjoueur();
        j.moveoffset(-5,0);
        j.animstart();
    }
    if(cursors.up.isDown){
        var j = lesjoueurs.monjoueur();
        j.moveoffset(0,-5);
        j.animstart();
    }
    if(cursors.down.isDown){
        var j = lesjoueurs.monjoueur();
        j.moveoffset(0,5);
        j.animstart();
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
}

