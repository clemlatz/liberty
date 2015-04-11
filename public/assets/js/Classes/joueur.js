Joueur = function(id,type,isowner){

    var x = 0;
    var y = 0;

    this.isowner = isowner;

    this.id=id;
    this.type=type;

    this.sprite=game.add.sprite(x,y,type,1);
    this.animation=this.sprite.animations.add('walk',[0,1,2,3,4,5,6,7,8,9,10,11], 17, true, true);




    this.updatepos= function(x,y){
        this.x=x;
        this.y=y;

        this.sprite.x=this.x;
        this.sprite.y=this.y;
    }

    this.updateposition = function(x,y){

        this.x=x;
        this.y=y;

        this.sprite.x=this.x;
        this.sprite.y=this.y;
        //   console.log(this.x);
        io.emit('player',{'x':this.x,'y':this.y});

    }

    this.moveoffset = function(x,y){

        this.x+=x;
        this.y+=y;

        this.updateposition(this.x,this.y);

    }

    this.animstart = function(){


        this.sprite.animations.play('walk',60,false);

    }

    this.animstop = function(){

        this.sprite.animations.stop();

    }

}