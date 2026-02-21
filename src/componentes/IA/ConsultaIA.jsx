import { useState } from 'react';
import { ConfigProvider, Layout, theme, Button, Tooltip, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useIASessions } from './hooks/useIASessions';
import { IA_MODULES } from './constants/iaModules';
import IASidebar from './components/IASidebar';
import IAMessages from './components/IAMessages';
import IAInput from './components/IAInput';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const SIDER_WIDTH = 260;

const ConsultaIA = () => {
    const [siderCollapsed, setSiderCollapsed] = useState(false);
    const [input, setInput] = useState('');

    const {
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
    } = useIASessions();

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;
        setInput('');
        await sendMessage(text);
    };

    const handleSelectModule = (module) => {
        setSelectedModule(module);
        createSession(module);
    };

    return (
        <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
            <Layout style={{ height: '100%', background: 'var(--app-bg)' }}>

                {/* ── Sidebar ── */}
                <Sider
                    collapsed={siderCollapsed}
                    collapsedWidth={0}
                    width={SIDER_WIDTH}
                    style={{
                        background: 'var(--app-surface)',
                        borderRight: '1px solid var(--app-border)',
                        overflow: 'hidden',
                    }}
                >
                    <IASidebar
                        sessions={sessions}
                        activeId={activeId}
                        selectedModule={selectedModule}
                        onSelectSession={setActiveId}
                        onDeleteSession={deleteSession}
                        onNewSession={() => createSession(selectedModule)}
                        onModuleChange={setSelectedModule}
                    />
                </Sider>

                {/* ── Área principal ── */}
                <Layout style={{ background: 'var(--app-bg)' }}>

                    {/* Topbar */}
                    <Header
                        style={{
                            background: 'var(--app-surface)',
                            borderBottom: '1px solid var(--app-border)',
                            padding: '0 16px',
                            height: 48,
                            lineHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <Tooltip title={siderCollapsed ? 'Mostrar historial' : 'Ocultar historial'}>
                            <Button
                                type="text"
                                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setSiderCollapsed(c => !c)}
                                style={{ color: 'var(--app-muted)' }}
                            />
                        </Tooltip>

                        {activeSession ? (
                            <>
                                <Text style={{ fontSize: 13, color: 'var(--app-muted)' }}>Módulo:</Text>
                                <Text strong style={{ fontSize: 13, color: 'var(--app-text)' }}>
                                    {IA_MODULES.find(m => m.id === activeSession.moduleId)?.icon}{' '}
                                    {activeSession.moduleLabel}
                                </Text>
                            </>
                        ) : (
                            <Text style={{ fontSize: 13, color: 'var(--app-muted)' }}>
                                Consulta IA — Base de datos en lenguaje natural
                            </Text>
                        )}
                    </Header>

                    {/* Mensajes */}
                    <Content
                        style={{
                            overflowY: 'auto',
                            padding: '24px 16px',
                        }}
                    >
                        <IAMessages
                            activeSession={activeSession}
                            isThinking={isThinking}
                            modules={IA_MODULES}
                            onSelectModule={handleSelectModule}
                        />
                    </Content>

                    {/* Input */}
                    <IAInput
                        input={input}
                        onInputChange={setInput}
                        onSend={handleSend}
                        isThinking={isThinking}
                        activeSession={activeSession}
                        selectedModule={selectedModule}
                        onModuleChange={setSelectedModule}
                    />

                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default ConsultaIA;
