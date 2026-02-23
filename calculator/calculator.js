document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    
    let currentInput = '';
    let previousInput = '';
    let operator = null;
    let shouldResetDisplay = false;

    // Initialize display
    display.value = '0';

    // Add click event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.dataset.value;
            
            if (value !== undefined) {
                handleInput(value);
            }
        });
    });

    // Handle equals button
    equalsButton.addEventListener('click', function() {
        calculate();
    });

    // Handle clear button
    clearButton.addEventListener('click', function() {
        clearCalculator();
    });

    // Handle keyboard input
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Numbers (0-9)
        if (/[0-9]/.test(key)) {
            event.preventDefault();
            handleInput(key);
        }
        
        // Operators
        if (['+', '-', '*', '/'].includes(key)) {
            event.preventDefault();
            handleOperator(key);
        }
        
        // Decimal point
        if (key === '.') {
            event.preventDefault();
            handleInput('.');
        }
        
        // Enter key (calculate)
        if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        }
        
        // Escape key (clear)
        if (key === 'Escape' || key === 'c' || key === 'C') {
            event.preventDefault();
            clearCalculator();
        }
        
        // Backspace (delete last character)
        if (key === 'Backspace') {
            event.preventDefault();
            deleteLastCharacter();
        }
    });

    function handleInput(value) {
        if (shouldResetDisplay) {
            display.value = '';
            shouldResetDisplay = false;
        }
        
        if (value === '.') {
            // Prevent multiple decimal points
            if (display.value.includes('.')) {
                return;
            }
            // If display is empty, add '0.'
            if (display.value === '' || display.value === '0') {
                display.value = '0.';
                currentInput = '0.';
                return;
            }
        }
        
        // Update display
        if (display.value === '0' && value !== '.') {
            display.value = value;
        } else {
            display.value += value;
        }
        
        currentInput = display.value;
    }

    function handleOperator(op) {
        if (operator !== null) {
            calculate();
        }
        
        previousInput = display.value;
        operator = op;
        shouldResetDisplay = true;
    }

    function calculate() {
        if (operator === null || shouldResetDisplay) {
            return;
        }
        
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) {
            return;
        }
        
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    display.value = 'Error';
                    setTimeout(clearCalculator, 1000);
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Handle decimal places
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result.toString();
        currentInput = result.toString();
        operator = null;
        shouldResetDisplay = true;
    }

    function clearCalculator() {
        display.value = '0';
        currentInput = '';
        previousInput = '';
        operator = null;
        shouldResetDisplay = false;
    }

    function deleteLastCharacter() {
        if (display.value.length > 1) {
            display.value = display.value.slice(0, -1);
            currentInput = display.value;
        } else {
            display.value = '0';
            currentInput = '';
        }
    }

    // Additional functionality: Prevent multiple operators
    const operatorButtons = document.querySelectorAll('.operator');
    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const op = this.dataset.value;
            handleOperator(op);
        });
    });
});