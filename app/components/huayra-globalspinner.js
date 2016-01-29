import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {

    $(document).ajaxStart(function() {
      $('#spinner').removeClass('opacity0');
    });

    $(document).ajaxStop(function() {
      $('#spinner').addClass('opacity0');
    });
  }

  });
