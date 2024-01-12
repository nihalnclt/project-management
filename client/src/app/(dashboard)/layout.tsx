import RequireAuth from "../lib/RequireAuth";

export default function RootLayout({ children }: any) {
    return (
        <>
            <RequireAuth>{children}</RequireAuth>
        </>
    );
}
