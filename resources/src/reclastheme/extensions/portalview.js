import 'imports?jQuery=jquery!exports?jQuery.addSwipeEvents!resource-jquery-doubletap-js';

import 'imports?jQuery=jquery!exports?jQuery.portalview_accordion!resource-jyu-portalview-scripts-accordion-js';
import 'imports?jQuery=jquery!exports?jQuery.portalview_tabs!resource-jyu-portalview-scripts-tabs-js';
import 'imports?jQuery=jquery!resource-jyu-portalview-scripts-carousel-js';
import 'imports?jQuery=jquery!resource-jyu-portalview-scripts-toc-js';
import 'imports?jQuery=jquery!resource-jyu-changingcontent-scripts-carousel-js';

import './portalview.less';

import jQuery from 'jquery';

jQuery(function($){
  $('.listFoldingItems > *').each(function(){
    var trigger = $(this).contents().eq(0).wrap('<span/>').parent();
    var content = $(this).contents().wrapAll('<div/>').parent().toggle();
    trigger.prependTo($(this)).click(function() { content.slideToggle('fast'); });
    trigger.css('cursor', 'pointer').css('border-bottom', '1px #ccc dotted');
    content.contents().eq(0).each( function() {
      if (this.tagName === 'BR') { $(this).remove(); }
    });
  });
});
