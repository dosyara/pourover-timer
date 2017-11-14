const h = require('react-hyperscript');
const { describeArc } = require('../lib/svg-helpers');

const Sections = ({sections}) => {
    return sections.slice().reverse().map((section, i) => section.timeLeft ? h(Section, { key: i, section }) : '');
};

const colorByType = {
    wait: '#51bf90',
    pour: '#199ad3'
};

const Section = ({ section }) => {
    return h('path.Section', {
        d: describeArc(200, 250, 150, section.start, section.end),
        strokeLinecap: 'round',
        fill: 'none',
        stroke: colorByType[section.type],
        strokeWidth: 5
    });
};

module.exports = { Sections };