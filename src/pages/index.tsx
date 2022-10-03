import { VrnStatus } from '@prisma/client';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
    Select,
    SelectIcon,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select';
import { Box } from '../cocaine/box';
import { numbers, Ticker } from '../cocaine/ticker';
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

const Stat = ({ num, title }: { num: string; title: string }) => (
    <div className="rounded-none py-6 pl-6 pr-24">
        <h1 className="text-sm">{title}</h1>
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
            <div className=" flex">
                <h1 className="mr-4 flex flex-col bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-4xl font-bold text-transparent">
                    STATS
                </h1>
                <CustomSelect placeholder={'All'} />
                <CustomSelect placeholder={'7 Days'} />
            </div>
            <Box className="my-6 flex w-full border-white/40">
                <Stat
                    num={`${pendingVerifications ?? 0}`}
                    title="Pending Verifications"
                />
                <Stat
                    num={`${verifiedVerifications ?? 0}`}
                    title="Complete Verifications"
                />
                <Stat
                    num={`${rejectedVerifications ?? 0}`}
                    title="Rejected Verifications"
                />
            </Box>

            <Box className=" my-6 ml-auto flex flex-row-reverse  ">
                <Stat num="1,000" title="Verifications /month" />
                <Stat num="2,000" title="Verifications /day" />
                <Stat num="63" title="Corrections" />
            </Box>
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
