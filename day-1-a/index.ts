import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as fs from "fs";
import * as NEA from "fp-ts/NonEmptyArray";

const isNumber = (value: string) => {
  return !isNaN(parseInt(value));
};

const stringToArray = (str: string): string[] => str.split("");

const keepOnlyNumbers = (arr: string[]): O.Option<NEA.NonEmptyArray<string>> =>
  pipe(arr, A.filter(isNumber), NEA.fromArray);

const getNumberFromWeirdString = (input_str: string) => {
  return pipe(
    input_str,
    stringToArray,
    keepOnlyNumbers,
    O.map((input_arr) => parseInt(NEA.head(input_arr) + NEA.last(input_arr))),
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
