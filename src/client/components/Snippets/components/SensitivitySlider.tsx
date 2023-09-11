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
}: {
  onChange: Dispatch<SetStateAction<number>>;
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
      defaultValue={0.85}
      min={0.55}
      max={0.95}
      step={0.05}
      mr={6}
      ml={4}
    >
      <SliderMark value={0.55} {...labelStyles}>
        Low
      </SliderMark>
      <SliderMark value={0.7} {...labelStyles}>
        Medium
      </SliderMark>
      <SliderMark value={0.8} {...labelStyles}>
        Balanced (recommended)
      </SliderMark>
      <SliderMark value={0.95} {...labelStyles}>
        High
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}
