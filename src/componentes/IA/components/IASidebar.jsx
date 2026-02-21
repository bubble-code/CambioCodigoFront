import { Button, Select, List, Typography, Tag, Tooltip, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { IA_MODULES } from '../constants/iaModules';

const { Text } = Typography;

const IASidebar = ({
    sessions,
    activeId,
    selectedModule,
    onSelectSession,
    onDeleteSession,
    onNewSession,
    onModuleChange,
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px 8px' }}>

            {/* Selector de módulo */}
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 4, marginBottom: 6, display: 'block' }}>
                Módulo
            </Text>
            <Select
                value={selectedModule.id}
                onChange={(val) => onModuleChange(IA_MODULES.find(m => m.id === val))}
                style={{ width: '100%', marginBottom: 10 }}
                options={IA_MODULES.map(m => ({ value: m.id, label: `${m.icon} ${m.label}` }))}
                size="small"
            />

            {/* Nueva consulta */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onNewSession}
                block
                style={{ marginBottom: 16 }}
            >
                Nueva consulta
            </Button>

            {/* Historial */}
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 4, marginBottom: 6, display: 'block' }}>
                Historial
            </Text>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sessions.length === 0 ? (
                    <Empty
                        description={<span style={{ fontSize: 12 }}>Sin consultas guardadas</span>}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ marginTop: 24 }}
                    />
                ) : (
                    <List
                        dataSource={sessions}
                        renderItem={(session) => {
                            const isActive = session.id === activeId;
                            const preview = session.messages.find(m => m.role === 'user')?.content;
                            const module = IA_MODULES.find(m => m.id === session.moduleId);

                            return (
                                <List.Item
                                    key={session.id}
                                    onClick={() => onSelectSession(session.id)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: 8,
                                        padding: '8px 10px',
                                        marginBottom: 2,
                                        background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        transition: 'background 0.15s',
                                        border: 'none',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                    extra={
                                        <Tooltip title="Eliminar">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                danger
                                                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                                style={{ opacity: 0.6 }}
                                            />
                                        </Tooltip>
                                    }
                                >
                                    <List.Item.Meta
                                        title={
                                            <Text style={{ fontSize: 12, fontWeight: 500 }} ellipsis>
                                                {module?.icon} {session.moduleLabel}
                                            </Text>
                                        }
                                        description={
                                            <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
                                                {preview ?? 'Consulta vacía'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default IASidebar;
