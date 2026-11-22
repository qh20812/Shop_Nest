interface InputErrorProps {
    message?: string;
}

export default function InputError({ message }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p role="alert" className="sn-field__error">
            {message}
        </p>
    );
}
