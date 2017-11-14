const h = require('react-hyperscript');

function formatVolume(vol) {
    return Math.round(vol);
}

const VolumeView = (props) => {
    return [
        h('text.TimeView', {
            key: 'val',
            x: 360,
            y: 55,
            fontSize: 40,
            fill: '#999',
            fontFamily: 'Helvetica Neue',
            fontWeight: 300,
            textAnchor: 'end'
        }, formatVolume(props.volume) + 'ml'),
        h('line', {
            key: 'line',
            x1: 240,
            y1: 75,
            x2: 380,
            y2: 75,
            stroke: '#999',
            strokeWidth: 1,
        }),
    ];
};


module.exports = { VolumeView };