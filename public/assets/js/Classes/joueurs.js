Joueurs = function(){

    var tabjoueurs= new Array(100);

    var nbjoueur=0;

    var monjoueur=0;
    var myid;

    var guard= new Array(10);

    var nbguard;

    this.add = function (joueur)
    {

        tabjoueurs[nbjoueur]=joueur;
        nbjoueur++;

    }

    this.getnb = function (){

        return this.nbjoueur;

    }

    this.hider = function(){

        for (index = 0; index < nbjoueur; index++) {
            if (tabjoueurs[index].isowner!=true)
            mapgroup.add(tabjoueurs[index].sprite);
        }
    }

    this.delete = function (id)
    {
        for (index = 0; index < nbjoueur; index++) {


            if (id==tabjoueurs[index].id){

                tabjoueurs[index].sprite.destroy();
                tabjoueurs.splice(index,1);
                nbjoueur--;
            }
        }
    }

    /**
     * Met à jour la position d'un joueur
     */
    this.updatepos = function (joueur){

        for (index = 0; index < nbjoueur; index++) {

            //pour chaques joueurs on met à jours la position
            if (joueur.id==tabjoueurs[index].id){

                tabjoueurs[index].sprite.x=joueur.x;
                tabjoueurs[index].sprite.y=joueur.y;

              //  console.log(tabjoueurs[index].type);
                if(joueur.role=='guard'){

//                console.log('guard'+joueur.x);
                        game.world.bringToTop(joueur.sprite);
                }
            }
        }
    }

    this.getguardposition = function(){

        var gu = new Array(nbguard);
     //   console.log(nbguard);
        for(index=0;index<nbguard;index++){
            gu[index]={'x':tabjoueurs[guard[index]].x,'y':tabjoueurs[guard[index]].y};
        }

        return gu;
    }

    this.clear = function(){

        for (index = 0; index < nbjoueur; index++) {

            tabjoueurs[index].sprite.destroy();

        }
        nbjoueur=0;
        nbguard=0;
    }

    this.monjoueur = function(){

        for (index = 0; index < nbjoueur; index++) {

            if (tabjoueurs[index].isowner){
                //  console.log('joueur:');
                //  console.log(tabjoueurs[index]);
                return tabjoueurs[index];
            }
        }

    }

    this.import= function(players){

        for (index = 0; index < players.length; index++) {

            if (players[index].id == this.myid){
               var isowner = true;

            }else{
                var isowner = false;
            }

            var j  = new Joueur(players[index].id,players[index].role,isowner);
            j.x=players[index].x;
            j.y=players[index].y;
            j.sprite.x=players[index].x;
            j.sprite.y=players[index].y;

            this.add(j);


            if (players[index].role == 'guard'){
                //console.log(players[index]);
                guard[index]=index;
                nbguard++;
            }
        }

    }
}
