import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 17.5L14.375 13.875M16.3333 9.16667C16.3333 12.8486 13.3486 15.8333 9.66667 15.8333C5.98477 15.8333 3 12.8486 3 9.16667C3 5.48477 5.98477 2.5 9.66667 2.5C13.3486 2.5 16.3333 5.48477 16.3333 9.16667Z"
      stroke="#667085"
      strokeWidth={1.66667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SVGComponent;
