import { useState, useCallback } from 'react';
import { IA_MODULES, IA_STORAGE_KEY } from '../constants/iaModules';
import { ConsultaIAService } from '../../../services/apiService';

/* ── Helpers de localStorage ─────────────────────────────── */
function loadSessions() {
    try {
        return JSON.parse(localStorage.getItem(IA_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function persist(sessions) {
    localStorage.setItem(IA_STORAGE_KEY, JSON.stringify(sessions));
}

function buildSession(module) {
    return {
        id: Date.now().toString(),
        moduleId: module.id,
        moduleLabel: module.label,
        messages: [],
        createdAt: Date.now(),
    };
}

/* ── Hook ────────────────────────────────────────────────── */
export function useIASessions() {
    const [sessions, setSessions] = useState(loadSessions);
    const [activeId, setActiveId] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedModule, setSelectedModule] = useState(IA_MODULES[0]);

    const activeSession = sessions.find(s => s.id === activeId) ?? null;

    /* Persistir y actualizar en un solo paso */
    const updateSessions = useCallback((updated) => {
        setSessions(updated);
        persist(updated);
    }, []);

    /* Crear nueva sesión */
    const createSession = useCallback((module = selectedModule) => {
        const session = buildSession(module);
        const updated = [session, ...sessions];
        updateSessions(updated);
        setActiveId(session.id);
        return session;
    }, [sessions, selectedModule, updateSessions]);

    /* Eliminar sesión */
    const deleteSession = useCallback((id) => {
        const updated = sessions.filter(s => s.id !== id);
        updateSessions(updated);
        if (activeId === id) setActiveId(updated[0]?.id ?? null);
    }, [sessions, activeId, updateSessions]);

    /* Enviar mensaje — llama al service, gestiona estado "pensando" */
    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isThinking) return;

        // Crear sesión si no hay ninguna activa
        let targetSession = activeSession;
        let base = sessions;
        if (!targetSession) {
            targetSession = buildSession(selectedModule);
            base = [targetSession, ...sessions];
        }

        const userMsg = { role: 'user', content: text, ts: Date.now() };
        const thinkMsg = { role: 'assistant', content: '', ts: Date.now() + 1, thinking: true };

        const withUser = base.map(s =>
            s.id === targetSession.id
                ? { ...s, messages: [...s.messages, userMsg, thinkMsg] }
                : s
        );
        updateSessions(withUser);
        setActiveId(targetSession.id);
        setIsThinking(true);

        try {
            const data = await ConsultaIAService.postConsulta(text, targetSession.moduleId);

            const botMsg = {
                role: 'assistant',
                content: data.answer ?? 'Sin respuesta del servidor.',
                sql: data.sql ?? null,
                results: data.results ?? [],
                ts: Date.now(),
            };

            setSessions(prev => {
                const updated = prev.map(s =>
                    s.id === targetSession.id
                        ? { ...s, messages: s.messages.filter(m => !m.thinking).concat(botMsg) }
                        : s
                );
                persist(updated);
                return updated;
            });
        } catch (err) {
            const errMsg = {
                role: 'assistant',
                content: `⚠️ ${err.message ?? 'Error de conexión con el servidor.'}`,
                ts: Date.now(),
                isError: true,
            };
            setSessions(prev => {
                const updated = prev.map(s =>
                    s.id === targetSession.id
                        ? { ...s, messages: s.messages.filter(m => !m.thinking).concat(errMsg) }
                        : s
                );
                persist(updated);
                return updated;
            });
        } finally {
            setIsThinking(false);
        }
    }, [activeSession, sessions, selectedModule, isThinking, updateSessions]);

    return {
        sessions,
        activeSession,
        activeId,
        setActiveId,
        isThinking,
        selectedModule,
        setSelectedModule,
        createSession,
        deleteSession,
        sendMessage,
    };
}
