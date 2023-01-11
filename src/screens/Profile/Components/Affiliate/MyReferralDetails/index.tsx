/**
 * @format
 */
import * as React from 'react';
import {Spinner, Text, View} from 'native-base';
import moment from 'moment';

import {AppTheme} from 'theme';
import {Button, Title} from 'components';

import {DateInput} from './DateInput';
import {useAffiliateStatistics} from './useAffiliateStatistics';
import {useUserInfo} from '../../../../../hooks/useUserInfo';

interface Props {
  theme: AppTheme;
}

type DateSelectionMode = 'start' | 'end' | '';

const DateFormat = 'YYYY-MM-DD';
const DisplayDateFormat = 'MMM DD, YYYY';

interface IDates {
  start: Date | undefined;
  end: Date | undefined;
  startDate: string;
  endDate: string;
}

function MyReferralDetails(props: Props) {
  const {theme} = props;

  const [mode, setMode] = React.useState<DateSelectionMode>('');

  const [date, setDate] = React.useState<IDates>({
    start: undefined,
    end: undefined,
    startDate: '',
    endDate: '',
  });

  const {user} = useUserInfo();
  const {documentId} = user;

  const params = {
    userId: documentId,
    from: moment(date.start).format(DateFormat),
    to: moment(date.end).format(DateFormat),
  };

  const {data, isRefetching, refetch} = useAffiliateStatistics(params);

  const onApply = () => {
    refetch();
  };

  const onDateConfirm = (m: DateSelectionMode) => (newDate: Date) => {
    setMode('');
    if (m === 'start') {
      const startDate = moment(newDate).format(DisplayDateFormat);

      const updates: Partial<IDates> = {
        start: newDate,
        startDate,
      };

      // Check if end date is before start date
      if (date.end) {
        const shouldResetEndDate = moment(date.end).isBefore(moment(newDate));
        if (shouldResetEndDate) {
          updates.end = undefined;
          updates.endDate = '';
        }
      }

      setDate(v => ({...v, ...updates}));
    } else if (m === 'end') {
      const endDate = moment(newDate).format(DisplayDateFormat);
      setDate(v => ({...v, end: newDate, endDate}));
    }
  };

  const onStartChange = (start: Date) => setDate(v => ({...v, start}));
  const onEndChange = (end: Date) => setDate(v => ({...v, end}));

  const onClosePicker = () => setMode('');
  const onStartDateOpen = () => setMode('start');
  const onEndDateOpen = () => setMode('end');

  const canApply = React.useMemo(() => {
    return date.startDate !== '' && date.endDate !== '';
  }, [date.startDate, date.endDate]);

  return (
    <>
      <View mb={2} mt={3}>
        <View>
          <Title alignSelf="center">My Counts</Title>
        </View>
      </View>
      <View
        borderColor="rgb(29, 29, 29)"
        borderRadius={4}
        borderWidth={0.25}
        mb={3}
        mt={3}
        p={4}>
        <View>
          {/* <Title alignSelf="center">My Counts</Title> */}
          <View flexDirection="row" justifyContent="space-between" mt={2}>
            <View width="49%">
              <DateInput
                date={date.start ?? new Date()}
                key="startDate"
                minimumDate={moment(new Date()).add(-1, 'year').toDate()}
                mode="date"
                open={mode === 'start'}
                theme={theme}
                title="Start Date"
                value={date.startDate}
                onCancel={onClosePicker}
                onConfirm={onDateConfirm('start')}
                onDateChange={onStartChange}
                onPress={onStartDateOpen}
              />
            </View>
            <View width="49%">
              <DateInput
                date={date.end ?? new Date()}
                key="endDate"
                minimumDate={
                  date.start
                    ? new Date(date.start.getTime() + 1 * 60000)
                    : new Date()
                }
                mode="date"
                open={mode === 'end'}
                theme={theme}
                title="End Date"
                value={date.endDate}
                onCancel={onClosePicker}
                onConfirm={onDateConfirm('end')}
                onDateChange={onEndChange}
                onPress={onEndDateOpen}
              />
            </View>
          </View>
        </View>

        <View mt={2} width="100%">
          <Button
            disabled={!canApply}
            mt={2}
            title="Apply"
            width="100%"
            onPress={onApply}
          />
        </View>

        {isRefetching && <Spinner />}
        {data ? (
          <View mt={2}>
            <View
              alignItems="center"
              borderColor={theme.colors.black[900]}
              borderWidth={1}
              justifyContent="center"
              minHeight="40px">
              <Text>Number of Conversions: {data.businessCount}</Text>
            </View>
            <View
              alignItems="center"
              borderColor={theme.colors.black[900]}
              borderWidth={1}
              justifyContent="center"
              minHeight="40px"
              mt={2}>
              <Text>Number of Registrants: {data.registers}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

export {MyReferralDetails};
