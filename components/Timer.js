const { Component } = require('react/cjs/react.production.min');
const h = require('react-hyperscript');

const {
    makeSetType,
    makeSetCups,
    makeToggle,
} = require('../lib/time-store').actions;

const { TimeFace } = require('./TimeFace');

class Timer extends Component {
    componentDidMount() {
        this.props.store.subscribe(() => {
            this.forceUpdate();
        });
    }

    render() {
        const { store } = this.props;
        const state = store.getState();

        return h('div.Timer', {}, [
            // todo TypeSelector
            false && h(CupsSelector, {
                cups: state.cups,
                total: 2
            }),
            h(TimeFace, {
                onClick: () => store.dispatch(makeToggle()),
                onTouchStart: () => store.dispatch({ type: 'TOUCH_START' }),
                onTouchEnd: () => store.dispatch({ type: 'TOUCH_END' }),
                sections: state.sections,

                timeLeft: state.timeLeft,
                volume: state.volume,

                isRunning: state.isRunning,
                done: state.done,

                isTouched: state.isTouched,

                sectionType: state.sectionType,
                sectionLeft: state.sectionLeft,
                sectionDuration: state.sectionDuration,
            }),
        ]);
    }
}

module.exports = { Timer };
