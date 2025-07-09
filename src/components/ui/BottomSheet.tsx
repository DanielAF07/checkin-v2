import BottomSheetGorhom, {
  BottomSheetView,
  type BottomSheetProps as GorhomBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'tamagui';
import CustomBackdrop from './BottomSheet/CustomBackdrop';

interface BottomSheetProps
  extends Omit<GorhomBottomSheetProps, 'children'>,
    PropsWithChildren {
  open?: boolean;
  onClose?: () => void;
  dismissKeyboardOnTap?: boolean;
  resetOnKeyboardHide?: boolean;
}

export const BottomSheet = ({
  open,
  onClose,
  children,
  snapPoints = ['50%'],
  dismissKeyboardOnTap = true,
  resetOnKeyboardHide = true,
  ...otherProps
}: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetGorhom>(null);
  const theme = useTheme({ name: 'dark' });

  useEffect(() => {
    if (open) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [open]);

  useEffect(() => {
    if (!resetOnKeyboardHide) return;

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        bottomSheetRef.current?.snapToIndex(1);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [resetOnKeyboardHide]);

  const closeSheet = () => {
    if (onClose) {
      onClose();
    }
    bottomSheetRef.current?.close();
  };

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  return (
    <BottomSheetGorhom
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={props => <CustomBackdrop {...props} />}
      handleIndicatorStyle={{
        backgroundColor: theme.accent11.val || '#fff',
        top: 4,
        width: 50,
        height: 4,
        borderRadius: 2,
      }}
      backgroundStyle={{
        backgroundColor: theme.accent12.val || '#fff',
        borderRadius: 18,
      }}
      // onChange={handleSheetChanges}
      onClose={closeSheet}
      index={-1}
      {...otherProps}
    >
      <BottomSheetView style={styles.contentContainer}>
        {dismissKeyboardOnTap ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
          </TouchableWithoutFeedback>
        ) : (
          children
        )}
      </BottomSheetView>
    </BottomSheetGorhom>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: 26,
    alignItems: 'center',
  },
});
