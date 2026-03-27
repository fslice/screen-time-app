import crypto from "crypto";

/**
 * Generates a random 4-digit Screen Time passcode.
 */
export function generatePasscode(): string {
  const digits = [];
  for (let i = 0; i < 4; i++) {
    digits.push(crypto.randomInt(0, 10));
  }
  return digits.join("");
}

interface MathProblem {
  expression: string;
  answer: number;
}

/**
 * Converts a single digit (0-9) into a math problem whose answer is that digit.
 * Uses addition, subtraction, or multiplication to make it non-trivial.
 */
function digitToMathProblem(digit: number): MathProblem {
  const type = crypto.randomInt(0, 3);

  if (type === 0) {
    // Addition: a + b = digit
    const a = crypto.randomInt(0, digit + 1);
    const b = digit - a;
    return { expression: `${a} + ${b}`, answer: digit };
  } else if (type === 1) {
    // Subtraction: (digit + offset) - offset = digit
    const offset = crypto.randomInt(1, 11);
    return { expression: `${digit + offset} − ${offset}`, answer: digit };
  } else {
    // Multiplication (only for digits with nice factors)
    if (digit === 0) return { expression: `0 × ${crypto.randomInt(2, 10)}`, answer: 0 };
    if (digit === 1) return { expression: `${crypto.randomInt(2, 10)} − ${crypto.randomInt(1, 9)}`.replace(/(\d+) − (\d+)/, (_, a, b) => { const n = crypto.randomInt(2, 10); return `${n + 1} − ${n}`; }), answer: 1 };

    // For other digits, use subtraction as fallback if no clean factors
    const factors: [number, number][] = [];
    for (let i = 2; i <= digit; i++) {
      if (digit % i === 0) factors.push([i, digit / i]);
    }
    if (factors.length > 0) {
      const [a, b] = factors[crypto.randomInt(0, factors.length)];
      return { expression: `${a} × ${b}`, answer: digit };
    }
    const offset = crypto.randomInt(1, 11);
    return { expression: `${digit + offset} − ${offset}`, answer: digit };
  }
}

/**
 * Takes a 4-digit passcode and returns an array of math problems,
 * one per digit. The user must solve each to discover the passcode.
 */
export function passcodesToMathProblems(passcode: string): MathProblem[] {
  return passcode.split("").map((ch) => digitToMathProblem(parseInt(ch, 10)));
}
