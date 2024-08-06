import * as React from "react";
import { SVGProps } from "react";
const Upload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    viewBox="0 0 34 34"
    fill="none"
    {...props}
  >
    <path
      d="M12.7502 25.1463C12.1694 25.1463 11.6877 24.6647 11.6877 24.0838V18.148L10.6677 19.168C10.2569 19.5788 9.57687 19.5788 9.16604 19.168C8.7552 18.7572 8.7552 18.0772 9.16604 17.6663L11.9994 14.833C12.2969 14.5355 12.7644 14.4363 13.161 14.6063C13.5577 14.7622 13.8127 15.1588 13.8127 15.5838V24.0838C13.8127 24.6647 13.331 25.1463 12.7502 25.1463Z"
      fill={props.fill || "#755AE2"}
    />
    <path
      d="M15.5832 19.4782C15.314 19.4782 15.0449 19.3791 14.8324 19.1666L11.999 16.3332C11.5882 15.9224 11.5882 15.2424 11.999 14.8316C12.4099 14.4207 13.0899 14.4207 13.5007 14.8316L16.334 17.6649C16.7449 18.0757 16.7449 18.7557 16.334 19.1666C16.1215 19.3791 15.8524 19.4782 15.5832 19.4782Z"
      fill={props.fill || "#755AE2"}
    />
    <path
      d="M21.2502 32.2298H12.7502C5.05766 32.2298 1.771 28.9432 1.771 21.2507V12.7507C1.771 5.05815 5.05766 1.77148 12.7502 1.77148H19.8335C20.4143 1.77148 20.896 2.25315 20.896 2.83398C20.896 3.41482 20.4143 3.89648 19.8335 3.89648H12.7502C6.21933 3.89648 3.896 6.21982 3.896 12.7507V21.2507C3.896 27.7815 6.21933 30.1048 12.7502 30.1048H21.2502C27.781 30.1048 30.1043 27.7815 30.1043 21.2507V14.1673C30.1043 13.5865 30.586 13.1048 31.1668 13.1048C31.7477 13.1048 32.2293 13.5865 32.2293 14.1673V21.2507C32.2293 28.9432 28.9427 32.2298 21.2502 32.2298Z"
      fill={props.fill || "#755AE2"}
    />
    <path
      d="M31.1668 15.2297H25.5002C20.6552 15.2297 18.771 13.3455 18.771 8.50051V2.83385C18.771 2.40885 19.026 2.01218 19.4227 1.85635C19.8193 1.68635 20.2727 1.78551 20.5843 2.08301L31.9177 13.4163C32.2152 13.7138 32.3143 14.1813 32.1443 14.578C31.9743 14.9747 31.5918 15.2297 31.1668 15.2297ZM20.896 5.39801V8.50051C20.896 12.1555 21.8452 13.1047 25.5002 13.1047H28.6027L20.896 5.39801Z"
      fill={props.fill || "#755AE2"}
    />
  </svg>
);
export default Upload;