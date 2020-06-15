import React from "react";

import KeypadRow from "./KeypadRow/KeypadRow";

const Keypad = ({ onButtonPress }) => {
  return(
    <section className="keypad">
      <KeypadRow
        inputs={["C", "←", "%", "/"]}
        types={["primary", "primary", "operator", "operator"]}
        onButtonPress={onButtonPress}
        classes={[]}
      />

      <KeypadRow 
        inputs={["9", "8", "7", "*"]}
        types={[,,,"operator"]}
        classes={[,,,"button__side"]}
        onButtonPress={onButtonPress}
      />

      <KeypadRow 
        inputs={["6", "5", "4", "-"]}
        types={[,,,"operator"]}
        classes={[,,,"button__side"]}
        onButtonPress={onButtonPress}
      />

      <KeypadRow
        inputs={["3", "2", "1", "+"]}
        types={[,,,"operator"]}
        classes={[,,,"button__side"]}
        onButtonPress={onButtonPress}
      />

      <KeypadRow 
        inputs={["0", ".", "="]}
        types={[,,"large"]}
        classes={[,,"button__side"]}
        onButtonPress={onButtonPress}
      />

    </section>
  );
};

export default Keypad;
