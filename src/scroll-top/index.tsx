import * as React from 'react';

export type Props<T> = T & {
    onScrollAttach : () => void;
    onScrollUnattach : () => void;
}

export type State = {
    attached : boolean
}

export function ScrollTop<P>(Element : ((props : P) => any)) : React.ComponentClass<Props<P>>;
export function ScrollTop<P>(Element : string) : React.ComponentClass<Props<P>>;
export function ScrollTop<P>(Element : React.SFC<P>) : React.ComponentClass<Props<P>>;
export function ScrollTop<P>(Element : React.ComponentClass<P>) : React.ComponentClass<Props<P>>;
export function ScrollTop<P>(Element) : React.ComponentClass<Props<P>> {
    return class extends React.Component<Props<P>, State> {

        private const parentStyle = {}
        private const childUnattachedStyle = {}
        private const childAttachedStyle = {
            top: '0px',
            left: '0px',
            width: '100%',
            position: 'fixed',
        }

        private parent : HTMLDivElement
        private child : HTMLDivElement

        constructor(props) {
            super(props);

            this.state = {
                attached : false,
            }

            this.handleScroll = this.handleScroll.bind(this);
        }

        handleScroll() {
            let top = this.parent.getBoundingClientRect().top
            
            this.setState({
                attached: top <= 0,
            })
        }

        componentWillUpdate(nextProps : Props<P>, nextState : State) {
            if (this.state.attached != nextState.attached) {
                if (nextState.attached) this.props.onScrollAttach && this.props.onScrollAttach()
                else this.props.onScrollUnattach && this.props.onScrollUnattach()
            }
        }

        componentWillMount() {
            window.addEventListener("scroll", this.handleScroll);
        }

        componentWillUnmount() {
            window.removeEventListener("scroll", this.handleScroll);        
        }

        render() {
            let parentStyle = {
                ...this.parentStyle,
                height: this.child ? this.child.offsetHeight + 'px' : 'auto',   
            };

            let childStyle = this.state.attached 
                ? this.childAttachedStyle 
                : this.childUnattachedStyle;

            return (
                <div ref={(elem : HTMLDivElement) => this.parent = elem} style={parentStyle}>
                    <div ref={(elem : HTMLDivElement) => this.child = elem} style={childStyle}>
                        <Element {...this.props} />
                    </div>
                </div>
            );
        }
    }
}

export default ScrollTop