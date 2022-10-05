import { AuditAction } from '@prisma/client';
import { GetInferenceHelpers } from '@trpc/server';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { subMinutes } from 'date-fns';
import { max } from 'lodash-es';
import { useMemo } from 'react';
import type { AppRouter } from '../server/router';
import { roundUpToNearestMinute as roundUpToNearestFiveMinutes } from '../utils/audit-event';
import { trpc } from '../utils/trpc';

const padFor = (
    inputArray: GetInferenceHelpers<AppRouter>['stats']['getTimelineData']['output']
) => {
    const outputArray = [];
    const currentTime = roundUpToNearestFiveMinutes(new Date());
    // A
    for (let i = 0; i < 288; i++) {
        const time = subMinutes(currentTime, i);
        outputArray.unshift({
            time,
            count:
                inputArray.find((x) => x.timestamp.getTime() === time.getTime())
                    ?.count ?? 1,
        });
    }
    return outputArray.reverse();
};

export const TimeBar = ({
    upsideDown,
    color,

    action,
}: {
    upsideDown?: boolean;
    action: AuditAction;
    color: string;
}) => {
    const { data } = trpc.stats.getTimelineData.useQuery({
        action,
    });

    const timeline = useMemo(() => {
        return padFor(data ?? []);
    }, [data]);

    const height = 75;
    const width = useMemo(
        () => (timeline?.length ?? 0) * 10,
        [timeline?.length]
    );

    const yMax = useMemo(
        () => Math.max(...timeline.map((x) => x.count ?? 0)) + 20,
        [timeline]
    );
    // scales, memoize for performance
    const xScale = useMemo(
        () =>
            scaleBand<number>({
                range: [0, width],
                domain: timeline.map((x) => x.time.getTime()),
                padding: 0.4,
            }),
        [timeline, width]
    );
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, -2],

                domain: [0, max(timeline?.map((x) => x.count)) ?? 0],
            }),
        [timeline, yMax]
    );

    return (
        <ParentSize className="overflow-hidden">
            {(parent) => (
                <svg width={width} height={height}>
                    <rect
                        width={parent.width}
                        height={parent.height}
                        fill="rgba(000,000,000, 1)"
                        rx={14}
                    />
                    <Group top={upsideDown ? 0 : parent.height - yMax}>
                        {timeline.map((d) => {
                            const barWidth = xScale.bandwidth();
                            const barHeight = yMax - (yScale(d.count) ?? 0);
                            const barX = xScale(d.time.getTime()) ?? 0;
                            const barY = yMax - barHeight;
                            return (
                                <Bar
                                    key={`bar-${d.time}`}
                                    x={barX}
                                    y={upsideDown ? 0 : barY}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={color}
                                    style={{ stroke: '1px solid white' }}
                                />
                            );
                        })}
                    </Group>
                </svg>
            )}
        </ParentSize>
    );
};
