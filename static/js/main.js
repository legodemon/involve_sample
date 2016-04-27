'use strict';

function animate(options) {

    var start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction от 0 до 1
        var timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) {
            timeFraction = 1;
        }

        // текущее состояние анимации
        var progress = options.timing(timeFraction);

        options.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

document.addEventListener("DOMContentLoaded", function () {

    var contentContainer = document.querySelector('.content'),
        chatContainer = document.querySelector('.chat'),
        taskContainer = document.querySelector('.task');

    chatContainer.style.width = contentContainer.clientWidth - 2 * parseInt(window.getComputedStyle(contentContainer).padding) + 'px';
    chatContainer.style.position = "absolute";
    chatContainer.style.right = -window.innerWidth + 'px';

    taskContainer.style.width = contentContainer.clientWidth - 2 * parseInt(window.getComputedStyle(contentContainer).padding) + 'px';
    taskContainer.style.position = "absolute";
    taskContainer.style.left = '10px';

    taskContainer.addEventListener('click', function () {

        var duration = 400;

        var chatContainerStartPosition = -window.innerWidth;
        var chatContainerStopPosition = 10;

        var taskContainerStartPosition = 10;
        var taskContainerStopPosition = -window.innerWidth;

        var velocity = (chatContainerStopPosition - chatContainerStartPosition) / duration;

        animate({
            duration: duration,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: function (progress) {
                chatContainer.style.right = chatContainerStartPosition + (velocity * progress * duration) + 'px';
                taskContainer.style.left = taskContainerStartPosition - (velocity * progress * duration) + 'px';
            }
        });

    });

    chatContainer.addEventListener('click', function(){

        var duration = 400;

        var chatContainerStartPosition = 10;
        var chatContainerStopPosition = -window.innerWidth;

        var taskContainerStartPosition = -window.innerWidth;
        var taskContainerStopPosition = 10;

        var velocity = (chatContainerStopPosition - chatContainerStartPosition) / duration;

        animate({
            duration: duration,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: function (progress) {
                chatContainer.style.right = chatContainerStartPosition + (velocity * progress * duration) + 'px';
                taskContainer.style.left = taskContainerStartPosition - (velocity * progress * duration) + 'px';
            }
        });
    })
});

