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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-stone-700">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 w-full md:w-1/4 border-r border-gray-300 text-white bg-gray-800 min-h-screen overflow-y-auto px-6 py-8`}
      >
        <nav className="w-full flex flex-col items-center md:items-start space-y-8 bg-gray-900 rounded-lg p-6 shadow-xl">
          {/* Admin Picture */}
          <div className="flex justify-center w-full mb-4"></div>
          <h2 className="text-2xl font-semibold text-center text-white border-b border-gray-600 pb-3 mb-6">
            Admin!
          </h2>
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
              className="flex items-center w-full px-5 py-3 text-lg font-medium text-gray-300 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-700 rounded-lg shadow-md"
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
      <div className="flex-1 md:w-3/4 p-6 overflow-auto bg-white rounded-lg shadow-inner">
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="posts" element={<Posts />} />
          <Route path="albums" element={<Albums />} />
          <Route path="photos" element={<Photos />} />
          <Route path="todos" element={<Todos />} />
          <Route path="comments" element={<Comments />} />
        </Routes>
      </div>
    </div>
  );
}
