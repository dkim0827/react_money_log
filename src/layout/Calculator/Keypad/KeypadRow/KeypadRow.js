import React from "react";

import Button from "../../../../components/Button/Button";
import LargeButton from "../../../../components/Button/LargeButton/LargeButton";

const KeypadRow = props => {
    const { inputs, types, classes, onButtonPress } = props;
    
    return(
        <div className="keypad__row">
            {inputs.map((input, index) => (
                types[index] === "large" ? 
                    (
                        <LargeButton
                            onButtonPress={onButtonPress}
                            className={classes[index]}
                        >
                            {input}
                        </LargeButton>
                    ) 
                :
                    (
                    <Button
                        types={types[index]}
                        onButtonPress={onButtonPress}
                        className={classes[index]}
                    >
                        {input}
                    </Button>
                    )
            ))
            }
        </div>
    );
};

export default KeypadRow;
