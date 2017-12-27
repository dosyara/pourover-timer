const h = require('react-hyperscript');

const { formatSec } = require('../lib/format-time');

const { Icon } = require('./Icon');

const SectionTimeView = ({ icon, timeLeft }) => {
    return [
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
                x: 144,
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