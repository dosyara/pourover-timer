const { Timer } = require('../components/Timer');
const ReactDOM = require('react-dom');
const { store, actions } = require('../lib/time-store');
const h = require('react-hyperscript');

document.addEventListener('DOMContentLoaded', function() {
    store.dispatch(actions.makeInit({ type: 'v60', cups: 1 }));

    // document.querySelector('.app-root').innerHTML = '';
    ReactDOM.render(h(Timer, { store }), document.querySelector('.app-root'));
});