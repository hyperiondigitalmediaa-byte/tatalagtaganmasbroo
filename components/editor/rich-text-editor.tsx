"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  List, 
  ListOrdered, 
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  RemoveFormatting
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // Disable default code block
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Tulis konten artikel di sini..."
      })
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[400px] max-w-none p-4 bg-white"
      }
    }
  })

  if (!editor) {
    return null
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'content')

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          editor.chain().focus().setImage({ src: data.url }).run()
        } else {
          alert('Gagal upload gambar')
        }
      } catch (error) {
        alert('Terjadi kesalahan saat upload')
      }
    }
    
    input.click()
  }

  const addLink = () => {
    const url = window.prompt("Masukkan URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run()
  }

  return (
    <div className="border rounded-lg flex flex-col">
      {/* Toolbar - Fixed at top */}
      <div className="border-b bg-white p-2 space-y-2 shadow-sm flex-shrink-0">
        {/* Row 1: Text Formatting */}
        <div className="flex flex-wrap gap-1 items-center">
          {/* Heading Dropdown */}
          <Select
            value={
              editor.isActive("heading", { level: 1 }) ? "h1" :
              editor.isActive("heading", { level: 2 }) ? "h2" :
              editor.isActive("heading", { level: 3 }) ? "h3" :
              editor.isActive("heading", { level: 4 }) ? "h4" :
              editor.isActive("heading", { level: 5 }) ? "h5" :
              editor.isActive("heading", { level: 6 }) ? "h6" :
              "paragraph"
            }
            onValueChange={(value) => {
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run()
              } else {
                const level = parseInt(value.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6
                editor.chain().focus().toggleHeading({ level }).run()
              }
            }}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
              <SelectItem value="h4">Heading 4</SelectItem>
              <SelectItem value="h5">Heading 5</SelectItem>
              <SelectItem value="h6">Heading 6</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Basic Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(editor.isActive("bold") && "bg-slate-200")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(editor.isActive("italic") && "bg-slate-200")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(editor.isActive("underline") && "bg-slate-200")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(editor.isActive("strike") && "bg-slate-200")}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Text Color */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setColor("#000000")}
              title="Black"
              className="w-8 h-8 p-0"
            >
              <div className="w-4 h-4 rounded bg-black border" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setColor("#ef4444")}
              title="Red"
              className="w-8 h-8 p-0"
            >
              <div className="w-4 h-4 rounded bg-red-500 border" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setColor("#3b82f6")}
              title="Blue"
              className="w-8 h-8 p-0"
            >
              <div className="w-4 h-4 rounded bg-blue-500 border" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setColor("#22c55e")}
              title="Green"
              className="w-8 h-8 p-0"
            >
              <div className="w-4 h-4 rounded bg-green-500 border" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Highlight */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setHighlight("#fef08a")}
            className={cn(editor.isActive("highlight") && "bg-slate-200")}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 2: Lists & Alignment */}
        <div className="flex flex-wrap gap-1 items-center">
          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(editor.isActive("bulletList") && "bg-slate-200")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(editor.isActive("orderedList") && "bg-slate-200")}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn(editor.isActive({ textAlign: "left" }) && "bg-slate-200")}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn(editor.isActive({ textAlign: "center" }) && "bg-slate-200")}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn(editor.isActive({ textAlign: "right" }) && "bg-slate-200")}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={cn(editor.isActive({ textAlign: "justify" }) && "bg-slate-200")}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Blocks */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(editor.isActive("blockquote") && "bg-slate-200")}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(editor.isActive("codeBlock") && "bg-slate-200")}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Media */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* Clear Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-slate-300 mx-1" />

          {/* History */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content - Scrollable Area */}
      <div className="overflow-y-auto max-h-[600px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
