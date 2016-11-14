import React, {PropTypes} from 'react';
import moment from 'moment';

import Month from './month';
import MonthNames from './month-names';

import styles from './date-picker.css';

import units, {weekdays, linear, scheduleRAF} from './consts';
const {unit, cellSize, calHeight} = units;

const WEEK = 7;
const FRIDAYTOSUNDAY = WEEK + weekdays.SU - weekdays.FR;
const FIVELINES = 31;
const TALLMONTH = 6;
const SHORTMONTH = 5;
const PADDING = 2;

const MONTHSBACK = 2;

function monthHeight(date) {
  const monthStart = moment(date).startOf('month');
  const daysSinceLastFriday = (monthStart.day() + FRIDAYTOSUNDAY) % WEEK;
  const monthLines = daysSinceLastFriday + monthStart.daysInMonth() > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellSize + unit * PADDING;
}

// in milliseconds per pixel
function scrollSpeed(date) {
  const monthStart = moment(date).startOf('month');
  const monthEnd = moment(date).endOf('month');
  return (monthEnd - monthStart) / monthHeight(monthStart);
}

const scrollSchedule = scheduleRAF();
let dy = 0;
export default function Months(props) {
  const scrollDate = moment(props.scrollDate);
  const monthStart = scrollDate.clone().startOf('month');

  let month = monthStart.
    clone().
    subtract(MONTHSBACK, 'months');
  const months = [month];
  for (let i = 0; i < MONTHSBACK * 2; i++) {
    month = month.
      clone().
      add(1, 'month');
    months.push(month);
  }

  const currentSpeed = scrollSpeed(scrollDate);
  const pxToDate = linear(0, scrollDate, currentSpeed);
  const offset = pxToDate.x(monthStart); // is a negative number
  const bottomOffset = monthHeight(scrollDate) + offset;

  return (
    <div
      className={styles.months}
      onWheel={e => {
        e.preventDefault();
        dy += e.deltaY;
        scrollSchedule(() => {
          let date;

          // adjust scroll speed to prevent glitches
          if (dy < offset) {
            date = pxToDate.y(offset) + (dy - offset) * scrollSpeed(months[1]);
          } else if (dy > bottomOffset) {
            date = pxToDate.y(bottomOffset) + (dy - bottomOffset) * scrollSpeed(months[MONTHSBACK + 1]);
          } else {
            date = pxToDate.y(dy);
          }

          props.onScroll(date);
          dy = 0;
        });
      }}
    >
      <div
        style={{
          top: Math.floor(calHeight / 2 - monthHeight(months[0]) - monthHeight(months[1]) + offset)
        }}
        className={styles.days}
      >
        {months.map(date => (
          <Month
            {...props}
            month={date}
            key={+date}
          />
        ))}
      </div>
      <MonthNames {...props} />
    </div>
  );
}

Months.propTypes = {
  onScroll: PropTypes.func
};
