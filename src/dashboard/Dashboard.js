import { useState } from 'react';

import { Link, Route, Routes } from 'react-router-dom';

import HamburgerMenu from '../components/HamburgerMenu';

import {
  UserOutlined,
  ReadOutlined,
  PictureOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';

import Users from './users';
import Posts from './Posts';
import Albums from './Albums';
import Photos from './Photos';
import Todos from './Todos';
import Comments from './Comments';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 z-20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 w-64 md:w-1/4 bg-gray-800 text-white border-r border-gray-300 min-h-screen overflow-y-auto`}
      >
        <nav className="flex flex-col items-center md:items-start space-y-8 p-6 shadow-lg bg-gray-900 rounded-lg">
          <div className="w-full mb-6 text-center border-b border-gray-600 pb-3">
            <h2 className="text-2xl font-semibold text-white">Admin</h2>
          </div>
          {[
            { name: 'Users', icon: <UserOutlined />, path: 'users' },
            { name: 'Posts', icon: <ReadOutlined />, path: 'posts' },
            { name: 'Albums', icon: <PictureOutlined />, path: 'albums' },
            { name: 'Photos', icon: <FileImageOutlined />, path: 'photos' },
            { name: 'Todos', icon: <CheckCircleOutlined />, path: 'todos' },
            { name: 'Comments', icon: <CommentOutlined />, path: 'comments' },
          ].map((item) => (
            <Link
              key={item.name}
              className="flex items-center w-full px-4 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-green-700 rounded-lg transition transform hover:scale-105"
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Hamburger Menu Button */}
      <div className="absolute top-4 left-4 md:hidden z-30">
        <HamburgerMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 bg-white overflow-auto rounded-lg shadow-inner">
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </div>
    </div>
  );
}
