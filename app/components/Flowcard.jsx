'use client';
import { useState } from 'react';
import {
  FiTrash2,
  FiEdit2,
  FiClock,
  FiActivity,
  FiMoreVertical,
  FiZap,
  FiBarChart2,
  FiMessageSquare,
  FiFigma,
  FiShuffle,
   // Added for View Form Responses icon
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaShare } from 'react-icons/fa';

const FlowCard = ({ flow, onDelete, userId, userEmail }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();
console.log('[FlowCard] Rendered flow:', flow);
  const handleDelete = async () => {
    try {
      await onDelete(flow._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <motion.div
      key={flow._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden group"
    >
      {flow.isActive && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center shadow-md">
          <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
          Active
          <div className="absolute inset-0 overflow-hidden rounded-tr-lg rounded-bl-lg">
            <div className="absolute -inset-12 bg-gradient-to-r from-white/30 via-white/0 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-45"></div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-4 shadow-inner border border-gray-100">
              <FiZap
                className={`text-xl ${flow.isActive ? 'text-blue-600 drop-shadow-sm' : 'text-gray-400'} transition-transform duration-300 group-hover:scale-110`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                {flow.name}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <FiClock className="mr-1" />
                <span>Updated {new Date(flow.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FiMoreVertical className="text-lg" />
            </button>
     <AnimatePresence>
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute right-0 mt-3 w-56 h-32 bg-white rounded-xl shadow-xl z-50 border border-gray-200 overflow-hidden"
        >
          <div className="py-1">
            <Link
              href={`/interactions/${flow._id}/${userId}`}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
              onClick={() => setShowMenu(false)}
            >
              <FiMessageSquare className="w-5 h-5 mr-3 text-gray-500" />
              View Interactions
            </Link>
            <Link
              href={`/responses/${session.user.id}`}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 border-t border-gray-100"
              onClick={() => setShowMenu(false)}
            >
              <FiShuffle className="w-5 h-5 mr-3 text-gray-500" />
              View Form Responses
            </Link>
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 border-t border-gray-100"
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowMenu(false);
              }}
            >
              <FiTrash2 className="w-5 h-5 mr-3 text-red-500" />
              Delete
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <div className="relative mr-2">
              <FiActivity className="text-blue-500" />
              <div className="absolute -inset-1 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span>{flow.nodesCount || 0} Nodes</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="relative mr-2">
              <FiBarChart2 className="text-green-500" />
              <div className="absolute -inset-1 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span>{flow.edgesCount || 0} Edges</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/chatbot?flow=${flow._id}`}
            className="flex-1 flex items-center justify-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group/edit"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="flex items-center text-sm font-medium"
            >
              <FiEdit2 className="mr-2 transition-transform group-hover/edit:rotate-12" /> Edit Flow
            </motion.span>
          </Link>
            <Link
            href={`/flows/${flow._id}`}
            className="flex-1 flex items-center justify-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group/edit"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="flex items-center text-sm font-medium"
            >
              <FaShare className="mr-2 transition-transform group-hover/edit:rotate-12" /> Invite
            </motion.span>
          </Link>
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex items-center bg-gray-50 rounded-lg shadow-inner"
              >
                <button
                  onClick={handleDelete}
                  className="whitespace-nowrap px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium flex items-center text-sm"
                >
                  <FiTrash2 className="mr-2" /> Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="whitespace-nowrap px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 ml-1 font-medium text-sm"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowCard;