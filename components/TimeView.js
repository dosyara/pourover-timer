const h = require('react-hyperscript');

const { formatDuration } = require('../lib/format-time');

const TimeView = ({ time }) => {
    return [
        h('text.TimeView', {
            key: 'val',
            x: 40,
            y: 55,
            fontSize: 55,
            fontFamily: 'Helvetica Neue',
            fontWeight: 200,
            textAnchor: 'start'
        }, formatDuration(time)),
        h('line', {
            key: 'line',
            x1: 20,
            y1: 75,
            x2: 200,
            y2: 75,
            stroke: '#999',
            strokeWidth: 1,
        }),
    ];
};


module.exports = { TimeView };