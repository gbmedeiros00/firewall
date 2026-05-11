import React, { forwardRef } from 'react';
import {
  Platform,
  StyleSheet,
  ViewStyle,
  View
} from 'react-native';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';

interface ScreenWrapperProps extends KeyboardAwareScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  /** 
   * Define se a tela deve ser rolável. O padrão é true.
   * Defina como false em telas onde você usa FlatList/SectionList separadamente.
   */
  scrollEnabled?: boolean; 
}

const ScreenWrapper = forwardRef<KeyboardAwareScrollView, ScreenWrapperProps>(({
  children,
  style,
  contentContainerStyle,
  scrollEnabled = true,
  ...props
}, ref) => {
  if (!scrollEnabled) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <KeyboardAwareScrollView
      ref={ref}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      enableOnAndroid={true}
      extraScrollHeight={40} // Respiro visual entre o teclado e o input focado
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableAutomaticScroll={true}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
});

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});