import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

import { Dispatch, SetStateAction } from "react";

export function SensitivitySlider({
  onChange,
  sensitivity,
}: {
  onChange: Dispatch<SetStateAction<number>>;
  sensitivity: number;
}) {
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Slider
      aria-label="sensitiviy-slider"
      onChange={(val) => onChange(val)}
      defaultValue={sensitivity}
      value={sensitivity}
      min={0.7}
      max={0.9}
      step={0.05}
      mr={6}
      ml={4}
    >
      <SliderMark value={0.7} {...labelStyles}>
        Low
      </SliderMark>
      <SliderMark value={0.78} {...labelStyles}>
        Balanced (recommended)
      </SliderMark>
      <SliderMark value={0.9} {...labelStyles}>
        High
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}
