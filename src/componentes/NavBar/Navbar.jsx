import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navigation = [
    { name: 'Inicio', href: "/" },
    { name: 'Clonador', href: "clonador" },
    { name: 'Consulta IA', href: "consultaIA" },
];

const MiNavbar = () => {
    return (
        <Disclosure
            as="nav"
            style={{
                backgroundColor: "var(--app-surface)",
                borderBottom: "1px solid var(--app-border)",
            }}
        >
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 items-center justify-between">

                            {/* Logo */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <img
                                    alt="Favram S.L."
                                    src="https://favram.com/contenidosfavram/uploads/2016/03/logo_favram_300x105.png"
                                    className="h-7 w-auto"
                                    style={{ opacity: 0.85 }}
                                />
                                <div
                                    className="hidden sm:block h-4 w-px"
                                    style={{ background: "var(--app-border)" }}
                                />
                                <span
                                    className="hidden sm:block text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "var(--app-muted)", letterSpacing: "0.2em" }}
                                >
                                    MES
                                </span>
                            </div>

                            {/* Links — desktop */}
                            <div className="hidden sm:flex items-center gap-1">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        end={item.href === "/"}
                                        className={({ isActive }) =>
                                            [
                                                "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150",
                                                isActive
                                                    ? "text-blue-600"
                                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                                            ].join(" ")
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {item.name}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="navbar-indicator"
                                                        className="absolute inset-0 rounded-md"
                                                        style={{
                                                            background: "rgba(0,122,255,0.10)",
                                                            border: "1px solid rgba(0,122,255,0.30)",
                                                        }}
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Botón menú móvil */}
                            <div className="sm:hidden">
                                <DisclosureButton
                                    className="inline-flex items-center justify-center rounded-md p-2 transition-colors"
                                    style={{ color: "var(--app-muted)" }}
                                >
                                    {open
                                        ? <XMarkIcon className="h-5 w-5" />
                                        : <Bars3Icon className="h-5 w-5" />
                                    }
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    {/* Menú móvil desplegable */}
                    <DisclosurePanel className="sm:hidden">
                        <div
                            className="px-3 pb-3 pt-2 space-y-1"
                            style={{ borderTop: "1px solid var(--app-border)" }}
                        >
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    end={item.href === "/"}
                                    className={({ isActive }) =>
                                        [
                                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "text-blue-600 border"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                                        ].join(" ")
                                    }
                                    style={({ isActive }) =>
                                        isActive
                                            ? { background: "rgba(0,122,255,0.10)", borderColor: "rgba(0,122,255,0.30)" }
                                            : {}
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};

export default MiNavbar;