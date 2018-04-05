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
		    minOriginResize = {};
			
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
		
		var minWidth = config.minWidth;
		var minHeight = config.minHeight;
		
		var onDragWillStart = config.onDragWillStart;
		var onDragDidStart = config.onDragDidStart;
		var onDrag = config.onDrag;
		var onDragWillEnd = config.onDragWillEnd;
		var onDragDidEnd = config.onDragDidEnd;
		
		var onResizeWillStart = config.onResizeWillStart;
		var onResizeDidStart = config.onResizeDidStart;
		var onResize = config.onResize;
		var onResizeWillEnd = config.onResizeWillEnd;
		var onResizeDidEnd = config.onResizeDidEnd;
		
		var container = config.container;
		
    	if (typeof container == 'string')
    		container = $(this).find(container);
    	
    	if (container == null)
    		container = $(container);
    	
    	if (container.length == 0)
    		container = $(this);
	
    	container.addClass("tactile");
		
    	if (config.draggable != null) {
    		
    		var mousedownOriginDrag = null;
    		var mousedownOffsetDrag = null;
    		
    		container.addClass("draggable");
    		
    		var handle = config.draggable.handle;
        	
        	if (typeof handle == 'string')
        		handle = container.find(handle);
	    	
	    	if (handle == null)
	    		handle = $(handle);
	    	
	    	if (handle.length == 0)
	    		handle = $(this);
	    	
	    	handle.addClass("draggable-handle");
	    	
	    	handle.off("mousedown.draggable").on("mousedown.draggable", function(e) {
	    		if (typeof onDragWillStart == 'function') onDragWillStart(e);
	    		disableSelection(document.body);
	    		mousedownOriginDrag = {
	    			left: e.clientX,
	    			top: e.clientY,
	    		};
	    		containerOrigin = {
	    			left: container.offset().left,
	    			top: container.offset().top,
	    		};
	    		if (typeof onDragDidStart == 'function') onDragDidStart(e);
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
	    		if (typeof onDrag == 'function') onDrag(e);
	    	});
	    	
	    	$(document.body).off("mouseup.draggable mouseleave.draggable").on("mouseup.draggable mouseleave.draggable", function(e) {
	    		if (mousedownOriginDrag == null) return;
	    		if (typeof onDragWillEnd == 'function') onDragWillEnd(e);
	    		release(container);
	    		if (typeof onDragDidEnd == 'function') onDragDidEnd(e);
	    	});
	    	
	    	$(window).off('resize.draggable').on('resize.draggable', function(e) {
	    		adjustVisibility(container);
	    	});
    	
    	}
    	
    	if (config.resizable != null) {
    		
    		var mousedownOriginResize = null;
    		var mousedownOffsetResize = null;
    		var minOriginResize = {};
    		
    		container.addClass("resizable");
    		
    		var handle = config.resizable.handle;
	    	
	    	if (typeof handle == 'string')
	    		handle = container.find(handle);
	    	
	    	if (handle == null)
	    		handle = $(handle);
	    	
	    	handle.addClass("resize-handle");
	    	
	    	handle.off("mousedown.resizable").on("mousedown.resizable", function(e) {
	    		containerOrigin = {
	    			left: container.offset().left,
	    			top: container.offset().top,
	    		};
	    		containerDimens = {
	    			width: container.outerWidth(),
	    			height: container.outerHeight(),
	    		};
	    		mousedownOriginResize = {
	    			left: e.clientX,
	    			top: e.clientY,
	    		};
	    		var width = containerDimens.width;
	    		var height = containerDimens.height;
	    		if (typeof onResizeWillStart == 'function') onResizeWillStart(e, width, height);
	    		disableSelection(document.body);
	    		if (typeof onResizeDidStart == 'function') onResizeDidStart(e, width, height);
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
	    			container.outerWidth(width);
	    		} else {
	    			if (minOriginResize.left == null) {
	    				minOriginResize.left = containerOrigin.left - (mousedownOffsetResize.left / 2);
	    			}
	    			width = (minWidth || $(window).width() / 3);
	    			dxleft = minOriginResize.left;
	    		}
	    		if (height >= (minHeight || 320) && container.offset().top + height < $(window).height() + $(document).scrollTop()) {
	    			dxtop = containerOrigin.top - (mousedownOffsetResize.top / 2);
	    			container.outerHeight(height);
	    		} else {
	    			if (minOriginResize.top == null) {
	    				minOriginResize.top = containerOrigin.top - (mousedownOffsetResize.top / 2);
	    			}
	    			height = (minHeight || $(window).width() / 3);
	    			dxtop = minOriginResize.top;
	    		}
	    		container.offset({
	    			left: dxleft,
	    			top: dxtop,
	    		});
	    		if (typeof onResize == 'function') onResize(e, width, height);
	    	});
	    	
	    	$(document.body).off("mouseup.resizable mouseleave.resizable").on("mouseup.resizable mouseleave.resizable", function(e) {
	    		if (mousedownOriginResize == null) return;
	    		var width = containerDimens.width;
	    		var height = containerDimens.height;
	    		if (typeof onResizeWillEnd == 'function') onResizeWillEnd(e, width, height);
	    		release(container);
	    		if (typeof onResizeDidEnd == 'function') onResizeDidEnd(e, width, height);
	    	});
    		
    	}
    	
    	return this;
    	
    };
    
}(jQuery));
