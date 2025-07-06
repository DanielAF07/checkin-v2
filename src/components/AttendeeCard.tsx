import { memo } from 'react';
import { Check, X } from '@tamagui/lucide-icons';
import { View } from 'react-native';
import { Card, Text } from 'tamagui';
import { type AttendeeWithPresence } from '../../store/attendanceStore';

interface AttendeeCardProps {
  attendee: AttendeeWithPresence;
  onToggle: () => void;
}

export const AttendeeCard = memo(function AttendeeCard({ attendee, onToggle }: AttendeeCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      marginBottom="$3"
      backgroundColor={attendee.isPresent ? '$green2' : '$background'}
      borderColor={attendee.isPresent ? '$green8' : '$borderColor'}
      pressStyle={{ scale: 0.98 }}
      onPress={onToggle}
    >
      <Card.Header>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text color="$color" fontSize="$7">
            {attendee.name}{' '}
            <Text fontWeight="bold" fontSize="$8">
              {attendee.first_lastname}
            </Text>{' '}
            {attendee.second_lastname}
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: attendee.isPresent ? '$green10' : '$red10',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {attendee.isPresent ? (
              <Check size={20} color="white" />
            ) : (
              <X size={20} color="white" />
            )}
          </View>
        </View>
      </Card.Header>
    </Card>
  );
});
