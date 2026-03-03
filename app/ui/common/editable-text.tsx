import {BiEdit} from "react-icons/bi";
import React, {useState} from "react";
import clsx from "clsx";

type Props = {
    name: string,
    type : "input" | "textarea",
    className?: string,
    pattern?: string,
    iconClassName?: string,
    defaultValue?: string | number,
    readOnly?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
    onChange?: (value: string) => void,
}

export default function EditableText({name, type, className, pattern, iconClassName, defaultValue, readOnly = false,
                                         minLength, maxLength, min, max, onChange: handleChangeValue}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const isNumber = typeof defaultValue === "number";

    const validate = (element: HTMLInputElement | HTMLTextAreaElement) => {
        setIsEditing(false);
        const valid = element.reportValidity();
        setIsValid(valid);
        if (valid && handleChangeValue) {
            handleChangeValue(element.value);
        }
    };

    const commonProps = {
        name: name,
        defaultValue,
        tabIndex: isEditing ? undefined : -1,
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => validate(e.target),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } },
        className: clsx(
            "field-sizing-content bg-transparent outline-none border-b transition-colors duration-200 input-ghost",
            type === "textarea" && "resize-none",
            !isValid && "text-red-500",
            isEditing ? "border-gray-400 cursor-text" : "border-transparent cursor-default pointer-events-none",
            type === "input" && "no-spinner",
            className,
        ),
    };

    const inputProps = {
        type: isNumber ? "number" : "text",
        pattern,
        ...(isNumber ? { min, max } : { minLength, maxLength }),
    };

    const textareaProps = {
        minLength,
        maxLength,
    };

    return (
        <div className="flex space-x-2 items-center-safe">
            {type === "textarea" ?
                <textarea {...commonProps} {...textareaProps} /> :
                <input {...commonProps} {...inputProps} />
            }
            {!readOnly &&
                <BiEdit className={clsx(
                    "cursor-pointer shrink-0",
                    iconClassName ? iconClassName : "w-5 h-5",
                )} onMouseDown={(e) => e.preventDefault()} onClick={() => setIsEditing(prev => !prev)}/>
            }
        </div>
    )
}