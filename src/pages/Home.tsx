import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  // 使用防抖处理输入，避免频繁生成二维码
  const debouncedText = useDebounce(inputText, 800);
  
  // 当防抖后的文本变化时，触发二维码生成
  useState(() => {
    if (debouncedText.trim()) {
      setIsGenerating(true);
      
      // 模拟生成延迟，实际项目中可能不需要
      const timer = setTimeout(() => {
        setIsGenerating(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  });
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter 清空输入
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      setInputText('');
    }
  };
  
  // 复制二维码到剪贴板
  const handleCopyQRCode = async () => {
    if (!debouncedText.trim()) {
      toast('请先输入内容生成二维码');
      return;
    }
    
    try {
      // 获取canvas元素
      const canvas = qrCodeRef.current?.querySelector('canvas');
      if (!canvas) return;
      
      // 将canvas转换为blob，然后复制到剪贴板
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast('二维码已复制到剪贴板');
      });
    } catch (error) {
      toast('复制失败，请右键保存二维码');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 头部 */}
      <motion.header 
        className="py-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          <i className="fa-solid fa-qrcode mr-3 text-blue-500"></i>极简二维码生成器
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          粘贴网址或文本，即刻生成可保存的二维码，无需注册登录
        </p>
      </motion.header>
      
      {/* 主内容区 */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-8">
        {/* 输入区域 */}
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6">
            <div className="relative mb-4">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="粘贴你的网址或文本链接..."
                className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none dark:bg-gray-800 dark:text-white"
              />
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="清空输入"
                >
                  <i className="fa-solid fa-times-circle"></i>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>支持HTTP/HTTPS链接和纯文本</span>
              <span className="flex items-center">
                <i className="fa-regular fa-keyboard mr-1"></i>
                Ctrl+Enter 清空
              </span>
            </div>
          </div>
          
          {/* 使用说明 */}
          <div className="mt-6 bg-white dark:bg-gray-700 rounded-2xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <i className="fa-solid fa-circle-info mr-2 text-blue-500"></i>使用说明
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>输入网址或文本，系统会自动生成二维码</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>右键点击二维码图片，选择"保存图片"即可下载</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>点击二维码可复制到剪贴板（仅支持现代浏览器）</span>
              </li>
            </ul>
          </div>
        </motion.div>
        
        {/* 二维码显示区域 */}
        <motion.div
          className="w-full max-w-md flex flex-col items-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 w-full flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">生成的二维码</h2>
            
            {debouncedText.trim() ? (
              <div className="relative">
                <div 
                  ref={qrCodeRef}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-inner cursor-pointer"
                  onClick={handleCopyQRCode}
                  title="点击复制二维码到剪贴板"
                >
                  {isGenerating ? (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <QRCode 
                      value={debouncedText} 
                      size={200} 
                      level="H" 
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  )}
                </div>
                
                {/* 悬浮提示 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  右键保存图片
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl">
                <i className="fa-solid fa-qrcode text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">输入内容后将显示二维码</p>
              </div>
            )}
            
            {/* 额外操作按钮 */}
            {debouncedText.trim() && (
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleCopyQRCode}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                >
                  <i className="fa-regular fa-copy mr-2"></i>
                  复制二维码
                </button>
                
                <button
                  onClick={() => {
                    // 强制浏览器下载二维码图片
                    const canvas = qrCodeRef.current?.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = 'qrcode.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                >
                  <i className="fa-solid fa-download mr-2"></i>
                  下载图片
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      
      {/* 页脚 */}
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2025 极简二维码生成器 | 保护你的隐私，不存储任何数据</p>
      </footer>
    </div>
  );
}