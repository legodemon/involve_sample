window.App = window.App || {};

window.App.Animate = function(options) {

    var start = performance.now();

    requestAnimationFrame(function animate(time) {

        (typeof options.onStart === 'function') && options.onStart();

        var timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) {
            timeFraction = 1;
            (typeof options.onEnd === 'function') && options.onEnd();
        }

        var progress = options.timing(timeFraction);

        options.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
};
