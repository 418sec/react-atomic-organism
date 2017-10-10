import React from 'react'; 
import {
    mixClass,
    SemanticUI,
    List
} from 'react-atomic-molecule';

const SearchBox = ({results, ...props}) =>
{
    const classes = mixClass (
        props.className,
        'search'
    );
    if (results) {
        results = (
            <List type="results">
                {results.map((item)=>
                    <SemanticUI className="result">{item}</SemanticUI>
                )}
            </List>
        );
    }
    return (
      <SemanticUI {...props}
        className={classes}
      >
        <SemanticUI atom="input" className="prompt" type="text" />
        {results}
      </SemanticUI>
    );
}

export default SearchBox;