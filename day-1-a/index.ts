import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";

const isNumber = (value: string) => {
  return !isNaN(parseInt(value));
};

const stringToArray = (str: string): string[] => str.split("");

const keepOnlyNumbers = (arr: string[]): O.Option<string[]> =>
  pipe(
    arr,
    A.filter(isNumber),
    O.fromPredicate((x) => x.length > 0) // if empty return none
  );

const getNumberFromWeirdString = (input_str: string) => {
  return pipe(
    input_str,
    stringToArray,
    keepOnlyNumbers, //removes all non numbers
    O.bindTo("input_arr"),
    O.bind("left_value", ({ input_arr }) => A.head(input_arr)),
    O.bind("right_value", ({ input_arr }) => A.last(input_arr)),
    O.map(({ left_value, right_value }) => parseInt(left_value + right_value)),
    O.getOrElse(() => 0)
  );
};

const readInput = (path: string): string[] => {
  const text = fs.readFileSync(path).toString("utf-8");
  return text.split("\n");
};

const run = () => {
  return pipe(
    "./input.txt",
    readInput,
    A.reduce(
      0,
      (acc: number, curr: string) => acc + getNumberFromWeirdString(curr)
    )
  );
};

console.log(run());
