import { datetimeToNumber, dateToNumber, defined, equals, generateString, noop, timeToNumber } from '../src/utils';
import { Data } from './test-data';

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

//#region Date & Time
test('utils dateToNumber', async () => {
  // A.D.
  expect(dateToNumber(new Date('2022-01-01T11:22:33'))).toBe(2022_01_01);
  expect(dateToNumber(new Date('2022-12-31T11:22:33'))).toBe(2022_12_31);
  expect(dateToNumber(new Date('0500-01-01T11:22:33'))).toBe(500_01_01);
  expect(dateToNumber(new Date('0500-12-31T11:22:33'))).toBe(500_12_31);
  expect(dateToNumber(new Date('0000-01-01T11:22:33'))).toBe(1_01);
  expect(dateToNumber(new Date('0000-12-31T11:22:33'))).toBe(12_31);
  // B.C.
  expect(dateToNumber(new Date('-000001-01-01T11:22:33'))).toBe(-1_01_01);
  expect(dateToNumber(new Date('-000001-12-31T11:22:33'))).toBe(-1_12_31);
  expect(dateToNumber(new Date('-012000-01-01T11:22:33'))).toBe(-12000_01_01);
  expect(dateToNumber(new Date('-012000-12-31T11:22:33'))).toBe(-12000_12_31);
});

test('utils timeToNumber', async () => {
  // A.D.
  expect(timeToNumber(new Date('2022-01-01T11:22:33'))).toBe(11_22_33);
  expect(timeToNumber(new Date('2022-12-31T11:22:33.444'))).toBe(11_22_33);
  expect(timeToNumber(new Date('0500-01-01T11:22:33'))).toBe(11_22_33);
  expect(timeToNumber(new Date('0500-12-31T11:22:33.444'))).toBe(11_22_33);
  expect(timeToNumber(new Date('0000-01-01T11:22:33'))).toBe(11_22_33);
  expect(timeToNumber(new Date('0000-12-31T11:22:33.444'))).toBe(11_22_33);
  // B.C.
  expect(timeToNumber(new Date('-000001-01-01T11:22:33.444'))).toBe(11_22_33);
  expect(timeToNumber(new Date('-000001-12-31T11:22:33.444'))).toBe(11_22_33);
  expect(timeToNumber(new Date('-012000-01-01T11:22:33.444'))).toBe(11_22_33);
  expect(timeToNumber(new Date('-012000-12-31T11:22:33.444'))).toBe(11_22_33);
});
test('utils datetimeToNumber', async () => {
  // A.D.
  expect(datetimeToNumber(new Date('2022-01-01T11:22:33'))).toBe(2022_01_01_11_22_33);
  expect(datetimeToNumber(new Date('2022-12-31T11:22:33.444'))).toBe(2022_12_31_11_22_33);
  expect(datetimeToNumber(new Date('0500-01-01T11:22:33'))).toBe(500_01_01_11_22_33);
  expect(datetimeToNumber(new Date('0500-12-31T11:22:33.444'))).toBe(500_12_31_11_22_33);
  expect(datetimeToNumber(new Date('0000-01-01T11:22:33'))).toBe(1_01_11_22_33);
  expect(datetimeToNumber(new Date('0000-12-31T11:22:33.444'))).toBe(12_31_11_22_33);
  // B.C.
  expect(datetimeToNumber(new Date('-000001-01-01T11:22:33.444'))).toBe(-1_01_01_11_22_33);
  expect(datetimeToNumber(new Date('-000001-12-31T11:22:33.444'))).toBe(-1_12_31_11_22_33);
  expect(datetimeToNumber(new Date('-012000-01-01T11:22:33.444'))).toBe(-12000_01_01_11_22_33);
  expect(datetimeToNumber(new Date('-012000-12-31T11:22:33.444'))).toBe(-12000_12_31_11_22_33);
});
//#region Date & Time

//#region Stringify
test('utils generateString', async () => {
  expect(
    generateString<Pick<Data, 'username'>>(
      { id: 'id', data: { username: 'username-1' } },
      { field: 'username', type: 'string', value: (row) => row.data.username },
      {}
    )
  ).toBe('username-1');
  expect(
    generateString<Pick<Data, 'age'>>(
      { id: 'id', data: { age: 45 } },
      { field: 'age', type: 'number', value: (row) => row.data.age },
      {}
    )
  ).toBe('45');
  expect(
    generateString<Pick<Data, 'vip'>>(
      { id: 'id', data: { vip: true } },
      { field: 'vip', type: 'boolean', value: (row) => row.data.vip },
      { booleanFormatOptions: { true: 'true', false: 'false', empty: '' } }
    )
  ).toBe('true');
});
//#endregion Stringify
