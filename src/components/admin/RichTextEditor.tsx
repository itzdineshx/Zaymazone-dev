import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  Maximize,
  Minimize,
  Eye,
  EyeOff
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  showPreview?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  height = 300,
  readOnly = false,
  showPreview = false
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState('1 min read');
  const quillRef = useRef<ReactQuill>(null);

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'script', 'code-block', 'align'
  ];

  // Calculate word count and reading time
  useEffect(() => {
    const text = value.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    
    // Average reading speed is 200 words per minute
    const minutes = Math.ceil(words / 200);
    setReadTime(`${minutes} min read`);
  }, [value]);

  const handleChange = (content: string) => {
    onChange(content);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const insertTemplate = (template: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, template);
      }
    }
  };

  const editorStyle = {
    height: isFullscreen ? 'calc(100vh - 200px)' : `${height}px`
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background p-4 overflow-auto"
    : "relative";

  return (
    <div className={containerClass}>
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {wordCount} words
            </Badge>
            <Badge variant="outline" className="text-xs">
              {readTime}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePreview}
                className="h-8 px-2"
              >
                {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 px-2"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Quick Templates */}
        {!readOnly && (
          <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
            <span className="text-sm text-muted-foreground mr-2">Quick Insert:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertTemplate('\n## Heading\n\n')}
              className="h-7 text-xs"
            >
              <Bold className="h-3 w-3 mr-1" />
              Heading
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertTemplate('\n> Quote text here\n\n')}
              className="h-7 text-xs"
            >
              <Quote className="h-3 w-3 mr-1" />
              Quote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertTemplate('\n```\nCode here\n```\n\n')}
              className="h-7 text-xs"
            >
              <Code className="h-3 w-3 mr-1" />
              Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertTemplate('\n- List item 1\n- List item 2\n- List item 3\n\n')}
              className="h-7 text-xs"
            >
              <List className="h-3 w-3 mr-1" />
              List
            </Button>
          </div>
        )}

        {/* Editor/Preview Content */}
        <div className="relative">
          {previewMode ? (
            <div 
              className="prose prose-sm max-w-none p-4 overflow-auto"
              style={{ minHeight: `${height}px` }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={value}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              readOnly={readOnly}
              style={editorStyle}
            />
          )}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="flex items-center justify-between p-3 border-t bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Ctrl+B: Bold</span>
              <span>Ctrl+I: Italic</span>
              <span>Ctrl+K: Link</span>
            </div>
            <div>
              Auto-saved
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// Enhanced version with additional features
export function AdvancedRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  height = 400
}: RichTextEditorProps) {
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const advancedModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  };

  return (
    <div className="space-y-4">
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        showPreview={true}
      />
      
      {/* AI Writing Assistant */}
      <Card className="p-4 border-dashed">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">AI Writing Assistant</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI(!showAI)}
          >
            {showAI ? 'Hide' : 'Show'} AI Tools
          </Button>
        </div>
        
        {showAI && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe what you want to write about..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <Button size="sm" variant="outline">
                Generate
              </Button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">Improve Writing</Button>
              <Button variant="outline" size="sm">Make Shorter</Button>
              <Button variant="outline" size="sm">Make Longer</Button>
              <Button variant="outline" size="sm">Change Tone</Button>
              <Button variant="outline" size="sm">Fix Grammar</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}