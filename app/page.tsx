'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  PenLine,
  Search,
  Plus,
  Trash2,
  Check,
  Menu,
  X,
  FileText,
  Users,
  FolderOpen,
  Cloud,
  Shield,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Monitor,
  Tablet,
  Bold,
  Italic,
  List,
  ListOrdered,
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
    { label: 'Funciones', href: '#features' },
    { label: 'Precios', href: '#pricing' },
    { label: 'Acerca de', href: '#about' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00A896] flex items-center justify-center">
                <PenLine className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-semibold text-[#173B3A] text-base">QA Build Directo Notas</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#6B7C7A] hover:text-[#173B3A] transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <Button
                onClick={scrollToApp}
                className="bg-[#00A896] hover:bg-[#00917F] text-white text-sm px-5 py-2"
              >
                Comenzar gratis
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
          className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#6B7C7A] hover:text-[#173B3A] transition-colors py-2"
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
            >
              Comenzar gratis
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-16 left-8 w-16 h-16 rounded-full border-2 border-[#00A896]/20" />
        <div className="absolute top-24 left-20 w-3 h-3 rounded-full bg-[#00A896]/30" />
        <div className="absolute top-32 right-16 w-20 h-20 rounded-full border-2 border-[#00A896]/15" />
        <div className="absolute top-20 right-24 w-4 h-4 rounded-full bg-[#00A896]/40" />
        <div className="absolute bottom-32 left-16 w-10 h-10 rounded-full border-2 border-[#00A896]/20" />
        <div className="absolute bottom-24 right-12 w-6 h-6 rounded-full bg-[#00A896]/20" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#173B3A] mb-6 leading-tight">
            Notas simples.<br />Ideas que permanecen.
          </h1>
          <p className="text-[#6B7C7A] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            QA Build Directo Notas es tu espacio de escritura minimalista para capturar ideas, organizar pensamientos y mantenerte enfocado.
          </p>
          <Button
            onClick={scrollToApp}
            className="bg-[#00A896] hover:bg-[#00917F] text-white px-8 py-6 text-base"
          >
            Comenzar gratis
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="mt-4 text-sm text-[#6B7C7A] flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#00A896]" />
            Gratis para siempre. No se requiere tarjeta.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-4 border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">25K+</div>
              <div className="text-sm text-[#6B7C7A]">Usuarios activos</div>
              <div className="text-xs text-[#9CA3AF]">Personas que escriben cada día</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">120K+</div>
              <div className="text-sm text-[#6B7C7A]">Notas creadas</div>
              <div className="text-xs text-[#9CA3AF]">Ideas capturadas y organizadas</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">98%</div>
              <div className="text-sm text-[#6B7C7A]">Satisfacción</div>
              <div className="text-xs text-[#9CA3AF]">Usuarios que recomiendan</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00A896]" />
              </div>
              <div className="font-heading font-bold text-2xl text-[#173B3A]">100%</div>
              <div className="text-sm text-[#6B7C7A]">Privado y seguro</div>
              <div className="text-xs text-[#9CA3AF]">Tus notas, solo tuyas</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Numbered Steps with Dotted Lines */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#00A896] text-sm font-medium tracking-wider uppercase">Cómo funciona</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mt-2">
              Empieza en 3 simples pasos
            </h2>
          </div>

          {/* Steps with dotted line connector */}
          <div className="relative">
            {/* Dotted line connector - hidden on mobile */}
            <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-2/3 h-0.5 border-t-2 border-dashed border-[#E5E7EB]" />

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#00A896] bg-white flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-[#00A896]">1</span>
                  </div>
                </div>
                <div className="w-14 h-14 mx-auto mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <PenLine className="w-6 h-6 text-[#00A896]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#173B3A] mb-2">Crea tu nota</h3>
                <p className="text-[#6B7C7A] text-sm">
                  Abre un lienzo en blanco y empieza a escribir sin distracciones.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#00A896] bg-white flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-[#00A896]">2</span>
                  </div>
                </div>
                <div className="w-14 h-14 mx-auto mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-[#00A896]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#173B3A] mb-2">Organiza a tu manera</h3>
                <p className="text-[#6B7C7A] text-sm">
                  Usa carpetas, etiquetas y búsqueda para tener todo en orden.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#00A896] bg-white flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-[#00A896]">3</span>
                  </div>
                </div>
                <div className="w-14 h-14 mx-auto mb-4 bg-[#00A896]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#00A896]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#173B3A] mb-2">Encuentra y actúa</h3>
                <p className="text-[#6B7C7A] text-sm">
                  Recupera tus ideas al instante y convierte notas en acción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 px-4 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#00A896] text-sm font-medium tracking-wider uppercase">Funciones que amarás</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mt-2">
              Diseñado para pensar mejor
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Large left card */}
            <div className="md:row-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col">
              <div className="w-10 h-10 mb-4 flex items-center justify-center">
                <PenLine className="w-5 h-5 text-[#173B3A]" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#173B3A] mb-2">Escritura sin distracciones</h3>
              <p className="text-[#6B7C7A] text-sm mb-6">
                Un editor limpio y minimalista para que puedas concentrarte en lo que realmente importa.
              </p>
              <div className="mt-auto bg-[#F8F9FA] rounded-xl p-4">
                <div className="flex gap-2 mb-3">
                  <div className="w-7 h-7 rounded bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <Bold className="w-3.5 h-3.5 text-[#6B7C7A]" />
                  </div>
                  <div className="w-7 h-7 rounded bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <Italic className="w-3.5 h-3.5 text-[#6B7C7A]" />
                  </div>
                  <div className="w-7 h-7 rounded bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <List className="w-3.5 h-3.5 text-[#6B7C7A]" />
                  </div>
                  <div className="w-7 h-7 rounded bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <ListOrdered className="w-3.5 h-3.5 text-[#6B7C7A]" />
                  </div>
                </div>
                <p className="text-[#173B3A] text-sm font-medium">Una mente clara escribe mejores ideas.</p>
              </div>
            </div>

            {/* Top right cards */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center shrink-0">
                  <FolderOpen className="w-4 h-4 text-[#6B7C7A]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base text-[#173B3A]">Organización flexible</h3>
                  <p className="text-[#6B7C7A] text-sm mt-1">
                    Carpetas, etiquetas y favoritos para que encuentres todo al instante.
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F9FA] rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#6B7C7A]"><FolderOpen className="w-3 h-3" /> Trabajo</div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[#00A896]"><FolderOpen className="w-3 h-3" /> Ideas</span><span className="text-xs bg-[#00A896]/10 text-[#00A896] px-2 py-0.5 rounded">12</span></div>
                <div className="flex items-center gap-2 text-[#6B7C7A]"><FolderOpen className="w-3 h-3" /> Personal</div>
                <div className="flex items-center gap-2 text-[#6B7C7A]"><FolderOpen className="w-3 h-3" /> Inspiración</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4 text-[#6B7C7A]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base text-[#173B3A]">Búsqueda rápida</h3>
                  <p className="text-[#6B7C7A] text-sm mt-1">
                    Encuentra cualquier nota por título, contenido o etiqueta en segundos.
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F9FA] rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#9CA3AF] bg-white rounded px-2 py-1.5 border border-[#E5E7EB]">
                  <Search className="w-3 h-3" /> Buscar notas...
                </div>
                <div className="flex items-center justify-between text-[#6B7C7A]"><span>Plan del proyecto</span><span className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] px-2 py-0.5 rounded">Trabajo</span></div>
                <div className="flex items-center justify-between text-[#6B7C7A]"><span>Ideas para el blog</span><span className="text-xs bg-[#00A896]/10 text-[#00A896] px-2 py-0.5 rounded">Ideas</span></div>
              </div>
            </div>

            {/* Bottom right cards */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center shrink-0">
                  <Cloud className="w-4 h-4 text-[#6B7C7A]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base text-[#173B3A]">Sincronización total</h3>
                  <p className="text-[#6B7C7A] text-sm mt-1">
                    Tus notas siempre contigo. En todos tus dispositivos.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Smartphone className="w-6 h-6 text-[#6B7C7A]" />
                <Monitor className="w-8 h-8 text-[#173B3A]" />
                <Tablet className="w-6 h-6 text-[#6B7C7A]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#6B7C7A]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base text-[#173B3A]">Privado y seguro</h3>
                  <p className="text-[#6B7C7A] text-sm mt-1">
                    Cifrado de extremo a extremo. Tus notas son solo tuyas.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4">
                <span className="inline-flex items-center gap-2 text-sm text-[#00A896] bg-[#00A896]/10 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4" /> 100% Privado
                </span>
              </div>
            </div>

            {/* Full width bottom card */}
            <div className="md:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-start gap-3 md:w-1/3">
                  <div className="w-10 h-10 bg-[#00A896]/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#00A896]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base text-[#173B3A]">Convierte ideas en acción</h3>
                    <p className="text-[#6B7C7A] text-sm mt-1">
                      Marca tareas, añade recordatorios y convierte notas en tu próximo paso.
                    </p>
                  </div>
                </div>
                <div className="md:w-2/3 bg-[#F8F9FA] rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full border-2 border-[#E5E7EB]" />
                      <span className="text-[#6B7C7A]">Planificar lanzamiento</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-[#00A896] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[#173B3A]">Escribir contenido</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full border-2 border-[#E5E7EB]" />
                      <span className="text-[#6B7C7A]">Revisar estrategia</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span className="text-[#00A896]">Hoy</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span className="text-[#9CA3AF]">Mañana</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span className="text-[#9CA3AF]">Viernes</span>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* CTA Section */}
      <section id="pricing" className="py-20 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border-2 border-[#00A896]/15" />
        <div className="absolute bottom-20 right-8 w-4 h-4 rounded-full bg-[#00A896]/30" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 bg-[#00A896]/10 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#00A896]" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#173B3A] mb-4">
            Listo para ordenar tus ideas
          </h2>
          <p className="text-[#6B7C7A] text-lg mb-8">
            Únete a miles de personas que ya escriben mejor cada día.
          </p>
          <Button
            onClick={scrollToApp}
            className="bg-[#00A896] hover:bg-[#00917F] text-white px-8 py-6 text-base"
          >
            Comenzar gratis
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="mt-4 text-sm text-[#6B7C7A] flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#00A896]" />
            Gratis para siempre. Sin tarjeta.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 bg-[#173B3A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#00A896] flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading font-semibold text-white text-base">QA Build Directo Notas</span>
              </div>
              <p className="text-[#A0B0AE] text-sm max-w-xs mb-6">
                La forma más simple y elegante de capturar, organizar y dar vida a tus ideas.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#00A896] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4 text-sm">Producto</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Funciones</a></li>
                <li><a href="#pricing" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Precios</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Novedades</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4 text-sm">Recursos</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Ayuda</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Guías</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Atajos de teclado</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Estado del sistema</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-4 text-sm">Compañía</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#about" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Acerca de</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-[#A0B0AE] hover:text-[#00A896] transition-colors">Términos</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A0B0AE] text-sm">
              © {new Date().getFullYear()} QA Build Directo Notas. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
