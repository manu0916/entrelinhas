import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandSymbol } from '../../components/illustrations/BrandSymbol';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Por favor, digite a senha de acesso.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await login(password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Senha incorreta. Verifique suas credenciais de administrador.');
      }
    } catch {
      setError('Ocorreu um erro ao verificar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-reading rounded-2xl border border-border-reading shadow-modal p-8 space-y-6">
        <div className="text-center space-y-3">
          <BrandSymbol className="w-12 h-12 mx-auto" />
          <h1 className="font-serif font-bold text-2xl text-ink">
            Acesso ao Painel
          </h1>
          <p className="text-xs text-ink-muted">
            Área restrita para publicação e gestão de acervo da biblioteca digital.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-terracotta text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Senha de Administrador
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border-subtle focus:border-pine focus:outline-none text-sm text-ink"
              />
              <Lock className="w-4 h-4 text-ink-muted absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-ink-muted/80 mt-1">
              Dica: em ambiente local recém-instalado, utilize a senha padrão <strong>entrelinhas</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-pine hover:bg-pine-hover disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
