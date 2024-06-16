import {
  compareDates,
  compareDateTimes,
  compareTimes,
  datetimeToNumber,
  dateToNumber,
  defined,
  equals,
  generateString,
  getNextSortingDirection,
  noop,
  timeToNumber,
} from '../src/utils';
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

test('utils getNextSortingDirection', async () => {
  expect(getNextSortingDirection('asc')).toBe('desc');
  expect(getNextSortingDirection('desc')).toBe(undefined);
  expect(getNextSortingDirection(undefined)).toBe('asc');
});

//#region Date & Time
test('utils dateToNumber', async () => {
  expect(dateToNumber(undefined)).toBe(0);
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

test('utils compareDates', async () => {
  // A.D.
  expect(compareDates(new Date('2022-01-01'), new Date('2023-01-01'))).toBe(-10000);
  expect(compareDates(new Date('2022-01-01'), new Date('2022-02-01'))).toBe(-100);
  expect(compareDates(new Date('2022-01-01'), new Date('2022-01-02'))).toBe(-1);
  expect(compareDates(new Date('2022-01-01'), new Date('2022-01-01'))).toBe(0);
  expect(compareDates(new Date('2023-01-01'), new Date('2022-01-01'))).toBe(10000);
  expect(compareDates(new Date('2022-02-01'), new Date('2022-01-01'))).toBe(100);
  expect(compareDates(new Date('2022-01-02'), new Date('2022-01-01'))).toBe(1);
  // B.C.
  expect(compareDates(new Date('-012000-12-31'), new Date('-011999-12-31'))).toBe(-10000);
  expect(compareDates(new Date('-012000-12-31'), new Date('-012000-11-30'))).toBe(-101);
  expect(compareDates(new Date('-012000-12-31'), new Date('-012000-12-30'))).toBe(-1);
  expect(compareDates(new Date('-012000-12-31'), new Date('-012000-12-31'))).toBe(0);
  expect(compareDates(new Date('-011999-12-31'), new Date('-012000-12-31'))).toBe(10000);
  expect(compareDates(new Date('-012000-11-30'), new Date('-012000-12-31'))).toBe(101);
  expect(compareDates(new Date('-012000-12-30'), new Date('-012000-12-31'))).toBe(1);
});

test('utils timeToNumber', async () => {
  // A.D.
  expect(timeToNumber(new Date('2022-01-01T00:00:00.000'))).toBe(0);
  expect(timeToNumber(new Date('2022-12-31T01:00:00.000'))).toBe(1_00_00);
  expect(timeToNumber(new Date('0500-01-01T02:01:00.000'))).toBe(2_01_00);
  expect(timeToNumber(new Date('0500-12-31T03:02:01.000'))).toBe(3_02_01);
  expect(timeToNumber(new Date('0000-01-01T04:03:02.100'))).toBe(4_03_02);
  expect(timeToNumber(new Date('0000-12-31T05:04:03.200'))).toBe(5_04_03);
  // B.C.
  expect(timeToNumber(new Date('-000001-01-01T00:00:00.000'))).toBe(0);
  expect(timeToNumber(new Date('-000001-12-31T03:02:01.000'))).toBe(3_02_01);
  expect(timeToNumber(new Date('-012000-01-01T04:03:02.100'))).toBe(4_03_02);
  expect(timeToNumber(new Date('-012000-12-31T05:04:03.200'))).toBe(5_04_03);
});

test('utils compareTimes', async () => {
  // A.D.
  expect(compareTimes(new Date('2022-01-01T00:00:00.000'), new Date('2023-01-01T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-02-01T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-01-02T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2022-01-01T00:00:01.000'), new Date('2022-01-02T00:00:00.000'))).toBe(1);
  expect(compareTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2022-01-01T00:00:01.000'), new Date('2022-01-01T00:00:00.000'))).toBe(1);
  expect(compareTimes(new Date('2023-01-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2023-01-01T00:00:00.000'), new Date('2022-01-01T00:00:01.000'))).toBe(-1);
  expect(compareTimes(new Date('2022-02-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('2022-01-02T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(0);
  // B.C.
  expect(compareTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-011999-12-31T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-11-30T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-12-30T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-012000-12-31T00:01:00.000'), new Date('-012000-12-30T00:00:00.000'))).toBe(100);
  expect(compareTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-012000-12-31T00:01:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(100);
  expect(compareTimes(new Date('-011999-12-31T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-011999-12-31T00:00:00.000'), new Date('-012000-12-31T00:01:00.000'))).toBe(-100);
  expect(compareTimes(new Date('-012000-11-30T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(0);
  expect(compareTimes(new Date('-012000-12-30T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(0);
});

test('utils datetimeToNumber', async () => {
  // A.D.
  expect(datetimeToNumber(new Date('2022-01-01T00:00:00.000'))).toBe(2022_01_01_00_00_00);
  expect(datetimeToNumber(new Date('2022-12-31T01:00:00.000'))).toBe(2022_12_31_01_00_00);
  expect(datetimeToNumber(new Date('0500-01-01T02:01:00.000'))).toBe(500_01_01_02_01_00);
  expect(datetimeToNumber(new Date('0500-12-31T03:02:01.000'))).toBe(500_12_31_03_02_01);
  expect(datetimeToNumber(new Date('0000-01-01T04:03:02.100'))).toBe(1_01_04_03_02);
  expect(datetimeToNumber(new Date('0000-12-31T05:04:03.200'))).toBe(12_31_05_04_03);
  // B.C.
  expect(datetimeToNumber(new Date('-000001-01-01T00:00:00.000'))).toBe(-1_01_01_00_00_00);
  expect(datetimeToNumber(new Date('-000001-12-31T03:02:01.000'))).toBe(-1_12_31_03_02_01);
  expect(datetimeToNumber(new Date('-012000-01-01T04:03:02.100'))).toBe(-12000_01_01_04_03_02);
  expect(datetimeToNumber(new Date('-012000-12-31T05:04:03.200'))).toBe(-12000_12_31_05_04_03);
});

test('utils compareDateTimes', async () => {
  // A.D.
  expect(compareDateTimes(new Date('2022-01-01T00:00:00.000'), new Date('2023-01-01T00:00:00.000'))).toBe(
    -1_00_00_00_00_00
  );
  expect(compareDateTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-02-01T00:00:00.000'))).toBe(
    -1_00_00_00_00
  );
  expect(compareDateTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-01-02T00:00:00.000'))).toBe(-1_00_00_00);
  expect(compareDateTimes(new Date('2022-01-01T00:00:01.000'), new Date('2022-01-02T00:00:00.000'))).toBe(-99_99_99);
  expect(compareDateTimes(new Date('2022-01-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(0);
  expect(compareDateTimes(new Date('2022-01-01T00:00:01.000'), new Date('2022-01-01T00:00:00.000'))).toBe(1);
  expect(compareDateTimes(new Date('2023-01-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(
    1_00_00_00_00_00
  );
  expect(compareDateTimes(new Date('2023-01-01T00:00:00.000'), new Date('2022-01-01T00:00:01.000'))).toBe(
    99_99_99_99_99
  );
  expect(compareDateTimes(new Date('2022-02-01T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(100000000);
  expect(compareDateTimes(new Date('2022-01-02T00:00:00.000'), new Date('2022-01-01T00:00:00.000'))).toBe(1000000);
  // B.C.
  expect(compareDateTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-011999-12-31T00:00:00.000'))).toBe(
    -1_00_00_00_00_00
  );
  expect(compareDateTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-11-30T00:00:00.000'))).toBe(
    -1_01_00_00_00
  );
  expect(compareDateTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-12-30T00:00:00.000'))).toBe(
    -1_00_00_00
  );
  expect(compareDateTimes(new Date('-012000-12-31T00:01:00.000'), new Date('-012000-12-30T00:00:00.000'))).toBe(
    -1_00_01_00
  );
  expect(compareDateTimes(new Date('-012000-12-31T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(0);
  expect(compareDateTimes(new Date('-012000-12-31T00:01:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(-1_00);
  expect(compareDateTimes(new Date('-011999-12-31T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(
    1_00_00_00_00_00
  );
  expect(compareDateTimes(new Date('-011999-12-31T00:00:00.000'), new Date('-012000-12-31T00:01:00.000'))).toBe(
    1_00_00_00_01_00
  );
  expect(compareDateTimes(new Date('-012000-11-30T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(
    1_01_00_00_00
  );
  expect(compareDateTimes(new Date('-012000-12-30T00:00:00.000'), new Date('-012000-12-31T00:00:00.000'))).toBe(
    1_00_00_00
  );
});
//#endregion Date & Time

//#region Stringify
test('utils generateString', async () => {
  expect(
    generateString<Pick<Data, 'username'>>(
      { id: 'id', data: { username: 'username-1' }, selected: false },
      { field: 'username', type: 'string', value: (row) => row.data.username },
      {}
    )
  ).toBe('username-1');
  expect(
    generateString<Pick<Data, 'age'>>(
      { id: 'id', data: { age: 45 }, selected: false },
      { field: 'age', type: 'number', value: (row) => row.data.age },
      {}
    )
  ).toBe('45');
  expect(
    generateString<Pick<Data, 'vip'>>(
      { id: 'id', data: { vip: true }, selected: false },
      { field: 'vip', type: 'boolean', value: (row) => row.data.vip },
      { booleanFormatOptions: { true: 'true', false: 'false', empty: '' } }
    )
  ).toBe('true');
});
//#endregion Stringify
