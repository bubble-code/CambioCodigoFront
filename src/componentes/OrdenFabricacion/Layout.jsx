import { Outlet } from 'react-router-dom';
import { Menu } from "../Menu/Menu";
import { MenuItems } from './menuItems';

export const LayoutOF = () => {
    return (
        <div className="flex h-full w-full">
            <div className="w-1/8 h-3/4 p-2">
                <Menu items={MenuItems} classname={"font-roboto text-sm "} title={"Ordenes de Fabricacion"} />
            </div>
            <div className="w-11/12 p-2 mr-2">
                <Outlet />
            </div>
        </div>
    )
}
