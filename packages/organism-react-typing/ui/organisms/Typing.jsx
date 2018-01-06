import React, {Component, PropTypes} from 'react';

import {
    lazyInject,
    reactStyle,
    SemanticUI 
} from 'react-atomic-molecule';

const getTypingNextWordAniClassName = (el, sec) => {
    const width = el.offsetWidth+ 70;
    const ssec = ''+sec;
    const aniName ='typingNextWord-'+width+'-'+ssec.replace('.','-'); 
    if (injects[aniName]) {
        return aniName;
    }
    reactStyle(
        [
            {
                maxWidth: 0,
            },
            {
                maxWidth: width
            },
        ],
        ['@keyframes '+aniName, '0%', '100%'],
        aniName+'-keyframe'
    );
    reactStyle(
        {
            animation: [aniName+ " "+ sec+ "s steps(10) infinite alternate"],
            visibility: "visible !important"
        }, 
        '.'+aniName, 
        aniName+'-ani'
    );
    injects[aniName] = true;
    return aniName;
};

class TypingItem extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            classes: null
        };
    }

    handleEl = (el) =>
    {
        this.setState((classes)=>{
            const next = getTypingNextWordAniClassName(el, this.props.sec);
            if (next !== classes) {
                return {classes: next};
            } else {
                return {};
            }
        });
    }
    
    render()
    {
        const {children, sec, background, ...others} = this.props;
        const {classes} = this.state;
        return (
           <SemanticUI {...others}> 
                <div
                    className={classes}
                    ref={this.handleEl}
                    style={Styles.typingItemText}
                >
                    {children} &nbsp;
                </div>
                <SemanticUI styles={injects.typingCursor}> | </SemanticUI>
           </SemanticUI>
        );
    }
}

class Typing extends Component
{
    static defaultProps = {
        height: 80,
        color: '#000',
        background: null,
        sec: 1.5,
        autoStart: true
    }

    constructor(props)
    {
        super(props);
        this.state = {
            typingItemStyles: null,
            isRun: props.autoStart
        };
        injects = lazyInject (
            injects,
            InjectStyles
        );
    }

    update(props)
    {
        if (!props) {
            props = this.props;
        }
        const itemLength = props.children.length;
        const height = parseInt(props.height, 10);
        const aniName = 'typingNextLine';
        const styleId = aniName+'-'+itemLength+'-'+height;
        const typingItemStyles = reactStyle({
            position: 'relative',
            animation: [styleId+ ' '+ ( itemLength * 2 * props.sec )+ 's steps('+itemLength+') infinite'],
            height: height
        },null, false);
        reactStyle([
            {top: 0},
            {top: 0 - ( height * itemLength )}
        ],['@keyframes '+styleId, '0%', '100%'], styleId);
        this.setState({ typingItemStyles });
    }

    componentDidMount()
    {
        this.update();
    }

    componentWillReceiveProps(nextProps)
    {
        this.update(nextProps);
    }

    start()
    {
        this.setState({
            isRun: true 
        })
    }

    stop()
    {
        this.setState({
            isRun: false 
        })
    }

    render()
    {
        const props = this.props;
        const {isRun, typingItemStyles} = this.state;
        let items = [];
        let atts = { 
            height:props.height,
            color:props.color
        };
        if (props.background) {
            atts.background = props.background;
        }
        if (isRun && typingItemStyles) { // need calculate offsetWidth
            React.Children.map(props.children,(item, key)=>{
                items.push(
                    <TypingItem
                        key={key}
                        sec={props.sec}
                        styles={typingItemStyles}
                        {...atts}
                    >
                        {item.props.children}
                    </TypingItem>
                );
            });
        }
        return (
            <SemanticUI
                style={{
                    ...Styles.typingContainer,
                    ...atts
                }}
            >
            {items}
            </SemanticUI>
        );
    }
}

export default Typing;

const Styles = {
    typingContainer: {
        overflow: 'hidden'
    },
    typingItemText: {
        display: "inline-block",
        overflow: "hidden",
        visibility: "hidden",
        whiteSpace: 'nowrap',
        paddingRight: 1,
        boxSizing: 'border-box'
    },
};

let injects;
const InjectStyles = {
    typingCursor: [{
        display: "inline-block",
        position: "relative",
        marginLeft: 5,
        top: 1,
        verticalAlign: "top",
        animation: ["typingBlink 1s infinite"]
    }],
    typingBlink: [[
        {
            opacity: "1" 
        },
        {
            opacity: "0"
        }
    ],['@keyframes typingBlink', '0%, 100%', '50%']]
};
