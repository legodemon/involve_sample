'use strict';

document.addEventListener("DOMContentLoaded", function () {
    
    var taskDescriptionsElements = Array.prototype.slice.call(document.querySelectorAll('.task-description'));

    taskDescriptionsElements.forEach(function (element) {

        var text = element.innerHTML,
            clone = document.createElement('div');

        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.width = element.clientWidth + 'px';
        clone.innerHTML = text;

        document.body.appendChild(clone);


        for (var l = text.length - 1; l >= 0 && clone.clientHeight > element.clientHeight; --l) {
            console.log(clone.innerHTML);
            clone.innerHTML = text.substring(0, l) + '...';
        }
        

        element.innerHTML = clone.innerHTML;
    });

});

