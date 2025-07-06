import { PropsWithChildren } from 'react';
import { Sheet } from 'tamagui';

interface BottomSheetProps extends PropsWithChildren {
  isSheetOpen: boolean;
  setIsSheetOpen: (isOpen: boolean) => void;
  snapPoints?: number[];
  defaultPosition?: number;
}

export const BottomSheet = ({
  isSheetOpen,
  setIsSheetOpen,
  children,
  snapPoints,
  defaultPosition,
}: BottomSheetProps) => {
  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
      defaultPosition={defaultPosition || 0}
      snapPoints={snapPoints || [50]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay style={{ opacity: 0.2 }} />
      <Sheet.Handle bg="$black10" height={6} />
      <Sheet.Frame bg="$black3" width={'100%'} px="$4" py="$4">
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
