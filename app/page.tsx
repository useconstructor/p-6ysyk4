'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PenLine,
  Search,
  Plus,
  Trash2,
  Check,
  Clock,
  Shield,
  Infinity,
  Zap,
  Menu,
  X,
  FileText,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  Palette,
  ChevronRight,
  Quote,
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showApp, setShowApp] = useState(false);

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
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (id: number, updates: { title?: string; content?: string }) => {
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedNote = await res.json();
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? updatedNote : n)).sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      );
      setSelectedNote(updatedNote);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (error) {
      console.error('Error updating note:', error);
      setSaveStatus('idle');
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (selectedNote) {
      updateNote(selectedNote.id, { title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (selectedNote) {
      updateNote(selectedNote.id, { content: newContent });
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content || '');
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

  const scrollToApp = () => {
    setShowApp(true);
    setTimeout(() => {
      document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Características', href: '#features' },
    { label: 'Cómo Funciona', href: '#how-it-works' },
    { label: 'Testimonios', href: '#testimonials' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#00A896] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-[#173B3A] text-lg">NotaRápida</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#6B7C7A] hover:text-[#173B3A] transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <Button
                onClick={scrollToApp}
                className="bg-[#00A896] hover:bg-[#00917F] text-white"
              >
                Empezar a Escribir
              </Button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#173B3A]" />
              ) : (
                <Menu className="w-6 h-6 text-[#173B3A]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#6B7C7A] hover:text-[#173B3A] transition-all py-2 text-base"
                style={{ transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToApp();
              }}
              className="w-full bg-[#00A896] hover:bg-[#00917F] text-white mt-2"
              style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 60}ms` : '0ms' }}
            >
              Empezar a Escribir
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-[#00A896]/10 text-[#00A896] rounded-full text-sm font-medium mb-6">
            Sin registro, sin distracciones
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-[#173B3A] mb-6 leading-tight">
            Tu Espacio para Anotar Ideas Rápido
          </h1>
          <p className="text-lg md:text-xl text-[#6B7C7A] mb-10 max-w-2xl mx-auto">
            Crea notas al instante, búscalas en segundos. Sin registro, sin publicidad, sin distracciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToApp}
              size="lg"
              className="bg-[#00A896] hover:bg-[#00917F] text-white px-8 py-6 text-lg"
            >
              Empezar a Escribir
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              onClick={scrollToApp}
              variant="outline"
              size="lg"
              className="border-[#173B3A] text-[#173B3A] hover:bg-[#173B3A] hover:text-white px-8 py-6 text-lg"
            >
              Ver Demo
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="relative mt-16">
            <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#00A896]" />
                <div className="w-3 h-3 rounded-full bg-[#00A896]/50" />
                <div className="w-3 h-3 rounded-full bg-[#00A896]/25" />
              </div>
              <div className="w-full h-3 bg-[#F8F9FA] rounded mb-2" />
              <div className="w-3/4 h-3 bg-[#F8F9FA] rounded mb-4" />
              <div className="w-full h-2 bg-[#F8F9FA] rounded mb-1" />
              <div className="w-full h-2 bg-[#F8F9FA] rounded mb-1" />
              <div className="w-2/3 h-2 bg-[#F8F9FA] rounded" />
              <div className="absolute -right-4 top-1/2 w-8 h-8 bg-[#00A896] rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute top-8 left-1/4 w-4 h-4 bg-[#00A896]/30 rounded-full" />
            <div className="absolute bottom-8 right-1/4 w-6 h-6 bg-[#00A896]/20 rounded-full" />
            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#00A896]/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">25K+</div>
              <div className="text-sm text-[#6B7C7A]">Usuarios Activos</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">120K+</div>
              <div className="text-sm text-[#6B7C7A]">Notas Creadas</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">98%</div>
              <div className="text-sm text-[#6B7C7A]">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">100%</div>
              <div className="text-sm text-[#6B7C7A]">Privado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes App Section */}
      <section id="app-section" className={`py-16 px-4 ${showApp || notes.length > 0 ? '' : 'hidden'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-[#173B3A] mb-2">Tu Espacio de Notas</h2>
            <p className="text-[#6B7C7A]">Escribe, guarda, encuentra. Sin complicaciones.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] overflow-hidden">
            <div className="grid md:grid-cols-[320px,1fr] min-h-[600px]">
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

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
              Cómo Funciona
            </h2>
            <p className="text-[#6B7C7A] text-lg max-w-2xl mx-auto">
              Tres simples pasos para organizar tus ideas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <PenLine className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Escribe Tu Nota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Dale un título y agrega el contenido que necesites. Sin límites de caracteres.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Guarda al Instante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Tus notas se guardan automáticamente en tu navegador. Siempre disponibles.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Busca y Encuentra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Filtra por título o contenido. Encuentra lo que necesitas en un segundo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
              Características Principales
            </h2>
            <p className="text-[#6B7C7A] text-lg max-w-2xl mx-auto">
              Todo lo que necesitas, nada que no
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#E5E7EB] bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#00A896]" />
                </div>
                <CardTitle className="font-heading text-lg text-[#173B3A]">
                  Interfaz Minimalista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Diseño limpio sin elementos innecesarios. Solo tú y tus notas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#00A896]" />
                </div>
                <CardTitle className="font-heading text-lg text-[#173B3A]">
                  Búsqueda Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Escribe una palabra y filtra entre todas tus notas instantáneamente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00A896]" />
                </div>
                <CardTitle className="font-heading text-lg text-[#173B3A]">
                  Historial Local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Todas tus notas se guardan en tu dispositivo. Nada en la nube, nada en servidores ajenos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#00A896]" />
                </div>
                <CardTitle className="font-heading text-lg text-[#173B3A]">
                  Acceso Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Abre la app, empieza a escribir. Cero pasos de autenticación.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Whom (Services Cards) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
              Para Quién
            </h2>
            <p className="text-[#6B7C7A] text-lg max-w-2xl mx-auto">
              Una herramienta para todos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-14 h-14 mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Estudiantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Toma apuntes rápidos en clase. Organiza tus ideas de estudio sin distracciones.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-14 h-14 mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Profesionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Captura tareas, ideas de proyectos, recordatorios diarios en un solo lugar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-[#F8F9FA]">
              <CardHeader>
                <div className="w-14 h-14 mb-4 bg-[#00A896] rounded-2xl flex items-center justify-center">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="font-heading text-xl text-[#173B3A]">
                  Creativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7C7A]">
                  Anota inspiración, frases, conceptos cuando se te ocurran. Sin presión de perfección.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
              Lo Que Dicen Nuestros Usuarios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="pt-6">
                <Quote className="w-10 h-10 text-[#00A896]/20 mb-4" />
                <p className="text-[#173B3A] text-lg mb-6">
                  Finalmente una app de notas que no me hace perder tiempo. Escribo, guardo, listo. La uso todos los días.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00A896] to-[#00A896]/60 rounded-full flex items-center justify-center text-white font-bold">
                    MG
                  </div>
                  <div>
                    <div className="font-medium text-[#173B3A]">María García</div>
                    <div className="text-sm text-[#6B7C7A]">Ingeniera, Madrid</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="pt-6">
                <Quote className="w-10 h-10 text-[#00A896]/20 mb-4" />
                <p className="text-[#173B3A] text-lg mb-6">
                  Me encanta que sea tan simple. Sin registros, sin spam. Exactamente lo que necesitaba.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00A896] to-[#00A896]/60 rounded-full flex items-center justify-center text-white font-bold">
                    CR
                  </div>
                  <div>
                    <div className="font-medium text-[#173B3A]">Carlos Rodríguez</div>
                    <div className="text-sm text-[#6B7C7A]">Estudiante, Barcelona</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
              Acceso Completamente Gratuito
            </h2>
            <p className="text-[#6B7C7A] text-lg">
              Sin costos ocultos, sin suscripciones
            </p>
          </div>

          <Card className="border-[#00A896] border-2 bg-white max-w-md mx-auto">
            <CardHeader className="text-center pb-2">
              <div className="inline-block px-3 py-1 bg-[#00A896] text-white text-sm rounded-full mb-4">
                Gratis para siempre
              </div>
              <CardTitle className="font-heading text-4xl text-[#173B3A]">$0</CardTitle>
              <p className="text-[#6B7C7A]">por mes</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#00A896]/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#00A896]" />
                  </div>
                  <span className="text-[#173B3A]">Notas ilimitadas sin restricciones</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#00A896]/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#00A896]" />
                  </div>
                  <span className="text-[#173B3A]">Almacenamiento en tu dispositivo</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#00A896]/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#00A896]" />
                  </div>
                  <span className="text-[#173B3A]">Búsqueda rápida y eficiente</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#00A896]/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#00A896]" />
                  </div>
                  <span className="text-[#173B3A]">Interfaz en español puro</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#00A896]/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#00A896]" />
                  </div>
                  <span className="text-[#173B3A]">Uso offline sin conexión a internet</span>
                </li>
              </ul>
              <Button
                onClick={scrollToApp}
                className="w-full mt-8 bg-[#00A896] hover:bg-[#00917F] text-white py-6 text-lg"
              >
                Comenzar Ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Full */}
      <section className="py-20 px-4 bg-[#173B3A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Empieza a Organizar Tus Ideas Hoy
          </h2>
          <p className="text-[#A0B0AE] text-lg mb-8 max-w-2xl mx-auto">
            Sin registro, sin configuración. Solo abre la app y comienza a escribir.
          </p>
          <Button
            onClick={scrollToApp}
            size="lg"
            className="bg-[#00A896] hover:bg-[#00917F] text-white px-8 py-6 text-lg"
          >
            Empezar a Escribir
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-[#173B3A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-[#00A896] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-white text-lg">NotaRápida</span>
              </div>
              <p className="text-[#A0B0AE] max-w-sm mb-6">
                Tu espacio para anotar ideas rápido. Sin complicaciones, sin distracciones. La forma más simple de capturar tus pensamientos.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4">Producto</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Cómo Funciona
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Testimonios
                  </a>
                </li>
                <li>
                  <button
                    onClick={scrollToApp}
                    className="text-[#A0B0AE] hover:text-[#00A896] transition-colors"
                  >
                    Probar Ahora
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Guía de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Novedades
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0B0AE] text-sm">
              © {new Date().getFullYear()} NotaRápida. Todos los derechos reservados.
            </p>
            <p className="text-[#A0B0AE] text-sm">
              Hecho con dedicación para ti
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
