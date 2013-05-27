;(function ( $, window, document, undefined ) {

    var utilityName = 'unimpress',

    Utility = function ( options ) {

        this._name = utilityName;
        this.options = options;

        this.init(options);
    };

    Utility.prototype = {

        constructor : Utility,

        defaults : {
            slideSelector : 'article',
            start : 0,
            action : 'startPresentation',
            enableKeyboard: true
        },

        init : function (options) {

            var _self = this;
            _self.options = $.extend( {}, _self.defaults, options);
            _self.$slides = $(_self.options.slideSelector);
            _self.totalSlides = _self.$slides.length - 1;
            _self._bindEvent('goToSlide', function (e, change) {
                return _self.goToSlide(change);
            });
            _self._initialClasses();
            if (_self.options.enableKeyboard) { _self._setKeyboardNavigation(); }
            if (typeof _self[_self.options.action] === "function") { _self[_self.options.action](); }

            return _self;
        },

        $currentSlide : function () {
            return this.$slides.eq(this.currentSlide);
        },

        goToSlide : function (slideNumber) {
            var _self = this;

            if (slideNumber <= _self.totalSlides && slideNumber >= 0) {
                _self.currentSlide = parseInt(slideNumber, 10);
                _self.$currentSlide = _self.$slides.eq(_self.currentSlide);
                _self._setClasses();
                _self._setLocation();
            }
            return _self.currentSlide;
        },

        nextSlide : function () {
            return $(document).trigger('goToSlide.'+this._name, [this.currentSlide + 1]);
        },

        prevSlide : function () {
            return $(document).trigger('goToSlide.'+this._name, [this.currentSlide - 1]);
        },

        startPresentation : function () {
            return $(document).trigger('goToSlide.'+this._name, [this.options.start]);
        },

        _setKeyboardNavigation : function () {
            var _self = this;
            $(window).on('keyup', function (ev) {
                if (ev.keyCode === 39 || ev.keyCode === 38) {
                    _self.nextSlide();
                }
                if (ev.keyCode === 37 || ev.keyCode === 40) {
                    _self.prevSlide();
                }
            });
        },

        _initialClasses : function () {
            var _self = this;
            _self.$slides.addClass(_self._name + '-slide').each(function(index) {
                $(this).addClass(_self._name + '-slide--'+index);
            });
        },

        _setClasses : function () {
            var _self = this;
            _self.$slides.removeClass(_self._name + '-slide--current ' + _self._name + '-slide--upcoming ' + _self._name + '-slide--past')
                .eq(_self.currentSlide)
                    .addClass(_self._name + '-slide--current')
                    .nextAll(_self.options.slideSelector)
                        .addClass(_self._name + '-slide--upcoming')
                    .end()
                    .prevAll(_self.options.slideSelector)
                        .addClass(_self._name + '-slide--past');
        },

        _setLocation : function () {
            var _self = this;
            window.location.hash = "!/" + _self.currentSlide;
        },

        _bindEvent : function (event, action) {

            var _self = this;
            $(document).on(event+'.'+_self._name, action);

        },

        _unbindEvent : function (event) {

            $(document).off(event + '.'+this._name);

        }
    };

    $[utilityName] = function ( options ) {
        var args = arguments,
            instance = $.data(window, 'utility_' + utilityName);

        if (options === undefined || typeof options === 'object') {
            if (!instance) {
                return $.data(window, 'utility_' + utilityName, new Utility( options ));
            } else {
                instance['init']( options );
                return instance.init;
            }
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            if (instance instanceof Utility && typeof instance[options] === 'function') {
                instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            }
            return instance;
        }
    };

}( jQuery, window, document ));