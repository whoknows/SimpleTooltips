/*
 * Simple ToolTips v1.0
 * By Guillaume Coste, guillaume.coste@gmail.com
 * See demo.html for examples
*/
function in_array (needle, haystack, argStrict) {
	var key = '', strict = !! argStrict;
	if (strict) {
		for (key in haystack) {
			if (haystack[key] === needle) return true;
		}
	} else {
		for (key in haystack) {
			if (haystack[key] == needle) return true;
		}
	} return false;
}

function drawTriangle(canvas){
	if (canvas.elem.getContext){
		var ctx = canvas.elem.getContext('2d');
		ctx.beginPath();
		if(canvas.pos == 'bottom'){
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
		ctx.strokeStyle = "#555";
		ctx.stroke();;
		ctx.fillStyle = canvas.color;
		ctx.fill();
		ctx.closePath();
	}
}

(function($){
	var setIDs = new Array();
	$.fn.tooltips = function(options){
		function resetPosition(elem, option){
			var pos  = $.extend({}, elem.offset(),{width:elem.offsetWidth,height:elem.offsetHeight});
			var uid  = elem.attr('uid');
			var left = pos.left-(options.width/2)+elem.width()/2;
			var marg = {'bottom':'-3', 'top':'-6'};
			var ttip = $('#tp_'+uid+'').parent('.tooltips-wrapper');

	        canvas = new Array();
	        canvas.html = '<canvas id="can'+uid+'" width="30" height="12" class="tooltips-triangle"></canvas>';
	        canvas.pos  = pos.top < ttip.height() ? 'top' : 'bottom';
	        canvas.left = (option.width/2)-15;
	        canvas.color= option.color;
			if(pos.left < options.width/2){
				canvas.left -= (option.width/2) - (elem.width()/2) - pos.left/2;
				left += (options.width/2)-elem.width()/2-pos.left/2;
			}

			ttip.css({
				'min-height':options.height+'px',
				'left'  :left,
				'width' :options.width+'px'
			});

			$('#can'+uid+'').remove();
			if(pos.top < ttip.height()){
				$('#tp_'+uid).css({'margin-top':(marg['top'])+'px'});
				ttip.css({'top':pos.top + elem.height()+'px'}).prepend(canvas.html);
			} else {
				$('#tp_'+uid).css({'margin-bottom':marg['bottom']+'px'});
				ttip.css({'top':pos.top - ttip.height()+'px'}).append(canvas.html);
			}

			$('#can'+uid).css({'left':canvas.left});
			if(!option.multiple){
				$('.tooltips-wrapper').hide();
			} else {
				$('.tooltips-wrapper').css('z-index','998');
				ttip.css('z-index','999');
			}
	        canvas.elem = document.getElementById('can'+uid);
	        drawTriangle(canvas);
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
		var options = $.extend(defaults, options);
		return this.each(function(){
			if(options.multiple && options.activation == 'hover'){
				options.multiple = false;
				alert("Multiple tooltips isnt avaliable on hover activation. Multiple will be disabled")
			}
			if(options.height < 50) options.height = 50;
	        if(options.width  < 50) options.width  = 50;

	        var tmp_id = Math.floor(Math.random()*10000);
	        while(in_array(tmp_id, setIDs)){
	            tmp_id = Math.floor(Math.random()*10000);
	        }
	        setIDs.push(tmp_id);

	        $(this).attr('uid',tmp_id);
	        if(options.data == 'title') options.data = $(this).attr('title');
	        $('body').append('<div class="tooltips-wrapper"><div class="tooltips-body" id="tp_'+tmp_id+'">'+options.data+'</div></div>');
	        $('#tp_'+tmp_id+'').css({
	            'background':options.color,
	            'color' :options.textColor,
	            'min-height':options.height-22+'px',
	            'width' :options.width-12+'px'
	        });

	        var tooltip = $('#tp_'+tmp_id+'').parent('.tooltips-wrapper')
	        if(options.activation == 'hover'){
	            $(this).hover(function(){
	            	resetPosition($(this), options);
	            }, function(){ tooltip.hide(); });
	            tooltip.hover(function(){tooltip.show();}, function(){tooltip.hide();});
	        } else {
	            $(this).bind('click',function(e){
	                if(tooltip.css('display') == 'none')
	                	resetPosition($(this), options);
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
