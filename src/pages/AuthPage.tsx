import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User, AtSign, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  // Clear confirm password when primary password is shorter than 8
  useEffect(() => {
    if (form.password.length < 8 && form.confirmPassword) {
      setForm(p => ({ ...p, confirmPassword: '' }));
    }
  }, [form.password]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email inválido';
    
    if (mode !== 'reset') {
      if (!form.password) errs.password = 'Senha obrigatória';
      else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    }
    
    if (mode === 'signup') {
      if (!form.fullName) errs.fullName = 'Nome obrigatório';
      if (!form.username) errs.username = 'Username obrigatório';
      else if (!/^[a-z0-9_]+$/.test(form.username)) errs.username = 'Apenas letras minúsculas, números e _';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.success('Bem-vindo de volta!');
          navigate('/feed');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(form.email, form.password, form.username, form.fullName);
        if (error) {
          if (error.message?.includes('already')) {
            toast.error('Email já cadastrado');
          } else {
            toast.error('Erro no cadastro. Tente novamente.');
          }
        } else {
          toast.success('Conta criada! Verifique seu email.');
          setMode('login');
        }
      } else {
        const { error } = await resetPassword(form.email);
        if (error) {
          toast.error('Erro ao enviar email');
        } else {
          toast.success('Email de recuperação enviado!');
          setMode('login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'Entrar no Trend Hub',
    signup: 'Criar conta',
    reset: 'Recuperar senha',
  };

  const subtitles = {
    login: 'Bem-vindo de volta! Acesse sua conta.',
    signup: 'Junte-se à comunidade. É grátis!',
    reset: 'Informe seu email para recuperar o acesso.',
  };

  return (
    <div className="min-h-screen bg-[#0F122A] flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#131629] to-[#0F122A] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Content */}
          <div className="relative z-10 max-w-md text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl neon-cyan">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black gradient-text mb-4">Trend Hub</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A rede social para quem quer se conectar com comunidades, trends e desafios criativos.
            </p>
          </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Trend Hub</span>
          </div>

          {/* Form card */}
          <div className="bg-[#131629] border border-[#2a2f52] rounded-3xl p-8">
            {/* Back button for reset */}
            {mode === 'reset' && (
              <button
                onClick={() => setMode('login')}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            )}

            <h2 className="text-2xl font-bold text-white mb-1">{titles[mode]}</h2>
            <p className="text-slate-400 text-sm mb-8">{subtitles[mode]}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <Input
                    label="Nome completo"
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Seu nome"
                    error={errors.fullName}
                  />
                  <Input
                    label="Username"
                    value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                    placeholder="seu_username"
                    error={errors.username}
                  />
                </>
              )}

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="seu@email.com"
                error={errors.email}
                
              />

              {mode !== 'reset' && (
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  error={errors.password}
                  
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              )}

              {mode === 'signup' && (
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${
                    form.password.length >= 8
                      ? 'max-h-40 opacity-100 translate-y-0'
                      : 'max-h-0 opacity-0 -translate-y-2'
                  }`}
                >
                  <Input
                    label="Confirmar senha"
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar email'}
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center">
              {mode === 'login' ? (
                <p className="text-sm text-slate-400">
                  Não tem conta?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p className="text-sm text-slate-400">
                  Já tem conta?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Entrar
                  </button>
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Ao continuar, você concorda com os{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Termos de Uso</span>{' '}
            e{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Política de Privacidade</span>
          </p>
        </div>
      </div>
    </div>
  );
};
