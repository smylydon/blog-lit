import {TimeAgo} from './time-ago';

describe('TimeAgo', () => {
  const MINUTE = 60 * 1000;
  const TWO_HOURS = 2 * 60 * MINUTE;
  const ONE_DAY = 12 * TWO_HOURS;

  const getISOStringDate = (period: number) => {
    const time = new Date().getTime() - period;
    return new Date(time).toISOString();
  };

  it('should exist', () => {
    expect(TimeAgo.transform).toBeTruthy();
  });

  it('should return empty string', () => {
    expect(TimeAgo.transform('')).toEqual('');
  });

  it('should return empty string when jibberish is passed', () => {
    expect(TimeAgo.transform('asdfasd')).toEqual('');
  });

  it('should return - less than a minute ago', () => {
    expect(TimeAgo.transform(getISOStringDate(0))).toMatch(
      /less than a minute ago/
    );
  });

  it('should return - 1 minute ago', () => {
    expect(TimeAgo.transform(getISOStringDate(MINUTE))).toMatch(/1 minute ago/);
  });

  it('should return - 2 hour ago', () => {
    expect(TimeAgo.transform(getISOStringDate(TWO_HOURS))).toMatch(
      /2\s+hours\s+ago/
    );
  });

  it('should return - 1 day ago', () => {
    expect(TimeAgo.transform(getISOStringDate(ONE_DAY))).toMatch(
      /1\s+day\s+ago/
    );
  });
});
