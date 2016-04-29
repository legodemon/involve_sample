window.App = window.App || {};

window.App.setupDefault = function (content, chat, task, headerChat, footerChat) {

    var chatStyle = chat.style,
        contentWidth = content.clientWidth,
        contentPadding = parseInt(window.getComputedStyle(content).padding);

    chatStyle.width = contentWidth - 2 * contentPadding + 'px';
    chatStyle.position = 'absolute';
    chatStyle.right = -window.innerWidth + 'px';

    task.style.width = contentWidth - 2 * contentPadding + 'px';

    headerChat.style.top = -headerChat.offsetHeight - 3 + 'px'; // minus height box-shadow

    footerChat.style.bottom = -footerChat.offsetHeight - 1 + 'px'; // minus height box-shadow

};