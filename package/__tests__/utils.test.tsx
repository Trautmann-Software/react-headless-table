import { dateToNumber, defined, equals, noop } from '../src/utils';

test('utils noop', async () => {
  expect(noop()).toBeUndefined();
});

test('utils defined', async () => {
  expect(defined(null)).toBeFalsy();
  expect(defined(undefined)).toBeFalsy();
  expect(defined(true)).toBeTruthy();
  expect(defined('')).toBeTruthy();
  expect(defined(0)).toBeTruthy();
  expect(defined({})).toBeTruthy();
});

test('utils equals', async () => {
  expect(equals([], ['abc', 'xyz'])).toBeFalsy();
  expect(equals(['abc', 'xyz'], [])).toBeFalsy();
  expect(equals(['abc', 'xyz'], ['xyz', 'abc'])).toBeFalsy();
  expect(equals(['abc', 'xyz'], ['abc', 'xyz'])).toBeTruthy();
});

test('utils dateToNumber', async () => {
  // A.D.
  expect(dateToNumber(new Date('2022-01-01'))).toBe(2022_01_01);
  expect(dateToNumber(new Date('2022-12-31'))).toBe(2022_12_31);
  expect(dateToNumber(new Date('0500-01-01'))).toBe(500_01_01);
  expect(dateToNumber(new Date('0500-12-31'))).toBe(500_12_31);
  expect(dateToNumber(new Date('0000-01-01'))).toBe(1_01);
  expect(dateToNumber(new Date('0000-12-31'))).toBe(12_31);
  // B.C.
  expect(dateToNumber(new Date('-000001-01-01'))).toBe(-1_01_01);
  expect(dateToNumber(new Date('-000001-12-31'))).toBe(-1_12_31);
  expect(dateToNumber(new Date('-012000-01-01'))).toBe(-12000_01_01);
  expect(dateToNumber(new Date('-012000-12-31'))).toBe(-12000_12_31);
});
