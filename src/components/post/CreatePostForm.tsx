import React, { useState, useRef } from 'react';
import { Image, Video, Type, X, Send, Globe, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useCommunities } from '../../hooks/useCommunities';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabaseClient';

interface CreatePostFormProps {
  onSubmit: (data: {
    content: string;
    type: 'text' | 'image' | 'video';
    media_url?: string;
    community_id?: string;
  }) => Promise<{ error: Error | null }>;
  communityId?: string;
  placeholder?: string;
}

type PostType = 'text' | 'image' | 'video';

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSubmit,
  communityId,
  placeholder = "O que está acontecendo?",
}) => {
  const { profile } = useAuth();
  const { myCommunities } = useCommunities();
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || '');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow empty description if there's a media URL or an uploaded file
    if (!content.trim() && !mediaUrl.trim() && !selectedFile) return;
    setLoading(true);
    try {
      let finalMediaUrl = mediaUrl.trim() || undefined;
      let finalType = type;

      // If a file is selected, upload it to Supabase Storage
      if (selectedFile) {
        setUploadingFile(true);
        try {
          const ext = selectedFile.name.split('.').pop();
          const path = `posts/${profile?.id}/${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('posts').upload(path, selectedFile, { upsert: true });
          if (uploadError) throw uploadError;
          const { data: urlData } = await supabase.storage.from('posts').getPublicUrl(path);
          finalMediaUrl = urlData.publicUrl;
          finalType = selectedFile.type.startsWith('image') ? 'image' : selectedFile.type.startsWith('video') ? 'video' : type;
        } catch (err) {
          console.error('Upload error:', err);
          const errAny = err as any;
          const message = errAny?.message || String(errAny);
          // Detect common Supabase Storage error for missing bucket
          if (message?.toLowerCase().includes('bucket not found') || errAny?.status === 400) {
            toast.error('Bucket "posts" não encontrado no Supabase. Crie o bucket "posts" no painel (Storage → Create bucket) e torne-o público.');
          } else {
            toast.error('Erro ao enviar arquivo. Tente novamente.');
          }
          setUploadingFile(false);
          setLoading(false);
          return;
        } finally {
          setUploadingFile(false);
        }
      }

      const { error } = await onSubmit({
        content: content.trim(),
        type: finalType,
        media_url: finalMediaUrl,
        community_id: selectedCommunity || undefined,
      });
      if (error) {
        toast.error('Erro ao publicar. Tente novamente.');
      } else {
        setContent('');
        setMediaUrl('');
        setType('text');
        setSelectedCommunity(communityId || '');
        setExpanded(false);
        toast.success('Publicado com sucesso!');
      }
    } finally {
      setLoading(false);
    }
  };

  const typeButtons: { type: PostType; icon: React.ReactNode; label: string }[] = [
    { type: 'text', icon: <Type className="w-4 h-4" />, label: 'Texto' },
    { type: 'image', icon: <Image className="w-4 h-4" />, label: 'Imagem' },
    { type: 'video', icon: <Video className="w-4 h-4" />, label: 'Vídeo' },
  ];

  return (
    <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-4">
      <div className="flex gap-3">
        <Avatar src={profile?.avatar_url} size="md" ring />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder={placeholder}
            className="nexus-input resize-none min-h-[48px] text-sm"
            rows={expanded ? 3 : 1}
            maxLength={1000}
          />

          {expanded && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {/* Type selector */}
              <div className="flex gap-2">
                {typeButtons.map(btn => (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setType(btn.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      type === btn.type
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Media URL */}
              {(type === 'image' || type === 'video') && (
                <div className="relative">
                  <input
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder={type === 'image' ? 'URL da imagem...' : 'URL do vídeo (YouTube, etc)...'}
                    className="nexus-input text-sm pr-12"
                  />
                  {mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaUrl('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* File upload */}
              <div>
                <input
                  ref={el => (fileRef.current = el)}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0] || null;
                    setSelectedFile(f);
                    if (f) {
                      // If file is image, set preview via mediaUrl for immediate preview
                      if (f.type.startsWith('image')) {
                        const url = URL.createObjectURL(f);
                        setMediaUrl(url);
                        setType('image');
                      } else if (f.type.startsWith('video')) {
                        const url = URL.createObjectURL(f);
                        setMediaUrl(url);
                        setType('video');
                      }
                    }
                  }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/3 hover:bg-white/5"
                    disabled={uploadingFile}
                  >
                    <Upload className="w-4 h-4" />
                    Upload arquivo
                  </button>
                  {selectedFile && (
                    <div className="text-xs text-slate-400">{selectedFile.name}</div>
                  )}
                </div>
              </div>

              {/* Community selector */}
              {!communityId && myCommunities.length > 0 && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select
                    value={selectedCommunity}
                    onChange={e => setSelectedCommunity(e.target.value)}
                    className="nexus-input text-sm flex-1"
                  >
                    <option value="">Feed geral</option>
                    {myCommunities.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Image preview */}
              {type === 'image' && mediaUrl && (
                <div className="rounded-xl overflow-hidden h-32">
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{content.length}/1000</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExpanded(false);
                      setContent('');
                      setMediaUrl('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="cyan"
                    size="sm"
                    loading={loading}
                    icon={<Send className="w-3.5 h-3.5" />}
                    onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>}
                    disabled={!content.trim() && !mediaUrl && !selectedFile}
                  >
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
