const h = require('react-hyperscript');

const { formatSec } = require('../lib/format-time');
const { describeArc } = require('../lib/svg-helpers');

const { Icon } = require('./Icon');

const SectionTimeView = ({ icon, timeLeft, duration }) => {
    const startDeg = 360 - Math.round((timeLeft / duration) * 360);

    return [
        h('circle', {
            key: 'circle',
            cx: 200,
            cy: 175,
            r: 35,
            fill: '#fff',
            stroke: '#f5f5f5',
            strokeWidth: 1,
        }),
        h('path.SectionTime', {
            key: 'SectionTime',
            d: describeArc(200, 175, 33, startDeg, 359.999),
            strokeLinecap: 'round',
            fill: 'none',
            stroke: '#51bf90',
            strokeWidth: 1
        }),
        h('text.SectionTimeText', {
            key: 'SectionTimeText',
            x: 200,
            y: 185,
            fontSize: 30,
            fill: '#333',
            fontFamily: 'Verdana',
            textAnchor: 'middle'
        }, formatSec(timeLeft)),
        icon === 'wait' ?
            h(Icon, {
                key: 'icon',
                icon,
                x: 172,
                y: 250,
            }) :
            h(Icon, {
                key: 'icon',
                icon,
                x: 135,
                y: 250,
            })
        ,
    ];
};

module.exports = { SectionTimeView };