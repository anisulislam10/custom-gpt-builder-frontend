
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiCopy, FiEye, FiCheck, FiCode, FiSettings } from 'react-icons/fi';
import { useSelector } from  'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillCollectionFill, BsFillPatchPlusFill } from 'react-icons/bs';

const EmbedWidget = ({ nodes, edges, flowId, websiteDomain }) => {
  const [embedType, setEmbedType] = useState('js');
  const [position, setPosition] = useState('bottom-right');
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#7C3AED',
    secondaryColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    buttonTextColor: '#FFFFFF',
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const flowState = useSelector((state) => state.flowBuilder);
  const { data: session } = useSession();
  const iframeRef = useRef(null);

  // Update ChatbotConfig and notify iframe on theme/position change
  useEffect(() => {
    const config = {
      flowId: flowId || 'your-flow-id',
      userId: session?.user?.id || 'your-user-id',
      websiteDomain: websiteDomain || 'your-website.com',
      position,
      theme: {
        primary: customTheme.primaryColor,
        secondary: customTheme.secondaryColor,
        background: customTheme.backgroundColor,
        text: customTheme.textColor,
        buttonText: customTheme.buttonTextColor,
      },
    };

    window.ChatbotConfig = config;

    // Notify iframe of config changes
    if (previewMode && iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'updateChatbotConfig',
            config,
          },
          '*'
        );
      } catch (error) {
        console.error('[EmbedWidget] Error sending postMessage to iframe:', error);
      }
    }

    // Re-initialize chatbot if already loaded
    if (window.initChatbot && document.getElementById('chatbot-container')) {
      try {
        window.initChatbot();
      } catch (error) {
        console.error('[EmbedWidget] Error re-initializing chatbot:', error);
      }
    }
  }, [customTheme, position, flowId, session, websiteDomain, previewMode]);

  useEffect(() => {
    if (previewMode && nodes.length > 0) {
      const incomingEdges = edges.reduce((acc, edge) => {
        acc[edge.target] = true;
        return acc;
      }, {});
      const startNode = nodes.find((node) => !incomingEdges[node.id]) || nodes[0];
      if (startNode) {
        setCurrentNodeId(startNode.id);
        setChatHistory([{ node: startNode, userInput: null }]);
      }
    } else {
      setCurrentNodeId(null);
      setChatHistory([]);
    }
  }, [previewMode, nodes, edges]);

  const generateJsSnippet = () => {
    return `
<script crossorigin="anonymous" src="${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/script.js"></script>
<script>
  window.ChatbotConfig = {
    flowId: "${flowId || 'your-flow-id'}",
    userId: "${session?.user?.id || 'your-user-id'}",
    websiteDomain: "${websiteDomain || 'your-website.com'}",
    position: "${position}",
    theme: {
      primary: "${customTheme.primaryColor}",
      secondary: "${customTheme.secondaryColor}",
      background: "${customTheme.backgroundColor}",
      text: "${customTheme.textColor}",
      buttonText: "${customTheme.buttonTextColor}"
    }
  };
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initChatbot();
  } else {
    document.addEventListener('DOMContentLoaded', window.initChatbot);
  }
</script>
    `.trim();
  };

  const generateReactSnippet = () => {
    return `
import { useEffect } from 'react';

export default function ChatbotLoader() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/script.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      window.ChatbotConfig = {
        flowId: "${flowId || 'your-flow-id'}",
        userId: "${session?.user?.id || 'your-user-id'}",
        websiteDomain: "${websiteDomain || 'your-website.com'}",
        position: "${position}",
        theme: {
          primary: "${customTheme.primaryColor}",
          secondary: "${customTheme.secondaryColor}",
          background: "${customTheme.backgroundColor}",
          text: "${customTheme.textColor}",
          buttonText: "${customTheme.buttonTextColor}"
        }
      };
      setTimeout(() => {
        if (window.initChatbot) {
          window.initChatbot();
        }
      }, 300);
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
    `.trim();
  };

  const generateAngularSnippet = () => {
    return `
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chatbot-loader',
  template: '',
})
export class ChatbotLoaderComponent implements OnInit, OnDestroy {
  private script: HTMLScriptElement;

  ngOnInit() {
    this.script = document.createElement('script');
    this.script.src = '${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/script.js';
    this.script.async = true;
    this.script.crossOrigin = 'anonymous';

    this.script.onload = () => {
      (window as any).ChatbotConfig = {
        flowId: "${flowId || 'your-flow-id'}",
        userId: "${session?.user?.id || 'your-user-id'}",
        websiteDomain: "${websiteDomain || 'your-website.com'}",
        position: "${position}",
        theme: {
          primary: "${customTheme.primaryColor}",
          secondary: "${customTheme.secondaryColor}",
          background: "${customTheme.backgroundColor}",
          text: "${customTheme.textColor}",
          buttonText: "${customTheme.buttonTextColor}"
        }
      };
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        (window as any).initChatbot();
      } else {
        document.addEventListener('DOMContentLoaded', (window as any).initChatbot);
      }
    };

    document.body.appendChild(this.script);
  }

  ngOnDestroy() {
    if (this.script) {
      document.body.removeChild(this.script);
    }
  }
}
    `.trim();
  };

  const generateFlutterSnippet = () => {
    return `
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ChatbotWidget extends StatefulWidget {
  const ChatbotWidget({Key? key}) : super(key: key);

  @override
  _ChatbotWidgetState createState() => _ChatbotWidgetState();
}

class _ChatbotWidgetState extends State<ChatbotWidget> {
  late WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x${customTheme.backgroundColor.replace('#', '')}))
      ..loadRequest(Uri.parse(
          '${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/${flowId || 'your-flow-id'}/${session?.user?.id || 'your-user-id'}?domain=${encodeURIComponent(websiteDomain || 'your-website.com')}&theme=${encodeURIComponent(JSON.stringify({
            primary: customTheme.primaryColor,
            secondary: customTheme.secondaryColor,
            background: customTheme.backgroundColor,
            text: customTheme.textColor,
            buttonText: customTheme.buttonTextColor,
          }))}&position=${position}&preview=true'
      ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 380,
      height: 600,
      decoration: BoxDecoration(
        color: Color(0x${customTheme.backgroundColor.replace('#', '')}),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Color(0x${customTheme.primaryColor.replace('#', '')}), width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 15,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: WebViewWidget(controller: _controller),
    );
  }
}
    `.trim();
  };

  const generateIframeCode = () => {
    return `
<iframe
  src="${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/${flowId || 'your-flow-id'}/${session?.user?.id || 'your-user-id'}?domain=${encodeURIComponent(websiteDomain || 'your-website.com')}&theme=${encodeURIComponent(JSON.stringify({
    primary: customTheme.primaryColor,
    secondary: customTheme.secondaryColor,
    background: customTheme.backgroundColor,
    text: customTheme.textColor,
    buttonText: customTheme.buttonTextColor,
  }))}&position=${position}&preview=true"
  style="width: 400px; height: 600px; border: none; position: fixed; ${position.replace('-', ': ')}: 20px;"
  allowtransparency="true"
></iframe>
    `.trim();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied to clipboard!', {
        style: {
          background: customTheme.backgroundColor,
          color: customTheme.textColor,
          border: `1px solid ${customTheme.primaryColor}`,
          borderRadius: '8px',
        },
      });
    }).catch((error) => {
      console.error('[EmbedWidget] Error copying to clipboard:', error);
      toast.error('Failed to copy code');
    });
  };

  const handleThemeChange = (key, value) => {
    setCustomTheme((prev) => ({ ...prev, [key]: value }));
  };

  const getLanguage = () => {
    switch (embedType) {
      case 'react': return 'jsx';
      case 'angular': return 'typescript';
      case 'flutter': return 'dart';
      case 'iframe': return 'html';
      default: return 'javascript';
    }
  };

  const getCurrentCode = () => {
    switch (embedType) {
      case 'js': return generateJsSnippet();
      case 'react': return generateReactSnippet();
      case 'angular': return generateAngularSnippet();
      case 'flutter': return generateFlutterSnippet();
      case 'iframe': return generateIframeCode();
      default: return generateJsSnippet();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-indigo-50 via-white to-amber-50 rounded-3xl shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto border border-white/20"
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            Embed Your Chatbot
          </h2>
          <p className="text-gray-600 text-sm">
            {websiteDomain ? `Integrate with ${websiteDomain}` : 'Add the chatbot to your website'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['js', 'react', 'angular', 'flutter', 'iframe'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                embedType === type
                  ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setEmbedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {[
          { id: 'code', icon: FiCode, label: 'Code' },
          { id: 'customize', icon: BsFillPatchPlusFill, label: 'Customize' },
          { id: 'preview', icon: FiEye, label: 'Preview' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-2 font-medium flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Code Tab */}
        {activeTab === 'code' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-300 ml-3 text-xs sm:text-sm font-mono">
                  {embedType === 'js' ? 'script.js' :
                   embedType === 'react' ? 'ChatbotLoader.jsx' :
                   embedType === 'angular' ? 'chatbot-loader.component.ts' :
                   embedType === 'flutter' ? 'chatbot_widget.dart' : 'index.html'}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(getCurrentCode())}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 text-xs sm:text-sm ${
                  copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
            <CodeBlock code={getCurrentCode()} language={getLanguage()} />
          </motion.div>
        )}

        {/* Customize Tab */}
        {activeTab === 'customize' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {/* Position Selector */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiSettings className="text-purple-600 w-5 h-5" /> Widget Position
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((pos) => (
                  <motion.button
                    key={pos}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPosition(pos)}
                    className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all text-center ${
                      position === pos
                        ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {pos.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Customizer */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
                <BsFillCollectionFill className="text-purple-600 w-5 h-5" /> Theme Colors
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {[
                  { label: 'Primary', key: 'primaryColor' },
                  { label: 'Secondary', key: 'secondaryColor' },
                  { label: 'Background', key: 'backgroundColor' },
                  { label: 'Text', key: 'textColor' },
                  { label: 'Button Text', key: 'buttonTextColor' },
                ].map(({ label, key }) => (
                  <motion.div
                    key={key}
                    className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="w-24 sm:w-28 text-sm sm:text-base font-medium text-gray-800">{label}</label>
                    <motion.input
                      type="color"
                      value={customTheme[key]}
                      onChange={(e) => handleThemeChange(key, e.target.value)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-purple-400 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <input
                      type="text"
                      value={customTheme[key]}
                      onChange={(e) => handleThemeChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-300 transition-colors"
                      placeholder="#FFFFFF"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode(!previewMode)}
              className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white rounded-full shadow-md flex items-center gap-2 text-sm font-medium"
            >
              <FiEye className="w-4 h-4" /> {previewMode ? 'Hide Preview' : 'Show Preview'}
            </motion.button>

            <AnimatePresence>
              {previewMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-[360px] sm:max-w-[400px] bg-gray-100 rounded-2xl shadow-xl overflow-hidden p-3 sm:p-4 border border-gray-200 relative"
                >
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-300 rounded-full"></div>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="h-8 bg-gradient-to-r from-purple-600 to-amber-500 flex items-center px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        <div className="w-2 h-2 rounded-full bg-white/30"></div>
                      </div>
                      <span className="text-white text-xs font-medium ml-2">Chatbot Preview</span>
                    </div>
                    <iframe
                      ref={iframeRef}
                      src={`${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/${flowId || 'your-flow-id'}/${session?.user?.id || 'your-user-id'}?domain=${encodeURIComponent(websiteDomain || 'your-website.com')}&theme=${encodeURIComponent(JSON.stringify({
                        primary: customTheme.primaryColor,
                        secondary: customTheme.secondaryColor,
                        background: customTheme.backgroundColor,
                        text: customTheme.textColor,
                        buttonText: customTheme.buttonTextColor,
                      }))}&position=${position}&preview=true`}
                      className="w-full h-[500px] sm:h-[600px] border-0"
                      allowtransparency="true"
                      title="Chatbot preview"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const CodeBlock = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="p-4 sm:p-5 overflow-auto text-xs sm:text-sm max-h-[400px] sm:max-h-[500px] bg-gray-900">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default EmbedWidget;