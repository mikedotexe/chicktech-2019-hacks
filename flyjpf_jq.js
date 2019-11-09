jQuery(function() {
  if ( 'undefined' === typeof fly_sankocho ) {
    var fly_sankocho = {
       'sanID': null,
      'istouch': false,

      'mvsaID': null,
      'chaseID': null,
      'perchID': null,
      'blinkID': null,
      'sunroteID': null,
      'startID': null,
      'chaseflg': 1,
      'perchflg': 0,
      'cflg': 1,
      'ccount': 0,
      'mleft': 0,
      'mtop': 0,
      'executing': 0
    }

    fly_sankocho.wdwidth = jQuery( window ).width();
    fly_sankocho.rnum = Math.floor( ( Math.random() * ( ( 4 ) - 1 ) ) + 1 );

    fly_sankocho.myurl = jQuery( '#flying_jpf_style-css' ).attr( 'href' );
    fly_sankocho.myurl = fly_sankocho.myurl.slice( 0, fly_sankocho.myurl.indexOf( 'flying_jpf.css' ));

    fly_sankocho.img1 = 'url(' + fly_sankocho.myurl + 'san0.png)';
    fly_sankocho.img2 = 'url(' + fly_sankocho.myurl + 'san1.png)';
    fly_sankocho.img3 = 'url(' + fly_sankocho.myurl + 'moon.png)';

    fly_sankocho.blank = jQuery( '#ojmflysan' ).attr( 'class' );
    fly_sankocho.blank = parseInt( fly_sankocho.blank.substr( 5 ) )*1000;

    fly_sankocho.waitt = jQuery( '#ojmsankocho' ).attr( 'class' );
    fly_sankocho.waitt = parseInt( fly_sankocho.waitt.substr( 5 ) )*1000;

    fly_sankocho.detect_touch = function() {
      //タッチパネル検出用コード
      var html_el=document.querySelector("html"),
        entobj='mouse',
        evflg=0,
        result = false;

      //ie以外
      result = 'ontouchend' in document;

      //ie用
      html_el.addEventListener("MSPointerDown",function(e){
        entobj=e.pointerType;
        if ( 0 == evflg && 'mouse' != entobj ){
          evflg = 1;
          result = true;
        }
      }, false );
      return result;
    }
    fly_sankocho.istouch = fly_sankocho.detect_touch();

    fly_sankocho.flysankocho = function() {
      if ( 1 === fly_sankocho.executing ) {
        return;
      } else {
        fly_sankocho.executing = 1;
      }

      if( jQuery( '#ojmsankocho' ).length ) {
        var pos,
          wingnum = 1,
          dirnum = 0,
          dirflg = 0,
          rcount = 0,
          toppos = 100,//parseInt(jQuery( '#ojmflysan' ).css( 'top' )),
          leftpos = 25,//parseInt(jQuery( '#ojmflysan' ).css( 'left' )),
          bgnum = [ '-654px', '0px', '-327px', '-981px' ],
          santop = -500;

        //fly_sankocho.changeclickmode( 0 );
        jQuery( '#ojmflysan' ).css({ width:'400px', height:'327px', backgroundImage:fly_sankocho.img1, backgroundPosition:'0 0' });
        jQuery( '<img>' ).attr( 'src', fly_sankocho.img2 );
        fly_sankocho.mvsaID = setInterval(function() {
          fly_sankocho.changeclickmode( 1 )
          dirnum++;
          if ( dirnum > 10 ){
            dirnum = 1 ;
          }
          if ( dirnum > 4 && dirnum < 7 ){
            santop-=10;
          } else {
            santop+=10;
          }
          jQuery( '#ojmsankocho' ).css({ top:santop, left:'70%' });
          pos = '0 ' + bgnum[wingnum];
          jQuery( '#ojmflysan' ).css( 'backgroundPosition',pos );
          wingnum++;
          if ( wingnum > 3 ) {
            wingnum = 0;
          }
          if ( santop > 200 ) {
            clearInterval( fly_sankocho.mvsaID );
            fly_sankocho.mvsaID = null;
            dirnum = 1;
            jQuery( '#ojmlittleearth' ).fadeOut('fast', function(){
              jQuery( '#ojmlittleearth' ).css( 'visibility', 'visible' );
            });
            fly_sankocho.sanID = setInterval(function() {
              if ( 0 == dirnum) {
                if ( 0 == dirflg ) {
                  dirflg = 1;
                } else {
                  dirflg = 0;
                }
                dirnum++;
                rcount++;
                if ( 0 == rcount % 5) {
                  leftpos+=10;
                  jQuery( '#ojmflysan' ).css( 'left', leftpos );
                } else if ( 2 == rcount % 5) {
                  leftpos-=10;
                  jQuery( '#ojmflysan' ).css( 'left', leftpos );
                }
              }
              if(0 == dirflg) {
                pos = '0 ' + bgnum[wingnum];
                toppos-=4*wingnum;
                jQuery( '#ojmflysan' ).css({ backgroundPosition:pos, top:toppos });
                wingnum++;
                if ( wingnum > 3 ) {
                  wingnum = 0;
                  dirnum++;
                }
                if ( dirnum > 4 ) {
                  dirnum = 0;
                  jQuery( '#ojmflysan' ).css( 'backgroundPosition', '0 -1308px' );
                }
              } else {
                toppos+=8*wingnum;
                jQuery( '#ojmflysan' ).css( 'top', toppos );
                wingnum++;
                if ( wingnum > 3 ) {
                  wingnum = 0;
                  dirnum++;
                }
                if ( dirnum > 2 ) {
                  dirnum = 0;
                }
              }
            }, 80 );
            setTimeout(function() {
              fly_sankocho.chaseflg = 0;
              fly_sankocho.changeclickmode( 0 );
            }, 3000 );
          }
        }, 100 );
      }
    }

    fly_sankocho.twitter = function(){
      var lighttop = 80,
        lightleft = 0,
        ltrasio = 10,
        llrasio =1,
        leftlimit = 250,
        toplimit = 250,
        roopcount = 0,
        halftoplimit = toplimit / 2;
        jQuery( '<img>' ).attr( 'src', fly_sankocho.img3 );

      fly_sankocho.changeclickmode( 1 );
      jQuery( '#ojmflysan' ).css( 'background-position', '0 -1962px' );
      setTimeout(function() {
        jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
      }, 400 );
      jQuery( '#ojmsunlight' ).css( {visibility:'visible', backgroundPosition:'0 -400px'} ).fadeIn( 'slow' );
      if ( fly_sankocho.sunroteID != null ){
        clearInterval( fly_sankocho.sunroteID );
      }
      fly_sankocho.sunroteID = setInterval( function() {
        ++roopcount;
        if ( 15 == roopcount ){
          jQuery( '#ojmsunlight' ).css( 'backgroundPosition', '0 -300px' );
        } else if ( 30 == roopcount ){
          jQuery( '#ojmsunlight' ).css( 'backgroundPosition', '0 -200px' );
        } else if ( 45 == roopcount ){
          jQuery( '#ojmsunlight' ).css( 'backgroundPosition', '0 -100px' );
        } else if ( 55 == roopcount ){
          jQuery( '#ojmsunlight' ).css( 'backgroundPosition', '0 0' );
        } else if ( 65 == roopcount ){
          jQuery( '#ojmsunlight' ).css( 'backgroundPosition', '0 -100px' );
        }
        if ( lightleft < 50){
          ltrasio += 0.1;
          llrasio += 0.3;
        } else if ( lightleft < leftlimit && lighttop > toplimit ) {
          ltrasio -= 1;
          llrasio += 1;
        } else if ( lightleft >leftlimit && lighttop > halftoplimit ) {
          ltrasio -= 2;
          llrasio -= 2;
        } else if  ( lightleft >leftlimit && lighttop < halftoplimit ) {
          ltrasio += 1;
          llrasio -= 1;
        } else if  ( lighttop < 0 ) {
          ltrasio += 2;
          llrasio -= 0.5;
        }
        lighttop += ltrasio;
        lightleft += llrasio;
        jQuery( '#ojmsunlight' ).css( { top:lighttop,left:lightleft} );
        if ( lightleft < -200 ) {
          clearInterval( fly_sankocho.sunroteID );
          fly_sankocho.sunroteID = null;
          fly_sankocho.changeclickmode( 0 );
        }else if ( lightleft < 0 ) {
          jQuery( '#ojmsunlight' ).fadeOut( 'slow' );
        }
      },70 );
    }

    fly_sankocho.bounder = function() {
      var lighttop = 80,
        lightleft = 0,
        ltrasio = 0,
        llrasio =2,
        moverasio = 1,
        leftlimit = 250,
        toplimit = 300,
        stoplimit = toplimit + 15,
        bgpos,
        bcount = 0,
        bgkey,
        bgnum = [ '-400px', '-300px', '-200px', '-100px', '0', '-100px' ];
        jQuery( '<img>' ).attr( 'src', fly_sankocho.img3 );

      fly_sankocho.changeclickmode( 1 );
      jQuery( '#ojmflysan' ).css( 'background-position', '0 -1962px' );
      setTimeout(function() {
        jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
      }, 400 );
      jQuery( '#ojmsunlight' ).css( {visibility:'visible', backgroundPosition:'0 -400px'} ).fadeIn( 'slow' );
      if ( fly_sankocho.sunroteID != null ){
        clearInterval( fly_sankocho.sunroteID );
      }
      fly_sankocho.sunroteID = setInterval( function() {
        ltrasio += moverasio;
        lighttop += ltrasio;
        lightleft -= llrasio;
        jQuery( '#ojmsunlight' ).css( { top: lighttop, left: lightleft } );
        if ( lighttop > toplimit ) {
          ltrasio *= -1;
          moverasio *= 1.2;
          bcount++;
          //jQuery('#suntx').text( lightleft );
          if ( bcount > 5 ) {
            if ( 0 == ( bcount % 5 ) ) {
              bgkey = ( bgkey == 5 ) ? 4 : 5;
              bgpos = '0 ' + bgnum[ bgkey ];
              jQuery( '#ojmsunlight' ).css( 'backgroundPosition', bgpos );
            }
          } else {
            bgkey = bcount;
            bgpos = '0 ' + bgnum[ bgkey ];
            jQuery( '#ojmsunlight' ).css( 'backgroundPosition', bgpos );
          }
        }
        if ( lighttop > stoplimit ) {
          ltrasio = 0;
          moverasio = 0;
        }
        if ( lightleft < -400 ) {
          clearInterval( fly_sankocho.sunroteID );
          fly_sankocho.sunroteID = null;
          fly_sankocho.changeclickmode( 0 );
        } else if ( lightleft < -350 ) {
          jQuery( '#ojmsunlight' ).fadeOut( 'slow' );
        }
      }, 40 );
    }

    fly_sankocho.sayday = function() {
      var lighttop = 80,
        lightleft = 0,
        llrasio =5,
        bgpos,
        bcount = 0,
        blinkc = 0,
        bgnum = [ '-400px', '-300px', '-200px', '-100px', '0', '-100px' ],
        bgroteId,
        nowt = new Date(),
        nMon = nowt.getMonth(),
        nDay = nowt.getDate(),
        nWeek = nowt.getDay(),
        nTime = nowt.getHours() + ' : ' + nowt.getMinutes(),
        week = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        eMon = [ 'January', 'February', ' March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        nowstr = [ eMon[ nMon ], nDay, nTime, week[ nWeek ] ];
        jQuery( '<img>' ).attr( 'src', fly_sankocho.img3 );

      fly_sankocho.changeclickmode( 1 );
      if ( fly_sankocho.sunroteID != null ){
        clearInterval( fly_sankocho.sunroteID );
        fly_sankocho.sunroteID = null;
      }
      jQuery( '#ojmsunlight' ).fadeOut('fast', function(){
        jQuery( this ).css( {visibility:'visible', backgroundPosition:'0 -400px'} );
      });
      fly_sankocho.blinkID = setInterval(function() {
        jQuery( '#ojmflysan' ).css( 'background-position', '0 -1962px' );
        setTimeout(function() {
          jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
        }, 400 );
        ++blinkc;
        if ( blinkc == 2 ) {
          clearInterval( fly_sankocho.blinkID );
          fly_sankocho.blinkID = null;
        }
      } ,500 );

      fly_sankocho.sunroteID = setInterval( function() {
        lighttop = 80,
        lightleft = 0,
        llrasio = 5,
        jQuery( '#ojmflysan' ).css( 'background-position', '0 -1962px' );
        setTimeout(function() {
          jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
        }, 400 );

        moveID = setInterval(function() {
          lightleft -= llrasio;
          lighttop = -1 * 8 / 1000 * lightleft * lightleft +80;

          jQuery( '#ojmsunlight' ).css( { top: lighttop, left: lightleft } );
          if ( lightleft < -100) {
            clearInterval( moveID );
            moveID = null;
          }
        }, 60 );

        jQuery( '#ojmsunlight' ).fadeIn( 'middle', function() {
          if ( bcount <4 ) {
            jQuery('#ojmsunlight').html( '<br><br>' + nowstr[ bcount ] );
          } else {
            jQuery('#ojmsunlight').html( '<br><br>Hoi !' );
          }
          ++bcount;
          setTimeout(function() {
            bgpos = '0 ' + bgnum[ bcount ];
            jQuery( '#ojmsunlight' ).fadeOut( 'slow', function() {
              if ( bcount > 3 ) {
                clearInterval( fly_sankocho.sunroteID );
                fly_sankocho.sunroteID = null;
                jQuery('#ojmsunlight').html( '' );
                fly_sankocho.changeclickmode( 0 );
              }
              jQuery( '#ojmsunlight' ).css( 'backgroundPosition', bgpos );
            });
          }, 200 );
        });
      }, 2000 );
    }

    jQuery( '#ojmsankocho' ).click(function() {
      if ( 0 == fly_sankocho.cflg ){
        fly_sankocho.changeclickmode( 1 );
        var bgnum = [ '-654px', '0px', '-327px', '-981px' ],
          wingnum = 1,
          wcount = 0,
          pos,
          toppos,
          posnum = [ 10, 10, -10, -10 ],
          leftpos = -550,
          santop = -100,
          uprasio,
          templeft,
          temptop,
          lrnum =   Math.floor( ( Math.random() * ( ( 6 ) - 1 ) ) + 1 );

        fly_sankocho.chaseflg = 1;
        if ( fly_sankocho.mvsaID != null ) {
          clearInterval( fly_sankocho.mvsaID );
        }
        if ( fly_sankocho.sanID != null ) {
          clearInterval( fly_sankocho.sanID );
          fly_sankocho.sanID = null;
        }
        if ( fly_sankocho.chaseID != null ) {
          clearInterval( fly_sankocho.chaseID );
          fly_sankocho.chaseID = null;
        }
        if ( fly_sankocho.blinkID != null ) {
          clearInterval( fly_sankocho.blinkID );
          fly_sankocho.blinkID = null;
        }

        if(fly_sankocho.ccount < fly_sankocho.rnum ) {
          if ( 1 == lrnum && 1 == fly_sankocho.perchflg){
            fly_sankocho.ccount++;
            fly_sankocho.chaseflg = 2;
            fly_sankocho.twitter();
          } else if ( 2 == lrnum && 1 == fly_sankocho.perchflg){
            fly_sankocho.ccount++;
            fly_sankocho.chaseflg = 2;
            fly_sankocho.bounder();
          } else if ( 3 == lrnum && 1 == fly_sankocho.perchflg){
            fly_sankocho.ccount++;
            fly_sankocho.chaseflg = 2;
            fly_sankocho.sayday();
          } else {
            uprasio = '-=10';
            fly_sankocho.sanID = setInterval(function() {
              pos = '0 ' + bgnum[ wingnum ];
              jQuery( '#ojmflysan' ).css( 'backgroundPosition', pos );
              wingnum++;
              if ( wingnum > 3 ) {
                wingnum = 0;
                wcount++;
              } else if ( 3 == wingnum) {
                if ( wcount == 5 ) {
                  uprasio = '+=10';
                }
                jQuery( '#ojmflysan' ).css( 'top', uprasio );
              }
              if ( 10 === wcount ) {
                clearInterval( fly_sankocho.sanID );
                fly_sankocho.sanID = null;
                //jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
                fly_sankocho.chaseflg = 2;
                templeft = fly_sankocho.mleft - 150;
                temptop = fly_sankocho.mtop - 145;
                jQuery( '#ojmsankocho' ).animate({ top:temptop, left:templeft }, 300, 'swing' );
                jQuery( '#ojmflysan' ).css({ top:'0px', left:'0px',backgroundPosition:'0 -1635px' });
                fly_sankocho.changeclickmode( 0 );
                fly_sankocho.ccount++;
                lefpos = fly_sankocho.mleft - 50;
                toppos = fly_sankocho.mtop - 8;
                jQuery( '#ojmlittleearth' ).css({ top:toppos, left:lefpos });
                setTimeout(function() {
                  jQuery( '#ojmlittleearth' ).fadeIn( 'slow' );
                }, 500 );
              }
            }, 50 );
          }
        } else {
          wcount = 0;
          fly_sankocho.ccount = 0;
          fly_sankocho.changeclickmode( 1 );
          jQuery( '#ojmlittleearth' ).fadeOut( 'middle' );
          fly_sankocho.sanID = setInterval(function() {
            pos = '0 ' + bgnum[ wingnum ];
            jQuery( '#ojmflysan' ).css( 'backgroundPosition', pos );
            wingnum++;
            if ( wingnum > 3 ) {
              wingnum = 0;
              wcount++;
            } else if ( 3 == wingnum) {
              jQuery( '#ojmflysan' ).css( 'top', '-=10' );
            }
            if ( wcount > 4 ) {
              clearInterval( fly_sankocho.sanID );
              jQuery( '#ojmsankocho' ).animate({ top:santop, left:leftpos }, 3500, 'swing', function(){
                clearInterval( fly_sankocho.sanID );
                fly_sankocho.changeclickmode( 0 );
                if ( 0 === fly_sankocho.waitt ) {
                  fly_sankocho.executing = 0;
                }
              });
              jQuery( '#ojmflysan' ).css({ width:'500px', height:'250px', backgroundImage:fly_sankocho.img2, backgroundPosition:'0 0' });
              bgnum = [ '-500px', '-750px', '-250px', '0px' ];
              wingnum = 1;
              fly_sankocho.sanID = setInterval(function() {
                pos = '0 ' + bgnum[ wingnum ];
                toppos = toppos + posnum[ wingnum ];
                jQuery( '#ojmflysan' ).css({ backgroundPosition:pos, top:toppos });
                wingnum++;
                if ( wingnum > 3 ) {
                  wingnum = 0;
                }
              }, 100 );
            }
          }, 50 );
        }
      }
    });

    jQuery( 'html' ).mousemove(function( e ) {
      var lefpos,
        toppos,
        bgnum = [ '-654px', '0px', '-327px', '-981px' ],
        wingnum = 1,
        pos,
        lefpos,
        toppos,
        stopID,
        nextlug,
        blink,
        ctime;

      fly_sankocho.mleft = e.clientX;
      fly_sankocho.mtop = e.clientY;

      if ( 0 === fly_sankocho.executing ) {
        if ( 0 !== fly_sankocho.waitt ) {
          clearInterval( fly_sankocho.startID );
          fly_sankocho.startID = setTimeout(function() {
            fly_sankocho.flysankocho();
          }, fly_sankocho.waitt );
        }
      } else {

        if ( 0 == fly_sankocho.chaseflg ) {
          clearTimeout( fly_sankocho.chaseID );
          clearTimeout( fly_sankocho.perchID );
          fly_sankocho.chaseID = setTimeout(function() {
            lefpos = fly_sankocho.mleft+ 50;
            toppos = fly_sankocho.mtop - 130;
            jQuery( '#ojmsankocho' ).stop();
            jQuery( '#ojmsankocho' ).animate({ top:toppos, left:lefpos }, 800, 'swing' );
            fly_sankocho.perchID = setTimeout(function() {//5秒間マウスが停止していたらマウスにとまる
              fly_sankocho.changeclickmode( 1 );
              lefpos = fly_sankocho.mleft - 150;
              toppos = fly_sankocho.mtop - 145;
              clearInterval( fly_sankocho.sanID );
              jQuery( '#ojmflysan' ).css({ top:'0px', left:'0px' });
              fly_sankocho.sanID = setInterval(function() {
                pos = '0 ' + bgnum[ wingnum ];
                jQuery( '#ojmflysan' ).css( 'background-position', pos );
                wingnum++;
                if ( wingnum > 3 ) {
                  wingnum = 0;
                }
              }, 50 );
              jQuery( '#ojmsankocho' ).stop();
              jQuery( '#ojmsankocho' ).animate({ top:toppos, left:lefpos }, 1500, 'swing', function() {
                clearInterval( fly_sankocho.sanID );
                jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
                fly_sankocho.perchflg = 1;
                fly_sankocho.changeclickmode( 0 );
                lefpos = fly_sankocho.mleft - 50;
                toppos = fly_sankocho.mtop - 8;
                jQuery( '#ojmlittleearth' ).css({ top:toppos, left:lefpos });
                setTimeout(function() {
                  jQuery( '#ojmlittleearth' ).fadeIn( 'slow' );
                }, 500 );
                fly_sankocho.sanID = setInterval(function() {
                  randnum = Math.floor( ( Math.random() * ( ( 4 ) - 1 ) ) + 1 );
                  if ( randnum == 1 ) {
                    fly_sankocho.twitter();
                  } else if ( randnum == 2 ) {
                    fly_sankocho.bounder();
                  } else {
                    fly_sankocho.sayday();
                  }
                }, 20000 );
              });
              fly_sankocho.chaseflg = 2;
            }, 5000 );
          }, 500 );
        } else if ( 2 == fly_sankocho.chaseflg ) {
          lefpos = fly_sankocho.mleft - 150;
          toppos = fly_sankocho.mtop - 145;
          nextlug = Math.floor( ( Math.random() * ( ( 30 ) - 10 ) ) + 10 ) * 1000;
          jQuery( '#ojmflysan' ).css( 'background-position', '0 -1962px' );
          jQuery( '#ojmsankocho' ).css({ top:toppos, left:lefpos });
          lefpos = fly_sankocho.mleft - 50;
          toppos = fly_sankocho.mtop - 8;
          jQuery( '#ojmlittleearth' ).css({ top:toppos, left:lefpos });
          clearInterval( stopID );
          stopID = setTimeout(function() {
            jQuery( '#ojmflysan' ).css( 'background-position', '0 -1635px' );
          }, 200 );
          if ( fly_sankocho.sanID != null ) {
            clearInterval( fly_sankocho.sanID );
            fly_sankocho.sanID = null;
          }
          fly_sankocho.sanID = setInterval(function() {
            /*pos = '0 -1962px';
            blink = 0;
            fly_sankocho.blinkID = setInterval(function() {
              if ( '0 -1635px' == pos) {
                pos = '0 -1962px';
              } else {
                pos = '0 -1635px';
              }
              jQuery( '#ojmflysan' ).css( 'background-position', pos );
              blink++;
              if ( blink > 2 ) {
                clearInterval( fly_sankocho.blinkID );
              }
            }, 500 );*/
            randnum = Math.floor( ( Math.random() * ( ( 4 ) - 1 ) ) + 1 );
            if ( randnum == 1 ) {
              fly_sankocho.twitter();
            } else if ( randnum == 2 ) {
              fly_sankocho.bounder();
            } else {
              fly_sankocho.sayday();
            }
          }, nextlug );
        }
      }
    });

    fly_sankocho.changeclickmode = function( dir ) {
      if ( 0 == dir ) {//click enable
        fly_sankocho.cflg = 0;
        jQuery( '#ojmsankocho' ).css( 'cursor', 'default' );
      } else {//click disable
        fly_sankocho.cflg = 1;
        //jQuery( '#ojmsankocho' ).css( 'cursor', 'not-allowed' );
        jQuery( '#ojmsankocho' ).css( 'cursor', 'none' );
      }
    }

    jQuery( window ).keydown(function( e ) {
      var key_code = e.keyCode,
        shift_key = e.shiftKey,
        randnum = Math.floor( ( Math.random() * ( ( 4 ) - 1 ) ) + 1 );

      //if ( 84 == key_code && true == shift_key ) {//shift + t key
      if ( 78 == key_code && true == shift_key ) {//shift + n key
        /*if ( randnum == 1 ) {
          fly_sankocho.twitter();
        } else if ( randnum == 2 ) {
          fly_sankocho.bounder();
        } else {*/
          fly_sankocho.sayday();
        //}
      }else if ( 80 == key_code && true == shift_key ){
        fly_sankocho.flysankocho();//shift + p key
      }
    });

    if ( fly_sankocho.wdwidth > 770 && 0 == fly_sankocho.istouch){
      if ( 0 === fly_sankocho.waitt ) {
        setTimeout(function() {
          fly_sankocho.flysankocho();
        }, fly_sankocho.blank );
      }
    }
  }
});
