import React from "react"
import { Menu } from "antd"
import Link from 'next/link'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons'


const SiteMenu = () => {
    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UploadOutlined />}>
                <Link href={'/'}>
                    Home
                </Link>
            </Menu.Item><Menu.Item key="2" icon={<VideoCameraOutlined />}>
                <Link href={'/receipt-list'}>
                Receipt List
                </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
                <Link href={'/about'}>
                    About
                </Link>
            </Menu.Item>
        </Menu>
    )
}

export default SiteMenu;