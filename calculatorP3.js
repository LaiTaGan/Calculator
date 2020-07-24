const calculate = (n1, operator, n2) => {
  // ──────────────────────────────────── Early Return───────────────────────────────
  //step 1: replace all of 'else if' by 'if' & replace all of 'result=' by 'return'
  //step 2: create new constant and change replace 'parseFloat' with 'firstNum'
  //step 3: remove all the curly brackets (b'cos we have one statement per 'if')
  //step 4: remove unecessary constant and return
  // ────────────────────────────────────────────────────────────────────────────────
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === "add") return firstNum+ secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
};

const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract"||
    action === "multiply" ||
    action === "divide"
  ) 
  return "operator";
  // For everything else, return the action
  return action;
};

const createResultString=(key,displayedNum,state)=>{
  // ───────────────────────────────Destructing refactor─────────────────────────────────────────────────
  const keyContent=key.textContent;
  const keyType = getKeyType(key);
  const {firstValue, modValue, operator,previousKeyType}=state;
  // ────────────────────────────────────────────────────────────────────────────────
  //change all "action" to keyType
  if (keyType=== "number") {//variable: 
  // 1.displayedNum
  // 2.perviousKeyType
  // 3.keyContent
  // 4.action

  //ternary Operator
  return displayedNum === "0"|| 
    previousKeyType === "operator"||
    previousKeyType === "calculate"
    ? keyContent
    : displayedNum + keyContent;
  console.log("number key!");
  }

  //try the refactor with ternary operator if the expected result not found
  if(keyType === "decimal"){//variable:
    //  1.displayNum
    //  2.perviousKeyType
    //  3.action
    //  4.keyContent
    
    //early return
    if (!displayedNum.includes(".")) 
    return displayedNum + "."
    if (previousKeyType === "operator" ||
    previousKeyType === 'calculate') 
      return '0.'
    return displayedNum
    // replace the display.textContent with value returned from createResultString. 
    //If missed it, createResultString will return undefined
  }

  if (keyType=== "operator") { // Variables & properties required are:
    // 1. keyContent
    // 2. displayedNum
    // 3. previousKeyType
    // 4. action
    // 5. calculator.dataset.firstValue
    // 6. calculator.dataset.operator
    
    //ternaty operator
    return firstValue && 
      operator &&
      previousKeyType !== "operator"&&
      previousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
    console.log('operator key!');
  }

  if (keyType === "clear") return 0;

  if (keyType === "calculate") {
    return firstValue
      //ternary Operator
    ? previousKeyType === "calculate"
      ? calculate(displayedNum, operator, modValue)
      : calculate(firstValue, operator, displayedNum)
    :displayedNum;
    console.log("equal key!");
  }
  
  // ─────────────────────────────all variables and properties required in action and !action above ───────────────────────────────────────────────
  // 1.displayedNum
  // 2.perviousKeyType
  // 3.keyContent
  // 4.action.
  // 5.calculator.dataset.firstValue
  // 6.calculator.dataset.operator
  // 7.calculator.dataset.modValue
  // ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

};

const updateCalculatorState = (
  // impure function that changes the calculator's visual appearance and custom attributes.
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  //for all calculator.dataset.previousKeyType
  const keyType = getKeyType(key)
  const {
    previousKeyType,
    firstValue,
    modValue,
    operator
  }=calculator.dataset;

  calculator.dataset.previousKeyType = keyType
  
  if (keyType === "operator") { 
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = 
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculatedValue
      : displayedNum
  }
  
  if (keyType === "clear" && key.textContent === "AC") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.previousKeyType = "";
  } 
  
  if (keyType === "calculate" ){ 
    calculator.dataset.modValue = 
    firstValue && previousKeyType === "calculate"
    ? modValue
    : displayedNum
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach((k) => 
  k.classList.remove("is-depressed"))
  ;
  
  if (keyType === "operator") key.classList.add("is-depressed")
  if (keyType === "clear" && key.textContent !== "AC") key.textContent = "AC"
  if (keyType !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "CE";
  }
}

const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator__display");
const keys = calculator.querySelector(".calculator__keys");

keys.addEventListener("click", (press) => {
  if (!press.target.matches("button"))return;
  const key=press.target
  const displayedNum=display.textContent
  //Pure Function,resultString that returns what needs to be displayed on the calculator
  const resultString=createResultString(
    key,
    displayedNum,
    calculator.dataset
  )
  //Impure Stuff,updateCalculatorState that changes the calculator's visual appearance and custom attributes.
  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});