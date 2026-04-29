import React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

type FloatIconProps = {
  size?: number;
};

export default function FloatIcon({size = 64}: FloatIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      <Rect width="256" height="256" rx="60" ry="60" fill="#151515" />
      <Path
        d="M 128 45 C 190 45, 225 75, 225 128 C 225 175, 190 195, 140 195 C 125 195, 120 200, 110 225 C 112 200, 100 185, 85 185 C 35 185, 30 125, 45 80 C 55 50, 90 45, 128 45 Z M 128 60 C 90 60, 60 70, 58 115 C 55 155, 85 168, 110 172 C 120 174, 125 176, 135 176 C 175 176, 205 165, 205 128 C 205 85, 175 60, 128 60 Z"
        fill="#FFFFFF"
        fillRule="evenodd"
      />
      <Path
        d="M 58 130 C 70 150, 85 150, 95 122 Q 100 108, 105 118 Q 110 138, 115 125 Q 123 70, 128 95 Q 135 170, 143 140 Q 150 110, 158 125 C 170 150, 190 145, 205 125"
        stroke="#FFFFFF"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
