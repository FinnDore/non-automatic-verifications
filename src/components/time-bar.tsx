import { AuditAction } from '@prisma/client';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { max } from 'lodash-es';
import { useMemo } from 'react';
import { trpc } from '../utils/trpc';

export const TimeBar = () => {
    const { data } = trpc.stats.getTimelineData.useQuery({
        action: AuditAction.VERIFICATION_CREATED,
    });

    const theData = useMemo(() => {
        return padFor(data);
    }, [data]);
    const verticalMargin = 10;
    const height = 100;
    const width = useMemo(() => (data?.length ?? 0) * 10, [data]);

    // bounds

    // tim
    const xMax = width;
    const yMax = 90;
    // scales, memoize for performance
    const xScale = useMemo(
        () =>
            scaleBand<number>({
                range: [0, xMax],
                domain: data?.map((d) => d.timestamp.getTime()) ?? [],
                padding: 0.4,
            }),
        [data, xMax]
    );
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],

                domain: [0, max(data?.map((x) => x.count)) ?? 0],
            }),
        [data, yMax]
    );

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect
                width={width}
                height={height}
                fill="rgba(000,000,000, 1)"
                rx={14}
            />
            <Group top={verticalMargin / 2}>
                {data?.map((d, i) => {
                    const barWidth = xScale.bandwidth();
                    const barHeight = yMax - (yScale(d.count) ?? 0);
                    const barX = xScale(d.timestamp.getTime()) ?? 0;
                    const barY = yMax - barHeight;
                    return (
                        <Bar
                            key={`bar-${d.timestamp}`}
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            fill="rgba(000,222,222, 1)"
                            style={{ stroke: '1px solid white' }}
                        />
                    );
                })}
            </Group>
        </svg>
    );
};
