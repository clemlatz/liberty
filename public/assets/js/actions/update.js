var lightAngle = Math.PI/2;
var numberOfRays = 20;
var rayLength = 100;

function update() {

    var vx = 0;
    var vy = 0;

    if (gamestart){


        if (lesjoueurs.monjoueur().type=='prisoner'){

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



            game.physics.arcade.overlap(lesjoueurs.monjoueur().sprite,blockedLayer,collideevt,null,this);

            var j = lesjoueurs.monjoueur()
            j.velocity(vx,vy);

            var player=j.sprite;
            var xSpeed=vx;
            var ySpeed=vy;

            if(Math.abs(xSpeed)+Math.abs(ySpeed)<2 && Math.abs(xSpeed)+Math.abs(ySpeed)>0){
                var color = wallsBitmap.getPixel32(player.x+xSpeed+player.width/2,player.y+ySpeed+player.height/2);
                color+= wallsBitmap.getPixel32(player.x+xSpeed-player.width/2,player.y+ySpeed+player.height/2);
                color+=wallsBitmap.getPixel32(player.x+xSpeed-player.width/2,player.y+ySpeed-player.height/2)
                color+=wallsBitmap.getPixel32(player.x+xSpeed+player.width/2,player.y+ySpeed-player.height/2)
                if(color==0){
                    player.x+=xSpeed;
                    player.y+=ySpeed;
                }
            }
            //console.log('y:'+player.y);
            //console.log('gy:'+game.input.y);
            //console.log('cy:'+game.camera.y);
            var mouseAngle = Math.atan2(player.y-game.input.y-game.camera.y,player.x-game.input.x-game.camera.x);
            maskGraphics.clear();
            maskGraphics.lineStyle(2, 0xffffff, 1);
            maskGraphics.beginFill(0xffff00);
            maskGraphics.moveTo(player.x+player.width/2,player.y);

            for(var i = 0; i<numberOfRays; i++){
                var rayAngle = mouseAngle-(lightAngle/2)+(lightAngle/numberOfRays)*i
                var lastX = player.x;
                var lastY = player.y;
                for(var j= 1; j<=rayLength;j+=1){
                    var landingX = Math.round(player.x-(2*j)*Math.cos(rayAngle));
                    var landingY = Math.round(player.y-(2*j)*Math.sin(rayAngle));
                    if(wallsBitmap.getPixel32(landingX,landingY)==0){
                        lastX = landingX;
                        lastY = landingY;
                    }
                    else{
                        maskGraphics.lineTo(lastX,lastY);
                        break;
                    }
                }
                maskGraphics.lineTo(lastX,lastY);
            }
            maskGraphics.lineTo(player.x+player.width/2,player.y);

            /*
            var g = lesjoueurs.getguardposition();

          //  console.log(g);

            for (index=0;index< g.length;index++){
               // console.log(g[index].x);
                maskGraphics.drawEllipse(g[index].x,g[index].y,200,130);
            }*/

            maskGraphics.endFill();
            /*
            backgroundlayer.alpha = 0.5+Math.random()*0.5;
            blockedLayer.alpha = 0.5+Math.random()*0.5;
            paralaxLayer.alpha = 0.5+Math.random()*0.5;
*/
            backgroundlayer.alpha = 0.1+Math.random()*0.5;

        }
        if  (lesjoueurs.monjoueur().type=='guard'){

            var vmoyen=500;

            if(cursors.right.isDown){
                vx=vmoyen;
            }
            if(cursors.left.isDown){
                vx=-vmoyen;
            }
            if(cursors.up.isDown){
                vy=-vmoyen;
            }
            if(cursors.down.isDown){
                vy=+vmoyen;

            }


            var j = lesjoueurs.monjoueur()
            j.velocity(vx,vy);

            maskGraphics.clear();
            maskGraphics.drawEllipse(j.x, j.y,200,130);
            maskGraphics.beginFill(0xffffff);
            maskGraphics.endFill();
            mapgroup.alpha = 1;
        }

    }
}