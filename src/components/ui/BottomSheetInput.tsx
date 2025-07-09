// @ts-nocheck
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { styled, useTheme } from 'tamagui';

// Crear un Input styled que use BottomSheetTextInput como base
const StyledBottomSheetInput = styled(BottomSheetTextInput, {
  name: 'BottomSheetInput',
  bg: '$background02',
  borderColor: '$borderColor',
  borderWidth: 1,
  rounded: '$3',
  px: '$3',
  py: '$2.5',
  fontSize: '$4',
  color: '$color',
  fontFamily: '$body',
  minHeight: 44,

  variants: {
    size: {
      '...size': (val: any) => {
        return {
          fontSize:
            val === '$2'
              ? '$2'
              : val === '$3'
                ? '$3'
                : val === '$4'
                  ? '$4'
                  : val === '$5'
                    ? '$5'
                    : '$4',
          paddingHorizontal:
            val === '$2'
              ? '$2'
              : val === '$3'
                ? '$2.5'
                : val === '$4'
                  ? '$3'
                  : val === '$5'
                    ? '$3.5'
                    : '$3',
          paddingVertical:
            val === '$2'
              ? '$1.5'
              : val === '$3'
                ? '$2'
                : val === '$4'
                  ? '$2.5'
                  : val === '$5'
                    ? '$3'
                    : '$2.5',
          minHeight:
            val === '$2'
              ? 32
              : val === '$3'
                ? 36
                : val === '$4'
                  ? 44
                  : val === '$5'
                    ? 52
                    : 44,
        };
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
    shadowColor: '$borderColorFocus',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  hoverStyle: {
    borderColor: '$borderColorHover',
  },
});

interface BottomSheetInputProps
  extends Omit<React.ComponentProps<typeof BottomSheetTextInput>, 'style'> {
  size?: '$2' | '$3' | '$4' | '$5';
  disabled?: boolean;
  focusStyle?: any;
  hoverStyle?: any;
  borderColor?: string;
  backgroundColor?: string;
  borderRadius?: string | number;
  padding?: string | number;
  paddingHorizontal?: string | number;
  paddingVertical?: string | number;
  fontSize?: string | number;
  color?: string;
  fontFamily?: string;
  [key: string]: any;
}

export const BottomSheetInput = forwardRef<TextInput, BottomSheetInputProps>(
  (props, ref) => {
    const theme = useTheme();

    return (
      <StyledBottomSheetInput
        // @ts-ignore
        ref={ref}
        placeholderTextColor={theme.placeholderColor?.val || theme.color10?.val}
        {...props}
      />
    );
  }
);

BottomSheetInput.displayName = 'BottomSheetInput';
