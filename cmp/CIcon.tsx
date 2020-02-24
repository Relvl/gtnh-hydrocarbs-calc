import * as React from "react";

export type CIconProps = {
    icon: string;
    src?: string;
    size?: "large" | "medium" | "small" | "smallest";
};

export function CIcon(props: CIconProps & React.SVGProps<SVGSVGElement>) {
    const {icon, src, className, size, ...svgProps} = {...props};
    return (
        <svg {...svgProps} className={window.className("c-icon", `icon-specify-${icon}`, size || "medium", className)}>
            <use xlinkHref={(src || "/image/icons-dev.svg") + "#" + icon} />
        </svg>
    );
}
