import { AuditAction, VrnStatus } from '@prisma/client';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
    Select,
    SelectIcon,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select';
import clsx from 'clsx';
import { Box } from '../cocaine/box';
import { numbers, Ticker } from '../cocaine/ticker';
import { TimeBar } from '../components/time-bar';
import { trpc } from '../utils/trpc';

const CustomSelect = ({ placeholder }: { placeholder: string }) => (
    <Select>
        <SelectTrigger className="border-black/7 my-auto mx-2 flex cursor-pointer select-none rounded-md border py-2 px-4 text-xs transition-colors hover:bg-black/[.05] dark:border-white/40 dark:bg-black hover:dark:border-white dark:hover:bg-white/[.05]">
            <SelectValue placeholder={placeholder}></SelectValue>

            <SelectIcon className="my-auto ml-2 text-sm">
                <ChevronDownIcon />
            </SelectIcon>
        </SelectTrigger>
    </Select>
);

const Stat = ({
    num,
    title,
    end,
    color,
}: {
    num: string;
    title: string;
    end?: boolean;
    color: string;
}) => (
    <div className={clsx('rounded-none py-6 px-12')}>
        <h1 className={clsx('text-sm font-bold', color)}>{title}</h1>
        <h1 className="mt-2 flex text-5xl">
            {num.split('').map((x, i) => (
                <Ticker key={i} letter={x as typeof numbers[number]} />
            ))}
        </h1>
    </div>
);

const useStats = () => {
    const { data: pendingVerifications } =
        trpc.stats.verificationsCountByType.useQuery({
            status: VrnStatus.UNVERIFIED,
        });
    const { data: verifiedVerifications } =
        trpc.stats.completeVerifications.useQuery();
    const { data: rejectedVerifications } =
        trpc.stats.verificationsCountByType.useQuery({
            status: VrnStatus.REJECTED,
        });

    return {
        pendingVerifications,
        verifiedVerifications,
        rejectedVerifications,
    };
};

const Home = () => {
    const {
        pendingVerifications,
        verifiedVerifications,
        rejectedVerifications,
    } = useStats();
    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex w-full">
                <h1 className=" mr-auto flex flex-col bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-4xl font-bold text-transparent">
                    STATS
                </h1>
                <CustomSelect placeholder={'All'} />
                <CustomSelect placeholder={'7 Days'} />
            </div>
            <Box className="my-6  flex justify-start">
                <Stat
                    color="text-orange-500"
                    num={`${pendingVerifications ?? '0'}`}
                    title="Pending"
                />
                <Stat
                    color="text-emerald-500"
                    num={`${verifiedVerifications ?? '0'}`}
                    title="Complete"
                />
                <Stat
                    color="text-rose-500"
                    end={true}
                    num={`${rejectedVerifications ?? '0'}`}
                    title="Rejected"
                />
            </Box>

            <Box className="overflow-x-hidden py-4">
                <h1 className="text-sm text-rose-600">Rejected</h1>

                <div className="-mb-4 mt-2 flex justify-between text-xs opacity-50">
                    <h1>now</h1>
                    <h1>7 days ago</h1>
                </div>
                <div className="w-full pb-2">
                    <TimeBar
                        color="rgba(225, 29, 72, 1)"
                        action={AuditAction.VERIFICATION_REJECTED}
                    />
                </div>
                <div className=" w-full">
                    <TimeBar
                        action={AuditAction.VERIFICATION_ACCEPTED}
                        upsideDown={true}
                        color={'rgba(16, 185, 129, 1)'}
                    />
                </div>
                <div className="-mt-4 mb-2 flex justify-between text-xs opacity-50">
                    <h1>now</h1>
                    <h1>7 days ago</h1>
                </div>
                <h1 className="text-sm text-emerald-600">Complete</h1>
            </Box>
            {/* <div className="flex flex-col lg:flex-row">
                <Box className="my-6 mr-12 h-96 w-full"></Box>
                <div className="my-6 flex w-full flex-col lg:ml-auto lg:w-max">
                    <Box className="mb-6 flex flex-1 flex-row-reverse ">
                        <Stat num="1,000" title="Verifications /month" />
                        <Stat num="2,000" title="Verifications /day" />
                        <Stat num="63" title="Corrections" />
                    </Box>
                    <Box className="mt-6 flex flex-1 flex-row-reverse ">
                        <Stat num="1,000" title="Verifications /month" />
                        <Stat num="2,000" title="Verifications /day" />
                        <Stat num="63" title="Corrections" />
                    </Box>
                </div>
            </div> */}
        </div>
    );
};

export default Home;

{
    /* <div
                    className="
                mx-auto
                text-sm"
                >
                    This tool allows the user&apos;s with keycloak accounts to
                    verify{' '}
                    <span className="font-bold italic">verifications</span>
                </div> */
}
