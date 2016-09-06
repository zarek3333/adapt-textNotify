define(function(require) {
    var Adapt = require('coreJS/adapt');
    var Text = require('components/adapt-contrib-text/js/adapt-contrib-text');

    var TextNotify = Text.extend({

        template: "text",
        postRender: function() {
            Text.prototype.postRender.apply(this);
            $('.component-body-inner a', this.$el).click(_.bind(this.onAnchorClicked, this));
            $('.component-body-inner button', this.$el).click(_.bind(this.onAnchorClicked, this));
        },

        remove: function() {
            // danger! will remove all events on '.component-body-inner a'
            $('.component-body-inner a', this.$el).off( "click" );
            $('.component-body-inner button', this.$el).off( "click" );
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            // do nothing to avoid completion status being set
        },

        onAnchorClicked: function(event) {
            var id = $(event.currentTarget).attr("id");
            var notifyopt = this.model.get("_notifyopt");
            
            if (notifyopt === 'popup') {
                // only hijack anchors with id
                if(id) {
                    event.preventDefault();
                    var popupData = this.model.get("_popupData")[id];
                    Adapt.trigger('notify:popup', {
                        title: popupData.title,
                        body: popupData.message
                    });
                    Adapt.trigger
                }
            } else if (notifyopt === 'alert') {
                if(id) {
                    event.preventDefault();
                    var alertData = this.model.get("_alertData")[id];
                    Adapt.trigger('notify:alert', {
                        title: alertData.title,
                        body: alertData.message,
                        confirmText: alertData.confirmButton
                    });
                    Adapt.trigger
                }
            }
        }
    });

    Adapt.register('textNotify', TextNotify);
    return TextNotify;
});
