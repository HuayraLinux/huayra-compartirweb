export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  window.requireNode('nwjs-hack').set_wmclass('huayra-compartir', true);
}

export default {
  name: 'set-wmclass',
  initialize
};
