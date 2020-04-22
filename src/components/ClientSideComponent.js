import * as React from 'react';

export class ClientSideComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            module: null,
        };
    }

    // after the initial render, wait for module to load
    // componentDidMount is executed only on client, so no need to identify ssr
    async componentDidMount() {
        const {resolve} = this.props;
        const {default: module} = await resolve();
        this.setState({module});
    }

    render() {
        const {resolve, ...props} = this.props;
        const {module} = this.state;

        if (!module) {
            return <div>Loading module...</div>;
        }

        if (module) {
            return React.createElement(module, props);
        }

        return null;
    }
}
