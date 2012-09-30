$(function(){
    TakePhotoPopUp = Backbone.View.extend({

        template: _.template($('#takePictureWrapperTemplate').html()),

        image: null,
        pos: 0,
        canvas: null,

        initialize: function() {
        var ctx = this;

            $("#TakePicture").live("click", function(){
                    $("#webcam").css('display','block').webcam({ 
                        width: 320,
                        height: 240,
                        mode: "callback",
                        swffile: "js/libs/jquery/jscam.swf",

                        onTick: function(){    
                            ctx.onTick(); 
                        },

                        onSave: function(data) {
                            ctx.onSave(data);
                        },

                        onCapture: function(){     
                            ctx.onCapture();    
                        },

                        debug: function(type, string){
                            ctx.onDebug(type, string); 
                        },

                        onLoad: function() {    
                            ctx.onLoad();   
                        }


                    });
                    $(this).css('display', 'none');
                    $("#MakePhoto").css('display','inline-block'); 
            });

            $("#MakePhoto").live("click", function(){
                  webcam.capture(); 
            });

            $("#cancel").live("click", function(){
                ctx.dialog.dialog("destroy");
            });    


        },

        onLoad: function() {
            this.canvas = document.getElementById("canvas").getContext("2d"),
            this.image = this.canvas.getImageData(0, 0, 320, 240);
        },

        onTick:function(remain){
            //method onTick() is called after every second
            // It shows the time to wait until the image is shot
            console.log("onTick - " + remain);
        },

        onDebug:function(type, string){
            console.log("onDebug");
            console.log(type + " " +string); 
        },

        onCapture:function(event){
            console.log("onCapture");
            webcam.save();
        },

        onSave:function(data){
            
            var ctx = this, 
            col = data.split(";"), 
            img = this.image;

            for(var i = 0; i < 320; i++) {
                var tmp = parseInt(col[i]);
                img.data[ctx.pos + 0] = (tmp >> 16) & 0xff;
                img.data[ctx.pos + 1] = (tmp >> 8) & 0xff;
                img.data[ctx.pos + 2] = tmp & 0xff;
                img.data[ctx.pos + 3] = 0xff;
                ctx.pos+= 4;
            }            
            if (ctx.pos >= 4 * 320 * 240) {
                this.canvas.putImageData(img, 0, 0);
                ctx.savePhoto(img);
                ctx.pos = 0;
            }            
        },

        savePhoto:function(image){
            // var savePhoto,
            // SavePhoto = Backbone.Model.extend({
            //     url: "upload.php"
            // });
            // savePhoto = new SavePhoto();
            // savePhoto.set({'image':image}).save({
            //     success: function(response){
            //         alert(123);
            //     }
            // });
            $.post("upload.php", {type: "data", image: document.getElementById("canvas").toDataURL("image/png")});
        },

        showPopUp: function(event){
            var ctx = this;
            this.dialog = $("#dialog").dialog({
                autoOpen: true,
                width: 400,
                height:600,
                model: true,
                resizable: false,
                position: 'ceter',
                title: "Take a photo",
                beforeClose: function(){
                    ctx.dialog.dialog("destroy");
                },
                open: function(){

                }


            }).html(ctx.template);

        },

        start: function(event){
            var ctx = this;
            $("#takePhotoPopUpCall").live("click", function(){
                ctx.showPopUp();
            });
        }

    });

    new TakePhotoPopUp().start();
});
