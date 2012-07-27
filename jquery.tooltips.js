/*
 * Simple ToolTips v1.4
 * By Guillaume Coste, guillaume.coste (at) gmail.com
 * See demo.html for examples
*/

function Triangle(html, pos, left, color){
    this.pos = pos;
    this.left = left;
    this.html = html;
    this.color = color;
    this.elem;

    Triangle.prototype.drawMe = function() {
        if (this.elem.getContext){
            var ctx = this.elem.getContext('2d');
            ctx.beginPath();
            if(this.pos == 'bottom'){
                ctx.lineTo(30,0);
                ctx.lineTo(15,10);
                ctx.lineTo(0,0);
            } else {
                ctx.moveTo(0,12);
                ctx.lineTo(30,12);
                ctx.lineTo(15,2);
                ctx.lineTo(0,12);
            }
            ctx.lineWidth = "2";
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            ctx.stroke();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
	}
}

(function($){
    $.fn.tooltips = function(options){
        function resetPosition(elem, ttip){
			var pos    = elem.offset();
			var left   = pos.left-(options.width/2)+elem.width()/2;
			var marge  = 10;
            var canvas = new Triangle(
                                    '<canvas width="30" height="12" class="tooltips-triangle"></canvas>',
                                    pos.top - $(document).scrollTop() - 10 < ttip.height() ? 'top' : 'bottom',
                                    (options.width/2)-15,
                                    options.color);

			if(pos.left - $(document).scrollLeft() - marge < options.width/2){
                canvas.left -= options.width / 2 - elem.width() / 2 - (pos.left- $(document).scrollLeft()) / 2;
                left += options.width / 2 - elem.width() / 2 - (pos.left - $(document).scrollLeft()) / 2;
			}

			ttip.css({
                'min-height':options.height,
                'left'  :left,
                'width' :options.width+'px'
			});

			ttip.find('canvas').remove();
			ttip.children().append(canvas.html);

			if(pos.top - $(document).scrollTop() - marge < ttip.height()){
                ttip.find('canvas').css({'bottom':'100%', 'top':''});
                ttip.css({'top':pos.top + elem.height()+marge+'px'});
			} else {
                ttip.find('canvas').css({'bottom':'', 'top':'100%'});
                ttip.css({'top':pos.top - ttip.height()-marge+'px'});
			}

			ttip.find('canvas').css({'left':canvas.left});
			if(!options.multiple){
                $('.tooltips-wrapper').fadeOut('fast');
			} else {
                $('.tooltips-wrapper').css('z-index','998');
                ttip.css('z-index','999');
			}
			canvas.elem = ttip.find('canvas')[0];
            canvas.drawMe();
			ttip.fadeIn('fast');
		}

        var defaults = {
            activation:'click',
            color:'white',
            data:'title',
            height:100,
            multiple:false,
            textColor:'black',
            width:300
        };
        options = $.extend(defaults, options);
        return this.each(function(){
            if(options.multiple && options.activation == 'hover'){
                options.multiple = false;
                console.log("Multiple tooltips isn't avaliable on hover activation. Multiple will be disabled");
            }
            if(options.height < 50) options.height = 50;
            if(options.width  < 50) options.width  = 50;
            if(options.data == 'title') options.data = $(this).attr('title');

            var tooltip = $('<div class="tooltips-wrapper"><div class="tooltips-body">'+options.data+'</div></div>').appendTo('body');

            tooltip.children('.tooltips-body').css({
                'background-color':options.color,
                'color' :options.textColor,
                'min-height':options.height-22+'px',
                'width' :options.width-12+'px'
            });

            if(options.activation == 'hover'){
                $(this).hover(function(){
                    resetPosition($(this), tooltip);
                }, function(){ tooltip.hide(); });
                tooltip.hover(function(){tooltip.show();}, function(){tooltip.hide();});
            } else {
                $(this).bind('click',function(e){
                    if(tooltip.css('display') == 'none')
                        resetPosition($(this), tooltip);
                    else
                        tooltip.fadeOut('fast');
                    e.stopPropagation();
                });
                tooltip.click(function(e){e.stopPropagation();});
                $(document).click(function(e){tooltip.hide();});
                if(options.multiple){
                    $('.tooltips-wrapper').click(function(){
                        $('.tooltips-wrapper').css('z-index','998');
                        $(this).css('z-index','999');
                    });
                }
            }
        });
    };
})(jQuery);