'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState(() => {
        // Verifica se estamos no cliente antes de acessar cookies
        if (typeof window !== 'undefined') {
            const cookieRole = Cookies.get('userRole');
            return cookieRole || 'student';
        }
        // No servidor, retorna o valor padrão
        return 'student';
    });

    // Sincroniza com o cookie quando o componente monta no cliente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookieRole = Cookies.get('userRole');
            if (cookieRole && cookieRole !== userRole) {
                setUserRole(cookieRole);
            }
        }
    }, []);

    // Quando a role mudar, atualiza o cookie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            Cookies.set('userRole', userRole, { expires: 7 }); // Cookie expira em 7 dias
        }
    }, [userRole]);

    // Função para atualizar a role do usuário
    const updateUserRole = (newRole) => {
        setUserRole(newRole);
        if (typeof window !== 'undefined') {
            Cookies.set('userRole', newRole, { expires: 7 });
        }
    };

    return (
        <UserContext.Provider value={{ userRole, setUserRole, updateUserRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}