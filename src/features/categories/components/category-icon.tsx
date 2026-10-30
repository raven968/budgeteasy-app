import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';

import { categoryIconSymbol, contrastingForeground } from '../catalog';

type CategoryIconProps = {
  icon: string;
  color: string;
  size?: number;
};

/**
 * The category icon inside a circle of its color.
 */
export function CategoryIcon({ icon, color, size = 40 }: CategoryIconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <SymbolView name={categoryIconSymbol(icon)} size={size * 0.5} tintColor={contrastingForeground(color)} />
    </View>
  );
}
