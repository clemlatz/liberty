Joueur = function(id,type,isowner){

    var x = 0;
    var y = 0;

    this.isowner = isowner;

    this.id=id;
    this.type=type;


    this.sprite=game.add.sprite(x,y,type,1);
    this.animation=this.sprite.animations.add('walk',[0,1,2,3,4,5], 6, true, true);
    this.dieanimate=this.sprite.animations.add('prisonerdie',[0,1,2,3,4,5,6], 7, false, true);

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

    this.velocity = function(vx,vy){

        if (this.sprite.body!=null){

            this.sprite.body.velocity.x =vx;
            this.sprite.body.velocity.y =vy;

            this.x=this.sprite.x;
            this.y=this.sprite.y;

            if (vx!=0 || vy!=0){
                this.animstart();
            }
            this.updateposition(this.x,this.y);
        }
    }

    this.animstart = function(){


        this.sprite.animations.play('walk',10,false);

    }

    this.animstop = function(){

        this.sprite.animations.stop();

    }

    this.die = function(){
        this.sprite=game.add.sprite(x,y,'prisonerdie',1);
        this.dieanimate.play();
    }

}