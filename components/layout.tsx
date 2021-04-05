import React, { useState } from 'react'
import { Layout, Image, Tag } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons'
import styles from './layout.module.css'
import SiteMenu from './sitemenu'
import Link from 'next/link';

const { Header, Sider, Content, Footer } = Layout;
const SiteLayout = ({
    children,
    home
}: {
    children: React.ReactNode
    home?: boolean
}) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    return (
        <Layout style={{ height: "100vh", overflow: "auto"}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Link href={'/'}  >
                        <div className={styles.logo}>
                            <Image
                                preview={false}
                                className={styles['logo-img']}
                                width={!collapsed ? 110 : 60}
                                height={!collapsed ? 60 : 40}
                                src="/images/arf-logo.png"
                            />
                        </div>
                    </Link>
                <SiteMenu />
            </Sider>
            <Layout className={styles["site-layout"]}>
                <Header className={styles["site-layout-background"]} style={{ padding: 0 }}>
                    {
                        collapsed ?
                            <MenuUnfoldOutlined
                                className={styles.trigger}
                                onClick={toggleCollapsed}
                            /> :
                            <MenuFoldOutlined
                                className={styles.trigger}
                                onClick={toggleCollapsed}
                            />
                    }
                </Header>
                <Content
                    className={styles.trigger}
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        backgroundColor: '#fff',
                        overflow: "auto"
                    }}
                >
                   {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <Tag color="blue">
                        Scan Receipt App - Arfitect ©{new Date().getFullYear()}
                    </Tag>
                </Footer>
            </Layout>
        </Layout>
    )
}

export default SiteLayout;