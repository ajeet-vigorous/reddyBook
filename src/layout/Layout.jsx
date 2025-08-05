
import AppSidebar from '../component/layout/AppSidebar'
import AppHeader from '../component/layout/AppHeader'
import AppContent from '../component/layout/AppContent'
import SubHeader from '../component/header/SubHeader'



const Layout = () => {


    return (
         <div className="flex flex-col h-screen overflow-hidden">
            <div className="lg:h-[60px] h-[135px] lg:bg-white bg-black hrink-0">
                <AppHeader />
            </div>
            <div className="shrink-0">
                <SubHeader />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-[280px] overflow-y-auto shrink-0 hidden xl:block">
                    <AppSidebar />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <AppContent />
                </div>
            </div>
        </div>
    )
}

export default Layout
