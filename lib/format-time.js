const { MS } = require('./constants');

const formatSec = (ms) => {
    let sec = Math.trunc(ms / MS);

    return `${sec + 1}`;
};

function formatDuration(ms) {
    let sec = ms / MS;
    let min = Math.trunc(sec / 60);
    let fullSec = Math.trunc(sec - min * 60);
    const add0 = (num) => num < 10 ? '0' + num : '' + num;

    return `${add0(min)}:${add0(fullSec)}`;
}

module.exports = {
    formatSec,
    formatDuration
};