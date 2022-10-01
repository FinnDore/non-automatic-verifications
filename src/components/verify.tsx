const Picture = () => {
    const url = '/img1.png';

    return (
        <picture className=" w-full lg:w-max ">
            <img src={url} alt="the verication image" />
        </picture>
    );
};

const SideBar = () => {
    return (
        <div className="ml-6 mr-auto flex w-full flex-col lg:w-56 ">
            <h1 className="text-2xl ">Metadata</h1>
            <table className="w-full">
                <tbody>
                    <tr>
                        <td className="font-bold">Type</td>
                        <td>SUV</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Direction</td>
                        <td>Out</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Colour</td>
                        <td>red</td>
                    </tr>
                    <tr>
                        <td className="font-bold">Location</td>
                        <td>UK</td>
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
