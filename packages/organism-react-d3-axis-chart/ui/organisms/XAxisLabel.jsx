import React from 'react'; 

import Group from '../molecules/Group';
import Rect from '../molecules/Rect';
import Text from '../molecules/Text';
import get from 'get-object-value';

const textWidth = 7.7;

const XAxisLabel = ({children, value, ...props}) =>
{
    let width = textWidth * get(children,['length'],0);
    let halfWidth = width / 2;
    if (value >= halfWidth) {
        value -= halfWidth;
    }
    return (
    <Group 
        className="crosshair-label-x"
        transform={`translate(${value}, 0)`}
        {...props}
    >
        <Rect
            fill="#454545"
            x="0"
            height="16.5"
            width={width}
        />
        <Text
            x="4"
            y="12"
            fill="#fff"
        >
            {children}
        </Text>
    </Group>
    );
};

export default XAxisLabel;
