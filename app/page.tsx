'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  PenLine,
  Search,
  Plus,
  Trash2,
  Check,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<{ id: number; title: string; content: string; version: number } | null>(null);
  const saveVersionRef = useRef(0);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nueva nota', content: '' }),
      });
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setTitle(newNote.title);
      setContent(newNote.content || '');
      saveVersionRef.current += 1;
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const executeSave = useCallback(async (id: number, noteTitle: string, noteContent: string, version: number) => {
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noteTitle, content: noteContent }),
      });
      const updatedNote = await res.json();

      if (version < saveVersionRef.current) {
        return;
      }

      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updatedNote : n)).sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      );

      if (pendingSaveRef.current?.id === id) {
        setSelectedNote(updatedNote);
      }

      setSaveStatus('saved');
      setTimeout(() => {
        if (saveVersionRef.current === version) {
          setSaveStatus('idle');
        }
      }, 1500);
    } catch (error) {
      console.error('Error updating note:', error);
      setSaveStatus('error');
      pendingSaveRef.current = { id, title: noteTitle, content: noteContent, version };
    }
  }, []);

  const scheduleSave = useCallback((id: number, noteTitle: string, noteContent: string) => {
    saveVersionRef.current += 1;
    const currentVersion = saveVersionRef.current;
    pendingSaveRef.current = { id, title: noteTitle, content: noteContent, version: currentVersion };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSaveStatus('saving');

    debounceTimerRef.current = setTimeout(() => {
      executeSave(id, noteTitle, noteContent, currentVersion);
    }, 500);
  }, [executeSave]);

  const retrySave = useCallback(() => {
    if (pendingSaveRef.current) {
      const { id, title: noteTitle, content: noteContent, version } = pendingSaveRef.current;
      executeSave(id, noteTitle, noteContent, version);
    }
  }, [executeSave]);

  const deleteNote = async (id: number) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
        saveVersionRef.current += 1;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (selectedNote) {
      scheduleSave(selectedNote.id, newTitle, content);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (selectedNote) {
      scheduleSave(selectedNote.id, title, newContent);
    }
  };

  const selectNote = (note: Note) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    saveVersionRef.current += 1;
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content || '');
    setSaveStatus('idle');
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00A896] flex items-center justify-center">
                <PenLine className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-semibold text-[#173B3A] text-base">QA Build Directo Notas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notes App Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] overflow-hidden">
            <div className="grid md:grid-cols-[320px,1fr] min-h-[calc(100vh-140px)]">
              {/* Sidebar */}
              <div className="border-r border-[#E5E7EB] flex flex-col">
                <div className="p-4 border-b border-[#E5E7EB]">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7C7A]" />
                    <Input
                      placeholder="Buscar notas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#F8F9FA] border-[#E5E7EB]"
                    />
                  </div>
                  <Button
                    onClick={createNote}
                    disabled={isSaving}
                    className="w-full bg-[#00A896] hover:bg-[#00917F] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Nota
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-[#6B7C7A]">Cargando notas...</div>
                  ) : filteredNotes.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-[#6B7C7A]" />
                      </div>
                      <p className="text-[#6B7C7A] mb-2">
                        {searchQuery ? 'No se encontraron notas' : 'Aún no tienes notas'}
                      </p>
                      {!searchQuery && (
                        <p className="text-sm text-[#6B7C7A]">
                          Crea tu primera nota para comenzar
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E5E7EB]">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => selectNote(note)}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedNote?.id === note.id
                              ? 'bg-[#00A896]/5 border-l-2 border-[#00A896]'
                              : 'hover:bg-[#F8F9FA]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#173B3A] truncate">
                                {note.title || 'Sin título'}
                              </h3>
                              <p className="text-sm text-[#6B7C7A] truncate mt-1">
                                {note.content || 'Sin contenido'}
                              </p>
                              <p className="text-xs text-[#6B7C7A] mt-2">
                                {formatDate(note.updated_at)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="p-1.5 text-[#6B7C7A] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              aria-label="Eliminar nota"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="flex flex-col">
                {selectedNote ? (
                  <>
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                      <Input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Título de la nota"
                        className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
                      />
                      <div className="flex items-center gap-2">
                        {saveStatus === 'saving' && (
                          <span className="text-xs text-[#6B7C7A]">Guardando...</span>
                        )}
                        {saveStatus === 'saved' && (
                          <span className="text-xs text-[#00A896] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Guardado
                          </span>
                        )}
                        {saveStatus === 'error' && (
                          <button
                            onClick={retrySave}
                            className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600"
                          >
                            <AlertCircle className="w-3 h-3" /> Error
                            <RefreshCw className="w-3 h-3 ml-1" /> Reintentar
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <Textarea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Escribe el contenido de tu nota..."
                        className="w-full h-full min-h-[400px] border-none shadow-none focus-visible:ring-0 resize-none bg-transparent"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                        <PenLine className="w-10 h-10 text-[#00A896]" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-[#173B3A] mb-2">
                        Selecciona o crea una nota
                      </h3>
                      <p className="text-[#6B7C7A] mb-4">
                        Haz clic en una nota existente o crea una nueva para comenzar
                      </p>
                      <Button
                        onClick={createNote}
                        className="bg-[#00A896] hover:bg-[#00917F] text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Nota
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
