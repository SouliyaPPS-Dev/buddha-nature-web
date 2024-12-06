import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface LogoProps {
  width?: number;
  height?: number;
  alt?: string; // Alt text for accessibility
}