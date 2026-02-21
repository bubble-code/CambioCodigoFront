import { useRef, useEffect } from 'react';
import { Button, Select, Tooltip } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { IA_MODULES } from '../constants/iaModules';

const IAInput = ({
    input,
    onInputChange,
    onSend,
    isThinking,
    activeSession,
    selectedModule,
    onModuleChange,
}) => {
    const textareaRef = useRef(null);

    /* Auto-crecer textarea */
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const canSend = input.trim().length > 0 && !isThinking;

    return (
        <div style={{ padding: '12px 16px' }}>
            <div
                style={{
                    maxWidth: 760,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    background: 'var(--app-surface)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 16,
                    padding: '10px 14px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                }}
            >
                {/* Selector de módulo — deshabilitado si hay sesión activa */}
                <Tooltip
                    title={activeSession ? 'Módulo fijado al crear la sesión' : 'Seleccionar módulo'}
                    placement="top"
                >
                    <Select
                        value={activeSession?.moduleId ?? selectedModule.id}
                        onChange={(val) => onModuleChange(IA_MODULES.find(m => m.id === val))}
                        disabled={!!activeSession}
                        size="small"
                        style={{ flexShrink: 0, alignSelf: 'center', width: 160 }}
                        options={IA_MODULES.map(m => ({ value: m.id, label: `${m.icon} ${m.label}` }))}
                    />
                </Tooltip>

                {/* Textarea nativo estilizado — antd Input.TextArea no permite el comportamiento exacto */}
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta… (Shift+Enter para nueva línea)"
                    style={{
                        flex: 1,
                        resize: 'none',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--app-text)',
                        fontSize: 13,
                        lineHeight: 1.6,
                        minHeight: 24,
                        maxHeight: 160,
                        caretColor: '#4f6ef7',
                        fontFamily: 'inherit',
                    }}
                />

                {/* Botón enviar */}
                <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={onSend}
                    disabled={!canSend}
                    loading={isThinking}
                    size="middle"
                    style={{ flexShrink: 0, alignSelf: 'flex-end' }}
                />
            </div>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--app-muted)', marginTop: 6, marginBottom: 0 }}>
                Las consultas se guardan en el navegador · Enter para enviar · Shift+Enter para nueva línea
            </p>
        </div>
    );
};

export default IAInput;
