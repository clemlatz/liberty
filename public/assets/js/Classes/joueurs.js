Joueurs = function(){

    var tabjoueurs= new Array(100);

    var nbjoueur=0;

    var monjoueur=0;
    var myid;

    this.add = function (joueur)
    {
        tabjoueurs[nbjoueur]=joueur;
        nbjoueur++;

    }

    this.delete = function (id)
    {
        for (index = 0; index < nbjoueur; index++) {


            if (id==this.tabjoueurs[index].id){

                tabjoueurs.splice(index,1);
            }
        }
    }

    /**
     * Met à jour la position d'un joueur
     */
    this.updatepos = function (joueur){

        for (index = 0; index < nbjoueur; index++) {

            if (joueur.id==tabjoueurs[index].id){

                tabjoueurs[index].sprite.x=joueur.x;
                tabjoueurs[index].sprite.y=joueur.y;
            }


        }
    }

    /**
     * Efface l'ensemble des sprites
     */
    this.clear = function(){

        for (index = 0; index < nbjoueur; index++) {

            tabjoueurs[index].sprite.destroy();

        }
        nbjoueur=0;
    }

    /**
     * Retourne mon joueur
     */
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

            this.add(j);

        }

    }
}