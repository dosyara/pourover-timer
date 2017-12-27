const h = require('react-hyperscript');

const { Icon } = require('./Icon');
const { TimeView } = require('./TimeView');
const { Sections } = require('./Sections');
const { VolumeView } = require('./VolumeView');
const { SectionTimeView } = require('./SectionTimeView');

const TimeFace = (props) => {
    return h('svg.TimeFace', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '100%' ,
        height: '100%',
        viewBox: '0 0 400 500',
        onTouchStart: props.onTouchStart,
        onTouchEnd: props.onTouchEnd,
    }, [
        h('defs', { dangerouslySetInnerHTML: {
            __html: `
            <linearGradient id="borderGradient" x1="40%" y1="0%" x2="60%" y2="0%" spreadMethod="pad">
                <stop offset="0%"   stop-color="#50E3C2"/>
                <stop offset="100%" stop-color="#218E93"/>
            </linearGradient>

            <filter id="innershadow" x0="-50%" y0="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
                <feOffset dy="2" dx="2"></feOffset>
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>

                <feFlood flood-color="#999" flood-opacity="0.55"></feFlood>
                <feComposite in2="shadowDiff" operator="in"></feComposite>
                <feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>

                <feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>
                <feOffset dy="-2" dx="-3"></feOffset>
                <feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>

                <feFlood flood-color="#999" flood-opacity="0.55"></feFlood>
                <feComposite in2="shadowDiff" operator="in"></feComposite>
                <feComposite in2="firstfilter" operator="over"></feComposite>
            </filter>
          ` }}),
        h('circle', {
            cx: 200,
            cy: 250,
            r: 150,
            fill: '#fff',
            stroke: 'url(#borderGradient)',
            strokeWidth: 1,
        }),
        h(TimeView, { time: props.timeLeft }),
        h(VolumeView, { volume: props.volume }),
        h(Sections, { sections: props.sections }),

        props.sectionType && h(SectionTimeView, {
            timeLeft: props.sectionLeft,
            icon: { wait: 'time', pour: 'drop' }[props.sectionType],
        }),

        [
            h(Icon, { key: 'start', icon: 'start', x: 55, y: 105, params: { animate: !!props.isRunning } }),
            props.done && h(Icon, { key: 'done', icon: 'done', x: 55, y: 105 }),
        ],

        props.isTouched && h('circle', {
            key: 'c',
            cx: 200,
            cy: 250,
            r: 155,
            fill: '#d3f3e5',
            fillOpacity: 1,
        }),
        h('circle', {
            cx: 200,
            cy: 250,
            r: 155,
            fill: 'transparent',
            onClick: props.onClick,
        }),
    ]);
};


module.exports = { TimeFace };