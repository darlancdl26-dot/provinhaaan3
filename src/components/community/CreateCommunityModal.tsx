import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCommunities } from '../../hooks/useCommunities';
import toast from 'react-hot-toast';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community?: {
    id: string;
    title: string;
    description: string;
    category: string;
    image_url: string | null;
    status: 'active' | 'ended' | 'featured';
    rules: string | null;
  };
}

const categories = [
  { value: 'tecnologia', label: '💻 Tecnologia' },
  { value: 'musica', label: '🎵 Música' },
  { value: 'arte', label: '🎨 Arte' },
  { value: 'games', label: '🎮 Games' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'culinaria', label: '🍳 Culinária' },
  { value: 'viagens', label: '✈️ Viagens' },
  { value: 'moda', label: '👗 Moda' },
  { value: 'ciencia', label: '🔬 Ciência' },
  { value: 'humor', label: '😂 Humor' },
  { value: 'outros', label: '🌐 Outros' },
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  community,
}) => {
  const { createCommunity, updateCommunity } = useCommunities();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: community?.title || '',
    description: community?.description || '',
    category: community?.category || 'tecnologia',
    image_url: community?.image_url || '',
    status: community?.status || 'active' as 'active' | 'ended' | 'featured',
    rules: community?.rules || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    setLoading(true);
    try {
      if (community) {
        const { error } = await updateCommunity(community.id, {
          ...form,
          image_url: form.image_url || null,
          rules: form.rules || null,
        });
        if (error) throw error;
        toast.success('Comunidade atualizada!');
      } else {
        const { error } = await createCommunity({
          ...form,
          image_url: form.image_url || undefined,
          rules: form.rules || undefined,
        });
        if (error) throw error;
        toast.success('Comunidade criada!');
      }
      onClose();
    } catch {
      toast.error('Erro ao salvar comunidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={community ? 'Editar Comunidade' : 'Criar Comunidade'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da comunidade *"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          placeholder="Ex: Devs do Brasil"
          maxLength={80}
        />

        <Textarea
          label="Descrição *"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Sobre o que é essa comunidade?"
          rows={3}
          maxLength={500}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Categoria *</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="nexus-input"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value as 'active' | 'ended' | 'featured' }))}
              className="nexus-input"
            >
              <option value="active">✅ Ativo</option>
              <option value="featured">⭐ Destaque</option>
              <option value="ended">🔒 Encerrado</option>
            </select>
          </div>
        </div>

        <Input
          label="URL da imagem (opcional)"
          value={form.image_url}
          onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
          placeholder="https://..."
        />

        <Textarea
          label="Regras (opcional)"
          value={form.rules}
          onChange={e => setForm(p => ({ ...p, rules: e.target.value }))}
          placeholder="Liste as regras da sua comunidade..."
          rows={3}
          maxLength={1000}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="cyan" loading={loading} fullWidth>
            {community ? 'Salvar alterações' : 'Criar comunidade'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
