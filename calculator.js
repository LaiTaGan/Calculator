//create a calculator function

const calculate = (n1, operator, n2) => {
  let result = ""
  //parseInt converts a string into an integer.
  //parseFloat converts a string into a float (this means a number with decimal places).
  //use the parseFloat to prevent the add of string found the concatenate (e.g: 5+5=55 error).  
  if (operator === "add") {
    result = parseFloat(n1) + parseFloat(n2)
  } else if (operator === "subtract") {
    result = parseFloat(n1) - parseFloat(n2)
  } else if (operator === "multiply") {
    result = parseFloat(n1) * parseFloat(n2)
  } else if (operator === "divide") {
    result = parseFloat(n1) / parseFloat(n2)
  }  
  return result;
};

//create the event target like below
const calculator = document.querySelector(".calculator");
//ensure target in calculator key nor calculator display
const display = calculator.querySelector(".calculator__display");
//ensure target in calculator
const keys = calculator.querySelector(".calculator__keys");

/*eventTarget.addEventListener('js event',function|eventName)
function(press|eventName){return}
arrow funtion press is function name,arrow symbol is return */
keys.addEventListener("click", press => { 
  if (press.target.matches("button")) {
    //The target event property returns the element that triggered the event
    const action = press.target.dataset.action; 
    /*
    press(event).target=keys
    dataset action is used for determine type of button refer to html files
    the "data action" button have set as operator, equal, and Ac. 
    */
    const keyContent = press.target.textContent;//key textContent "0-9,operator"
    const displayedNum = display.textContent;//display textContent"0"
    const previousKeyType = calculator.dataset.previousKeyType;
   

    
    if (!action) {
      console.log("number key!")//In "!action", that is a number!
      if (displayedNum === "0"|| 
      previousKeyType === "operator"||
      previousKeyType === "calculate"
      ) {
        display.textContent = keyContent;
      }else {
        display.textContent = displayedNum + keyContent;
      }
      calculator.dataset.previousKeyType="number";//make sure previouskeyType is number
    }



    if(action === "decimal"){
      console.log('decimal key!');
      if (!displayedNum.includes(".")) {//use the includes for avoid the used doubles click the decimals
        display.textContent = displayedNum + ".";
      } if (previousKeyType ==="operator"||
      previousKeyType === "calculate"){//this section for the previouskey is operator, the display will get 0. when decimal key clicked 
        display.textContent="0.";
      } //have edit from else if to if (highlight above)
      calculator.dataset.previousKeyType="decimal";//make sure previousKeype is decimal
    }


  
    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ){
    console.log('operator key!');

    const firstValue = calculator.dataset.firstValue
    const operator = calculator.dataset.operator
    const secondValue = displayedNum
    
    // Note: It's sufficient to check for firstValue and operator because secondValue always exists
    if (firstValue && 
      operator &&
      previousKeyType !== "operator"&&//To prevent performing a calculation on subsequent clicks on the operator key
      previousKeyType !== "calculate"
      //to prevent the calculator directly calculate with previousValue(1st//2nd value) after user completed 1 time of calculation & clicked the operator key
      ) {
      const calcValue=calculate(firstValue, operator, secondValue);
      display.textContent = calcValue;
      calculator.dataset.firstValue=calcValue// Update calculated value as firstValue
    }
    else{
      // If there are no calculations, set displayedNum as the firstValue
      calculator.dataset.firstValue=displayedNum
    }

    press.target.classList.add("is-depressed");//add class from Css 
    calculator.dataset.previousKeyType = "operator";//a way to tell if the previous key is an operator key in next time (write into custom attribute)
    // Remove .is-depressed class from all keys
    //The Array.from() method returns an Array object from any object with a length property or an iterable object.
    //The forEach() method calls a function once for each element in an array, in order.
    Array.from(press.target.parentNode.children).forEach(releaseButton => 
    releaseButton.classList.remove("is-depressed"));
    //parent node is <div class="calculator__keys">
    //children is all <button>
    //!action is number key   
    calculator.dataset.operator = action//custom attribute to store the operator
    }



    if (action === "clear") {
      console.log("clear key!")
      if (press.target.textContent==="AC"){
        calculator.dataset.firstValue="";
        calculator.dataset.operator="";
        calculator.dataset.modValue="";
        calculator.dataset.previousKeyType="";
      }else{
        press.target.textContent="AC";
      }
      display.textContent = 0;//if action is clear the display is equal to zero
      calculator.dataset.previousKeyType="clear";//make sure previouskeytype is clear
    }

    if(action !=="clear"){
      //All Clear (AC) clears everything and resets the calculator to its initial state.
      //Clear entry (CE) clears the current entry. It keeps previous numbers in memory.
      const clearButton = calculator.querySelector("[data-action=clear]");
      //Above part by checking if the data-action is clear. If it’s not clear, we look for the clear button and change its textContent like below
      clearButton.textContent = "CE";
    }


    
    if (action === "calculate") {
      console.log("equal key!");
      let firstValue = calculator.dataset.firstValue//for the formula below
      const operator = calculator.dataset.operator//for the formula below
      let secondValue = displayedNum;//for the formula below (it will be same to the 1st Num if the 2nd numb is blank)

      
      if(firstValue){
        if(previousKeyType === "calculate"){
          firstValue = displayedNum
          secondValue = calculator.dataset.modValue //custom attribute modValue (stands for modifier value).
          //using the modifier value for continuous apply operator when the "equal" key have mutiple clicked
          //example 5-1=4=3=2=1=1=0=-1
        }
        display.textContent = calculate(firstValue, operator, secondValue)
      }

      calculator.dataset.modValue=secondValue;
      //the previous 2nd value will be save into mod and it will be used for next calculation if user clicked mutiple times of "calculate"
      calculator.dataset.previousKeyType="calculate";//make sure previouskeytype is calculate
    }    
  }
}
)
