define(function(require) {
    var Adapt = require('coreJS/adapt');
    var Text = require('components/adapt-contrib-text/js/adapt-contrib-text');

    var TextNotify = Text.extend({
        /*
        * NOTE: requires the following commit to work:
        * https://github.com/taylortom/adapt_framework/commit/a7af2e3f8713979f3b8933ed6c443f254ec6eb27
        */
        template: "text",
        postRender: function() {
            Text.prototype.postRender.apply(this);
            $('.component-body-inner a', this.$el).click(_.bind(this.onAnchorClicked, this));
        },

        remove: function() {
            // danger! will remove all events on '.component-body-inner a'
            $('.component-body-inner a', this.$el).off( "click" );
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            // do nothing to avoid completion status being set
        },

        onAnchorClicked: function(event) {
            var id = $(event.currentTarget).attr("id");
            // only hijack anchors with id
            if(id) {
                event.preventDefault();
                var popupData = this.model.get("_popupData")[id];
                Adapt.trigger('notify:popup', {
                    title: popupData.title,
                    body: popupData.message
                });
            }
        }
    });

    Adapt.register('textNotify', TextNotify);
    return TextNotify;
});
