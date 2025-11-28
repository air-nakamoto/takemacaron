import React from 'react'
import { useAuth } from '../AuthContext'
import { LogIn, LogOut, User } from 'lucide-react'

export const LoginButton: React.FC = () => {
    const { user, signInWithGoogle, signOut, loading } = useAuth()

    if (loading) {
        return (
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-rose-400 rounded-full animate-spin" />
            </div>
        )
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                    <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center">
                        <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        {user.email?.split('@')[0] || 'User'}
                    </span>
                </div>
                <button
                    onClick={signOut}
                    className="p-3 bg-white text-slate-400 hover:text-rose-400 rounded-full shadow-sm border border-slate-100 transition-all"
                    aria-label="ログアウト"
                    title="ログアウト"
                >
                    <LogOut size={20} />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-rose-500 font-bold rounded-full shadow-sm border border-rose-200 transition-all"
            aria-label="Googleでログイン"
        >
            <LogIn size={18} />
            <span className="hidden md:inline">ログイン</span>
        </button>
    )
}
