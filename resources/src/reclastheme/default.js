import 'plone';
import './default.less';
import './extensions/roster';
import './theme.scss';

import jQuery from 'jquery';  // Expose jQuery for convenience
window.jQuery = jQuery;

window.require = undefined;  // Fix @@search
