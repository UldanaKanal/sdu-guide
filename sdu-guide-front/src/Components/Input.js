import React from "react";

export function Input({ placeholder, className, ...props }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`border p-2 rounded ${className}`}
            onKeyDown={(e) => {
                if (e.key === "Enter" && typeof props.onEnter === "function") {
                    props.onEnter();
                }
                if (typeof props.onKeyDown === "function") {
                    props.onKeyDown(e);
                }
            }}
            {...props}
        />
    );
}