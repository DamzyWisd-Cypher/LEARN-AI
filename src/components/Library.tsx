import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  File,
  FolderOpen,
  Trash2,
  Download,
  Eye,
  Search,
  Grid,
  List,
  Clock,
  CheckCircle,
  X,
  Plus,
  Folder
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'doc' | 'other';
  size: string;
  uploadedAt: Date;
  status: 'ready' | 'processing';
  category: string;
}

const initialFiles: FileItem[] = [
  { id: '1', name: 'Machine Learning Fundamentals.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: new Date(Date.now() - 86400000), status: 'ready', category: 'AI' },
  { id: '2', name: 'JavaScript Notes.txt', type: 'txt', size: '156 KB', uploadedAt: new Date(Date.now() - 172800000), status: 'ready', category: 'Programming' },
  { id: '3', name: 'React Tutorial.pdf', type: 'pdf', size: '5.1 MB', uploadedAt: new Date(Date.now() - 259200000), status: 'ready', category: 'Programming' },
  { id: '4', name: 'Python Basics.doc', type: 'doc', size: '890 KB', uploadedAt: new Date(Date.now() - 345600000), status: 'ready', category: 'Programming' },
  { id: '5', name: 'Data Structures Notes.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: new Date(Date.now() - 432000000), status: 'ready', category: 'Computer Science' },
  { id: '6', name: 'Neural Networks Explained.pdf', type: 'pdf', size: '3.8 MB', uploadedAt: new Date(Date.now() - 518400000), status: 'ready', category: 'AI' },
];

const categories = ['All', 'Programming', 'AI', 'Computer Science', 'Data Science', 'Web Dev'];

export default function LibraryComponent() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUpload(false);
          
          const newFile: FileItem = {
            id: Date.now().toString(),
            name: `New Document_${Date.now()}.pdf`,
            type: 'pdf',
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            uploadedAt: new Date(),
            status: 'ready',
            category: 'Programming'
          };
          
          setFiles((prev) => [newFile, ...prev]);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-400" />;
      case 'txt':
        return <File className="w-6 h-6 text-blue-400" />;
      case 'doc':
        return <FileText className="w-6 h-6 text-indigo-400" />;
      default:
        return <File className="w-6 h-6 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Programming': 'bg-blue-500/20 text-blue-400',
      'AI': 'bg-purple-500/20 text-purple-400',
      'Computer Science': 'bg-emerald-500/20 text-emerald-400',
      'Data Science': 'bg-amber-500/20 text-amber-400',
      'Web Dev': 'bg-cyan-500/20 text-cyan-400',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">My Library</h1>
            <p className="text-xs text-slate-400">Manage your uploaded materials</p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Files</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: FolderOpen, value: files.length, label: 'Total Files', color: 'violet' },
          { icon: CheckCircle, value: files.filter(f => f.status === 'ready').length, label: 'Ready', color: 'emerald' },
          { icon: FileText, value: `${files.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(1)} MB`, label: 'Total Size', color: 'amber' },
          { icon: Folder, value: categories.length - 1, label: 'Categories', color: 'purple' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 text-${color}-400`} />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-white truncate">{value}</p>
              <p className="text-[10px] sm:text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Files */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-medium text-white mb-1 truncate">{file.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{file.size}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(file.category)}`}>
                  {file.category}
                </span>
                <span className="text-xs text-slate-500">
                  {file.uploadedAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-700">
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-700">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Size</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="text-white font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{file.size}</td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {file.uploadedAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteFile(file.id)}
                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Upload Files</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-violet-400 animate-bounce" />
                  </div>
                  <p className="text-white font-medium mb-2">Uploading...</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{uploadProgress}%</p>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer"
                  onClick={handleUpload}
                >
                  <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-violet-400" />
                  </div>
                  <p className="text-slate-300 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">PDF, TXT, DOC files up to 50MB</p>
                </div>
              )}
            </div>

            {!isUploading && (
              <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                >
                  Start Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No files found</h3>
          <p className="text-slate-400 mb-6">Upload your first document to get started</p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
}
