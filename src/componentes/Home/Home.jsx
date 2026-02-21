import { motion } from "framer-motion";

const FAVRAM_LETTERS = "FAVRAM".split("");

const letterVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3 + i * 0.1,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};


const Home = () => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-full overflow-hidden relative"
            style={{ background: "var(--app-bg)" }}
        >


            {/* Contenido principal */}
            <div className="flex flex-col items-center gap-5 z-10 px-6 text-center">

                {/* Línea de acento superior */}
                <motion.div
                    className="h-px w-36"
                    style={{
                        background: "linear-gradient(to right, transparent, var(--app-accent), transparent)",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />

                {/* FAVRAM — reveal letra por letra */}
                <div className="flex gap-1 sm:gap-2" aria-label="FAVRAM">
                    {FAVRAM_LETTERS.map((letter, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={letterVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                                fontWeight: 900,
                                letterSpacing: "0.05em",
                                color: "var(--app-text)",
                                fontFamily: "'Segoe UI', sans-serif",
                                textShadow: "0 0 60px rgba(59,130,246,0.25)",
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>

                {/* Línea de acento inferior */}
                <motion.div
                    className="h-px w-56"
                    style={{
                        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                />
            </div>
        </div>
    );
};

export default Home;
