const h = require('react-hyperscript');

const { formatSec } = require('../lib/format-time');
const { describeArc } = require('../lib/svg-helpers');

const { Icon } = require('./Icon');

const SectionTimeView = ({ icon, timeLeft, duration }) => {
    const startDeg = 360 - Math.round((timeLeft / duration) * 360);

    return [
        h('path.SectionTime', {
            key: 'SectionTime',
            d: describeArc(200, 250, 144, startDeg, 359.999),
            strokeLinecap: 'round',
            fill: 'none',
            stroke: icon === 'time' ? '#51bf90' : '#199ad3',
            strokeWidth: 2
        }),
        h('text.SectionTimeText', {
            key: 'SectionTimeText',
            x: 200,
            y: 230,
            fontSize: 50,
            fill: '#334457',
            fontFamily: 'Helvetica Neue',
            fontWeight: 300,
            textAnchor: 'left'
        }, formatSec(timeLeft)),
        icon === 'time' ?
            h(Icon, {
                key: 'icon',
                icon,
                x: 148,
                y: 190,
            }) :
            h(Icon, {
                key: 'icon',
                icon,
                x: 152,
                y: 190,
            })
        ,
    ];
};

module.exports = { SectionTimeView };