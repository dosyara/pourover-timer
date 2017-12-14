const { createStore, applyMiddleware } = require('redux/dist/redux.min');
const thunk = require('redux-thunk/dist/redux-thunk.min').default;

const { MS } = require('./constants');

function reducer(state = { isRunning: false, done: false }, action) {
    switch (action.type) {
        case 'INIT': {
            return Object.assign({}, state, {
                sectionType: null,
                isRunning: false,
                done: false,
            });
        }
        case 'TOUCH_START':
            return Object.assign({}, state, {
                isTouched: true,
            });
        case 'TOUCH_END':
            return Object.assign({}, state, {
                isTouched: false,
            });
        case 'START':
            return Object.assign({}, state, {
                isRunning: true,
            });
        case 'RESET':
            return Object.assign({}, state, {
                sectionType: null,
                isRunning: false,
                done: false,
            });
        case 'DONE':
            return Object.assign({}, state, {
                sectionType: null,
                isRunning: false,
                done: true,
            });
        case 'SET_TYPE': {
            return Object.assign({}, state, {
                type: action.payload.type,
            });
        }
        case 'SET_CUPS':
            return Object.assign({}, state, {
                cups: action.payload.cups,
            });
        case 'SET_RECIPE': {
            const { type, cups } = action.payload;
            const recipe = getRecipe({ type, cups });
            const { water, duration } = getMeasures(recipe);

            let sectionEnd = 0;
            return Object.assign({}, state, {
                type: type,
                cups: cups,

                duration: duration,
                water: water,
                coffee: recipe.coffee,

                sections: recipe.instructions.map(instruction => {
                    const sectionStart = sectionEnd;
                    const sectionDeg = (instruction.duration * MS / duration) * 360;
                    sectionEnd += sectionDeg;

                    return Object.assign({}, instruction, {
                        timeLeft: instruction.duration * MS,
                        deg: sectionDeg,
                        start: sectionStart,
                        end: sectionEnd
                    });
                }),
                timeLeft: duration,
                volume: 0,
            });
        }
        case 'TICK':
            const totalTimePast = action.payload.timePast;
            let timePast = action.payload.timePast;
            let addVolume = 0;
            let sectionType = '';
            let sectionLeft = 0;
            let sectionDuration = 0;

            if (!state.isRunning) return state;

            return Object.assign({}, state, {
                sections: state.sections.map(section => {
                    let newTimeLeft;
                    let newStart;

                    if (section.timeLeft < timePast) {
                        newTimeLeft = 0;
                        timePast -= section.timeLeft;
                        newStart = section.end;
                        section.finished = true;

                        if (section.water) {
                            addVolume += (section.water / (section.duration * MS)) * section.timeLeft;
                        }
                    } else {
                        if (section.water) {
                            addVolume += (section.water / (section.duration * MS)) * timePast;
                        }
                        newTimeLeft = section.timeLeft - timePast;
                        if (newTimeLeft && timePast) {
                            sectionLeft = newTimeLeft;
                            sectionType = section.type;
                            sectionDuration = section.duration * MS;
                        }
                        newStart = section.end - (section.deg / (section.duration * MS)) * newTimeLeft;
                        timePast = 0;
                    }

                    return Object.assign({}, section, { timeLeft: newTimeLeft, start: newStart })
                }),
                volume: state.volume + addVolume,
                timeLeft: state.timeLeft - totalTimePast,
                sectionType,
                sectionLeft,
                sectionDuration,
            });
        case 'TIMER_START':
            return Object.assign({}, state, {
                _lastTick: action.payload.now,
            });
        case 'TIMER_STOP':
            return Object.assign({}, state, {
                _lastTick: 0,
            });
        case 'TIMER_TICK':
            return Object.assign({}, state, {
                _lastTick: action.payload.now,
            });
        default:
            return state;
    }
}

