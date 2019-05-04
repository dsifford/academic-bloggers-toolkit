interface Props {
    width?: number;
    height?: number;
}

export default function RemoveIcon({ width = 20, height = 20 }: Props) {
    return (
        <svg height={height} viewBox="0 0 20 20" width={width}>
            <path
                d={`M10 1c-5 0-9 4-9 9s4 9 9 9 9-4
            9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7
            7-7 7 3.1 7 7-3.1 7-7 7zM6 9v2h8V9H6z`}
            />
        </svg>
    );
}
