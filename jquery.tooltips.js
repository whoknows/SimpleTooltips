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
			if(!options.multiple){
                $('.tooltips-wrapper').fadeOut('fast');
            } else {
                $('.tooltips-wrapper').css('z-index','998');
                ttip.css('z-index','999');
			}

            var pos    = elem.offset();
			var left   = pos.left-(options.width/2)+elem.width()/2;
			var isTop  = pos.top - $(document).scrollTop() - 10 < ttip.height();
            var marge  = 10;
			var sign   = isTop ? 1 : -1;
            var canvas = new Triangle(
                                    '<canvas width="30" height="12" class="tooltips-triangle"></canvas>',
                                    isTop ? 'top' : 'bottom',
                                    (options.width/2)-15,
                                    options.color);

			if(pos.left - $(document).scrollLeft() - marge < options.width/2){
                var ecart = (options.width - elem.width() - pos.left + $(document).scrollLeft()) / 2;
                canvas.left -= ecart;
                left += ecart;
			}

			ttip.find('canvas').length===0&&ttip.children().append(canvas.html);
            ttip.css({
                'min-height':options.height,
                'left'      :left,
                'width'     :options.width+'px',
                'top'       :pos.top+((isTop?elem.height():ttip.height())+ marge) * sign + 'px'
            }).find('canvas').css({
                'left'  : canvas.left,
                'bottom': isTop ? '100%' : '',
                'top'   : isTop ? '' : '100%'
            });

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
            var data = options.data;
            if(options.height < 50) options.height = 50;
            if(options.width  < 50) options.width  = 50;
            if(options.data.indexOf('attr') === 0) data = $(this).attr(options.data.substr(5));

            var tooltip = $('<div class="tooltips-wrapper"><div class="tooltips-body">'+data+'</div></div>').appendTo('body');

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
                $(document).click(function(){tooltip.hide();});
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