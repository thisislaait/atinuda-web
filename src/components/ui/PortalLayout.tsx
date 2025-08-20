// components/PortalLayout.tsx

import SidebarNav from "../layout/Nav/SidebarNav";

const PortalLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <SidebarNav />
            <main className="ml-56 p-6 overflow-y-auto">{children}</main>
        </div>
    );
};

export default PortalLayout;
