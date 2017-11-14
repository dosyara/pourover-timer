const { Component } = require('react');
const h = require('react-hyperscript');

class CupsSelector extends Component {
    render() {
        return h('div.CupsSelector', null, [...Array(this.props.total)].map((_, i) =>
                h(Cup, { key: i, cup: i + 1, isSelected: i < this.props.cups })
            )
        );
    }
}

class Cup extends Component {
    render() {
        return h(`span.Cup${this.props.isSelected ? '.Cup--selected' : ''}`, 'Cup');
    }
}

module.exports = { CupsSelector };