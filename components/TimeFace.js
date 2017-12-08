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
        h('circle', {
            cx: 200,
            cy: 250,
            r: 153,
            fill: '#fff',
            stroke: '#f5f5f5',
            strokeWidth: 1,
        }),
        h(TimeView, { time: props.timeLeft }),
        h(VolumeView, { volume: props.volume }),
        h(Sections, { sections: props.sections }),

        props.sectionType && h(SectionTimeView, {
            timeLeft: props.sectionLeft,
            duration: props.sectionDuration,
            icon: props.sectionType,
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