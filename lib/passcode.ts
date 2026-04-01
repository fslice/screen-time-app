import crypto from "crypto";

/**
 * Pool of 20 pre-selected Screen Time passcodes.
 * Avoids obvious patterns (sequential, repeated, common PINs).
 */
const PASSCODE_POOL = [
  "3847", "5921", "7263", "4618", "8352",
  "6194", "2738", "9471", "1629", "8543",
  "3976", "7215", "4863", "5197", "6482",
  "9134", "2856", "7349", "1587", "4625",
];

export function generatePasscode(): string {
  return PASSCODE_POOL[crypto.randomInt(0, PASSCODE_POOL.length)];
}

interface MathProblem {
  expression: string;
  answer: number;
}

/**
 * Converts a single digit (0-9) into a math problem whose answer is that digit.
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
    return { expression: `${digit + offset} \u2212 ${offset}`, answer: digit };
  } else {
    // Multiplication or subtraction fallback
    if (digit === 0)
      return {
        expression: `0 \u00d7 ${crypto.randomInt(2, 10)}`,
        answer: 0,
      };

    const factors: [number, number][] = [];
    for (let i = 2; i <= digit; i++) {
      if (digit % i === 0) factors.push([i, digit / i]);
    }
    if (factors.length > 0) {
      const [a, b] = factors[crypto.randomInt(0, factors.length)];
      return { expression: `${a} \u00d7 ${b}`, answer: digit };
    }
    const offset = crypto.randomInt(1, 11);
    return { expression: `${digit + offset} \u2212 ${offset}`, answer: digit };
  }
}

// ── Operation sequence types ──────────────────────────────────

export type PasscodeOperation =
  | { type: "digit"; expression: string; answer: number; position: number }
  | { type: "delete"; position: number };

export interface PasscodeSequences {
  enter: PasscodeOperation[];
  confirm: PasscodeOperation[];
}

/**
 * Builds an operation sequence that, when followed, results in the given passcode.
 * Mixes in 2-3 delete operations at random points to add confusion.
 *
 * `position` tracks which digit slot (0-3) the user should be on AFTER executing
 * that operation.
 */
function buildOperationSequence(passcode: string): PasscodeOperation[] {
  const digits = passcode.split("").map((ch) => parseInt(ch, 10));
  const ops: PasscodeOperation[] = [];

  // Decide where to insert deletes: after digit index 0, 1, or 2
  // We'll insert 2-3 deletes
  const deleteCount = crypto.randomInt(2, 4);
  const deleteAfter = new Set<number>();
  while (deleteAfter.size < Math.min(deleteCount, 3)) {
    deleteAfter.add(crypto.randomInt(0, 3)); // after entering digit 0, 1, or 2
  }

  let currentPos = 0;

  for (let i = 0; i < 4; i++) {
    // Enter the real digit
    const problem = digitToMathProblem(digits[i]);
    ops.push({
      type: "digit",
      expression: problem.expression,
      answer: problem.answer,
      position: currentPos,
    });
    currentPos++;

    // Maybe insert a decoy digit + delete after this position
    if (deleteAfter.has(i) && i < 3) {
      // Add a decoy digit (random, different from actual next digit)
      let decoy = crypto.randomInt(0, 10);
      if (i + 1 < 4) {
        while (decoy === digits[i + 1]) {
          decoy = crypto.randomInt(0, 10);
        }
      }
      const decoyProblem = digitToMathProblem(decoy);
      ops.push({
        type: "digit",
        expression: decoyProblem.expression,
        answer: decoyProblem.answer,
        position: currentPos,
      });
      currentPos++;

      // Then delete
      currentPos--;
      ops.push({ type: "delete", position: currentPos });
    }
  }

  // Re-calculate positions as a running cursor for the UI
  let cursor = 0;
  for (const op of ops) {
    op.position = cursor;
    if (op.type === "digit") {
      cursor++;
    } else {
      cursor = Math.max(0, cursor - 1);
    }
  }

  return ops;
}

/**
 * Generates two different operation sequences for the same passcode.
 * First for "enter", second for "confirm". Different math, different delete placement.
 */
export function generatePasscodeSequences(passcode: string): PasscodeSequences {
  return {
    enter: buildOperationSequence(passcode),
    confirm: buildOperationSequence(passcode),
  };
}

/**
 * Legacy: returns flat math problems (one per digit, no deletes).
 */
export function passcodesToMathProblems(passcode: string): MathProblem[] {
  return passcode.split("").map((ch) => digitToMathProblem(parseInt(ch, 10)));
}
