/**
 * @format
 */
import React, {useState} from 'react';
import {StyleSheet, TextStyle} from 'react-native';
import {Text, View} from 'native-base';
import {Calendar, CalendarList, DateData} from 'react-native-calendars';
import XDate from 'xdate';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';

import {useAppTheme} from 'theme';

declare type MarkedDatesType = {
  [key: string]: MarkingProps;
};

type CalendarType = 'List' | 'Calendar';

interface IRange {
  startDate: DateData | undefined;
  endDate: DateData | undefined;
  startDatePicked: boolean;
  endDatePicked: boolean;
  markedDates: MarkedDatesType | undefined;
}

const RANGE = 24;

interface RangePickerProps {
  type?: CalendarType;
  onStartChange: (start: string) => void;
  onEndChange: (end: string) => void;
}

export type CalendarHandler = {
  clear: () => void;
};

const initialState: IRange = {
  startDate: undefined,
  endDate: undefined,
  startDatePicked: false,
  endDatePicked: false,
  markedDates: {},
};

export const CalendarRangePicker = React.forwardRef<
  CalendarHandler,
  RangePickerProps
>((props, ref) => {
  React.useImperativeHandle(ref, () => ({clear: resetState}));

  const {type = 'List', onStartChange, onEndChange} = props;

  const {colors} = useAppTheme();

  const [state, setState] = useState<IRange>(initialState);

  const resetState = () => {
    setState(initialState);
  };

  const rangeTheme = React.useMemo(
    () => ({
      markColor: colors.brand[950],
      markTextColor: colors.white[900],
      fromDateTheme: {
        color: colors.brand[950],
        textColor: colors.white[900],
      },
      toDateTheme: {
        color: colors.brand[950],
        textColor: colors.white[900],
      },
    }),
    [colors.brand, colors.white],
  );

  const calenderTheme = React.useMemo(
    () => ({
      stylesheet: {
        calendar: {
          header: {
            dayHeader: {
              fontWeight: '600',
              color: colors.brand[950],
            },
          },
        },
      },
      'stylesheet.day.basic': {
        today: {
          borderColor: colors.brand[950],
          borderWidth: 0.8,
        },
        todayText: {
          color: colors.brand[950],
          fontWeight: '800',
        },
      },
    }),
    [colors.brand],
  );

  const setupStartMarker = (day: DateData) => {
    const {fromDateTheme} = rangeTheme;
    const markedDates = {
      [day.dateString]: {
        startingDay: true,
        color: fromDateTheme.color,
        textColor: fromDateTheme.textColor,
      },
    };

    onStartChange(day.dateString);

    setState(prev => ({
      ...prev,
      startDate: day,
      startDatePicked: true,
      endDatePicked: false,
      markedDates,
    }));
  };

  const setupMarkedDates = React.useCallback(
    (startDate: string, endDate: string, markedDates) => {
      const {toDateTheme} = rangeTheme;
      let {markColor, markTextColor} = rangeTheme;

      const mFromDate = new XDate(startDate);
      const mToDate = new XDate(endDate);
      const range = mFromDate.diffDays(mToDate);
      if (range >= 0) {
        if (range === 0) {
          markedDates = {
            [endDate]: {
              color: toDateTheme.color,
              textColor: toDateTheme.textColor,
            },
          };
        } else {
          // eslint-disable-next-line no-plusplus
          for (let i = 1; i <= range; i++) {
            const tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd');
            if (i < range) {
              markedDates[tempDate] = {
                color: markColor,
                textColor: markTextColor,
              };
            } else {
              if (i === range) {
                markColor = toDateTheme.color;
                markTextColor = toDateTheme.textColor;
              }
              markedDates[tempDate] = {
                endingDay: true,
                color: markColor,
                textColor: markTextColor,
              };
            }
          }
        }
      }
      return [markedDates, range];
    },
    [rangeTheme],
  );

  const onDayPress = (day: DateData) => {
    if (
      !state.startDatePicked ||
      (state.startDatePicked && state.endDatePicked)
    ) {
      setupStartMarker(day);
    } else if (!state.endDatePicked) {
      const markedDates = {...state.markedDates};
      const [mMarkedDates, range] = setupMarkedDates(
        state.startDate?.dateString as string,
        day.dateString,
        markedDates,
      );
      if (range >= 0) {
        setState(prev => ({
          ...prev,
          startDatePicked: true,
          endDatePicked: true,
          endDate: day,
          markedDates: mMarkedDates,
        }));
        onEndChange(day.dateString);
      } else {
        setupStartMarker(day);
      }
    }
  };

  const renderCustomHeader = (date?: XDate | undefined) => {
    if (date) {
      const header = date.toString('MMMM yyyy');
      const [month, year] = header.split(' ');
      const textStyle: TextStyle = {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        color: colors.brand[950],
        paddingRight: 5,
      };

      return (
        <View flexDirection="row" width="100%">
          <Text style={[styles.year, textStyle]}>{year}</Text>
          <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
        </View>
      );
    }
    return null;
  };

  if (type === 'List') {
    return (
      <CalendarList
        futureScrollRange={RANGE}
        markedDates={state.markedDates}
        markingType="period"
        minDate={new Date().toString()}
        pastScrollRange={0}
        renderHeader={renderCustomHeader}
        theme={calenderTheme}
        onDayPress={onDayPress}
      />
    );
  }

  return (
    <Calendar
      futureScrollRange={RANGE}
      markedDates={state.markedDates}
      markingType="period"
      minDate={new Date().toString()}
      pastScrollRange={0}
      theme={calenderTheme}
      onDayPress={onDayPress}
    />
  );
});

CalendarRangePicker.defaultProps = {
  type: 'List',
};

export type CalendarRangePickerType = React.ElementRef<
  typeof CalendarRangePicker
>;

const styles = StyleSheet.create({
  month: {
    marginLeft: 5,
  },
  year: {
    marginRight: 5,
  },
});
