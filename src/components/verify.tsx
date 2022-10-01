import { useCurrentVerification } from '../atoms/verifcation';

const Picture = () => {
    const url = '/img1.png';

    return (
        <picture className="w-full lg:my-auto lg:w-max">
            <img src={url} alt="the verication image" />
        </picture>
    );
};

const SideBar = () => {
    const currentVerification = useCurrentVerification();
    console.log(currentVerification);
    return (
        <div className="mr-auto flex w-full flex-col lg:ml-6 lg:w-[30vw] ">
            <h1 className="text-2xl">Metadata</h1>
            <table className="mx-auto w-9/12 lg:w-full">
                <tbody>
                    <tr>
                        <td className="font-bold">Type</td>
                        <td className="w-min">SUV</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Direction</td>
                        <td className="w-min">Out</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Colour</td>
                        <td className="w-min">red</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Location</td>
                        <td className="w-min">UK</td>
                    </tr>
                </tbody>
            </table>
            <p className="mx-auto text-2xl font-bold">ABCI102</p>
            <div className="my-6 flex w-full justify-center">
                <button className="mx-4 aspect-square h-20 rounded-md bg-rose-700 px-4 py-2 text-white">
                    Reject
                </button>
                <button className="aspect-square h-20 rounded-md bg-emerald-400 px-4 py-2 text-white">
                    Accept
                </button>
            </div>
            {currentVerification && (
                <pre>{JSON.stringify(currentVerification, null, 2)}</pre>
            )}
        </div>
    );
};

export const Verify = () => {
    return (
        <div className="flex w-full flex-col justify-center lg:flex-row lg:justify-between">
            <Picture />
            <SideBar />
        </div>
    );
};
