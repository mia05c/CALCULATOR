//Creates an object to keep track of values
const calculator = {
    //this displays 0 on the screen
    Display_Value: '0',
    //This will hold the first operand for any expressions, we set it to null for now
    First_Operand: null,
    Wait_Second_Operand: false,
    operator: null,
};

//This modifies values each time a button is clicked
function Input_Digit(digit) {
    const { Display_Value, Wait_Second_Operand } = calculator;
    //We are checking to see if Wait_Second_Operand is true and set Display_Value to the keys that was clicked
    if(Wait_Second_Operand === true) {
        calculator.Display_Value = digit;
        calculator.Wait_Second_Operand = false;
    } else {
        //this overwrites Display_Value if the current value is 0, otherwise it adds onto it
        calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
    }
}

//This section handles decimal points
function Input_Decimal(dot) {
    //This ensures that accident clicking of the decimal point
    if(calculator.Wait_Second_Operand === true) return;
    if(!calculator.Display_Value.includes(dot)) {
        calculator.Display_Value += dot;
    }
}

//This section handles operators
function Handle_Operator(Next_Operator) {
    const { First_Operand, Display_Value, operator } = calculator;
    //When an operator keys is pressed, we convert he current number displayed on the screne to a number and then store the result in Calculator.First_Operand if it doesn't already exist
    const Value_of_Input = parseFloat(Display_Value);
    //checks if an operator already exists and if Wait_Second_Operand is true, then updates the operator and exits from the function
    if(operator && calculator.Wait_Second_Operand) {
        calculator.operator = Next_Operator;
        return;
    }
    if(First_Operand == null) {
        calculator.First_Operand = Value_of_Input;
    } else if (operator) { //checks if an operator already exists
        const Value_Now = First_Operand || 0;
        //if operator exists, property lookup is performed for the operator in the Perform_Calculation object and the function that matches the operator is executed
        let result = Perform_Calculation[operator] (Value_Now, Value_of_Input);
        result = Number(result).toFixed(9);
        result = (result * 1).toString();
        calculator.Display_Value = parseFloat(result);
        calculator.First_Operand = parseFloat(result);
    }

    calculator.Wait_Second_Operand = true;
    calculator.operator = Next_Operator;
}

const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
    '=': (First_Operand, Second_Operand) => Second_Operand
};

function Calculator_Reset() {
    calculator.Display_Value = '0';
    calculator.First_Operand = null;
    calculator.Wait_Second_Operand = false;
    calculator.operator = null;
}

//This function updates the screen with the content of Display_Value
function Update_Display() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.Display_Value;
}

Update_Display();

//This section monitors button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    //The target variable is an object that represents the element that was clicked
    const { target } = event;

    if(!target.matches('button')) {
        return;
    }

    if(target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }

    if(target.classList.contains('decimal')) {
        Input_Decimal(target.value);
        Update_Display;
        return;
    }


    if(target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }

    Input_Digit(target.value);
    Update_Display();
})