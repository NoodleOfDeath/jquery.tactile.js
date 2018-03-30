/**
 * jquery.tactile.js
 * 
 * @description Lightweight jQuery plugin for making elements draggable. Eventually this API should be
 * replaced by a third-party party plugin that is maintained and updated regularly.
 * @author Thom Morgan
 */

(function ($) {
	
	/**
	 * jQuery plugin that can make a DOM element draggable and/or resizable.
	 */
	$.fn.tactile = function(config) {
		
		function enableSelection(container, enable) {
			if (enable == null) enable = true;
			var attr = enable ? 'auto' : 'none';
			$(container).css({
				'-webkit-touch-callout' : attr,
	    	    '-webkit-user-select' : attr,
	    	    '-khtml-user-select' : attr,
	    	    '-moz-user-select' : attr,
	    	    '-ms-user-select' : attr,
	    	    'user-select' : attr,
			});
		}

		function disableSelection(container, disable) {
			if (disable == null) disable = true;
			enableSelection(container, !disable);
		}
		
		function enableMouseEvents(container, enable) {
			if (enable == null) enable = true;
			var attr = enable ? 'auto' : 'none';
			$(container).css({
				'pointer-events' : attr,
			});
		}
		
		function disableMouseEvents(container, disable) {
			if (disable == null) disable = true;
			enableMouseEvents(container, !disable);
		}
		
		function release(container) {

			enableSelection(document.body);
			enableMouseEvents(container);
			
		    containerOrigin = null;
		    containerDimens = null;
		    
			mousedownOriginDrag = null;
			mousedownOffsetDrag = null;
			
			mousedownOriginResize = null;
			mousedownOffsetResize = null;
			
			adjustVisibility(container);
			
		}
		
		function adjustVisibility(container) {

			if (containerMargin == null) {
				containerMargin = {
					top : 10,
					right : 10,
					bottom: 10,
					left: 10,
				}
			} else
			if (typeof containerMargin == 'number') {
				containerMargin = {
					top : containerMargin,
					right : containerMargin,
					bottom: containerMargin,
					left: containerMargin,
				}
			}
			
			var dxleft = container.offset().left;
			var dxtop = container.offset().top;
			
			if (container.offset().left < $(document).scrollLeft()) {
				dxleft = containerMargin.left + $(document).scrollLeft();
			} else if (container.offset().left + container.outerWidth() > $(window).width() + $(document).scrollLeft()) {
				dxleft = $(window).width() - container.outerWidth() - containerMargin.right + $(document).scrollLeft();
			}
			
			if (container.offset().top < $(document).scrollTop()) {
				dxtop = containerMargin.top + $(document).scrollTop();
			} else if (container.offset().top + container.outerHeight() > $(window).height() + $(document).scrollTop()) {
				dxtop = $(window).height() - container.outerHeight() - containerMargin.bottom + $(document).scrollTop();
			}
			
			container.offset({
				left : dxleft,
				top: dxtop, 
			})
			
		}
    	
    	if (config == null)
    		config = {};
    	
		var containerOrigin = null;
		var containerDimens = null;
		
		var containerMargin = config.containerMargin;
    	
    	if (config.draggable != null) {
    		
    		var mousedownOriginDrag = null;
    		var mousedownOffsetDrag = null;
    		
    		var container = config.draggable.container;
    		var handle = config.draggable.handle;
    		
        	if (typeof container == 'string')
        		container = $(this).find(container);
        	
        	if (container == null)
        		container = $(container);
        	
        	if (container.length == 0)
        		container = $(this);
    	
    		container.addClass("draggable");
	    	
	    	if (typeof handle == 'string')
	    		handle = container.find(handle);
	    	
	    	if (handle == null)
	    		handle = $(handle);
	    	
	    	if (handle.length == 0)
	    		handle = $(this);
	    	
	    	handle.addClass("draggable-handle");
	    	
	    	handle.off("mousedown.draggable").on("mousedown.draggable", function(e) {
	    		disableSelection(document.body);
	    		mousedownOriginDrag = {
	    			left: e.clientX,
	    			top: e.clientY,
	    		};
	    		containerOrigin = {
	    			left: container.offset().left,
	    			top: container.offset().top,
	    		};
	    	});
	    	
	    	$(document.body).off("mousemove.draggable").on("mousemove.draggable", function(e) {
	    		if (mousedownOriginDrag == null) return;
	    		if (mousedownOffsetDrag == null)
	    			disableMouseEvents(container);
	    		mousedownOffsetDrag = {
	    			left: e.clientX - mousedownOriginDrag.left,
	    			top: e.clientY - mousedownOriginDrag.top,
	    		}
	    		container.offset({
	    			left: containerOrigin.left + mousedownOffsetDrag.left,
	    			top: containerOrigin.top + mousedownOffsetDrag.top,
	    		});
	    	});
	    	
	    	$(document.body).off("mouseup.draggable mouseleave.draggable").on("mouseup.draggable mouseleave.draggable", function(e) {
	    		if (mousedownOriginDrag == null) return;
	    		release(container);
	    	});
	    	
	    	$(window).off('resize.draggable').on('resize.draggable', function(e) {
	    		adjustVisibility(container);
	    	});
    	
    	}
    	
    	if (config.resizable != null) {
    		
    		var mousedownOriginResize = null;
    		var mousedownOffsetResize = null;
    		
    		var container = config.resizable.container;
    		
    		var minWidth = config.resizable.minWidth;
    		var minHeight = config.resizable.minHeight;
    		
    		var handle = config.resizable.handle;
    		
    		var onResize = config.onResize;
    		
    		if (typeof container == 'string')
        		container = $(this).find(container);
        	
        	if (container == null)
        		container = $(container);
        	
        	if (container.length == 0)
        		container = $(this);
    	
    		container.addClass("resizable");
	    	
	    	if (typeof handle == 'string')
	    		handle = container.find(handle);
	    	
	    	if (handle == null)
	    		handle = $(handle);
	    	
	    	handle.addClass("resize-handle");
	    	
	    	handle.off("mousedown.resizable").on("mousedown.resizable", function(e) {
	    		disableSelection(document.body);
	    		mousedownOriginResize = {
	    			left: e.clientX,
	    			top: e.clientY,
	    		};
	    		containerOrigin = {
	    			left: container.offset().left,
	    			top: container.offset().top,
	    		};
	    		containerDimens = {
	    			width: container.outerWidth(),
	    			height: container.outerHeight(),
	    		};
	    	});
	    	
	    	$(document.body).off("mousemove.resizable").on("mousemove.resizable", function(e) {
	    		if (mousedownOriginResize == null) return;
	    		if (mousedownOffsetResize == null)
	    			disableMouseEvents(container);
	    		mousedownOffsetResize = {
	    			left: e.clientX - mousedownOriginResize.left,
	    			top: e.clientY - mousedownOriginResize.top,
	    		}
	    		var dxleft = containerOrigin.left;
	    		var dxtop =  containerOrigin.top;
	    		var width = containerDimens.width + mousedownOffsetResize.left;
	    		var height = containerDimens.height + mousedownOffsetResize.top;
	    		if (width >= (minWidth || 400) && container.offset().left + width < $(window).width() + $(document).scrollLeft()) {
	    			dxleft = containerOrigin.left - (mousedownOffsetResize.left / 2);
	    			container.width(width);
	    		} else {
	    			width = (minWidth || 400);
	    		}
	    		if (height >= (minHeight || 320) && container.offset().top + height < $(window).height() + $(document).scrollTop()) {
	    			dxtop = containerOrigin.top - (mousedownOffsetResize.top / 2);
	    			container.height(height);
	    		} else {
	    			height = (minHeight || 320);
	    		}
	    		container.offset({
	    			left: dxleft,
	    			top: dxtop,
	    		});
	    		if (typeof onResize == 'function') onResize(width, height);
	    	});
	    	
	    	$(document.body).off("mouseup.resizable mouseleave.resizable").on("mouseup.resizable mouseleave.resizable", function(e) {
	    		release(container);
	    	});
    		
    	}
    	
    	return this;
    	
    };
    
}(jQuery));
