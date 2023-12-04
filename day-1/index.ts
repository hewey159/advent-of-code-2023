import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";

const isNumber = (value: string) => {
  return !isNaN(parseInt(value));
};

const stringToArray = (str: string): string[] => {
  return str.split("");
};

const keepOnlyNumbers = (arr: string[]): O.Option<string[]> =>
  pipe(
    arr,
    A.filter(isNumber),
    O.fromPredicate((x) => x.length > 0) // if empty return none
  );

const getLeftValue = (arr: string[]): O.Option<string> => {
  return pipe(arr, A.head);
};

const getRightValue = (arr: string[]): O.Option<string> => {
  return pipe(arr, A.last);
};

const joinStringsToNumber = (input_str: string): number => {
  return pipe(input_str, (x) => parseInt(x));
};

const getNumberFromRandomString = (input_str: string) => {
  return pipe(
    input_str,
    stringToArray,
    keepOnlyNumbers, //removes all non numbers
    O.bindTo("input_arr"),
    O.bind("left_value", ({ input_arr }) => getLeftValue(input_arr)),
    O.bind("right_value", ({ input_arr }) => getRightValue(input_arr)),
    O.map(({ left_value, right_value }) =>
      joinStringsToNumber(left_value + right_value)
    ),
    O.getOrElse(() => -1) // probably should;ve done an either here... oh well
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
    //sums up the nums
    A.reduce(
      0,
      (acc: number, curr: string) => acc + getNumberFromRandomString(curr)
    )
  );
};

console.log(run());
