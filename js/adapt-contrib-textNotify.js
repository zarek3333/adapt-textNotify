define(function(require) {
    
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextNotify = ComponentView.extend({

        template: "text",
        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.resizeImage);

            // Checks to see if the graphic should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.resizeImage(Adapt.device.screenSize, true);

            ComponentView.prototype.postRender.apply(this);
            $('.component-body-inner a', this.$el).click(_.bind(this.onAnchorClicked, this));
            $('.component-body-inner button', this.$el).click(_.bind(this.onAnchorClicked, this));
        },

        // Used to check if the graphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-widget').off('inview');
                    //this.setCompletionStatus(); TURN OFF COMPLETE ON INVIEW
                }

            }
        },

        remove: function() {
            // Remove any 'inview' listener attached.
            this.$('.component-widget').off('inview');

            ComponentView.prototype.remove.apply(this, arguments);

            // danger! will remove all events on '.component-body-inner a'
            $('.component-body-inner a', this.$el).off( "click" );
            $('.component-body-inner button', this.$el).off( "click" );
        },

        resizeImage: function(width, setupInView) {
            var imageWidth = width === 'medium' ? 'small' : width;
            var imageSrc = (this.model.get('_graphic')) ? this.model.get('_graphic')[imageWidth] : '';
            this.$('.graphic-widget img').attr('src', imageSrc);

            this.$('.graphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();

                if (setupInView) {
                    // Bind 'inview' once the image is ready.
                    this.$('.component-widget').on('inview', _.bind(this.inview, this));
                }
            }, this));
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
                    Adapt.trigger;
                    this.setCompletionStatus();
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
                    Adapt.trigger;
                    this.setCompletionStatus();
                }
            } else if (notifyopt === 'button') {
                if(id) {
                    event.preventDefault();
                    Adapt.trigger;
                    this.setCompletionStatus();
                }
            }
        }
    });

    Adapt.register('textNotify', TextNotify);
    return TextNotify;
});
