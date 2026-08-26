#include <stdio.h>

double add(double a, double b);
double subtract(double a, double b);
double multiply(double a, double b);
double divide(double a, double b, int *success);

int main(void) {
    double num1, num2, result;
    char op;
    char again = 'y';

    while (again == 'y' || again == 'Y') {
        printf("Enter first number: ");
        scanf("%lf", &num1);
        printf("Enter an operator (+, -, *, /): ");
        scanf(" %c", &op);
        printf("Enter second number: ");
        scanf("%lf", &num2);

        int success = 1; // Flag to check for division by zero
        switch (op) {
            case '+':
                result = add(num1, num2);
                break;
            case '-':
                result = subtract(num1, num2);
                break;
            case '*':
                result = multiply(num1, num2);
                break;
            case '/':
                result = divide(num1, num2, &success);
                if (!success) {
                    printf("Error: Division by zero is not allowed.\n");
                    continue; // Skip the rest of the loop and ask for input again
                }
                break;
            default:
                printf("Error: Invalid operator.\n");
                continue; // Skip the rest of the loop and ask for input again
        }

        printf("Result: %.2lf\n", result);
        printf("Do you want to perform another calculation? (y/n): ");
        scanf(" %c", &again);
    }
    return 0;
}

double add(double a, double b) {
    return a + b;
}

double subtract(double a, double b) {
    return a - b;
}

double multiply(double a, double b) {
    return a * b;
}

double divide(double a, double b, int *success) {
    if (b == 0) {
        *success = 0;
        return 0;
    }
    *success = 1;
    return a / b;
}