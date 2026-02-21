import { useEffect, useRef } from 'react';
import { Avatar, Spin, Typography, Tag, Empty, Table } from 'antd';
import { RobotOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

/* ── Tabla de resultados SQL ─────────────────────────────── */
const ResultTable = ({ results }) => {
    if (!results || results.length === 0) return null;

    const columns = Object.keys(results[0]).map(key => ({
        title: key,
        dataIndex: key,
        key,
        ellipsis: true,
        render: (val) => (val === null ? <Text type="secondary">NULL</Text> : String(val)),
    }));

    return (
        <div style={{ marginTop: 10 }}>
            <Table
                dataSource={results.map((r, i) => ({ ...r, _key: i }))}
                columns={columns}
                rowKey="_key"
                size="small"
                pagination={results.length > 10 ? { pageSize: 10, size: 'small' } : false}
                scroll={{ x: 'max-content' }}
                style={{ fontSize: 12 }}
            />
        </div>
    );
};

/* ── Burbuja de mensaje ──────────────────────────────────── */
const MessageBubble = ({ msg }) => {
    const isUser = msg.role === 'user';
    const isError = msg.isError;

    return (
        <div style={{ display: 'flex', gap: 10, justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
            {!isUser && (
                <Avatar
                    icon={<RobotOutlined />}
                    style={{ backgroundColor: '#4f6ef7', flexShrink: 0, marginTop: 2 }}
                    size={32}
                />
            )}

            <div style={{
                maxWidth: '72%',
                background: isUser
                    ? '#4f6ef7'
                    : isError
                        ? 'rgba(255,77,79,0.12)'
                        : 'var(--app-surface)',
                border: isUser ? 'none' : '1px solid var(--app-border)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
            }}>
                {/* Texto de respuesta */}
                <Paragraph
                    style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: isUser ? '#fff' : isError ? '#ff4d4f' : 'var(--app-text)',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {isError && <WarningOutlined style={{ marginRight: 6 }} />}
                    {msg.content}
                </Paragraph>

                {/* SQL generado */}
                {msg.sql && (
                    <div style={{ marginTop: 8 }}>
                        <Tag color="blue" style={{ marginBottom: 4 }}>SQL generado</Tag>
                        <pre style={{
                            margin: 0,
                            fontSize: 11,
                            background: 'rgba(0,0,0,0.25)',
                            borderRadius: 6,
                            padding: '6px 10px',
                            overflowX: 'auto',
                            color: '#93c5fd',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}>
                            {msg.sql}
                        </pre>
                    </div>
                )}

                {/* Tabla de resultados */}
                {msg.results && msg.results.length > 0 && (
                    <ResultTable results={msg.results} />
                )}
            </div>

            {isUser && (
                <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: 2 }}
                    size={32}
                />
            )}
        </div>
    );
};

/* ── Indicador "pensando" ────────────────────────────────── */
const ThinkingBubble = () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Avatar
            icon={<RobotOutlined />}
            style={{ backgroundColor: '#4f6ef7', flexShrink: 0, marginTop: 2 }}
            size={32}
        />
        <div style={{
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            borderRadius: '18px 18px 18px 4px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
        }}>
            <Spin size="small" />
            <Text type="secondary" style={{ marginLeft: 10, fontSize: 12 }}>
                Analizando consulta…
            </Text>
        </div>
    </div>
);

/* ── Pantalla de bienvenida ──────────────────────────────── */
const WelcomeScreen = ({ modules, onSelectModule }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
        <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
        }}>
            🔍
        </div>
        <Text strong style={{ fontSize: 15, color: 'var(--app-text)' }}>
            Consulta la base de datos en lenguaje natural
        </Text>
        <Text type="secondary" style={{ fontSize: 13, textAlign: 'center', maxWidth: 380 }}>
            Selecciona un módulo y escribe tu pregunta. El sistema la convertirá en SQL automáticamente.
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {modules.map(m => (
                <Tag
                    key={m.id}
                    onClick={() => onSelectModule(m)}
                    style={{ cursor: 'pointer', padding: '4px 10px', fontSize: 12, borderRadius: 20 }}
                >
                    {m.icon} {m.label}
                </Tag>
            ))}
        </div>
    </div>
);

/* ── Componente principal de mensajes ────────────────────── */
const IAMessages = ({ activeSession, isThinking, modules, onSelectModule }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeSession?.messages.length, isThinking]);

    if (!activeSession) {
        return <WelcomeScreen modules={modules} onSelectModule={onSelectModule} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760, margin: '0 auto', width: '100%' }}>
            {activeSession.messages.length === 0 && !isThinking && (
                <Empty
                    description={
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Haz tu primera consulta sobre <strong>{activeSession.moduleLabel}</strong>
                        </Text>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ marginTop: 48 }}
                />
            )}
            {activeSession.messages.map((msg, i) =>
                msg.thinking ? null : <MessageBubble key={i} msg={msg} />
            )}
            {isThinking && <ThinkingBubble />}
            <div ref={bottomRef} />
        </div>
    );
};

export default IAMessages;
