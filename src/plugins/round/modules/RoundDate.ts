interface PassedTime {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;

const MILLISECONDS_PER_SECOND: number = MILLISECONDS;
const MILLISECONDS_PER_MINUTE: number = MILLISECONDS * SECONDS;
const MILLISECONDS_PER_HOUR: number = MILLISECONDS * SECONDS * MINUTES;
const MILLISECONDS_PER_DAY: number = MILLISECONDS * SECONDS * MINUTES * HOURS;

export default function (date: Date): string {
  const dateDiff: number = Date.now() - date.getTime();

  const passed: PassedTime = {
    seconds: Math.round(dateDiff / MILLISECONDS_PER_SECOND),
    minutes: Math.round(dateDiff / MILLISECONDS_PER_MINUTE),
    hours: Math.round(dateDiff / MILLISECONDS_PER_HOUR),
    days: Math.round(dateDiff / MILLISECONDS_PER_DAY),
  };

  if (passed.minutes === 0) {
    return passed.seconds > 0 ? `${passed.seconds}s` : `0s`;
  } else if (passed.hours === 0) {
    return `${passed.minutes}m`;
  } else if (passed.days === 0) {
    return `${passed.hours}h`;
  } else if (passed.days <= 30) {
    return `${passed.days}d`;
  } else {
    return (
      date
        .toLocaleDateString("default", {
          month: "short",
          year: "2-digit",
        })
        // replace space between month and year
        // with non-breaking space and ‘-sign
        .replace(" ", "\u00A0‘")
    );
  }
}
