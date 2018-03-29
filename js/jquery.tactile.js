/**
 * jquery.tactile.js
 * 
 * @description Lightweight jQuery plugin for making elements draggable. Eventually this API should be
 * replaced by a third-party party plugin that is maintained and updated regularly.
 * @author Thom Morgan
 */

(function ($) {
	
	$.fn.tactile = function(config) {
		
		function releaseTactileControl(container) {

			$(document.body).enableSelection();
			container.enableMouseEvents();
			
		    containerOrigin = null;
			mousedownOrigin = null;
			mousedownOffset = null;
			
			if (container.offset().left < 0) {
				container.offset({ 
					left : 10, 
					top: container.offset().top, 
				});
			} else if (container.offset().left > $(window).width() - container.outerWidth()) {
				container.offset({ 
					left : container.offset().left = $(window).width() - container.outerWidth() - 10,
					top: container.offset().top, 
				});
			}

			if (container.offset().top < 0) {
				container.offset({ 
					left : container.offset().left, 
					top: 10, 
				});
			} else if (container.offset().top > $(window).height() - container.outerHeight()) {
				container.offset({ 
					left : container.offset().left, 
					top : container.offset().top = $(window).height() - container.outerHeight() - 10,
				});
			}
			
		}
		
		var mousedownOrigin = null;
		var mousedownOffset = null;
		var containerOrigin = null;
		var containerDimens = null;
		
		this.autogenerateHandle = true;
    	
    	if (config == null)
    		config = {};
    	
    	if (config.draggable != null) {
    		
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
	    		$(document.body).disableSelection();
	    		mousedownOrigin = {
	    			left: e.clientX,
	    			top: e.clientY,
	    		};
	    		containerOrigin = {
	    			left: container.offset().left,
	    			top: container.offset().top,
	    		};
	    	});
	    	
	    	$(document.body).off("mousemove.draggable").on("mousemove.draggable", function(e) {
	    		if (mousedownOrigin == null) return;
	    		if (mousedownOffset == null)
	    			container.disableMouseEvents();
	    		mousedownOffset = {
	    			left: e.clientX - mousedownOrigin.left,
	    			top: e.clientY - mousedownOrigin.top,
	    		}
	    		container.offset({
	    			left: containerOrigin.left + mousedownOffset.left,
	    			top: containerOrigin.top + mousedownOffset.top,
	    		});
	    	});
	    	
	    	$(document.body).off("mouseup.draggable mouseleave.draggable").on("mouseup.draggable mouseleave.draggable", function(e) {
	    		releaseTactileControl(container);
	    	});
    	
    	}
    	
    	/*
    	if (config.resizable != null) {
    		
    		var container = config.resizable.container;
    		var handle = config.resizable.handle;
    		var handleContainer = config.resizable.handleContainer;
    		
    		if (typeof handleContainer == 'string') handleContainer = container.find(handleContainer);
    		if (handleContainer == null || handleContainer.length == 0) handleContainer = $(handleContainer);
    		
    		if (handleContainer.length == 0) {
    			handleContainer = $(document.createElement("div"));
    			handleContainer.addClass("handle-container");
    		}
    		
    		if (config.resizable.handleBefore != null)
    			$(config.resizable.handleBefore).before(handleContainer);
    		else if (config.resizable.handleAfter != null)
    			$(config.resizable.handleAfter).after(handleContainer);
    		
    		$(handleContainer).after('<div class="clearfix"></div>');
    		
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
	    	
	    	if (handle.length == 0) {
	    		handle = $(document.createElement("div"));
	    		handle.append('<i class="fa fa-expand"></i>');
	    		handle.addClass("generated-handle");
	    		handleContainer.append(handle);
	    	}
	    	
	    	handle.addClass("resizable-handle");
	    	
	    	handle.off("mousedown.resizable").on("mousedown.resizable", function(e) {
	    		$(document.body).disableSelection();
	    		mousedownOrigin = {
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
	    		if (mousedownOrigin == null) return;
	    		if (mousedownOffset == null)
	    			container.disableMouseEvents();
	    		mousedownOffset = {
	    			left: e.clientX - mousedownOrigin.left,
	    			top: e.clientY - mousedownOrigin.top,
	    		}
	    		container.offset({
	    			left: containerOrigin.left - (mousedownOffset.left / 2),
	    			top: containerOrigin.top - (mousedownOffset.top / 2),
	    		});
	    		container.size({
	    			width: container.outerWidth() + (mousedownOffset.left / 2),
	    			height: container.outerHeight() + (mousedownOffset.top / 2),
	    		});
	    	});
	    	
	    	$(document.body).off("mouseup.resizable mouseleave.resizable").on("mouseup.resizable mouseleave.resizable", function(e) {
	    		releaseTactileControl(container, "resizable");
	    	});
    		
    	}*/
    	
    	return this;
    	
    };
	
	$.fn.enableSelection = function(enable) {
		if (enable == null) enable = true;
		var attr = enable ? 'auto' : 'none';
		$(this).css({
			'-webkit-touch-callout': attr,
    	    '-webkit-user-select': attr,
    	    '-khtml-user-select': attr,
    	    '-moz-user-select': attr,
    	    '-ms-user-select': attr,
    	    'user-select': attr,
		});
	}

	$.fn.disableSelection = function(disable) {
		if (disable == null) disable = true;
		$(this).enableSelection(!disable);
	}
	
	$.fn.enableMouseEvents = function(enable) {
		if (enable == null) enable = true;
		$(this).css('pointer-events', enable ? 'auto' : 'none');
	}
	
	$.fn.disableMouseEvents = function(disable) {
		if (disable == null) disable = true;
		$(this).enableMouseEvents(!disable);
	}
    
}(jQuery));