function getRecipe({ type, cups }) {
    switch (`${type}:${cups}`) {
        case 'v60:1':
            return {
                coffee: 16,
                instructions: [
                    { type: 'pour', water: 30, duration: 10 },
                    { type: 'wait', duration: 25 },
                    { type: 'pour', water: 110, duration: 30 },
                    { type: 'wait', duration: 50 },
                    { type: 'pour', water: 110, duration: 30 },
                    { type: 'wait', duration: 50 },
                ]
            };
    }
}

function getMeasures(recipe) {
    return recipe.instructions.reduce((measures, instruction) => {
        measures.water += instruction.water || 0;
        measures.duration += (instruction.duration || 0) * MS;

        return measures;
    }, { water: 0, duration: 0 });
}

// action creators
function makeInit({ type, cups }) {
    return (dispatch) => {
        dispatch({ type: 'INIT' });

        const startedAt = getFromLocalStorage('startedAt');

        if (startedAt) {
            dispatch(makeSetRecipe({ type, cups })); // todo: get data from localStorage
            dispatch(makeStart(startedAt));
        } else {
            dispatch(makeSetRecipe({ type, cups }));
        }
    };
}
function makeSetType({ type }) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_TYPE', payload: { type } });
        dispatch(makeSetRecipe({ type, cups: getState().cups }));
    };
}
function makeSetCups({ cups }) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_CUPS', payload: { cups } });
        dispatch(makeSetRecipe({ type: getState().type, cups }));
    };
}

function makeSetRecipe({ type, cups }) {
    return (dispatch) => {
        dispatch({ type: 'SET_RECIPE', payload: { type, cups } });
    };
}

function makeTick() {
    return (dispatch, getState) => {
        const now = Date.now();
        const state = getState();
        const timePast = now - state._lastTick;

        if (state.isRunning) {
            dispatch({ type: 'TIMER_TICK', payload: { now } });
            dispatch({ type: 'TICK', payload: { timePast } });
        }

        if (state.isRunning && state.timeLeft - timePast <= 0) {
            dispatch(makeDone());
            return;
        }

        if (state.isRunning) {
            window.requestAnimationFrame(() => {
                state.isRunning && dispatch(makeTick())
            });
        }
    };
}

function makeStart(now = Date.now()) {
    return (dispatch, getState) => {
        const state = getState();

        saveToLocalStorage('recipe', `${state.type}:${state.cups}`);
        saveToLocalStorage('startedAt', now);

        dispatch({
            type: 'TIMER_START',
            payload: {
                now: now
            }
        });
        dispatch({ type: 'START' });
        dispatch(makeTick());
    }
}

function makeReset() {
    return (dispatch, getState) => {
        const state = getState();

        dispatch(makeTimerStop());
        dispatch(makeSetRecipe({ type: state.type, cups: state.cups }));
        dispatch({ type: 'RESET' });
    };
}

function makeToggle() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.done) {
            dispatch(makeReset());
        } else {
            if (!state.isRunning) {
                dispatch(makeStart());
            } else {
                dispatch(makeReset());
            }
        }
    };
}

function makeDone() {
    return (dispatch) => {
        dispatch(makeTimerStop());
        dispatch({ type: 'DONE' });
    };
}

function makeTimerStop() {
    return (dispatch) => {
        removeFromLocalStorage('startedAt');

        dispatch({ type: 'TIMER_STOP' });
    }
}

function saveToLocalStorage(name, value) {
    try {
        localStorage.setItem(name, value);
    } catch (e) {
        console.log(`LocalStorage setItem error: ${e}`);
    }
}

function getFromLocalStorage(name) {
    try {
        return localStorage.getItem(name);
    } catch (e) {
        console.log(`LocalStorage getItem error: ${e}`);
    }
}

function removeFromLocalStorage(name) {
    try {
        localStorage.removeItem(name);
    } catch (e) {
        console.log(`LocalStorage removeItem error: ${e}`);
    }
}

let store = createStore(reducer, applyMiddleware(thunk));

module.exports = {
    store,
    actions: {
        makeInit,
        makeToggle,
        makeSetType,
        makeSetCups,
        makeSetRecipe,
        makeTick,
        makeStart,
        makeReset,
        makeDone,
        makeTimerStop,
    }
};
