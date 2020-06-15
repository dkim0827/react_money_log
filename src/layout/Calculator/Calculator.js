import React, { useState } from "react";

import Screen from "./Screen/Screen";
import Keypad from "./Keypad/Keypad";
import "./Calculator.css";

const Calculator = () => {
  let [equation, setEquation] = useState("");
  const [result, setResult] = useState(0);

  const onButtonPress = event => {
    const pressedButton = event.target.innerHTML;

    switch(true) {
      case pressedButton === "C":
        return clear();
      case pressedButton >= "0" && pressedButton <= "9" || pressedButton === ".":
        return setEquation(equation + pressedButton);
      case ["+", "-", "*", "/", "%"].indexOf(pressedButton) !== -1:
        return equation += " " + pressedButton + " ";
      case pressedButton === "=":
        try {
          const evalResult = eval(equation);
          result === Number.isInteger(evalResult) ? setResult(evalResult) : setResult(evalResult.toFixed(2));
        } catch (error) {
          alert("Invalid Mathematical Equation");
        };
        break;
      default:
        return setEquation(equation.trim().substr(0, equation.length - 1));
    };
  };

  const clear = () => {
    setEquation("");
    setResult(0);
  };

  return (
    <main className="calculator">
      <Screen equation={equation} result={result} />
      <Keypad onButtonPress={onButtonPress} />
    </main>
  );
};

export default Calculator;
