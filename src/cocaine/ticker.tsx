import { animated, config, useSpring } from 'react-spring';
export const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ','] as const;

export const Ticker = ({ letter }: { letter: typeof numbers[number] }) => {
    const styles = useSpring({
        transform: `translateY(-${
            typeof +letter === 'number' ? letter : numbers.length - 1
        }em)`,
        config: config.default,
    });

    return (
        <div className="relative flex h-[1em] overflow-hidden font-mono">
            <div className="invisible">1</div>
            <animated.div style={styles} className="absolute h-full w-full ">
                {numbers.map((num) => (
                    <div key={num} className="h-full w-full">
                        {num}
                    </div>
                ))}
            </animated.div>
        </div>
    );
};
