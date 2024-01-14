import { useEffect, useState } from 'react';

type Props = {
    unixTime: number;
};

function Timer({ unixTime }: Props) {
    const [remainingTime, setRemainingTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeDifference = unixTime - currentTime;
            setRemainingTime(timeDifference);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [unixTime]);

    function formatTime(time: number): string {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return <>{formatTime(remainingTime)}</>;
};

export default Timer;
