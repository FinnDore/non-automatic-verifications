const Home = () => {
    return (
        <div className="flex h-full w-full">
            <h1 className="m-auto  flex flex-col">
                <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-6xl  text-4xl font-bold text-transparent">
                    Non Automatic Verifications
                </span>
                <div
                    className="
                mx-auto
                text-base"
                >
                    This tool allows the user&apos;s with keycloak accounts to
                    verify{' '}
                    <span className="font-bold italic">verifications</span>
                </div>
            </h1>
        </div>
    );
};

export default Home;
