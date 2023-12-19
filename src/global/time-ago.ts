import {isValid, parseISO, formatDistanceToNow} from 'date-fns';

export class TimeAgo {
  static transform(timestamp: string): string {
    const date = parseISO(timestamp);
    let timeAgo = '';

    if (timestamp && isValid(date)) {
      const timePeriod = formatDistanceToNow(date);
      timeAgo = `${timePeriod} ago`;
    }

    return timeAgo;
  }
}
